import { setCors } from '../src/lib/sanity-server.js';

function escapeHtml(str: string = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export default async function handler(req: any, res: any) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { name, email, phone, budget, type, message } = body || {};

    // Validação leiga e direta
    if (!name || !String(name).trim()) return res.status(400).json({ error: 'Me diz como te chamar (nome)' });
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) return res.status(400).json({ error: 'E-mail inválido' });
    if (!phone || !String(phone).trim()) return res.status(400).json({ error: 'Me deixa seu WhatsApp para te responder' });
    if (!type || !String(type).trim()) return res.status(400).json({ error: 'Escolha como posso te ajudar' });
    if (!message || !String(message).trim()) return res.status(400).json({ error: 'Conta um pouquinho o que você procura' });

    const toEmail = process.env.CONTACT_TO_EMAIL || process.env.CONTACT_EMAIL || 'silvia.vic2018@gmail.com';
    const fromEmail = process.env.CONTACT_FROM_EMAIL || process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    const siteUrl = process.env.VITE_SITE_URL || process.env.SITE_URL || 'https://silviahelenacorretora.com.br';

    const subject = `Novo contato site — ${String(type).slice(0, 60)} — ${String(name).slice(0, 40)}`;
    const html = `
      <div style="font-family:Inter,Arial,sans-serif;line-height:1.6;color:#2b0a14;max-width:640px;margin:0 auto;padding:24px;border:1px solid #e8d5c4;border-radius:16px">
        <h2 style="margin:0 0 12px;font-size:20px;color:#D4A373">Novo contato — Silvia Helena (site)</h2>
        <p style="margin:0 0 16px;color:#6b5b6a">Recebido em ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })} — ${escapeHtml(siteUrl)}</p>
        <table style="width:100%;border-collapse:collapse;margin:12px 0">
          <tr><td style="padding:8px 10px;border:1px solid #f0e6db;background:#fdf8f4;font-weight:600;width:160px">Nome</td><td style="padding:8px 10px;border:1px solid #f0e6db">${escapeHtml(name)}</td></tr>
          <tr><td style="padding:8px 10px;border:1px solid #f0e6db;background:#fdf8f4;font-weight:600">E-mail</td><td style="padding:8px 10px;border:1px solid #f0e6db"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
          <tr><td style="padding:8px 10px;border:1px solid #f0e6db;background:#fdf8f4;font-weight:600">WhatsApp</td><td style="padding:8px 10px;border:1px solid #f0e6db"><a href="https://wa.me/${escapeHtml(String(phone).replace(/\D/g, ''))}">${escapeHtml(phone)}</a></td></tr>
          <tr><td style="padding:8px 10px;border:1px solid #f0e6db;background:#fdf8f4;font-weight:600">Como ajudar</td><td style="padding:8px 10px;border:1px solid #f0e6db">${escapeHtml(type)}</td></tr>
          <tr><td style="padding:8px 10px;border:1px solid #f0e6db;background:#fdf8f4;font-weight:600">Faixa de valor</td><td style="padding:8px 10px;border:1px solid #f0e6db">${escapeHtml(budget || 'não informado')}</td></tr>
        </table>
        <div style="padding:14px 16px;border:1px solid #f0e6db;border-radius:12px;background:#fff8f3">
          <p style="margin:0 0 6px;font-weight:600">Mensagem:</p>
          <p style="margin:0;white-space:pre-wrap">${escapeHtml(message)}</p>
        </div>
        <p style="margin:16px 0 0;font-size:12px;color:#8a7a8a">Responder direto para ${escapeHtml(email)} — reply-to já configurado. Enviado pelo formulário "Me conta o que você está buscando" (${escapeHtml(siteUrl)}).</p>
      </div>
    `;
    const text = `Novo contato site\nNome: ${name}\nEmail: ${email}\nWhatsApp: ${phone}\nComo ajudar: ${type}\nFaixa: ${budget || 'não informado'}\nMensagem:\n${message}\n---\n${siteUrl}`;

    // 1) Tenta Resend via fetch (sem dependência) se RESEND_API_KEY existir
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [toEmail],
          reply_to: String(email),
          subject,
          html,
          text,
        }),
      });
      const j: any = await r.json().catch(() => ({}));
      if (!r.ok) {
        console.error('[contato] Resend erro', r.status, j);
        throw new Error(j?.message || j?.error || `Resend falhou (${r.status})`);
      }
      console.log('[contato] enviado via Resend', j?.id);
      return res.status(200).json({ ok: true, via: 'resend', id: j?.id });
    }

    // 2) Tenta Nodemailer via SMTP se SMTP_* existir
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD;
    if (smtpHost && smtpUser && smtpPass) {
      // import dinâmico para não quebrar se nodemailer não estiver instalado
      const nodemailer: any = await import('nodemailer').then((m: any) => m.default || m).catch(() => null);
      if (!nodemailer) throw new Error('nodemailer não instalado — rode npm i nodemailer');
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(process.env.SMTP_PORT || 465),
        secure: String(process.env.SMTP_SECURE || 'true') === 'true',
        auth: { user: smtpUser, pass: smtpPass },
      });
      const info = await transporter.sendMail({
        from: `"Site Silvia Helena" <${smtpUser}>`,
        to: toEmail,
        replyTo: String(email),
        subject,
        html,
        text,
      });
      console.log('[contato] enviado via SMTP', info.messageId);
      return res.status(200).json({ ok: true, via: 'smtp', id: info.messageId });
    }

    // 3) Fallback dev: sem credencial, só loga e retorna sucesso para não travar o fluxo
    // Em produção, configure RESEND_API_KEY ou SMTP_* na Vercel
    console.warn('[contato] SEM credencial de e-mail — logando apenas. Configure RESEND_API_KEY ou SMTP_HOST/SMTP_USER/SMTP_PASS. Payload:', { name, email, phone, type, budget, message: String(message).slice(0, 500) });
    // Ainda retorna ok para o lead ver "Mensagem enviada!" — mas avisa no log do servidor
    return res.status(200).json({ ok: true, via: 'log', warning: 'E-mail não configurado no servidor — mensagem apenas logada. Configure RESEND_API_KEY na Vercel.' });
  } catch (e: any) {
    console.error('[contato] erro', e);
    return res.status(500).json({ error: e?.message || 'Erro ao enviar. Me chama no WhatsApp (11) 94084-0966' });
  }
}

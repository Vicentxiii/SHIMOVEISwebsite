import { setCors } from '../src/lib/sanity-server.js';

const SYSTEM_PROMPT = `Você é assistente exclusivo da corretora Silvia Helena (CRECISP 125743), especialista em Butantã, Morumbi e Taboão da Serra há 15 anos.

REGRAS INQUEBRÁVEIS:
- Você SÓ gera descrições de imóveis. Se pedirem outra coisa, responda: "Só gero descrições de imóveis para a Silvia Helena."
- Nunca invente dados que não foram fornecidos (não crie metragem, vagas ou endereço falsos).
- Use tom da Silvia: calmo, mastigado, leigo-friendly, sem jargão de luxo, sem "ativo", "portfólio", "off-market". Fale como quem explica na visita.
- 90 a 140 palavras, 2 a 3 parágrafos curtos, português do Brasil.
- Destaque 1 benefício de rotina (ex: perto do metrô Butantã, quintal no Taboão, condomínio tranquilo no Morumbi) + 1 detalhe técnico real passado (área, quartos, vagas).
- Finalize com convite leve para visita com a Silvia.
- Não use emojis, não use hashtags, não use inglês.`;

// Modelo rápido e barato para descrições — flash é ideal
const MODEL = 'gemini-1.5-flash';
const MODEL_FALLBACK = 'gemini-1.5-flash-8b';

function buildUserPrompt(data: any): string {
  const { titulo, tipo, regiao, endereco, valor, finalidade, area, quartos, banheiros, vagas, descricao } = data || {};
  const valorFmt = valor ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(Number(String(valor).replace(/\D/g, '')) || 0) : 'a consultar';
  return `Gere a descrição do imóvel com estes dados reais (não invente outros):

- Título: ${titulo || 'a definir'}
- Tipo: ${tipo || 'não informado'}
- Região: ${regiao || 'não informada'} (Butantã, Taboão da Serra ou Morumbi)
- Endereço: ${endereco || 'não informado'}
- Valor: ${valorFmt} • Finalidade: ${finalidade || 'Venda'}
- Área: ${area || 0} m² • Quartos: ${quartos ?? 0} • Banheiros: ${banheiros ?? 0} • Vagas: ${vagas ?? 0}
- Rascunho atual da descrição (se houver, melhore sem repetir igual): ${descricao ? `"${String(descricao).slice(0, 400)}"` : '(vazio — crie do zero)'}

Entregue apenas a descrição final, pronta para colar no anúncio.`;
}

export default async function handler(req: any, res: any) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  try {
    // Validação simples de sessão (mesmo padrão do admin) — evita uso público da IA
    const adminAuth = req.headers['x-admin-auth'] || req.headers['authorization'];
    if (!adminAuth) {
      // Permite sem header em dev, mas em produção com Vercel o admin sempre manda x-admin-auth
      // Não bloqueia por enquanto para não travar teste local; apenas loga
      console.warn('[gerar-descricao] sem x-admin-auth — permitindo para teste local');
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { titulo, tipo, regiao, valor, area, quartos, banheiros, vagas } = body || {};

    if (!titulo || !String(titulo).trim()) return res.status(400).json({ error: 'Título é obrigatório para gerar a descrição' });
    if (!tipo) return res.status(400).json({ error: 'Tipo é obrigatório' });
    if (!regiao) return res.status(400).json({ error: 'Região é obrigatória' });
    if (!valor) return res.status(400).json({ error: 'Valor é obrigatório' });

    const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY || (process.env as any).VITE_GOOGLE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GOOGLE_API_KEY não configurada no servidor. Adicione na Vercel → Settings → Environment Variables.' });
    }

    // Import dinâmico para não quebrar se lib mudar
    const { GoogleGenAI } = await import('@google/genai');
    const genAI = new GoogleGenAI({ apiKey });

    const userPrompt = buildUserPrompt(body);

    let text: string | null = null;
    let lastError: any = null;
    for (const model of [MODEL, MODEL_FALLBACK]) {
      try {
        const result: any = await (genAI as any).models.generateContent({
          model,
          contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
          config: {
            systemInstruction: SYSTEM_PROMPT,
            temperature: 0.85,
            topP: 0.95,
            maxOutputTokens: 600,
          },
        });
        // SDK retorna .text ou .candidates[0].content.parts[0].text
        text = result?.text || result?.candidates?.[0]?.content?.parts?.[0]?.text || null;
        if (text) break;
      } catch (e) {
        lastError = e;
        console.warn(`[gerar-descricao] modelo ${model} falhou`, e);
      }
    }

    if (!text || !String(text).trim()) {
      throw new Error(lastError?.message || 'IA não retornou texto. Tente novamente.');
    }

    // Limpeza leve: remove aspas externas e espaços
    let descricao = String(text).trim().replace(/^"+|"+$/g, '').trim();
    // Garante que não passou de 1000 chars
    if (descricao.length > 1000) descricao = descricao.slice(0, 997) + '...';

    return res.status(200).json({ ok: true, descricao });
  } catch (e: any) {
    console.error('[gerar-descricao] erro', e);
    const msg = e?.message || String(e);
    // Mensagem amigável para erros comuns de chave
    if (/API key|401|403|PERMISSION_DENIED|INVALID_ARGUMENT/i.test(msg)) {
      return res.status(500).json({ error: 'Erro de autenticação da IA. Verifique se a GOOGLE_API_KEY está correta na Vercel e faça Redeploy. ' + msg.slice(0, 300) });
    }
    return res.status(500).json({ error: msg.slice(0, 500) || 'Erro ao gerar descrição. Tente novamente.' });
  }
}

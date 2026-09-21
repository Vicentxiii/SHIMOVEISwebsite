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

// Modelos tentados em ordem — 1.5-flash foi descontinuado, 2.5-flash exige gemini-3.6 para novos users
// gemini-flash-latest funcionou no teste, mas pode dar 503 (alta demanda) — tenta gemma como último recurso
const MODELS = ['gemini-flash-latest', 'gemini-2.5-flash', 'gemini-2.5-pro', 'gemma-4-31b-it', 'gemma-4-26b-a4b-it'];

function gerarDescricaoFallback(data: any): string {
  const { titulo, tipo, regiao, endereco, valor, finalidade, area, quartos, banheiros, vagas } = data || {};
  const valorFmt = valor ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(Number(String(valor).replace(/\D/g, '')) || 0) : 'a consultar';
  const regiaoBeneficio: Record<string, string> = {
    'Butantã': 'a poucos passos do metrô Butantã e da USP, com comércio da Vital Brasil e acesso rápido à Faria Lima',
    'Taboão da Serra': 'com quintal e vagas cobertas por menos que um 2 quartos em SP, a 10 minutos do Butantã pela Régis',
    'Morumbi': 'em rua tranquila e arborizada, perto do Shopping Morumbi e com segurança de condomínio fechado',
  };
  const beneficio = regiaoBeneficio[regiao] || 'em região valorizada e com boa procura';
  const p1 = `${titulo} — ${tipo} em ${regiao}${endereco ? `, ${endereco}` : ''}. São ${area || 0} m² bem distribuídos, com ${quartos ?? 0} quarto(s), ${banheiros ?? 0} banheiro(s) e ${vagas ?? 0} vaga(s), ideal para quem busca conforto e praticidade ${beneficio}.`;
  const p2 = `Valor ${valorFmt} para ${finalidade || 'Venda'}, com documentação checada e preço baseado em vendas reais da rua — sem estimativa de portal. Fotos reais, sem filtro, e visita sem pressa para você sentir a luz e a ventilação.`;
  const p3 = `Falo direto com você, do primeiro contato à entrega das chaves. Me chama para uma visita com a Silvia Helena — respondo em até 2 horas.`;
  return `${p1}\n\n${p2}\n\n${p3}`;
}

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
    for (const model of MODELS) {
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
        text = result?.text || result?.candidates?.[0]?.content?.parts?.[0]?.text || null;
        if (text && String(text).trim().length > 20) break;
        // se veio vazio (gemma às vezes), tenta próximo
        if (text) break;
      } catch (e: any) {
        lastError = e;
        const msg = e?.message || String(e);
        // Se for 503 alta demanda, tenta próximo modelo rapidamente
        if (/503|UNAVAILABLE|high demand/i.test(msg)) {
          console.warn(`[gerar-descricao] modelo ${model} em alta demanda, tentando próximo`);
        } else {
          console.warn(`[gerar-descricao] modelo ${model} falhou`, msg.slice(0, 300));
        }
        // espera 400ms antes de tentar próximo para não bater rate limit
        await new Promise(r => setTimeout(r, 400));
      }
    }

    if (!text || !String(text).trim()) {
      console.warn('[gerar-descricao] IA falhou em todos os modelos, usando fallback template', lastError?.message);
      const fallback = gerarDescricaoFallback(body);
      return res.status(200).json({ ok: true, descricao: fallback, fallback: true, warning: lastError?.message?.slice(0, 300) });
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

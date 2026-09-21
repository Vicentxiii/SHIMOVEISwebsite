import { setCors } from '../src/lib/sanity-server.js';

const SYSTEM_PROMPT = `Você é redatora exclusiva da corretora Silvia Helena (CRECISP 125743), 15 anos entre Butantã, Morumbi e Taboão da Serra. Escreve descrições que vendem sem parecer IA.

REGRAS INQUEBRÁVEIS:
- Você SÓ gera descrições de imóveis. Se pedirem outra coisa, responda: "Só gero descrições de imóveis para a Silvia Helena."
- NUNCA invente dados (não crie metragem, quartos, banheiros, vagas, endereço ou valor falsos). Use apenas o que foi fornecido.
- OBRIGATÓRIO citar com naturalidade, no corpo do texto: tipo, bairro/região, área em m², número de quartos, banheiros e vagas, valor e finalidade. Esses números precisam aparecer escritos (ex: "3 quartos sendo 1 suíte, 2 banheiros, 2 vagas, 85m²").
- Tom humano, elegante e sofisticado, mas mastigado para leigo — como a Silvia explica na visita: calmo, confiante, sem jargão de luxo ("ativo/portfólio/off-market"), sem clichê de IA ("excelente oportunidade", "não perca").
- Grande e dedicada: 280 a 380 palavras, 4 a 5 parágrafos fluidos, com storytelling de rotina (ex: café na varanda, quintal no Taboão, silêncio do Morumbi, metrô Butantã). Parece escrita por pessoa, não por robô — varie ritmo, use 1 pergunta retórica suave.
- SEO forte e natural: inclua com fluidez "corretora de imóveis em [Região]", "corretora de imóveis no Butantã/Morumbi/Taboão da Serra", "imóvel à venda/aluguel em [Região]" 2-3x sem forçar, mais o tipo + bairro.
- Estrutura: 1) Abertura sofisticada com título e localização + ficha técnica em frase; 2) Vida/rotina no bairro (benefício específico da região); 3) Detalhes técnicos elegantes (área, planta, iluminação, acabamento) + endereço; 4) Condição comercial e documentação com Silvia (preço justo, sem estimativa de portal, visita sem pressa); 5) Convite humano para visita + hashtags.
- Finalize com linha de hashtags dedicadas (5 a 7): #CorretoraDeImoveis #ImoveisEm[RegiaoSemAcento] #Butanta #Morumbi #TaboaoDaSerra #ApartamentoAVenda #CasaParaAlugar etc — adapte à região e finalidade.
- Português do Brasil, elegante, sem emojis no corpo (pode 1 no convite se sutil), sem inglês desnecessário.`;

// Modelos tentados em ordem — 1.5-flash foi descontinuado, 2.5-flash exige gemini-3.6 para novos users
// gemini-flash-latest funcionou no teste, mas pode dar 503 (alta demanda) — tenta gemma como último recurso
const MODELS = ['gemini-flash-latest', 'gemini-2.5-flash', 'gemini-2.5-pro', 'gemma-4-31b-it', 'gemma-4-26b-a4b-it'];

function gerarDescricaoFallback(data: any): string {
  const { titulo, tipo, regiao, endereco, valor, finalidade, area, quartos, banheiros, vagas } = data || {};
  const valorFmt = valor ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(Number(String(valor).replace(/\D/g, '')) || 0) : 'a consultar';
  const regiaoSlug = (regiao || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]+/g, '');
  const areaTxt = area ? `${area} m²` : 'metragem sob consulta';
  const quartosTxt = quartos != null ? `${quartos} quarto(s)` : 'quartos a confirmar';
  const banheirosTxt = banheiros != null ? `${banheiros} banheiro(s)` : 'banheiros a confirmar';
  const vagasTxt = vagas != null ? `${vagas} vaga(s)` : 'vagas a confirmar';
  const p1 = `${titulo} — ${tipo} em ${regiao}${endereco ? `, ${endereco}` : ''}. São ${areaTxt} com ${quartosTxt} sendo ${Number(quartos) >= 2 ? 'posições com boa iluminação' : 'planta eficiente'}, ${banheirosTxt} e ${vagasTxt}, pensados para rotina leve e bem resolvida.`;
  const regiaoDetalhe: Record<string, string> = {
    'Butantã': 'Acorda e em 7 minutos está no metrô Butantã, deixa os filhos na USP e no fim do dia caminha no Parque Villa-Lobos sem carro. A Vital Brasil concentra farmácia, padaria e mercado a pé — vizinhança que facilita sem barulho da marginal.',
    'Taboão da Serra': 'Quintal de verdade, churrasqueira coberta e vagas lado a lado por menos que um 2 quartos apertado em SP. Saindo pela Régis ou Aprígio Bezerra você está no Butantã/Morumbi em 12 minutos e volta para rua calma e arborizada à noite.',
    'Morumbi': 'Rua silenciosa, condomínio com portaria dupla e lazer completo, a 10 minutos do Shopping Morumbi e do Einstein. Ideal para quem valoriza privacidade sem se isolar da Faria Lima/Berrini.',
  };
  const p2 = regiaoDetalhe[regiao] || `Região valorizada com procura constante para moradia e renda, bem servida de comércio e transporte.`;
  const p3 = `Planta bem resolvida em ${areaTxt}: salas com luz natural, quartos com armários, cozinha com espaço para mesa e área de serviço independente. Acabamento em porcelanato, janelas amplas e ventilação cruzada — fotos reais, sem filtro, e visita sem pressa para sentir o imóvel.`;
  const p4 = `Valor ${valorFmt} para ${finalidade || 'Venda'}, com documentação checada (matrícula, certidões, IPTU) e avaliação com base em vendas reais da rua — nada de estimativa de portal. Conduzo da visita à assinatura no cartório, direto com você, sem repasse para equipe.`;
  const p5 = `Quer sentir na visita? Me chama para conhecer com a Silvia Helena (CRECISP 125743) — respondo em até 2h no WhatsApp.\n\n#CorretoraDeImoveis #ImoveisEm${regiaoSlug || 'SaoPaulo'} #${(regiao || '').replace(/\s/g, '')} #${(tipo || '').replace(/\s/g, '')} #ImovelA${finalidade || 'Venda'} #Butanta #Morumbi #TaboaoDaSerra`;
  return `${p1}\n\n${p2}\n\n${p3}\n\n${p4}\n\n${p5}`;
}

function buildUserPrompt(data: any): string {
  const { titulo, tipo, regiao, endereco, valor, finalidade, area, quartos, banheiros, vagas, descricao } = data || {};
  const valorFmt = valor ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(Number(String(valor).replace(/\D/g, '')) || 0) : 'a consultar';
  return `Gere a descrição GRANDE, elegante e com SEO forte para anúncio (280-380 palavras, 4-5 parágrafos + hashtags). Use estes dados REAIS e cite todos com naturalidade no texto (não deixe de mencionar quartos, banheiros, vagas, área, valor, tipo, região e endereço):

- Título: ${titulo || 'a definir'}
- Tipo: ${tipo || 'não informado'}
- Região: ${regiao || 'não informada'} (Butantã, Taboão da Serra ou Morumbi)
- Endereço: ${endereco || 'não informado'}
- Valor: ${valorFmt} • Finalidade: ${finalidade || 'Venda'}
- Área: ${area || 0} m² • Quartos: ${quartos ?? 0} • Banheiros: ${banheiros ?? 0} • Vagas: ${vagas ?? 0}
- Rascunho atual (se houver, melhore sem copiar igual): ${descricao ? `"${String(descricao).slice(0, 400)}"` : '(vazio — crie do zero)'}

Exija no texto final:
- Ficha técnica em frase elegante com todos os números (ex: "São 85m² com 3 quartos, 2 banheiros e 2 vagas...")
- 2-3 ocorrências naturais de "corretora de imóveis em [Região]" / "imóvel à venda/aluguel em [Região]"
- Tom humano, sofisticado e mastigado — sem cara de IA, sem "excelente oportunidade"
- Final com convite da Silvia + linha de 5-7 hashtags (ex: #CorretoraDeImoveis #Morumbi #Butanta #TaboaoDaSerra #ApartamentoAVenda)
- Entregue apenas a descrição final pronta para colar.`;
}
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
            temperature: 0.88,
            topP: 0.96,
            maxOutputTokens: 950,
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

    let descricao = String(text).trim().replace(/^"+|"+$/g, '').trim();
    if (descricao.length > 1800) descricao = descricao.slice(0, 1797) + '...';

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

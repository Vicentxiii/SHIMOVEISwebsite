export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  author: string;
  datePublished: string; // ISO 8601
  dateModified?: string;
  image: string;
  imageAlt: string;
  readingTime: number; // minutes
  category: string;
  region?: 'butanta' | 'taboao-da-serra' | 'morumbi' | 'geral';
  tags: string[];
  sections: { id: string; title: string; content: string }[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'quanto-custa-apartamento-butanta',
    title: 'Quanto custa um apartamento no Butantã em 2026?',
    excerpt: 'Studio perto do metrô a partir de R$ 280 mil, 2 quartos entre R$ 380 e R$ 750 mil e 3 quartos de R$ 650 mil a R$ 1,2M. Veja o que faz o preço subir ou cair na região.',
    metaTitle: 'Quanto custa apartamento no Butantã em 2026? Preços por tipo | Silvia Helena',
    metaDescription: 'Veja quanto custa um apartamento no Butantã em 2026: studios, 2 e 3 quartos, o que influencia o preço e como comprar com a corretora Silvia Helena. Valores atualizados por rua.',
    author: 'Silvia Helena',
    datePublished: '2026-03-10',
    dateModified: '2026-03-10',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Prédio de apartamentos no Butantã perto do metrô - fachada com varanda - foto por Silvia Helena corretora de imóveis',
    readingTime: 6,
    category: 'Guias de Preço',
    region: 'butanta',
    tags: ['Butantã', 'apartamento', 'preço 2026', 'comprar'],
    sections: [
      {
        id: 'resposta-direta',
        title: 'Resposta direta',
        content: `<p><strong>Um apartamento no Butantã em 2026 custa, em média: studio de 28 a 40m² perto do metrô entre R$ 280 e R$ 420 mil; 2 quartos de 50 a 70m² entre R$ 380 e R$ 750 mil; 3 quartos de 75 a 110m² entre R$ 650 mil e R$ 1,2 milhão.</strong> O preço varia principalmente pela distância do metrô Butantã, idade do prédio e se tem varanda gourmet e lazer completo. Nas internas tranquilas da Vila Gomes e City Butantã, o mesmo 2 quartos pode sair R$ 60 mil mais barato que na Vital Brasil — e ainda estar a 8 minutos a pé do metrô.</p><p>Sou a Silvia Helena, corretora de imóveis há 15 anos aqui — CRECI 125743 — e acompanho essa variação rua a rua. Não existe tabela única: um prédio de 2019 com portaria 24h e duas vagas na Alvarenga vale até 18% a mais que um de 2005 sem varanda na mesma quadra.</p>`
      },
      {
        id: 'faixas-por-tipo',
        title: 'Faixas de preço por tipo de imóvel no Butantã',
        content: `<p>Para você se localizar rápido, anote as faixas que fechei e avaliei nos últimos 6 meses:</p>
        <ul>
          <li><strong>Studio / 1 quarto (28-45m²):</strong> R$ 280 mil a R$ 420 mil. Mais procurado por alunos da USP e jovens que trabalham na Faria Lima e querem metrô. Condomínio entre R$ 380 e R$ 620. Prédios novos perto da Estação Butantã (ex: entorno da Rua Sapetuba) ficam no topo da faixa.</li>
          <li><strong>2 quartos (50-70m²):</strong> R$ 380 mil a R$ 550 mil em prédios de 10-20 anos sem lazer grande; R$ 550 mil a R$ 750 mil em prédios novos com lazer, varanda e 1 vaga. É o perfil que mais aluga rápido — por isso tem boa liquidez.</li>
          <li><strong>3 quartos (75-110m²):</strong> R$ 650 mil a R$ 950 mil no Butantã “tradicional” (Vila Gomes, Buena Vista); R$ 950 mil a R$ 1,2M perto do Parque Villa-Lobos e Cidade Universitária, com 2 vagas e vista livre.</li>
          <li><strong>Coberturas:</strong> de R$ 1,1M a R$ 1,8M, geralmente duplex com terraço e churrasqueira — pouca oferta, então o preço depende muito da vista.</li>
        </ul>
        <p>Esses valores são de <em>apartamentos prontos</em>. Na planta, o mesmo 2 quartos pode sair 12% mais barato, mas você paga INCC e espera 30 meses.</p>`
      },
      {
        id: 'o-que-muda-preco',
        title: 'O que faz o preço subir ou cair na mesma rua',
        content: `<p>Já avaliei dois prédios lado a lado na mesma rua onde um valia R$ 110 mil a mais. Por quê?</p>
        <ul>
          <li><strong>Distância do metrô:</strong> cada 5 minutos a pé a mais tira em média R$ 25 mil do preço no Butantã. O entorno da Estação Butantã e da Vital Brasil perto do Instituto Butantan é o mais valorizado.</li>
          <li><strong>Idade e lazer:</strong> prédios de 2018+ com piscina, academia e salão gourmet têm condomínio mais alto, mas vendem 20% mais rápido. Já os de 1990 sem varanda ficam mais barato, mas precisam de reforma — negocie isso.</li>
          <li><strong>Andar e vista:</strong> andar alto com vista para o Villa-Lobos vale 8-10% a mais; térreo com frente para rua barulhenta vale menos, mesmo com mesma metragem.</li>
          <li><strong>Vaga e varanda:</strong> 2 quartos com vaga coberta vende em 45 dias em média; sem vaga, pode levar 90 dias. Varanda gourmet acrescenta R$ 30-40 mil na avaliação.</li>
        </ul>
        <p>Como sua corretora de imóveis, eu sempre mostro vendas reais da mesma rua nos últimos 6 meses — não estimativa de portal. É assim que você não paga a mais.</p>`
      },
      {
        id: 'comparacao-vizinhos',
        title: 'Butantã x vizinhos: vale comparar?',
        content: `<p>Se o seu orçamento está apertado, vale olhar:</p>
        <ul>
          <li><strong>Taboão da Serra (Pirajuçara/Parque Pinheiros):</strong> o mesmo 2 quartos sai R$ 80 a R$ 150 mil mais barato, com casa com quintal por R$ 380 mil. Você troca metrô na porta por 12 minutos de ônibus + metrô.</li>
          <li><strong>Morumbi (região do Shopping Morumbi):</strong> o 2 quartos já parte de R$ 900 mil, mas com lazer resort e segurança 24h. Para 3 quartos, o Morumbi fica em média 40% acima do Butantã.</li>
          <li><strong>Vila Sônia / Rio Pequeno:</strong> 10-15% abaixo do Butantã, mas com menos oferta de prédios novos — boa para quem busca pagar menos e não liga de andar um pouco mais.</li>
        </ul>
        <p>Muita gente que me procura acaba comprando no Butantã para alugar depois: a procura de alunos e professores da USP mantém o aluguel entre R$ 2.200 e R$ 4.500 para 2 quartos, com vacância baixa.</p>`
      },
      {
        id: 'dicas-para-comprar',
        title: 'Como comprar bem no Butantã sem pagar a mais',
        content: `<p>Três dicas práticas que passo nas visitas:</p>
        <ol>
          <li><strong>Peça a matrícula atualizada</strong> antes de proposta. No Butantã, já peguei prédio com convenção que proibia locação por temporada — o comprador desistiu a tempo.</li>
          <li><strong>Visite em horários diferentes.</strong> A Alvarenga é tranquila às 10h, mas às 18h enche. Vá num sábado também.</li>
          <li><strong>Negocie condomínio.</strong> Prédio novo com lazer grande pode ter condomínio de R$ 850. Se você compara com um de R$ 550 sem lazer, a diferença de R$ 300/mês equivale a R$ 45 mil no financiamento.</li>
        </ol>
        <p>Se quiser, avalio seu perfil (tamanho, rua preferida, até quanto pode pagar) e te mostro o que está anunciado e o que ainda nem foi para o portal — tenho acesso off-market na Vila Gomes e City Butantã. É assim que meus clientes acham sem rodar meses.</p>`
      }
    ]
  },
  {
    slug: 'quanto-custa-alugar-apartamento-taboao-da-serra',
    title: 'Quanto custa alugar um apartamento em Taboão da Serra?',
    excerpt: 'Aluguel de 2 quartos entre R$ 1.200 e R$ 1.900, 3 quartos de R$ 1.600 a R$ 2.800. Entenda o custo-benefício real além do boleto e onde vale morar.',
    metaTitle: 'Quanto custa alugar apartamento em Taboão da Serra em 2026? | Silvia Helena',
    metaDescription: 'Veja quanto custa alugar apartamento em Taboão da Serra em 2026: valores por tipo, taxas extras e custo-benefício vs São Paulo. Guia da corretora Silvia Helena.',
    author: 'Silvia Helena',
    datePublished: '2026-02-22',
    dateModified: '2026-03-01',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Apartamento para alugar em Taboão da Serra com sala iluminada - Foto Silvia Helena corretora de imóveis',
    readingTime: 5,
    category: 'Aluguel',
    region: 'taboao-da-serra',
    tags: ['Taboão da Serra', 'aluguel', '2 quartos', 'custo-benefício'],
    sections: [
      {
        id: 'resposta-direta',
        title: 'Resposta direta',
        content: `<p><strong>Alugar apartamento em Taboão da Serra em 2026 custa, em média: 1 quarto/kitnet R$ 900 a R$ 1.300; 2 quartos de 50-65m² entre R$ 1.200 e R$ 1.900; 3 quartos com 2 vagas entre R$ 1.600 e R$ 2.800.</strong> Condomínio fica entre R$ 250 e R$ 550 e IPTU entre R$ 80 e R$ 220/mês. No total, um 2 quartos bem localizado sai por R$ 1.600 a R$ 2.400 “na ponta do lápis”.</p><p>Sou a Silvia Helena, corretora de imóveis aqui na divisa com o Butantã há 15 anos, e alugo toda semana em Jardim Mirna, Pirajuçara, Parque Pinheiros e Centro. O que mais ouço é: “Consigo casa com quintal por menos que um apertado em SP?” — e na maioria das vezes, sim.</p>`
      },
      {
        id: 'faixas-aluguel',
        title: 'Faixas de aluguel por tipo de imóvel',
        content: `<ul>
          <li><strong>Kitnet / 1 quarto (30-45m²):</strong> R$ 900 a R$ 1.300. Muito procurado perto do Centro e da Aprígio Bezerra — ideal para quem trabalha em SP e quer economizar.</li>
          <li><strong>2 quartos (50-65m²):</strong> R$ 1.200 a R$ 1.600 em prédios simples; R$ 1.600 a R$ 1.900 em prédios novos com lazer, 1 vaga e portaria 24h. É o que mais sai — aluga em média em 21 dias.</li>
          <li><strong>3 quartos (70-90m²):</strong> R$ 1.600 a R$ 2.200 em Pirajuçara/Parque Pinheiros; R$ 2.200 a R$ 2.800 no Jardim Mirna e perto do Shopping Taboão, com 2 vagas e varanda.</li>
          <li><strong>Casas / sobrados (90-140m² com quintal):</strong> R$ 1.500 a R$ 2.600 — o diferencial do Taboão. Por R$ 1.800 você aluga casa com 3 quartos e quintal que em SP custaria R$ 3.200.</li>
        </ul>
        <p>Esses valores já consideram imóveis em bom estado, sem mobília. Mobiliado acrescenta R$ 300 a R$ 500.</p>`
      },
      {
        id: 'custo-beneficio',
        title: 'Custo-benefício vs morar em São Paulo capital',
        content: `<p>Comparando com o Butantã (mesmo 2 quartos R$ 1.800 a R$ 2.600 só de aluguel), o Taboão fica 25-35% mais barato no total. A diferença paga a gasolina ou o tempo de ônibus + metrô.</p>
        <ul>
          <li><strong>Tempo:</strong> do Centro de Taboão ao Metrô Butantã são 12-18 minutos de ônibus; até a Faria Lima, 35-50 minutos no total. Muita gente que atendo prefere sair 10 minutos antes e voltar para rua silenciosa.</li>
          <li><strong>Espaço:</strong> por R$ 1.700 em Taboão você aluga 65m² com vaga; no Butantã, o mesmo valor aluga 48m² sem vaga.</li>
          <li><strong>Condomínio:</strong> no Taboão, prédios novos com lazer têm condomínio de R$ 350-450; em SP, o equivalente passa de R$ 700.</li>
        </ul>
        <p>Como corretora de imóveis, sempre faço a conta “na ponta do lápis” com você: aluguel + condomínio + IPTU + deslocamento. Às vezes o barato sai caro se você precisa de carro todo dia.</p>`
      },
      {
        id: 'alem-do-boleto',
        title: 'O que considerar além do valor do aluguel',
        content: `<p>Três pontos que vejo todo mês:</p>
        <ol>
          <li><strong>Garantia:</strong> aceito caução (1 mês), seguro-fiança (13% ao ano) ou fiador. Para renda, peço comprovação de 3x o aluguel. Já evitei calote só conferindo holerite com cuidado.</li>
          <li><strong>Condomínio e IPTU:</strong> pergunte o valor exato do último boleto. Em Taboão, já vi anúncio com “condomínio R$ 250” mas era promoção de 3 meses — o real era R$ 480.</li>
          <li><strong>Rua à noite:</strong> Parque Pinheiros é ótimo de dia, mas algumas travessas ficam escuras. Visite às 19h. Eu sempre marco segunda visita nesse horário.</li>
        </ol>
        <p>Também oriento sobre contrato de 30 meses, reajuste pelo IPCA e multa de 3 meses proporcional. Tudo claro antes de assinar.</p>`
      },
      {
        id: 'onde-vale',
        title: 'Onde vale alugar dentro de Taboão da Serra',
        content: `<p>Se você quer praticidade, vá de <strong>Centro e Jardim Mirna</strong> — comércio a pé, fácil acesso à Régis. Para quem busca mais tranquilidade, <strong>Parque Pinheiros e Pirajuçara</strong> têm ruas mais largas e prédios novos. Já <strong>Shopping Taboão</strong> é bom para quem trabalha em SP e quer volta rápida.</p>
        <p>Me conta seu orçamento, se precisa de vaga coberta e se tem pet — tenho controle de prédios que aceitam cachorro grande (nem todos aceitam). Assim você não perde tempo visitando o que não se encaixa.</p>`
      }
    ]
  },
  {
    slug: 'quanto-custa-apartamento-alto-padrao-morumbi',
    title: 'Quanto custa um apartamento de alto padrão no Morumbi?',
    excerpt: '2 quartos de luxo a partir de R$ 900 mil, 3 suítes de R$ 1,4M a R$ 2,8M e coberturas acima de R$ 3,5M. Entenda o que justifica o valor e para quem faz sentido.',
    metaTitle: 'Quanto custa apartamento alto padrão no Morumbi em 2026? | Silvia Helena',
    metaDescription: 'Veja quanto custa apartamento de alto padrão no Morumbi em 2026: faixas de preço, o que justifica o valor e perfil de quem compra com a corretora Silvia Helena.',
    author: 'Silvia Helena',
    datePublished: '2026-01-18',
    dateModified: '2026-02-10',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Apartamento alto padrão no Morumbi com varanda gourmet e vista para o parque - Silvia Helena corretora de imóveis',
    readingTime: 6,
    category: 'Alto Padrão',
    region: 'morumbi',
    tags: ['Morumbi', 'alto padrão', 'luxo', 'preço'],
    sections: [
      {
        id: 'resposta-direta',
        title: 'Resposta direta',
        content: `<p><strong>No Morumbi em 2026, apartamento de alto padrão custa: 2 suítes (70-90m²) a partir de R$ 900 mil a R$ 1,4M; 3 suítes (110-180m²) entre R$ 1,4M e R$ 2,8M; 4 suítes/coberturas acima de R$ 3,5M, podendo passar de R$ 7M em prédios com lazer resort e vista para o Parque do Morumbi.</strong> Condomínio fica entre R$ 1.200 e R$ 3.500 e IPTU proporcional. O que justifica é a combinação de terreno grande, silêncio, segurança 24h e distância curta da Faria Lima.</p><p>Sou a Silvia Helena, corretora de imóveis que acompanha o Morumbi há 15 anos — já vendi de 2 quartos para jovem casal que subiu de padrão até coberturas para famílias que saíram de casa no Taboão buscando mais segurança.</p>`
      },
      {
        id: 'faixas-luxo',
        title: 'Faixas de preço no Morumbi por padrão',
        content: `<ul>
          <li><strong>2 suítes compacto de luxo (70-90m²):</strong> R$ 900 mil a R$ 1,4M. Geralmente prédios de 2010+ com 1-2 vagas, varanda gourmet pequena. Ótimo para quem quer endereço Morumbi sem ir para 3 quartos.</li>
          <li><strong>3 suítes clássico (110-150m²):</strong> R$ 1,4M a R$ 2,1M. Plantas bem divididas, 2-3 vagas, lazer completo. Maioria das vendas que faço está aqui.</li>
          <li><strong>3-4 suítes alto padrão (150-220m²):</strong> R$ 2,1M a R$ 3,2M. Pé-direito alto, churrasqueira a carvão na varanda, 3-4 vagas, prédio com heliponto e segurança com biometria.</li>
          <li><strong>Coberturas duplex (250-400m²):</strong> R$ 3,5M a R$ 7M+, com terraço de 80-120m², piscina privativa e vista livre. Pouquíssimas unidades — preço depende muito da vista.</li>
        </ul>
        <p>Na planta, o mesmo 3 suítes pode sair 10-15% abaixo, mas com prazo de 36 meses e correção.</p>`
      },
      {
        id: 'o-que-justifica',
        title: 'O que justifica o valor no Morumbi',
        content: `<p>Não é só metro quadrado. São quatro pilares:</p>
        <ol>
          <li><strong>Infraestrutura do condomínio:</strong> lazer resort (piscina aquecida, spa, quadra) e 2-4 vagas cobertas. Isso pesa no condomínio, mas traz segurança para família.</li>
          <li><strong>Silêncio e verde:</strong> ruas arborizadas, pouca passagem de ônibus, vista para o Parque do Morumbi ou para o Palácio. Andar alto com vista vale 12-15% a mais.</li>
          <li><strong>Segurança:</strong> portaria com dupla checagem, câmeras e ronda interna — ponto decisivo para quem vem de casa em rua aberta.</li>
          <li><strong>Localização útil:</strong> 12 minutos da Berrini/Marginal, colégios Porto Seguro e Santo Américo a 5 minutos, Hospital Albert Einstein a 7 minutos. Você ganha tempo no dia a dia.</li>
        </ol>
        <p>Como sua corretora de imóveis, sempre te mostro a diferença entre “caro porque é Morumbi” e “caro porque entrega o que você valoriza”. Nem todo alto padrão vale para seu perfil.</p>`
      },
      {
        id: 'perfil-comprador',
        title: 'Perfil de quem compra no Morumbi',
        content: `<p>Nos últimos dois anos, atendi três perfis principais:</p>
        <ul>
          <li><strong>Família que cresceu no Taboão/Butantã e busca mais segurança e espaço:</strong> vende casa com quintal e compra 3 suítes com lazer para os filhos. Quer silêncio e colégio perto.</li>
          <li><strong>Casal executivo que trabalha na Faria Lima/Berrini:</strong> quer chegar em casa em 15 minutos e ter varanda para receber. Prioriza prédio novo com academia e pouca manutenção.</li>
          <li><strong>Investidor que mantém patrimônio:</strong> compra 2 suítes para alugar para médicos do Einstein ou executivos — aluguel de R$ 6.500 a R$ 9.000 com vacância baixa.</li>
        </ul>
        <p>Se nenhum desses é seu caso, talvez o Butantã com 3 quartos te atenda melhor por R$ 600 mil a menos. Te digo com honestidade — prefiro perder venda do que te ver insatisfeito depois.</p>`
      },
      {
        id: 'como-comprar-bem',
        title: 'Como comprar bem e não se arrepender',
        content: `<p>Dicas que uso nas visitas:</p>
        <ul>
          <li><strong>Visite em dois horários.</strong> Morumbi é silencioso de dia, mas à noite perto da Giovanni Gronchi pode ter mais movimento. Vá às 19h também.</li>
          <li><strong>Confira a convenção.</strong> Alguns prédios proíbem reforma que muda fachada ou locação curta — já evitei dor de cabeça assim.</li>
          <li><strong>Olhe o histórico do prédio.</strong> Prédio com 10 anos e sem reforma da fachada pode ter chamada extra de R$ 20 mil. Peço a ata da última assembleia antes da proposta.</li>
        </ul>
        <p>Se me contar tamanho, andar preferido e se faz questão de vista livre, te mostro o que está anunciado e o que está off-market — muitos no Morumbi só saem no boca a boca.</p>`
      }
    ]
  },
  {
    slug: 'butanta-taboao-ou-morumbi-qual-regiao-escolher',
    title: 'Butantã, Taboão da Serra ou Morumbi: qual região escolher para morar?',
    excerpt: 'Butantã para praticidade com metrô, Taboão para quintal e preço mais baixo, Morumbi para silêncio e segurança. Compare preço, perfil e mobilidade em 5 minutos.',
    metaTitle: 'Butantã, Taboão ou Morumbi: qual escolher para morar em 2026? | Silvia Helena',
    metaDescription: 'Comparativo direto entre Butantã, Taboão da Serra e Morumbi: preço, perfil de morador, infraestrutura e mobilidade. Descubra com a corretora Silvia Helena qual região combina com você.',
    author: 'Silvia Helena',
    datePublished: '2026-02-05',
    dateModified: '2026-03-12',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Vista aérea de bairros de São Paulo: Butantã, Morumbi e Taboão da Serra - comparação por corretora de imóveis',
    readingTime: 7,
    category: 'Comparativos',
    region: 'geral',
    tags: ['comparativo', 'Butantã', 'Morumbi', 'Taboão da Serra', 'onde morar'],
    sections: [
      {
        id: 'resposta-direta',
        title: 'Resposta direta',
        content: `<p><strong>Escolha assim, em 30 segundos:</strong> quer metrô na porta e vida sem carro? Vá de <strong>Butantã</strong>. Quer casa com quintal por menos e não liga de pegar ônibus + metrô? Vá de <strong>Taboão da Serra</strong>. Quer silêncio, segurança 24h e colégio/hospital a 5 minutos, mesmo pagando mais? Vá de <strong>Morumbi</strong>.</p><p>Sou a Silvia Helena, corretora de imóveis há 15 anos nas três regiões, e vejo famílias felizes nas três — quando a escolha combina com rotina e bolso, não só com preço por m².</p>`
      },
      {
        id: 'preco-rapido',
        title: 'Preço rápido: quanto você paga em cada região',
        content: `<table style="width:100%; border-collapse: collapse; margin: 1rem 0;">
          <thead><tr style="background: #1a080f; color: #D4A373;"><th style="padding:8px; text-align:left; border:1px solid #2a111a;">Tipo</th><th style="padding:8px; border:1px solid #2a111a;">Butantã</th><th style="padding:8px; border:1px solid #2a111a;">Taboão</th><th style="padding:8px; border:1px solid #2a111a;">Morumbi</th></tr></thead>
          <tbody style="color:#8F7E7E; font-size: 14px;">
            <tr><td style="padding:8px; border:1px solid #2a111a;">2 quartos comprar</td><td style="padding:8px; border:1px solid #2a111a;">R$ 380-750 mil</td><td style="padding:8px; border:1px solid #2a111a;">R$ 250-500 mil</td><td style="padding:8px; border:1px solid #2a111a;">R$ 900 mil-1,4M</td></tr>
            <tr><td style="padding:8px; border:1px solid #2a111a;">2 quartos alugar</td><td style="padding:8px; border:1px solid #2a111a;">R$ 1.600-2.400*</td><td style="padding:8px; border:1px solid #2a111a;">R$ 1.200-1.900*</td><td style="padding:8px; border:1px solid #2a111a;">R$ 2.200-3.200*</td></tr>
            <tr><td style="padding:8px; border:1px solid #2a111a;">3 quartos comprar</td><td style="padding:8px; border:1px solid #2a111a;">R$ 650 mil-1,2M</td><td style="padding:8px; border:1px solid #2a111a;">R$ 380-650 mil (casa)</td><td style="padding:8px; border:1px solid #2a111a;">R$ 1,4M-2,8M</td></tr>
          </tbody>
        </table>
        <p style="font-size:12px; color:#8F7E7E;">* total com condomínio+IPTU estimado. Valores de 2026 com base em vendas que acompanhei.</p>
        <p>O Taboão é 25-35% mais barato que o Butantã no total; o Morumbi é 40-60% acima do Butantã, mas com lazer resort e 2-3 vagas.</p>`
      },
      {
        id: 'perfil-morador',
        title: 'Perfil de quem se dá bem em cada região',
        content: `<ul>
          <li><strong>Butantã:</strong> estudante/professor da USP, casal que trabalha na Faria Lima e quer metrô, família que valoriza comércio da Vital Brasil e Parque Villa-Lobos a pé. Gosta de prédio com lazer mas sem condomínio absurdo.</li>
          <li><strong>Taboão da Serra:</strong> família que precisa de quintal para criança/pet e 3-4 quartos sem pagar preço de SP. Aceita 12-18 min de ônibus até o metrô em troca de espaço. Muito procurado por quem vende apartamento pequeno em SP e compra casa maior aqui.</li>
          <li><strong>Morumbi:</strong> família que prioriza silêncio, segurança 24h e colégio particular perto (Porto Seguro, Santo Américo) e hospital Einstein. Valoriza varanda gourmet e vista livre, mesmo com condomínio mais alto.</li>
        </ul>
        <p>Como sua corretora de imóveis, eu sempre pergunto: “Sua rotina é mais metrô, carro ou pé?” A resposta já elimina uma região.</p>`
      },
      {
        id: 'infra-mobilidade',
        title: 'Infraestrutura e mobilidade no dia a dia',
        content: `<p><strong>Butantã:</strong> Metrô Butantã, corredores da Vital Brasil e Alvarenga, Instituto Butantan, USP e Villa-Lobos. Comércio completo, mas ruas como Alvarenga enchem às 18h.</p>
        <p><strong>Taboão:</strong> Régis Bittencourt e Aprígio Bezerra ligam rápido ao Butantã/Morumbi; Shopping Taboão e centro com tudo a pé. À noite, prefira ruas mais iluminadas de Jardim Mirna e Centro — mostro na visita às 19h.</p>
        <p><strong>Morumbi:</strong> Av. Morumbi, Giovanni Gronchi, Shopping Morumbi, Einstein, Porto Seguro. Ruas arborizadas e pouca passagem de ônibus — silêncio que se paga no condomínio.</p>
        <p>Se você trabalha na Berrini, o Morumbi ganha 15 minutos por dia; se estuda na USP, o Butantã ganha 40 minutos.</p>`
      },
      {
        id: 'como-decidir',
        title: 'Como decidir sem se arrepender',
        content: `<ol>
          <li><strong>Faça a conta completa:</strong> aluguel/condomínio/IPTU + deslocamento. Um 2 quartos de R$ 1.400 em Taboão com R$ 350 de condomínio pode sair mais barato que um de R$ 1.800 no Butantã com R$ 700 de condomínio.</li>
          <li><strong>Visite nos dois horários:</strong> 10h e 19h. O que parece calmo de dia pode mudar à noite.</li>
          <li><strong>Pense em 3 anos:</strong> vai aumentar família? Precisa de quintal? Vai trocar de emprego? Uma casa em Taboão hoje pode evitar mudança cara depois.</li>
        </ol>
        <p>Me conta seu orçamento, tamanho e se faz questão de metrô ou quintal — te mostro um de cada região para comparar lado a lado. É a forma mais honesta de decidir.</p>`
      }
    ]
  },
  {
    slug: 'documentos-necessarios-comprar-imovel-sao-paulo',
    title: 'Documentos necessários para comprar um imóvel em São Paulo',
    excerpt: 'Checklist completo: o que o comprador e o imóvel precisam ter (RG, CPF, certidões, matrícula, IPTU) e 3 erros que já vi travarem venda em cartório.',
    metaTitle: 'Documentos para comprar imóvel em São Paulo: checklist completo | Silvia Helena',
    metaDescription: 'Veja documentos necessários para comprar imóvel em São Paulo: do comprador e do imóvel, com checklist e dicas da corretora Silvia Helena para evitar dor de cabeça no cartório.',
    author: 'Silvia Helena',
    datePublished: '2026-01-30',
    dateModified: '2026-03-05',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Documentos para comprar imóvel em São Paulo sobre mesa - checklist da corretora de imóveis Silvia Helena',
    readingTime: 7,
    category: 'Guias',
    region: 'geral',
    tags: ['documentos', 'comprar imóvel', 'cartório', 'checklist'],
    sections: [
      {
        id: 'resposta-direta',
        title: 'Resposta direta',
        content: `<p><strong>Para comprar um imóvel em São Paulo você precisa, basicamente: do comprador — RG, CPF, comprovante de renda e de residência, certidão de estado civil; do imóvel — matrícula atualizada (30 dias), IPTU quitado, certidões negativas do vendedor e, se financiado, aprovação bancária.</strong> Sem esses, o cartório não registra. O resto depende se é à vista, financiado ou imóvel com pendências.</p><p>Sou a Silvia Helena, corretora de imóveis há 15 anos, e já vi venda travar na véspera do registro por causa de uma certidão vencida. Por isso organizo tudo em checklist e confiro antes da proposta.</p>`
      },
      {
        id: 'documentos-comprador',
        title: 'Documentos do comprador: o que levar',
        content: `<ul>
          <li><strong>RG e CPF</strong> (ou CNH) — cópia e original.</li>
          <li><strong>Comprovante de residência</strong> (últimos 2 meses) e <strong>comprovante de renda</strong> (holerite, IR ou extrato de 3 meses). Banco pede 3x o valor da parcela.</li>
          <li><strong>Certidão de nascimento/casamento</strong> atualizada (90 dias). Se casado, cônjuge assina junto — regime de bens importa.</li>
          <li><strong>Certidões negativas</strong> (Justiça Federal, Estadual, Trabalhista) — cartório pode pedir para financiamento.</li>
        </ul>
        <p>Se for usar FGTS, leve extrato e carteira de trabalho. Para compra à vista, o banco não entra, mas o cartório ainda exige certidões.</p>`
      },
      {
        id: 'documentos-imovel',
        title: 'Documentos do imóvel e do vendedor: o que conferir',
        content: `<ul>
          <li><strong>Matrícula atualizada (30 dias)</strong> no Cartório de Registro de Imóveis — mostra dono real e se há hipoteca ou penhora. Já peguei imóvel com penhora trabalhista que não aparecia no anúncio.</li>
          <li><strong>IPTU e condomínio quitados</strong> — peça as últimas 3 parcelas e certidão de débitos da prefeitura. No Butantã, já vi IPTU atrasado de 2 anos travar financiamento.</li>
          <li><strong>Certidões do vendedor:</strong> negativas de protestos, ações cíveis e trabalhistas. Se o vendedor tem dívida, o imóvel pode ser bloqueado depois.</li>
          <li><strong>Habite-se e convenção do condomínio</strong> — para prédios. Verifique se pode reformar, ter pet grande ou alugar por curta temporada.</li>
        </ul>
        <p>Para casas em Taboão da Serra, confira também se a construção está averbada na matrícula. Muita casa com puxadinho não está — o banco não financia assim.</p>`
      },
      {
        id: 'financiado-vs-vista',
        title: 'Financiado vs à vista: muda a lista?',
        content: `<p><strong>Financiado:</strong> além dos acima, o banco pede avaliação do imóvel, comprovante de renda mais rigoroso e seguro. O prazo de aprovação é de 10 a 20 dias. Eu já preparo a pasta para o correspondente bancário não pedir documento duas vezes.</p>
        <p><strong>À vista:</strong> menos burocracia, mas o cartório ainda exige tudo do imóvel e do vendedor. A vantagem é fechar em 15 dias, sem avaliação.</p>
        <p>Em ambos, reserve 4-5% do valor para custos: ITBI (3% em SP), registro (1%), escritura e certidões.</p>`
      },
      {
        id: 'erros-comuns',
        title: '3 erros que já vi travarem venda em cartório',
        content: `<ol>
          <li><strong>Matrícula vencida:</strong> vale 30 dias. Muita gente leva de 60 dias e o cartório devolve. Peça nova na semana da assinatura.</li>
          <li><strong>Nome diferente:</strong> RG com nome de solteira e certidão de casamento com nome de casada — precisa atualizar. Já fez cliente perder sinal de R$ 20 mil.</li>
          <li><strong>Condomínio com ação:</strong> prédio em Morumbi com ação trabalhista do zelador bloqueou registro. Peço certidão do condomínio antes da proposta.</li>
        </ol>
        <p>Por isso, como sua corretora de imóveis, eu confiro tudo antes de você assinar proposta. Prefiro adiar uma semana do que ver seu dinheiro preso.</p>`
      },
      {
        id: 'checklist-final',
        title: 'Checklist final para não esquecer',
        content: `<p>Antes de assinar, confirme:</p>
        <ul>
          <li>☐ Matrícula atualizada + IPTU e condomínio quitados</li>
          <li>☐ Certidões do vendedor ok (protestos, ações)</li>
          <li>☐ Convenção do prédio lida (pet, reforma, locação)</li>
          <li>☐ Se financiado: aprovação bancária por escrito</li>
          <li>☐ Custos de ITBI e registro separados</li>
        </ul>
        <p>Quer que eu analise sua pasta? Me envie a matrícula e seu RG por WhatsApp — faço pré-checagem gratuita antes de marcar proposta. É assim que meus clientes assinam tranquilos.</p>`
      }
    ]
  }
];

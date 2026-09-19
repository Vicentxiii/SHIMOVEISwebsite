/**
 * Conteúdo único para páginas de região (300-500 palavras)
 * Otimizado para SEO e GEO: comprar, vender, alugar, imóveis, São Paulo
 */

export interface RegionData {
  slug: string;
  name: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string; // 80-100 palavras
  content: string[]; // 3-4 parágrafos = 300-500 palavras total
  highlights: string[];
  keywords: string[];
  coords: { lat: number; lng: number };
}

export const REGIONS: Record<string, RegionData> = {
  butanta: {
    slug: 'butanta',
    name: 'Butantã',
    title: 'Imóveis no Butantã, São Paulo',
    metaTitle: 'Apartamentos e Casas à venda no Butantã, SP | Comprar e Alugar Imóveis | Silvia Helena',
    metaDescription: 'Encontre imóveis para comprar e alugar no Butantã, São Paulo. Apartamentos, casas e coberturas com assessoria exclusiva Silvia Helena. Agende visita.',
    h1: 'Imóveis à venda no Butantã, São Paulo',
    intro: 'O Butantã é uma das regiões mais estratégicas de São Paulo para comprar, vender ou alugar imóveis. Com excelente infraestrutura, proximidade à USP, metrô e corredores comerciais, o bairro une valorização constante e qualidade de vida para famílias e investidores.',
    content: [
      'Comprar imóvel no Butantã é investir em uma região que não para de valorizar. O bairro oferece desde apartamentos compactos ideais para estudantes e jovens casais até casas amplas e coberturas de alto padrão próximas ao Parque Villa-Lobos e à Cidade Universitária. Quem busca alugar encontra opções versáteis a poucos minutos do centro, com fácil acesso pela Raposo Tavares, Marginal Pinheiros e linhas de ônibus e metrô. A rua Alvarenga, a avenida Vital Brasil e o entorno do Instituto Butantan concentram comércio diversificado, escolas renomadas e serviços essenciais.',
      'Vender seu imóvel no Butantã com a Silvia Helena Imóveis significa contar com avaliação precisa, fotos profissionais, divulgação premium nos principais portais e atendimento 100% consultivo. Trabalhamos venda e alocação com foco em negociação segura, documentação impecável e máxima visibilidade para atrair o comprador certo no menor tempo. Se você deseja alugar, cuidamos de toda a jornada: captação de inquilinos qualificados, vistoria, contrato e garantia locatícia.',
      'Nosso portfólio no Butantã inclui imóveis novos e usados, na planta e prontos para morar, com 1 a 4 dormitórios, varanda gourmet, lazer completo e vagas de garagem. Seja para morar, investir ou gerar renda de aluguel, a região entrega liquidez e demanda consistente. Agende uma visita guiada com Silvia Helena, corretora CRECISP 125743, e descubra oportunidades exclusivas, incluindo imóveis off-market que não estão nos portais tradicionais.'
    ],
    highlights: [
      'Apartamentos de 1 a 4 quartos no Butantã',
      'Casas e sobrados para comprar e alugar',
      'Próximo à USP, Metrô Butantã e Parque Villa-Lobos',
      'Valorização acima da média de São Paulo'
    ],
    keywords: ['imóveis Butantã', 'apartamentos à venda Butantã', 'casas para alugar Butantã', 'comprar imóvel Butantã SP', 'imobiliária Butantã'],
    coords: { lat: -23.573, lng: -46.722 },
  },
  'taboao-da-serra': {
    slug: 'taboao-da-serra',
    name: 'Taboão da Serra',
    title: 'Imóveis em Taboão da Serra, SP',
    metaTitle: 'Imóveis à venda em Taboão da Serra, SP | Casas e Apartamentos | Silvia Helena',
    metaDescription: 'Imóveis em Taboão da Serra para comprar, vender e alugar. Casas, apartamentos e terrenos com melhor custo-benefício da Grande SP. Fale com Silvia Helena.',
    h1: 'Imóveis à venda em Taboão da Serra, SP',
    intro: 'Taboão da Serra é a escolha inteligente para quem quer comprar ou alugar imóvel com ótimo custo-benefício e permanecer conectado a São Paulo. Colado ao Butantã e Morumbi, o município oferece casas espaçosas, apartamentos modernos e terrenos com preços mais acessíveis e alta demanda por locação.',
    content: [
      'Comprar imóvel em Taboão da Serra garante economia sem abrir mão de localização. Em bairros como Jardim Mirna, Pirajuçara, Parque Pinheiros e Centro, você encontra casas de 2 a 4 dormitórios com quintal, sobrados germinados e apartamentos novos com lazer completo e 1 a 3 vagas. O acesso rápido à Rodovia Régis Bittencourt, avenida Aprígio Bezerra da Silva e ao metrô facilita o deslocamento para São Paulo em minutos, ideal para famílias que trabalham na capital e buscam tranquilidade e segurança para morar.',
      'Para quem deseja vender em Taboão da Serra, a Silvia Helena Imóveis entrega estratégia completa: precificação baseada em dados reais de mercado, marketing direcionado para compradores que buscam a região e divulgação simultânea em portais, redes sociais e base qualificada. Cuidamos de fotos, tour virtual, documentação e intermediação até o registro em cartório. Se a meta é alugar, maximizamos sua rentabilidade com seleção rigorosa de inquilinos, contrato seguro e gestão transparente.',
      'Alugar imóvel em Taboão da Serra também é excelente para quem busca primeira moradia ou investimento para renda. A procura por aluguel residencial é forte, com ótima liquidez para proprietários. Nosso catálogo reúne oportunidades para todos os perfis e bolsos, desde imóveis econômicos até padrão médio-alto próximo ao shopping e ao centro comercial. Conte com atendimento humanizado e consultivo com Silvia Helena (CRECISP 125743) para encontrar o lar certo ou fechar a melhor venda.'
    ],
    highlights: [
      'Casas com quintal e 3 dormitórios',
      'Apartamentos novos com lazer completo',
      'A 10 minutos do Morumbi e Butantã',
      'Melhor custo por m² da Região Metropolitana'
    ],
    keywords: ['imóveis Taboão da Serra', 'casas à venda Taboão da Serra', 'apartamentos para alugar Taboão da Serra', 'comprar imóvel Taboão da Serra'],
    coords: { lat: -23.62, lng: -46.791 },
  },
  morumbi: {
    slug: 'morumbi',
    name: 'Morumbi',
    title: 'Imóveis de Alto Padrão no Morumbi, São Paulo',
    metaTitle: 'Imóveis de Luxo à venda no Morumbi, SP | Casas e Apartamentos | Silvia Helena',
    metaDescription: 'Imóveis de alto padrão no Morumbi, São Paulo. Mansões, apartamentos de luxo e coberturas para comprar e alugar. Consultoria premium Silvia Helena Imóveis.',
    h1: 'Imóveis de luxo à venda no Morumbi, São Paulo',
    intro: 'O Morumbi é sinônimo de luxo, exclusividade e sofisticação em São Paulo. Comprar ou alugar imóvel no Morumbi é morar em um dos endereços mais valorizados do Brasil, com mansões cinematográficas, apartamentos de alto padrão e condomínios fechados com segurança máxima, lazer resort e vista para a cidade.',
    content: [
      'O mercado de imóveis no Morumbi atende um público exigente que busca casas de 4 a 6 suítes com arquitetura assinada, terrenos amplos, piscina, gourmet e heliponto, além de apartamentos de 200 a 600 m² com pé-direito duplo, automação e vista para o Palácio do Governo ou para o Parque do Morumbi. Ruas como Avenida Morumbi, Rua Ver. José Diniz, bairro Cidade Jardim e entorno do Shopping Morumbi concentram o alto luxo paulistano, com colégios internacionais, hospitais de referência e acesso ágil à Marginal e à Berrini.',
      'Vender imóvel de luxo no Morumbi exige discrição, rede de compradores qualificados e apresentação impecável. A Silvia Helena Imóveis atua no formato boutique e off-market: avaliação patrimonial sigilosa, book fotográfico premium, tour em vídeo e negociação direta com family offices e investidores. Para locação de alto padrão, garantimos inquilinos de perfil compatível, contratos com garantias robustas e preservação total do seu patrimônio.',
      'Se você procura comprar para morar ou investir, o Morumbi oferece valorização histórica consistente e liquidez em todas as faixas de luxo. Nosso serviço vai além da transação: entregamos curadoria arquitetônica, análise de potencial de reforma e consultoria jurídica. Agende visita privativa com Silvia Helena e conheça imóveis exclusivos no Morumbi, incluindo oportunidades que não estão nos portais, com atendimento personalizado do primeiro contato à entrega das chaves.'
    ],
    highlights: [
      'Mansões de 500 a 1.200 m² no Morumbi',
      'Apartamentos de luxo com vista panorâmica',
      'Condomínios fechados com lazer resort',
      'Região mais valorizada da Zona Sul de SP'
    ],
    keywords: ['imóveis Morumbi', 'apartamentos luxo Morumbi', 'casas à venda Morumbi SP', 'imóvel alto padrão Morumbi', 'comprar no Morumbi'],
    coords: { lat: -23.6, lng: -46.705 },
  },
};

export const REGION_LIST = Object.values(REGIONS);

export function getRegionBySlug(slug: string): RegionData | undefined {
  // normaliza slug com ou sem acento
  const normalized = slug.toLowerCase().replace(/-/g, '');
  return Object.values(REGIONS).find(r => r.slug.replace(/-/g, '') === normalized || r.name.toLowerCase().replace(/[^a-z]/g, '') === normalized);
}

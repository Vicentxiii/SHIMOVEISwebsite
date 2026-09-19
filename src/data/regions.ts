/**
 * Conteúdo único para páginas de região (300-500 palavras)
 * Otimizado para SEO e GEO: comprar, vender, alugar, corretora de imóveis, São Paulo
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
    title: 'Imóveis à Venda e para Alugar no Butantã | Silvia Helena Corretora - CRECISP 125743',
    metaTitle: 'Imóveis à Venda e para Alugar no Butantã | Silvia Helena Corretora - CRECISP 125743',
    metaDescription: 'Descubra por que o Butantã atrai tantas famílias: proximidade com o metrô Linha 4-Amarela, USP, Parque Villa-Lobos e comércio da Vital Brasil. Veja imóveis à venda e para alugar no Butantã com a corretora Silvia Helena - CRECISP 125743.',
    h1: 'Imóveis à Venda e para Alugar no Butantã — Conforto, Metrô Linha 4-Amarela e Qualidade de Vida',
    intro: 'Morar no Butantã é ter metrô, USP e comércio na porta sem abrir mão de rua tranquila. Com a Linha 4-Amarela a minutos de casa e a USP ao lado, o bairro une conveniência, valorização e qualidade de vida para famílias e investidores.',
    content: [
      'Está se perguntando se vale comprar apartamento perto do metrô sem pagar absurdo? No Butantã, entre a estação e a Vital Brasil, você encontra prédios de 2 quartos com varanda e lazer — ótimos para primeiro corretora de imóveis ou para alugar para alunos da USP. Nas internas da Vila Gomes e City Butantã ainda aparecem casas com quintal onde dá para ouvir passarinho, e você continua a 15 minutos da Faria Lima pela Raposo ou Marginal. Nos últimos 15 anos, como corretora de imóveis, vendi de kitnets de 38m² ali na Alvarenga a sobrados na região do Instituto Butantan. Sei dizer, com honestidade, quais prédios têm condomínio justo e qual rua enche em dia de chuva.',
      'Quer vender? No Butantã o comprador decide rápido quando vê preço justo e fotos reais. Faço avaliação com base em vendas da própria rua — não em estimativa de portal. Cuido de fotos, divulgação nos portais certos e filtro de interessados para não perder seu tempo. Para alugar, seleciono inquilino com calma, vistoria de entrada e contrato claro. Você não lida com burocracia, eu resolvo até as chaves.',
      'No dia a dia você encontra aqui opções de 1 a 4 quartos, na planta ou prontas, com varanda gourmet e uma ou duas vagas. Muita gente compra para morar e, depois, mantém para alugar — a procura é constante por causa da USP e do comércio da Vital Brasil. Se me contar tamanho, rua preferida e valor, como sua corretora de imóveis te mostro o que está anunciado e também o que ainda nem foi para o portal. É assim que meus clientes acham sem precisar passar meses procurando.'
    ],
    highlights: [
      'Apartamentos de 1 a 4 quartos no Butantã',
      'Casas e sobrados para comprar e alugar',
      'Próximo à USP, Metrô Butantã e Parque Villa-Lobos',
      'Valorização acima da média de São Paulo'
    ],
    keywords: ['corretora de imóveis Butantã', 'apartamentos à venda Butantã com corretora', 'corretora para alugar Butantã', 'comprar com corretora Butantã SP', 'corretora de imóveis Butantã'],
    coords: { lat: -23.573, lng: -46.722 },
  },
  'taboao-da-serra': {
    slug: 'taboao-da-serra',
    name: 'Taboão da Serra',
    title: 'Imóveis Prontos para Morar e Financiar em Taboão da Serra | Silvia Helena',
    metaTitle: 'Imóveis Prontos para Morar e Financiar em Taboão da Serra | Silvia Helena',
    metaDescription: 'Saia do aluguel em 2026: imóveis prontos para morar e financiar em Taboão da Serra com crédito facilitado, documentação com CRECISP e parcelas que cabem no bolso. Veja casas e apartamentos com Silvia Helena.',
    h1: 'Imóveis Prontos para Morar e Financiar em Taboão da Serra — Do Aluguel para a Casa Própria',
    intro: 'Taboão da Serra é para quem quer quintal e espaço sem pagar preço de São Paulo, mas continuar a 10 minutos do Butantã — agora com crédito facilitado e imóveis prontos para financiar em 2026.',
    content: [
      'Famílias que me procuram no Taboão geralmente fazem a mesma conta: ‘Consigo casa com quintal por menos que um 2 quartos em SP?’ Aqui, nos bairros Jardim Mirna, Pirajuçara, Parque Pinheiros e Centro, a resposta costuma ser sim — e é onde entro como corretora de imóveis. São casas de 2 a 4 quartos onde o carro dorme coberto e ainda sobra espaço para churrasco, além de prédios novos com lazer e 1 a 3 vagas. Saindo pela Régis ou Aprígio Bezerra você chega no Butantã ou Morumbi em minutos — ótimo para quem trabalha na capital e quer voltar para rua calma à noite.',
      'Vender por aqui pede preço pé no chão. Conheço o valor de cada rua do Taboão porque já atendi como corretora de imóveis de casa em rua sem saída no Jardim Mirna a apartamento no Parque Pinheiros. Apresento com fotos reais e divulgação onde quem busca Taboão realmente procura. Se for alugar, não alugo para qualquer um — confiro renda e histórico, faço vistoria e contrato que te protege. Quero sua casa rendendo, não te dando dor de cabeça.',
      'Para quem pensa em alugar ou investir para renda com corretora de imóveis, o Taboão tem procura constante. Muita gente prefere pagar aluguel aqui e guardar dinheiro do que financiar pequeno em SP. Por isso casa bem cuidada não fica parada. Me conta seu orçamento e se prefere perto do Shopping Taboão ou mais em rua residencial — como sua corretora te mostro opções que fazem sentido para morar ou para manter alugado com tranquilidade.'
    ],
    highlights: [
      'Casas com quintal e 3 dormitórios',
      'Apartamentos novos com lazer completo',
      'A 10 minutos do Morumbi e Butantã',
      'Melhor custo por m² da Região Metropolitana'
    ],
    keywords: ['corretora de imóveis Taboão da Serra', 'corretora para casas Taboão da Serra', 'corretora para alugar Taboão da Serra', 'comprar com corretora Taboão da Serra'],
    coords: { lat: -23.62, lng: -46.791 },
  },
  morumbi: {
    slug: 'morumbi',
    name: 'Morumbi',
    title: 'Casas e Apartamentos de Luxo à Venda no Morumbi | Silvia Helena Imóveis',
    metaTitle: 'Casas e Apartamentos de Luxo à Venda no Morumbi | Silvia Helena Imóveis',
    metaDescription: 'Morar no Morumbi é viver com segurança em condomínios fechados, colégios de ponta como Porto Seguro e Santo Américo, e apartamentos de luxo com lazer completo. Veja casas e apartamentos de luxo à venda no Morumbi com Silvia Helena.',
    h1: 'Casas e Apartamentos de Luxo à Venda no Morumbi — Condomínios Fechados e Sofisticação',
    intro: 'O Morumbi é sossego com conveniência: ruas arborizadas, condomínios fechados com segurança 24h, colégios de ponta e ainda 15 minutos da Faria Lima.',
    content: [
      'Quem me pergunta ‘como é morar no Morumbi no dia a dia?’ eu respondo como corretora de imóveis que acompanha a região há anos: na Avenida Morumbi e no entorno do Shopping Morumbi e Cidade Jardim, você encontra casas de 4 a 6 suítes com quintal grande e apartamentos de 200 a 600m² com varanda e vista para o parque. É a região de quem busca silêncio à noite, colégios como Porto Seguro e Santo Américo perto, e Hospital Albert Einstein a poucos minutos — sem ficar isolado do trabalho na Marginal/Berrini.',
      'Vender no Morumbi pede discrição e conversa certa. Muitos bons negócios aqui fecham sem placa, com visita marcada com antecedência. Quando me confiam a venda como corretora de imóveis, preparo book com fotos à luz certa, vídeo curto e apresento só para quem realmente busca esse padrão — nada de curiosos circulando. Para alugar, seleciono perfil compatível e contrato com garantias sólidas. Seu corretora de imóveis continua impecável.',
      'Se a ideia é comprar para morar com tranquilidade ou manter patrimônio com corretora de imóveis, o Morumbi tem procura estável há anos. Mas cada rua tem preço diferente — uma quadra muda tudo. Te mostro na visita como corretora o que funciona bem hoje e o que pode pesar na revenda, com avaliação honesta e documentação checada antes de assinar. Me chama para uma visita sem pressa; você decide com calma.'
    ],
    highlights: [
      'Mansões de 500 a 1.200 m² no Morumbi',
      'Apartamentos de luxo com vista panorâmica',
      'Condomínios fechados com lazer resort',
      'Região mais valorizada da Zona Sul de SP'
    ],
    keywords: ['corretora de imóveis Morumbi', 'corretora luxo Morumbi', 'corretora para casas Morumbi SP', 'corretora alto padrão Morumbi', 'comprar com corretora no Morumbi'],
    coords: { lat: -23.6, lng: -46.705 },
  },
};

export const REGION_LIST = Object.values(REGIONS);

export function getRegionBySlug(slug: string): RegionData | undefined {
  // normaliza slug com ou sem acento
  const normalized = slug.toLowerCase().replace(/-/g, '');
  return Object.values(REGIONS).find(r => r.slug.replace(/-/g, '') === normalized || r.name.toLowerCase().replace(/[^a-z]/g, '') === normalized);
}

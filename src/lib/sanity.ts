import {createClient} from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const sanityClient = createClient({
  projectId: 'wpe14gsf',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
  perspective: 'published',
})

const builder = imageUrlBuilder(sanityClient)

export function urlFor(source: any) {
  return builder.image(source)
}

// Tipo que vem do Sanity (conforme schema imovel)
export interface SanityImovel {
  _id: string
  _createdAt: string
  titulo: string
  slug: {current: string}
  tipo: 'Apartamento' | 'Casa' | 'Terreno' | 'Comercial' | 'Studio/Kitnet'
  regiao: 'Butantã' | 'Taboão da Serra' | 'Morumbi'
  endereco: string
  valor: number
  finalidade: 'Venda' | 'Aluguel'
  area: number
  quartos: number
  banheiros: number
  vagas: number
  descricao?: any[] // Portable Text
  fotos: any[]
  publicado: boolean
}

// Busca todos os imóveis publicados, mais recentes primeiro
export async function fetchImoveisPublicados(): Promise<SanityImovel[]> {
  const query = `*[_type == "imovel" && publicado == true] | order(_createdAt desc){
    _id, _createdAt, titulo, slug, tipo, regiao, endereco, valor, finalidade, area, quartos, banheiros, vagas, descricao, fotos, publicado
  }`
  try {
    const data = await sanityClient.fetch<SanityImovel[]>(query)
    return data || []
  } catch (e) {
    console.warn('[Sanity] Falha ao buscar imóveis, usando fallback', e)
    return []
  }
}

// Busca por região específica
export async function fetchImoveisPorRegiao(regiao: string): Promise<SanityImovel[]> {
  const query = `*[_type == "imovel" && publicado == true && regiao == $regiao] | order(_createdAt desc){
    _id, _createdAt, titulo, slug, tipo, regiao, endereco, valor, finalidade, area, quartos, banheiros, vagas, descricao, fotos, publicado
  }`
  try {
    const data = await sanityClient.fetch<SanityImovel[]>(query, {regiao})
    return data || []
  } catch (e) {
    console.warn(`[Sanity] Falha ao buscar imóveis de ${regiao}`, e)
    return []
  }
}

// Converte SanityImovel para formato usado pelo site (compatível com PropertyCard)
// Mantém campos essenciais para exibir com CDN do Sanity já otimizado
export function sanityToProperty(imovel: SanityImovel) {
  const primeiraFoto = imovel.fotos?.[0] ? urlFor(imovel.fotos[0]).width(800).height(500).fit('crop').auto('format').url() : ''
  const galeria = (imovel.fotos || []).map((f: any) => urlFor(f).width(1200).height(750).fit('crop').auto('format').url())

  // Formata valor para R$ 520.000
  const formattedPrice = new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL', maximumFractionDigits: 0}).format(imovel.valor)

  // Descrição: pega texto simples do Portable Text ou fallback
  let descricaoTexto = ''
  if (Array.isArray(imovel.descricao)) {
    descricaoTexto = imovel.descricao
      .map((block: any) => (block.children ? block.children.map((c: any) => c.text).join('') : ''))
      .join('\n\n')
  }

  return {
    id: imovel._id,
    title: imovel.titulo,
    type: imovel.tipo as any,
    location: `${imovel.regiao}, São Paulo`,
    // Para filtros numéricos, mantemos valor original (em reais) mas também calculamos em milhões para compatibilidade antiga
    price: imovel.valor / 1000000,
    formattedPrice,
    valorRaw: imovel.valor,
    finalidade: imovel.finalidade,
    bedrooms: imovel.quartos,
    bathrooms: imovel.banheiros,
    garage: imovel.vagas,
    area: `${imovel.area} m²`,
    areaRaw: imovel.area,
    image: primeiraFoto,
    gallery: galeria.length ? galeria : [primeiraFoto],
    description: descricaoTexto || `Imóvel ${imovel.tipo} em ${imovel.regiao} - ${imovel.endereco}`,
    endereco: imovel.endereco,
    features: [imovel.tipo, imovel.finalidade, `${imovel.area}m²`],
    hasSwimmingPool: false,
    hasGarden: false,
    hasOceanView: false,
    isPetFriendly: true,
    tagline: `${imovel.tipo} em ${imovel.regiao} • ${formattedPrice}`,
    slug: imovel.slug?.current || '',
    _createdAt: imovel._createdAt,
  }
}

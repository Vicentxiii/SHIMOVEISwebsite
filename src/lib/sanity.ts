import {createClient} from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const sanityClient = createClient({
  projectId: 'wpe14gsf',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
  perspective: 'published',
})

// Cliente de ESCRITA para o painel /admin — OBRIGATÓRIO: useCdn:false + token permanente com permissão de ESCRITA
const adminToken =
  ((import.meta as any).env?.VITE_SANITY_API_WRITE_TOKEN as string | undefined) ||
  ((import.meta as any).env?.VITE_SANITY_WRITE_TOKEN as string | undefined) ||
  ((import.meta as any).env?.VITE_SANITY_TOKEN as string | undefined) ||
  undefined

export const sanityAdminClient = adminToken
  ? createClient({
      projectId: ((import.meta as any).env?.VITE_SANITY_PROJECT_ID as string | undefined) || 'wpe14gsf',
      dataset: ((import.meta as any).env?.VITE_SANITY_DATASET as string | undefined) || 'production',
      apiVersion: '2024-01-01',
      token: adminToken,
      useCdn: false,
      perspective: 'raw',
    })
  : null

export function hasAdminToken(): boolean {
  return !!adminToken && !!sanityAdminClient
}

export function getAdminToken(): string | undefined {
  return adminToken
}

const builder = imageUrlBuilder(sanityClient)
export const adminBuilder = sanityAdminClient ? imageUrlBuilder(sanityAdminClient) : builder

export function urlFor(source: any) {
  return builder.image(source)
}

// Tipo completo que vem do Sanity
export interface SanityImovel {
  _id: string
  _createdAt: string
  titulo: string
  slug: {current: string}
  tipo: string
  categoriaUso?: 'Residencial' | 'Comercial'
  andar?: string
  regiao: 'Butantã' | 'Taboão da Serra' | 'Morumbi'
  endereco: string
  rua?: string
  numero?: string
  complemento?: string
  bairro?: string
  cidade?: string
  cep?: string
  mostrarEndereco?: 'completo' | 'rua' | 'bairro'
  valor: number
  finalidade: 'Venda' | 'Aluguel'
  area: number
  quartos: number
  banheiros: number
  vagas: number
  descricao?: any[] // Portable Text
  fotos: any[]
  publicado: boolean
  isPetFriendly?: boolean
  hasSwimmingPool?: boolean
  hasGarden?: boolean
  hasOceanView?: boolean
  latitude?: number
  longitude?: number
  caracteristicasImovel?: string[]
  sobreCondominio?: {
    numeroAndares?: string
    unidadesPorAndar?: string
    numeroTorres?: string
    anoConstrucao?: string
  }
  caracteristicasCondominio?: string[]
  outrasCaracteristicasImovel?: string[]
  outrasCaracteristicasCondominio?: string[]
}

const PROJECAO_CAMPOS = `{
  _id, _createdAt, titulo, slug, tipo, categoriaUso, andar, regiao,
  endereco, rua, numero, complemento, bairro, cidade, cep, mostrarEndereco,
  valor, finalidade, area, quartos, banheiros, vagas, descricao, fotos, publicado,
  isPetFriendly, hasSwimmingPool, hasGarden, hasOceanView, latitude, longitude,
  caracteristicasImovel, sobreCondominio, caracteristicasCondominio,
  outrasCaracteristicasImovel, outrasCaracteristicasCondominio
}`

// Busca todos os imóveis publicados, mais recentes primeiro
export async function fetchImoveisPublicados(): Promise<SanityImovel[]> {
  const query = `*[_type == "imovel" && publicado == true] | order(_createdAt desc) ${PROJECAO_CAMPOS}`
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
  const query = `*[_type == "imovel" && publicado == true && regiao == $regiao] | order(_createdAt desc) ${PROJECAO_CAMPOS}`
  try {
    const data = await sanityClient.fetch<SanityImovel[]>(query, {regiao})
    return data || []
  } catch (e) {
    console.warn(`[Sanity] Falha ao buscar imóveis de ${regiao}`, e)
    return []
  }
}

// Converte SanityImovel para formato usado pelo site
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

  // Formata a localização pública respeitando mostrarEndereco
  const mostrar = imovel.mostrarEndereco || 'completo'
  let locationPublica = ''
  if (mostrar === 'bairro') {
    locationPublica = imovel.bairro ? `${imovel.bairro} — ${imovel.regiao}, São Paulo` : `${imovel.regiao}, São Paulo`
  } else if (mostrar === 'rua') {
    const parteRua = imovel.rua || imovel.endereco?.split(',')[0] || ''
    locationPublica = parteRua ? `${parteRua}, ${imovel.bairro || imovel.regiao} — São Paulo` : `${imovel.regiao}, São Paulo`
  } else {
    // completo
    locationPublica = imovel.endereco ? `${imovel.endereco} — ${imovel.regiao}, São Paulo` : `${imovel.regiao}, São Paulo`
  }

  return {
    id: imovel._id,
    title: imovel.titulo,
    type: imovel.tipo as any,
    categoriaUso: imovel.categoriaUso || 'Residencial',
    andar: imovel.andar || '',
    location: locationPublica,
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
    description: descricaoTexto || `Imóvel ${imovel.tipo} em ${imovel.regiao} - ${locationPublica}`,
    endereco: imovel.endereco,
    rua: imovel.rua,
    numero: imovel.numero,
    complemento: imovel.complemento,
    bairro: imovel.bairro,
    cidade: imovel.cidade,
    cep: imovel.cep,
    mostrarEndereco: imovel.mostrarEndereco || 'completo',
    latitude: (imovel as any).latitude as number | undefined,
    longitude: (imovel as any).longitude as number | undefined,
    features: [imovel.tipo, imovel.finalidade, `${imovel.area}m²`],
    hasSwimmingPool: !!(imovel as any).hasSwimmingPool,
    hasGarden: !!(imovel as any).hasGarden,
    hasOceanView: !!(imovel as any).hasOceanView,
    isPetFriendly: (imovel as any).isPetFriendly !== undefined ? !!(imovel as any).isPetFriendly : true,
    caracteristicasImovel: imovel.caracteristicasImovel || [],
    sobreCondominio: imovel.sobreCondominio || {},
    caracteristicasCondominio: imovel.caracteristicasCondominio || [],
    outrasCaracteristicasImovel: imovel.outrasCaracteristicasImovel || [],
    outrasCaracteristicasCondominio: imovel.outrasCaracteristicasCondominio || [],
    tagline: `${imovel.tipo} em ${imovel.regiao} • ${formattedPrice}`,
    slug: imovel.slug?.current || '',
    _createdAt: imovel._createdAt,
  }
}

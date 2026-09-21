export interface GeocodeResult {
  lat: number
  lng: number
  displayName: string
  address: any
}

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org'

function buildQuery(endereco: string, regiao?: string) {
  const parts = [endereco.trim()]
  if (regiao) parts.push(regiao)
  // garante contexto Brasil/SP para melhorar precisão
  parts.push('São Paulo', 'Brasil')
  return parts.filter(Boolean).join(', ')
}

export async function searchAddress(query: string, regiao?: string): Promise<GeocodeResult[]> {
  if (!query || query.trim().length < 3) return []
  const q = buildQuery(query, regiao)
  const url = `${NOMINATIM_BASE}/search?format=json&addressdetails=1&limit=5&countrycodes=br&q=${encodeURIComponent(q)}`
  const res = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      // Nominatim exige User-Agent identificável, mas browser não permite setar; usa Accept-Language
    },
  })
  if (!res.ok) throw new Error(`Geocode falhou ${res.status}`)
  const data = await res.json()
  return (data || []).map((item: any) => ({
    lat: parseFloat(item.lat),
    lng: parseFloat(item.lon),
    displayName: item.display_name,
    address: item.address,
  }))
}

export async function geocodeAddress(address: string, regiao?: string): Promise<GeocodeResult | null> {
  const results = await searchAddress(address, regiao)
  return results[0] || null
}

export function getOSMEmbedUrl(lat: number, lng: number, zoom = 16) {
  const delta = zoomToDelta(zoom)
  const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}#map=${zoom}/${lat}/${lng}`
}

export function getGoogleMapsEmbedUrl(lat: number, lng: number, query?: string) {
  // usa google maps embed sem API key via q
  if (query) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=16&output=embed`
  }
  return `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`
}

export function getGoogleMapsLink(lat?: number, lng?: number, address?: string, regiao?: string) {
  if (lat != null && lng != null) return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
  if (address) {
    const q = buildQuery(address, regiao)
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`
  }
  return 'https://www.google.com/maps'
}

export function getOSMLink(lat: number, lng: number) {
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`
}

function zoomToDelta(zoom: number) {
  // ~0.005 = ~500m em zoom 16, ajusta por zoom
  const base = 0.005
  const diff = 16 - zoom
  return base * Math.pow(2, diff)
}

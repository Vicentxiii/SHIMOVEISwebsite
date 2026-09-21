import React from 'react'
import { MapPin, ExternalLink, Navigation } from 'lucide-react'
import { getGoogleMapsEmbedUrl, getGoogleMapsLink, getOSMEmbedUrl, getOSMLink } from '../utils/geocode'

type Props = {
  latitude?: number | null
  longitude?: number | null
  endereco?: string
  regiao?: string
  title?: string
  heightClass?: string
  showLinks?: boolean
  provider?: 'osm' | 'google'
}

export const MiniMap: React.FC<Props> = ({
  latitude,
  longitude,
  endereco,
  regiao,
  title,
  heightClass = 'h-[280px]',
  showLinks = true,
  provider = 'osm',
}) => {
  const hasCoords = latitude != null && longitude != null && !isNaN(Number(latitude)) && !isNaN(Number(longitude))
  const lat = hasCoords ? Number(latitude) : null
  const lng = hasCoords ? Number(longitude) : null

  // fallback: se não tem coords mas tem endereço, usa query no google embed
  const embedUrl = hasCoords
    ? provider === 'google'
      ? getGoogleMapsEmbedUrl(lat!, lng!)
      : getOSMEmbedUrl(lat!, lng!, 16)
    : endereco
      ? getGoogleMapsEmbedUrl(0, 0, `${endereco}${regiao ? ', ' + regiao : ''}, São Paulo, Brasil`)
      : null

  const googleLink = getGoogleMapsLink(lat ?? undefined, lng ?? undefined, endereco, regiao)
  const osmLink = hasCoords ? getOSMLink(lat!, lng!) : null

  if (!embedUrl) {
    return (
      <div className={`relative ${heightClass} rounded-xl bg-[#1f0912] border border-brand-light/5 flex items-center justify-center overflow-hidden`}>
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `linear-gradient(rgba(212,163,115,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(212,163,115,0.5) 1px, transparent 1px)`, backgroundSize: '30px 30px' }} aria-hidden="true" />
        <div className="relative text-center p-3 bg-brand-bg/90 backdrop-blur-md border border-brand-light/10 rounded-xl max-w-[90%]">
          <p className="text-[10px] tracking-[0.18em] text-brand-gold uppercase font-light">LOCALIZAÇÃO</p>
          <p className="text-xs text-brand-muted mt-1">Endereço não informado</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className={`relative ${heightClass} rounded-xl overflow-hidden border border-brand-light/10 bg-[#1f0912]`}>
        <iframe
          title={title || `Mapa de ${endereco || regiao || 'imóvel'}`}
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
        {/* pin overlay label */}
        {hasCoords && (
          <div className="absolute top-2 left-2 bg-brand-bg/90 backdrop-blur-md border border-brand-light/10 rounded-full px-2.5 py-1 flex items-center gap-1.5 shadow-md">
            <MapPin size={12} className="text-brand-gold" />
            <span className="text-[11px] text-brand-light font-light truncate max-w-[200px]">{endereco || regiao || 'Local exato'}</span>
          </div>
        )}
      </div>
      {showLinks && (
        <div className="flex flex-wrap gap-2">
          <a
            href={googleLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[12px] font-medium text-brand-gold hover:text-[#e0b48a] transition border border-brand-gold/20 hover:border-brand-gold/40 bg-brand-gold/5 hover:bg-brand-gold/10 px-3 py-1.5 rounded-full"
          >
            <Navigation size={12} /> Abrir no Google Maps <ExternalLink size={11} className="opacity-60" />
          </a>
          {osmLink && provider === 'osm' && (
            <a
              href={osmLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[12px] font-light text-brand-muted hover:text-brand-light transition border border-brand-light/10 hover:border-brand-light/20 bg-white/[0.02] px-3 py-1.5 rounded-full"
            >
              Ver no OpenStreetMap <ExternalLink size={11} className="opacity-40" />
            </a>
          )}
          {hasCoords && (
            <span className="inline-flex items-center text-[10px] tracking-wide text-brand-muted/60 px-2 py-1">
              {lat?.toFixed(6)}, {lng?.toFixed(6)}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

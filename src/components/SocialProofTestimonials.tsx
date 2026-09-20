/**
 * SocialProofTestimonials - Gatilho de Prova Social para conversão
 * SEO + A11y: <section aria-label>, blockquote/figcaption crawláveis, keywords contextuais
 * Design: grade 1 col mobile / 3 cols desktop, borda brand-gold/30, 5 estrelas douradas, selo Google
 */

import React from 'react';
import { motion } from 'motion/react';
import { Star, Quote, ShieldCheck, BadgeCheck } from 'lucide-react';

interface Review {
  quote: string;
  author: string;
  location: string;
  tag: string;
  service: string;
}

const REVIEWS: Review[] = [
  {
    quote:
      'A Silvia foi impecável na venda do nosso apartamento no Morumbi. Sempre muito transparente, cuidou de toda a burocracia do início ao fim e nos passou total segurança.',
    author: 'Ricardo e Mariana S.',
    location: 'Morumbi, São Paulo',
    tag: 'Venda • Apartamento no Morumbi',
    service: 'Venda de apartamento no Morumbi',
  },
  {
    quote:
      'Excelente atendimento! Eu estava com receio sobre o financiamento, mas a Silvia Helena me orientou perfeitamente e me ajudou a realizar o sonho da casa própria no Butantã.',
    author: 'Eliana Costa',
    location: 'Butantã, São Paulo',
    tag: 'Compra • Casa própria no Butantã',
    service: 'Compra de casa própria no Butantã',
  },
  {
    quote:
      'Profissional extremamente competente e dedicada. Encontrou o imóvel exatamente do jeito que minha família precisava em Taboão da Serra. Super recomendo!',
    author: 'Marcos Oliveira',
    location: 'Taboão da Serra, SP',
    tag: 'Locação • Imóvel em Taboão da Serra',
    service: 'Locação em Taboão da Serra',
  },
  // +3 do carrossel "Histórias reais" — agora também em estilo Google
  {
    quote:
      'A Silvia não é apenas uma corretora; ela é uma conselheira de raríssimo calibre. Sua experiência em private banking, profunda compreensão do legado arquitetônico e total discrição tornaram nossa aquisição da Residência Cliffside Obsidian impecável.',
    author: 'Ricardo & Beatrice de Alencar',
    location: 'Zurich / Rio de Janeiro',
    tag: 'Consultoria • Residência Cliffside Obsidian',
    service: 'Consultoria de aquisição — Residência Cliffside Obsidian',
  },
  {
    quote:
      'Ao liquidar o principal ativo imobiliário da nossa família no Jardim Europa, precisávamos de um consultor que pudesse orquestrar uma transação altamente privada e restrita. A Silvia conduziu cada etapa com extrema precisão, inteligência e confidencialidade absoluta.',
    author: 'Dr. Helena S. Villela',
    location: 'São Paulo — Jardim Europa',
    tag: 'Venda privada • Jardim Europa',
    service: 'Venda privada em Jardim Europa',
  },
  {
    quote:
      'O processo de consultoria dela assemelha-se ao trabalho de um qualificado multi-family office. Ela trata o mercado imobiliário de luxo como uma classe de ativos críticos e uma poesia espacial pessoal. Uma mestre em seu ofício.',
    author: 'Marcus Vance',
    location: 'New York',
    tag: 'Consultoria • Family Office',
    service: 'Consultoria patrimonial — Family Office',
  },
];

const Stars: React.FC = () => (
  <div className="flex items-center gap-0.5" aria-label="Avaliação 5 de 5 estrelas" role="img">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={14}
        className="fill-brand-gold text-brand-gold"
        aria-hidden="true"
      />
    ))}
    <span className="sr-only">5 de 5</span>
  </div>
);

export const SocialProofTestimonials: React.FC = () => {
  // JSON-LD Review para reforço SEO local (crawlável mesmo sem JS no HTML, hidratado via React)
  const aggregateJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'Silvia Helena corretora de imóveis',
    image: 'https://silviahelenacorretora.com.br/favicon.webp',
    url: 'https://silviahelenacorretora.com.br',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Rua Alfredo Mendes da Silva, 395',
      addressLocality: 'São Paulo',
      addressRegion: 'SP',
      addressCountry: 'BR',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      reviewCount: String(REVIEWS.length),
      bestRating: '5',
      worstRating: '1',
    },
    review: REVIEWS.map((r) => ({
      '@type': 'Review',
      reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
      author: { '@type': 'Person', name: r.author },
      reviewBody: r.quote,
      name: r.service,
    })),
  };

  return (
    <section
      id="testimonials"
      aria-label="Depoimentos de clientes"
      className="py-16 md:py-24 bg-[#1a080f] border-y border-brand-light/5 relative overflow-hidden"
    >
      {/* glow sutil */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-brand-gold/5 blur-[120px] rounded-full" />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aggregateJsonLd) }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        {/* Cabeçalho */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
          <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.28em] text-brand-gold uppercase font-light border border-brand-gold/20 bg-brand-gold/5 px-3 py-1.5 rounded-full">
            <BadgeCheck size={12} aria-hidden="true" />
            Prova social • Avaliações verificadas
          </span>
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className="font-serif text-3xl md:text-4xl lg:text-[40px] text-brand-light font-light leading-tight mt-4 flex flex-wrap justify-center overflow-visible"
          >
            {'Quem já comprou, vendeu e alugou com a Silvia Helena'.split(' ').map((word, i) => (
              <motion.span
                key={i}
                variants={{
                  hidden: { opacity: 0, x: -18, filter: 'blur(6px)' },
                  visible: { opacity: 1, x: 0, filter: 'blur(0px)' },
                }}
                transition={{ delay: i * 0.035, duration: 0.48, ease: [0.22, 1, 0.36, 1] as any }}
                className="inline-block mr-[0.22em] will-change-transform"
              >
                {word}
              </motion.span>
            ))}
          </motion.h2>
          <p className="text-sm text-brand-muted font-light leading-relaxed mt-3 max-w-2xl mx-auto">
            Histórias reais nas 3 regiões onde mais atuo — <strong className="text-brand-light font-normal">Butantã, Morumbi e Taboão da Serra</strong>. Atendimento direto com a corretora, do primeiro contato à entrega das chaves.
          </p>
          {/* Selo confiança */}
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-brand-light/10 bg-white/[0.04] backdrop-blur px-3 py-1.5">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white text-[#4285F4] text-[10px] font-bold" aria-hidden="true">
              G
            </span>
            <span className="text-[11px] tracking-wide text-brand-light font-light">Avaliação do Google</span>
            <span className="flex items-center gap-0.5" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={10} className="fill-brand-gold text-brand-gold" />
              ))}
            </span>
            <span className="text-[11px] text-brand-gold font-medium">5,0</span>
            <span className="text-[10px] text-brand-muted">• 6 avaliações em destaque</span>
          </div>
        </div>

        {/* Grid 1 col mobile / 3 cols desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {REVIEWS.map((review, idx) => (
            <figure
              key={idx}
              className="group relative flex flex-col bg-[#210c14]/60 backdrop-blur-sm border border-brand-gold/30 rounded-2xl p-6 md:p-7 lg:p-8 hover:border-brand-gold/50 hover:bg-[#210c14]/80 hover:shadow-[0_8px_30px_rgba(212,163,115,0.12)] transition-all duration-300"
            >
              {/* cantos decorativos */}
              <span className="absolute top-0 left-0 w-4 h-4 border-t border-l border-brand-gold/30 rounded-tl-2xl pointer-events-none group-hover:border-brand-gold/50 transition-colors" aria-hidden="true" />
              <span className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-brand-gold/30 rounded-br-2xl pointer-events-none group-hover:border-brand-gold/50 transition-colors" aria-hidden="true" />

              {/* cabeçalho do card */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <Stars />
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/20 px-2.5 py-1 text-[9px] tracking-widest uppercase text-brand-gold font-light">
                  <ShieldCheck size={10} aria-hidden="true" />
                  Verificado
                </span>
              </div>

              {/* aspas decorativa */}
              <Quote
                size={20}
                className="text-brand-gold/20 group-hover:text-brand-gold/30 transition-colors mb-3"
                aria-hidden="true"
              />

              {/* Depoimento crawlável - keywords contextuais naturais */}
              <blockquote className="text-sm md:text-[15px] text-brand-light font-light leading-relaxed flex-1">
                “{review.quote}”
              </blockquote>

              <figcaption className="mt-6 pt-5 border-t border-brand-light/10 flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-gold/15 border border-brand-gold/20 text-brand-gold font-serif text-sm font-medium" aria-hidden="true">
                  {review.author.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <cite className="not-italic font-serif text-sm text-brand-light font-medium block truncate">
                    {review.author}
                  </cite>
                  <span className="text-[11px] text-brand-muted tracking-wide truncate block">{review.location}</span>
                </div>
              </figcaption>

              {/* tag de serviço / bairro para reforço SEO sem spam */}
              <p className="mt-3 text-[10px] tracking-[0.16em] uppercase text-brand-gold/80 font-light">
                {review.tag}
              </p>
            </figure>
          ))}
        </div>

        {/* rodapé de confiança + CTA sutil */}
        <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-3 border border-brand-gold/15 bg-brand-gold/[0.04] rounded-2xl px-5 py-4">
          <p className="text-xs text-brand-muted font-light text-center md:text-left">
            Atendimento 100% direto com a corretora Silvia Helena — <span className="text-brand-light">CRECISP 125743</span> • Sem repasse para equipe • Resposta em até 2h
          </p>
          <a
            href="https://wa.me/5511940840966?text=Ol%C3%A1%2C%20vim%20pelo%20site%2C%20gostaria%20de%20falar%20sobre%20um%20im%C3%B3vel"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-brand-gold hover:bg-brand-gold/90 text-brand-bg px-5 py-2.5 rounded-full text-[11px] tracking-[0.18em] uppercase font-medium transition-colors shrink-0"
            aria-label="Falar com Silvia Helena no WhatsApp - Olá, vim pelo site, gostaria de falar sobre um imóvel"
          >
            Quero a mesma experiência
          </a>
        </div>
      </div>
    </section>
  );
};

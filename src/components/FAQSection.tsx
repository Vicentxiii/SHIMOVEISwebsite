import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export interface FAQItem {
  question: string;
  answer: string;
}

export const FAQ_DATA: FAQItem[] = [
  {
    question: 'Como comprar um imóvel no Butantã, Morumbi ou Taboão da Serra com segurança?',
    answer: 'Comprar imóvel nessas regiões exige análise de documentação, avaliação de mercado e negociação estratégica. A Silvia Helena Imóveis realiza vistoria técnica, checagem de matrícula, certidões e intermediação completa até o registro em cartório. Atendemos compra à vista e financiada, com assessoria jurídica e suporte para financiamento bancário.',
  },
  {
    question: 'Quanto custa um apartamento de 2 quartos no Butantã ou Taboão da Serra?',
    answer: 'Em 2026, apartamentos de 2 quartos no Butantã variam de R$ 380 mil a R$ 750 mil dependendo do padrão e proximidade do metrô; em Taboão da Serra, de R$ 250 mil a R$ 500 mil, com excelente custo-benefício; no Morumbi, imóveis de 2 quartos de alto padrão partem de R$ 900 mil. Fazemos avaliação gratuita e precisa do seu imóvel para venda ou compra.',
  },
  {
    question: 'Vale a pena investir em imóveis para alugar no Morumbi e Butantã?',
    answer: 'Sim. Morumbi e Butantã têm alta liquidez para locação devido à demanda de estudantes da USP, profissionais da Faria Lima/Berrini e famílias. O yield médio de aluguel residencial fica entre 0,4% e 0,6% ao mês sobre o valor do imóvel. Gerenciamos locação com garantia, vistoria e contrato seguro para maximizar sua rentabilidade.',
  },
  {
    question: 'Como vender meu imóvel rápido em São Paulo e receber o melhor preço?',
    answer: 'Para vender rápido e bem em Butantã, Morumbi ou Taboão da Serra, é essencial precificação baseada em dados reais, fotos profissionais, tour virtual e divulgação nos principais portais (ZAP, VivaReal, OLX) e base qualificada. A Silvia Helena cuida de toda a estratégia, negociação e burocracia, incluindo imóveis off-market com discrição total.',
  },
  {
    question: 'Quais documentos são necessários para alugar um imóvel?',
    answer: 'Para alugar, o inquilino precisa de RG, CPF, comprovante de renda (3x o valor do aluguel) e comprovante de residência. Aceitamos caução, seguro-fiança, fiador e título de capitalização. O proprietário deve apresentar matrícula atualizada, IPTU e certidões negativas. Cuidamos de contrato, vistoria de entrada e saída e garantias.',
  },
  {
    question: 'A Silvia Helena atende imóveis na planta e lançamentos?',
    answer: 'Sim. Atendemos imóveis novos, usados, na planta e lançamentos das principais construtoras em São Paulo. Se você busca comprar na planta no Butantã ou Morumbi como investimento, orientamos sobre memorial descritivo, cronograma de obras e valorização, com acompanhamento até a entrega das chaves.',
  },
];

export const FAQSection: React.FC = () => {
  const [open, setOpen] = useState<number | null>(0);

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_DATA.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <section id="faq" className="py-16 md:py-24 bg-[#1a080f] border-t border-brand-light/5" aria-labelledby="faq-heading">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 text-xs tracking-[0.3em] text-brand-gold uppercase font-light">
            <HelpCircle size={12} /> Perguntas Frequentes
          </span>
          <h2 id="faq-heading" className="font-serif text-3xl md:text-4xl text-brand-light font-light mt-3">
            Dúvidas sobre comprar, vender e alugar imóveis em São Paulo
          </h2>
          <p className="text-sm text-brand-muted mt-3 font-light">
            Respostas otimizadas para você e para IAs como ChatGPT, Perplexity e Gemini encontrarem a Silvia Helena.
          </p>
        </div>

        <div className="space-y-3" role="list">
          {FAQ_DATA.map((item, idx) => (
            <div key={idx} role="listitem" className="border border-brand-light/10 rounded-xl overflow-hidden bg-brand-bg/40 hover:border-brand-gold/30 transition-colors">
              <button
                onClick={() => setOpen(open === idx ? null : idx)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left cursor-pointer"
                aria-expanded={open === idx}
                aria-controls={`faq-answer-${idx}`}
                id={`faq-question-${idx}`}
              >
                <span className="font-serif text-base md:text-lg text-brand-light font-light">{item.question}</span>
                <ChevronDown
                  size={18}
                  className={`text-brand-gold flex-shrink-0 transition-transform duration-300 ${open === idx ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>
              {open === idx && (
                <div id={`faq-answer-${idx}`} aria-labelledby={`faq-question-${idx}`} className="px-5 pb-5">
                  <p className="text-sm text-brand-muted leading-relaxed font-light">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

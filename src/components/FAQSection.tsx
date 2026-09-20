import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export interface FAQItem {
  question: string;
  answer: string;
}

export const FAQ_DATA: FAQItem[] = [
  {
    question: 'Como comprar com corretora de imóveis no Butantã, Morumbi ou Taboão da Serra com segurança?',
    answer: 'Dá para comprar com tranquilidade quando a documentação é checada de verdade. Eu, como sua corretora de imóveis, verifico matrícula, certidões e analiso vendas reais da rua para você não pagar a mais. Acompanho vistoria e vou com você até o cartório — seja compra à vista ou financiada, com suporte jurídico quando precisa.',
  },
  {
    question: 'Quanto custa um apartamento de 2 quartos no Butantã ou Taboão da Serra?',
    answer: 'Depende da rua, mas te dou uma média real de 2026: na região do Butantã, um 2 quartos perto do metrô gira em torno de R$ 380 mil a R$ 750 mil; em Taboão da Serra, nas áreas de Pirajussara e Parque Pinheiros, fica entre R$ 250 mil e R$ 500 mil; no Morumbi, o mesmo padrão já parte de R$ 900 mil. Se quiser, avalio o seu com base em vendas da própria rua — sem custo e sem compromisso.',
  },
  {
    question: 'Vale a pena investir em um bom corretor, para achar imóveis para alugar no Morumbi, Taboão e Butantã?',
    answer: 'No Butantã e Morumbi, sim — a procura é constante. No Butantã, muitos alunos e professores da USP buscam alugar perto do metrô; no Morumbi, famílias e executivos da Faria Lima/Berrini preferem prédios silenciosos. O retorno costuma ficar entre 0,4% e 0,6% ao mês. Eu cuido da seleção do inquilino, vistoria e contrato para você receber sem dor de cabeça.',
  },
  {
    question: 'Como vender com corretora de imóveis rápido em São Paulo e receber o melhor preço?',
    answer: 'Preço justo vende mais rápido que anúncio bonito com valor inflado. Eu avalio com vendas reais da sua rua, faço fotos à luz certa e divulgo onde quem busca sua região realmente procura — nos portais e também no boca a boca. Negocio com calma, protejo sua documentação e, se preferir discrição, faço off-market sem placa.',
  },
  {
    question: 'Quais documentos são necessários para alugar com corretora de imóveis?',
    answer: 'Para alugar com corretora de imóveis, normalmente peço RG, CPF, comprovante de renda de cerca de 3 vezes o aluguel e comprovante de residência. Você pode escolher entre caução, seguro-fiança, fiador ou título. Do lado do proprietário, preciso da matrícula atualizada, IPTU e certidões em dia. Eu preparo contrato claro e faço vistoria de entrada e saída com fotos — assim ninguém discute depois.',
  },
  {
    question: 'A corretora Silvia Helena atende na planta e lançamentos?',
    answer: 'Sim, trabalho com usado, novo, na planta e lançamentos. Se a ideia é comprar na planta no Butantã ou Morumbi como investimento, te explico o memorial, o cronograma da obra e o histórico de valorização daquela rua. Acompanho até a entrega das chaves — e fico atenta a atrasos para te manter informado.',
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
          <motion.h2
            id="faq-heading"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className="font-serif text-3xl md:text-4xl text-brand-light font-light mt-3 flex flex-wrap justify-center overflow-visible"
          >
            {'Você tem dúvidas para vender, comprar ou alugar imóveis em São Paulo?'.split(' ').map((word, i) => (
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
          <p className="text-sm text-brand-muted mt-3 font-light">
            Respostas curtas e diretas — do jeito que eu explicaria numa visita, e do jeito que Google e IAs gostam de citar.
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

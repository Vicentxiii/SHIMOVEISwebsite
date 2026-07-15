/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Property, Testimonial, Lifestyle } from './types';

export const DICT = {
  pt: {
    // Nav items
    nav_advisor: 'Assessora',
    nav_estates: 'Imóveis',
    nav_lifestyle: 'Filosofia',
    nav_philosophy: 'Filosofia',
    nav_testimonials: 'Recomendações',
    nav_consultation: 'Consulta Privada',
    nav_schedule: 'Agendar Consulta Privada',
    nav_portfolio: 'Seu Portfólio',
    
    // Hero
    hero_badge: 'Patrimônio Imobiliário Privado de Luxo',
    hero_title: 'Silvia Helena',
    hero_subtitle: 'Consultora de Imóveis de Luxo & Parceira Estratégica',
    hero_cta: 'Examinar Coleção',
    hero_scroll: 'Rolar para Descobrir',
    hero_private_office: 'ESCRITÓRIO PRIVADO © 2026',

    // About Section
    about_badge: 'A BIOGRAFIA DE UMA CONSULTORA DE CONFIANÇA',
    about_title: 'Redefinindo a representação de imóveis de alto padrão.',
    about_p1: 'Silvia Helena não enxerga propriedades de luxo como simples mercadorias. Com uma sólida formação em assessoria de fortunas privadas e gestão de ativos imobiliários de alto padrão, ela se posiciona como uma representante de patrimônio verdadeiramente dedicada e estratégica.',
    about_p2: 'Ela compreende que a aquisição ou liquidação de uma obra-prima arquitetônica multimilionária não é uma mera transação, mas sim um marco crítico de preservação de capital e uma decisão de alta relevância pessoal. Silvia coordena cada fase deste processo complexo pessoalmente, defendendo os interesses de seus clientes com padrões inabaláveis de inteligência, discrição e excelência técnica.',
    about_p3: 'Sua consultoria privada concentra-se intensamente na poesia espacial, na honestidade estrutural, nos ciclos imobiliários regionais e na integridade dos ativos. Sua assessoria oferece uma ponte perfeita entre a arquitetura moderna e a longevidade do capital.',
    about_ach_title1: 'Rede Privada de Clientes Discretos',
    about_ach_desc1: 'Orquestrando transações de altíssimo luxo inteiramente fora do mercado comum com total sigilo.',
    about_ach_title2: 'Otimização de Patrimônio',
    about_ach_desc2: 'Alinhando portfólios imobiliários com os objetivos mais amplos de preservação de riqueza familiar.',
    about_ach_title3: 'Defesa Absoluta',
    about_ach_desc3: 'Garantindo que seus interesses estratégicos e de design sejam protegidos com exclusividade.',
    about_ach1_title: 'Rede Privada de Clientes Discretos',
    about_ach1_desc: 'Orquestrando transações de altíssimo luxo inteiramente fora do mercado comum com total sigilo.',
    about_ach2_title: 'Otimização de Patrimônio',
    about_ach2_desc: 'Alinhando portfólios imobiliários com os objetivos mais amplos de preservação de riqueza familiar.',
    about_ach3_title: 'Defesa Absoluta',
    about_ach3_desc: 'Garantindo que seus interesses estratégicos e de design sejam protegidos com exclusividade.',
    about_stat_years: 'Anos de Assessoria',
    about_stat_volume: 'Volume Transacionado',
    about_stat_conf: 'Confidencialidade',
    about_stat1_val: '15+',
    about_stat1_lbl: 'Anos de Assessoria',
    about_stat2_val: 'R$ 123M+',
    about_stat2_lbl: 'Volume Transacionado',
    about_stat3_val: '100%',
    about_stat3_lbl: 'Confidencialidade',
    about_statement_title: 'DECLARAÇÃO DE SILVIA',
    about_statement_quote: '“Uma residência deve ser perfeita para morar e investir, deve ser memorável e valorizável com o tempo”',
    about_quote_label: 'DECLARAÇÃO DE SILVIA',
    about_quote: '“Uma residência deve ser perfeita para morar e investir, deve ser memorável e valorizável com o tempo”',
    about_founder: 'Fundadora & Assessora Principal',
    about_role: 'Assessora Exclusiva',
    header_cta_consultation: 'Consulta Privada',
    mobile_menu_title: 'Menu de Navegação',
    mobile_lang_title: 'Selecionar Idioma',
    mobile_menu_favs: 'Seu Portfólio ({0})',
    mobile_menu_contact: 'Consulta Privada',

    // Search / Filter Section
    filter_all: 'Todos',
    filter_type: 'Tipo de Imóvel',
    filter_location: 'Localização',
    filter_bedrooms: 'Dormitórios',
    filter_bathrooms: 'Banheiros',
    filter_garage: 'Vagas de Garagem',
    filter_max_price: 'Preço Máximo',
    filter_up_to: 'Até R$ {0} Mi',
    filter_features: 'Atributos Adicionais',
    filter_swimming: 'Piscina Privativa',
    filter_garden: 'Jardim / Paisagismo',
    filter_ocean: 'Vista para o Mar',
    filter_pet: 'Aceita Animais',
    filter_any: 'Qualquer',
    filter_reset: 'Limpar Filtros',
    filter_active_tag: 'Filtros Ativos',
    filter_placeholder_location: 'Selecione a Região',
    filter_placeholder_type: 'Selecione o Tipo',

    // Portfolio Section
    portfolio_badge: 'CARTEIRA DE ATIVOS SELECIONADOS',
    portfolio_title: 'O Portfólio Arquitetônico',
    portfolio_desc: 'Exibindo {0} de {1} ativos premium selecionados a dedo. Cada propriedade atende a critérios rigorosos de integridade estrutural, privacidade e valor patrimonial.',
    portfolio_empty_title: 'Nenhum Ativo Corresponde aos Filtros',
    portfolio_empty_desc: 'Não há modelos disponíveis em nosso inventário público atual com estas métricas exatas. Entre em contato diretamente com a Silvia Helena para explorar nosso portfólio restrito, completamente fora do mercado convencional.',
    portfolio_empty_cta: 'Iniciar Busca Privada',
    portfolio_unlisted_badge: 'PORTFÓLIO CONFIDENCIAL',
    portfolio_unlisted_title: 'Busca por propriedades totalmente exclusivas e fora do mercado?',
    portfolio_unlisted_desc: 'Mais de 60% do volume de negócios fechados pela Silvia Helena ocorre de forma 100% confidencial (off-market) para resguardar a privacidade de compradores e vendedores. Entre em contato para representação exclusiva e discreta.',

    // Card & Modal Details
    card_view_details: 'Examinar Detalhes',
    details_architect: 'Arquiteto',
    details_year: 'Ano de Construção',
    details_area: 'Área Privativa',
    details_beds: 'Quartos',
    details_baths: 'Banheiros',
    details_garages: 'Vagas',
    details_exclusive_advisor: 'Assessora Exclusiva',
    details_creci: 'CRECISP 125743',
    details_contact_inquiry: 'Enviar Solicitação de Informações',
    details_contact_placeholder: 'SEU NOME COMPLETO',
    details_message_placeholder: 'DESCREVA OS DETALHES DE SEU INTERESSE OU NECESSIDADES DE CRONOGRAMA...',
    details_sending: 'Enviando Proposta...',
    details_success_title: 'Inquérito de Ativos Recebido',
    details_success_desc: 'A assessoria de Silvia Helena está analisando sua solicitação. Um contato inicial de alta confidencialidade será realizado dentro de 4 horas úteis.',
    details_gallery_title: 'Galeria Arquitetônica',
    details_features_title: 'Atributos & Infraestrutura',
    details_close: 'Fechar',

    // Favorites Drawer
    fav_title: 'Sua Seleção de Portfólio',
    fav_header: 'Portfólio Privado ({0})',
    fav_empty: 'Nenhuma propriedade adicionada ao seu portfólio privado.',
    fav_empty_sub: 'Navegue pela nossa coleção para salvar seus modelos favoritos.',
    fav_empty_desc: 'Clique no ícone de coração nos ativos para adicioná-los aqui.',
    fav_remove: 'Remover',
    fav_examine: 'Examine',
    fav_collective_title: 'Solicitação Coletiva de Portfólio',
    fav_collective_desc: 'Envie uma solicitação confidencial e única englobando os {0} ativos salvos em seu portfólio.',
    fav_collective_success: 'Solicitação Coletiva Enviada',
    fav_collective_success_desc: 'A equipe de Silvia Helena está preparando a pasta técnica detalhada para os {0} ativos salvos.',
    fav_email_placeholder: 'SEU ENDEREÇO DE E-MAIL',
    fav_channel_secured: 'Canal de Consulta Protegido por NDA',

    // Lifestyle Section
    life_badge: 'A FILOSOFIA DE CURADORIA',
    life_title: 'Não vendemos apenas estruturas físicas. Guiamos você ao seu estilo de vida ideal.',
    life_cat_arch: 'Arquitetura',
    life_cat_arch_val: 'Espaço Esculpido',
    life_cat_heritage: 'Legado Familiar',
    life_cat_heritage_val: 'Propriedades Nobres',
    life_cat_wealth: 'Riqueza Estratégica',
    life_cat_wealth_val: 'Proteção Patrimonial',
    life_cat_comfort: 'Puro Conforto',
    life_cat_comfort_val: 'Luxo Silencioso',
    life_cat_nature: 'Natureza Selvagem',
    life_cat_nature_val: 'Vistas Preservadas',

    // Testimonials
    test_badge: 'CONFIANÇA E RECONHECIMENTO',
    test_title: 'Depoimentos de Clientes',

    // Contact Section
    contact_badge: 'SOLICITAÇÃO DE AGENDAMENTO PRIVADO',
    contact_title: 'Inicie sua consulta estratégica e altamente confidencial.',
    contact_subtitle: 'Cada interação é estritamente protegida por termos de total confidencialidade de dados e NDA padrão de mercado.',
    contact_form_name: 'Seu Nome Completo',
    contact_form_email: 'Endereço de E-mail de Negócios',
    contact_form_phone: 'Telefone ou WhatsApp de Contato',
    contact_form_type: 'Tipo de Assistência Requerida',
    contact_type_buy: 'Consultoria de Aquisição / Compra',
    contact_type_sell: 'Representação de Venda de Ativo',
    contact_type_portfolio: 'Análise de Portfólio & Realocação',
    contact_type_offmarket: 'Pesquisa Restrita Fora do Mercado (Off-Market)',
    contact_form_cap: 'Limite Estimado de Capital (Milhões BRL)',
    contact_form_notes: 'Notas de Intenção e Preferências Privadas',
    contact_form_notes_placeholder: 'Forneça detalhes gerais sobre o seu perfil arquitetônico desejado ou as premissas confidenciais de sua transação...',
    contact_form_submit: 'Transmitir Solicitação Criptografada',
    contact_submitting: 'Transmitindo Dados de Forma Segura...',
    contact_success_title: 'Canal de Comunicação Aberto',
    contact_success_desc: 'Seus dados foram criptografados e enviados diretamente ao terminal confidencial da Silvia Helena. Você receberá um retorno pessoal em até 2 horas por canal seguro.',
    contact_privacy_note: 'Todas as comunicações passam por canais seguros e contam com suporte a canais criptografados para sua segurança.',

    // Footer
    footer_creci_desc: 'Silvia Helena é consultora imobiliária independente registrada sob o CRECISP 125743. Gestão personalizada de portfólios protegidos por NDA para family offices privados e capital institucional.',
    footer_territories: 'Territórios de Atuação',
    footer_sp: 'Grande São Paulo',
    footer_rio: 'Litoral do Rio de Janeiro',
    footer_trancoso: 'Enclaves à Beira-Mar em Trancoso',
    footer_angra: 'Ilhas Privadas em Angra dos Reis',
    footer_campinas: 'Hípicas de Alto Padrão em Campinas',
    footer_disclosures: 'Divulgações & Termos',
    footer_off_market_policy: 'Política Estrita Off-Market',
    footer_nda: 'Acordo Confidencialidade (NDA)',
    footer_wealth_integration: 'Integração Private Wealth',
    footer_ecology: 'Conformidade Ecológica Certificada',
    footer_rights: '© 2026 Silvia Helena. Todos os direitos reservados.',
    footer_crypto_alert: 'CANAL SEGURO DE ARMAZENAMENTO E DADOS ATIVADO',
    footer_aesthetics: 'INSPIRADO PELA ESTÉTICA COSTEIRA E MINIMALISTA'
  },
  en: {
    // Nav items
    nav_advisor: 'Advisor',
    nav_estates: 'Curated Estates',
    nav_lifestyle: 'Philosophy',
    nav_testimonials: 'Testimonials',
    nav_consultation: 'Private Consultation',
    nav_schedule: 'Schedule Private Inquiry',
    nav_portfolio: 'Your Portfolio',
    
    // Hero
    hero_badge: 'Exquisite Private Real Estate Wealth',
    hero_title: 'Silvia Helena',
    hero_subtitle: 'Luxury Real Estate Advisor & Strategic Partner',
    hero_cta: 'Examine Collection',
    hero_scroll: 'Scroll to Discover',
    hero_private_office: 'PRIVATE OFFICE © 2026',

    // About Section
    about_badge: 'THE BIOGRAPHY OF A TRUSTED ADVOCATE',
    about_title: 'Redefining premium real estate transaction representation.',
    about_p1: 'Silvia Helena does not view premium properties as simple commodities to be sold. With a robust background in private wealth advisory and luxury property management, she positions herself as a strategic, dedicated asset representative.',
    about_p2: 'She understands that buying or selling a multi-million-dollar architectural masterpiece is not a transactional occurrence, but rather a critical wealth preservation milestone and an intense emotional decision. Silvia coordinates every phase of this complex process herself, representing her clients’ interests with uncompromising standards of intelligence, discretion, and technical design excellence.',
    about_p3: 'Her private consultation focuses intensely on spatial poetry, structural honesty, regional real estate cycles, and asset integrity. Her representation provides a seamless bridge between modern architecture and capital longevity.',
    about_ach_title1: 'Discreet Private Client Network',
    about_ach_desc1: 'Orchestrating entirely off-market transactions of ultra-luxury assets with total confidentiality.',
    about_ach_title2: 'Wealth Optimization',
    about_ach_desc2: 'Aligning real estate portfolios with broader multi-family office wealth preservation objectives.',
    about_ach_title3: 'Absolute Advocacy',
    about_ach_desc3: 'Ensuring your strategic and architectural interests are single-mindedly protected.',
    about_stat_years: 'Years Advisory',
    about_stat_volume: 'Volume Closed',
    about_stat_conf: 'Confidenciality',
    about_statement_title: 'SILVIA’S STATEMENT',
    about_statement_quote: '“The visitor should remember the space, not the interface.”',
    about_founder: 'Founder & Principal Advisor',

    // Search / Filter Section
    filter_all: 'All',
    filter_type: 'Property Type',
    filter_location: 'Location',
    filter_bedrooms: 'Bedrooms',
    filter_bathrooms: 'Bathrooms',
    filter_garage: 'Garages',
    filter_max_price: 'Max Price',
    filter_up_to: 'Up to R$ {0}M',
    filter_features: 'Additional Features',
    filter_swimming: 'Private Pool',
    filter_garden: 'Landscaped Garden',
    filter_ocean: 'Ocean View',
    filter_pet: 'Pet Friendly',
    filter_any: 'Any',
    filter_reset: 'Reset Filters',
    filter_active_tag: 'Active Filters',
    filter_placeholder_location: 'Select Location',
    filter_placeholder_type: 'Select Type',

    // Portfolio Section
    portfolio_badge: 'CURATED LEDGER ASSETS',
    portfolio_title: 'The Architectural Portfolio',
    portfolio_desc: 'Showing {0} of {1} hand-selected premium properties. Each asset meets absolute standards of structural integrity, privacy, and capital value.',
    portfolio_empty_title: 'No Assets Match Filters',
    portfolio_empty_desc: 'There are no direct models in our current public inventory fitting these exact metrics. Please contact Silvia Helena directly to explore our completely off-market, unlisted ledger portfolio.',
    portfolio_empty_cta: 'Initiate Off-Market Search',
    portfolio_unlisted_badge: 'CONFIDENTIAL PORTFOLIO',
    portfolio_unlisted_title: 'Looking for completely unlisted estates?',
    portfolio_unlisted_desc: 'Over 60% of Silvia Helena’s completed volume is negotiated entirely off-market to protect client confidentiality. Contact our private family office for exclusive discrete representation.',

    // Card & Modal Details
    card_view_details: 'Examine Details',
    details_architect: 'Architect',
    details_year: 'Year Built',
    details_area: 'Internal Area',
    details_beds: 'Beds',
    details_baths: 'Baths',
    details_garages: 'Garages',
    details_exclusive_advisor: 'Exclusive Advisor',
    details_creci: 'CRECISP 125743',
    details_contact_inquiry: 'Submit Property Inquiry',
    details_contact_placeholder: 'YOUR FULL NAME',
    details_message_placeholder: 'OUTLINE THE SPECIFICS OF YOUR INTEREST OR TIMELINE...',
    details_sending: 'Sending Inquiry...',
    details_success_title: 'Asset Inquiry Received',
    details_success_desc: 'Silvia Helena’s office is processing your request. A highly confidential initial consultation will be made within 4 business hours.',
    details_gallery_title: 'Architectural Gallery',
    details_features_title: 'Features & Amenities',
    details_close: 'Close',

    // Favorites Drawer
    fav_title: 'Your Saved Portfolio',
    fav_header: 'Private Portfolio ({0})',
    fav_empty: 'No estates currently added to your private portfolio.',
    fav_empty_sub: 'Examine our collection to save your favorite architectural models.',
    fav_empty_desc: 'Click the heart icon on any estate to add it here.',
    fav_remove: 'Remove',
    fav_examine: 'Examine',
    fav_collective_title: 'Collective Portfolio Inquiry',
    fav_collective_desc: 'Submit a single discrete inquiry regarding all {0} saved assets.',
    fav_collective_success: 'Collective Inquiry Sent',
    fav_collective_success_desc: 'Silvia Helena’s family office is preparing the prospectus package for the {0} saved estates.',
    fav_email_placeholder: 'YOUR EMAIL ADDRESS',
    fav_channel_secured: 'NDA Protected Consultative Channel',

    // Lifestyle Section
    life_badge: 'THE CURATORIAL PHILOSOPHY',
    life_title: 'We do not sell physical structures. We guide you to your ideal lifestyle.',
    life_cat_arch: 'Architecture',
    life_cat_arch_val: 'Sculpted Space',
    life_cat_heritage: 'Family Heritage',
    life_cat_heritage_val: 'Legacy Estates',
    life_cat_wealth: 'Strategic Wealth',
    life_cat_wealth_val: 'Inflation Hedge',
    life_cat_comfort: 'Pure Comfort',
    life_cat_comfort_val: 'Silent Luxury',
    life_cat_nature: 'Wild Nature',
    life_cat_nature_val: 'Unspoiled Vistas',

    // Testimonials
    test_badge: 'ADVISORY CONFIDENCE',
    test_title: 'Client Commendations',

    // Contact Section
    contact_badge: 'ENCRYPTED CONTACT CONSULTATION',
    contact_title: 'Initiate your strategic, highly confidential consultation.',
    contact_subtitle: 'All interactions are bound by robust confidentiality protocols and standard multi-jurisdictional NDA terms.',
    contact_form_name: 'Your Full Name',
    contact_form_email: 'Business Email Address',
    contact_form_phone: 'Direct Mobile or WhatsApp',
    contact_form_type: 'Required Support Type',
    contact_type_buy: 'Acquisition & Buyer Consultation',
    contact_type_sell: 'Asset Representation & Sale',
    contact_type_portfolio: 'Portfolio Advisory & Reallocation',
    contact_type_offmarket: 'Discreet Off-Market Search',
    contact_form_cap: 'Estimated Capital Envelope (Millions BRL)',
    contact_form_notes: 'Confidencial Notes of Intent & Preferences',
    contact_form_notes_placeholder: 'Please share general notes on architectural style, strategic timeline, or structural criteria...',
    contact_form_submit: 'Transmit Encrypted Request',
    contact_submitting: 'Transmitting Secure Data...',
    contact_success_title: 'Communications Interface Open',
    contact_success_desc: 'Your transmission is encrypted and logged at Silvia Helena’s secure private terminal. Expect a direct personal reach-out within 2 hours.',
    contact_privacy_note: 'All communications traverse secure pathways with full support for fully encrypted messaging.',

    // Footer
    footer_creci_desc: 'Silvia Helena is an independent real estate advisor registered under CRECISP 125743. Custom, NDA-protected portfolio management for private family offices and institutional capital.',
    footer_territories: 'Territories of Operation',
    footer_sp: 'São Paulo Metropolitan',
    footer_rio: 'Rio de Janeiro Coastal',
    footer_trancoso: 'Trancoso Beachfront Enclaves',
    footer_angra: 'Angra dos Reis Private Islands',
    footer_campinas: 'Campinas Equestrian Highlands',
    footer_disclosures: 'Disclosures & Terms',
    footer_off_market_policy: 'Strict Off-Market Policy',
    footer_nda: 'Mutual NDA Framework',
    footer_wealth_integration: 'Private Wealth Integration',
    footer_ecology: 'Ecology Compliance Certified',
    footer_rights: '© 2026 Silvia Helena. All rights reserved.',
    footer_crypto_alert: 'SECURE CRYPTO STORAGE CHANNELS ENABLED',
    footer_aesthetics: 'DESIGNED BY LEICA & SOTHEBY’S AESTHETICS'
  },
  es: {
    // Nav items
    nav_advisor: 'Asesora',
    nav_estates: 'Inmuebles Curados',
    nav_lifestyle: 'Filosofía',
    nav_testimonials: 'Testimonios',
    nav_consultation: 'Consulta Privada',
    nav_schedule: 'Agendar Consulta Privada',
    nav_portfolio: 'Su Portafolio',
    
    // Hero
    hero_badge: 'Patrimonio Inmobiliario Privado Exclusivo',
    hero_title: 'Silvia Helena',
    hero_subtitle: 'Asesora de Inmuebles de Lujo & Socia Estratégica',
    hero_cta: 'Explorar Colección',
    hero_scroll: 'Desplazar para Descubrir',
    hero_private_office: 'OFICINA PRIVADA © 2026',

    // About Section
    about_badge: 'LA BIOGRAFÍA DE UNA ASESORA DE CONFIANZA',
    about_title: 'Redefiniendo la representación de transacciones inmobiliarias de lujo.',
    about_p1: 'Silvia Helena no ve las propiedades de lujo como simples mercancías. Con una sólida experiencia en asesoría de patrimonio privado y gestión de inmuebles de lujo, se posiciona como una representante de activos verdaderamente dedicada y estratégica.',
    about_p2: 'Comprende que comprar o vender una obra maestra de la arquitectura multimillonaria no es una mera transacción, sino un hito crítico de preservación del capital y una decisión de alta relevancia personal. Silvia coordina cada fase de este complejo proceso en persona, defendiendo los intereses de sus clientes con estándares inquebrantables de inteligencia, discreción y excelencia técnica.',
    about_p3: 'Su consulta privada se enfoca intensamente en la poesía espacial, la honestidad estructural, los ciclos inmobiliarios regionales y la integridad de los activos. Su asesoría ofrece un puente perfecto entre la arquitectura moderna y la longevidad del capital.',
    about_ach_title1: 'Red Privada de Clientes Discretos',
    about_ach_desc1: 'Orquestando transacciones de altísimo lujo completamente fuera del mercado convencional con total confidencialidad.',
    about_ach_title2: 'Optimización de Patrimonio',
    about_ach_desc2: 'Alineando carteras de bienes raíces con los objetivos más amplios de preservación de riqueza familiar.',
    about_ach_title3: 'Defensa Absoluta',
    about_ach_desc3: 'Garantizando que sus intereses estratégicos y arquitectónicos estén protegidos de manera exclusiva.',
    about_stat_years: 'Años de Asesoría',
    about_stat_volume: 'Volumen Cerrado',
    about_stat_conf: 'Confidencialidad',
    about_statement_title: 'DECLARACIÓN DE SILVIA',
    about_statement_quote: '“El visitante debe recordar el espacio, no la interfaz.”',
    about_founder: 'Fundadora & Asesora Principal',

    // Search / Filter Section
    filter_all: 'Todos',
    filter_type: 'Tipo de Propiedad',
    filter_location: 'Ubicación',
    filter_bedrooms: 'Dormitorios',
    filter_bathrooms: 'Baños',
    filter_garage: 'Garajes',
    filter_max_price: 'Precio Máximo',
    filter_up_to: 'Hasta R$ {0}M',
    filter_features: 'Características Adicionales',
    filter_swimming: 'Piscina Privada',
    filter_garden: 'Jardín con Paisajismo',
    filter_ocean: 'Vista al Mar',
    filter_pet: 'Apto para Mascotas',
    filter_any: 'Cualquiera',
    filter_reset: 'Limpiar Filtros',
    filter_active_tag: 'Filtros Activos',
    filter_placeholder_location: 'Seleccionar Región',
    filter_placeholder_type: 'Seleccionar Tipo',

    // Portfolio Section
    portfolio_badge: 'CARTERA DE ACTIVOS SELECCIONADOS',
    portfolio_title: 'El Portafolio Arquitectónico',
    portfolio_desc: 'Mostrando {0} de {1} propiedades premium seleccionadas a mano. Cada propiedad cumple con criterios estrictos de integridad estructural, privacidad y valor patrimonial.',
    portfolio_empty_title: 'Ningún Activo Coincide con los Filtros',
    portfolio_empty_desc: 'No hay modelos disponibles en nuestro inventario público actual que cumplan con estas métricas exactas. Comuníquese directamente con Silvia Helena para explorar nuestro portafolio restringido, completamente fuera del mercado convencional.',
    portfolio_empty_cta: 'Iniciar Búsqueda Privada',
    portfolio_unlisted_badge: 'PORTAFOLIO CONFIDENCIAL',
    portfolio_unlisted_title: '¿Busca propiedades totalmente exclusivas y fuera del mercado?',
    portfolio_unlisted_desc: 'Más del 60% del volumen de negocios cerrados por Silvia Helena se realiza de forma 100% confidencial (off-market) para proteger la privacidad de los clientes. Comuníquese con nuestra oficina para una representación exclusiva y discreta.',

    // Card & Modal Details
    card_view_details: 'Examinar Detalles',
    details_architect: 'Arquitecto',
    details_year: 'Año de Construcción',
    details_area: 'Área Interna',
    details_beds: 'Habitaciones',
    details_baths: 'Baños',
    details_garages: 'Garajes',
    details_exclusive_advisor: 'Asesora Exclusiva',
    details_creci: 'CRECISP 125743',
    details_contact_inquiry: 'Enviar Solicitud de Información',
    details_contact_placeholder: 'SU NOMBRE COMPLETO',
    details_message_placeholder: 'DESSCRIBA LOS DETALLES DE SU INTERÉS O CRONOGRAMA...',
    details_sending: 'Enviando Solicitud...',
    details_success_title: 'Solicitud de Información Recibida',
    details_success_desc: 'La oficina de Silvia Helena está analizando su solicitud. Un contacto inicial de alta confidencialidad se realizará dentro de las 4 horas hábiles.',
    details_gallery_title: 'Galería Arquitectónica',
    details_features_title: 'Características & Infraestructura',
    details_close: 'Cerrar',

    // Favorites Drawer
    fav_title: 'Su Selección de Portafolio',
    fav_header: 'Portafolio Privado ({0})',
    fav_empty: 'No hay propiedades agregadas a su portafolio privado.',
    fav_empty_sub: 'Navegue por nuestra colección para guardar sus modelos arquitectónicos favoritos.',
    fav_empty_desc: 'Haga clic en el icono de corazón en cualquier propiedad para agregarla aquí.',
    fav_remove: 'Eliminar',
    fav_examine: 'Examinar',
    fav_collective_title: 'Solicitud Colectiva de Portafolio',
    fav_collective_desc: 'Envíe una solicitud confidencial y única con respecto a los {0} activos guardados en su portafolio.',
    fav_collective_success: 'Solicitud Colectiva Enviada',
    fav_collective_success_desc: 'La oficina de Silvia Helena está preparando la carpeta técnica detallada para los {0} activos guardados.',
    fav_email_placeholder: 'SU DIRECCIÓN DE CORREO',
    fav_channel_secured: 'Canal de Consulta Protegido por NDA',

    // Lifestyle Section
    life_badge: 'LA FILOSOFÍA DE CURADURÍA',
    life_title: 'No vendemos estructuras físicas. Lo guiamos a su estilo de vida ideal.',
    life_cat_arch: 'Arquitectura',
    life_cat_arch_val: 'Espacio Esculpido',
    life_cat_heritage: 'Legado Familiar',
    life_cat_heritage_val: 'Propiedades Nobles',
    life_cat_wealth: 'Riqueza Estratégica',
    life_cat_wealth_val: 'Protección Patrimonial',
    life_cat_comfort: 'Puro Confort',
    life_cat_comfort_val: 'Lujo Silencioso',
    life_cat_nature: 'Naturaleza Salvaje',
    life_cat_nature_val: 'Vistas Preservadas',

    // Testimonials
    test_badge: 'CONFIANZA DE ASESORÍA',
    test_title: 'Recomendaciones de Clientes',

    // Contact Section
    contact_badge: 'SOLICITUD DE REUNIÓN PRIVADA',
    contact_title: 'Inicie su consulta estratégica y altamente confidencial.',
    contact_subtitle: 'Todas las interacciones están regidas por estrictos protocolos de confidencialidad y acuerdos de confidencialidad (NDA) estándar.',
    contact_form_name: 'Su Nombre Completo',
    contact_form_email: 'Correo Electrónico de Negocios',
    contact_form_phone: 'Teléfono o WhatsApp Directo',
    contact_form_type: 'Tipo de Asistencia Requerida',
    contact_type_buy: 'Consultoría de Adquisición / Compra',
    contact_type_sell: 'Representación de Venta de Activo',
    contact_type_portfolio: 'Asesoría de Portafolio & Reasignación',
    contact_type_offmarket: 'Búsqueda Exclusiva Fuera del Mercado (Off-Market)',
    contact_form_cap: 'Límite Estimado de Capital (Millones BRL)',
    contact_form_notes: 'Notas de Intención y Preferencias Privadas',
    contact_form_notes_placeholder: 'Por favor proporcione detalles generales sobre el estilo arquitectónico deseado o criterios estratégicos...',
    contact_form_submit: 'Transmitir Solicitud Cifrada',
    contact_submitting: 'Transmitiendo Datos de Forma Segura...',
    contact_success_title: 'Canal de Comunicación Abierto',
    contact_success_desc: 'Sus datos han sido cifrados y enviados directamente a la terminal privada y segura de Silvia Helena. Recibirá una respuesta personal en un plazo de 2 horas.',
    contact_privacy_note: 'Todas las comunicaciones pasan por canales seguros y cuentan con soporte a canales cifrados para su seguridad.',

    // Footer
    footer_creci_desc: 'Silvia Helena es una asesora inmobiliaria independiente registrada bajo CRECISP 125743. Gestión de cartera personalizada protegida por acuerdo de confidencialidad (NDA) para oficinas familiares y capital institucional.',
    footer_territories: 'Territorios de Operación',
    footer_sp: 'Área Metropolitana de São Paulo',
    footer_rio: 'Costa de Río de Janeiro',
    footer_trancoso: 'Enclaves Frente al Mar en Trancoso',
    footer_angra: 'Islas Privadas en Angra dos Reis',
    footer_campinas: 'Hípicas de Alto Nivel en Campinas',
    footer_disclosures: 'Divulgaciones & Términos',
    footer_off_market_policy: 'Política Estricta Off-Market',
    footer_nda: 'Acuerdo Confidencialidad Mutuo (NDA)',
    footer_wealth_integration: 'Integración Private Wealth',
    footer_ecology: 'Certificación de Cumplimiento Ecológico',
    footer_rights: '© 2026 Silvia Helena. Todos los derechos reservados.',
    footer_crypto_alert: 'CANAL SEGURO DE ALMACENAMIENTO Y DATOS ACTIVADO',
    footer_aesthetics: 'INSPIRADO POR LA ESTÉTICA COSTEIRA Y MINIMALISTA'
  }
};

export const PROPERTIES_TRANSLATIONS = {
  pt: [
    {
      id: 'prop-1',
      title: 'Residência Cliffside Obsidian',
      type: 'Mansão de Luxo',
      location: 'Joatinga, Rio de Janeiro',
      description: 'Esculpida diretamente nos penhascos verticais de granito da Joatinga, esta obra-prima arquitetônica representa o ápice absoluto do luxo modernista costeiro. Projetada pelo renomado escritório Bernardes, a residência mescla concreto bruto monolítico com vidro estrutural do piso ao teto, oferecendo vistas panorâmicas e desimpedidas do Oceano Atlântico. Apresenta uma piscina de borda infinita em balanço duplo, elevador privativo para todos os níveis, adega climatizada para 500 garrafas e segurança biométrica de alta tecnologia. Os espaços sociais são orientados para maximizar a ventilação cruzada natural e as dramáticas composições do pôr do sol.',
      features: ['Piscina', 'Vista para o Mar', 'Jardim', 'Aceita Pets', 'Elevador Privativo', 'Adega de Vinhos', 'Automação Residencial', 'Cinema em Casa'],
      tagline: 'Um santuário monolítico de concreto, vidro e horizontes oceânicos.'
    },
    {
      id: 'prop-2',
      title: 'Cobertura Skyline Bauhaus',
      type: 'Cobertura',
      location: 'Itaim Bibi, São Paulo',
      description: 'Pairando graciosamente acima do coração pulsante do Itaim Bibi, esta cobertura duplex é uma celebração da herança modernista brasileira e do minimalismo contemporâneo. O andar inferior apresenta amplos espaços tipo galeria com piso de granilite autêntico, iluminação arquitetônica integrada e uma elegante lareira de basalto. Uma escada em caracol de aço e carvalho feita sob medida leva ao santuário privado superior, que conta com uma suíte master com spa e uma piscina suspensa com fechamento de vidro e vista para o icônico horizonte de São Paulo. Mobiliário selecionado por Sergio Rodrigues e Jorge Zalszupin complementa a paleta atemporal.',
      features: ['Piscina', 'Aceita Pets', 'Vista do Horizonte', 'Portaria Privada', 'Cozinha Profissional', 'Lareira de Basalto'],
      tagline: 'Um santuário privado elevado suspenso acima da malha urbana cosmopolita.'
    },
    {
      id: 'prop-3',
      title: 'Pavilhão Floresta de Eucaliptos',
      type: 'Casa',
      location: 'Jardim Europa, São Paulo',
      description: 'Localizada no enclave residencial altamente exclusivo do Jardim Europa, esta propriedade projetada com maestria representa a sublime interseção entre arquitetura orgânica e tecnologia moderna. Uma malha estrutural de concreto aparente é suavizada por painéis de freijó e detalhes em basalto. A propriedade é desenhada com uma transição contínua entre interior e exterior, conduzindo a uma raia de piscina de 50 metros, jardins tropicais de inspiração Zen projetados pelo Burle Marx Escritório de Paisagismo e um pavilhão de bem-estar independente equipado com um autêntico onsen japonês.',
      features: ['Piscina', 'Jardim', 'Aceita Pets', 'Onsen de Bem-estar', 'Acesso Hípico', 'Garagem para 6 Carros', 'Galeria de Arte Privada'],
      tagline: 'Elegância estrutural atemporal envolvida por exuberantes jardins modernistas.'
    },
    {
      id: 'prop-4',
      title: 'Refúgio Areia & Copa das Árvores',
      type: 'Casa de Praia',
      location: 'Trancoso, Bahia',
      description: 'Imerso na antiga e preservada Mata Atlântica de Trancoso e a apenas alguns passos das areias brancas intocadas, este refúgio de praia representa o padrão de ouro do luxo orgânico. Incorporando pilares estruturais de ipê maciço de demolição, telhados de piaçava local e modernos painéis de vidro solar. O lounge aberto incentiva a circulação da brisa marinha, fluindo diretamente para uma piscina de quartzito verde que espelha visualmente o mar da Bahia. Conta com equipe completa, rede de energia solar autossustentável e segurança absoluta.',
      features: ['Piscina', 'Jardim', 'Vista para o Mar', 'Aceita Pets', 'Acesso à Floresta', 'Energia Solar Autossustentável', 'Casa de Hóspedes/Equipe'],
      tagline: 'Uma obra-prima em arquitetura orgânica, madeira acolhedora e poesia costeira.'
    },
    {
      id: 'prop-5',
      title: 'Pied-à-Terre Minimalista Tsubo',
      type: 'Estúdio de Luxo',
      location: 'Jardins, São Paulo',
      description: 'Repensando a arquitetura em escala reduzida através de uma lente de ultra-luxo, este pied-à-terre executivo nos Jardins é um exercício de sublime disciplina espacial japonesa. Projetado com marcenaria embutida premium de hinoki, armários inteligentes automatizados e banheiro revestido em mármore Carrara maciço. Perfeitamente configurado para assessores e investidores globais que demandam uma residência sofisticada e de baixa manutenção na região mais nobre de São Paulo.',
      features: ['Aceita Pets', 'Marcenaria Fina', 'Banheiro em Mármore Carrara', 'Persianas Automatizadas', 'Portaria 24h', 'Serviço de Manobrista'],
      tagline: 'Eficiência espacial requintada envolta em rica madeira Hinoki e mármore Carrara.'
    },
    {
      id: 'prop-6',
      title: 'Reserva Horizonte Frente ao Mar',
      type: 'Terreno',
      location: 'Angra dos Reis, Rio de Janeiro',
      description: 'Uma oportunidade imobiliária histórica e irrepetível. Esta península privada de 15.000 m² em Angra dos Reis apresenta mais de 300 metros de frente para o mar, praia privativa de areia branca acessível apenas por mar ou trilha da propriedade e zoneamento ecológico pré-aprovado para uma residência de assinatura de 2.000 m². Emoldurado por Mata Atlântica preservada, esculturas naturais de granito e águas calmas e cristalinas. Inclui renders de projetos arquitetônicos exclusivos do premiado escritório Jacobsen Arquitetura.',
      features: ['Vista para o Mar', 'Jardim', 'Praia Privada', 'Pré-aprovação de Heliporto', 'Licença para Trapiche/Iate', 'Mata Preservada'],
      tagline: 'Uma tela costeira virgem de beleza indomável, aprovada para sua propriedade de legado.'
    },
    {
      id: 'prop-7',
      title: 'Pavilhão Galeria Brutalista',
      type: 'Comercial',
      location: 'Faria Lima, São Paulo',
      description: 'Uma obra-prima do estilo modernista corporativo. Este pavilhão comercial independente na Faria Lima é adequado para um family office de prestígio, galeria de arte contemporânea ou sede de marca de luxo. Construído com concreto aparente de acabamento liso, claraboias dramáticas que banham as paredes de 7 metros com luz natural difusa, lounge executivo premium, cofre secreto e controle de climatização dinâmica para preservação de arte. Estrutura totalmente isolada acusticamente com vidros triplos premium.',
      features: ['Cofre de Segurança', 'Vista Urbana', 'Estacionamento Subterrâneo para 10 Carros', 'Climatização Avançada', 'Isolamento Acústico'],
      tagline: 'Um marco arquitetônico no pulso financeiro do Brasil, construído para influenciar.'
    },
    {
      id: 'prop-8',
      title: 'Fazenda Imperial de Café & Hípica',
      type: 'Fazenda',
      location: 'Campinas Highlands, São Paulo',
      description: 'Um retorno elegante ao esplendor agrícola histórico, meticulosamente restaurado para convivência multigeracional. Esta propriedade ativa de café orgânico de 45 hectares contém um casarão histórico de 1890 preservado, combinado com um pavilhão hípico recém-construído em concreto e madeira pelo Studio MK27. Complementado por arenas de treinamento de cavalos padrão olímpico, lago privativo, cachoeira de águas cristalinas, pomares, horta orgânica e heliporto homologado.',
      features: ['Piscina', 'Jardim', 'Aceita Pets', 'Arena de Hipismo', 'Heliporto Privativo', 'Fazenda Orgânica', 'Cachoeiras', 'Lago'],
      tagline: 'Uma fazenda de café histórica combinada com excelência hípica moderna.'
    }
  ],
  en: [], // Will copy dynamically or fall back to original (original is English)
  es: [
    {
      id: 'prop-1',
      title: 'Residencia Cliffside Obsidian',
      type: 'Mansión de Lujo',
      location: 'Joatinga, Rio de Janeiro',
      description: 'Tallada directamente en los acantilados verticales de granito de Joatinga, esta obra maestra de la arquitectura representa la cumbre absoluta del lujo modernista costero. Diseñada por el renombrado arquitecto Bernardes, la residencia combina hormigón en bruto monolítico con vidrio estructural de piso a techo, ofreciendo vistas panorámicas e ininterrumpidas del Océano Atlántico. Cuenta con una espectacular piscina de borde infinito en doble voladizo, acceso por ascensor privado a todos los niveles, una bodega climatizada para 500 botellas y seguridad biométrica de alta tecnología. Las áreas comunes están orientadas para maximizar la ventilación cruzada natural y las espectaculares puestas de sol.',
      features: ['Piscina', 'Vista al Mar', 'Jardín', 'Apto para Mascotas', 'Ascensor Privado', 'Bodega de Vinos', 'Sistema de Casa Inteligente', 'Cine en Casa'],
      tagline: 'Un santuario monolítico de hormigón, vidrio y horizontes oceánicos.'
    },
    {
      id: 'prop-2',
      title: 'Penthouse Skyline Bauhaus',
      type: 'Penthouse',
      location: 'Itaim Bibi, São Paulo',
      description: 'Flotando con gracia sobre el corazón vibrante de Itaim Bibi, este penthouse dúplex es una celebración del patrimonio brasileño de mediados de siglo y el minimalismo contemporáneo. La planta baja cuenta con amplios espacios tipo galería con pisos de terrazo auténtico, iluminación arquitectónica integrada y una elegante chimenea de piedra de basalto. Una escalera de caracol de acero y roble hecha a medida conduce al santuario privado superior, que cuenta con una suite principal tipo spa y una piscina elevada rodeada de vidrio con vista al icónico horizonte de São Paulo. Muebles curados por Sergio Rodrigues y Jorge Zalszupin complementan la paleta editorial atemporal.',
      features: ['Piscina', 'Apto para Mascotas', 'Vista del Horizonte', 'Conserje Privado', 'Cocina Profesional', 'Chimenea de Basalto'],
      tagline: 'Un santuario privado elevado suspendido sobre la cuadrícula cosmopolita.'
    },
    {
      id: 'prop-3',
      title: 'Pabellón Bosque de Eucaliptos',
      type: 'Casa',
      location: 'Jardim Europa, São Paulo',
      description: 'Ubicada en el exclusivo enclave residencial de Jardim Europa, esta propiedad diseñada con maestría representa la intersección sublime de la arquitectura orgánica y la tecnología moderna. Una cuadrícula estructural de hormigón en bruto se complementa con cálidos paneles de madera de freijó y detalles de basalto. La propiedad está diseñada con una transición perfecta entre el interior y el exterior, que conduce a una piscina de 50 metros, jardines tropicales de inspiración Zen diseñados por Burle Marx Studio y un pabellón de bienestar independiente equipado con un auténtico onsen japonés.',
      features: ['Piscina', 'Jardín', 'Apto para Mascotas', 'Onsen de Bienestar', 'Acceso Hípico', 'Garaje para 6 Autos', 'Galería de Arte Privada'],
      tagline: 'Elegancia estructural atemporal envuelta por exuberantes jardines modernistas.'
    },
    {
      id: 'prop-4',
      title: 'Refugio Arena & Dosel de Árboles',
      type: 'Casa de Playa',
      location: 'Trancoso, Bahia',
      description: 'Sumergido en la antigua y protegida selva tropical de Trancoso ya solo unos pasos de arenas blancas prístinas, este retiro de playa representa el estándar de oro del lujo orgánico. Incorpora pilares estructurales de ipê macizo recuperado, techos de paja local y paneles modernos de vidrio solar. El salón al aire libre fomenta la circulación de la brisa marina, fluyendo directamente hacia una piscina de piedra de cuarcita verde que refleja visualmente el mar de Bahía. Totalmente equipado con personal, red solar autosustentable y seguridad absoluta.',
      features: ['Piscina', 'Jardín', 'Vista al Mar', 'Apto para Mascotas', 'Acceso a la Selva', 'Red Solar Autosustentable', 'Residencia del Personal'],
      tagline: 'Una obra maestra en arquitectura orgánica, madera cálida y poesía costera.'
    },
    {
      id: 'prop-5',
      title: 'Pied-à-Terre Minimalista Tsubo',
      type: 'Estudio de Lujo',
      location: 'Jardins, São Paulo',
      description: 'Rediseñando la arquitectura a pequeña escala a través de una lente de ultra-lujo, este pied-à-terre ejecutivo en Jardins es un ejercicio de sublime disciplina espacial japonesa. Diseñado con meticulosa carpintería de madera de hinoki integrada de primera calidad, almacenamiento oculto, armarios inteligentes automatizados y un baño revestido de mármol de Carrara macizo. Perfectamente configurado para asesores globales que requieren una residencia exquisita y de bajo mantenimiento en el principal barrio de São Paulo.',
      features: ['Apto para Mascotas', 'Carpintería Fina', 'Baño de Mármol de Carrara', 'Persianas Automatizadas', 'Conserjería', 'Servicio de Valet'],
      tagline: 'Exquisita eficiencia espacial envuelta en madera Hinoki y mármol de Carrara.'
    },
    {
      id: 'prop-6',
      title: 'Reserva Horizonte Frente al Mar',
      type: 'Terreno',
      location: 'Angra dos Reis, Rio de Janeiro',
      description: 'Una oportunidad inmobiliaria histórica e irrepetible. Esta península privada de 15.000 m² en Angra dos Reis cuenta con más de 300 metros de frente al mar, una cala privada de arena blanca accesible solo por mar o senderos de la propiedad y zonificación ecológica preaprobada para una residencia de firma de 2.000 m². Enmarcado por selva tropical preservada, esculturas de granito natural y aguas tranquilas y cristalinas. Incluye renders de diseño arquitectónico personalizados del galardonado estudio Jacobsen Architecture.',
      features: ['Vista al Mar', 'Jardín', 'Cala Privada', 'Preaprobación de Helipuerto', 'Licencia para Muelle de Yates', 'Bosque Preservado'],
      tagline: 'Un lienzo costero virgen de de belleza indomable, aprobado para su propiedad heredada.'
    },
    {
      id: 'prop-7',
      title: 'Pabellón Galería Brutalista',
      type: 'Comercial',
      location: 'Faria Lima, São Paulo',
      description: 'Una obra maestra del estilo corporativo modernista. Este pabellón comercial independiente en Faria Lima es adecuado para un family office de prestigio, galería de arte contemporáneo o sede de una marca de lujo. Construido con hormigón en bruto de acabado liso, claraboyas espectaculares que bañan las paredes de 7 metros de altura con luz natural difusa, salón ejecutivo premium, bóveda secreta y control de climatización dinámico para la conservación del arte. Estructura totalmente aislada acústicamente con vidrios triples premium.',
      features: ['Bóveda de Seguridad', 'Vista Urbana', 'Estacionamiento Subterráneo para 10 Autos', 'Climatización Avanzada', 'Aislamiento Acústico'],
      tagline: 'Un hito arquitectónico en el pulso financiero de Brasil, construido para influir.'
    },
    {
      id: 'prop-8',
      title: 'Finca Imperial de Café & Hípica',
      type: 'Finca',
      location: 'Campinas Highlands, São Paulo',
      description: 'Un elegante regreso al esplendor agrícola histórico, meticulosamente restaurado para la vida familiar. Esta finca de café orgánico de 45 hectáreas cuenta con una casa principal histórica de 1890 preservada, combinada con un pabellón hípico recientemente construido en hormigón y madera por Studio MK27. Se complementa con picaderos de entrenamiento de caballos con especificaciones olímpicas, lago privado, cascadas de agua cristalina, huertos y helipuerto homologado.',
      features: ['Piscina', 'Jardín', 'Apto para Mascotas', 'Picadero de Equitación', 'Helipuerto Privado', 'Granja Orgánica', 'Cascadas', 'Lago'],
      tagline: 'Una histórica finca de café combinada con excelencia hípica moderna.'
    }
  ]
};

export const TESTIMONIALS_TRANSLATIONS = {
  pt: [
    {
      id: 'test-1',
      quote: 'A Silvia não é apenas uma corretora; ela é uma conselheira de raríssimo calibre. Sua experiência em private banking, profunda compreensão do legado arquitetônico e total discrição tornaram nossa aquisição da Residência Cliffside Obsidian impecável.',
      role: 'Presidente & Co-Fundador, Alencar Wealth Holdings'
    },
    {
      id: 'test-2',
      quote: 'Ao liquidar o principal ativo imobiliário da nossa família no Jardim Europa, precisávamos de um consultor que pudesse orquestrar uma transação altamente privada e restrita. A Silvia conduziu cada etapa com extrema precisão, inteligência e confidencialidade absoluta.',
      role: 'Conselheira, Fundação Cultural Villela'
    },
    {
      id: 'test-3',
      quote: 'O processo de consultoria dela assemelha-se ao trabalho de um qualificado multi-family office. Ela trata o mercado imobiliário de luxo como uma classe de ativos críticos e uma poesia espacial pessoal. Uma mestre em seu ofício.',
      role: 'Diretor Geral, Fundo Imobiliário Global Vance & Associates'
    }
  ],
  en: [],
  es: [
    {
      id: 'test-1',
      quote: 'Silvia no es sólo una corredora; es una asesora de rarísimo calibre. Su experiencia en finanzas privadas, profunda comprensión del legado arquitectónico y total discreción hicieron que nuestra adquisición de la Residencia Cliffside Obsidian fuera impecable.',
      role: 'Presidente & Co-Fundador, Alencar Wealth Holdings'
    },
    {
      id: 'test-2',
      quote: 'Al liquidar el principal activo inmobiliario de nuestra familia en Jardim Europa, requeríamos un asesor que pudiera orquestar una transacción altamente privada y reservada. Silvia manejó cada etapa con extrema precisión, inteligencia y confidencialidad absoluta.',
      role: 'Fideicomisaria, Fundación Cultural Villela'
    },
    {
      id: 'test-3',
      quote: 'Su proceso de consulta se asemeja al de un exclusivo multi-family office. Trata los bienes raíces de lujo como una clase de activos críticos y una poesía espacial personal. Una maestra en su oficio.',
      role: 'Director General, Fondo Inmobiliario Global Vance & Associates'
    }
  ]
};

export const LIFESTYLES_TRANSLATIONS = {
  pt: [
    {
      id: 'life-1',
      title: 'Integridade Arquitetônica',
      subtitle: 'O Espaço como Arte Viva',
      description: 'Acreditamos que o patrimônio imobiliário de luxo é mais do que abrigo; é um diálogo duradouro entre luz, materiais e natureza. Fazemos a curadoria de propriedades projetadas por visionários que respeitam a honestidade estrutural e a harmonia contextual.',
      tagline: 'ESCULTURA VIVA'
    },
    {
      id: 'life-2',
      title: 'Investimento Geracional',
      subtitle: 'Preservação de Capital Duradouro',
      description: 'Uma propriedade de luxo é um pilar fundamental da riqueza privada. Aplicamos modelos quantitativos sofisticados, análise profunda de micromercado regional e visão regulatória de longo prazo para orientar aquisições que preservam e elevam o capital familiar.',
      tagline: 'CAPITAL ESTRATÉGICO'
    },
    {
      id: 'life-3',
      title: 'A Poesia do Lazer',
      subtitle: 'Equilíbrio Natural Curado',
      description: 'O verdadeiro luxo reside na privacidade do tempo, da natureza e do conforto absoluto. Seja na tranquilidade exuberante da Bahia ou no frescor sereno das montanhas, localizamos propriedades que promovem o bem-estar e a criação de memórias familiares.',
      tagline: 'RECUPERAÇÃO ORGÂNICA'
    }
  ],
  en: [],
  es: [
    {
      id: 'life-1',
      title: 'Integridad Arquitectónica',
      subtitle: 'El Espacio como Arte Vivo',
      description: 'Creemos que los bienes raíces de lujo son más que un refugio; es un diálogo duradero entre la luz, los materiales y la naturaleza. Realizamos la curaduría de propiedades diseñadas por visionarios que respetan la honestidad estructural y la armonía contextual.',
      tagline: 'ESCULTURA VIVA'
    },
    {
      id: 'life-2',
      title: 'Inversión Generacional',
      subtitle: 'Preservación del Capital Duradero',
      description: 'Una propiedad de lujo es un pilar fundamental de la riqueza privada. Aplicamos modelos cuantitativos sofisticados, análisis profundo de micromercados regionales y visión regulatoria a largo plazo para guiar adquisiciones que preserven y eleven el capital familiar.',
      tagline: 'CAPITAL ESTRATÉGICO'
    },
    {
      id: 'life-3',
      title: 'La Poesía del Ocio',
      subtitle: 'Equilibrio Natural Curado',
      description: 'El verdadero lujo reside en la privacidad del tiempo, de la naturaleza y del confort absoluto. Ya sea en la tranquilidad exuberante de Bahía o en la fresca serenidad de las montañas, localizamos propiedades que promueven el bienestar y la creación de memorias.',
      tagline: 'RECUPERACIÓN ORGÁNICA'
    }
  ]
};

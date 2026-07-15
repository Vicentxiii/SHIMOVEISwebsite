/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Property, Testimonial, Lifestyle } from './types';

export const PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    title: 'The Obsidian Cliffside Residence',
    type: 'Luxury Mansion',
    location: 'Joatinga, Rio de Janeiro',
    price: 18.5,
    formattedPrice: 'R$ 18.500.000',
    bedrooms: 6,
    bathrooms: 8,
    garage: 5,
    area: '1,250 m²',
    image: '/src/assets/images/cliffside_villa_hero_1783897988616.jpg',
    gallery: [
      '/src/assets/images/cliffside_villa_hero_1783897988616.jpg',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Carved directly into the vertical granite cliffs of Joatinga, this architectural masterpiece represents the absolute peak of coastal modernist luxury. Designed by renowned architect Bernardes, the residence blends monolithic raw concrete with floor-to-ceiling structural glass, offering panoramic, unobstructed views of the Atlantic Ocean. Featuring a dramatic double-cantilevered infinity-edge pool, private elevator access to all levels, a 500-bottle temperature-controlled wine cellar, and high-tech biometric security. The living spaces are oriented to maximize natural cross-ventilation and dramatic sunset compositions.',
    features: ['Swimming Pool', 'Ocean View', 'Garden', 'Pet Friendly', 'Private Elevator', 'Wine Cellar', 'Smart Home System', 'Home Cinema'],
    hasSwimmingPool: true,
    hasGarden: true,
    hasOceanView: true,
    isPetFriendly: true,
    tagline: 'A monolithic sanctuary of concrete, glass, and ocean horizons.',
    architect: 'Bernardes Jacobsen',
    yearBuilt: 2023
  },
  {
    id: 'prop-2',
    title: 'The Bauhaus Skyline Penthouse',
    type: 'Apartment',
    location: 'Itaim Bibi, São Paulo',
    price: 12.8,
    formattedPrice: 'R$ 12.800.000',
    bedrooms: 4,
    bathrooms: 5,
    garage: 4,
    area: '680 m²',
    image: '/src/assets/images/sao_paulo_penthouse_1783898008439.jpg',
    gallery: [
      '/src/assets/images/sao_paulo_penthouse_1783898008439.jpg',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Hovering gracefully above the vibrant heart of Itaim Bibi, this duplex penthouse is a celebration of Brazilian mid-century heritage and contemporary minimalism. The lower floor features expansive gallery-like spaces with authentic terrazzo flooring, integrated architectural lighting, and an elegant basalt stone fireplace. A custom-crafted steel and oak spiral staircase leads to the private sanctuary above, which features a spa-like master suite and a private glass-enclosed sky pool overlooking the iconic São Paulo skyline. Curated furniture by Sergio Rodrigues and Jorge Zalszupin complements the timeless editorial palette.',
    features: ['Swimming Pool', 'Pet Friendly', 'Skyline View', 'Private Concierge', 'Professional Kitchen', 'Basalt Fireplace'],
    hasSwimmingPool: true,
    hasGarden: false,
    hasOceanView: false,
    isPetFriendly: true,
    tagline: 'An elevated private sanctuary suspended above the cosmopolitan grid.',
    architect: 'Isay Weinfeld',
    yearBuilt: 2024
  },
  {
    id: 'prop-3',
    title: 'The Eucalyptus Forest Pavilion',
    type: 'House',
    location: 'Jardim Europa, São Paulo',
    price: 22.0,
    formattedPrice: 'R$ 22.000.000',
    bedrooms: 5,
    bathrooms: 7,
    garage: 6,
    area: '1,450 m²',
    image: '/src/assets/images/luxury_mansion_joatinga_1783898026904.jpg',
    gallery: [
      '/src/assets/images/luxury_mansion_joatinga_1783898026904.jpg',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Located in the highly exclusive residential enclave of Jardim Europa, this masterfully engineered estate represents the sublime intersection of organic architecture and modern technology. A raw concrete structural grid is offset by warm freijó timber panels and curated basalt accents. The property is designed with a completely seamless indoor-outdoor transition, leading out to a flawless 50-meter lap pool, manicured Zen-inspired tropical gardens designed by Burle Marx Studio, and a discrete detached luxury wellness pavilion equipped with an authentic Japanese onsen bath.',
    features: ['Swimming Pool', 'Garden', 'Pet Friendly', 'Wellness Onsen', 'Equestrian Access', '6-Car Vault', 'Private Art Gallery'],
    hasSwimmingPool: true,
    hasGarden: true,
    hasOceanView: false,
    isPetFriendly: true,
    tagline: 'Timeless structural elegance enveloped by lush modernist gardens.',
    architect: 'Arthur Casas',
    yearBuilt: 2022
  },
  {
    id: 'prop-4',
    title: 'The Sand & Canopy Refuge',
    type: 'Beach House',
    location: 'Trancoso, Bahia',
    price: 9.5,
    formattedPrice: 'R$ 9.500.000',
    bedrooms: 5,
    bathrooms: 6,
    garage: 3,
    area: '820 m²',
    image: '/src/assets/images/trancoso_beach_house_1783898016790.jpg',
    gallery: [
      '/src/assets/images/trancoso_beach_house_1783898016790.jpg',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Immersed in the ancient, protected rainforest canopy of Trancoso and just steps away from pristine white sands, this beach retreat represents the gold standard of organic luxury. Incorporating reclaimed solid ipê structural pillars, high-end lightweight local thatch, and modern solar glass envelopes. The open-air lounge encourages sea breeze circulation, flowing directly onto a green quartzite stone pool that visually mirrors the Bahian sea. Fully staffed, self-sustaining green grid, and absolutely secure private estate footprint.',
    features: ['Swimming Pool', 'Garden', 'Ocean View', 'Pet Friendly', 'Rainforest Access', 'Self-Sustaining Solar Grid', 'Staff Residence'],
    hasSwimmingPool: true,
    hasGarden: true,
    hasOceanView: true,
    isPetFriendly: true,
    tagline: 'A masterclass in organic architecture, warm wood, and coastal poetry.',
    architect: 'Studio MK27',
    yearBuilt: 2021
  },
  {
    id: 'prop-5',
    title: 'The Tsubo Minimalist Pied-à-Terre',
    type: 'Kitnet',
    location: 'Jardins, São Paulo',
    price: 1.2,
    formattedPrice: 'R$ 1.200.000',
    bedrooms: 1,
    bathrooms: 1,
    garage: 1,
    area: '54 m²',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672019681-9450750a618a?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Rethinking small-scale architecture through an ultra-luxury lens, this executive micro-pied-à-terre in Jardins is an exercise in sublime Japanese spatial discipline. Designed with meticulous built-in premium hinoki woodwork, secret pocket storage, custom automated smart cabinetry, and a full-height solid Carrara marble bathroom block. Perfectly configured for global advisors and tastemakers requiring an exquisite, low-maintenance residence in São Paulo\'s premier walking neighborhood.',
    features: ['Pet Friendly', 'Custom Cabinetry', 'Carrara Marble Bath', 'Automated Shutters', 'Concierge', 'Valet Parking'],
    hasSwimmingPool: false,
    hasGarden: false,
    hasOceanView: false,
    isPetFriendly: true,
    tagline: 'Exquisite spatial efficiency wrapped in rich Hinoki and Carrara marble.',
    architect: 'Kengo Kuma Associates',
    yearBuilt: 2025
  },
  {
    id: 'prop-6',
    title: 'The Oceanfront Horizon Reserve',
    type: 'Land',
    location: 'Angra dos Reis, Rio de Janeiro',
    price: 7.9,
    formattedPrice: 'R$ 7.900.000',
    bedrooms: 0,
    bathrooms: 0,
    garage: 0,
    area: '15,000 m²',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1473116763269-255415b9ffb7?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'An unrepeatable real estate heritage opportunity. This 15,000 m² private headland in Angra dos Reis features over 300 meters of absolute ocean frontage, a private white sand cove accessible only by sea or estate paths, and pre-approved ecological zoning for a 2,000 m² signature residential estate. Framed by preserved Atlantic Forest canopy, pristine natural granite rock sculptures, and crystal-clear calm waters. Includes custom architectural design renderings from award-winning studio Jacobsen Architecture.',
    features: ['Ocean View', 'Garden', 'Private Cove', 'Helipad Pre-Approval', 'Yacht Dock License', 'Preserved Forest'],
    hasSwimmingPool: false,
    hasGarden: true,
    hasOceanView: true,
    isPetFriendly: true,
    tagline: 'A raw coastal canvas of untamable beauty, approved for your legacy estate.',
    architect: 'Jacobsen Architecture (Masterplan)',
    yearBuilt: 2026
  },
  {
    id: 'prop-7',
    title: 'The Brutalist Galleria Pavilion',
    type: 'Commercial',
    location: 'Faria Lima, São Paulo',
    price: 15.2,
    formattedPrice: 'R$ 15.200.000',
    bedrooms: 0,
    bathrooms: 4,
    garage: 10,
    area: '920 m²',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'A masterpiece of modernist civic styling. This standalone commercial pavilion on Faria Lima is suited for a premier single-family office, private contemporary art gallery, or luxury brand headquarters. Constructed with smooth-poured architectural concrete, dramatic skylights that wash the 7-meter-tall walls with natural diffuse light, a premium executive lounge, secret boardroom vault, and dynamic climate zoning for valuable art preservation. Fully soundproofed structural shell with premium triple-glazed acoustic glass.',
    features: ['Security Vault', 'Skyline View', '10-Car Underground Vault', 'Advanced Climate Systems', 'Acoustic Soundproofing'],
    hasSwimmingPool: false,
    hasGarden: true,
    hasOceanView: false,
    isPetFriendly: false,
    tagline: 'An architectural landmark on Brazil’s financial pulse, built for influence.',
    architect: 'Andrade Morettin',
    yearBuilt: 2023
  },
  {
    id: 'prop-8',
    title: 'The Imperial Coffee & Equestrian Finca',
    type: 'Farm',
    location: 'Campinas Highlands, São Paulo',
    price: 11.4,
    formattedPrice: 'R$ 11.400.000',
    bedrooms: 8,
    bathrooms: 9,
    garage: 8,
    area: '450,000 m²',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'An elegant return to historic agricultural splendor, meticulously restored for multi-generational living. This 45-hectare active organic coffee estate contains a pristine, historically listed 1890s master finca, combined with a newly constructed concrete-and-timber equestrian pavilion designed by Studio MK27. Complemented by Olympic-spec horse-training arenas, private lake, crystal stream waterfalls, orchards, organic farm-to-table supply, and a dedicated guest heliport.',
    features: ['Swimming Pool', 'Garden', 'Pet Friendly', 'Equestrian Arena', 'Private Heliport', 'Organic Farm', 'Waterfalls', 'Lake'],
    hasSwimmingPool: true,
    hasGarden: true,
    hasOceanView: false,
    isPetFriendly: true,
    tagline: 'A rare heritage legacy coffee estate paired with modern equestrian excellence.',
    architect: 'Historic Restoration / Studio MK27 Pavilion',
    yearBuilt: 2024
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    quote: "Silvia is not a broker; she is a trusted advisor of rare caliber. Her background in private finance, deep understanding of architectural legacy, and complete discretion made our acquisition of the Obsidian Cliffside Residence entirely flawless.",
    author: "Ricardo & Beatrice de Alencar",
    role: "Chairman & Co-Founder, Alencar Wealth Holdings",
    location: "Zurich / Rio de Janeiro"
  },
  {
    id: 'test-2',
    quote: "When liquidating our family’s primary real estate asset in Jardim Europa, we required an advisor who could orchestrate a highly private, invitation-only transaction. Silvia handled every stage with pristine precision, intelligence, and absolute confidentiality.",
    author: "Dr. Helena S. Villela",
    role: "Trustee, Villela Cultural Foundation",
    location: "São Paulo"
  },
  {
    id: 'test-3',
    quote: "Her consultation process feels like working with an elite multi-family office. She treats real estate as a critical asset class and a personal poetry of space. A master of her craft.",
    author: "Marcus Vance",
    role: "Managing Director, Vance & Associates Global Real Estate Fund",
    location: "New York"
  }
];

export const LIFESTYLES: Lifestyle[] = [
  {
    id: 'life-1',
    title: 'Architectural Integrity',
    subtitle: 'Space as Living Art',
    description: 'We believe premium real estate is more than shelter; it is an enduring dialogue between light, materials, and nature. We curate properties designed by visionaries who respect structural honesty and contextual harmony.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    tagline: 'LIVING SCULPTURE'
  },
  {
    id: 'life-2',
    title: 'Generational Investment',
    subtitle: 'Durable Capital Preservation',
    description: 'A premium estate is a core pillar of private wealth. We apply sophisticated quantitative modeling, deep regional micro-market analysis, and long-term regulatory insights to guide acquisitions that preserve and elevate family capital.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    tagline: 'STRATEGIC CAPITAL'
  },
  {
    id: 'life-3',
    title: 'The Poetry of Leisure',
    subtitle: 'Curated Natural Balance',
    description: 'True luxury lies in the luxury of time, nature, and deep comfort. Whether in the lush tranquility of Bahia\'s canopy or the crisp serenity of mountain ridges, we locate estates that foster wellness, recovery, and quiet memory creation.',
    image: '/src/assets/images/trancoso_beach_house_1783898016790.jpg',
    tagline: 'ORGANIC RECOVER'
  }
];

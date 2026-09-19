/**
 * Utilitários para geração de slugs amigáveis para URLs SEO
 */

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/[^a-z0-9]+/g, '-') // substitui não alfanuméricos por hífen
    .replace(/^-+|-+$/g, '') // remove hífens no início/fim
    .replace(/--+/g, '-'); // remove hífens duplicados
}

export function generatePropertySlug(property: { title: string; type: string; location: string; bedrooms: number; area: string }): string {
  const loc = slugify(property.location.split(',')[0]); // pega só bairro
  const type = slugify(property.type);
  const title = slugify(property.title);
  // Ex: apartamento-2-quartos-jardim-ipe-butanta
  return `${type}-${title}`.slice(0, 80).replace(/-+$/, '');
}

export function getRegionSlug(regionName: string): string {
  return slugify(regionName);
}

/**
 * Normaliza preço para schema.org (remove R$, pontos, espaços)
 */
export function parsePriceToNumber(formattedPrice: string): number {
  // Ex: "R$ 1.200.000" -> 1200000
  const cleaned = formattedPrice.replace(/[^\d]/g, '');
  return parseInt(cleaned, 10) || 0;
}

import { createClient } from '@sanity/client';

export function getSanityWriteClient() {
  const projectId = process.env.SANITY_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID || 'wpe14gsf';
  const dataset = process.env.SANITY_DATASET || 'production';
  const token = process.env.SANITY_WRITE_TOKEN;

  if (!token) {
    throw new Error('SANITY_WRITE_TOKEN não configurado no servidor (Vercel Env)');
  }

  return createClient({
    projectId,
    dataset,
    apiVersion: '2024-01-01',
    token,
    useCdn: false,
    perspective: 'raw',
  });
}

export function getSanityReadClient(withToken = false) {
  const projectId = process.env.SANITY_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID || 'wpe14gsf';
  const dataset = process.env.SANITY_DATASET || 'production';
  const token = withToken ? process.env.SANITY_WRITE_TOKEN : undefined;

  return createClient({
    projectId,
    dataset,
    apiVersion: '2024-01-01',
    token,
    useCdn: withToken ? false : true,
    perspective: withToken ? 'raw' : 'published',
  });
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/--+/g, '-')
    .slice(0, 80)
    .replace(/-+$/, '');
}

export function setCors(res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-password, Authorization');
}

export function descricaoToPortableText(texto: string): any[] {
  if (!texto || !texto.trim()) return [];
  const paragrafos = texto.split(/\n\s*\n/).filter(Boolean);
  if (paragrafos.length === 0) {
    return [
      {
        _type: 'block',
        _key: Math.random().toString(36).slice(2, 8),
        style: 'normal',
        children: [{ _type: 'span', _key: Math.random().toString(36).slice(2, 8), text: texto, marks: [] }],
        markDefs: [],
      },
    ];
  }
  return paragrafos.map((p) => ({
    _type: 'block',
    _key: Math.random().toString(36).slice(2, 8),
    style: 'normal',
    children: [{ _type: 'span', _key: Math.random().toString(36).slice(2, 8), text: p.trim(), marks: [] }],
    markDefs: [],
  }));
}

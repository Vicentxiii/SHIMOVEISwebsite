import { createClient } from '@sanity/client';

// Helper centralizado para resolver token com múltiplos nomes de env (corrige "Unauthorized - Session not found" por env mal configurado)
// Suporta: SANITY_WRITE_TOKEN (docs), SANITY_API_WRITE_TOKEN (solicitado na task), SANITY_API_TOKEN, SANITY_TOKEN e variantes VITE_
function resolveWriteToken(): string | undefined {
  const env: any = process.env as any;
  return (
    env.SANITY_WRITE_TOKEN ||
    env.SANITY_API_WRITE_TOKEN ||
    env.SANITY_API_TOKEN ||
    env.SANITY_TOKEN ||
    env.VITE_SANITY_WRITE_TOKEN ||
    env.VITE_SANITY_API_WRITE_TOKEN ||
    undefined
  );
}

function resolveProjectId(): string {
  const env: any = process.env as any;
  return env.SANITY_PROJECT_ID || env.VITE_SANITY_PROJECT_ID || env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'wpe14gsf';
}

function resolveDataset(): string {
  const env: any = process.env as any;
  return env.SANITY_DATASET || env.VITE_SANITY_DATASET || 'production';
}

export function getSanityWriteClient() {
  const projectId = resolveProjectId();
  const dataset = resolveDataset();
  const token = resolveWriteToken();

  if (!token) {
    // Mensagem limpa para o frontend exibir e orientar dev sobre Vercel Env
    throw new Error(
      'SANITY_WRITE_TOKEN não configurado no servidor. Configure SANITY_API_WRITE_TOKEN (ou SANITY_WRITE_TOKEN) em Vercel → Settings → Environment Variables (tipo: Editor Token) e faça Redeploy. Gere em https://www.sanity.io/manage > projeto wpe14gsf > API > Tokens.'
    );
  }

  // OBRIGATÓRIO para mutações: useCdn:false (sem cache) + token permanente com permissão de ESCRITA
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
  const projectId = resolveProjectId();
  const dataset = resolveDataset();
  const token = withToken ? resolveWriteToken() : undefined;

  return createClient({
    projectId,
    dataset,
    apiVersion: '2024-01-01',
    token: token || undefined,
    // Quando com token (admin) NÃO usar CDN para listar pausados/publicados em tempo real
    useCdn: withToken ? false : true,
    perspective: withToken ? 'raw' : 'published',
  });
}

// Util para o frontend verificar se há token ativo antes de client.assets.upload
export function hasWriteToken(): boolean {
  return !!resolveWriteToken();
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

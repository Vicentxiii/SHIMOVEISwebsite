import { getSanityReadClient, setCors, hasWriteToken } from '../src/lib/sanity-server.js';

export default async function handler(req: any, res: any) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Método não permitido' });

  try {
    const hasToken = hasWriteToken();
    const client = getSanityReadClient(hasToken);

    // Tenta buscar todos (incluindo pausados) se tiver token; senão só publicados
    const query = hasToken
      ? `*[_type == "imovel"] | order(_createdAt desc){ _id, _createdAt, titulo, slug, tipo, regiao, endereco, valor, finalidade, area, quartos, banheiros, vagas, descricao, fotos, publicado }`
      : `*[_type == "imovel" && publicado == true] | order(_createdAt desc){ _id, _createdAt, titulo, slug, tipo, regiao, endereco, valor, finalidade, area, quartos, banheiros, vagas, descricao, fotos, publicado }`;

    const imoveis = await client.fetch(query);
    return res.status(200).json({ imoveis: imoveis || [] });
  } catch (e: any) {
    console.error('[listar-imoveis] erro', e);
    return res.status(500).json({ error: 'Ops, algo deu errado. Tenta de novo ou me chama no WhatsApp', details: e.message });
  }
}

import { getSanityWriteClient, slugify, setCors, descricaoToPortableText } from '../src/lib/sanity-server.js';

export default async function handler(req: any, res: any) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  try {
    const client = getSanityWriteClient();
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    const {
      titulo,
      tipo,
      regiao,
      endereco,
      valor,
      finalidade,
      area,
      quartos,
      banheiros,
      vagas,
      descricao,
      fotos,
    } = body || {};

    // Validações simples
    if (!titulo || !titulo.trim()) return res.status(400).json({ error: 'Título é obrigatório' });
    if (!tipo) return res.status(400).json({ error: 'Tipo é obrigatório' });
    if (!regiao) return res.status(400).json({ error: 'Região é obrigatória' });
    if (!valor || isNaN(Number(valor))) return res.status(400).json({ error: 'Valor é obrigatório' });
    if (!fotos || !Array.isArray(fotos) || fotos.length === 0) {
      return res.status(400).json({ error: 'Adicione pelo menos 1 foto' });
    }

    // fotos deve vir como array de { _type: 'image', asset: {_type:'reference', _ref: 'image-...'}} ou string assetId
    const fotosSanity = fotos.map((f: any) => {
      if (typeof f === 'string') {
        return { _type: 'image', _key: Math.random().toString(36).slice(2, 8), asset: { _type: 'reference', _ref: f } };
      }
      if (f.asset && f.asset._ref) {
        return { _type: 'image', _key: f._key || Math.random().toString(36).slice(2, 8), asset: { _type: 'reference', _ref: f.asset._ref } };
      }
      if (f._ref) {
        return { _type: 'image', _key: Math.random().toString(36).slice(2, 8), asset: { _type: 'reference', _ref: f._ref } };
      }
      return f;
    });

    const baseSlug = slugify(titulo);
    const slugWithId = `${baseSlug}-${Date.now().toString().slice(-6)}`;

    const doc = {
      _type: 'imovel',
      titulo: titulo.trim(),
      slug: { _type: 'slug', current: slugWithId },
      tipo,
      regiao,
      endereco: (endereco || '').trim(),
      valor: Number(valor),
      finalidade: finalidade || 'Venda',
      area: Number(area) || 0,
      quartos: Number(quartos) || 0,
      banheiros: Number(banheiros) || 0,
      vagas: Number(vagas) || 0,
      descricao: descricaoToPortableText(descricao || ''),
      fotos: fotosSanity,
      publicado: true,
    };

    const created = await client.create(doc as any);

    return res.status(200).json({ ok: true, id: created._id, slug: slugWithId });
  } catch (e: any) {
    console.error('[criar-imovel] erro', e);
    const msg = e?.message || String(e);
    const isAuth = /SANITY_WRITE_TOKEN|SANITY_API_WRITE_TOKEN|não configurado|Unauthorized|Session not found/i.test(msg);
    if (isAuth) {
      return res.status(401).json({ error: 'Unauthorized - Session not found', details: msg });
    }
    return res.status(500).json({ error: 'Ops, algo deu errado. Tenta de novo ou me chama no WhatsApp', details: msg });
  }
}

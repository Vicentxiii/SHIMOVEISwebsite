import { getSanityWriteClient, slugify, setCors, descricaoToPortableText } from '../src/lib/sanity-server.js';

export default async function handler(req: any, res: any) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST' && req.method !== 'PATCH' && req.method !== 'PUT') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const client = getSanityWriteClient();
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    const {
      id,
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

    if (!id) return res.status(400).json({ error: 'ID do imóvel é obrigatório' });
    if (!titulo || !titulo.trim()) return res.status(400).json({ error: 'Título é obrigatório' });
    if (!fotos || !Array.isArray(fotos) || fotos.length === 0) {
      return res.status(400).json({ error: 'Adicione pelo menos 1 foto' });
    }

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

    const patch: any = {
      titulo: titulo.trim(),
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
    };

    // Se título mudou, atualiza slug também para manter URL consistente (opcional)
    if (titulo) {
      const newSlug = `${slugify(titulo)}-${id.slice(-6)}`;
      patch.slug = { _type: 'slug', current: newSlug };
    }

    const updated = await client.patch(id).set(patch).commit();

    return res.status(200).json({ ok: true, id: updated._id });
  } catch (e: any) {
    console.error('[editar-imovel] erro', e);
    return res.status(500).json({ error: 'Ops, algo deu errado. Tenta de novo ou me chama no WhatsApp', details: e?.message || String(e) });
  }
}

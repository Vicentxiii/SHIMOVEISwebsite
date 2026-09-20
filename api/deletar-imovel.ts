import { getSanityWriteClient, setCors } from '../src/lib/sanity-server.js';

export default async function handler(req: any, res: any) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { id } = body || {};
    if (!id || typeof id !== 'string' || !id.trim()) {
      return res.status(400).json({ error: 'ID do imóvel é obrigatório' });
    }

    const client = getSanityWriteClient();
    // Verifica se existe antes de deletar para dar feedback mais claro
    const exists = await client.fetch(`*[_id == $id][0]{ _id, titulo }`, { id });
    if (!exists) {
      return res.status(404).json({ error: 'Imóvel não encontrado — pode já ter sido removido' });
    }

    await client.delete(id);

    // Tenta também deletar draft se existir (Sanity cria drafts com prefixo drafts.)
    try {
      const draftId = `drafts.${id}`;
      const draftExists = await client.fetch(`*[_id == $draftId][0]{ _id }`, { draftId });
      if (draftExists) await client.delete(draftId);
    } catch {
      // ignora erro de draft
    }

    return res.status(200).json({ ok: true, id, titulo: exists.titulo });
  } catch (e: any) {
    console.error('[deletar-imovel] erro', e);
    const msg = e?.message || String(e);
    const isAuth = /SANITY_WRITE_TOKEN|SANITY_API_WRITE_TOKEN|não configurado|Unauthorized|Session not found/i.test(msg);
    if (isAuth) {
      return res.status(401).json({ error: 'Unauthorized - Session not found', details: msg });
    }
    return res.status(500).json({ error: 'Ops, algo deu errado ao remover. Tenta de novo.', details: msg });
  }
}

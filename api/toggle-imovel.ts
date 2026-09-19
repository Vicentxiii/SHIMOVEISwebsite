import { getSanityWriteClient, setCors } from '../src/lib/sanity-server.js';

export default async function handler(req: any, res: any) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST' && req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const client = getSanityWriteClient();
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { id } = body || {};
    if (!id) return res.status(400).json({ error: 'ID é obrigatório' });

    const doc = await client.getDocument(id);
    if (!doc) return res.status(404).json({ error: 'Imóvel não encontrado' });

    const novoStatus = !(doc as any).publicado;
    const updated = await client.patch(id).set({ publicado: novoStatus }).commit();

    return res.status(200).json({ ok: true, id: updated._id, publicado: novoStatus });
  } catch (e: any) {
    console.error('[toggle-imovel] erro', e);
    const msg = e?.message || String(e);
    const isAuth = /SANITY_WRITE_TOKEN|SANITY_API_WRITE_TOKEN|não configurado|Unauthorized|Session not found/i.test(msg);
    if (isAuth) {
      return res.status(401).json({ error: 'Unauthorized - Session not found', details: msg });
    }
    return res.status(500).json({ error: 'Ops, algo deu errado. Tenta de novo ou me chama no WhatsApp', details: msg });
  }
}

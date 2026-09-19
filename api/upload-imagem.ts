import { Buffer } from 'node:buffer';
import { getSanityWriteClient, setCors } from '../src/lib/sanity-server.js';

export default async function handler(req: any, res: any) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  try {
    const client = getSanityWriteClient();
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    const { imageBase64, filename, contentType } = body || {};

    if (!imageBase64) {
      return res.status(400).json({ error: 'Nenhuma imagem enviada (imageBase64 obrigatório)' });
    }

    // Remove prefix data:image/...;base64,
    const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
    const buffer = Buffer.from(base64Data, 'base64');
    const safeFilename = filename || `imovel-${Date.now()}.jpg`;
    const mime = contentType || 'image/jpeg';

    // Valida tamanho (limite 8MB para Vercel)
    if (buffer.length > 8 * 1024 * 1024) {
      return res.status(413).json({ error: 'Imagem muito grande. Tente uma menor (máx 8MB)' });
    }

    const asset = await (client as any).assets.upload('image', buffer, {
      filename: safeFilename,
      contentType: mime,
    });

    // Retorna referência pronta para usar no documento
    return res.status(200).json({
      assetId: asset._id,
      url: asset.url,
      asset: {
        _type: 'image',
        asset: { _type: 'reference', _ref: asset._id },
      },
    });
  } catch (e: any) {
    console.error('[upload-imagem] erro', e);
    return res.status(500).json({ error: 'Ops, algo deu errado. Tenta de novo ou me chama no WhatsApp', details: e?.message || String(e) });
  }
}

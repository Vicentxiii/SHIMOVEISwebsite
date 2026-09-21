import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, AlertTriangle, X, ExternalLink, Eye, Lock, LogOut, Plus, Search, Sparkles, Home, MapPin, Building2, Image as ImageIcon, FileText, DollarSign, Check, ChevronLeft, Maximize2, Minimize2, Sun, Moon } from 'lucide-react';
import { SEO } from '../components/SEO';
import { sanityClient, urlFor, SanityImovel, sanityAdminClient, hasAdminToken } from '../lib/sanity';
import { getRegionSlug, slugify } from '../utils/slugify';

const ADMIN_PASSWORD = ((import.meta as any).env?.VITE_ADMIN_PASSWORD as string | undefined) || 'silvia2026';
const LS_KEY = 'sh_admin_auth';
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

function saveSession() { localStorage.setItem(LS_KEY, JSON.stringify({ authenticated: true, ts: Date.now() })); }
function isSessionValid(): boolean {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return false;
    if (raw === 'true') { saveSession(); return true; }
    const data = JSON.parse(raw);
    if (!data?.authenticated || !data?.ts) return false;
    if (Date.now() - data.ts > SESSION_TTL_MS) return false;
    return true;
  } catch { return false; }
}
function readSessionSnapshot(): string | null { try { return localStorage.getItem(LS_KEY); } catch { return null; } }
function getSessionHeader(): Record<string, string> {
  try {
    const raw = readSessionSnapshot();
    if (!raw) return {};
    const token = hasAdminToken() ? 'sanity-token-present' : '';
    return { 'x-admin-auth': raw, ...(token ? { 'x-sanity-token': 'present' } : {}), Authorization: `Bearer ${ADMIN_PASSWORD}` };
  } catch { return {}; }
}
function getSessionHeaderFromSnapshot(snapshot: string | null): Record<string, string> {
  if (!snapshot) return {};
  const token = hasAdminToken() ? 'sanity-token-present' : '';
  return { 'x-admin-auth': snapshot, ...(token ? { 'x-sanity-token': 'present' } : {}), Authorization: `Bearer ${ADMIN_PASSWORD}` };
}

const TIPOS = [
  { label: 'Apartamento', value: 'Apartamento' },
  { label: 'Casa', value: 'Casa' },
  { label: 'Terreno', value: 'Terreno' },
  { label: 'Comercial', value: 'Comercial' },
  { label: 'Studio', value: 'Studio/Kitnet' },
] as const;
const REGIOES = ['Butantã', 'Taboão da Serra', 'Morumbi'] as const;
const FINALIDADES = ['Venda', 'Aluguel'] as const;

type FotoItem = { id: string; preview: string; file?: File; assetRef?: string; isNew: boolean; };

function formatarBRL(valor: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(valor);
}
function getImovelUrl(im: SanityImovel): string {
  const rawSlug = (typeof im.slug === 'string' ? (im.slug as string) : (im.slug as any)?.current || '').trim();
  const slug = rawSlug || `${slugify(im.titulo || 'imovel')}-${String(im._id).slice(-6)}`;
  const regiaoSlug = getRegionSlug(im.regiao || '');
  if (slug && regiaoSlug) return `/imoveis/${regiaoSlug}/${slug}`;
  if (slug) return `/imoveis/${slug}`;
  if (regiaoSlug) return `/imoveis/${regiaoSlug}`;
  return '/imoveis';
}
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const Stepper: React.FC<{ label: string; value: number; onChange: (v: number) => void; min?: number }> = ({ label, value, onChange, min = 0 }) => {
  return (
    <div className="flex items-center justify-between py-4 border-b border-brand-light/5 last:border-0 gap-4">
      <span className="text-[14px] font-light tracking-wide text-brand-light shrink-0">{label}</span>
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => onChange(Math.max(min, value - 1))} className="w-10 h-10 rounded-full border border-brand-gold/30 text-brand-gold hover:bg-brand-gold/10 hover:border-brand-gold flex items-center justify-center transition active:scale-95 shrink-0">
          −
        </button>
        <input
          type="text"
          inputMode="numeric"
          value={String(value)}
          onChange={(e) => {
            const raw = e.target.value.replace(/\D/g, '');
            if (raw === '') { onChange(min); return; }
            const n = parseInt(raw, 10);
            if (!isNaN(n)) onChange(Math.max(min, n));
          }}
          onFocus={(e) => e.currentTarget.select()}
          className="w-[72px] h-10 text-center text-[18px] font-light text-brand-light tabular-nums bg-brand-bg/40 border border-brand-light/10 rounded-full focus:outline-none focus:border-brand-gold focus:bg-brand-bg transition placeholder:text-brand-muted/40"
          aria-label={label}
        />
        <button type="button" onClick={() => onChange(value + 1)} className="w-10 h-10 rounded-full bg-brand-gold text-brand-bg hover:bg-[#e0b48a] flex items-center justify-center transition active:scale-95 shadow-[0_2px_10px_rgba(212,163,115,0.3)] shrink-0">
          +
        </button>
      </div>
    </div>
  );
};

export const AdminPage: React.FC = () => {
  const [autenticado, setAutenticado] = useState(false);
  const [senhaInput, setSenhaInput] = useState('');
  const [erroSenha, setErroSenha] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [imoveis, setImoveis] = useState<SanityImovel[]>([]);
  const [loadingLista, setLoadingLista] = useState(false);
  const [filtroBusca, setFiltroBusca] = useState('');
  const [modoForm, setModoForm] = useState<null | 'novo' | 'editar'>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [toast, setToast] = useState<{ tipo: 'sucesso' | 'erro'; msg: string } | null>(null);
  const [fotos, setFotos] = useState<FotoItem[]>([]);
  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState<string>('');
  const [regiao, setRegiao] = useState<string>('');
  const [endereco, setEndereco] = useState('');
  const [valor, setValor] = useState('');
  const [finalidade, setFinalidade] = useState<string>('Venda');
  const [area, setArea] = useState(70);
  const [quartos, setQuartos] = useState(2);
  const [banheiros, setBanheiros] = useState(1);
  const [vagas, setVagas] = useState(1);
  const [descricao, setDescricao] = useState('');
  const [imovelParaRemover, setImovelParaRemover] = useState<SanityImovel | null>(null);
  const [removendo, setRemovendo] = useState(false);
  const [gerandoDescricao, setGerandoDescricao] = useState(false);
  const [descricaoExpandida, setDescricaoExpandida] = useState(false);
  const [isPetFriendly, setIsPetFriendly] = useState(true);
  const [hasSwimmingPool, setHasSwimmingPool] = useState(false);
  const [hasGarden, setHasGarden] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('sh_admin_theme');
      return saved === 'light' ? 'light' : 'dark';
    } catch { return 'dark'; }
  });
  useEffect(() => { try { localStorage.setItem('sh_admin_theme', theme); } catch {} }, [theme]);
  const isLight = theme === 'light';
  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const raw = readSessionSnapshot();
    if (isSessionValid()) { setAutenticado(true); setErroSenha(''); }
    else {
      if (raw) {
        try {
          const data = raw === 'true' ? null : JSON.parse(raw);
          const expired = data?.ts ? Date.now() - data.ts > SESSION_TTL_MS : true;
          if (expired) { localStorage.removeItem(LS_KEY); setErroSenha('Sua sessão expirou. Faça login novamente.'); }
        } catch { localStorage.removeItem(LS_KEY); }
      }
    }
    setCheckingAuth(false);
  }, []);

  const carregarImoveis = async () => {
    setLoadingLista(true);
    const handleListError = (e: any) => {
      const msg = e?.message || String(e);
      const isAuthError = msg.toLowerCase().includes('session') || msg.toLowerCase().includes('unauthorized') || msg.toLowerCase().includes('não autorizado') || msg.toLowerCase().includes('401') || msg.includes('SANITY_WRITE_TOKEN');
      if (isAuthError) { handleSessionExpired('Sessão não encontrada ou expirada. Faça login novamente.'); setToast({ tipo: 'erro', msg: '🔒 Sessão expirada. Faça login novamente.' }); return true; }
      return false;
    };
    try {
      const headers = { ...getSessionHeader() } as Record<string, string>;
      const r = await fetch('/api/listar-imoveis', { headers });
      if (r.ok) {
        const j = await r.json();
        if (Array.isArray(j.imoveis)) { setImoveis(j.imoveis); setLoadingLista(false); return; }
      } else {
        let errText = '';
        try { const errJ = await r.clone().json(); errText = errJ?.error || errJ?.details || ''; } catch { errText = await r.text().catch(() => ''); }
        if (r.status === 404 && (!errText || errText.trim().startsWith('<!doctype'))) throw new Error('fallback');
        if (errText) throw new Error(errText);
        throw new Error(`HTTP ${r.status}`);
      }
      throw new Error('fallback');
    } catch (e: any) {
      if (handleListError(e)) { setLoadingLista(false); return; }
      try {
        const fallbackClient = hasAdminToken() && sanityAdminClient ? sanityAdminClient : sanityClient;
        const q = `*[_type == "imovel"] | order(_createdAt desc){ _id, _createdAt, titulo, slug, tipo, regiao, endereco, valor, finalidade, area, quartos, banheiros, vagas, descricao, fotos, publicado, isPetFriendly, hasSwimmingPool, hasGarden, hasOceanView }`;
        const dados = await (fallbackClient as any).fetch<SanityImovel[]>(q);
        setImoveis(dados || []);
        if (!dados || dados.length === 0) console.warn('[carregarImoveis] fallback vazio');
      } catch (e2: any) {
        console.warn('[carregarImoveis] fallback falhou', e2);
        const msg2 = String(e2?.message || '').toLowerCase();
        if (msg2.includes('session') || msg2.includes('unauthorized') || msg2.includes('401') || msg2.includes('permission')) { handleSessionExpired(); return; }
        setImoveis([]);
      }
    } finally { setLoadingLista(false); }
  };

  useEffect(() => { if (autenticado) carregarImoveis(); }, [autenticado]);
  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(null), toast.tipo === 'sucesso' ? 3500 : 5000); return () => clearTimeout(t); } }, [toast]);

  const handleSessionExpired = (msg = 'Sua sessão expirou. Faça login novamente.') => {
    localStorage.removeItem(LS_KEY);
    setAutenticado(false); setSenhaInput(''); setErroSenha(msg);
    if (window.location.pathname !== '/admin' && window.location.pathname !== '/admin/login') window.location.href = '/admin/login';
    window.scrollTo(0, 0);
  };
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (senhaInput === ADMIN_PASSWORD) { saveSession(); setAutenticado(true); setErroSenha(''); }
    else setErroSenha('Senha incorreta. Tenta de novo.');
  };
  const handleSair = () => { localStorage.removeItem(LS_KEY); setAutenticado(false); setSenhaInput(''); setErroSenha(''); };
  const limparForm = () => { setFotos([]); setTitulo(''); setTipo(''); setRegiao(''); setEndereco(''); setValor(''); setFinalidade('Venda'); setArea(70); setQuartos(2); setBanheiros(1); setVagas(1); setDescricao(''); setIsPetFriendly(true); setHasSwimmingPool(false); setHasGarden(false); setEditId(null); };
  const abrirNovo = () => { limparForm(); setModoForm('novo'); window.scrollTo(0, 0); };
  const abrirEditar = (im: SanityImovel) => {
    setEditId(im._id); setTitulo(im.titulo || ''); setTipo(im.tipo || ''); setRegiao(im.regiao || ''); setEndereco(im.endereco || ''); setValor(String(im.valor || '')); setFinalidade(im.finalidade || 'Venda');
    setArea(Number(im.area) || 0); setQuartos(Number(im.quartos) || 0); setBanheiros(Number(im.banheiros) || 0); setVagas(Number(im.vagas) || 0);
    setIsPetFriendly((im as any).isPetFriendly !== undefined ? !!(im as any).isPetFriendly : true);
    setHasSwimmingPool(!!(im as any).hasSwimmingPool);
    setHasGarden(!!(im as any).hasGarden);
    if (Array.isArray(im.descricao)) {
      const txt = im.descricao.map((b: any) => (b.children ? b.children.map((c: any) => c.text).join('') : '')).join('\n\n');
      setDescricao(txt);
    } else if (typeof im.descricao === 'string') setDescricao(im.descricao as any); else setDescricao('');
    const fotosExistentes: FotoItem[] = (im.fotos || []).map((f: any, idx: number) => {
      let preview = ''; try { preview = urlFor(f).width(600).auto('format').url(); } catch { preview = ''; }
      const ref = f?.asset?._ref || f?.asset?._id || '';
      return { id: `exist-${idx}-${ref.slice(0, 8)}`, preview, assetRef: ref, isNew: false };
    });
    setFotos(fotosExistentes); setModoForm('editar'); window.scrollTo(0, 0);
  };
  const handleFotosSelecionadas = (files: FileList | null) => {
    if (!files) return;
    const MAX_FOTOS = 10;
    const restantes = MAX_FOTOS - fotos.length;
    if (restantes <= 0) { setToast({ tipo: 'erro', msg: 'Limite de 10 fotos atingido. Remova alguma antes de adicionar mais.' }); return; }
    const arquivos = Array.from(files).slice(0, restantes);
    if (arquivos.length < files.length) setToast({ tipo: 'erro', msg: `Só cabem mais ${restantes} foto(s). Limite de 10 fotos para não lotar o Sanity. As primeiras ${restantes} foram adicionadas.` });
    const novos: FotoItem[] = arquivos.map((file) => ({ id: `new-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, preview: URL.createObjectURL(file), file, isNew: true }));
    setFotos((prev) => [...prev, ...novos]);
  };
  const removerFoto = (id: string) => {
    setFotos((prev) => {
      const item = prev.find((p) => p.id === id);
      if (item?.isNew && item.preview.startsWith('blob:')) URL.revokeObjectURL(item.preview);
      return prev.filter((p) => p.id !== id);
    });
  };
  const fetchJson = async (url: string, opts: RequestInit, timeoutMs = 45000) => {
    const sessionHeaders = getSessionHeader();
    const mergedHeaders = { ...(opts.headers as Record<string, string> | undefined), ...sessionHeaders } as Record<string, string>;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    let r: Response;
    try { r = await fetch(url, { ...opts, headers: mergedHeaders, signal: controller.signal }); }
    catch (e: any) { clearTimeout(timeoutId); if (e?.name === 'AbortError') throw new Error(`Timeout na API (${timeoutMs / 1000}s). Tente com fotos menores.`); throw e; }
    clearTimeout(timeoutId);
    const text = await r.text();
    let j: any = null;
    try { j = text ? JSON.parse(text) : null; } catch {
      const isHtml = text.trim().startsWith('<!doctype') || text.trim().startsWith('<html');
      if (isHtml) throw new Error(`API não encontrada (recebeu HTML). Use "vercel dev" ou faça deploy na Vercel.`);
      throw new Error(text.slice(0, 300) || `Erro ${r.status}`);
    }
    if (!r.ok) {
      const rawMsg = j?.error || j?.details || '';
      const isSessionError = r.status === 401 || r.status === 403 || /session not found/i.test(rawMsg) || /unauthorized/i.test(rawMsg) || /não autorizado/i.test(rawMsg) || /não configurado/i.test(rawMsg) || /SANITY_WRITE_TOKEN/i.test(rawMsg) || /SANITY_API_WRITE_TOKEN/i.test(rawMsg);
      if (isSessionError) { const msg = j?.error || j?.details || `Sessão não encontrada (HTTP ${r.status})`; const details = j?.details ? ` (${j.details})` : ''; throw new Error(msg + details); }
      const msg = j?.error || j?.details || `Erro ${r.status}`; const details = j?.details ? ` (${j.details})` : ''; throw new Error(msg + details);
    }
    return j;
  };
  const handleTogglePublicado = async (im: SanityImovel) => {
    try {
      if (!isSessionValid()) { handleSessionExpired(); return; }
      const j = await fetchJson('/api/toggle-imovel', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: im._id }) });
      setImoveis((prev) => prev.map((p) => (p._id === im._id ? { ...p, publicado: j.publicado } : p)));
      setToast({ tipo: 'sucesso', msg: j.publicado ? '✅ Ativado! Já está no site.' : '⏸️ Pausado. Não aparece no site.' });
    } catch (e: any) {
      const msg = e?.message || ''; const isAuth = /session not found|unauthorized|não autorizado|não configurado|SANITY_WRITE_TOKEN|SANITY_API_WRITE_TOKEN|401|403/i.test(msg);
      if (isAuth) { handleSessionExpired('Sessão expirada. Faça login novamente.'); setToast({ tipo: 'erro', msg: '🔒 Sessão expirada.' }); return; }
      setToast({ tipo: 'erro', msg: e?.message || 'Ops, algo deu errado.' });
    }
  };
  const handleRemover = async () => {
    if (!imovelParaRemover) return;
    if (!isSessionValid()) { handleSessionExpired('Sessão expirada. Faça login novamente para remover.'); return; }
    setRemovendo(true);
    try {
      await fetchJson('/api/deletar-imovel', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: imovelParaRemover._id }) });
      setImoveis((prev) => prev.filter((p) => p._id !== imovelParaRemover._id));
      setToast({ tipo: 'sucesso', msg: `🗑️ "${imovelParaRemover.titulo}" removido.` });
      setImovelParaRemover(null);
    } catch (e: any) {
      const msg = e?.message || ''; const isAuth = /session not found|unauthorized|não autorizado|não configurado|SANITY_WRITE_TOKEN|SANITY_API_WRITE_TOKEN|401|403/i.test(msg);
      if (isAuth) { handleSessionExpired('Sessão expirada.'); setToast({ tipo: 'erro', msg: '🔒 Sessão expirada.' }); return; }
      setToast({ tipo: 'erro', msg: e?.message || 'Não deu para remover.' });
    } finally { setRemovendo(false); }
  };

  const handleGerarDescricao = async () => {
    if (!titulo.trim() || !tipo || !regiao || !valor) {
      setToast({ tipo: 'erro', msg: 'Preencha título, tipo, região e valor antes de gerar com IA.' });
      return;
    }
    setGerandoDescricao(true);
    try {
      const headers = { 'Content-Type': 'application/json', ...getSessionHeader() } as Record<string, string>;
      const r = await fetch('/api/gerar-descricao', {
        method: 'POST',
        headers,
        body: JSON.stringify({ titulo, tipo, regiao, endereco, valor, finalidade, area, quartos, banheiros, vagas, descricao }),
      });
      const text = await r.text();
      let j: any = {};
      try { j = text ? JSON.parse(text) : {}; } catch {
        const isHtml = text.trim().startsWith('<!doctype') || text.trim().startsWith('<html');
        if (isHtml) throw new Error('API não encontrada (recebeu HTML). Você está em "npm run dev" sem serverless — use "vercel dev" (porta 3000) ou faça deploy na Vercel para testar a IA.');
        throw new Error(text.slice(0, 400) || `Erro ${r.status}`);
      }
      if (!r.ok) throw new Error(j.error || `Erro ${r.status} ao gerar`);
      setDescricao(j.descricao);
      if (j.fallback) {
        setToast({ tipo: 'sucesso', msg: '✨ Descrição gerada (fallback local) — IA em alta demanda, revise antes de salvar.' });
      } else {
        setToast({ tipo: 'sucesso', msg: '✨ Descrição gerada com IA — revise e ajuste antes de salvar.' });
      }
    } catch (e: any) {
      setToast({ tipo: 'erro', msg: e?.message?.slice(0, 500) || 'Erro ao gerar descrição' });
    } finally {
      setGerandoDescricao(false);
    }
  };

  const handleSalvar = async () => {
    if (!titulo.trim()) return setToast({ tipo: 'erro', msg: 'Escreve o título do anúncio' });
    if (!tipo) return setToast({ tipo: 'erro', msg: 'Escolhe o tipo de imóvel' });
    if (!regiao) return setToast({ tipo: 'erro', msg: 'Escolhe a região' });
    if (!valor || isNaN(Number(valor.replace(/\D/g, '')))) return setToast({ tipo: 'erro', msg: 'Coloca o valor do imóvel' });
    if (fotos.length === 0) return setToast({ tipo: 'erro', msg: 'Adiciona pelo menos 1 foto' });
    if (!endereco.trim()) return setToast({ tipo: 'erro', msg: 'Coloca o endereço' });
    const sessionSnapshot = readSessionSnapshot();
    const hasSessionSimple = !!sessionSnapshot;
    if (!hasSessionSimple) { handleSessionExpired('Sessão não encontrada. Faça login novamente.'); setToast({ tipo: 'erro', msg: '🔒 Sessão não encontrada.' }); return; }
    const lockedAuth = true;
    const lockedSessionSnapshot = sessionSnapshot;
    const headersSnapshot = getSessionHeaderFromSnapshot(lockedSessionSnapshot);
    if (lockedAuth) setAutenticado(true);
    setSalvando(true);
    try {
      const hasToken = hasAdminToken();
      const fotosParaEnviar: any[] = [];
      for (const f of fotos) {
        if (f.isNew && f.file) {
          let assetId: string | null = null;
          if (hasToken && sanityAdminClient) {
            try {
              const asset = await (sanityAdminClient as any).assets.upload('image', f.file, { filename: f.file.name, contentType: f.file.type || 'image/jpeg' });
              assetId = asset._id;
            } catch (directErr: any) { console.warn('[Admin] fallback upload', directErr?.message); }
          }
          if (!assetId) {
            const base64 = await fileToBase64(f.file);
            const j = await fetchJson('/api/upload-imagem', { method: 'POST', headers: { 'Content-Type': 'application/json', ...headersSnapshot }, body: JSON.stringify({ imageBase64: base64, filename: f.file.name, contentType: f.file.type || 'image/jpeg' }) }, 120000);
            if (!j.assetId) throw new Error(j.error || 'Erro no upload da foto');
            assetId = j.assetId;
          }
          fotosParaEnviar.push({ _type: 'image', asset: { _type: 'reference', _ref: assetId } });
        } else if (f.assetRef) {
          fotosParaEnviar.push({ _type: 'image', asset: { _type: 'reference', _ref: f.assetRef } });
        }
      }
      const valorNum = Number(valor.toString().replace(/\D/g, ''));
      const payload = { titulo: titulo.trim(), tipo, regiao, endereco: endereco.trim(), valor: valorNum, finalidade, area: Number(area), quartos: Number(quartos), banheiros: Number(banheiros), vagas: Number(vagas), descricao: descricao.trim(), fotos: fotosParaEnviar, isPetFriendly, hasSwimmingPool, hasGarden };
      if (modoForm === 'editar' && editId) {
        await fetchJson('/api/editar-imovel', { method: 'POST', headers: { 'Content-Type': 'application/json', ...headersSnapshot }, body: JSON.stringify({ id: editId, ...payload }) }, 120000);
      } else {
        await fetchJson('/api/criar-imovel', { method: 'POST', headers: { 'Content-Type': 'application/json', ...headersSnapshot }, body: JSON.stringify(payload) }, 120000);
      }
      setToast({ tipo: 'sucesso', msg: '✅ Imóvel salvo! Já está no site.' });
      try { const cur = readSessionSnapshot(); if (cur) saveSession(); } catch {}
      setTimeout(async () => { setModoForm(null); limparForm(); await carregarImoveis(); }, 1200);
    } catch (e: any) {
      const msg = e?.message || 'Ops, algo deu errado.';
      const isTimeout = /timeout|aborterror|timed out|failed to fetch|networkerror|aborted/i.test(msg);
      if (isTimeout) { setToast({ tipo: 'erro', msg: 'Conexão lenta — sua sessão continua ativa. Comprima para < 3MB e tente de novo.' }); return; }
      const isNetworkError = /erro ao subir a imagem|erro no upload|sem assetid|failed to fetch|network|503|502|504|econnreset|enotfound/i.test(msg) || /sanity.*lentidão|temporário/i.test(msg);
      if (isNetworkError) { setToast({ tipo: 'erro', msg: 'Sanity demorou — sessão continua ativa. Tente novamente.' }); return; }
      const isAuthError = /session not found/i.test(msg) || /unauthorized/i.test(msg) || /não autorizado/i.test(msg) || /não configurado/i.test(msg) || /SANITY_WRITE_TOKEN/i.test(msg) || /SANITY_API_WRITE_TOKEN/i.test(msg) || /401|403/.test(msg);
      if (isAuthError) { setToast({ tipo: 'erro', msg: 'Erro 401/403 — sessão continua ativa. Tente em 10s. Verifique SANITY_API_WRITE_TOKEN na Vercel.' }); return; }
      const isTokenError = msg.includes('SANITY_WRITE_TOKEN') || msg.includes('SANITY_API_WRITE_TOKEN') || msg.includes('não configurado');
      setToast({ tipo: 'erro', msg: isTokenError ? '⚠️ Token não configurado na Vercel. ' + msg : msg.length > 220 ? msg.slice(0, 220) + '…' : msg });
    } finally { setSalvando(false); }
  };

  const imoveisFiltrados = imoveis.filter((im) => {
    if (!filtroBusca.trim()) return true;
    const q = filtroBusca.toLowerCase();
    return im.titulo.toLowerCase().includes(q) || im.regiao.toLowerCase().includes(q) || im.tipo.toLowerCase().includes(q);
  });

  if (checkingAuth) {
    return (
      <div className={isLight ? 'min-h-screen flex items-center justify-center bg-[#FDF8F5]' : 'min-h-screen flex items-center justify-center bg-brand-bg'}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-brand-gold/30 border-t-brand-gold rounded-full animate-spin" />
          <p className={isLight ? 'text-zinc-500 text-sm tracking-wide' : 'text-brand-muted text-sm tracking-wide'}>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!autenticado) {
    return (
      <div className={isLight ? 'min-h-screen flex flex-col relative overflow-hidden bg-[#FDF8F5] text-[#1d0a12]' : 'min-h-screen flex flex-col relative overflow-hidden bg-brand-bg text-brand-light'}>
        <SEO title="Admin — Silvia Helena" description="Área administrativa" canonical="https://silviahelenacorretora.com.br/admin" noindex={true} />
        <button type="button" onClick={toggleTheme} className={isLight ? 'absolute top-4 right-4 z-20 w-10 h-10 rounded-full border flex items-center justify-center transition bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50 shadow-sm' : 'absolute top-4 right-4 z-20 w-10 h-10 rounded-full border flex items-center justify-center transition bg-white/[0.06] border-white/10 text-brand-light hover:bg-white/10'} aria-label={isLight ? 'Mudar para tema escuro' : 'Mudar para tema claro'}>
          {isLight ? <Moon size={16} /> : <Sun size={16} />}
        </button>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-brand-gold/10 blur-[120px] rounded-full" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)`, backgroundSize: '72px 72px' }} aria-hidden="true" />
        </div>
        <div className="flex-1 flex items-center justify-center p-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className={isLight ? 'w-full max-w-[420px] bg-white rounded-[24px] shadow-[0_24px_64px_rgba(0,0,0,0.08)] p-8 md:p-10 border border-zinc-200' : 'w-full max-w-[420px] bg-[#1d0a12]/80 backdrop-blur-xl rounded-[24px] shadow-[0_24px_64px_rgba(0,0,0,0.5)] p-8 md:p-10 border border-brand-light/10'}>
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent" aria-hidden="true" />
            <div className="text-center mb-8">
              <div className="mx-auto w-14 h-14 rounded-full bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(212,163,115,0.15)]">
                <Lock size={20} className="text-brand-gold" />
              </div>
              <h1 className={isLight ? 'font-serif text-[28px] font-light tracking-wide text-[#1d0a12]' : 'font-serif text-[28px] font-light tracking-wide text-brand-light'}>Área da Silvia</h1>
              <p className={isLight ? 'text-[13px] mt-2 leading-relaxed font-light text-zinc-600' : 'text-[13px] mt-2 leading-relaxed font-light text-brand-muted'}>Bem-vinda de volta, Silvia — digite sua senha</p>
              <p className="text-[11px] tracking-[0.18em] text-brand-gold/60 uppercase mt-1">CRECISP 125743 • Acesso restrito</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className={isLight ? 'block text-[11px] tracking-[0.18em] uppercase font-light mb-2 text-zinc-500' : 'block text-[11px] tracking-[0.18em] uppercase font-light mb-2 text-brand-muted'}>Senha</label>
                <input type="password" value={senhaInput} onChange={(e) => setSenhaInput(e.target.value)} placeholder="Sua senha" className={isLight ? 'w-full h-[52px] px-4 rounded-[12px] border text-[15px] focus:outline-none focus:border-brand-gold transition bg-white border-zinc-200 text-[#1d0a12] placeholder:text-zinc-400 focus:bg-white' : 'w-full h-[52px] px-4 rounded-[12px] border text-[15px] focus:outline-none focus:border-brand-gold transition bg-brand-bg/60 border-brand-light/10 text-brand-light placeholder:text-brand-muted/40 focus:bg-brand-bg'} autoFocus />
                {erroSenha && <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="text-[13px] text-red-400 mt-2 flex items-center gap-1.5"><AlertTriangle size={14} /> {erroSenha}</motion.p>}
              </div>
              <button type="submit" className="w-full h-[52px] rounded-full bg-brand-gold hover:bg-[#e0b48a] text-brand-bg text-[14px] font-semibold tracking-[0.16em] uppercase shadow-[0_8px_24px_rgba(212,163,115,0.3)] hover:shadow-[0_10px_28px_rgba(212,163,115,0.4)] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2">
                <Lock size={14} /> Entrar no painel
              </button>
              <p className="text-center text-[11px] text-brand-muted/60 leading-relaxed pt-2">
                Dica: senha em <span className="font-mono bg-white/5 border border-white/10 px-2 py-1 rounded text-brand-gold">VITE_ADMIN_PASSWORD</span> na Vercel
              </p>
            </form>
          </motion.div>
        </div>
        <div className="text-center pb-6 text-[11px] tracking-[0.18em] text-brand-muted/50 uppercase">Silvia Helena • CRECISP 125743 • Butantã • Morumbi • Taboão</div>
      </div>
    );
  }

  if (modoForm) {
    return (
      <div className={isLight ? 'min-h-screen pb-[96px] bg-[#FDF8F5] text-[#1d0a12]' : 'min-h-screen pb-[96px] bg-brand-bg text-brand-light'}>
        <SEO title={modoForm === 'novo' ? 'Novo imóvel — Admin' : 'Editar imóvel — Admin'} description="Administração" canonical="https://silviahelenacorretora.com.br/admin" noindex={true} />
        <div className={isLight ? 'sticky top-0 z-30 border-b bg-white/95 backdrop-blur border-zinc-200' : 'sticky top-0 z-30 border-b bg-brand-bg border-brand-light/10'}>
          <div className="h-[1px] bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent" aria-hidden="true" />
          <div className="max-w-[720px] mx-auto px-4 h-[64px] flex items-center justify-between gap-2">
            <button onClick={() => { setModoForm(null); limparForm(); }} className={isLight ? 'text-[13px] tracking-[0.14em] uppercase font-light flex items-center gap-2 px-2 py-2 -ml-2 transition text-zinc-500 hover:text-[#1d0a12]' : 'text-[13px] tracking-[0.14em] uppercase font-light flex items-center gap-2 px-2 py-2 -ml-2 transition text-brand-muted hover:text-brand-light'}>
              <ChevronLeft size={18} className="text-brand-gold" /> Voltar
            </button>
            <span className={isLight ? 'font-serif text-[16px] tracking-wide flex items-center gap-2 text-[#1d0a12]' : 'font-serif text-[16px] tracking-wide flex items-center gap-2 text-brand-light'}><Sparkles size={14} className="text-brand-gold" /> {modoForm === 'novo' ? 'Novo imóvel' : 'Editar imóvel'}</span>
            <button type="button" onClick={toggleTheme} className={isLight ? 'w-9 h-9 rounded-full border flex items-center justify-center transition bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50 shadow-sm' : 'w-9 h-9 rounded-full border flex items-center justify-center transition bg-white/[0.06] border-white/10 text-brand-light hover:bg-white/10'} aria-label={isLight ? 'Mudar para tema escuro' : 'Mudar para tema claro'}>
              {isLight ? <Moon size={15} /> : <Sun size={15} />}
            </button>
          </div>
        </div>
        {toast && (
          <div className="mx-auto max-w-[720px] px-4 mt-4">
            <div className={`rounded-[12px] px-5 py-4 text-[13px] font-light leading-relaxed border backdrop-blur ${toast.tipo === 'sucesso' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-red-500/10 border-red-500/20 text-red-300'}`}>{toast.msg}</div>
          </div>
        )}
        <div className="max-w-[720px] mx-auto px-4 pt-6 space-y-5">
          <div className={isLight ? 'bg-white border border-zinc-200 rounded-[20px] p-5 md:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.06)]' : 'bg-[#1d0a12]/60 backdrop-blur-xl rounded-[20px] p-5 md:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-brand-light/10'}>
            <label className="flex items-center gap-2 text-[12px] tracking-[0.16em] text-brand-gold uppercase font-light mb-1"><ImageIcon size={14} /> 1. Fotos do imóvel *</label>
            <p className="text-[13px] text-brand-muted font-light mb-4">Toque para adicionar — câmera do celular liberada • <span className="text-brand-light font-medium">{fotos.length}/10</span></p>
            <button type="button" onClick={() => fotos.length < 10 && fileInputRef.current?.click()} disabled={fotos.length >= 10} className={`w-full h-[140px] rounded-[16px] border-2 border-dashed flex flex-col items-center justify-center gap-2 transition active:scale-[0.99] ${fotos.length >= 10 ? 'border-brand-light/10 bg-white/[0.02] text-brand-muted cursor-not-allowed opacity-60' : 'border-brand-gold/25 bg-brand-gold/[0.04] hover:bg-brand-gold/[0.08] hover:border-brand-gold/40 text-brand-light'}`}>
              <span className="w-10 h-10 rounded-full bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center"><ImageIcon size={18} className="text-brand-gold" /></span>
              <span className="text-[14px] font-medium tracking-wide">{fotos.length >= 10 ? 'Limite de 10 fotos atingido' : 'Toque para adicionar fotos'}</span>
              <span className="text-[12px] text-brand-muted font-light">{fotos.length >= 10 ? 'Remova alguma para continuar' : 'Pode selecionar várias de uma vez'}</span>
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" multiple capture="environment" className="hidden" onChange={(e) => handleFotosSelecionadas(e.target.files)} disabled={fotos.length >= 10} />
            {fotos.length > 0 && (
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mt-5">
                {fotos.map((f) => (
                  <div key={f.id} className="relative group aspect-square rounded-[12px] overflow-hidden bg-black/20 border border-brand-light/10">
                    <img src={f.preview} alt="foto" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removerFoto(f.id)} className="absolute top-1.5 right-1.5 w-8 h-8 rounded-full bg-red-600/90 backdrop-blur text-white flex items-center justify-center shadow-md active:scale-90 hover:bg-red-600 transition" aria-label="Remover foto">
                      <X size={14} />
                    </button>
                    {!f.isNew && <span className="absolute bottom-1 left-1 bg-emerald-500/90 backdrop-blur text-white text-[9px] tracking-widest uppercase px-1.5 py-0.5 rounded-full">salva</span>}
                  </div>
                ))}
              </div>
            )}
            <p className={`text-[12px] mt-3 font-light ${fotos.length >= 10 ? 'text-amber-300' : 'text-brand-muted/70'}`}>{fotos.length}/10 foto(s) • {fotos.length >= 10 ? 'limite atingido' : 'a primeira será a capa • máximo 10'}</p>
          </div>

          <div className={isLight ? 'bg-white border border-zinc-200 rounded-[20px] p-5 md:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.06)]' : 'bg-[#1d0a12]/60 backdrop-blur-xl rounded-[20px] p-5 md:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-brand-light/10'}>
            <label className="flex items-center gap-2 text-[12px] tracking-[0.16em] text-brand-gold uppercase font-light mb-3"><FileText size={14} /> 2. Título do anúncio *</label>
            <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex: Casa 3 quartos com quintal no Butantã" className={isLight ? 'w-full h-[52px] px-4 rounded-[12px] border text-[15px] focus:outline-none focus:border-brand-gold transition bg-white border-zinc-200 text-[#1d0a12] placeholder:text-zinc-400 focus:bg-white' : 'w-full h-[52px] px-4 rounded-[12px] border text-[15px] focus:outline-none focus:border-brand-gold transition bg-brand-bg/60 border-brand-light/10 text-brand-light placeholder:text-brand-muted/40 focus:bg-brand-bg'} />
          </div>

          <div className={isLight ? 'bg-white border border-zinc-200 rounded-[20px] p-5 md:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.06)]' : 'bg-[#1d0a12]/60 backdrop-blur-xl rounded-[20px] p-5 md:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-brand-light/10'}>
            <label className="flex items-center gap-2 text-[12px] tracking-[0.16em] text-brand-gold uppercase font-light mb-3"><Building2 size={14} /> 3. Tipo de imóvel *</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {TIPOS.map((t) => (
                <button key={t.value} type="button" onClick={() => setTipo(t.value)} className={`h-[48px] rounded-full border text-[13px] font-medium tracking-wide transition active:scale-[0.98] ${tipo === t.value ? 'bg-brand-gold text-brand-bg border-brand-gold shadow-[0_4px_16px_rgba(212,163,115,0.3)]' : 'bg-white/[0.03] text-brand-muted border-brand-light/10 hover:border-brand-gold/30 hover:text-brand-light hover:bg-white/[0.06]'}`}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className={isLight ? 'bg-white border border-zinc-200 rounded-[20px] p-5 md:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.06)]' : 'bg-[#1d0a12]/60 backdrop-blur-xl rounded-[20px] p-5 md:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-brand-light/10'}>
            <label className="flex items-center gap-2 text-[12px] tracking-[0.16em] text-brand-gold uppercase font-light mb-3"><MapPin size={14} /> 4. Região *</label>
            <div className="grid grid-cols-1 gap-2.5">
              {REGIOES.map((r) => (
                <button key={r} type="button" onClick={() => setRegiao(r)} className={`h-[48px] rounded-full border text-[13px] font-medium tracking-wide transition active:scale-[0.98] flex items-center justify-center gap-2 ${regiao === r ? 'bg-brand-gold text-brand-bg border-brand-gold shadow-[0_4px_16px_rgba(212,163,115,0.3)]' : 'bg-white/[0.03] text-brand-muted border-brand-light/10 hover:border-brand-gold/30 hover:text-brand-light'}`}>
                  <MapPin size={12} className={regiao === r ? 'text-brand-bg' : 'text-brand-gold'} /> {r}
                </button>
              ))}
            </div>
          </div>

          <div className={isLight ? 'bg-white border border-zinc-200 rounded-[20px] p-5 md:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.06)]' : 'bg-[#1d0a12]/60 backdrop-blur-xl rounded-[20px] p-5 md:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-brand-light/10'}>
            <label className="flex items-center gap-2 text-[12px] tracking-[0.16em] text-brand-gold uppercase font-light mb-3"><Home size={14} /> 5. Endereço</label>
            <input type="text" value={endereco} onChange={(e) => setEndereco(e.target.value)} placeholder="Rua, número e bairro" className={isLight ? 'w-full h-[52px] px-4 rounded-[12px] border text-[14px] focus:outline-none focus:border-brand-gold transition bg-white border-zinc-200 text-[#1d0a12] placeholder:text-zinc-400 focus:bg-white' : 'w-full h-[52px] px-4 rounded-[12px] border text-[14px] focus:outline-none focus:border-brand-gold transition bg-brand-bg/60 border-brand-light/10 text-brand-light placeholder:text-brand-muted/40 focus:bg-brand-bg'} />
          </div>

          <div className={isLight ? 'bg-white border border-zinc-200 rounded-[20px] p-5 md:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.06)]' : 'bg-[#1d0a12]/60 backdrop-blur-xl rounded-[20px] p-5 md:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-brand-light/10'}>
            <label className="flex items-center gap-2 text-[12px] tracking-[0.16em] text-brand-gold uppercase font-light mb-3"><DollarSign size={14} /> 6. Valor *</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[16px] font-light text-brand-gold">R$</span>
              <input type="text" inputMode="numeric" value={valor} onChange={(e) => { const onlyNums = e.target.value.replace(/\D/g, ''); setValor(onlyNums); }} placeholder="520000" className={isLight ? 'w-full h-[56px] pl-12 pr-4 rounded-[12px] border text-[18px] font-light focus:outline-none focus:border-brand-gold transition bg-white border-zinc-200 text-[#1d0a12] placeholder:text-zinc-400' : 'w-full h-[56px] pl-12 pr-4 rounded-[12px] border text-[18px] font-light focus:outline-none focus:border-brand-gold transition bg-brand-bg/60 border-brand-light/10 text-brand-light placeholder:text-brand-muted/30'} />
            </div>
            {valor && <p className="text-[13px] font-light text-brand-gold mt-2">{formatarBRL(Number(valor) || 0)}</p>}
          </div>

          <div className={isLight ? 'bg-white border border-zinc-200 rounded-[20px] p-5 md:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.06)]' : 'bg-[#1d0a12]/60 backdrop-blur-xl rounded-[20px] p-5 md:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-brand-light/10'}>
            <label className="text-[12px] tracking-[0.16em] text-brand-gold uppercase font-light mb-3 block">7. Venda ou Aluguel *</label>
            <div className="grid grid-cols-2 gap-3">
              {FINALIDADES.map((f) => (
                <button key={f} type="button" onClick={() => setFinalidade(f)} className={`h-[48px] rounded-full border text-[13px] font-medium tracking-wide transition active:scale-[0.98] ${finalidade === f ? 'bg-brand-gold text-brand-bg border-brand-gold shadow-[0_4px_16px_rgba(212,163,115,0.3)]' : 'bg-white/[0.03] text-brand-muted border-brand-light/10 hover:border-brand-gold/30 hover:text-brand-light'}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className={isLight ? 'bg-white border border-zinc-200 rounded-[20px] p-5 md:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.06)]' : 'bg-[#1d0a12]/60 backdrop-blur-xl rounded-[20px] p-5 md:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-brand-light/10'}>
            <label className="text-[12px] tracking-[0.16em] text-brand-gold uppercase font-light mb-2 block">8. Detalhes do imóvel</label>
            <p className="text-[12px] text-brand-muted/70 font-light mb-2">Use + e − para ajustar</p>
            <Stepper label="Área (m²)" value={area} onChange={setArea} min={0} />
            <Stepper label="Quartos" value={quartos} onChange={setQuartos} min={0} />
            <Stepper label="Banheiros" value={banheiros} onChange={setBanheiros} min={0} />
            <Stepper label="Vagas" value={vagas} onChange={setVagas} min={0} />
          </div>

          <div className={isLight ? 'bg-white border border-zinc-200 rounded-[20px] p-5 md:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.06)]' : 'bg-[#1d0a12]/60 backdrop-blur-xl rounded-[20px] p-5 md:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-brand-light/10'}>
            <label className="text-[12px] tracking-[0.16em] text-brand-gold uppercase font-light mb-1 block">8.1 Comodidades que aparecem no filtro *</label>
            <p className={`text-[12px] font-light mb-4 ${isLight ? 'text-zinc-500' : 'text-brand-muted/70'}`}>Marque o que o imóvel tem — cliente filtra por isso no site. Deixe ligado só se tiver.</p>
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3 py-3 border-b border-brand-light/5 last:border-0">
                <span className={`text-[14px] font-light tracking-wide ${isLight ? 'text-[#1d0a12]' : 'text-brand-light'}`}>🐾 Aceita PET</span>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setIsPetFriendly(true)} className={`h-9 px-5 rounded-full border text-[13px] font-medium transition active:scale-95 ${isPetFriendly ? 'bg-brand-gold text-brand-bg border-brand-gold shadow-[0_2px_10px_rgba(212,163,115,0.3)]' : isLight ? 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50' : 'bg-white/[0.03] border-brand-light/10 text-brand-muted hover:bg-white/[0.06] hover:text-brand-light'}`}>Sim</button>
                  <button type="button" onClick={() => setIsPetFriendly(false)} className={`h-9 px-5 rounded-full border text-[13px] font-medium transition active:scale-95 ${!isPetFriendly ? 'bg-zinc-800 text-white border-zinc-700' : isLight ? 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50' : 'bg-white/[0.03] border-brand-light/10 text-brand-muted hover:bg-white/[0.06] hover:text-brand-light'}`}>Não</button>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 py-3 border-b border-brand-light/5 last:border-0">
                <span className={`text-[14px] font-light tracking-wide ${isLight ? 'text-[#1d0a12]' : 'text-brand-light'}`}>🏊 Piscina / Lazer completo</span>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setHasSwimmingPool(true)} className={`h-9 px-5 rounded-full border text-[13px] font-medium transition active:scale-95 ${hasSwimmingPool ? 'bg-brand-gold text-brand-bg border-brand-gold shadow-[0_2px_10px_rgba(212,163,115,0.3)]' : isLight ? 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50' : 'bg-white/[0.03] border-brand-light/10 text-brand-muted hover:bg-white/[0.06] hover:text-brand-light'}`}>Sim</button>
                  <button type="button" onClick={() => setHasSwimmingPool(false)} className={`h-9 px-5 rounded-full border text-[13px] font-medium transition active:scale-95 ${!hasSwimmingPool ? 'bg-zinc-800 text-white border-zinc-700' : isLight ? 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50' : 'bg-white/[0.03] border-brand-light/10 text-brand-muted hover:bg-white/[0.06] hover:text-brand-light'}`}>Não</button>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 py-3 border-b border-brand-light/5 last:border-0">
                <span className={`text-[14px] font-light tracking-wide ${isLight ? 'text-[#1d0a12]' : 'text-brand-light'}`}>🌳 Quintal / Jardim</span>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setHasGarden(true)} className={`h-9 px-5 rounded-full border text-[13px] font-medium transition active:scale-95 ${hasGarden ? 'bg-brand-gold text-brand-bg border-brand-gold shadow-[0_2px_10px_rgba(212,163,115,0.3)]' : isLight ? 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50' : 'bg-white/[0.03] border-brand-light/10 text-brand-muted hover:bg-white/[0.06] hover:text-brand-light'}`}>Sim</button>
                  <button type="button" onClick={() => setHasGarden(false)} className={`h-9 px-5 rounded-full border text-[13px] font-medium transition active:scale-95 ${!hasGarden ? 'bg-zinc-800 text-white border-zinc-700' : isLight ? 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50' : 'bg-white/[0.03] border-brand-light/10 text-brand-muted hover:bg-white/[0.06] hover:text-brand-light'}`}>Não</button>
                </div>
              </div>
            </div>
            <p className={`text-[11px] font-light mt-3 ${isLight ? 'text-zinc-400' : 'text-brand-muted/60'}`}>Dica: Taboão casa com quintal e Butantã que aceita PET filtram muito. Deixe marcado que aparece no filtro do site.</p>
          </div>

          <div className={isLight ? 'bg-white border border-zinc-200 rounded-[20px] p-5 md:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.06)]' : 'bg-[#1d0a12]/60 backdrop-blur-xl rounded-[20px] p-5 md:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-brand-light/10'}>
            <div className="flex items-center justify-between gap-3 mb-3">
              <label className="flex items-center gap-2 text-[12px] tracking-[0.16em] text-brand-gold uppercase font-light"><FileText size={14} /> 9. Descrição <span className={`font-light normal-case tracking-normal text-[11px] ${isLight ? 'text-zinc-500' : 'text-brand-muted'}`}> (opcional)</span></label>
              <div className="flex items-center gap-2 shrink-0">
                <button type="button" onClick={() => setDescricaoExpandida((v) => !v)} className={isLight ? 'inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-white border border-zinc-200 text-zinc-700 text-[12px] font-medium hover:bg-zinc-50 transition active:scale-95' : 'inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-white/[0.04] border border-brand-light/10 text-brand-light text-[12px] font-medium hover:bg-white/[0.08] hover:border-brand-gold/30 hover:text-brand-gold transition active:scale-95'} title={descricaoExpandida ? 'Recolher' : 'Expandir para tela cheia'}>
                  {descricaoExpandida ? <Minimize2 size={12} aria-hidden="true" /> : <Maximize2 size={12} aria-hidden="true" />}
                  {descricaoExpandida ? 'Recolher' : 'Expandir'}
                </button>
                <button type="button" onClick={handleGerarDescricao} disabled={gerandoDescricao} className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-[12px] font-medium hover:bg-brand-gold hover:text-brand-bg hover:border-brand-gold disabled:opacity-50 disabled:cursor-not-allowed transition active:scale-95">
                  {gerandoDescricao ? <span className="w-3.5 h-3.5 border-2 border-brand-gold/30 border-t-brand-gold rounded-full animate-spin" aria-hidden="true" /> : <Sparkles size={12} aria-hidden="true" />}
                  {gerandoDescricao ? 'Gerando...' : '✨ Gerar com IA'}
                </button>
              </div>
            </div>
            <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Conte um pouco sobre o imóvel (opcional) — ou clique em Gerar com IA" rows={14} className={isLight ? 'w-full min-h-[420px] p-4 rounded-[12px] border text-[14px] leading-relaxed focus:outline-none focus:border-brand-gold transition resize-y overflow-y-auto whitespace-pre-wrap bg-white border-zinc-200 text-[#1d0a12] placeholder:text-zinc-400' : 'w-full min-h-[420px] p-4 rounded-[12px] border text-[14px] leading-relaxed focus:outline-none focus:border-brand-gold transition resize-y overflow-y-auto whitespace-pre-wrap bg-brand-bg/60 border-brand-light/10 text-brand-light placeholder:text-brand-muted/40'} />
            <p className={isLight ? 'text-[11px] font-light mt-2 leading-relaxed text-zinc-500' : 'text-[11px] font-light mt-2 leading-relaxed text-brand-muted/60'}>IA exclusiva para descrições — usa título, tipo, região, área e quartos. Só gera descrição, nada mais. Você revisa antes de salvar. Dica: clique em Expandir para ver o texto grande sem rolar.</p>
          </div>

          {/* Modal expandido - tela cheia para editar com conforto */}
          <AnimatePresence>
            {descricaoExpandida && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[80] flex flex-col p-4 md:p-6" aria-modal="true" role="dialog" aria-label="Editar descrição em tela cheia">
                <div className={isLight ? 'absolute inset-0 bg-white/80 backdrop-blur-[12px]' : 'absolute inset-0 bg-[#0a0206]/80 backdrop-blur-[12px]'} onClick={() => setDescricaoExpandida(false)} aria-hidden="true" />
                <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 16, opacity: 0 }} transition={{ type: 'spring', damping: 28, stiffness: 320 }} className={isLight ? 'relative flex-1 flex flex-col bg-white rounded-[20px] border border-zinc-200 shadow-[0_24px_64px_rgba(0,0,0,0.12)] overflow-hidden max-w-[900px] w-full mx-auto' : 'relative flex-1 flex flex-col bg-[#1d0a12] rounded-[20px] border border-brand-light/10 shadow-[0_24px_64px_rgba(0,0,0,0.6)] overflow-hidden max-w-[900px] w-full mx-auto'}>
                  <div className={isLight ? 'flex items-center justify-between px-5 md:px-6 py-4 border-b border-zinc-200 shrink-0' : 'flex items-center justify-between px-5 md:px-6 py-4 border-b border-brand-light/10 shrink-0'}>
                    <span className="flex items-center gap-2 text-[12px] tracking-[0.16em] text-brand-gold uppercase font-light"><FileText size={14} /> Descrição — edição em tela cheia</span>
                    <button type="button" onClick={() => setDescricaoExpandida(false)} className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-brand-gold text-brand-bg text-[12px] font-medium hover:bg-[#e0b48a] transition active:scale-95">
                      <Minimize2 size={12} aria-hidden="true" /> Fechar e voltar
                    </button>
                  </div>
                  <div className="flex-1 p-4 md:p-6 flex flex-col min-h-0">
                    <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Escreva ou gere com IA..." autoFocus className={isLight ? 'flex-1 w-full p-4 rounded-[12px] border text-[15px] leading-relaxed focus:outline-none focus:border-brand-gold transition resize-none overflow-y-auto whitespace-pre-wrap min-h-[400px] bg-white border-zinc-200 text-[#1d0a12] placeholder:text-zinc-400' : 'flex-1 w-full p-4 rounded-[12px] border text-[15px] leading-relaxed focus:outline-none focus:border-brand-gold transition resize-none overflow-y-auto whitespace-pre-wrap min-h-[400px] bg-brand-bg/60 border-brand-light/10 text-brand-light placeholder:text-brand-muted/40'} />
                    <p className="text-[11px] text-brand-muted/60 font-light mt-3">Fica à vontade para rolar - aqui você vê o texto inteiro sem espremer. Ao fechar, o conteúdo já fica salvo no formulário.</p>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="h-4" />
        </div>

        <div className={isLight ? 'fixed bottom-0 left-0 right-0 border-t p-4 bg-white/95 backdrop-blur border-zinc-200' : 'fixed bottom-0 left-0 right-0 border-t p-4 bg-brand-bg border-brand-light/10'}>
          <div className="max-w-[720px] mx-auto">
            <button onClick={handleSalvar} disabled={salvando} className="w-full h-[52px] rounded-full bg-brand-gold hover:bg-[#e0b48a] disabled:bg-brand-muted/50 disabled:cursor-not-allowed text-brand-bg text-[14px] font-semibold tracking-[0.16em] uppercase shadow-[0_8px_24px_rgba(212,163,115,0.25)] active:scale-[0.98] transition flex items-center justify-center gap-2">
              {salvando ? <><span className="w-4 h-4 border-2 border-brand-bg/30 border-t-brand-bg rounded-full animate-spin" /> Salvando...</> : <><Check size={16} /> Salvar Imóvel</>}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={isLight ? 'min-h-screen bg-[#FDF8F5] text-[#1d0a12]' : 'min-h-screen bg-brand-bg text-brand-light'}>
      <SEO title="Admin — Imóveis" description="Painel administrativo" canonical="https://silviahelenacorretora.com.br/admin" noindex={true} />
      <div className={isLight ? 'sticky top-0 z-30 border-b bg-white/95 backdrop-blur border-zinc-200' : 'sticky top-0 z-30 border-b bg-brand-bg border-brand-light/10'}>
        <div className="h-[1px] bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent" aria-hidden="true" />
        <div className="max-w-[960px] mx-auto px-4 h-[64px] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center text-brand-gold font-serif text-sm shadow-[0_0_12px_rgba(212,163,115,0.15)] shrink-0">SH</div>
            <div className="min-w-0">
              <h1 className={isLight ? 'font-serif text-[18px] font-light tracking-wide truncate text-[#1d0a12]' : 'font-serif text-[18px] font-light tracking-wide truncate text-brand-light'}>Meus Imóveis</h1>
              <p className={isLight ? 'text-[11px] tracking-[0.14em] uppercase font-light truncate text-zinc-500' : 'text-[11px] tracking-[0.14em] uppercase font-light truncate text-brand-muted'}>Silvia Helena • {imoveis.length} imóveis • CRECISP 125743</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button type="button" onClick={toggleTheme} className={isLight ? 'w-9 h-9 rounded-full border flex items-center justify-center transition bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50 shadow-sm' : 'w-9 h-9 rounded-full border flex items-center justify-center transition bg-white/[0.06] border-white/10 text-brand-light hover:bg-white/10'} aria-label={isLight ? 'Mudar para tema escuro' : 'Mudar para tema claro'}>
              {isLight ? <Moon size={15} /> : <Sun size={15} />}
            </button>
            <button onClick={handleSair} className={isLight ? 'text-[12px] tracking-[0.12em] uppercase font-light border rounded-full px-4 py-2 transition flex items-center gap-1.5 text-zinc-600 border-zinc-200 hover:bg-zinc-50 hover:text-[#1d0a12]' : 'text-[12px] tracking-[0.12em] uppercase font-light border rounded-full px-4 py-2 transition flex items-center gap-1.5 text-brand-muted border-brand-light/10 hover:bg-white/[0.04] hover:border-brand-light/20 hover:text-brand-light'}>
              <LogOut size={12} /> Sair
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[960px] mx-auto px-4 py-6">
        {toast && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className={`rounded-[12px] px-5 py-4 mb-6 text-[13px] font-light leading-relaxed border backdrop-blur flex items-center gap-2 ${toast.tipo === 'sucesso' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200' : 'bg-red-500/10 border-red-500/20 text-red-200'}`}>
            {toast.tipo === 'sucesso' ? <Check size={16} className="text-emerald-400 shrink-0" /> : <AlertTriangle size={16} className="text-red-400 shrink-0" />} {toast.msg}
          </motion.div>
        )}

        <motion.button initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} onClick={abrirNovo} className="w-full h-[56px] rounded-full bg-brand-gold hover:bg-[#e0b48a] text-brand-bg text-[14px] font-semibold tracking-[0.14em] uppercase shadow-[0_8px_24px_rgba(212,163,115,0.25)] hover:shadow-[0_10px_28px_rgba(212,163,115,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2">
          <Plus size={18} /> Adicionar Imóvel Novo
        </motion.button>

        <div className="mt-6 relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" aria-hidden="true" />
          <input type="text" value={filtroBusca} onChange={(e) => setFiltroBusca(e.target.value)} placeholder="Buscar por título, região..." className="w-full h-[48px] pl-10 pr-4 rounded-full border border-brand-light/10 bg-[#1d0a12]/60 backdrop-blur text-[14px] text-brand-light placeholder:text-brand-muted/40 focus:outline-none focus:border-brand-gold/40 focus:bg-[#1d0a12] transition" />
        </div>

        <div className="mt-6">
          {loadingLista ? (
            <div className="text-center py-16">
              <div className="w-8 h-8 border-2 border-brand-gold/20 border-t-brand-gold rounded-full animate-spin mx-auto mb-3" />
              <p className="text-[13px] tracking-wide text-brand-muted font-light">Carregando seus imóveis...</p>
            </div>
          ) : imoveisFiltrados.length === 0 ? (
            <div className="bg-[#1d0a12]/50 backdrop-blur border border-brand-light/10 rounded-[20px] p-10 text-center">
              <div className="w-12 h-12 rounded-full bg-brand-gold/10 border border-brand-gold/15 flex items-center justify-center mx-auto mb-3">
                <Home size={20} className="text-brand-gold" />
              </div>
              <h3 className="text-[16px] font-light text-brand-light tracking-wide">Nenhum imóvel encontrado</h3>
              <p className="text-[13px] text-brand-muted font-light mt-2">Toque em “Adicionar Imóvel Novo” para começar</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {imoveisFiltrados.map((im, idx) => {
                const thumb = im.fotos?.[0] ? (() => { try { return urlFor(im.fotos[0]).width(400).height(300).fit('crop').auto('format').url(); } catch { return ''; } })() : '';
                const pausado = im.publicado === false;
                return (
                  <motion.div
                    key={im._id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04, duration: 0.4, ease: [0.16, 1, 0.3, 1] as any }}
                    className={`bg-[#1d0a12]/70 backdrop-blur-xl rounded-[20px] overflow-hidden border shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] hover:border-brand-gold/20 flex flex-col transition-all duration-300 ${pausado ? 'border-amber-500/20 opacity-90' : 'border-brand-light/10'}`}>
                    {pausado && <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-300 text-[11px] font-light tracking-[0.14em] uppercase text-center py-2">⏸️ Pausado — não aparece no site</div>}
                    <div className="aspect-[16/10] bg-[#1a080f] relative overflow-hidden">
                      {thumb ? <img src={thumb} alt={im.titulo} className="w-full h-full object-cover" loading="lazy" /> : <div className="w-full h-full flex items-center justify-center text-brand-muted font-light">Sem foto</div>}
                      <div className="absolute bottom-2 left-2 bg-brand-bg/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-light tracking-wide text-brand-light border border-brand-light/10">
                        {im.tipo} • {im.regiao}
                      </div>
                      {pausado && <div className="absolute inset-0 bg-brand-bg/40 pointer-events-none" aria-hidden="true" />}
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="text-[15px] font-light text-brand-light leading-tight line-clamp-2 tracking-wide">{im.titulo}</h3>
                      <p className="text-[12px] text-brand-muted font-light mt-1 line-clamp-1 flex items-center gap-1"><MapPin size={10} className="text-brand-gold/60" /> {im.endereco}</p>
                      <p className="text-[17px] font-light text-brand-gold mt-2 tracking-wide">{formatarBRL(im.valor)} <span className="text-[11px] font-light text-brand-muted">• {im.finalidade}</span></p>

                      <div className="flex gap-2 mt-4">
                        <button onClick={() => abrirEditar(im)} className="flex-1 h-[42px] rounded-full border border-brand-light/15 bg-white/[0.03] text-brand-light text-[13px] font-light tracking-wide hover:bg-brand-light hover:text-brand-bg hover:border-brand-light transition active:scale-[0.98] flex items-center justify-center gap-1.5">
                          Editar
                        </button>
                        <button onClick={() => handleTogglePublicado(im)} className={`flex-1 h-[42px] rounded-full text-[13px] font-medium tracking-wide transition active:scale-[0.98] flex items-center justify-center gap-1.5 ${pausado ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-white' : 'bg-amber-500/10 border border-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-white'}`}>
                          {pausado ? 'Ativar' : 'Pausar'}
                        </button>
                      </div>
                      <button onClick={() => setImovelParaRemover(im)} className="w-full mt-2.5 h-[40px] rounded-full border border-red-500/15 bg-red-500/5 text-red-300 text-[13px] font-light tracking-wide hover:bg-red-500 hover:text-white hover:border-red-500 flex items-center justify-center gap-1.5 transition active:scale-[0.98] group">
                        <Trash2 size={14} className="group-hover:scale-110 transition-transform" /> Remover imóvel
                      </button>
                      <a href={getImovelUrl(im)} target="_blank" rel="noopener noreferrer" className="w-full mt-2.5 h-[42px] rounded-full border border-brand-gold/20 bg-brand-gold/5 text-brand-gold text-[13px] font-light tracking-[0.14em] uppercase hover:bg-brand-gold hover:text-brand-bg hover:border-brand-gold flex items-center justify-center gap-1.5 transition active:scale-[0.98] group">
                        <Eye size={14} className="group-hover:scale-110 transition-transform" /> Ver no site <ExternalLink size={11} className="opacity-60 group-hover:opacity-100" aria-hidden="true" />
                      </a>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        <div className="text-center mt-10 pb-6">
          <a href="/" className="text-[12px] tracking-[0.14em] uppercase font-light text-brand-muted hover:text-brand-light underline underline-offset-4 decoration-brand-gold/20 hover:decoration-brand-gold/40 transition-colors">
            ← Voltar para o site
          </a>
        </div>
      </div>

      <AnimatePresence>
        {imovelParaRemover && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[90] flex items-center justify-center p-4" aria-modal="true" role="dialog">
            <div className="absolute inset-0 bg-[#0a0206]/75 backdrop-blur-[10px]" onClick={() => !removendo && setImovelParaRemover(null)} aria-hidden="true" />
            <motion.div initial={{ scale: 0.96, y: 12, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.96, y: 12, opacity: 0 }} transition={{ type: 'spring', damping: 26, stiffness: 320 }} className="relative w-full max-w-[480px] bg-[#1d0a12] rounded-[20px] shadow-[0_24px_64px_rgba(0,0,0,0.5)] overflow-hidden border border-brand-light/10">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent" aria-hidden="true" />
              <div className="p-6 md:p-7">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                    <AlertTriangle size={18} className="text-red-400" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[16px] font-light tracking-wide text-brand-light">Remover imóvel?</h3>
                    <p className="text-[13px] text-brand-muted font-light leading-relaxed mt-1">
                      Tem certeza que deseja remover <span className="font-medium text-brand-light">"{imovelParaRemover.titulo}"</span> em {imovelParaRemover.regiao}? Essa ação não pode ser desfeita.
                    </p>
                  </div>
                  <button onClick={() => !removendo && setImovelParaRemover(null)} className="w-8 h-8 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 flex items-center justify-center transition shrink-0" aria-label="Fechar">
                    <X size={14} className="text-brand-muted" />
                  </button>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setImovelParaRemover(null)} disabled={removendo} className="flex-1 h-[44px] rounded-full border border-brand-light/10 bg-white/[0.03] text-brand-light text-[13px] font-light tracking-wide hover:bg-white/[0.06] disabled:opacity-50 transition">
                    Cancelar
                  </button>
                  <button onClick={handleRemover} disabled={removendo} className="flex-1 h-[44px] rounded-full bg-red-600 hover:bg-red-700 disabled:bg-red-500/50 text-white text-[13px] font-medium flex items-center justify-center gap-2 transition active:scale-[0.98]">
                    {removendo ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" /> : <Trash2 size={14} aria-hidden="true" />} {removendo ? 'Removendo...' : 'Sim, remover'}
                  </button>
                </div>
                <p className="text-[11px] text-brand-muted/50 font-light text-center mt-3">Apagado permanentemente do Sanity.</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

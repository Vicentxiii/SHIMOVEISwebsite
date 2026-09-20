import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, AlertTriangle, X, ExternalLink, Eye } from 'lucide-react';
import { SEO } from '../components/SEO';
import { sanityClient, urlFor, SanityImovel, sanityAdminClient, hasAdminToken } from '../lib/sanity';
import { getRegionSlug } from '../utils/slugify';

// Senha via env (VITE_ADMIN_PASSWORD). Fallback "silvia2026" garante que /admin funciona mesmo se Vercel env não foi setada ainda.
// Para trocar a senha, defina VITE_ADMIN_PASSWORD na Vercel → Settings → Environment Variables e faça Redeploy.
const ADMIN_PASSWORD = ((import.meta as any).env?.VITE_ADMIN_PASSWORD as string | undefined) || 'silvia2026';
const LS_KEY = 'sh_admin_auth';
// Sessão persiste 30 dias no LocalStorage — aumentado para evitar falso positivo por timeout/demora no upload (ex: imagens 8MB)
// Antes 7 dias causava "Session not found" se usuário deixasse aba aberta e clicasse em Salvar com upload lento
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

function saveSession() {
  localStorage.setItem(LS_KEY, JSON.stringify({ authenticated: true, ts: Date.now() }));
}

function isSessionValid(): boolean {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return false;
    // Compatibilidade com versão antiga que salvava "true"
    if (raw === 'true') {
      // migra para novo formato com timestamp — sem apagar em caso de demora no upload
      saveSession();
      return true;
    }
    const data = JSON.parse(raw);
    if (!data?.authenticated) return false;
    if (!data?.ts) return false;
    // Verificação pura: NÃO remove LocalStorage aqui — remoção apenas via handleSessionExpired() em erro real de auth
    // Isso evita que upload demorado (ex: 3 fotos 8MB) limpe a sessão por falso positivo de timeout
    if (Date.now() - data.ts > SESSION_TTL_MS) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

// Leitura pura sem efeito colateral — usada ANTES do upload para capturar snapshot da sessão
function readSessionSnapshot(): string | null {
  try {
    return localStorage.getItem(LS_KEY);
  } catch {
    return null;
  }
}

function getSessionHeader(): Record<string, string> {
  // Repassa sessão para o cabeçalho de autorização (Bearer Token / x-admin-auth) nas requisições de upload e mutação
  try {
    const raw = readSessionSnapshot();
    if (!raw) return {};
    // Para o servidor, enviamos o password via header para validação opcional + sinal de token se houver
    const token = hasAdminToken() ? 'sanity-token-present' : '';
    return {
      'x-admin-auth': raw,
      ...(token ? { 'x-sanity-token': 'present' } : {}),
      Authorization: `Bearer ${ADMIN_PASSWORD}`,
    };
  } catch {
    return {};
  }
}

function getSessionHeaderFromSnapshot(snapshot: string | null): Record<string, string> {
  if (!snapshot) return {};
  const token = hasAdminToken() ? 'sanity-token-present' : '';
  return {
    'x-admin-auth': snapshot,
    ...(token ? { 'x-sanity-token': 'present' } : {}),
    Authorization: `Bearer ${ADMIN_PASSWORD}`,
  };
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

type FotoItem = {
  id: string;
  preview: string; // objectURL ou url sanity
  file?: File;
  assetRef?: string; // sanity asset _ref ex: image-abc-...
  isNew: boolean;
};

function formatarBRL(valor: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(valor);
}

function getImovelUrl(im: SanityImovel): string {
  const slug = (typeof im.slug === 'string' ? im.slug : (im.slug as any)?.current || '').trim();
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

// Stepper +/-
const Stepper: React.FC<{ label: string; value: number; onChange: (v: number) => void; min?: number }> = ({ label, value, onChange, min = 0 }) => {
  return (
    <div className="flex items-center justify-between py-3 border-b border-black/5 last:border-0">
      <span className="text-[16px] font-medium text-[#17060D]">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-[48px] h-[48px] rounded-full border-2 border-[#D4A373] text-[#D4A373] text-[22px] font-bold flex items-center justify-center active:scale-95 transition hover:bg-[#D4A373]/10"
          aria-label={`Diminuir ${label}`}
        >
          −
        </button>
        <span className="w-[56px] text-center text-[20px] font-bold text-[#17060D]">{value}</span>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="w-[48px] h-[48px] rounded-full bg-[#D4A373] text-white text-[22px] font-bold flex items-center justify-center active:scale-95 transition hover:bg-[#c49660]"
          aria-label={`Aumentar ${label}`}
        >
          +
        </button>
      </div>
    </div>
  );
};

export const AdminPage: React.FC = () => {
  // Auth
  const [autenticado, setAutenticado] = useState(false);
  const [senhaInput, setSenhaInput] = useState('');
  const [erroSenha, setErroSenha] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Lista
  const [imoveis, setImoveis] = useState<SanityImovel[]>([]);
  const [loadingLista, setLoadingLista] = useState(false);
  const [filtroBusca, setFiltroBusca] = useState('');

  // Form
  const [modoForm, setModoForm] = useState<null | 'novo' | 'editar'>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [imovelParaRemover, setImovelParaRemover] = useState<SanityImovel | null>(null);
  const [removendo, setRemovendo] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ tipo: 'sucesso' | 'erro'; msg: string } | null>(null);

  // Form fields
  const [fotos, setFotos] = useState<FotoItem[]>([]);
  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState<string>('');
  const [regiao, setRegiao] = useState<string>('');
  const [endereco, setEndereco] = useState('');
  const [valor, setValor] = useState(''); // string para controlar
  const [finalidade, setFinalidade] = useState<string>('Venda');
  const [area, setArea] = useState(70);
  const [quartos, setQuartos] = useState(2);
  const [banheiros, setBanheiros] = useState(1);
  const [vagas, setVagas] = useState(1);
  const [descricao, setDescricao] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Checa localStorage no mount — persiste sessão com TTL 30d e evita "Session not found" intermitente
  useEffect(() => {
    const raw = readSessionSnapshot();
    if (isSessionValid()) {
      setAutenticado(true);
      setErroSenha('');
    } else {
      // Sessão expirada ou inválida: limpa apenas aqui (não durante upload) e mostra aviso limpo
      if (raw) {
        try {
          const data = raw === 'true' ? null : JSON.parse(raw);
          const expired = data?.ts ? Date.now() - data.ts > SESSION_TTL_MS : true;
          if (expired) {
            localStorage.removeItem(LS_KEY);
            setErroSenha('Sua sessão expirou. Por favor, faça login novamente.');
          }
        } catch {
          localStorage.removeItem(LS_KEY);
        }
      }
    }
    setCheckingAuth(false);
  }, []);

  // Busca imóveis quando autenticado e não está em form — com sessão persistida e fallback limpo
  const carregarImoveis = async () => {
    setLoadingLista(true);
    // Guarda para detectar expiração e redirecionar para login com aviso
    const handleListError = (e: any) => {
      const msg = e?.message || String(e);
      const isAuthError =
        msg.toLowerCase().includes('session') ||
        msg.toLowerCase().includes('unauthorized') ||
        msg.toLowerCase().includes('não autorizado') ||
        msg.toLowerCase().includes('401') ||
        msg.includes('SANITY_WRITE_TOKEN');
      if (isAuthError) {
        handleSessionExpired('Sessão não encontrada ou expirada. Por favor, faça login novamente para listar os imóveis.');
        setToast({ tipo: 'erro', msg: '🔒 Sessão expirada. Faça login novamente.' });
        return true;
      }
      return false;
    };

    try {
      const headers = { ...getSessionHeader() } as Record<string, string>;
      const r = await fetch('/api/listar-imoveis', { headers });
      if (r.ok) {
        const j = await r.json();
        if (Array.isArray(j.imoveis)) {
          setImoveis(j.imoveis);
          setLoadingLista(false);
          return;
        }
      } else {
        let errText = '';
        try {
          const errJ = await r.clone().json();
          errText = errJ?.error || errJ?.details || '';
        } catch {
          errText = await r.text().catch(() => '');
        }
        // Se for 404 por rewrites antigo, não mostra toast genérico — deixa cair no fallback silencioso
        if (r.status === 404 && (!errText || errText.trim().startsWith('<!doctype'))) {
          throw new Error('fallback');
        }
        if (errText) throw new Error(errText);
        throw new Error(`HTTP ${r.status}`);
      }
      throw new Error('fallback');
    } catch (e: any) {
      if (handleListError(e)) {
        setLoadingLista(false);
        return;
      }
      // Fallback silencioso: tenta clientes com token se disponível, sem toast a cada entrada
      try {
        // Tenta com token se houver (dataset pode ser privado para leitura pública)
        const fallbackClient = hasAdminToken() && sanityAdminClient ? sanityAdminClient : sanityClient;
        const q = `*[_type == "imovel"] | order(_createdAt desc){ _id, _createdAt, titulo, slug, tipo, regiao, endereco, valor, finalidade, area, quartos, banheiros, vagas, descricao, fotos, publicado }`;
        const dados = await (fallbackClient as any).fetch<SanityImovel[]>(q);
        setImoveis(dados || []);
        if (!dados || dados.length === 0) {
          console.warn('[carregarImoveis] fallback retornou vazio — pode ser dataset privado ou sem imóveis');
        }
      } catch (e2: any) {
        console.warn('[carregarImoveis] fallback falhou (silencioso)', e2);
        const msg2 = String(e2?.message || '').toLowerCase();
        if (msg2.includes('session') || msg2.includes('unauthorized') || msg2.includes('401') || msg2.includes('permission')) {
          handleSessionExpired();
          return;
        }
        // Não mostra mais o toast "Ops, algo deu errado" a cada entrada — mantém lista vazia e UI mostra "Nenhum imóvel encontrado" com retry
        setImoveis([]);
      }
    } finally {
      setLoadingLista(false);
    }
  };

  useEffect(() => {
    if (autenticado) carregarImoveis();
  }, [autenticado]);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), toast.tipo === 'sucesso' ? 3500 : 5000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const handleSessionExpired = (msg = 'Sua sessão expirou ou não foi encontrada. Por favor, faça login novamente.') => {
    localStorage.removeItem(LS_KEY);
    setAutenticado(false);
    setSenhaInput('');
    setErroSenha(msg);
    // Fallback de interface: redireciona para /admin/login com aviso limpo (evita tela vazia com "Session not found")
    // Mantém compatibilidade: /admin também exibe login, mas /admin/login é a rota canônica pedida na task
    if (window.location.pathname !== '/admin' && window.location.pathname !== '/admin/login') {
      window.location.href = '/admin/login';
    }
    window.scrollTo(0, 0);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (senhaInput === ADMIN_PASSWORD) {
      saveSession();
      setAutenticado(true);
      setErroSenha('');
    } else {
      setErroSenha('Senha incorreta. Tenta de novo.');
    }
  };

  const handleSair = () => {
    localStorage.removeItem(LS_KEY);
    setAutenticado(false);
    setSenhaInput('');
    setErroSenha('');
  };

  const limparForm = () => {
    setFotos([]);
    setTitulo('');
    setTipo('');
    setRegiao('');
    setEndereco('');
    setValor('');
    setFinalidade('Venda');
    setArea(70);
    setQuartos(2);
    setBanheiros(1);
    setVagas(1);
    setDescricao('');
    setEditId(null);
  };

  const abrirNovo = () => {
    limparForm();
    setModoForm('novo');
    window.scrollTo(0, 0);
  };

  const abrirEditar = (im: SanityImovel) => {
    setEditId(im._id);
    setTitulo(im.titulo || '');
    setTipo(im.tipo || '');
    setRegiao(im.regiao || '');
    setEndereco(im.endereco || '');
    setValor(String(im.valor || ''));
    setFinalidade(im.finalidade || 'Venda');
    setArea(Number(im.area) || 0);
    setQuartos(Number(im.quartos) || 0);
    setBanheiros(Number(im.banheiros) || 0);
    setVagas(Number(im.vagas) || 0);
    // descricao portable text -> texto simples
    if (Array.isArray(im.descricao)) {
      const txt = im.descricao.map((b: any) => (b.children ? b.children.map((c: any) => c.text).join('') : '')).join('\n\n');
      setDescricao(txt);
    } else if (typeof im.descricao === 'string') setDescricao(im.descricao as any);
    else setDescricao('');

    const fotosExistentes: FotoItem[] = (im.fotos || []).map((f: any, idx: number) => {
      let preview = '';
      try {
        preview = urlFor(f).width(600).auto('format').url();
      } catch {
        preview = '';
      }
      const ref = f?.asset?._ref || f?.asset?._id || '';
      return {
        id: `exist-${idx}-${ref.slice(0, 8)}`,
        preview,
        assetRef: ref,
        isNew: false,
      };
    });
    setFotos(fotosExistentes);
    setModoForm('editar');
    window.scrollTo(0, 0);
  };

  const handleFotosSelecionadas = (files: FileList | null) => {
    if (!files) return;
    const novos: FotoItem[] = Array.from(files).map((file) => ({
      id: `new-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      preview: URL.createObjectURL(file),
      file,
      isNew: true,
    }));
    setFotos((prev) => [...prev, ...novos]);
  };

  const removerFoto = (id: string) => {
    setFotos((prev) => {
      const item = prev.find((p) => p.id === id);
      if (item?.isNew && item.preview.startsWith('blob:')) URL.revokeObjectURL(item.preview);
      return prev.filter((p) => p.id !== id);
    });
  };

  // Helper para extrair JSON mesmo quando servidor retorna HTML (caso /api não exista em `npm run dev`) — repassa Bearer Token da sessão com timeout estendido
  const fetchJson = async (url: string, opts: RequestInit, timeoutMs = 45000) => {
    // Injeta cabeçalho de autorização da sessão persistida no LocalStorage (corrige "Session not found" por falta de Bearer)
    // Usa AbortController para evitar falso positivo de timeout curto (imagens 8MB no Vercel podem levar 20-40s)
    const sessionHeaders = getSessionHeader();
    const mergedHeaders = { ...(opts.headers as Record<string, string> | undefined), ...sessionHeaders } as Record<string, string>;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    let r: Response;
    try {
      r = await fetch(url, { ...opts, headers: mergedHeaders, signal: controller.signal });
    } catch (e: any) {
      clearTimeout(timeoutId);
      // Timeout real por demora nas imagens — NÃO deve limpar LocalStorage nem deslogar (falso positivo)
      if (e?.name === 'AbortError') {
        throw new Error(`Timeout na API (${timeoutMs / 1000}s). A imagem pode ser muito grande ou a conexão está lenta. Tente novamente com fotos menores ou aguarde.`);
      }
      throw e;
    }
    clearTimeout(timeoutId);
    const text = await r.text();
    let j: any = null;
    try {
      j = text ? JSON.parse(text) : null;
    } catch {
      // Se não for JSON (ex: index.html do SPA quando /api não está rodando), mostra diagnóstico
      const isHtml = text.trim().startsWith('<!doctype') || text.trim().startsWith('<html');
      if (isHtml) {
        throw new Error(
          `API não encontrada (recebeu HTML). Você está em "npm run dev" sem serverless. ` +
          `Para testar local use "vercel dev" ou faça deploy na Vercel. ` +
          `Se já está na Vercel, verifique se SANITY_API_WRITE_TOKEN (ou SANITY_WRITE_TOKEN) está configurado em Settings → Environment Variables.`
        );
      }
      throw new Error(text.slice(0, 300) || `Erro ${r.status}`);
    }
    if (!r.ok) {
      // Detecta 401/Session not found para fallback de interface (redireciona para login com aviso limpo)
      const rawMsg = j?.error || j?.details || '';
      const isSessionError =
        r.status === 401 ||
        r.status === 403 ||
        /session not found/i.test(rawMsg) ||
        /unauthorized/i.test(rawMsg) ||
        /não autorizado/i.test(rawMsg) ||
        /não configurado/i.test(rawMsg) ||
        /SANITY_WRITE_TOKEN/i.test(rawMsg) ||
        /SANITY_API_WRITE_TOKEN/i.test(rawMsg);
      if (isSessionError) {
        // Não lança toast aqui ainda — deixa o chamador decidir, mas marca para o handle detectar
        const msg = j?.error || j?.details || `Sessão não encontrada (HTTP ${r.status})`;
        const details = j?.details ? ` (${j.details})` : '';
        throw new Error(msg + details);
      }
      // Prioriza mensagem do servidor + details para debug
      const msg = j?.error || j?.details || `Erro ${r.status}`;
      const details = j?.details ? ` (${j.details})` : '';
      throw new Error(msg + details);
    }
    return j;
  };

  const handleTogglePublicado = async (im: SanityImovel) => {
    try {
      if (!isSessionValid()) {
        handleSessionExpired();
        return;
      }
      const j = await fetchJson('/api/toggle-imovel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: im._id }),
      });
      setImoveis((prev) => prev.map((p) => (p._id === im._id ? { ...p, publicado: j.publicado } : p)));
      setToast({ tipo: 'sucesso', msg: j.publicado ? '✅ Imóvel ativado! Já está no site.' : '⏸️ Imóvel pausado. Não aparece mais no site.' });
    } catch (e: any) {
      console.error('[toggle] erro', e);
      const msg = e?.message || '';
      const isAuth = /session not found|unauthorized|não autorizado|não configurado|SANITY_WRITE_TOKEN|SANITY_API_WRITE_TOKEN|401|403/i.test(msg);
      if (isAuth) {
        handleSessionExpired('Sessão expirada. Faça login novamente para alterar o imóvel.');
        setToast({ tipo: 'erro', msg: '🔒 Sessão expirada. Faça login novamente.' });
        return;
      }
      setToast({ tipo: 'erro', msg: e?.message || 'Ops, algo deu errado. Tenta de novo ou me chama no WhatsApp' });
    }
  };

  const handleRemover = async () => {
    if (!imovelParaRemover) return;
    if (!isSessionValid()) {
      handleSessionExpired('Sessão expirada. Faça login novamente para remover.');
      return;
    }
    setRemovendo(true);
    try {
      await fetchJson('/api/deletar-imovel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: imovelParaRemover._id }),
      });
      setImoveis((prev) => prev.filter((p) => p._id !== imovelParaRemover._id));
      setToast({ tipo: 'sucesso', msg: `🗑️ "${imovelParaRemover.titulo}" removido com sucesso.` });
      setImovelParaRemover(null);
    } catch (e: any) {
      console.error('[remover] erro', e);
      const msg = e?.message || '';
      const isAuth = /session not found|unauthorized|não autorizado|não configurado|SANITY_WRITE_TOKEN|SANITY_API_WRITE_TOKEN|401|403/i.test(msg);
      if (isAuth) {
        handleSessionExpired('Sessão expirada. Faça login novamente para remover.');
        setToast({ tipo: 'erro', msg: '🔒 Sessão expirada. Faça login novamente.' });
        return;
      }
      setToast({ tipo: 'erro', msg: e?.message || 'Ops, não deu para remover. Tenta de novo.' });
    } finally {
      setRemovendo(false);
    }
  };

  const handleSalvar = async () => {
    // validações simples
    if (!titulo.trim()) return setToast({ tipo: 'erro', msg: 'Escreve o título do anúncio' });
    if (!tipo) return setToast({ tipo: 'erro', msg: 'Escolhe o tipo de imóvel' });
    if (!regiao) return setToast({ tipo: 'erro', msg: 'Escolhe a região' });
    if (!valor || isNaN(Number(valor.replace(/\D/g, '')))) return setToast({ tipo: 'erro', msg: 'Coloca o valor do imóvel' });
    if (fotos.length === 0) return setToast({ tipo: 'erro', msg: 'Adiciona pelo menos 1 foto' });
    if (!endereco.trim()) return setToast({ tipo: 'erro', msg: 'Coloca o endereço' });

    // 1) PERSISTÊNCIA DA SESSÃO DURANTE O UPLOAD — lê ANTES e TRAVA como 'true' durante todo o processo
    // Não depende de resposta assíncrona do Sanity; verificação simples que não reseta se requisição demorar
    const sessionSnapshot = readSessionSnapshot();
    const hasSessionSimple = !!sessionSnapshot; // verificação simples: existência no LocalStorage, sem TTL agressivo durante o envio
    if (!hasSessionSimple) {
      handleSessionExpired('Sessão não encontrada. Faça login novamente para salvar.');
      setToast({ tipo: 'erro', msg: '🔒 Sessão não encontrada. Faça login novamente.' });
      return;
    }
    // Trava o estado de autenticação como true durante todo o upload — não revalida via API do Sanity
    const lockedAuth = true;
    const lockedSessionSnapshot = sessionSnapshot;
    const headersSnapshot = getSessionHeaderFromSnapshot(lockedSessionSnapshot);
    // Garante que UI permaneça autenticada durante upload demorado (imagem grande no Sanity)
    if (lockedAuth) setAutenticado(true);

    setSalvando(true);
    try {
      // 2) ISOLAMENTO DO CORPO DA REQUISIÇÃO — client.assets.upload usa token Sanity independente, sem derrubar Authorization local
      // sanityAdminClient já está configurado com useCdn:false + token: SANITY_API_WRITE_TOKEN (src/lib/sanity.ts:15)
      // O Bearer local (x-admin-auth / Authorization) é enviado apenas para /api/*, nunca interceptado pelo client Sanity
      const hasToken = hasAdminToken();
      if (!hasToken) {
        console.warn(
          '[Admin] VITE_SANITY_API_WRITE_TOKEN não encontrado no cliente — usando /api/upload-imagem com token servidor (SANITY_API_WRITE_TOKEN) isolado. ' +
            'Se o upload falhar com 401, configure o token permanente (Editor/Write) na Vercel e faça Redeploy.'
        );
      }
      const fotosParaEnviar: any[] = [];
      for (const f of fotos) {
        if (f.isNew && f.file) {
          // NÃO revalida sessão com isSessionValid() nem compara LocalStorage que pode ter sido alterado por timeout falso
          // Usa apenas o snapshot travado antes do upload — garante que demora do Sanity não limpe o login
          // client.assets.upload('image', file) usa token Sanity isolado; não toca no Bearer local
          let assetId: string | null = null;
          if (hasToken && sanityAdminClient) {
            try {
              // Isolado: token Sanity (useCdn:false) — não derruba 'Authorization: Bearer' da página /admin
              const asset = await (sanityAdminClient as any).assets.upload('image', f.file, {
                filename: f.file.name,
                contentType: f.file.type || 'image/jpeg',
              });
              assetId = asset._id;
            } catch (directErr: any) {
              console.warn('[Admin] Falha no upload direto via sanityAdminClient (token isolado), tentando via /api/upload-imagem:', directErr?.message);
              // fallback para API — mantém sessão travada, não limpa LocalStorage
            }
          }
          if (!assetId) {
            const base64 = await fileToBase64(f.file);
            const j = await fetchJson(
              '/api/upload-imagem',
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...headersSnapshot },
                body: JSON.stringify({ imageBase64: base64, filename: f.file.name, contentType: f.file.type || 'image/jpeg' }),
              },
              120000
            );
            if (!j.assetId) throw new Error(j.error || 'Erro no upload da foto (sem assetId)');
            assetId = j.assetId;
          }
          fotosParaEnviar.push({ _type: 'image', asset: { _type: 'reference', _ref: assetId } });
        } else if (f.assetRef) {
          fotosParaEnviar.push({ _type: 'image', asset: { _type: 'reference', _ref: f.assetRef } });
        }
      }

      const valorNum = Number(valor.toString().replace(/\D/g, ''));

      const payload = {
        titulo: titulo.trim(),
        tipo,
        regiao,
        endereco: endereco.trim(),
        valor: valorNum,
        finalidade,
        area: Number(area),
        quartos: Number(quartos),
        banheiros: Number(banheiros),
        vagas: Number(vagas),
        descricao: descricao.trim(),
        fotos: fotosParaEnviar,
      };

      if (modoForm === 'editar' && editId) {
        await fetchJson(
          '/api/editar-imovel',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...headersSnapshot },
            body: JSON.stringify({ id: editId, ...payload }),
          },
          120000
        );
      } else {
        await fetchJson(
          '/api/criar-imovel',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...headersSnapshot },
            body: JSON.stringify(payload),
          },
          120000
        );
      }

      setToast({ tipo: 'sucesso', msg: '✅ Imóvel salvo! Já está no site.' });
      // Mantém sessão travada como 'true' — não revalida após sucesso
      // Atualiza timestamp da sessão para estender TTL (evita expiração durante uso)
      try {
        const cur = readSessionSnapshot();
        if (cur) saveSession();
      } catch {}
      // limpa e volta pra lista após 1.2s
      setTimeout(async () => {
        setModoForm(null);
        limparForm();
        await carregarImoveis();
      }, 1200);
    } catch (e: any) {
      console.error('[Admin salvar] erro completo:', e);
      const msg = e?.message || 'Ops, algo deu errado. Tenta de novo ou me chama no WhatsApp';
      // TRATAMENTO DE ERRO SEM DESLOGAR — NUNCA limpa LocalStorage em erro de upload/rede (correção urgente)
      // Mantém sessão travada como 'true' mesmo com lentidão do Sanity; apenas exibe alerta amigável
      const isTimeout = /timeout|aborterror|timed out|failed to fetch|networkerror|aborted/i.test(msg);
      if (isTimeout) {
        // Falso positivo por atraso na resposta da API — NÃO limpa LocalStorage/cookies, NÃO chama handleSessionExpired()
        setToast({
          tipo: 'erro',
          msg: 'Erro ao subir a imagem, tente novamente. A conexão está lenta ou a imagem é muito grande — sua sessão continua ativa e não foi deslogada. Comprima para < 3MB e tente de novo.',
        });
        return;
      }
      const isNetworkError =
        /erro ao subir a imagem|erro no upload|sem assetid|failed to fetch|network|503|502|504|econnreset|enotfound/i.test(msg) ||
        /sanity.*lentidão|temporário/i.test(msg);
      if (isNetworkError) {
        setToast({
          tipo: 'erro',
          msg: 'Erro ao subir a imagem, tente novamente. O Sanity demorou para responder, mas sua sessão continua ativa (não foi deslogada).',
        });
        return;
      }
      const isAuthError =
        /session not found/i.test(msg) ||
        /unauthorized/i.test(msg) ||
        /não autorizado/i.test(msg) ||
        /não configurado/i.test(msg) ||
        /SANITY_WRITE_TOKEN/i.test(msg) ||
        /SANITY_API_WRITE_TOKEN/i.test(msg) ||
        /401|403/.test(msg);
      if (isAuthError) {
        // Mesmo em erro de auth durante o upload, NÃO limpa automaticamente para não derrubar sessão travada
        // Apenas alerta amigável; sessão permanece travada como 'true' até usuário sair manualmente
        // (validação real de senha ocorreu ANTES do upload; falso positivo por demora não deve deslogar)
        setToast({
          tipo: 'erro',
          msg: 'Erro ao salvar (Sanity retornou 401/403). Sua sessão continua ativa — não foi deslogado. Tente novamente em 10s. Se persistir, verifique se SANITY_API_WRITE_TOKEN está configurado na Vercel e faça Redeploy.',
        });
        return;
      }
      // Se for erro de token, dá dica extra — também sem deslogar
      const isTokenError = msg.includes('SANITY_WRITE_TOKEN') || msg.includes('SANITY_API_WRITE_TOKEN') || msg.includes('não configurado');
      setToast({
        tipo: 'erro',
        msg: isTokenError
          ? '⚠️ Token do Sanity não configurado. Vá na Vercel → Settings → Environment Variables → adicione SANITY_API_WRITE_TOKEN (ou SANITY_WRITE_TOKEN) (gere em sanity.io/manage) e faça Redeploy. Sua sessão não foi deslogada.' + ' ' + msg
          : msg.includes('API não encontrada')
          ? msg
          : msg.length > 220 ? msg.slice(0, 220) + '…' : msg,
      });
    } finally {
      setSalvando(false);
    }
  };

  // Filtro simples
  const imoveisFiltrados = imoveis.filter((im) => {
    if (!filtroBusca.trim()) return true;
    const q = filtroBusca.toLowerCase();
    return im.titulo.toLowerCase().includes(q) || im.regiao.toLowerCase().includes(q) || im.tipo.toLowerCase().includes(q);
  });

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F2EF]">
        <div className="text-[#8F7E7E] text-lg">Carregando...</div>
      </div>
    );
  }

  // Tela de login
  if (!autenticado) {
    return (
      <div className="min-h-screen bg-[#F8F2EF] flex flex-col">
        <SEO
          title="Admin — Silvia Helena"
          description="Área administrativa"
          canonical="https://silviahelenacorretora.com.br/admin"
          noindex={true}
        />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-[420px] bg-white rounded-[24px] shadow-[0_8px_40px_rgba(23,6,13,0.08)] p-8 md:p-10 border border-black/5">
            <div className="text-center mb-8">
              <div className="mx-auto w-[56px] h-[56px] rounded-full bg-[#17060D] flex items-center justify-center mb-4">
                <span className="text-[#D4A373] text-[22px]">🔒</span>
              </div>
              <h1 className="font-serif text-[28px] font-light text-[#17060D] tracking-wide">Área da Silvia</h1>
              <p className="text-[15px] text-[#8F7E7E] mt-2 leading-relaxed">Digite sua senha para entrar</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-[16px] font-medium text-[#17060D] mb-2">Senha</label>
                <input
                  type="password"
                  value={senhaInput}
                  onChange={(e) => setSenhaInput(e.target.value)}
                  placeholder="Sua senha"
                  className="w-full h-[56px] px-4 rounded-[14px] border-2 border-black/10 bg-white text-[18px] text-[#17060D] placeholder:text-[#8F7E7E]/60 focus:outline-none focus:border-[#D4A373] focus:ring-4 focus:ring-[#D4A373]/15 transition"
                  autoFocus
                  inputMode="text"
                  autoComplete="current-password"
                />
                {erroSenha && <p className="text-[14px] text-red-600 mt-2">{erroSenha}</p>}
              </div>

              <button
                type="submit"
                className="w-full h-[56px] rounded-[14px] bg-[#17060D] text-white text-[18px] font-semibold tracking-wide hover:bg-black active:scale-[0.98] transition flex items-center justify-center gap-2"
              >
                Entrar
              </button>

              <p className="text-center text-[13px] text-[#8F7E7E] leading-relaxed pt-2">
                Dica: a senha é a que você configurou no Vercel em <br />
                <span className="font-mono bg-black/5 px-2 py-1 rounded">VITE_ADMIN_PASSWORD</span>
              </p>
            </form>
          </div>
        </div>

        <div className="text-center pb-6 text-[12px] tracking-widest uppercase text-[#8F7E7E]">Silvia Helena • CRECISP 125743</div>
      </div>
    );
  }

  // Tela de formulário (novo/editar)
  if (modoForm) {
    return (
      <div className="min-h-screen bg-[#F8F2EF] pb-[96px]">
        <SEO
          title={modoForm === 'novo' ? 'Novo imóvel — Admin' : 'Editar imóvel — Admin'}
          description="Administração"
          canonical="https://silviahelenacorretora.com.br/admin"
          noindex={true}
        />

        {/* header form — sem blur */}
        <div className="sticky top-0 z-30 bg-white border-b border-black/5">
          <div className="max-w-[720px] mx-auto px-4 h-[64px] flex items-center justify-between">
            <button
              onClick={() => {
                setModoForm(null);
                limparForm();
              }}
              className="text-[16px] font-medium text-[#17060D] flex items-center gap-2 px-2 py-2 -ml-2"
            >
              <span className="text-[20px]">←</span> Voltar
            </button>
            <span className="font-serif text-[18px] text-[#17060D]">{modoForm === 'novo' ? 'Novo imóvel' : 'Editar imóvel'}</span>
            <span className="w-[60px]" />
          </div>
        </div>

        {/* toast */}
        {toast && (
          <div className={`mx-auto max-w-[720px] px-4 mt-4`}>
            <div className={`rounded-[14px] px-5 py-4 text-[16px] font-medium leading-relaxed ${toast.tipo === 'sucesso' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-700'}`}>
              {toast.msg}
            </div>
          </div>
        )}

        <div className="max-w-[720px] mx-auto px-4 pt-6 space-y-6">
          {/* 1 FOTOS */}
          <div className="bg-white rounded-[20px] p-5 md:p-6 shadow-sm border border-black/5">
            <label className="block text-[17px] font-bold text-[#17060D] mb-1">1. Fotos do imóvel *</label>
            <p className="text-[14px] text-[#8F7E7E] mb-4">Toque para adicionar — pode usar a câmera do celular</p>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-[140px] rounded-[16px] border-2 border-dashed border-[#D4A373]/40 bg-[#D4A373]/5 flex flex-col items-center justify-center gap-2 hover:bg-[#D4A373]/10 transition active:scale-[0.99]"
            >
              <span className="text-[28px]">📸</span>
              <span className="text-[16px] font-semibold text-[#17060D]">Toque para adicionar fotos</span>
              <span className="text-[13px] text-[#8F7E7E]">Pode selecionar várias de uma vez</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              capture="environment"
              className="hidden"
              onChange={(e) => handleFotosSelecionadas(e.target.files)}
            />

            {fotos.length > 0 && (
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mt-5">
                {fotos.map((f) => (
                  <div key={f.id} className="relative group aspect-square rounded-[14px] overflow-hidden bg-black/5 border border-black/5">
                    <img src={f.preview} alt="foto" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removerFoto(f.id)}
                      className="absolute top-1.5 right-1.5 w-[32px] h-[32px] rounded-full bg-red-600 text-white flex items-center justify-center text-[16px] font-bold shadow-md active:scale-90"
                      aria-label="Remover foto"
                    >
                      ×
                    </button>
                    {!f.isNew && (
                      <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">salva</span>
                    )}
                  </div>
                ))}
              </div>
            )}
            <p className="text-[13px] text-[#8F7E7E] mt-3">{fotos.length} foto(s) • a primeira será a capa do anúncio</p>
          </div>

          {/* 2 TITULO */}
          <div className="bg-white rounded-[20px] p-5 md:p-6 shadow-sm border border-black/5">
            <label className="block text-[17px] font-bold text-[#17060D] mb-3">2. Título do anúncio *</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Casa 3 quartos com quintal no Butantã"
              className="w-full h-[56px] px-4 rounded-[14px] border-2 border-black/10 text-[16px] text-[#17060D] placeholder:text-[#8F7E7E]/50 focus:outline-none focus:border-[#D4A373] focus:ring-4 focus:ring-[#D4A373]/15"
            />
          </div>

          {/* 3 TIPO */}
          <div className="bg-white rounded-[20px] p-5 md:p-6 shadow-sm border border-black/5">
            <label className="block text-[17px] font-bold text-[#17060D] mb-3">3. Tipo de imóvel *</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {TIPOS.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setTipo(t.value)}
                  className={`h-[56px] rounded-[14px] border-2 text-[16px] font-semibold transition active:scale-[0.98] ${tipo === t.value ? 'bg-[#17060D] text-white border-[#17060D] shadow-md' : 'bg-white text-[#17060D] border-black/10 hover:border-[#D4A373]/40 hover:bg-[#D4A373]/5'}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4 REGIÃO */}
          <div className="bg-white rounded-[20px] p-5 md:p-6 shadow-sm border border-black/5">
            <label className="block text-[17px] font-bold text-[#17060D] mb-3">4. Região *</label>
            <div className="grid grid-cols-1 gap-3">
              {REGIOES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRegiao(r)}
                  className={`h-[56px] rounded-[14px] border-2 text-[16px] font-semibold transition active:scale-[0.98] ${regiao === r ? 'bg-[#D4A373] text-white border-[#D4A373] shadow-md' : 'bg-white text-[#17060D] border-black/10 hover:border-[#D4A373]/40'}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* 5 ENDEREÇO */}
          <div className="bg-white rounded-[20px] p-5 md:p-6 shadow-sm border border-black/5">
            <label className="block text-[17px] font-bold text-[#17060D] mb-3">5. Endereço</label>
            <input
              type="text"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              placeholder="Rua, número e bairro"
              className="w-full h-[56px] px-4 rounded-[14px] border-2 border-black/10 text-[16px] text-[#17060D] placeholder:text-[#8F7E7E]/50 focus:outline-none focus:border-[#D4A373] focus:ring-4 focus:ring-[#D4A373]/15"
            />
          </div>

          {/* 6 VALOR */}
          <div className="bg-white rounded-[20px] p-5 md:p-6 shadow-sm border border-black/5">
            <label className="block text-[17px] font-bold text-[#17060D] mb-3">6. Valor *</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[18px] font-bold text-[#D4A373]">R$</span>
              <input
                type="text"
                inputMode="numeric"
                value={valor}
                onChange={(e) => {
                  const onlyNums = e.target.value.replace(/\D/g, '');
                  setValor(onlyNums);
                }}
                placeholder="520000"
                className="w-full h-[64px] pl-[52px] pr-4 rounded-[14px] border-2 border-black/10 text-[22px] font-bold text-[#17060D] placeholder:text-[#8F7E7E]/40 focus:outline-none focus:border-[#D4A373] focus:ring-4 focus:ring-[#D4A373]/15"
              />
            </div>
            {valor && <p className="text-[15px] font-medium text-[#8F7E7E] mt-2">{formatarBRL(Number(valor) || 0)}</p>}
          </div>

          {/* 7 FINALIDADE */}
          <div className="bg-white rounded-[20px] p-5 md:p-6 shadow-sm border border-black/5">
            <label className="block text-[17px] font-bold text-[#17060D] mb-3">7. Venda ou Aluguel *</label>
            <div className="grid grid-cols-2 gap-3">
              {FINALIDADES.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFinalidade(f)}
                  className={`h-[56px] rounded-[14px] border-2 text-[16px] font-bold transition active:scale-[0.98] ${finalidade === f ? 'bg-[#17060D] text-white border-[#17060D]' : 'bg-white text-[#17060D] border-black/10'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* 8 STEPPERS */}
          <div className="bg-white rounded-[20px] p-5 md:p-6 shadow-sm border border-black/5">
            <label className="block text-[17px] font-bold text-[#17060D] mb-2">8. Detalhes do imóvel</label>
            <p className="text-[14px] text-[#8F7E7E] mb-2">Use + e − para ajustar</p>
            <Stepper label="Área (m²)" value={area} onChange={setArea} min={0} />
            <Stepper label="Quartos" value={quartos} onChange={setQuartos} min={0} />
            <Stepper label="Banheiros" value={banheiros} onChange={setBanheiros} min={0} />
            <Stepper label="Vagas" value={vagas} onChange={setVagas} min={0} />
          </div>

          {/* 9 DESCRIÇÃO */}
          <div className="bg-white rounded-[20px] p-5 md:p-6 shadow-sm border border-black/5">
            <label className="block text-[17px] font-bold text-[#17060D] mb-3">9. Descrição <span className="font-normal text-[#8F7E7E] text-[14px]">(opcional)</span></label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Conte um pouco sobre o imóvel (opcional)"
              rows={5}
              className="w-full p-4 rounded-[14px] border-2 border-black/10 text-[16px] leading-relaxed text-[#17060D] placeholder:text-[#8F7E7E]/50 focus:outline-none focus:border-[#D4A373] focus:ring-4 focus:ring-[#D4A373]/15 resize-none"
            />
          </div>

          <div className="h-4" />
        </div>

        {/* botão fixo */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-black/10 p-4 safe-area-pb">
          <div className="max-w-[720px] mx-auto">
            <button
              onClick={handleSalvar}
              disabled={salvando}
              className="w-full h-[56px] rounded-[16px] bg-[#1a7f37] hover:bg-[#167030] disabled:bg-[#8F7E7E] text-white text-[18px] font-bold tracking-wide shadow-lg active:scale-[0.98] transition flex items-center justify-center gap-2"
            >
              {salvando ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Salvando...
                </>
              ) : (
                'Salvar Imóvel'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Tela principal lista
  return (
    <div className="min-h-screen bg-[#F8F2EF]">
      <SEO title="Admin — Imóveis" description="Painel administrativo" canonical="https://silviahelenacorretora.com.br/admin" noindex={true} />

      {/* Header — mais elegante sem blur */}
      <div className="sticky top-0 z-30 bg-white border-b border-black/5 shadow-[0_2px_20px_rgba(23,6,13,0.04)]">
        <div className="h-[2px] bg-gradient-to-r from-transparent via-[#D4A373]/60 to-transparent" aria-hidden="true" />
        <div className="max-w-[960px] mx-auto px-4 h-[64px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#17060D] flex items-center justify-center text-[#D4A373] font-serif text-sm">SH</div>
            <div>
              <h1 className="font-serif text-[20px] font-light text-[#17060D] tracking-wide">Meus Imóveis</h1>
              <p className="text-[12px] tracking-widest uppercase text-[#8F7E7E]">Silvia Helena • {imoveis.length} imóveis • CRECISP 125743</p>
            </div>
          </div>
          <button
            onClick={handleSair}
            className="text-[13px] font-medium tracking-wide text-[#8F7E7E] border border-black/10 rounded-full px-4 py-2 hover:bg-black/5 hover:border-black/15 hover:text-[#17060D] transition"
          >
            Sair
          </button>
        </div>
      </div>

      <div className="max-w-[960px] mx-auto px-4 py-6">
        {/* toast */}
        {toast && (
          <div className={`rounded-[14px] px-5 py-4 mb-6 text-[16px] font-medium ${toast.tipo === 'sucesso' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-700'}`}>
            {toast.msg}
          </div>
        )}

        {/* Botão grande adicionar */}
        <button
          onClick={abrirNovo}
          className="w-full h-[64px] rounded-[16px] bg-[#17060D] text-white text-[18px] font-bold tracking-wide shadow-md hover:bg-black active:scale-[0.98] transition flex items-center justify-center gap-3"
        >
          <span className="text-[24px]">＋</span> Adicionar Imóvel Novo
        </button>

        {/* busca simples */}
        <div className="mt-6">
          <input
            type="text"
            value={filtroBusca}
            onChange={(e) => setFiltroBusca(e.target.value)}
            placeholder="Buscar por título, região..."
            className="w-full h-[48px] px-4 rounded-[14px] border border-black/10 bg-white text-[16px] placeholder:text-[#8F7E7E]/60 focus:outline-none focus:border-[#D4A373]"
          />
        </div>

        {/* lista */}
        <div className="mt-6">
          {loadingLista ? (
            <div className="text-center py-16">
              <div className="w-8 h-8 border-2 border-[#D4A373]/30 border-t-[#D4A373] rounded-full animate-spin mx-auto mb-3" />
              <p className="text-[15px] text-[#8F7E7E]">Carregando seus imóveis...</p>
            </div>
          ) : imoveisFiltrados.length === 0 ? (
            <div className="bg-white rounded-[20px] p-10 text-center border border-black/5">
              <p className="text-[28px] mb-3">🏠</p>
              <h3 className="text-[18px] font-bold text-[#17060D]">Nenhum imóvel encontrado</h3>
              <p className="text-[15px] text-[#8F7E7E] mt-2">Toque em “Adicionar Imóvel Novo” para começar</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {imoveisFiltrados.map((im, idx) => {
                const thumb = im.fotos?.[0] ? (() => { try { return urlFor(im.fotos[0]).width(400).height(300).fit('crop').auto('format').url(); } catch { return ''; } })() : '';
                const pausado = im.publicado === false;
                return (
                  <motion.div
                    key={im._id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04, duration: 0.4, ease: [0.16, 1, 0.3, 1] as any }}
                    className={`bg-white rounded-[20px] overflow-hidden border shadow-sm hover:shadow-[0_8px_32px_rgba(23,6,13,0.07)] hover:border-[#D4A373]/15 flex flex-col transition-all duration-300 ${pausado ? 'border-amber-200 opacity-90' : 'border-black/5'}`}>
                    {pausado && <div className="bg-amber-100 text-amber-800 text-[12px] font-bold tracking-widest uppercase text-center py-1.5">⏸️ Pausado — não aparece no site</div>}
                    <div className="aspect-[16/10] bg-[#F8F2EF] relative overflow-hidden">
                      {thumb ? <img src={thumb} alt={im.titulo} className="w-full h-full object-cover" loading="lazy" /> : <div className="w-full h-full flex items-center justify-center text-[#8F7E7E]">Sem foto</div>}
                      <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-[12px] font-semibold text-[#17060D] border border-black/5">
                        {im.tipo} • {im.regiao}
                      </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="text-[16px] font-bold text-[#17060D] leading-tight line-clamp-2">{im.titulo}</h3>
                      <p className="text-[13px] text-[#8F7E7E] mt-1 line-clamp-1">{im.endereco}</p>
                      <p className="text-[18px] font-bold text-[#1a7f37] mt-2">{formatarBRL(im.valor)} <span className="text-[12px] font-medium text-[#8F7E7E]">• {im.finalidade}</span></p>

                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={() => abrirEditar(im)}
                          className="flex-1 h-[48px] rounded-[12px] border-2 border-[#17060D] text-[#17060D] text-[15px] font-bold hover:bg-[#17060D] hover:text-white transition active:scale-[0.98]"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => handleTogglePublicado(im)}
                          className={`flex-1 h-[48px] rounded-[12px] text-[15px] font-bold transition active:scale-[0.98] ${pausado ? 'bg-[#1a7f37] text-white hover:bg-[#167030]' : 'bg-amber-500 text-white hover:bg-amber-600'}`}
                        >
                          {pausado ? '▶️ Ativar' : '⏸️ Pausar'}
                        </button>
                      </div>
                      <button
                        onClick={() => setImovelParaRemover(im)}
                        className="w-full mt-3 h-[44px] rounded-[12px] border border-red-200 bg-white text-red-600 text-[14px] font-semibold hover:bg-red-50 hover:border-red-300 hover:text-red-700 flex items-center justify-center gap-2 transition active:scale-[0.98] group"
                      >
                        <Trash2 size={16} className="group-hover:scale-110 transition-transform" />
                        Remover imóvel
                      </button>
                      <a
                        href={getImovelUrl(im)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full mt-3 h-[44px] rounded-[12px] border border-[#D4A373]/30 bg-[#D4A373]/5 text-[#8B5A2B] text-[14px] font-semibold hover:bg-[#D4A373]/10 hover:border-[#D4A373]/50 hover:text-[#6d4a24] flex items-center justify-center gap-2 transition active:scale-[0.98] group"
                      >
                        <Eye size={16} className="group-hover:scale-110 transition-transform" />
                        Ver no site
                        <ExternalLink size={12} className="opacity-60 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                      </a>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        <div className="text-center mt-10 pb-6">
          <a href="/" className="text-[14px] text-[#8F7E7E] hover:text-[#17060D] underline">
            ← Voltar para o site
          </a>
        </div>
      </div>

      {/* Modal confirmação remover — elegante com detalhe dourado */}
      <AnimatePresence>
        {imovelParaRemover && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center p-4"
            aria-modal="true"
            role="dialog"
          >
            <div className="absolute inset-0 bg-[#0a0206]/70 backdrop-blur-[8px]" onClick={() => !removendo && setImovelParaRemover(null)} aria-hidden="true" />
            <motion.div
              initial={{ scale: 0.96, y: 12, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.96, y: 12, opacity: 0 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              className="relative w-full max-w-[480px] bg-white rounded-[20px] shadow-[0_24px_64px_rgba(0,0,0,0.25)] overflow-hidden border border-red-100"
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-300/50 to-transparent" aria-hidden="true" />
              <div className="p-6 md:p-7">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-50 border border-red-200 flex items-center justify-center shrink-0">
                    <AlertTriangle size={20} className="text-red-600" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[18px] font-bold text-[#17060D]">Remover imóvel?</h3>
                    <p className="text-[14px] text-[#8F7E7E] leading-relaxed mt-1">
                      Tem certeza que deseja remover <span className="font-semibold text-[#17060D]">"{imovelParaRemover.titulo}"</span> em {imovelParaRemover.regiao}? Essa ação não pode ser desfeita e o imóvel sumirá do site.
                    </p>
                  </div>
                  <button
                    onClick={() => !removendo && setImovelParaRemover(null)}
                    className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition shrink-0"
                    aria-label="Fechar"
                  >
                    <X size={16} className="text-[#8F7E7E]" />
                  </button>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setImovelParaRemover(null)}
                    disabled={removendo}
                    className="flex-1 h-[48px] rounded-[12px] border border-black/10 bg-white text-[#17060D] text-[15px] font-semibold hover:bg-black/5 disabled:opacity-50 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleRemover}
                    disabled={removendo}
                    className="flex-1 h-[48px] rounded-[12px] bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white text-[15px] font-bold flex items-center justify-center gap-2 transition active:scale-[0.98]"
                  >
                    {removendo ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" /> : <Trash2 size={16} aria-hidden="true" />}
                    {removendo ? 'Removendo...' : 'Sim, remover'}
                  </button>
                </div>
                <p className="text-[11px] text-[#8F7E7E] text-center mt-3">O imóvel será apagado permanentemente do Sanity.</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPage;

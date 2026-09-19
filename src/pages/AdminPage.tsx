import React, { useEffect, useState, useRef } from 'react';
import { SEO } from '../components/SEO';
import { sanityClient, urlFor, SanityImovel } from '../lib/sanity';

// Senha via env (VITE_ADMIN_PASSWORD) — nunca hardcoded. Fallback só para build local via .env
const ADMIN_PASSWORD = (import.meta as any).env?.VITE_ADMIN_PASSWORD as string | undefined;
const LS_KEY = 'sh_admin_auth';

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

  // Checa localStorage no mount
  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY);
    if (saved === 'true') setAutenticado(true);
    setCheckingAuth(false);
  }, []);

  // Busca imóveis quando autenticado e não está em form
  const carregarImoveis = async () => {
    setLoadingLista(true);
    try {
      // tenta api serverless (traz pausados também)
      const r = await fetch('/api/listar-imoveis');
      if (r.ok) {
        const j = await r.json();
        if (Array.isArray(j.imoveis)) {
          setImoveis(j.imoveis);
          setLoadingLista(false);
          return;
        }
      }
      throw new Error('fallback');
    } catch {
      // fallback público
      try {
        const q = `*[_type == "imovel"] | order(_createdAt desc){ _id, _createdAt, titulo, slug, tipo, regiao, endereco, valor, finalidade, area, quartos, banheiros, vagas, descricao, fotos, publicado }`;
        const dados = await sanityClient.fetch<SanityImovel[]>(q);
        setImoveis(dados || []);
      } catch (e) {
        setToast({ tipo: 'erro', msg: 'Ops, algo deu errado. Tenta de novo ou me chama no WhatsApp' });
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ADMIN_PASSWORD) {
      setErroSenha('Senha não configurada no servidor. Avise o suporte.');
      return;
    }
    if (senhaInput === ADMIN_PASSWORD) {
      localStorage.setItem(LS_KEY, 'true');
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

  const handleTogglePublicado = async (im: SanityImovel) => {
    try {
      const r = await fetch('/api/toggle-imovel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: im._id }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || 'erro');
      setImoveis((prev) => prev.map((p) => (p._id === im._id ? { ...p, publicado: j.publicado } : p)));
      setToast({ tipo: 'sucesso', msg: j.publicado ? '✅ Imóvel ativado! Já está no site.' : '⏸️ Imóvel pausado. Não aparece mais no site.' });
    } catch {
      setToast({ tipo: 'erro', msg: 'Ops, algo deu errado. Tenta de novo ou me chama no WhatsApp' });
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

    setSalvando(true);
    try {
      // 1) upload das fotos novas
      const fotosParaEnviar: any[] = [];
      for (const f of fotos) {
        if (f.isNew && f.file) {
          const base64 = await fileToBase64(f.file);
          const up = await fetch('/api/upload-imagem', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageBase64: base64, filename: f.file.name, contentType: f.file.type || 'image/jpeg' }),
          });
          const j = await up.json();
          if (!up.ok) throw new Error(j.error || 'Erro no upload da foto');
          fotosParaEnviar.push({ _type: 'image', asset: { _type: 'reference', _ref: j.assetId } });
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

      let r: Response;
      if (modoForm === 'editar' && editId) {
        r = await fetch('/api/editar-imovel', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editId, ...payload }),
        });
      } else {
        r = await fetch('/api/criar-imovel', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || 'erro ao salvar');

      setToast({ tipo: 'sucesso', msg: '✅ Imóvel salvo! Já está no site.' });
      // limpa e volta pra lista após 2s
      setTimeout(async () => {
        setModoForm(null);
        limparForm();
        await carregarImoveis();
      }, 1200);
    } catch (e: any) {
      setToast({ tipo: 'erro', msg: e?.message?.includes('Ops') ? e.message : 'Ops, algo deu errado. Tenta de novo ou me chama no WhatsApp' });
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

        {/* header form */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-black/5">
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

      {/* Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-black/5">
        <div className="max-w-[960px] mx-auto px-4 h-[64px] flex items-center justify-between">
          <div>
            <h1 className="font-serif text-[20px] font-light text-[#17060D] tracking-wide">Meus Imóveis</h1>
            <p className="text-[12px] tracking-widest uppercase text-[#8F7E7E]">Silvia Helena • {imoveis.length} imóveis</p>
          </div>
          <button
            onClick={handleSair}
            className="text-[14px] font-medium text-[#8F7E7E] border border-black/10 rounded-full px-4 py-2 hover:bg-black/5 transition"
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
              {imoveisFiltrados.map((im) => {
                const thumb = im.fotos?.[0] ? (() => { try { return urlFor(im.fotos[0]).width(400).height(300).fit('crop').auto('format').url(); } catch { return ''; } })() : '';
                const pausado = im.publicado === false;
                return (
                  <div key={im._id} className={`bg-white rounded-[20px] overflow-hidden border shadow-sm flex flex-col ${pausado ? 'border-amber-200 opacity-90' : 'border-black/5'}`}>
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
                    </div>
                  </div>
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
    </div>
  );
};

export default AdminPage;

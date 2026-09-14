import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Wind,
  ArrowRight,
  LayoutDashboard,
  CheckCircle2,
  Clock,
  Sparkles,
  Truck,
  MessageCircle,
  Calculator,
  Users,
  Shirt,
  Tag,
  ShieldCheck,
  Check,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

// ─── Dados de Funcionalidades ────────────────────────────────────────────────

const features = [
  {
    icon: LayoutDashboard,
    title: "Controle de Pedidos em Kanban",
    desc: "Visualização clara do fluxo operacional: Recebido, Passando, Pronto e Entregue. Movimente os pedidos com apenas um clique.",
    badge: "Esteira de Produção",
    color: "from-blue-500 to-indigo-600",
    bg: "bg-blue-50 text-blue-700",
  },
  {
    icon: MessageCircle,
    title: "Notificação com 1 Clique no WhatsApp",
    desc: "Avisos automáticos e padronizados para o WhatsApp do cliente assim que as roupas ficarem prontas para retirada.",
    badge: "Comunicação Instantânea",
    color: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50 text-emerald-700",
  },
  {
    icon: Calculator,
    title: "Cálculo Automático por Peça",
    desc: "Comanda rápida com seletores de quantidade (+) e (-) para cada tipo de roupa, somando valores e peças sem risco de erros.",
    badge: "Comanda Inteligente",
    color: "from-violet-500 to-purple-600",
    bg: "bg-violet-50 text-violet-700",
  },
  {
    icon: Users,
    title: "Histórico Completo de Clientes",
    desc: "Cadastro ágil com máscara de telefone, registro de preferências especiais e histórico detalhado de todas as comandas feitas.",
    badge: "Fidelização",
    color: "from-sky-500 to-cyan-600",
    bg: "bg-sky-50 text-sky-700",
  },
];

// ─── Passos de "Como Funciona" ───────────────────────────────────────────────

const steps = [
  {
    number: "01",
    title: "Registre as peças recebidas",
    desc: "Abra a comanda rápida, selecione o cliente e use os botões (+) e (-) para marcar as camisas, calças e vestidos recebidos.",
    icon: Shirt,
  },
  {
    number: "02",
    title: "Acompanhe a esteira de produção",
    desc: "Visualize os pedidos na tábua e avance o status de 'Recebido' para 'Passando' e depois para 'Pronto' com agilidade total.",
    icon: Sparkles,
  },
  {
    number: "03",
    title: "Avise o cliente e finalize a entrega",
    desc: "Clique no botão oficial do WhatsApp para enviar o aviso de retirada pronto e confirme a entrega ao cliente.",
    icon: Truck,
  },
];

// ─── Tabela de Preços Base ───────────────────────────────────────────────────

const commonPrices = [
  { piece: "Camisa Social / Linho", time: "24h", price: "R$ 7,50", popular: true },
  { piece: "Calça Jeans / Alfaiataria", time: "24h", price: "R$ 8,00", popular: false },
  { piece: "Camiseta Básica / Polo", time: "24h", price: "R$ 5,00", popular: false },
  { piece: "Vestido Simples / Midi", time: "48h", price: "R$ 14,00", popular: false },
  { piece: "Vestido de Festa / Tecido Fino", time: "48h", price: "R$ 22,00", popular: true },
  { piece: "Lençol / Colcha de Cama (Casal/Queen)", time: "48h", price: "R$ 16,00", popular: false },
];

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-100 selection:text-indigo-800">
      {/* ── HEADER FIXO ──────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs shadow-indigo-200">
              <Wind className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-slate-900 tracking-tight">PassaFácil</span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Operacional
              </span>
            </div>
          </div>

          {/* Links de Navegação Suave */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#funcionalidades" className="hover:text-indigo-600 transition-colors">
              Funcionalidades
            </a>
            <a href="#como-funciona" className="hover:text-indigo-600 transition-colors">
              Como Funciona
            </a>
            <a href="#precos" className="hover:text-indigo-600 transition-colors">
              Tabela de Preços
            </a>
          </nav>

          {/* Botão de Destaque para o Painel */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/painel")}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-xl shadow-xs shadow-indigo-200 transition-all hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Acessar Painel</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO SECTION COM MOCKUP VISUAL DO KANBAN ─────────────────────── */}
      <section className="pt-28 pb-16 sm:pt-36 sm:pb-24 px-4 sm:px-6 relative overflow-hidden">
        {/* Glow de fundo */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-r from-indigo-200/30 via-sky-200/20 to-violet-200/20 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto text-center">
          {/* Badge superior */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Sistema Operacional Especializado em Passadorias</span>
          </div>

          {/* Título Marcante Solicitado */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] mb-6">
            A gestão completa da sua passadoria{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-sky-600 to-violet-600 bg-clip-text text-transparent">
              em um só lugar
            </span>
          </h1>

          {/* Subtítulo explicativo */}
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-9">
            Ganhe agilidade na recepção de comandas, controle cada peça na tábua e avise seus clientes pelo WhatsApp assim que as roupas ficarem prontas.
          </p>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-14">
            <button
              onClick={() => navigate("/painel")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-7 py-3.5 rounded-2xl text-base shadow-lg shadow-indigo-200 hover:shadow-xl transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Abrir Painel de Gestão</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#funcionalidades"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-bold px-6 py-3.5 rounded-2xl text-base border border-slate-200 shadow-2xs transition-all"
            >
              <span>Ver Funcionalidades</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </a>
          </div>

          {/* ── MOCKUP VISUAL DO QUADRO KANBAN EM TEMPO REAL ───────────────── */}
          <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-xl p-4 sm:p-6 text-left relative">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="ml-2 text-xs font-bold text-slate-600">Simulação do Fluxo Kanban Operacional</span>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Tempo Real
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Coluna 1: Recebido */}
              <div className="bg-blue-50/50 rounded-2xl p-3 border border-blue-100/80 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-bold text-blue-900 pb-1 border-b border-blue-100">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Recebido
                  </span>
                  <span className="bg-white text-blue-700 px-1.5 py-0.2 rounded text-[10px]">1</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-2xs text-xs space-y-1">
                  <div className="flex justify-between font-mono font-bold text-[11px] text-indigo-600">
                    <span>#000142</span>
                    <span className="text-slate-400">R$ 30,00</span>
                  </div>
                  <p className="font-bold text-slate-800 truncate">Maria Oliveira</p>
                  <p className="text-[10px] text-slate-500">4 camisas sociais</p>
                  <div className="pt-1.5">
                    <span className="inline-block w-full text-center text-[10px] font-bold bg-blue-50 text-blue-700 py-1 rounded">
                      Mover p/ Passando ➔
                    </span>
                  </div>
                </div>
              </div>

              {/* Coluna 2: Passando */}
              <div className="bg-amber-50/50 rounded-2xl p-3 border border-amber-100/80 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-bold text-amber-900 pb-1 border-b border-amber-100">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Passando
                  </span>
                  <span className="bg-white text-amber-700 px-1.5 py-0.2 rounded text-[10px]">1</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-2xs text-xs space-y-1">
                  <div className="flex justify-between font-mono font-bold text-[11px] text-amber-600">
                    <span>#000141</span>
                    <span className="text-slate-400">R$ 31,00</span>
                  </div>
                  <p className="font-bold text-slate-800 truncate">Carlos Lima</p>
                  <p className="text-[10px] text-slate-500">2 calças, 3 polos</p>
                  <div className="pt-1.5">
                    <span className="inline-block w-full text-center text-[10px] font-bold bg-amber-50 text-amber-700 py-1 rounded">
                      Marcar como Pronto ➔
                    </span>
                  </div>
                </div>
              </div>

              {/* Coluna 3: Pronto (Com botão WhatsApp) */}
              <div className="bg-emerald-50/50 rounded-2xl p-3 border border-emerald-100/80 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-900 pb-1 border-b border-emerald-100">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Pronto
                  </span>
                  <span className="bg-white text-emerald-700 px-1.5 py-0.2 rounded text-[10px]">1</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-2xs text-xs space-y-1">
                  <div className="flex justify-between font-mono font-bold text-[11px] text-emerald-600">
                    <span>#000140</span>
                    <span className="text-slate-400">R$ 22,00</span>
                  </div>
                  <p className="font-bold text-slate-800 truncate">Fernanda Dias</p>
                  <p className="text-[10px] text-slate-500">1 vestido de festa</p>
                  <div className="pt-1.5 flex flex-col gap-1">
                    <div className="bg-[#25D366] text-white font-bold py-1 px-2 rounded text-[10px] flex items-center justify-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      <span>Avisar no WhatsApp</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Coluna 4: Entregue */}
              <div className="bg-slate-100/60 rounded-2xl p-3 border border-slate-200/80 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 pb-1 border-b border-slate-200">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" /> Entregue
                  </span>
                  <span className="bg-white text-slate-700 px-1.5 py-0.2 rounded text-[10px]">1</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-2xs text-xs space-y-1 opacity-75">
                  <div className="flex justify-between font-mono font-bold text-[11px] text-slate-500">
                    <span>#000139</span>
                    <span className="text-slate-400">R$ 45,00</span>
                  </div>
                  <p className="font-bold text-slate-800 truncate">Paulo Santos</p>
                  <p className="text-[10px] text-emerald-600 font-semibold">✓ Concluído e pago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SEÇÃO DE FUNCIONALIDADES ─────────────────────────────────────── */}
      <section id="funcionalidades" className="py-20 px-4 sm:px-6 bg-white border-y border-slate-200/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-3">
              Recursos Operacionais
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Tudo o que sua passadoria precisa no dia a dia
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-3 leading-relaxed">
              Ferramentas planejadas para acelerar o atendimento, eliminar anotações em papel e manter suas roupas sempre organizadas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-50/70 rounded-3xl p-6 border border-slate-200/80 hover:border-indigo-300 hover:bg-white hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mb-4 text-indigo-600 shadow-2xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`inline-block text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${feat.bg} mb-2`}>
                      {feat.badge}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mb-2">
                      {feat.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SEÇÃO COMO FUNCIONA (3 PASSOS) ───────────────────────────────── */}
      <section id="como-funciona" className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-3">
              Fluxo em 3 Etapas
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Como funciona o PassaFácil
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-2">
              Da entrada das peças ao aviso de retirada em menos de 1 minuto.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {steps.map((st, i) => {
              const Icon = st.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-xs relative flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-3xl font-black text-indigo-100 font-mono">
                      {st.number}
                    </span>
                    <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 mb-2">
                      {st.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                      {st.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TABELA DE PREÇOS BASE ────────────────────────────────────────── */}
      <section id="precos" className="py-20 px-4 sm:px-6 bg-slate-100/60 border-t border-slate-200/80">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 text-violet-700 text-xs font-bold uppercase tracking-wider mb-3">
              Catálogo de Roupas
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Tabela de Serviços & Peças
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-2">
              Valores base praticados para os itens mais frequentes.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-4 px-6">Peça / Serviço</th>
                    <th className="py-4 px-4">Prazo Médio</th>
                    <th className="py-4 px-6 text-right">Valor Unitário</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {commonPrices.map((item, i) => (
                    <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6 font-semibold text-slate-800 flex items-center gap-2.5">
                        <Shirt className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                        <span>{item.piece}</span>
                        {item.popular && (
                          <span className="text-[10px] bg-indigo-100 text-indigo-700 font-extrabold px-1.5 py-0.5 rounded">
                            Popular
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-slate-500 text-xs">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {item.time}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right font-black text-slate-900 text-base">
                        {item.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-500 text-center sm:text-left">
                Valores configuráveis diretamente no menu <strong>Tabela de Preços</strong> do painel.
              </span>
              <button
                onClick={() => navigate("/painel")}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all"
              >
                <span>Acessar no Painel</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER MODERNO COM STATUS DA API ──────────────────────────────── */}
      <footer className="py-10 px-4 sm:px-6 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Wind className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-800 text-sm">PassaFácil</span>
            <span className="text-slate-400">· Gestão Operacional de Passadorias</span>
          </div>

          {/* Indicador verde de status da API solicitado */}
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200/80">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-700 text-[11px]">Servidor Conectado (API ativa)</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/painel")}
              className="text-indigo-600 font-bold hover:underline"
            >
              Abrir Painel &rarr;
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

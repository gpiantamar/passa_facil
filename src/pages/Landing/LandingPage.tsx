import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Wind,
  Sparkles,
  Shirt,
  Clock,
  Truck,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Tag,
  Star,
  MessageCircle,
  Zap,
} from "lucide-react";

// ─── Dados de Diferenciais ───────────────────────────────────────────────────

const differentials = [
  {
    icon: Truck,
    title: "Rapidez & Pontualidade",
    desc: "Suas peças prontas e cheirosas no prazo prometido. Opção express com entrega em até 24h.",
    badge: "Entrega em até 24h",
    accent: "from-sky-500 to-blue-600",
    bg: "bg-sky-50 text-sky-700",
  },
  {
    icon: Sparkles,
    title: "Cuidado com Tecidos Nobres",
    desc: "Temperatura e vapor ideais para linhos, sedas, camisas sociais e peças com bordados ou pedrarias.",
    badge: "Acabamento de alfaiataria",
    accent: "from-violet-500 to-indigo-600",
    bg: "bg-violet-50 text-violet-700",
  },
  {
    icon: MessageCircle,
    title: "Praticidade & WhatsApp",
    desc: "Acompanhamento digital de cada pedido. Notificações diretas pelo WhatsApp assim que a roupa estiver pronta.",
    badge: "Contato instantâneo",
    accent: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50 text-emerald-700",
  },
  {
    icon: Tag,
    title: "Preço Justo & Transparente",
    desc: "Tabela clara por peça ou pacote. Você sabe exatamente quanto vai pagar antes de fechar o pedido.",
    badge: "Sem taxas surpresa",
    accent: "from-indigo-500 to-purple-600",
    bg: "bg-indigo-50 text-indigo-700",
  },
];

// ─── Tabela de Preços Base / Serviços Comuns ─────────────────────────────────

const commonPrices = [
  { piece: "Camisa Social / Linho", unit: "unidade", time: "24h", price: "R$ 7,50", highlight: true },
  { piece: "Calça Jeans / Alfaiataria", unit: "unidade", time: "24h", price: "R$ 8,00", highlight: false },
  { piece: "Camiseta Básica / Polo", unit: "unidade", time: "24h", price: "R$ 5,00", highlight: false },
  { piece: "Vestido Simples / Midi", unit: "unidade", time: "24h a 48h", price: "R$ 14,00", highlight: false },
  { piece: "Vestido de Festa / Tecido Fino", unit: "unidade", time: "48h", price: "R$ 22,00", highlight: true },
  { piece: "Lençol / Colcha de Cama (Casal/Queen)", unit: "peça", time: "48h", price: "R$ 16,00", highlight: false },
  { piece: "Paletó / Blazer", unit: "unidade", time: "48h", price: "R$ 18,00", highlight: false },
  { piece: "Pacote Família (a partir de 20 peças)", unit: "lote", time: "48h", price: "Sob consulta", highlight: true },
];

// ─── Depoimentos ─────────────────────────────────────────────────────────────

const testimonials = [
  {
    name: "Carolina Mendes",
    role: "Advogada",
    text: "Minhas camisas de trabalho nunca mais ficaram com marcas de ferro. O caimento é perfeito e a entrega sempre no dia certo!",
    stars: 5,
  },
  {
    name: "Roberto Silveira",
    role: "Empresário",
    text: "Economizo horas do meu fim de semana. Avisam pelo WhatsApp quando está pronto e eu só passo para retirar. Recomendo muito.",
    stars: 5,
  },
  {
    name: "Mariana Alencar",
    role: "Mãe e Designer",
    text: "O cuidado com roupas infantis e vestidos de seda é excepcional. Além disso, o preço por peça é super justo e transparente.",
    stars: 5,
  },
];

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-sky-50/40 text-slate-800 font-sans selection:bg-indigo-100 selection:text-indigo-800">
      {/* ── NAVBAR ───────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-sky-500 flex items-center justify-center shadow-md shadow-indigo-200">
              <Wind className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-indigo-700 to-sky-600 bg-clip-text text-transparent">
                PassaFácil
              </span>
              <span className="hidden sm:inline-block ml-2 text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                Passadoria
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <a href="#diferenciais" className="hover:text-indigo-600 transition-colors">
              Diferenciais
            </a>
            <a href="#precos" className="hover:text-indigo-600 transition-colors">
              Tabela de Preços
            </a>
            <a href="#depoimentos" className="hover:text-indigo-600 transition-colors">
              Depoimentos
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/entrar")}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-sm font-semibold px-4 sm:px-5 py-2.5 rounded-xl shadow-md shadow-indigo-100 transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Acessar Sistema</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO SECTION ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 px-4 sm:px-6">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-indigo-200/40 via-sky-200/30 to-violet-200/20 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto text-center">
          {/* Badge superior */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs sm:text-sm font-medium mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Passadoria profissional e sob medida</span>
          </div>

          {/* Chamada principal exigida */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-6">
            Suas roupas impecáveis{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-sky-600 to-violet-600 bg-clip-text text-transparent">
              sem você perder tempo
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-9">
            Deixe o ferro e a tábua de lado. Cuidamos das suas peças com carinho, vapor profissional e acabamento impecável para você vestir o seu melhor todos os dias.
          </p>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12">
            <button
              onClick={() => navigate("/entrar")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-7 py-3.5 rounded-2xl text-base shadow-lg shadow-indigo-200 hover:shadow-xl transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Entrar no Sistema</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <a
              href="#precos"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-6 py-3.5 rounded-2xl text-base border border-slate-200/80 shadow-sm transition-all"
            >
              <Tag className="w-4 h-4 text-slate-400" />
              <span>Ver Tabela de Preços</span>
            </a>
          </div>

          {/* 3 Diferenciais Rápidos / Badges do Hero */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white/80 border border-slate-100 shadow-sm">
              <Truck className="w-4 h-4 text-sky-600 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-slate-700">Entrega em até 24h</span>
            </div>
            <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white/80 border border-slate-100 shadow-sm">
              <Sparkles className="w-4 h-4 text-violet-600 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-slate-700">Cuidado profissional</span>
            </div>
            <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white/80 border border-slate-100 shadow-sm">
              <Tag className="w-4 h-4 text-indigo-600 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-slate-700">Preço justo por peça</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── SEÇÃO DE DIFERENCIAIS ────────────────────────────────────────── */}
      <section id="diferenciais" className="py-20 px-4 sm:px-6 bg-white/70 border-y border-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-100 text-sky-700 text-xs font-semibold uppercase tracking-wider mb-3">
              Por que escolher o PassaFácil?
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Excelência e carinho em cada detalhe
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-3 leading-relaxed">
              Desenvolvemos um processo artesanal aliado à tecnologia para você nunca mais se preocupar com roupas amassadas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {differentials.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="group relative bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:border-slate-200 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-50 to-indigo-50/60 border border-slate-100 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6 text-indigo-600" />
                    </div>
                    <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full ${item.bg} mb-2.5`}>
                      {item.badge}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TABELA DE PREÇOS / SERVIÇOS ──────────────────────────────────── */}
      <section id="precos" className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 border border-violet-100 text-violet-700 text-xs font-semibold uppercase tracking-wider mb-3">
              Tabela de Serviços & Peças
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Preços base transparentes
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-2">
              Confira os valores médios para as peças mais solicitadas no nosso dia a dia.
            </p>
          </div>

          {/* Tabela de Preços */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="py-4 px-6 font-semibold">Peça / Serviço</th>
                    <th className="py-4 px-4 font-semibold">Unidade</th>
                    <th className="py-4 px-4 font-semibold">Prazo Médio</th>
                    <th className="py-4 px-6 text-right font-semibold">Valor Base</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {commonPrices.map((item, i) => (
                    <tr
                      key={i}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        item.highlight ? "bg-indigo-50/20" : ""
                      }`}
                    >
                      <td className="py-4 px-6 font-medium text-slate-800 flex items-center gap-2.5">
                        <Shirt className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                        <span>{item.piece}</span>
                        {item.highlight && (
                          <span className="hidden sm:inline-block text-[10px] bg-indigo-100 text-indigo-700 font-bold px-1.5 py-0.5 rounded">
                            Popular
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-slate-500 text-xs">{item.unit}</td>
                      <td className="py-4 px-4 text-slate-500 text-xs">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {item.time}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right font-bold text-slate-900 text-sm sm:text-base">
                        {item.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-slate-50/70 p-4 sm:p-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-500 text-center sm:text-left">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Preços personalizáveis diretamente pelo painel administrativo do sistema.</span>
              </div>
              <button
                onClick={() => navigate("/entrar")}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-sm transition-all"
              >
                <span>Fazer um pedido</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── DEPOIMENTOS ──────────────────────────────────────────────────── */}
      <section id="depoimentos" className="py-20 px-4 sm:px-6 bg-slate-50/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              O que dizem nossos clientes
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Quem experimenta a tranquilidade de não passar roupa nunca mais volta atrás.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 mb-3 text-amber-400">
                    {Array.from({ length: t.stars }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed italic mb-5">
                    "{t.text}"
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-50">
                  <p className="text-sm font-bold text-slate-800">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-br from-indigo-700 via-indigo-800 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute -top-10 -right-10 w-80 h-80 bg-sky-400 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-violet-400 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-7 h-7 text-sky-300" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Pronto para ter suas roupas sempre alinhadas?
          </h2>
          <p className="text-indigo-200 text-base sm:text-lg mb-8 max-w-xl mx-auto">
            Acesse o sistema agora, cadastre seus pedidos e acompanhe tudo com total facilidade e rapidez.
          </p>
          <button
            onClick={() => navigate("/entrar")}
            className="inline-flex items-center gap-2.5 bg-white text-indigo-700 hover:bg-slate-50 font-bold px-8 py-4 rounded-2xl text-base shadow-xl transition-all hover:scale-105 active:scale-100"
          >
            <span>Acessar o Painel</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="py-8 px-4 sm:px-6 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Wind className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-slate-700 text-sm">PassaFácil</span>
          </div>
          <p>© {new Date().getFullYear()} PassaFácil — Gestão e cuidado com roupas.</p>
        </div>
      </footer>
    </div>
  );
}

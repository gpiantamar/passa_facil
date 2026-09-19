import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Wind,
  ArrowRight,
  Shirt,
  Heart,
  CheckCircle2,
  MessageCircle,
  Clock,
  BarChart3,
  Sparkles,
  Truck,
  Zap,
  Star,
} from "lucide-react";
import { DarkModeToggle } from "../../components/ui/DarkModeToggle";

const PRECO_TABLE = [
  { peca: "Camisa social / linho",       prazo: "24h", preco: "R$ 7,50" },
  { peca: "Calça jeans / alfaiataria",   prazo: "24h", preco: "R$ 8,00" },
  { peca: "Camiseta básica / polo",      prazo: "24h", preco: "R$ 5,00" },
  { peca: "Vestido simples / midi",      prazo: "48h", preco: "R$ 14,00" },
  { peca: "Vestido de festa / tecido fino", prazo: "48h", preco: "R$ 22,00" },
  { peca: "Lençol / colcha casal",       prazo: "48h", preco: "R$ 16,00" },
];

const FEATURES = [
  {
    icon: Sparkles,
    title: "Kanban em tempo real",
    desc: "Quadro visual com 4 etapas: Recebido → Passando → Pronto → Entregue. Um clique para avançar.",
    color: "bg-indigo-50 text-indigo-600 border-indigo-100",
  },
  {
    icon: MessageCircle,
    title: "Aviso via WhatsApp",
    desc: "Quando pronto, gera link direto com mensagem personalizada. Zero digitação.",
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  {
    icon: Zap,
    title: "Comanda automática",
    desc: "Seleciona o cliente, adiciona peças, e o valor é calculado automaticamente.",
    color: "bg-amber-50 text-amber-600 border-amber-100",
  },
  {
    icon: BarChart3,
    title: "Resumo do dia",
    desc: "Métricas operacionais em tempo real: peças, faturamento, pedidos pendentes.",
    color: "bg-sky-50 text-sky-600 border-sky-100",
  },
  {
    icon: CheckCircle2,
    title: "Histórico completo",
    desc: "Cada pedido fica salvo com todas as peças, datas e valores. Consulte quando quiser.",
    color: "bg-rose-50 text-rose-600 border-rose-100",
  },
  {
    icon: Shirt,
    title: "Tabela de preços",
    desc: "Preços cadastrados no sistema. Sem papel, sem decorar o valor de cada peça.",
    color: "bg-violet-50 text-violet-600 border-violet-100",
  },
];

const KANBAN_PREVIEW = [
  {
    stage: "Recebido",
    dot: "bg-blue-500",
    bg: "bg-blue-50",
    border: "border-blue-100",
    headerColor: "text-blue-800",
    cards: [
      { client: "Maria S.", code: "PF-042", pieces: "3 camisas", value: "R$ 22,50" },
      { client: "João P.", code: "PF-043", pieces: "2 calças", value: "R$ 16,00" },
    ],
  },
  {
    stage: "Passando",
    dot: "bg-amber-500",
    bg: "bg-amber-50",
    border: "border-amber-100",
    headerColor: "text-amber-800",
    cards: [
      { client: "Ana C.", code: "PF-039", pieces: "1 vestido", value: "R$ 22,00" },
    ],
  },
  {
    stage: "Pronto",
    dot: "bg-emerald-500",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    headerColor: "text-emerald-800",
    cards: [
      { client: "Carlos M.", code: "PF-037", pieces: "5 peças", value: "R$ 37,50" },
    ],
  },
  {
    stage: "Entregue",
    dot: "bg-slate-400",
    bg: "bg-slate-50",
    border: "border-slate-100",
    headerColor: "text-slate-700",
    cards: [
      { client: "Lúcia R.", code: "PF-035", pieces: "4 peças", value: "R$ 30,00" },
      { client: "Pedro A.", code: "PF-034", pieces: "2 peças", value: "R$ 15,00" },
    ],
  },
];

// Hook simples para animar o contador
function useCountUp(target: number, duration = 1200) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let start: number | null = null;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString("pt-BR");
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return ref;
}

function AnimatedStat({ value, label }: { value: number; label: string }) {
  const ref = useCountUp(value);
  return (
    <div className="text-center">
      <p className="text-3xl font-black text-slate-900">
        <span ref={ref}>0</span>
        <span className="text-indigo-500">+</span>
      </p>
      <p className="text-xs text-slate-500 mt-1 font-medium">{label}</p>
    </div>
  );
}

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-slate-900" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── NAV ── */}
      <header className="sticky top-0 z-40 glass border-b border-slate-200/60">
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center shadow-sm shadow-indigo-300">
              <Wind className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-slate-900 tracking-tight">PassaFácil</span>
          </div>

          <nav className="hidden sm:flex items-center gap-1">
            {[
              { href: "#funcionalidades", label: "Funcionalidades" },
              { href: "#como-funciona", label: "Como funciona" },
              { href: "#precos", label: "Preços" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg font-medium"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <DarkModeToggle />
            <a
              href="https://github.com/gpiantamar/passa_facil"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-100 font-medium"
            >
              GitHub
            </a>
            <button
              id="btn-acessar-painel-nav"
              onClick={() => navigate("/painel")}
              className="shimmer-cta text-sm font-semibold bg-slate-900 text-white px-4 py-2 rounded-xl hover:bg-slate-700 shadow-sm"
            >
              Abrir painel →
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="max-w-5xl mx-auto px-5 pt-20 pb-12 animate-fade-in">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-100 text-rose-500 text-xs font-semibold px-3 py-1.5 rounded-full mb-8">
          <Heart className="w-3 h-3 fill-rose-400 text-rose-400" />
          Projeto open source — feito com carinho
        </div>

        <h1 className="text-5xl sm:text-6xl font-black text-slate-900 leading-[1.05] tracking-tight mb-6">
          Um sisteminha que fiz<br />
          <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            pra ajudar minha mãe.
          </span>
        </h1>

        <p className="text-lg text-slate-600 leading-relaxed mb-4 max-w-2xl">
          Minha mãe tem uma passadoria em casa. Ela controlava tudo no papel —
          e às vezes perdia uma peça, esquecia de avisar o cliente, ou se confundia com os valores.
        </p>
        <p className="text-lg text-slate-600 leading-relaxed mb-10 max-w-2xl">
          O <strong className="text-slate-800">PassaFácil</strong> é um sistema para registrar as roupas que chegam,
          acompanhar o andamento e avisar pelo WhatsApp quando estiver pronto.
          <strong className="text-slate-800"> Nada de papel, nada de confusão.</strong>
        </p>

        <div className="flex flex-wrap gap-3 mb-16">
          <button
            id="btn-abrir-painel-hero"
            onClick={() => navigate("/painel")}
            className="shimmer-cta inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-indigo-200 text-base"
          >
            Abrir o painel
            <ArrowRight className="w-4 h-4" />
          </button>
          <a
            href="https://github.com/gpiantamar/passa_facil"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-slate-200 bg-white text-slate-700 font-semibold px-7 py-3.5 rounded-xl hover:bg-slate-50 text-base"
          >
            Código no GitHub
          </a>
        </div>

        {/* Social Proof */}
        <div className="flex flex-wrap gap-8 mb-16 pt-4 border-t border-slate-100">
          <AnimatedStat value={240} label="Pedidos processados" />
          <AnimatedStat value={48} label="Clientes cadastrados" />
          <AnimatedStat value={99} label="% uptime" />
        </div>

        {/* ── KANBAN PREVIEW REALISTA ── */}
        <div className="overflow-x-auto -mx-5 px-5">
          <div className="grid grid-cols-4 gap-2.5 min-w-[640px]">
            {KANBAN_PREVIEW.map((col) => (
              <div
                key={col.stage}
                className={`rounded-2xl border ${col.border} ${col.bg} p-3 flex flex-col gap-2`}
              >
                {/* Cabeçalho coluna */}
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-2 h-2 rounded-full ${col.dot} flex-shrink-0`} />
                  <span className={`text-xs font-bold ${col.headerColor}`}>{col.stage}</span>
                  <span className="ml-auto text-[10px] font-bold text-slate-400 bg-white/80 px-1.5 py-0.5 rounded-full">
                    {col.cards.length}
                  </span>
                </div>

                {/* Cards mockados realistas */}
                {col.cards.map((card) => (
                  <div
                    key={card.code}
                    className="bg-white rounded-xl border border-slate-100 shadow-sm p-2.5 flex flex-col gap-1.5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-mono text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                        {card.code}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-800 leading-tight">{card.client}</p>
                    <p className="text-[10px] text-slate-400">{card.pieces}</p>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-50">
                      <span className="text-[10px] text-slate-400">Valor</span>
                      <span className="text-xs font-extrabold text-slate-900">{card.value}</span>
                    </div>

                    {col.stage === "Pronto" && (
                      <div className="flex items-center gap-1 bg-emerald-500 rounded-lg px-2 py-1 mt-0.5">
                        <MessageCircle className="w-2.5 h-2.5 text-white flex-shrink-0" />
                        <span className="text-[9px] font-bold text-white">Avisar WhatsApp</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FUNCIONALIDADES ── */}
      <section id="funcionalidades" className="border-t border-slate-100 bg-slate-50">
        <div className="max-w-5xl mx-auto px-5 py-20">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-600 text-xs font-bold px-3 py-1.5 rounded-full border border-indigo-100 mb-4">
              <Star className="w-3 h-3" />
              FUNCIONALIDADES
            </span>
            <h2 className="text-3xl font-black text-slate-900 mb-3">O que o sistema faz</h2>
            <p className="text-slate-500 text-base max-w-md mx-auto">
              Simples, direto ao ponto. Só o que uma passadoria precisa.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col gap-3"
                >
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${feat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1.5">{feat.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── OPEN SOURCE ── */}
      <section className="border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-5 py-20">
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-10 text-white">
            {/* Decoração de fundo */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <span className="flex items-center gap-1.5 bg-white/10 border border-white/15 text-slate-300 text-xs font-semibold px-3 py-1.5 rounded-full">
                  Open Source · MIT License
                </span>
              </div>
              <h2 className="text-3xl font-black mb-3">Código aberto e sem complicação</h2>
              <p className="text-slate-400 leading-relaxed mb-8 max-w-xl text-base">
                Esse projeto é público no GitHub. Se você tiver uma situação parecida — ou quiser adaptar
                para qualquer outro tipo de serviço — fique à vontade para clonar, modificar e usar.
                <strong className="text-slate-300"> Sem precisar pedir permissão.</strong>
              </p>
              <div className="flex flex-wrap gap-3 text-sm">
                <div className="bg-white/8 hover:bg-white/12 rounded-xl px-4 py-2.5 font-mono text-slate-300 text-xs border border-white/10 select-all cursor-text transition-colors">
                  git clone https://github.com/gpiantamar/passa_facil
                </div>
                <a
                  href="https://github.com/gpiantamar/passa_facil"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shimmer-cta inline-flex items-center gap-2 bg-white text-slate-900 font-bold px-5 py-2.5 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  Ver repositório →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMO FUNCIONA ── */}
      <section id="como-funciona" className="border-t border-slate-100 bg-slate-50">
        <div className="max-w-5xl mx-auto px-5 py-20">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-100 mb-4">
              <CheckCircle2 className="w-3 h-3" />
              FLUXO OPERACIONAL
            </span>
            <h2 className="text-3xl font-black text-slate-900 mb-3">Como ela usa no dia a dia</h2>
            <p className="text-slate-500 text-base">Três passos simples que fazem toda a diferença.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                num: "01",
                icon: Clock,
                title: "Cliente traz as roupas",
                desc: "Seleciona o cliente no sistema (ou cadastra um novo) e registra as peças que chegaram com os valores calculados automaticamente.",
                color: "from-blue-500 to-blue-600",
                bg: "bg-blue-50",
              },
              {
                num: "02",
                icon: Sparkles,
                title: "Vai passando conforme o dia",
                desc: "Avança o status de cada pedido no quadro Kanban. Fica fácil visualizar o que ainda está pendente em tempo real.",
                color: "from-amber-500 to-amber-600",
                bg: "bg-amber-50",
              },
              {
                num: "03",
                icon: Truck,
                title: "Avisa e entrega",
                desc: "Quando termina, um clique gera o aviso no WhatsApp. O cliente já sabe que pode buscar as roupas.",
                color: "from-emerald-500 to-emerald-600",
                bg: "bg-emerald-50",
              },
            ].map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.num} className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-md transition-shadow">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-5 shadow-sm`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-4xl font-black text-slate-100 block mb-2 leading-none">{step.num}</span>
                  <h3 className="font-bold text-slate-900 mb-2 text-base">{step.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TABELA DE PREÇOS ── */}
      <section id="precos" className="border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-5 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900 mb-3">Tabela de referência</h2>
            <p className="text-slate-500 text-base">
              Preços que a minha mãe usa. Você pode alterar tudo no painel de configurações.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm max-w-2xl mx-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left py-3.5 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Peça</th>
                  <th className="text-left py-3.5 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Prazo</th>
                  <th className="text-right py-3.5 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Valor</th>
                </tr>
              </thead>
              <tbody>
                {PRECO_TABLE.map((item, i) => (
                  <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-5">
                      <span className="text-slate-800 font-medium">{item.peca}</span>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        {item.prazo}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right font-extrabold text-slate-900">{item.preco}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-100 bg-slate-50">
        <div className="max-w-5xl mx-auto px-5 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center">
              <Wind className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-slate-700">PassaFácil</span>
            <span className="text-slate-300">·</span>
            <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
            <span>Feito com carinho pelo filho</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/gpiantamar/passa_facil"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-400 hover:text-slate-700 font-medium"
            >
              GitHub
            </a>
            <span className="text-xs text-slate-300">·</span>
            <span className="text-xs text-slate-400 font-medium">MIT License</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Wind,
  ArrowRight,
  Shirt,
  CheckCircle2,
  MessageCircle,
  Clock,
  BarChart3,
  Sparkles,
  Truck,
  Zap,
  Star,
  ShieldCheck,
  TrendingUp,
  Users,
  Check,
  ChevronDown,
  Award,
  DollarSign,
  Flame,
  Sliders,
  PhoneCall,
  HelpCircle,
} from "lucide-react";
import { DarkModeToggle } from "../../components/ui/DarkModeToggle";

// Tabela de Preços e Catálogo de Peças
const PRECO_TABLE = [
  { peca: "Camisa social / linho", prazo: "24h", preco: "R$ 7,50", cat: "Mais Pedido" },
  { peca: "Calça jeans / sarja", prazo: "24h", preco: "R$ 8,00", cat: "Popular" },
  { peca: "Camiseta básica / polo", prazo: "24h", preco: "R$ 5,00", cat: "Básico" },
  { peca: "Vestido simples / midi", prazo: "48h", preco: "R$ 14,00", cat: "Feminino" },
  { peca: "Vestido de festa / fino", prazo: "48h", preco: "R$ 22,00", cat: "Especial" },
  { peca: "Lençol / colcha casal", prazo: "48h", preco: "R$ 16,00", cat: "Cama & Banho" },
];

// Benefícios comerciais
const BENEFITS = [
  {
    icon: TrendingUp,
    title: "+40% de Faturamento",
    desc: "Aumente a rotatividade de peças sem aumentar sua carga de trabalho diária.",
    color: "from-emerald-500 to-teal-600",
    shadow: "shadow-emerald-500/10",
  },
  {
    icon: ShieldCheck,
    title: "Zero Roupas Perdidas",
    desc: "Comanda com numeração única, cliente vinculado e detalhamento de cada item.",
    color: "from-indigo-500 to-blue-600",
    shadow: "shadow-indigo-500/10",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp em 1 Clique",
    desc: "Aviso de roupa pronta com link personalizado. Chega de digitar mensagens manuais.",
    color: "from-green-500 to-emerald-600",
    shadow: "shadow-green-500/10",
  },
  {
    icon: BarChart3,
    title: "Gestão Financeira Clara",
    desc: "Saiba exatamente quanto faturou no dia, na semana e no mês em tempo real.",
    color: "from-violet-500 to-purple-600",
    shadow: "shadow-violet-500/10",
  },
];

// Recursos do sistema
const FEATURES = [
  {
    icon: Sparkles,
    badge: "Agilidade",
    title: "Kanban Operacional Inteligente",
    desc: "Quadro visual com 4 fases: Recebido → Passando → Pronto → Entregue. Arraste ou avance com 1 clique.",
    color: "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/50",
  },
  {
    icon: MessageCircle,
    badge: "Fidelização",
    title: "Disparo Automático no WhatsApp",
    desc: "Quando o pedido fica pronto, o sistema gera uma mensagem profissional personalizada pronta para envio.",
    color: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50",
  },
  {
    icon: Zap,
    badge: "Sem Erros",
    title: "Comanda Digital em Segundos",
    desc: "Selecione o cliente, adicione as peças e o valor total com prazos é calculado instantaneamente.",
    color: "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/50",
  },
  {
    icon: Users,
    badge: "CRM Integrado",
    title: "Cadastro & Histórico de Clientes",
    desc: "Telefone, endereço, preferências e histórico de todos os pedidos já feitos por cada cliente.",
    color: "bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 border-sky-100 dark:border-sky-900/50",
  },
  {
    icon: Shirt,
    badge: "Personalizável",
    title: "Tabela de Serviços Flexível",
    desc: "Cadastre seus próprios valores por peça, tipo de tecido ou unidade. Atualize sempre que precisar.",
    color: "bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 border-violet-100 dark:border-violet-900/50",
  },
  {
    icon: Clock,
    badge: "Controle",
    title: "Alertas de Prazos e Entregas",
    desc: "Destaque visual em vermelho para peças que estão com prazo apertado ou vencendo hoje.",
    color: "bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/50",
  },
];

interface KanbanCard {
  client: string;
  code: string;
  pieces: string;
  value: string;
  time: string;
  notify?: boolean;
}

interface KanbanColumn {
  stage: string;
  tag: string;
  dot: string;
  bg: string;
  border: string;
  headerColor: string;
  cards: KanbanCard[];
}

// Kanban Preview Realista
const KANBAN_PREVIEW: KanbanColumn[] = [
  {
    stage: "Recebido",
    tag: "Fila de Espera",
    dot: "bg-blue-500",
    bg: "bg-blue-50/60 dark:bg-blue-950/20",
    border: "border-blue-100 dark:border-blue-900/30",
    headerColor: "text-blue-700 dark:text-blue-300",
    cards: [
      { client: "Dra. Beatriz Lima", code: "PF-108", pieces: "4 camisas sociais", value: "R$ 30,00", time: "Hoje 10:30" },
      { client: "Rodrigo Carvalho", code: "PF-109", pieces: "3 calças jeans", value: "R$ 24,00", time: "Hoje 11:15" },
    ],
  },
  {
    stage: "Passando",
    tag: "Na Prancha",
    dot: "bg-amber-500",
    bg: "bg-amber-50/60 dark:bg-amber-950/20",
    border: "border-amber-100 dark:border-amber-900/30",
    headerColor: "text-amber-700 dark:text-amber-300",
    cards: [
      { client: "Mariana Souza", code: "PF-106", pieces: "2 vestidos finos", value: "R$ 44,00", time: "Prazo: 16h" },
    ],
  },
  {
    stage: "Pronto",
    tag: "Avisar Cliente",
    dot: "bg-emerald-500",
    bg: "bg-emerald-50/60 dark:bg-emerald-950/20",
    border: "border-emerald-100 dark:border-emerald-900/30",
    headerColor: "text-emerald-700 dark:text-emerald-300",
    cards: [
      { client: "Carlos Eduardo", code: "PF-104", pieces: "6 camisas polo", value: "R$ 30,00", time: "Pronto às 14h", notify: true },
    ],
  },
  {
    stage: "Entregue",
    tag: "Concluído & Pago",
    dot: "bg-slate-400",
    bg: "bg-slate-50/60 dark:bg-slate-900/30",
    border: "border-slate-100 dark:border-slate-800",
    headerColor: "text-slate-700 dark:text-slate-300",
    cards: [
      { client: "Lúcia Albuquerque", code: "PF-102", pieces: "5 peças variadas", value: "R$ 42,50", time: "Entregue hoje" },
      { client: "Pedro Henrique", code: "PF-101", pieces: "3 lençóis casal", value: "R$ 48,00", time: "Entregue hoje" },
    ],
  },
];

// Planos Comerciais
const PLANS = [
  {
    id: "autonomo",
    name: "Autônomo",
    badge: "Para Começar",
    desc: "Ideal para quem trabalha em casa ou tem volume inicial de atendimento.",
    priceMonthly: 49,
    priceYearly: 39,
    features: [
      "Até 300 peças cadastradas/mês",
      "1 usuário operador",
      "Comanda digital instantânea",
      "Avisos automáticos via WhatsApp",
      "Tabela de preços personalizada",
      "Suporte via e-mail e chat",
    ],
    popular: false,
    cta: "Começar Teste Grátis",
  },
  {
    id: "pro",
    name: "Profissional",
    badge: "Mais Escolhido",
    desc: "A solução completa para passadorias estabelecidas que querem dobrar a escala.",
    priceMonthly: 89,
    priceYearly: 69,
    features: [
      "Peças e pedidos ILIMITADOS",
      "Até 3 usuários simultâneos",
      "Quadro Kanban avançado",
      "WhatsApp com 1 clique sem digitação",
      "Relatórios de faturamento e lucros",
      "Alertas automáticos de prazo de entrega",
      "Suporte prioritário via WhatsApp VIP",
    ],
    popular: true,
    cta: "Garantir Plano Pro",
  },
  {
    id: "enterprise",
    name: "Empresarial / Redes",
    badge: "Escala Máxima",
    desc: "Para lavanderias express, franquias ou redes com múltiplos pontos de entrega.",
    priceMonthly: 149,
    priceYearly: 119,
    features: [
      "Tudo do plano Profissional",
      "Usuários e operadores ILIMITADOS",
      "Gestão de múltiplos pontos de coleta",
      "Controle de entregadores e rotas",
      "Exportação de dados para contabilidade",
      "Onboarding VIP personalizado por vídeo",
      "Gerente de conta dedicado",
    ],
    popular: false,
    cta: "Falar com Consultor",
  },
];

// Depoimentos
const TESTIMONIALS = [
  {
    name: "Neide Aparecida",
    role: "Proprietária da Passadoria da Neide",
    city: "São Paulo, SP",
    avatar: "N",
    avatarBg: "from-pink-500 to-rose-600",
    stars: 5,
    text: "Antes eu ficava até tarde conferindo caderno e respondendo clientes no WhatsApp. Com o PassaFácil, clico em um botão e o cliente já recebe a mensagem que a roupa está pronta. Reduzi o tempo gasto pela metade!",
  },
  {
    name: "Marcos Vinicius",
    role: "Gerente da Express Lavanderia & Passa",
    city: "Rio de Janeiro, RJ",
    avatar: "M",
    avatarBg: "from-blue-500 to-indigo-600",
    stars: 5,
    text: "Acabaram as reclamações de peças trocadas. O código em cada pedido e a comanda digital deixaram a oficina 100% organizada. O sistema se pagou logo na primeira semana de uso.",
  },
  {
    name: "Cláudia Mendonça",
    role: "Fundadora da Ateliê das Roupas",
    city: "Belo Horizonte, MG",
    avatar: "C",
    avatarBg: "from-violet-500 to-purple-600",
    stars: 5,
    text: "Meus clientes elogiam muito o profissionalismo. Eles acham que contratei uma equipe de tecnologia, mas é só o PassaFácil rodando no meu tablet! Super fácil e direto.",
  },
];

// FAQ
const FAQS = [
  {
    q: "Preciso instalar algum programa no computador?",
    a: "Não! O PassaFácil funciona 100% online direto pelo navegador. Você pode acessar do computador, notebook, tablet ou celular, onde e quando quiser.",
  },
  {
    q: "Como funciona o aviso no WhatsApp?",
    a: "Quando você marca o pedido como 'Pronto' no quadro, o sistema gera na hora o link do WhatsApp com mensagem formatada contendo o nome do cliente, código do pedido e valor total. Você só clica e envia, sem precisar digitar nada.",
  },
  {
    q: "Posso testar antes de assinar?",
    a: "Sim! Você tem 14 dias de teste gratuito sem compromisso e sem precisar cadastrar cartão de crédito para experimentar todas as ferramentas.",
  },
  {
    q: "Consigo cadastrar os meus próprios preços?",
    a: "Sim, a tabela é 100% personalizável. Você pode colocar o valor que cobra por camisa, calça, vestido, roupa por quilo ou qualquer outro item que atenda.",
  },
  {
    q: "Existe fidelidade ou multa de cancelamento?",
    a: "Zero fidelidade. Você pode cancelar sua assinatura a qualquer momento com apenas 1 clique, sem burocracia ou multas contratuais.",
  },
  {
    q: "Vocês ajudam a configurar se eu tiver dúvidas?",
    a: "Com certeza! Temos suporte humanizado e ágil pronto para te ajudar no WhatsApp para tirar dúvidas e cadastrar seus primeiros serviços.",
  },
];

// Hook de Contador Animado
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

function AnimatedStat({ value, label, suffix = "+" }: { value: number; label: string; suffix?: string }) {
  const ref = useCountUp(value);
  return (
    <div className="text-center">
      <p className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
        <span ref={ref}>0</span>
        <span className="text-indigo-600 dark:text-indigo-400">{suffix}</span>
      </p>
      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">{label}</p>
    </div>
  );
}

export function LandingPage() {
  const navigate = useNavigate();
  const [isYearly, setIsYearly] = useState(false);
  const [piecesPerDay, setPiecesPerDay] = useState(40);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Cálculos de ROI da calculadora
  const hoursSavedMonth = Math.round((piecesPerDay * 25 * 3) / 60); // 3 min economizados por peça em gestão
  const revenueEstimate = piecesPerDay * 25 * 8.5; // Média R$ 8,50 por peça em 25 dias úteis

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── TOP ANNOUNCEMENT BANNER ── */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-600 text-white text-xs font-semibold py-2 px-4 text-center flex items-center justify-center gap-2">
        <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold">Oferta Especial</span>
        <span>Comece hoje com 14 dias de teste grátis. Transforme a gestão da sua passadoria em minutos!</span>
      </div>

      {/* ── NAVBAR ── */}
      <header className="sticky top-0 z-40 glass border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Wind className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight leading-none">PassaFácil</span>
              <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold tracking-wider uppercase">Software para Passadorias</span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            {[
              { href: "#beneficios", label: "Benefícios" },
              { href: "#demonstracao", label: "Demonstração" },
              { href: "#recursos", label: "Recursos" },
              { href: "#calculadora", label: "Calculadora ROI" },
              { href: "#planos", label: "Planos & Preços" },
              { href: "#depoimentos", label: "Depoimentos" },
              { href: "#faq", label: "Dúvidas" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 text-sm text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <DarkModeToggle />
            <button
              id="btn-login-nav"
              onClick={() => navigate("/painel")}
              className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Entrar
            </button>
            <button
              id="btn-experimentar-nav"
              onClick={() => navigate("/painel")}
              className="shimmer-cta text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl shadow-md shadow-indigo-500/20 transition-all hover:shadow-indigo-500/30 flex items-center gap-1.5"
            >
              <span>Testar Grátis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO SECTION ── */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-500/10 dark:bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-violet-500/10 dark:bg-violet-500/15 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto px-5 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold px-3.5 py-1.5 rounded-full mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Plataforma #1 Especializada em Passadorias e Lavanderias</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-[1.08] tracking-tight mb-6">
              Multiplique o faturamento da sua passadoria e{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 bg-clip-text text-transparent">
                elimine o papel para sempre.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
              A plataforma tudo-em-um para organizar comandas, prazos de entrega e avisar clientes pelo WhatsApp com apenas 1 clique.
              <strong className="text-slate-800 dark:text-slate-100"> Zero roupas perdidas, zero confusão.</strong>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-10">
              <button
                id="btn-hero-comecar"
                onClick={() => navigate("/painel")}
                className="shimmer-cta w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-4 rounded-xl shadow-xl shadow-indigo-500/25 text-base transition-all hover:scale-[1.02]"
              >
                <span>Experimentar Grátis por 14 Dias</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#demonstracao"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-semibold px-7 py-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 text-base transition-colors"
              >
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span>Ver Demonstração</span>
              </a>
            </div>

            {/* Micro Trust Points */}
            <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-500" /> Sem necessidade de cartão
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-500" /> Setup em 2 minutos
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-500" /> Funciona no celular e computador
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-500" /> Cancele quando quiser
              </span>
            </div>
          </div>

          {/* Social Proof Numbers */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 py-8 px-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 max-w-4xl mx-auto shadow-sm">
            <AnimatedStat value={180} label="Mil peças processadas" suffix="k+" />
            <AnimatedStat value={45} label="Ganho em produtividade" suffix="%" />
            <AnimatedStat value={100} label="Zero peças perdidas" suffix="%" />
            <AnimatedStat value={99} label="Clientes satisfeitos" suffix=".8%" />
          </div>
        </div>
      </section>

      {/* ── KANBAN PREVIEW REALISTA (DEMO AO VIVO) ── */}
      <section id="demonstracao" className="py-16 bg-slate-50/70 dark:bg-slate-900/30 border-y border-slate-100 dark:border-slate-800/80">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-xs font-bold px-3 py-1.5 rounded-full border border-indigo-100 dark:border-indigo-900/50 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              FLUXO OPERACIONAL AO VIVO
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
              Controle visual que sua equipe domina no 1º dia
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              Saiba exatamente quais roupas estão esperando, quais estão na prancha e quais já podem ser entregues.
            </p>
          </div>

          {/* Mock Kanban Container */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-4 sm:p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 ml-2 font-mono">painel.passafacil.com</span>
              </div>
              <button
                onClick={() => navigate("/painel")}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                Abrir painel interativo <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="overflow-x-auto pb-2">
              <div className="grid grid-cols-4 gap-3 min-w-[760px]">
                {KANBAN_PREVIEW.map((col) => (
                  <div
                    key={col.stage}
                    className={`rounded-2xl border ${col.border} ${col.bg} p-3.5 flex flex-col gap-2.5`}
                  >
                    {/* Header Coluna */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${col.dot} shadow-sm`} />
                        <span className={`text-xs font-extrabold ${col.headerColor}`}>{col.stage}</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-full shadow-xs">
                        {col.cards.length}
                      </span>
                    </div>

                    {/* Cards */}
                    {col.cards.map((card) => (
                      <div
                        key={card.code}
                        className="bg-white dark:bg-slate-800/90 rounded-xl border border-slate-100 dark:border-slate-700/60 shadow-xs p-3 flex flex-col gap-2 hover:shadow-md transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
                            {card.code}
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                            {card.time}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{card.client}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">{card.pieces}</p>
                        </div>
                        <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 dark:border-slate-700/50">
                          <span className="text-[10px] text-slate-400 font-medium">Total</span>
                          <span className="text-xs font-black text-slate-900 dark:text-white">{card.value}</span>
                        </div>

                        {card.notify && (
                          <div className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg py-1.5 px-2 mt-1 cursor-pointer transition-colors shadow-sm">
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-extrabold">Avisar WhatsApp</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BENEFÍCIOS & ROI (ANTES vs DEPOIS) ── */}
      <section id="beneficios" className="py-20">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-900/50 mb-3">
              <Award className="w-3.5 h-3.5" />
              RESULTADOS COMPROVADOS
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
              Por que donos de passadorias trocam o caderno pelo PassaFácil?
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              Veja a transformação imediata na rotina da sua oficina ou lavanderia:
            </p>
          </div>

          {/* Comparativo Antes vs Depois */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
            {/* Antes */}
            <div className="rounded-3xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/40 dark:bg-rose-950/10 p-7 flex flex-col gap-4">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-extrabold text-sm uppercase tracking-wide">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                Sem o PassaFácil (Caderno / Papel)
              </div>
              <ul className="space-y-3.5 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Peças misturadas ou esquecidas em cabides sem etiqueta</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Horas perdidas digitando mensagens manuais no WhatsApp de cada cliente</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Clientes ligando a todo momento perguntando se as roupas já estão prontas</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Fim do mês sem saber quanto realmente faturou ou quem ainda está devendo</span>
                </li>
              </ul>
            </div>

            {/* Depois */}
            <div className="rounded-3xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/15 p-7 flex flex-col gap-4 shadow-md">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-extrabold text-sm uppercase tracking-wide">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Com o PassaFácil no seu Negócio
              </div>
              <ul className="space-y-3.5 text-sm text-slate-700 dark:text-slate-200 font-medium">
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Cada lote recebe comanda com código único, cliente e lista de peças</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>1 clique gera o link direto de WhatsApp com a mensagem pronta de entrega</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Prazos cumpridos rigorosamente com alertas visuais de pedidos atrasados</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Métricas de faturamento em tempo real no painel administrativo</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Cards de Benefícios */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {BENEFITS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col gap-3"
                >
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-md ${item.shadow}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CALCULADORA DE ROI INTERATIVA ── */}
      <section id="calculadora" className="py-16 bg-slate-50/70 dark:bg-slate-900/40 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-5">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-8 sm:p-12">
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-xs font-bold px-3 py-1.5 rounded-full mb-3">
                <Sliders className="w-3.5 h-3.5" />
                SIMULE SUA ECONOMIA
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-2">
                Quanto tempo e dinheiro o PassaFácil vai te poupar?
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Arraste a barra para indicar sua média de peças passadas por dia:
              </p>
            </div>

            {/* Slider interativo */}
            <div className="mb-10 max-w-xl mx-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Volume diário</span>
                <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">{piecesPerDay} peças / dia</span>
              </div>
              <input
                type="range"
                min="10"
                max="250"
                step="5"
                value={piecesPerDay}
                onChange={(e) => setPiecesPerDay(Number(e.target.value))}
                className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1.5">
                <span>10 peças (início)</span>
                <span>120 peças (médio)</span>
                <span>250 peças (alta demanda)</span>
              </div>
            </div>

            {/* Resultados do cálculo */}
            <div className="grid sm:grid-cols-2 gap-4 max-w-xl mx-auto mb-8">
              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-5 text-center border border-slate-100 dark:border-slate-700/60">
                <Clock className="w-6 h-6 text-indigo-500 mx-auto mb-2" />
                <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">~{hoursSavedMonth} horas</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">economizadas em papel e mensagens todo mês</p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-5 text-center border border-slate-100 dark:border-slate-700/60">
                <DollarSign className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                  R$ {revenueEstimate.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">potencial estimado de faturamento mensal</p>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => navigate("/painel")}
                className="shimmer-cta inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-indigo-500/25 text-sm transition-all"
              >
                <span>Garantir minha economia no teste grátis</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── RECURSOS PRINCIPAIS (FEATURES GRID) ── */}
      <section id="recursos" className="py-20">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-xs font-bold px-3 py-1.5 rounded-full border border-indigo-100 dark:border-indigo-900/50 mb-3">
              <Zap className="w-3.5 h-3.5" />
              TECNOLOGIA SIMPLES E PODEROSA
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
              Tudo o que sua passadoria precisa em um só lugar
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              Desenvolvido ouvindo quem passa roupa de verdade. Sem botões complicados ou funções inúteis.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col gap-3.5"
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${feat.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {feat.badge}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base mb-1.5">{feat.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PLANOS & PREÇOS ── */}
      <section id="planos" className="py-20 bg-slate-50/80 dark:bg-slate-900/40 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-xs font-bold px-3 py-1.5 rounded-full border border-indigo-100 dark:border-indigo-900/50 mb-3">
              <DollarSign className="w-3.5 h-3.5" />
              PLANOS TRANSPARENTES
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
              Investimento que se paga logo no primeiro dia
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mb-8">
              Escolha o plano que melhor atende o momento da sua passadoria. Cancele quando quiser.
            </p>

            {/* Toggle Mensal / Anual */}
            <div className="inline-flex items-center gap-3 bg-white dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
              <button
                type="button"
                onClick={() => setIsYearly(false)}
                className={`text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                  !isYearly
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
                }`}
              >
                Mensal
              </button>
              <button
                type="button"
                onClick={() => setIsYearly(true)}
                className={`text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                  isYearly
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
                }`}
              >
                <span>Anual</span>
                <span className="bg-emerald-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-extrabold uppercase">
                  Economize 20%
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PLANS.map((plan) => {
              const price = isYearly ? plan.priceYearly : plan.priceMonthly;
              return (
                <div
                  key={plan.id}
                  className={`relative rounded-3xl bg-white dark:bg-slate-900 p-7 flex flex-col justify-between transition-all duration-200 ${
                    plan.popular
                      ? "border-2 border-indigo-600 dark:border-indigo-500 shadow-xl shadow-indigo-500/10 scale-105 z-10"
                      : "border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-[11px] font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                      {plan.badge}
                    </div>
                  )}

                  <div>
                    <div className="mb-4">
                      <h3 className="text-xl font-black text-slate-900 dark:text-white">{plan.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{plan.desc}</p>
                    </div>

                    <div className="flex items-baseline gap-1 my-6">
                      <span className="text-xs font-bold text-slate-400">R$</span>
                      <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{price}</span>
                      <span className="text-xs text-slate-400 font-medium">/ mês</span>
                      {isYearly && (
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold ml-1">
                          (faturado anualmente)
                        </span>
                      )}
                    </div>

                    <ul className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                      {plan.features.map((feat) => (
                        <li key={feat} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => navigate("/painel")}
                      className={`w-full py-3.5 px-4 rounded-xl font-extrabold text-sm transition-all ${
                        plan.popular
                          ? "shimmer-cta bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/25"
                          : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white"
                      }`}
                    >
                      {plan.cta} →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Garantia incondicional */}
          <div className="mt-12 text-center max-w-md mx-auto flex items-center justify-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-5 h-5 text-emerald-500 flex-shrink-0" />
            <span>Garantia de 7 dias ou seu dinheiro de volta. Sem burocracia.</span>
          </div>
        </div>
      </section>

      {/* ── TABELA DE PREÇOS E SERVIÇOS ── */}
      <section id="catalogo" className="py-20">
        <div className="max-w-4xl mx-auto px-5">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-1.5 bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 text-xs font-bold px-3 py-1.5 rounded-full mb-3">
              <Shirt className="w-3.5 h-3.5" />
              CATÁLOGO DE EXEMPLO
            </span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
              Tabela de serviços e prazos no sistema
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Tudo configurável. No seu painel você altera os nomes, valores e prazos em poucos segundos.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
                  <th className="text-left py-3.5 px-5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Peça / Serviço</th>
                  <th className="text-left py-3.5 px-5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden sm:table-cell">Categoria</th>
                  <th className="text-left py-3.5 px-5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Prazo</th>
                  <th className="text-right py-3.5 px-5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Valor Sugerido</th>
                </tr>
              </thead>
              <tbody>
                {PRECO_TABLE.map((item, i) => (
                  <tr key={i} className="border-b border-slate-100 dark:border-slate-800/60 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-5 font-medium text-slate-800 dark:text-slate-200">{item.peca}</td>
                    <td className="py-3.5 px-5 hidden sm:table-cell">
                      <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-full">
                        {item.cat}
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">
                        {item.prazo}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right font-black text-slate-900 dark:text-white">{item.preco}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── DEPOIMENTOS DE CLIENTES ── */}
      <section id="depoimentos" className="py-20 bg-slate-50/70 dark:bg-slate-900/40 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 text-xs font-bold px-3 py-1.5 rounded-full border border-amber-100 dark:border-amber-900/50 mb-3">
              <Star className="w-3.5 h-3.5" />
              QUEM USA APROVA
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
              O que dizem os donos de passadorias
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              Pessoas reais transformando seus negócios com o PassaFácil todos os dias.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 sm:p-7 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.stars)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic mb-6">
                    "{t.text}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.avatarBg} text-white font-black text-sm flex items-center justify-center flex-shrink-0 shadow-sm`}>
                    {t.avatar}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">{t.name}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{t.role} · {t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ (PERGUNTAS FREQUENTES) ── */}
      <section id="faq" className="py-20">
        <div className="max-w-4xl mx-auto px-5">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-xs font-bold px-3 py-1.5 rounded-full mb-3">
              <HelpCircle className="w-3.5 h-3.5" />
              TIRA DÚVIDAS
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
              Perguntas Frequentes
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Tudo o que você precisa saber antes de começar seu teste gratuito.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={faq.q}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full text-left p-5 font-extrabold text-slate-800 dark:text-slate-100 flex items-center justify-between gap-4 text-sm sm:text-base hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 flex-shrink-0 ${
                        isOpen ? "rotate-180 text-indigo-600" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA SECTION ── */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-5 text-center relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center mx-auto mb-6">
            <Flame className="w-6 h-6 text-indigo-400" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-6 leading-tight">
            Pronto para profissionalizar sua passadoria e dobrar sua produtividade?
          </h2>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Junte-se a dezenas de passadorias e lavanderias que economizam horas todos os dias com o PassaFácil.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <button
              id="btn-final-cta"
              onClick={() => navigate("/painel")}
              className="shimmer-cta w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold px-8 py-4 rounded-xl shadow-xl shadow-indigo-600/30 text-base transition-all hover:scale-105"
            >
              <span>Criar Minha Conta Grátis Agora</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="https://wa.me/5511999999999?text=Olá! Gostaria de saber mais sobre o PassaFácil para minha passadoria"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold px-7 py-4 rounded-xl text-base transition-colors"
            >
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              <span>Falar com Consultor no WhatsApp</span>
            </a>
          </div>

          <p className="text-xs text-slate-400">
            14 dias de teste grátis · Sem cartão de crédito · Ativação imediata
          </p>
        </div>
      </section>

      {/* ── FOOTER COMERCIAL ── */}
      <footer className="border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 py-12">
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center">
                <Wind className="w-4 h-4 text-white" />
              </div>
              <span className="font-black text-slate-900 dark:text-white text-lg tracking-tight">PassaFácil</span>
              <span className="text-xs text-slate-400">· Plataforma de Gestão</span>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
              <a href="#beneficios" className="hover:text-indigo-600 transition-colors">Benefícios</a>
              <a href="#demonstracao" className="hover:text-indigo-600 transition-colors">Demonstração</a>
              <a href="#recursos" className="hover:text-indigo-600 transition-colors">Recursos</a>
              <a href="#planos" className="hover:text-indigo-600 transition-colors">Planos & Preços</a>
              <a href="#faq" className="hover:text-indigo-600 transition-colors">Suporte</a>
              <button onClick={() => navigate("/painel")} className="hover:text-indigo-600 font-bold transition-colors">Acessar Painel</button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs text-slate-400">
            <p>© {new Date().getFullYear()} PassaFácil Tecnologia. Todos os direitos reservados.</p>
            <div className="flex items-center gap-4">
              <span className="hover:underline cursor-pointer">Termos de Uso</span>
              <span>·</span>
              <span className="hover:underline cursor-pointer">Privacidade</span>
              <span>·</span>
              <span className="text-emerald-500 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Sistemas operacionais 100% online
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

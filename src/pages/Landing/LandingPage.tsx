import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Wind,
  ArrowRight,
  Users,
  ClipboardList,
  BarChart3,
  Shirt,
  Star,
  CheckCircle2,
  Zap,
  ShieldCheck,
} from "lucide-react";

// ─── Dados ────────────────────────────────────────────────────────────────────

const features = [
  {
    icon: Users,
    title: "Gestão de Clientes",
    desc: "Cadastre e acompanhe todos os seus clientes em um só lugar. Histórico completo de pedidos e contatos.",
    color: "from-violet-500 to-indigo-600",
    bg: "bg-violet-50",
    text: "text-violet-700",
  },
  {
    icon: ClipboardList,
    title: "Controle de Pedidos",
    desc: "Gerencie cada pedido do recebimento até a entrega. Nunca perca o status de uma peça.",
    color: "from-indigo-500 to-blue-600",
    bg: "bg-indigo-50",
    text: "text-indigo-700",
  },
  {
    icon: Shirt,
    title: "Catálogo de Serviços",
    desc: "Defina preços por peça ou por quilo. Atualize o catálogo a qualquer momento.",
    color: "from-sky-500 to-cyan-600",
    bg: "bg-sky-50",
    text: "text-sky-700",
  },
  {
    icon: BarChart3,
    title: "Relatórios e Insights",
    desc: "Visualize o faturamento, serviços mais populares e tendências do seu negócio.",
    color: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
  },
];

const stats = [
  { value: "100%", label: "Organizado" },
  { value: "0", label: "Papel" },
  { value: "24/7", label: "Disponível" },
  { value: "∞", label: "Pedidos" },
];

const testimonials = [
  {
    text: "Antes anotava tudo em papel e vivia perdendo pedido. Agora tudo fica registrado e sei exatamente o que está com cada cliente.",
    author: "Ana Paula",
    role: "Passadeira há 12 anos",
    initial: "A",
    color: "bg-violet-100 text-violet-700",
  },
  {
    text: "O sistema me ajudou a ver que estava cobrando barato em algumas peças. Aumentei o faturamento sem precisar de mais clientes.",
    author: "Márcia Oliveira",
    role: "Passadoria doméstica",
    initial: "M",
    color: "bg-indigo-100 text-indigo-700",
  },
  {
    text: "Minha mãe e eu usamos juntas. Consigo ver os pedidos dela do celular mesmo quando estou fora. Muito prático!",
    author: "Fernanda Costa",
    role: "Passadoria familiar",
    initial: "F",
    color: "bg-sky-100 text-sky-700",
  },
];

const perks = [
  "Sem limite de clientes",
  "Acesso pelo celular ou computador",
  "Dados sempre seguros",
  "Atualizações automáticas",
  "Sem mensalidade",
  "Interface simples e rápida",
];

// ─── Componente de Contador Animado ──────────────────────────────────────────

function AnimatedNumber({ value }: { value: string }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.5 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
    >
      {value}
    </div>
  );
}

// ─── Landing Page ─────────────────────────────────────────────────────────────

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm shadow-indigo-200">
              <Wind className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold text-slate-800">PassaFácil</span>
          </div>
          <button
            id="nav-entrar-btn"
            onClick={() => navigate("/entrar")}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-150 shadow-sm shadow-indigo-200 hover:shadow-indigo-300"
          >
            Entrar
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-24 px-5 overflow-hidden">
        {/* Background gradients */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-indigo-50/80 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-20 right-0 w-72 h-72 bg-violet-100/60 rounded-full blur-3xl" />
          <div className="absolute top-40 left-0 w-64 h-64 bg-sky-100/60 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-xs font-semibold px-3.5 py-1.5 rounded-full border border-indigo-100 mb-6">
            <Zap className="w-3.5 h-3.5" />
            Sistema completo para passadeiras
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight mb-6">
            Sua passadoria{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              organizada
            </span>
            <br />
            do jeito que merece
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Chega de papel, caderno e confusão. Gerencie clientes, pedidos e serviços em um sistema
            simples, rápido e feito para quem trabalha com passadoria.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              id="hero-entrar-btn"
              onClick={() => navigate("/entrar")}
              className="flex items-center gap-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-4 rounded-2xl text-base transition-all duration-200 shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 hover:-translate-y-0.5 active:translate-y-0"
            >
              Começar agora — é gratuito
              <ArrowRight className="w-4.5 h-4.5" />
            </button>
            <span className="text-sm text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Acesso seguro com senha
            </span>
          </div>
        </div>

        {/* App preview card */}
        <div className="relative max-w-3xl mx-auto mt-16">
          <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden">
            {/* Browser bar */}
            <div className="flex items-center gap-1.5 px-4 py-3 bg-slate-50 border-b border-slate-100">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
              <div className="flex-1 mx-3 h-5 bg-white border border-slate-200 rounded-lg flex items-center px-3">
                <span className="text-xs text-slate-400">passafacil.vercel.app</span>
              </div>
            </div>
            {/* Dashboard mockup */}
            <div className="p-5 bg-slate-50 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Pedidos Hoje", value: "12", color: "text-indigo-600", bg: "bg-indigo-50" },
                { label: "Prontos", value: "8", color: "text-emerald-600", bg: "bg-emerald-50" },
                { label: "Em Andamento", value: "4", color: "text-amber-600", bg: "bg-amber-50" },
                { label: "Clientes", value: "47", color: "text-violet-600", bg: "bg-violet-50" },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-sm">
                  <p className="text-xs text-slate-500 mb-1">{s.label}</p>
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>
            <div className="p-5 pt-0 bg-slate-50 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {["Maria Silva — 3 camisas", "João Costa — 2 lençóis", "Ana Lima — 1 calça"].map((item, i) => (
                <div key={i} className="bg-white rounded-xl px-4 py-3 border border-slate-100 shadow-sm flex items-center justify-between">
                  <span className="text-sm text-slate-700 font-medium">{item}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${i === 0 ? "bg-emerald-50 text-emerald-700" : i === 1 ? "bg-amber-50 text-amber-700" : "bg-indigo-50 text-indigo-700"}`}>
                    {i === 0 ? "Pronto" : i === 1 ? "Passando" : "Recebido"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-violet-600">
        <div className="max-w-4xl mx-auto px-5 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center text-white">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-4xl font-extrabold mb-1">
                <AnimatedNumber value={s.value} />
              </div>
              <p className="text-indigo-200 text-sm font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────────── */}
      <section className="py-24 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
              Tudo que sua passadoria precisa
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Simples o suficiente para usar no dia a dia, completo o suficiente para crescer.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="group bg-white border border-slate-100 rounded-3xl p-7 hover:shadow-xl hover:shadow-slate-100 hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-5 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  <f.icon className="w-5.5 h-5.5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PERKS ─────────────────────────────────────────────────────────── */}
      <section className="py-20 px-5 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 sm:p-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-900 mb-4">
                  Feito para quem{" "}
                  <span className="text-indigo-600">trabalha sério</span>
                </h2>
                <p className="text-slate-500 leading-relaxed mb-6">
                  Desenvolvido pensando na rotina real de uma passadoria. Sem complicação, sem custo, sem papel.
                </p>
                <button
                  id="perks-entrar-btn"
                  onClick={() => navigate("/entrar")}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all duration-150 shadow-sm shadow-indigo-200"
                >
                  Acessar o sistema
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-2.5">
                {perks.map((p) => (
                  <div key={p} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                    <span className="text-sm text-slate-700 font-medium">{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section className="py-24 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Quem usa, aprova
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <div
                key={t.author}
                className="bg-white border border-slate-100 rounded-3xl p-6 hover:shadow-lg hover:shadow-slate-100 transition-all duration-300"
              >
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full ${t.color} flex items-center justify-center font-bold text-sm flex-shrink-0`}>
                    {t.initial}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{t.author}</p>
                    <p className="text-xs text-slate-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────────────────────── */}
      <section className="py-24 px-5 bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-800 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-2xl mx-auto text-center text-white">
          <div className="w-16 h-16 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mx-auto mb-6">
            <Wind className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Pronto para organizar sua passadoria?
          </h2>
          <p className="text-indigo-200 text-lg mb-10 leading-relaxed">
            Acesse agora e comece a registrar seus pedidos. Simples assim.
          </p>
          <button
            id="final-entrar-btn"
            onClick={() => navigate("/entrar")}
            className="inline-flex items-center gap-2.5 bg-white text-indigo-700 font-bold px-8 py-4 rounded-2xl text-base hover:bg-indigo-50 transition-all duration-200 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0"
          >
            Entrar no sistema
            <ArrowRight className="w-4.5 h-4.5" />
          </button>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="py-8 px-5 border-t border-slate-100 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Wind className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-700">PassaFácil</span>
          </div>
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} PassaFácil — Gestão de passadoria simples e eficiente.
          </p>
        </div>
      </footer>
    </div>
  );
}

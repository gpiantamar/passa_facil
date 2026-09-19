import React from "react";
import { useNavigate } from "react-router-dom";
import { Wind, ArrowRight, Shirt, Github, Heart } from "lucide-react";

const PRECO_TABLE = [
  { peca: "Camisa social / linho", prazo: "24h", preco: "R$ 7,50" },
  { peca: "Calça jeans / alfaiataria", prazo: "24h", preco: "R$ 8,00" },
  { peca: "Camiseta básica / polo", prazo: "24h", preco: "R$ 5,00" },
  { peca: "Vestido simples / midi", prazo: "48h", preco: "R$ 14,00" },
  { peca: "Vestido de festa / tecido fino", prazo: "48h", preco: "R$ 22,00" },
  { peca: "Lençol / colcha casal", prazo: "48h", preco: "R$ 16,00" },
];

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-slate-900" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── NAV ── */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
              <Wind className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900">PassaFácil</span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/gpiantamar/passa_facil"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
            >
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
            <button
              id="btn-acessar-painel-nav"
              onClick={() => navigate("/painel")}
              className="text-sm font-semibold bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
            >
              Abrir painel →
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="max-w-4xl mx-auto px-5 pt-20 pb-24">
        {/* Badge projeto pessoal */}
        <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-100 text-rose-500 text-xs font-semibold px-3 py-1.5 rounded-full mb-8">
          <Heart className="w-3 h-3 fill-rose-400 text-rose-400" />
          Projeto pessoal — feito com carinho
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight mb-5">
          Um sisteminha que fiz<br />
          <span className="text-slate-400">pra ajudar minha mãe.</span>
        </h1>

        <p className="text-lg text-slate-600 leading-relaxed mb-4 max-w-2xl">
          Minha mãe tem uma passadoria em casa. Ela controlava tudo no papel —
          e vez ou outra perdia uma peça, esquecia de avisar o cliente ou se confundia com os valores.
          Aí decidi fazer isso.
        </p>
        <p className="text-lg text-slate-600 leading-relaxed mb-10 max-w-2xl">
          O <strong className="text-slate-800">PassaFácil</strong> é um sistema simples pra registrar as roupas que chegam,
          acompanhar o andamento e avisar pelo WhatsApp quando estiver pronto.
          Nada de papel, nada de confusão.
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            id="btn-abrir-painel-hero"
            onClick={() => navigate("/painel")}
            className="inline-flex items-center gap-2 bg-slate-900 text-white font-semibold px-6 py-3 rounded-xl hover:bg-slate-700 transition-colors"
          >
            Abrir o painel
            <ArrowRight className="w-4 h-4" />
          </button>
          <a
            href="https://github.com/gpiantamar/passa_facil"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-slate-200 text-slate-700 font-semibold px-6 py-3 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <Github className="w-4 h-4" />
            Código no GitHub
          </a>
        </div>

        {/* Mini kanban ilustrativo */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Recebido", count: 3, color: "bg-blue-50 border-blue-200", dot: "bg-blue-400" },
            { label: "Passando", count: 2, color: "bg-amber-50 border-amber-200", dot: "bg-amber-400" },
            { label: "Pronto", count: 1, color: "bg-green-50 border-green-200", dot: "bg-green-400" },
            { label: "Entregue", count: 5, color: "bg-slate-50 border-slate-200", dot: "bg-slate-400" },
          ].map((col) => (
            <div key={col.label} className={`rounded-xl border ${col.color} p-4`}>
              <div className="flex items-center gap-2 mb-3">
                <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                <span className="text-xs font-semibold text-slate-600">{col.label}</span>
              </div>
              {Array.from({ length: col.count > 2 ? 2 : col.count }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg border border-slate-100 p-2.5 mb-2 shadow-sm">
                  <div className="h-2 bg-slate-100 rounded mb-1.5 w-3/4" />
                  <div className="h-2 bg-slate-100 rounded w-1/2" />
                </div>
              ))}
              {col.count > 2 && (
                <p className="text-xs text-slate-400 text-center mt-1">+{col.count - 2} mais</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── FUNCIONALIDADES ── */}
      <section id="funcionalidades" className="border-t border-slate-100 bg-slate-50">
        <div className="max-w-4xl mx-auto px-5 py-20">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">O que o sistema faz</h2>
          <p className="text-slate-500 text-sm mb-12">Simples. Só o necessário.</p>
          <div className="grid sm:grid-cols-2 gap-8">
            {[
              {
                title: "Quadro de pedidos",
                desc: "Todos os pedidos em um quadro: Recebido → Passando → Pronto → Entregue. Muda o status com um clique.",
              },
              {
                title: "Aviso no WhatsApp",
                desc: "Quando a peça fica pronta, gera um link direto pro WhatsApp do cliente. Ela não precisa digitar nada.",
              },
              {
                title: "Comanda por peça",
                desc: "Seleciona o cliente, adiciona as peças e o valor é calculado automaticamente com base na tabela de preços.",
              },
              {
                title: "Histórico salvo",
                desc: "Todo pedido fica registrado. Dá pra consultar o histórico de qualquer cliente quando precisar.",
              },
              {
                title: "Tabela de preços",
                desc: "Os preços ficam cadastrados no sistema. Sem papel, sem precisar decorar o valor de cada peça.",
              },
              {
                title: "Resumo do dia",
                desc: "No final do dia, dá pra ver quantas peças foram passadas e quanto entrou. Básico, mas suficiente.",
              },
            ].map((feat) => (
              <div key={feat.title} className="flex gap-4">
                <div className="w-1 rounded-full bg-rose-200 flex-shrink-0 mt-1" style={{ minHeight: "100%" }} />
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">{feat.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OPEN SOURCE ── */}
      <section className="border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-5 py-20">
          <div className="bg-slate-900 rounded-2xl p-10 text-white">
            <div className="flex items-center gap-2 mb-4">
              <Github className="w-5 h-5 text-slate-300" />
              <span className="text-slate-300 text-sm font-medium">Open Source · MIT License</span>
            </div>
            <h2 className="text-2xl font-bold mb-3">Código aberto e sem complicação</h2>
            <p className="text-slate-400 leading-relaxed mb-8 max-w-xl">
              Esse projeto é público no GitHub. Se você tiver uma situação parecida — ou quiser adaptar
              pra qualquer outro tipo de serviço — fique à vontade pra clonar, modificar e usar.
              Sem precisar pedir permissão.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="bg-slate-800 rounded-lg px-4 py-2 font-mono text-slate-300 select-all text-xs">
                git clone https://github.com/gpiantamar/passa_facil
              </div>
              <a
                href="https://github.com/gpiantamar/passa_facil"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-slate-900 font-semibold px-5 py-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <Github className="w-4 h-4" />
                Ver repositório
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMO FUNCIONA ── */}
      <section id="como-funciona" className="border-t border-slate-100 bg-slate-50">
        <div className="max-w-4xl mx-auto px-5 py-20">
          <h2 className="text-2xl font-bold text-slate-900 mb-12">Como ela usa no dia a dia</h2>
          <div className="grid sm:grid-cols-3 gap-10">
            {[
              {
                num: "1",
                title: "Cliente traz as roupas",
                desc: "Seleciona o cliente no sistema (ou cadastra um novo) e registra as peças que chegaram.",
              },
              {
                num: "2",
                title: "Vai passando conforme o dia",
                desc: "Ela avança o status de cada pedido no quadro. Fica fácil de ver o que ainda está pendente.",
              },
              {
                num: "3",
                title: "Avisa e entrega",
                desc: "Quando termina, clica pra mandar o aviso no WhatsApp. O cliente já sabe que pode buscar.",
              },
            ].map((step) => (
              <div key={step.num}>
                <span className="text-4xl font-black text-slate-100 block mb-3">{step.num}</span>
                <h3 className="font-semibold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TABELA DE PREÇOS ── */}
      <section id="precos" className="border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-5 py-20">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Tabela de referência</h2>
          <p className="text-slate-500 text-sm mb-10">
            Preços que a minha mãe usa. Você pode alterar tudo no painel de configurações.
          </p>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-3 px-5 text-xs font-semibold text-slate-400 uppercase tracking-wide">Peça</th>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-slate-400 uppercase tracking-wide">Prazo</th>
                  <th className="text-right py-3 px-5 text-xs font-semibold text-slate-400 uppercase tracking-wide">Valor</th>
                </tr>
              </thead>
              <tbody>
                {PRECO_TABLE.map((item, i) => (
                  <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-5 flex items-center gap-2.5">
                      <Shirt className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
                      <span className="text-slate-800">{item.peca}</span>
                    </td>
                    <td className="py-3.5 px-5 text-slate-400">{item.prazo}</td>
                    <td className="py-3.5 px-5 text-right font-bold text-slate-900">{item.preco}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-5 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
            <span>Feito com carinho pelo filho — pra facilitar o dia a dia da minha mãe.</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/gpiantamar/passa_facil"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              GitHub
            </a>
            <span className="text-xs text-slate-300">·</span>
            <span className="text-xs text-slate-400">MIT License</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

import React from "react";
import { useNavigate } from "react-router-dom";
import { Wind, ArrowRight, Shirt } from "lucide-react";

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
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
              <Wind className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900">PassaFácil</span>
          </div>

          <nav className="hidden md:flex items-center gap-7 text-sm text-slate-600">
            <a href="#funcionalidades" className="hover:text-slate-900 transition-colors">Funcionalidades</a>
            <a href="#como-funciona" className="hover:text-slate-900 transition-colors">Como funciona</a>
            <a href="#precos" className="hover:text-slate-900 transition-colors">Preços</a>
          </nav>

          <button
            id="btn-acessar-painel-nav"
            onClick={() => navigate("/painel")}
            className="text-sm font-semibold bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
          >
            Acessar painel →
          </button>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="max-w-5xl mx-auto px-5 pt-20 pb-24">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-slate-500 mb-4 tracking-wide uppercase">
            Sistema para passadorias
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight mb-6">
            Controle seus pedidos<br />sem papel, sem confusão.
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed mb-10 max-w-xl">
            Registre as peças que chegam, acompanhe o andamento e avise o cliente pelo WhatsApp quando estiver pronto — tudo em um lugar só.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              id="btn-abrir-painel-hero"
              onClick={() => navigate("/painel")}
              className="inline-flex items-center gap-2 bg-slate-900 text-white font-semibold px-6 py-3 rounded-xl hover:bg-slate-700 transition-colors"
            >
              Abrir painel de gestão
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#funcionalidades"
              className="inline-flex items-center gap-2 border border-slate-200 text-slate-700 font-semibold px-6 py-3 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Ver funcionalidades
            </a>
          </div>
        </div>

        {/* ── MOCKUP KANBAN SIMPLIFICADO ── */}
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
        <div className="max-w-5xl mx-auto px-5 py-20">
          <h2 className="text-2xl font-bold text-slate-900 mb-12">O que tem no sistema</h2>
          <div className="grid sm:grid-cols-2 gap-8">
            {[
              {
                title: "Quadro Kanban operacional",
                desc: "Veja todos os pedidos divididos por status: Recebido, Passando, Pronto e Entregue. Mude o status com um clique.",
              },
              {
                title: "Aviso no WhatsApp",
                desc: "Quando a roupa fica pronta, gere um link de aviso instantâneo pro WhatsApp do cliente. Sem digitar nada.",
              },
              {
                title: "Comanda rápida por peça",
                desc: "Selecione o cliente, adicione as peças com quantidade e o valor já é calculado automaticamente.",
              },
              {
                title: "Histórico de clientes",
                desc: "Todos os pedidos ficam salvos. Veja o histórico completo de qualquer cliente a qualquer momento.",
              },
              {
                title: "Tabela de preços configurável",
                desc: "Defina os preços de cada tipo de peça direto no sistema. Sem planilha, sem papel, sem dor de cabeça.",
              },
              {
                title: "Relatórios básicos",
                desc: "Resumo de pedidos do dia, semana e mês. Quanto entrou, quantas peças foram passadas.",
              },
            ].map((feat) => (
              <div key={feat.title} className="flex gap-4">
                <div className="w-1 rounded-full bg-slate-200 flex-shrink-0 mt-1" style={{ minHeight: "100%" }} />
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">{feat.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMO FUNCIONA ── */}
      <section id="como-funciona" className="border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-5 py-20">
          <h2 className="text-2xl font-bold text-slate-900 mb-12">Como funciona</h2>
          <div className="grid sm:grid-cols-3 gap-10">
            {[
              {
                num: "1",
                title: "Cliente traz as peças",
                desc: "Abra o sistema, selecione o cliente (ou cadastre um novo) e registre as peças que chegaram com a quantidade.",
              },
              {
                num: "2",
                title: "Acompanhe na tábua",
                desc: "Veja o quadro com todos os pedidos em andamento. Avance cada um conforme vai sendo passado.",
              },
              {
                num: "3",
                title: "Avise e entregue",
                desc: "Quando estiver pronto, clique pra mandar o aviso no WhatsApp. O cliente já sabe que pode passar buscar.",
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
      <section id="precos" className="border-t border-slate-100 bg-slate-50">
        <div className="max-w-5xl mx-auto px-5 py-20">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Tabela de referência</h2>
          <p className="text-slate-500 text-sm mb-10">
            Preços padrão para configurar no sistema. Você pode alterar qualquer valor no painel.
          </p>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Peça</th>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Prazo</th>
                  <th className="text-right py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Valor</th>
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

          <div className="mt-8 flex justify-center">
            <button
              id="btn-configurar-precos"
              onClick={() => navigate("/painel")}
              className="inline-flex items-center gap-2 bg-slate-900 text-white font-semibold px-6 py-3 rounded-xl hover:bg-slate-700 transition-colors"
            >
              Abrir painel e configurar
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-5 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-slate-900 flex items-center justify-center">
              <Wind className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-700">PassaFácil</span>
            <span className="text-sm text-slate-400">— Sistema para passadorias</span>
          </div>
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} PassaFácil
          </p>
        </div>
      </footer>
    </div>
  );
}

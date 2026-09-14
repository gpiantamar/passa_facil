import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  Shirt,
  CheckCircle2,
  DollarSign,
  Package,
  AlertCircle,
  Plus,
  ArrowRight,
  MessageCircle,
  Sparkles,
  Truck,
  RefreshCw,
  Columns,
  Search,
} from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { KanbanSkeleton } from "../../components/ui/Loading";
import { EmptyState } from "../../components/ui/EmptyState";
import { QuickOrderModal } from "../../components/orders/QuickOrderModal";
import { serviceService } from "../../services/serviceService";
import type { Service, ServiceStatus } from "../../types";
import { formatCurrency, formatDate, formatServiceCode, todayISO } from "../../utils/formatters";
import { useToastContext } from "../../lib/toastContext";

// Definição das 4 etapas do fluxo operacional
const KANBAN_STAGES: Array<{
  id: "RECEBIDO" | "PASSANDO" | "PRONTO" | "ENTREGUE";
  label: string;
  sublabel: string;
  icon: any;
  colorClass: {
    badge: string;
    border: string;
    headerBg: string;
    dot: string;
    button: string;
  };
  nextStatus?: { value: string; label: string };
}> = [
  {
    id: "RECEBIDO",
    label: "Recebido",
    sublabel: "Acabaram de entrar",
    icon: Clock,
    colorClass: {
      badge: "bg-blue-50 text-blue-700 border-blue-200",
      border: "border-blue-100",
      headerBg: "bg-blue-50/70 text-blue-900",
      dot: "bg-blue-500",
      button: "bg-blue-600 hover:bg-blue-700 text-white",
    },
    nextStatus: { value: "passando", label: "Passando" },
  },
  {
    id: "PASSANDO",
    label: "Passando",
    sublabel: "Na tábua / em processo",
    icon: Sparkles,
    colorClass: {
      badge: "bg-amber-50 text-amber-700 border-amber-200",
      border: "border-amber-100",
      headerBg: "bg-amber-50/70 text-amber-900",
      dot: "bg-amber-500",
      button: "bg-amber-600 hover:bg-amber-700 text-white",
    },
    nextStatus: { value: "pronto", label: "Pronto" },
  },
  {
    id: "PRONTO",
    label: "Pronto",
    sublabel: "Aguardando retirada",
    icon: CheckCircle2,
    colorClass: {
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
      border: "border-emerald-100",
      headerBg: "bg-emerald-50/70 text-emerald-900",
      dot: "bg-emerald-500",
      button: "bg-emerald-600 hover:bg-emerald-700 text-white",
    },
    nextStatus: { value: "entregue", label: "Entregue" },
  },
  {
    id: "ENTREGUE",
    label: "Entregue",
    sublabel: "Pedidos finalizados",
    icon: Truck,
    colorClass: {
      badge: "bg-slate-100 text-slate-700 border-slate-200",
      border: "border-slate-100",
      headerBg: "bg-slate-100/70 text-slate-900",
      dot: "bg-slate-500",
      button: "bg-slate-100 hover:bg-slate-200 text-slate-700",
    },
  },
];

function normalizeStage(status: ServiceStatus | string): "RECEBIDO" | "PASSANDO" | "PRONTO" | "ENTREGUE" {
  const s = (status || "").toLowerCase();
  if (s === "passando" || s === "em andamento" || s === "em_andamento") return "PASSANDO";
  if (s === "pronto") return "PRONTO";
  if (s === "entregue" || s === "finalizado") return "ENTREGUE";
  return "RECEBIDO";
}

// Link direto oficial do WhatsApp para quando o pedido estiver Pronto
function getWhatsAppReadyUrl(phone: string, clientName: string): string {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "#";
  const msg = encodeURIComponent(
    `Olá ${clientName}, suas roupas já foram passadas e estão prontas para retirada!`
  );
  return `https://wa.me/55${digits}?text=${msg}`;
}

export function DashboardPage() {
  const navigate = useNavigate();
  const { addToast } = useToastContext();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"RECEBIDO" | "PASSANDO" | "PRONTO" | "ENTREGUE">("RECEBIDO");
  const [quickOrderOpen, setQuickOrderOpen] = useState(false);
  const [filterSearch, setFilterSearch] = useState("");

  const loadServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const allServs = await serviceService.getAll();
      setServices(allServs || []);
    } catch (err: any) {
      console.error("Erro ao carregar pedidos operacionais:", err);
      setError(
        err?.message ||
          "Não foi possível conectar ao servidor em http://localhost:3333. Verifique se a API está ativa."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  // Transição rápida de status de pedido com 1 clique
  const handleAdvanceStatus = async (
    service: Service,
    targetStatusValue: string,
    targetLabel: string
  ) => {
    setUpdatingId(service.id);
    try {
      const updated = await serviceService.updateStatus(service.id, targetStatusValue);
      setServices((prev) => prev.map((s) => (s.id === service.id ? updated : s)));
      addToast(
        `Pedido ${formatServiceCode(service.code)} avançado para "${targetLabel}"!`,
        "success"
      );
    } catch (err: any) {
      console.error("Erro ao avançar status do pedido:", err);
      addToast(
        err?.message || "Não foi possível atualizar o status do pedido.",
        "error"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // ─── 4 Métricas Rápidas Operacionais Solicitadas ─────────────────────────
  const today = todayISO();

  // 1. Peças a passar hoje (status RECEBIDO ou PASSANDO)
  const pecasAPassarHoje = services
    .filter((s) => ["RECEBIDO", "PASSANDO"].includes(normalizeStage(s.status)))
    .reduce((acc, s) => acc + (s.totalPieces || 0), 0);

  // 2. Pedidos em andamento (status PASSANDO)
  const pedidosEmAndamento = services.filter(
    (s) => normalizeStage(s.status) === "PASSANDO"
  ).length;

  // 3. Pedidos prontos aguardando entrega (status PRONTO)
  const pedidosProntosAguardandoEntrega = services.filter(
    (s) => normalizeStage(s.status) === "PRONTO"
  ).length;

  // 4. Faturamento do dia (pedidos finalizados ou entregues hoje)
  const faturamentoDoDia = services
    .filter((s) => {
      const isDelivered = normalizeStage(s.status) === "ENTREGUE";
      const isToday = s.deliveredAt === today || s.receivedAt === today;
      return isDelivered && isToday;
    })
    .reduce((acc, s) => acc + (s.totalAmount || 0), 0);

  // Filtro por texto de busca rápida
  const filteredServices = services.filter((s) => {
    if (!filterSearch) return true;
    const term = filterSearch.toLowerCase();
    return (
      s.clientName.toLowerCase().includes(term) ||
      s.code.includes(term) ||
      s.clientPhone.includes(term)
    );
  });

  // Agrupamento dos serviços pelas etapas do Kanban
  const groupedOrders = {
    RECEBIDO: filteredServices.filter((s) => normalizeStage(s.status) === "RECEBIDO"),
    PASSANDO: filteredServices.filter((s) => normalizeStage(s.status) === "PASSANDO"),
    PRONTO: filteredServices.filter((s) => normalizeStage(s.status) === "PRONTO"),
    ENTREGUE: filteredServices.filter((s) => normalizeStage(s.status) === "ENTREGUE"),
  };

  return (
    <div className="space-y-5 animate-fade-in w-full min-w-0">
      {/* ── BARRA SUPERIOR OPERACIONAL COM MÉTRICAS RÁPIDAS ─────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Peças a passar hoje */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0">
            <Shirt className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-500 truncate">Peças a passar hoje</p>
            <p className="text-xl font-extrabold text-slate-900 leading-tight">
              {pecasAPassarHoje} <span className="text-xs font-normal text-slate-400">peças</span>
            </p>
          </div>
        </div>

        {/* Pedidos em andamento */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-amber-600" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-500 truncate">Pedidos em andamento</p>
            <p className="text-xl font-extrabold text-slate-900 leading-tight">
              {pedidosEmAndamento} <span className="text-xs font-normal text-slate-400">pedidos</span>
            </p>
          </div>
        </div>

        {/* Prontos aguardando entrega */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-500 truncate">Prontos p/ entrega</p>
            <p className="text-xl font-extrabold text-slate-900 leading-tight">
              {pedidosProntosAguardandoEntrega} <span className="text-xs font-normal text-slate-400">pedidos</span>
            </p>
          </div>
        </div>

        {/* Faturamento do dia */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center flex-shrink-0">
            <DollarSign className="w-5 h-5 text-sky-600" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-500 truncate">Faturamento hoje</p>
            <p className="text-xl font-extrabold text-slate-900 leading-tight">
              {formatCurrency(faturamentoDoDia)}
            </p>
          </div>
        </div>
      </div>

      {/* ── BARRA DE AÇÃO OPERACIONAL E BUSCA ───────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filtrar por cliente ou código..."
            value={filterSearch}
            onChange={(e) => setFilterSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadServices}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Atualizar
          </Button>

          <Button
            size="sm"
            onClick={() => setQuickOrderOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
            className="bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-200 font-bold"
          >
            + Nova Entrada de Roupas
          </Button>
        </div>
      </div>

      {/* ── ERRO DE CONEXÃO ────────────────────────────────────────────────── */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-red-800">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm">Falha na conexão com a API de pedidos</p>
              <p className="text-xs text-red-700 mt-0.5">{error}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadServices}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            className="border-red-200 hover:bg-red-100 text-red-800"
          >
            Tentar novamente
          </Button>
        </div>
      )}

      {/* ── SELETOR DE ABAS NO MOBILE ───────────────────────────────────────── */}
      <div className="flex lg:hidden gap-1.5 overflow-x-auto pb-1">
        {KANBAN_STAGES.map((stage) => {
          const count = groupedOrders[stage.id].length;
          const isActive = activeTab === stage.id;
          return (
            <button
              key={stage.id}
              onClick={() => setActiveTab(stage.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                isActive
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span>{stage.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── FLUXO KANBAN DE PEDIDOS ────────────────────────────────────────── */}
      {loading ? (
        <KanbanSkeleton />
      ) : (
        <>
          {/* Desktop Kanban (4 Colunas) */}
          <div className="hidden lg:grid lg:grid-cols-4 gap-3.5 items-start">
            {KANBAN_STAGES.map((stage) => {
              const stageOrders = groupedOrders[stage.id];
              const Icon = stage.icon;

              return (
                <div
                  key={stage.id}
                  className="bg-slate-50/80 rounded-2xl p-3 border border-slate-200/80 flex flex-col gap-2.5 min-h-[460px]"
                >
                  {/* Cabeçalho da Coluna */}
                  <div
                    className={`flex items-center justify-between p-2.5 rounded-xl ${stage.colorClass.headerBg} border ${stage.colorClass.border}`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider">{stage.label}</p>
                        <p className="text-[10px] opacity-75">{stage.sublabel}</p>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-white/90 shadow-2xs">
                      {stageOrders.length}
                    </span>
                  </div>

                  {/* Lista de Cards da Coluna */}
                  <div className="flex flex-col gap-2.5 overflow-y-auto max-h-[640px] pr-0.5">
                    {stageOrders.length === 0 ? (
                      <div className="py-12 px-3 text-center text-slate-400 bg-white/60 rounded-xl border border-dashed border-slate-200 flex flex-col items-center gap-2">
                        <Icon className="w-5 h-5 text-slate-300" />
                        <p className="text-xs font-medium">Nenhum pedido</p>
                      </div>
                    ) : (
                      stageOrders.map((service) => (
                        <OperationalOrderCard
                          key={service.id}
                          service={service}
                          stage={stage}
                          isUpdating={updatingId === service.id}
                          onAdvance={handleAdvanceStatus}
                          onNavigate={() => navigate(`/painel/servicos/${service.id}`)}
                        />
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile / Tablet: Visualização da Aba Selecionada */}
          <div className="lg:hidden">
            {(() => {
              const currentStage = KANBAN_STAGES.find((s) => s.id === activeTab)!;
              const stageOrders = groupedOrders[activeTab];

              return (
                <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-200/80 flex flex-col gap-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${currentStage.colorClass.dot}`} />
                      <h3 className="text-sm font-bold text-slate-800">
                        {currentStage.label} ({stageOrders.length})
                      </h3>
                    </div>
                    <span className="text-xs text-slate-500">{currentStage.sublabel}</span>
                  </div>

                  {stageOrders.length === 0 ? (
                    <EmptyState
                      icon={currentStage.icon}
                      title={`Nenhum pedido em ${currentStage.label}`}
                      description="Quando houver novos pedidos nesta etapa eles aparecerão aqui."
                      compact
                    />
                  ) : (
                    <div className="flex flex-col gap-2.5">
                      {stageOrders.map((service) => (
                        <OperationalOrderCard
                          key={service.id}
                          service={service}
                          stage={currentStage}
                          isUpdating={updatingId === service.id}
                          onAdvance={handleAdvanceStatus}
                          onNavigate={() => navigate(`/painel/servicos/${service.id}`)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </>
      )}

      {/* ── MODAL DE COMANDA RÁPIDA ────────────────────────────────────────── */}
      <QuickOrderModal
        open={quickOrderOpen}
        onClose={() => setQuickOrderOpen(false)}
        onOrderCreated={loadServices}
      />
    </div>
  );
}

// ─── CARD OPERACIONAL DE PEDIDO ─────────────────────────────────────────────

interface OperationalOrderCardProps {
  service: Service;
  stage: (typeof KANBAN_STAGES)[number];
  isUpdating: boolean;
  onAdvance: (service: Service, targetStatusValue: string, targetLabel: string) => void;
  onNavigate: () => void;
}

function OperationalOrderCard({
  service,
  stage,
  isUpdating,
  onAdvance,
  onNavigate,
}: OperationalOrderCardProps) {
  // Resumo de peças formatado (ex: "5 camisas, 2 calças")
  const resumoPecas =
    service.items && service.items.length > 0
      ? service.items
          .map((it) => `${it.quantity} ${it.clothingTypeName.toLowerCase()}`)
          .join(", ")
      : `${service.totalPieces} peças`;

  // Link direto do WhatsApp Web com a mensagem exata solicitada
  const whatsAppReadyUrl = getWhatsAppReadyUrl(service.clientPhone, service.clientName);

  return (
    <div className="bg-white rounded-xl p-3 border border-slate-200/90 shadow-2xs hover:shadow-sm transition-all flex flex-col gap-2.5 group">
      {/* Linha 1: Código + Status Tag */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={onNavigate}
          className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded transition-colors text-left"
        >
          {formatServiceCode(service.code)}
        </button>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${stage.colorClass.badge}`}>
          {stage.label}
        </span>
      </div>

      {/* Linha 2: Nome do Cliente */}
      <div>
        <button
          onClick={onNavigate}
          className="text-sm font-bold text-slate-800 hover:text-indigo-600 transition-colors text-left truncate block w-full leading-tight"
        >
          {service.clientName}
        </button>
        {service.clientPhone && (
          <p className="text-[11px] text-slate-400 truncate mt-0.5">{service.clientPhone}</p>
        )}
      </div>

      {/* Linha 3: Resumo de Peças */}
      <div className="bg-slate-50 p-2 rounded-lg text-xs text-slate-600 border border-slate-100 flex items-start gap-1.5">
        <Shirt className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
        <span className="font-medium truncate flex-1 leading-snug" title={resumoPecas}>
          {resumoPecas}
        </span>
      </div>

      {/* Linha 4: Previsão e Valor Total */}
      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
        <span className="text-slate-400 text-[11px]">
          {service.expectedDeliveryAt ? formatDate(service.expectedDeliveryAt) : "Sem prazo"}
        </span>
        <span className="font-extrabold text-slate-900 text-sm">
          {formatCurrency(service.totalAmount)}
        </span>
      </div>

      {/* NO STATUS "PRONTO": Botão verde de WhatsApp com mensagem oficial */}
      {stage.id === "PRONTO" && (
        <a
          href={whatsAppReadyUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            if (!service.clientPhone) {
              e.preventDefault();
              alert("Cliente sem telefone cadastrado.");
            }
          }}
          className="w-full bg-[#25D366] hover:bg-[#1ebe5d] active:bg-[#1aa352] text-white text-xs font-bold py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs shadow-green-200"
          title="Abrir WhatsApp com aviso de roupas prontas"
        >
          <MessageCircle className="w-4 h-4 flex-shrink-0" />
          <span>Avisar no WhatsApp (Pronto!)</span>
        </a>
      )}

      {/* Botão de avanço de status com 1 clique */}
      {stage.nextStatus && (
        <button
          disabled={isUpdating}
          onClick={() =>
            onAdvance(service, stage.nextStatus!.value, stage.nextStatus!.label)
          }
          className={`w-full text-xs font-bold py-1.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-2xs ${
            stage.colorClass.button
          } ${isUpdating ? "opacity-60 cursor-not-allowed" : "hover:brightness-105 active:scale-98"}`}
        >
          {isUpdating ? (
            <span>Atualizando...</span>
          ) : (
            <>
              <span>Mover para {stage.nextStatus.label}</span>
              <ArrowRight className="w-3 h-3" />
            </>
          )}
        </button>
      )}
    </div>
  );
}

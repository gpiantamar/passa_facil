import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  Shirt,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Package,
  AlertTriangle,
  Info,
  AlertCircle,
  Plus,
  ArrowRight,
  MessageCircle,
  Sparkles,
  Truck,
  RefreshCw,
  Columns,
  LayoutGrid,
} from "lucide-react";
import { StatCard } from "../../components/ui/StatCard";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { KanbanSkeleton, CardSkeleton } from "../../components/ui/Loading";
import { EmptyState } from "../../components/ui/EmptyState";
import { dashboardService } from "../../services/dashboardService";
import { serviceService } from "../../services/serviceService";
import type { DashboardData, Service, ServiceStatus } from "../../types";
import { formatCurrency, formatDate, formatServiceCode } from "../../utils/formatters";
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
    sublabel: "Aguardando início",
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
    sublabel: "Em andamento",
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
    sublabel: "Aguardando entrega",
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
    sublabel: "Finalizados",
    icon: Truck,
    colorClass: {
      badge: "bg-purple-50 text-purple-700 border-purple-200",
      border: "border-purple-100",
      headerBg: "bg-purple-50/70 text-purple-900",
      dot: "bg-purple-500",
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

function getWhatsAppUrl(phone: string, clientName: string, serviceCode: string, status: string): string {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "#";
  const statusMsg =
    status === "PRONTO"
      ? "está pronto para retirada!"
      : status === "PASSANDO"
      ? "já está sendo passado com carinho."
      : "foi recebido e está em nossa fila.";
  const msg = encodeURIComponent(
    `Olá, ${clientName}! Passando para avisar que seu pedido ${formatServiceCode(serviceCode)} no PassaFácil ${statusMsg}`
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
  const [data, setData] = useState<DashboardData>({
    stats: {
      pendingServices: 0,
      inProgressServices: 0,
      readyServices: 0,
      totalReceivable: 0,
      monthlyRevenue: 0,
      totalPiecesProcessed: 0,
    },
    alerts: [],
    revenueByDay: [],
    revenueByMonth: [],
    todayServices: [],
    recentServices: [],
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [dashData, allServs] = await Promise.all([
        dashboardService.getDashboardData(),
        serviceService.getAll(),
      ]);
      setData(dashData);
      setServices(allServs || []);
    } catch (err: any) {
      console.error("Erro ao carregar dashboard:", err);
      setError(
        err?.message ||
          "Não foi possível carregar os dados operacionais. Verifique a conexão com o servidor."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Transição rápida de status no fluxo Kanban
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
        `Pedido ${formatServiceCode(service.code)} movido para "${targetLabel}" com sucesso!`,
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

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

  // Agrupamento dos serviços pelas etapas do Kanban
  const groupedOrders = {
    RECEBIDO: services.filter((s) => normalizeStage(s.status) === "RECEBIDO"),
    PASSANDO: services.filter((s) => normalizeStage(s.status) === "PASSANDO"),
    PRONTO: services.filter((s) => normalizeStage(s.status) === "PRONTO"),
    ENTREGUE: services.filter((s) => normalizeStage(s.status) === "ENTREGUE"),
  };

  return (
    <div className="space-y-7 animate-fade-in w-full min-w-0">
      {/* ── SAUDAÇÃO & CTAs ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-indigo-50/70 via-sky-50/50 to-white p-5 sm:p-6 rounded-3xl border border-indigo-100/60 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-100/70 text-indigo-700 text-xs font-semibold mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Painel Operacional</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {greeting}! 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Controle os pedidos em tempo real desde o recebimento até a entrega.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap flex-shrink-0">
          <Button
            variant="outline"
            onClick={() => navigate("/clientes/novo")}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Novo cliente
          </Button>
          <Button
            onClick={() => navigate("/servicos/novo")}
            leftIcon={<Plus className="w-4 h-4" />}
            className="shadow-sm shadow-indigo-200"
          >
            Novo pedido
          </Button>
        </div>
      </div>

      {/* ── ALERTA DE ERRO DE CONEXÃO ──────────────────────────────────────── */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-red-800">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm">Falha na conexão com os dados</p>
              <p className="text-xs text-red-700 mt-0.5">{error}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            className="border-red-200 hover:bg-red-100 text-red-800"
          >
            Tentar novamente
          </Button>
        </div>
      )}

      {/* ── CARDS DE ESTATÍSTICAS RÁPIDAS ──────────────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <StatCard
            title="Recebidos"
            value={String(groupedOrders.RECEBIDO.length)}
            icon={Clock}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
            subtitle="aguardando passar"
            onClick={() => setActiveTab("RECEBIDO")}
          />
          <StatCard
            title="Passando"
            value={String(groupedOrders.PASSANDO.length)}
            icon={Sparkles}
            iconBg="bg-amber-50"
            iconColor="text-amber-600"
            subtitle="no vapor / ferro"
            onClick={() => setActiveTab("PASSANDO")}
          />
          <StatCard
            title="Prontos"
            value={String(groupedOrders.PRONTO.length)}
            icon={CheckCircle2}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
            subtitle="aguardando retirada"
            onClick={() => setActiveTab("PRONTO")}
          />
          <StatCard
            title="Entregues"
            value={String(groupedOrders.ENTREGUE.length)}
            icon={Truck}
            iconBg="bg-purple-50"
            iconColor="text-purple-600"
            subtitle="pedidos finalizados"
            onClick={() => setActiveTab("ENTREGUE")}
          />
        </div>
      )}

      {/* ── SEÇÃO OPERACIONAL: FLUXO KANBAN DE PEDIDOS ─────────────────────── */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Columns className="w-5 h-5 text-indigo-600" />
              <span>Fluxo Operacional de Pedidos</span>
            </h2>
            <p className="text-xs text-slate-500">
              Acompanhe o status e avance os pedidos com um único clique.
            </p>
          </div>

          {/* Abas no mobile e seletor rápido */}
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
        </div>

        {loading ? (
          <KanbanSkeleton />
        ) : (
          <>
            {/* Desktop Kanban (4 Colunas) */}
            <div className="hidden lg:grid lg:grid-cols-4 gap-4 items-start">
              {KANBAN_STAGES.map((stage) => {
                const stageOrders = groupedOrders[stage.id];
                const Icon = stage.icon;

                return (
                  <div
                    key={stage.id}
                    className="bg-slate-50/80 rounded-3xl p-3.5 border border-slate-200/70 flex flex-col gap-3 min-h-[420px]"
                  >
                    {/* Header da Coluna */}
                    <div
                      className={`flex items-center justify-between p-3 rounded-2xl ${stage.colorClass.headerBg} border ${stage.colorClass.border}`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider">{stage.label}</p>
                          <p className="text-[10px] opacity-75">{stage.sublabel}</p>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-white/80 shadow-xs">
                        {stageOrders.length}
                      </span>
                    </div>

                    {/* Lista de Cards da Coluna */}
                    <div className="flex flex-col gap-3 overflow-y-auto max-h-[600px] pr-0.5">
                      {stageOrders.length === 0 ? (
                        <div className="py-12 px-3 text-center text-slate-400 bg-white/60 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center gap-2">
                          <Icon className="w-6 h-6 text-slate-300" />
                          <p className="text-xs font-medium">Nenhum pedido nesta etapa</p>
                        </div>
                      ) : (
                        stageOrders.map((service) => (
                          <OrderCard
                            key={service.id}
                            service={service}
                            stage={stage}
                            isUpdating={updatingId === service.id}
                            onAdvance={handleAdvanceStatus}
                            onNavigate={() => navigate(`/servicos/${service.id}`)}
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
                  <div className="bg-slate-50/80 rounded-3xl p-4 border border-slate-200/70 flex flex-col gap-3">
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
                      <div className="flex flex-col gap-3">
                        {stageOrders.map((service) => (
                          <OrderCard
                            key={service.id}
                            service={service}
                            stage={currentStage}
                            isUpdating={updatingId === service.id}
                            onAdvance={handleAdvanceStatus}
                            onNavigate={() => navigate(`/servicos/${service.id}`)}
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
      </section>
    </div>
  );
}

// ─── Componente de Card de Pedido ───────────────────────────────────────────

interface OrderCardProps {
  service: Service;
  stage: (typeof KANBAN_STAGES)[number];
  isUpdating: boolean;
  onAdvance: (service: Service, targetStatusValue: string, targetLabel: string) => void;
  onNavigate: () => void;
}

function OrderCard({
  service,
  stage,
  isUpdating,
  onAdvance,
  onNavigate,
}: OrderCardProps) {
  const whatsAppUrl = getWhatsAppUrl(
    service.clientPhone,
    service.clientName,
    service.code,
    stage.id
  );

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col gap-3 group">
      {/* Topo: Código do pedido + Tag de Status */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={onNavigate}
          className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded-md transition-colors text-left"
        >
          {formatServiceCode(service.code)}
        </button>
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${stage.colorClass.badge}`}
        >
          {stage.label}
        </span>
      </div>

      {/* Cliente + Botão de WhatsApp */}
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <button
            onClick={onNavigate}
            className="text-sm font-bold text-slate-800 hover:text-indigo-600 transition-colors text-left truncate block w-full"
          >
            {service.clientName}
          </button>
          {service.clientPhone && (
            <p className="text-[11px] text-slate-400 truncate">{service.clientPhone}</p>
          )}
        </div>

        {service.clientPhone ? (
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Conversar com cliente no WhatsApp"
            className="w-8 h-8 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200/80 flex items-center justify-center flex-shrink-0 transition-colors shadow-2xs"
            onClick={(e) => e.stopPropagation()}
          >
            <MessageCircle className="w-4 h-4" />
          </a>
        ) : null}
      </div>

      {/* Resumo das Peças / Itens */}
      <div className="bg-slate-50/80 rounded-xl p-2.5 text-xs text-slate-600 border border-slate-100">
        <div className="flex items-center justify-between font-medium text-slate-700 mb-1">
          <span className="flex items-center gap-1">
            <Shirt className="w-3.5 h-3.5 text-slate-400" />
            <span>Total de peças:</span>
          </span>
          <span className="font-bold text-indigo-700">{service.totalPieces} un</span>
        </div>
        {service.items && service.items.length > 0 && (
          <p className="text-[11px] text-slate-500 truncate">
            {service.items.map((it) => `${it.quantity}x ${it.clothingTypeName}`).join(", ")}
          </p>
        )}
      </div>

      {/* Rodapé do Card: Valor + Previsão */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-1 text-slate-500">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{service.expectedDeliveryAt ? formatDate(service.expectedDeliveryAt) : "Sem prazo"}</span>
        </div>
        <span className="font-extrabold text-slate-800 text-sm">
          {formatCurrency(service.totalAmount)}
        </span>
      </div>

      {/* Botão de Avanço Rápido de Status */}
      {stage.nextStatus && (
        <button
          disabled={isUpdating}
          onClick={() =>
            onAdvance(service, stage.nextStatus!.value, stage.nextStatus!.label)
          }
          className={`w-full text-xs font-semibold py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-2xs ${
            stage.colorClass.button
          } ${isUpdating ? "opacity-60 cursor-not-allowed" : "hover:brightness-105 active:scale-98"}`}
        >
          {isUpdating ? (
            <span>Atualizando...</span>
          ) : (
            <>
              <span>Mover para {stage.nextStatus.label}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      )}
    </div>
  );
}

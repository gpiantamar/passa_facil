import React, { useState } from "react";
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
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { StatCard } from "../../components/ui/StatCard";
import { Card } from "../../components/ui/Card";
import { ServiceStatusBadge } from "../../components/ui/ServiceStatusBadge";
import { Button } from "../../components/ui/Button";
import { mockDashboardData } from "../../mocks/dashboard";
import { formatCurrency, formatDate, formatServiceCode } from "../../utils/formatters";

type ChartPeriod = "7days" | "month";

const alertIcons = {
  warning: <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />,
  danger: <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />,
  info: <Info className="w-4 h-4 text-blue-500 flex-shrink-0" />,
};

const alertBg = {
  warning: "bg-amber-50 border-amber-100",
  danger: "bg-red-50 border-red-100",
  info: "bg-blue-50 border-blue-100",
};

// Custom tooltip for chart
function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-xl border border-slate-100 shadow-lg px-3 py-2">
        <p className="text-xs text-slate-500 mb-0.5">{label}</p>
        <p className="text-sm font-bold text-slate-800">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
}

export function DashboardPage() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<ChartPeriod>("7days");
  const { stats, alerts, revenueByDay, revenueByMonth, todayServices, recentServices } =
    mockDashboardData;

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

  const chartData = period === "7days" ? revenueByDay : revenueByMonth;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Greeting + CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
            {greeting}! 👋
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Veja como está sua passadoria hoje.
          </p>
        </div>
        <Button
          onClick={() => navigate("/servicos/novo")}
          size="lg"
          leftIcon={<Plus className="w-4 h-4" />}
          className="sm:flex-shrink-0 shadow-sm shadow-indigo-200"
        >
          Novo serviço
        </Button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <StatCard
          title="Pendentes"
          value={String(stats.pendingServices)}
          icon={Clock}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
          subtitle="aguardando início"
          onClick={() => navigate("/servicos?status=RECEBIDO")}
        />
        <StatCard
          title="Em andamento"
          value={String(stats.inProgressServices)}
          icon={Shirt}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
          onClick={() => navigate("/servicos?status=EM_ANDAMENTO")}
        />
        <StatCard
          title="Prontos"
          value={String(stats.readyServices)}
          icon={CheckCircle2}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          subtitle="aguardando retirada"
          onClick={() => navigate("/servicos?status=PRONTO")}
        />
        <StatCard
          title="A receber"
          value={formatCurrency(stats.totalReceivable)}
          icon={DollarSign}
          iconBg="bg-orange-50"
          iconColor="text-orange-600"
          onClick={() => navigate("/pagamentos")}
        />
        <StatCard
          title="Faturamento do mês"
          value={formatCurrency(stats.monthlyRevenue)}
          icon={TrendingUp}
          iconBg="bg-indigo-50"
          iconColor="text-indigo-600"
          trend={12}
        />
        <StatCard
          title="Peças processadas"
          value={String(stats.totalPiecesProcessed)}
          icon={Package}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
          subtitle="este mês"
        />
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <Card padding="sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide px-1 mb-2">
            Atenção
          </p>
          <div className="flex flex-col gap-2">
            {alerts.map((alert) => (
              <button
                key={alert.id}
                onClick={() => navigate(alert.link)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left w-full hover:opacity-80 transition-opacity ${alertBg[alert.type]}`}
              >
                {alertIcons[alert.type]}
                <span className="text-sm text-slate-700">{alert.message}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 ml-auto flex-shrink-0" />
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Revenue chart */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-slate-700">Faturamento</p>
          <div className="flex gap-1">
            {(["7days", "month"] as ChartPeriod[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                  period === p
                    ? "bg-indigo-600 text-white"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                {p === "7days" ? "7 dias" : "Mês"}
              </button>
            ))}
          </div>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="revenue-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `R$${v}`}
                width={48}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#4f46e5"
                strokeWidth={2}
                fill="url(#revenue-gradient)"
                dot={false}
                activeDot={{ r: 4, fill: "#4f46e5" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Today's services */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-slate-700">Serviços para hoje</p>
          <button
            onClick={() => navigate("/servicos")}
            className="text-xs text-indigo-600 font-medium hover:text-indigo-700 flex items-center gap-0.5"
          >
            Ver todos <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        {todayServices.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">
            Nenhum serviço para hoje.
          </p>
        ) : (
          <div className="flex flex-col divide-y divide-slate-50">
            {todayServices.map((service) => (
              <button
                key={service.id}
                onClick={() => navigate(`/servicos/${service.id}`)}
                className="flex items-center gap-3 py-3 text-left hover:bg-slate-50 -mx-1 px-1 rounded-xl transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-mono text-slate-400">
                      {formatServiceCode(service.code)}
                    </span>
                    <ServiceStatusBadge status={service.status} size="sm" />
                  </div>
                  <p className="text-sm font-semibold text-slate-800 truncate">
                    {service.clientName}
                  </p>
                  <p className="text-xs text-slate-500">
                    {service.totalPieces} peças · {formatDate(service.expectedDeliveryAt)}
                  </p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="text-sm font-bold text-slate-800">
                    {formatCurrency(service.totalAmount)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </Card>

      {/* Recent services */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-slate-700">Serviços recentes</p>
          <button
            onClick={() => navigate("/servicos")}
            className="text-xs text-indigo-600 font-medium hover:text-indigo-700 flex items-center gap-0.5"
          >
            Ver todos <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Desktop table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="pb-2 text-left text-xs font-medium text-slate-400 pr-4">Código</th>
                <th className="pb-2 text-left text-xs font-medium text-slate-400 pr-4">Cliente</th>
                <th className="pb-2 text-left text-xs font-medium text-slate-400 pr-4">Data</th>
                <th className="pb-2 text-right text-xs font-medium text-slate-400 pr-4">Peças</th>
                <th className="pb-2 text-right text-xs font-medium text-slate-400 pr-4">Valor</th>
                <th className="pb-2 text-right text-xs font-medium text-slate-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentServices.map((service) => (
                <tr
                  key={service.id}
                  onClick={() => navigate(`/servicos/${service.id}`)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <td className="py-3 pr-4">
                    <span className="font-mono text-xs text-slate-500">
                      {formatServiceCode(service.code)}
                    </span>
                  </td>
                  <td className="py-3 pr-4 font-medium text-slate-800">{service.clientName}</td>
                  <td className="py-3 pr-4 text-slate-500 text-xs">{formatDate(service.receivedAt)}</td>
                  <td className="py-3 pr-4 text-right text-slate-600">{service.totalPieces}</td>
                  <td className="py-3 pr-4 text-right font-medium text-slate-800">
                    {formatCurrency(service.totalAmount)}
                  </td>
                  <td className="py-3 text-right">
                    <ServiceStatusBadge status={service.status} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="sm:hidden flex flex-col divide-y divide-slate-50">
          {recentServices.map((service) => (
            <button
              key={service.id}
              onClick={() => navigate(`/servicos/${service.id}`)}
              className="flex items-center gap-3 py-3 text-left w-full"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-mono text-slate-400">
                    {formatServiceCode(service.code)}
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-800 truncate">
                  {service.clientName}
                </p>
                <p className="text-xs text-slate-500">
                  {service.totalPieces} peças · {formatDate(service.receivedAt)}
                </p>
              </div>
              <div className="flex-shrink-0 flex flex-col items-end gap-1">
                <p className="text-sm font-bold text-slate-800">
                  {formatCurrency(service.totalAmount)}
                </p>
                <ServiceStatusBadge status={service.status} size="sm" />
              </div>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}

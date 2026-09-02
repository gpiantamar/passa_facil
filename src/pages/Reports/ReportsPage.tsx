import React, { useState } from "react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card } from "../../components/ui/Card";
import { StatCard } from "../../components/ui/StatCard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { mockDashboardData } from "../../mocks/dashboard";
import { formatCurrency } from "../../utils/formatters";
import {
  TrendingUp,
  Shirt,
  Package,
  CreditCard,
  AlertCircle,
} from "lucide-react";

type Period = "today" | "last7days" | "thisMonth" | "lastMonth";

const periodLabels: Record<Period, string> = {
  today: "Hoje",
  last7days: "Últimos 7 dias",
  thisMonth: "Este mês",
  lastMonth: "Mês anterior",
};

const pieColors = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#6366f1"];

const reportData: Record<Period, {
  revenue: number;
  services: number;
  pieces: number;
  received: number;
  pending: number;
}> = {
  today: { revenue: 480, services: 3, pieces: 28, received: 200, pending: 280 },
  last7days: { revenue: 3460, services: 18, pieces: 162, received: 2800, pending: 660 },
  thisMonth: { revenue: 4250, services: 42, pieces: 287, received: 3500, pending: 750 },
  lastMonth: { revenue: 4100, services: 39, pieces: 271, received: 4100, pending: 0 },
};

const statusDistribution = [
  { name: "Finalizado", value: 28 },
  { name: "Pronto", value: 8 },
  { name: "Em andamento", value: 3 },
  { name: "Recebido", value: 2 },
  { name: "Ag. pagamento", value: 1 },
];

function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (active && payload?.length) {
    return (
      <div className="bg-white rounded-xl border border-slate-100 shadow-lg px-3 py-2">
        <p className="text-xs text-slate-500 mb-0.5">{label}</p>
        <p className="text-sm font-bold text-slate-800">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
}

export function ReportsPage() {
  const [period, setPeriod] = useState<Period>("thisMonth");
  const data = reportData[period];

  return (
    <div className="animate-fade-in">
      <PageHeader title="Relatórios" subtitle="Acompanhe os resultados da sua passadoria." />

      {/* Period filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-6 flex-wrap sm:flex-nowrap">
        {(Object.keys(periodLabels) as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
              period === p
                ? "bg-indigo-600 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {periodLabels[p]}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        <StatCard
          title="Faturamento"
          value={formatCurrency(data.revenue)}
          icon={TrendingUp}
          iconBg="bg-indigo-50"
          iconColor="text-indigo-600"
        />
        <StatCard
          title="Serviços"
          value={String(data.services)}
          icon={Shirt}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatCard
          title="Peças"
          value={String(data.pieces)}
          icon={Package}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
        />
        <StatCard
          title="Pagamentos recebidos"
          value={formatCurrency(data.received)}
          icon={CreditCard}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <StatCard
          title="Pendências"
          value={formatCurrency(data.pending)}
          icon={AlertCircle}
          iconBg="bg-orange-50"
          iconColor="text-orange-600"
        />
      </div>

      {/* Revenue chart */}
      <Card className="mb-4">
        <p className="text-sm font-semibold text-slate-700 mb-4">Faturamento por dia</p>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={mockDashboardData.revenueByDay}
              margin={{ top: 4, right: 4, bottom: 0, left: 0 }}
            >
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
                width={50}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#4f46e5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Status distribution */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <p className="text-sm font-semibold text-slate-700 mb-4">
            Distribuição de status
          </p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {statusDistribution.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={pieColors[index % pieColors.length]}
                    />
                  ))}
                </Pie>
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span style={{ fontSize: 11, color: "#64748b" }}>{value}</span>
                  )}
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <p className="text-sm font-semibold text-slate-700 mb-4">
            Formas de pagamento
          </p>
          <div className="flex flex-col gap-3">
            {[
              { label: "PIX", value: 68, color: "bg-indigo-500" },
              { label: "Dinheiro", value: 20, color: "bg-emerald-500" },
              { label: "Cartão", value: 10, color: "bg-amber-500" },
              { label: "Outro", value: 2, color: "bg-slate-300" },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-600">{item.label}</span>
                  <span className="font-medium text-slate-700">{item.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

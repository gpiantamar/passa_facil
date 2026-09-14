import React, { useState, useEffect } from "react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card } from "../../components/ui/Card";
import { StatCard } from "../../components/ui/StatCard";
import { Loading } from "../../components/ui/Loading";
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
import { formatCurrency } from "../../utils/formatters";
import {
  TrendingUp,
  Shirt,
  Package,
  CreditCard,
  AlertCircle,
  Inbox,
} from "lucide-react";
import {
  reportService,
  type ReportPeriodKey,
  type ReportDataResult,
} from "../../services/reportService";

const periodLabels: Record<ReportPeriodKey, string> = {
  today: "Hoje",
  last7days: "Últimos 7 dias",
  thisMonth: "Este mês",
  lastMonth: "Mês anterior",
};

const pieColors = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (active && payload?.length) {
    return (
      <div className="bg-white rounded-xl border border-slate-100 shadow-lg px-3 py-2">
        <p className="text-xs text-slate-500 mb-0.5">{label}</p>
        <p className="text-sm font-bold text-slate-800">
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
}

export function ReportsPage() {
  const [period, setPeriod] = useState<ReportPeriodKey>("thisMonth");
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<ReportDataResult>({
    summary: { revenue: 0, services: 0, pieces: 0, received: 0, pending: 0 },
    revenueByDay: [],
    statusDistribution: [],
    paymentMethods: [],
  });

  useEffect(() => {
    setLoading(true);
    reportService
      .getReport(period)
      .then(setReportData)
      .finally(() => setLoading(false));
  }, [period]);

  const { summary, revenueByDay, statusDistribution, paymentMethods } = reportData;
  const hasRevenueData = revenueByDay.some((d) => d.value > 0);
  const hasStatusData = statusDistribution.length > 0;
  const hasPaymentData = paymentMethods.some((m) => m.value > 0);

  return (
    <div className="animate-fade-in w-full min-w-0">
      <PageHeader
        title="Relatórios"
        subtitle="Acompanhe os resultados da sua passadoria em tempo real."
      />

      {/* Period filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 max-w-full">
        {(Object.keys(periodLabels) as ReportPeriodKey[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 cursor-pointer ${
              period === p
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {periodLabels[p]}
          </button>
        ))}
      </div>

      {loading ? (
        <Loading />
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
            <StatCard
              title="Faturamento"
              value={formatCurrency(summary.revenue)}
              icon={TrendingUp}
              iconBg="bg-indigo-50"
              iconColor="text-indigo-600"
            />
            <StatCard
              title="Serviços"
              value={String(summary.services)}
              icon={Shirt}
              iconBg="bg-blue-50"
              iconColor="text-blue-600"
            />
            <StatCard
              title="Peças"
              value={String(summary.pieces)}
              icon={Package}
              iconBg="bg-purple-50"
              iconColor="text-purple-600"
            />
            <StatCard
              title="Pagamentos recebidos"
              value={formatCurrency(summary.received)}
              icon={CreditCard}
              iconBg="bg-emerald-50"
              iconColor="text-emerald-600"
            />
            <StatCard
              title="Pendências"
              value={formatCurrency(summary.pending)}
              icon={AlertCircle}
              iconBg="bg-orange-50"
              iconColor="text-orange-600"
            />
          </div>

          {/* Revenue chart */}
          <Card className="mb-6">
            <p className="text-sm font-semibold text-slate-700 mb-4">
              Faturamento por dia
            </p>
            <div className="h-52 w-full min-w-0">
              {hasRevenueData || revenueByDay.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={revenueByDay}
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
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                  <Inbox className="w-8 h-8 text-slate-300" />
                  <p className="text-xs">Nenhum faturamento registrado no período.</p>
                </div>
              )}
            </div>
          </Card>

          {/* Status & Payment Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <p className="text-sm font-semibold text-slate-700 mb-4">
                Distribuição de status
              </p>
              <div className="h-48 w-full min-w-0">
                {hasStatusData ? (
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
                          <span style={{ fontSize: 11, color: "#64748b" }}>
                            {value}
                          </span>
                        )}
                      />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                    <Inbox className="w-8 h-8 text-slate-300" />
                    <p className="text-xs">Nenhum serviço registrado no período.</p>
                  </div>
                )}
              </div>
            </Card>

            <Card>
              <p className="text-sm font-semibold text-slate-700 mb-4">
                Formas de pagamento
              </p>
              {hasPaymentData ? (
                <div className="flex flex-col gap-3">
                  {paymentMethods.map((item) => (
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
              ) : (
                <div className="h-48 flex flex-col items-center justify-center text-slate-400 gap-2">
                  <Inbox className="w-8 h-8 text-slate-300" />
                  <p className="text-xs">Nenhum pagamento registrado no período.</p>
                </div>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

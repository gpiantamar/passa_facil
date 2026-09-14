import { serviceService } from "./serviceService";
import { paymentService } from "./paymentService";
import { todayISO } from "../utils/formatters";
import type { ServiceStatus } from "../types";

export type ReportPeriodKey = "today" | "last7days" | "thisMonth" | "lastMonth";

export interface PeriodSummary {
  revenue: number;
  services: number;
  pieces: number;
  received: number;
  pending: number;
}

export interface StatusDistributionItem {
  name: string;
  value: number;
}

export interface PaymentMethodShare {
  label: string;
  value: number;
  color: string;
}

export interface ReportDataResult {
  summary: PeriodSummary;
  revenueByDay: { label: string; value: number }[];
  statusDistribution: StatusDistributionItem[];
  paymentMethods: PaymentMethodShare[];
}

const statusNameMap: Record<ServiceStatus, string> = {
  RECEBIDO: "Recebido",
  EM_ANDAMENTO: "Em andamento",
  PASSANDO: "Passando",
  PRONTO: "Pronto",
  AGUARDANDO_PAGAMENTO: "Ag. pagamento",
  FINALIZADO: "Finalizado",
  ENTREGUE: "Entregue",
};

export const reportService = {
  async getReport(period: ReportPeriodKey): Promise<ReportDataResult> {
    const allServices = await serviceService.getAll();
    const allPayments = await paymentService.getAll();

    const today = new Date();
    const todayStr = todayISO();

    let startDateStr = todayStr;
    let endDateStr = todayStr;

    if (period === "today") {
      startDateStr = todayStr;
      endDateStr = todayStr;
    } else if (period === "last7days") {
      const d = new Date();
      d.setDate(d.getDate() - 6);
      startDateStr = d.toISOString().split("T")[0];
      endDateStr = todayStr;
    } else if (period === "thisMonth") {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      startDateStr = firstDay.toISOString().split("T")[0];
      endDateStr = todayStr;
    } else if (period === "lastMonth") {
      const firstDayLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const lastDayLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      startDateStr = firstDayLastMonth.toISOString().split("T")[0];
      endDateStr = lastDayLastMonth.toISOString().split("T")[0];
    }

    // Filter services and payments
    const filteredServices = allServices.filter(
      (s) => s.receivedAt >= startDateStr && s.receivedAt <= endDateStr
    );
    const filteredPayments = allPayments.filter(
      (p) => p.paidAt >= startDateStr && p.paidAt <= endDateStr
    );

    const revenue = filteredServices.reduce((sum, s) => sum + s.totalAmount, 0);
    const servicesCount = filteredServices.length;
    const pieces = filteredServices.reduce((sum, s) => sum + s.totalPieces, 0);
    const received = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
    const pending = filteredServices.reduce((sum, s) => {
      const rem = s.totalAmount - s.paidAmount;
      return sum + (rem > 0 ? rem : 0);
    }, 0);

    const summary: PeriodSummary = {
      revenue,
      services: servicesCount,
      pieces,
      received,
      pending,
    };

    // Revenue by day for the chart
    const revenueByDay: { label: string; value: number }[] = [];
    const daysToShow = period === "today" ? 1 : period === "last7days" ? 7 : 14;

    for (let i = daysToShow - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const iso = d.toISOString().split("T")[0];
      const label = `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}`;
      const dayTotal = allPayments
        .filter((p) => p.paidAt === iso)
        .reduce((sum, p) => sum + p.amount, 0);
      revenueByDay.push({ label, value: dayTotal });
    }

    // Status distribution
    const statusCounts: Record<string, number> = {};
    for (const s of filteredServices) {
      const label = statusNameMap[s.status] ?? s.status;
      statusCounts[label] = (statusCounts[label] || 0) + 1;
    }
    const statusDistribution: StatusDistributionItem[] = Object.entries(statusCounts).map(
      ([name, value]) => ({ name, value })
    );

    // Payment methods
    const methodCounts: Record<string, number> = {
      PIX: 0,
      DINHEIRO: 0,
      CARTAO: 0,
      OUTRO: 0,
    };
    for (const p of filteredPayments) {
      if (methodCounts[p.method] !== undefined) {
        methodCounts[p.method] += p.amount;
      } else {
        methodCounts.OUTRO += p.amount;
      }
    }

    const totalPaymentAmount = Object.values(methodCounts).reduce((a, b) => a + b, 0);
    const methodColors: Record<string, string> = {
      PIX: "bg-indigo-500",
      DINHEIRO: "bg-emerald-500",
      CARTAO: "bg-amber-500",
      OUTRO: "bg-slate-400",
    };
    const methodLabels: Record<string, string> = {
      PIX: "PIX",
      DINHEIRO: "Dinheiro",
      CARTAO: "Cartão",
      OUTRO: "Outro",
    };

    const paymentMethods: PaymentMethodShare[] = Object.entries(methodCounts).map(
      ([method, amount]) => {
        const percentage = totalPaymentAmount > 0 ? Math.round((amount / totalPaymentAmount) * 100) : 0;
        return {
          label: methodLabels[method] || method,
          value: percentage,
          color: methodColors[method] || "bg-slate-300",
        };
      }
    );

    return {
      summary,
      revenueByDay,
      statusDistribution,
      paymentMethods,
    };
  },
};

import type { DashboardData, DashboardStats, DashboardAlert, RevenueDataPoint } from "../types";
import { serviceService } from "./serviceService";
import { paymentService } from "./paymentService";
import { todayISO } from "../utils/formatters";

export const dashboardService = {
  async getDashboardData(): Promise<DashboardData> {
    const allServices = await serviceService.getAll();
    const allPayments = await paymentService.getAll();
    const today = todayISO();
    const currentMonth = today.slice(0, 7); // YYYY-MM

    // Statistics
    const pendingServices = allServices.filter((s) => s.status === "RECEBIDO").length;
    const inProgressServices = allServices.filter((s) => s.status === "EM_ANDAMENTO").length;
    const readyServices = allServices.filter((s) => s.status === "PRONTO").length;

    const totalReceivable = allServices.reduce((sum, s) => {
      const remaining = s.totalAmount - s.paidAmount;
      return sum + (remaining > 0 ? remaining : 0);
    }, 0);

    const monthlyRevenue = allPayments
      .filter((p) => p.paidAt.startsWith(currentMonth))
      .reduce((sum, p) => sum + p.amount, 0);

    const totalPiecesProcessed = allServices
      .filter((s) => s.status !== "RECEBIDO")
      .reduce((sum, s) => sum + s.totalPieces, 0);

    const stats: DashboardStats = {
      pendingServices,
      inProgressServices,
      readyServices,
      totalReceivable,
      monthlyRevenue,
      totalPiecesProcessed,
    };

    // Alerts
    const alerts: DashboardAlert[] = [];
    const overdueServices = allServices.filter(
      (s) => s.expectedDeliveryAt < today && !["FINALIZADO", "PRONTO"].includes(s.status)
    );
    if (overdueServices.length > 0) {
      alerts.push({
        id: "overdue",
        type: "danger",
        message: `${overdueServices.length} serviço(s) com entrega atrasada!`,
        count: overdueServices.length,
        link: "/servicos",
      });
    }

    const readyPendingPayment = allServices.filter(
      (s) => s.status === "PRONTO" && s.paymentStatus !== "PAGO"
    );
    if (readyPendingPayment.length > 0) {
      alerts.push({
        id: "ready-payment",
        type: "warning",
        message: `${readyPendingPayment.length} serviço(s) pronto(s) aguardando pagamento.`,
        count: readyPendingPayment.length,
        link: "/servicos?status=PRONTO",
      });
    }

    // Revenue by day (last 7 days)
    const revenueByDay: RevenueDataPoint[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const iso = d.toISOString().split("T")[0];
      const dayLabel = `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}`;
      const dayTotal = allPayments
        .filter((p) => p.paidAt === iso)
        .reduce((sum, p) => sum + p.amount, 0);
      revenueByDay.push({ label: dayLabel, value: dayTotal });
    }

    // Revenue by month (last 6 months)
    const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const revenueByMonth: RevenueDataPoint[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthPrefix = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}`;
      const monthLabel = monthNames[d.getMonth()];
      const monthTotal = allPayments
        .filter((p) => p.paidAt.startsWith(monthPrefix))
        .reduce((sum, p) => sum + p.amount, 0);
      revenueByMonth.push({ label: monthLabel, value: monthTotal });
    }

    // Today's services
    const todayServices = allServices.filter(
      (s) => s.expectedDeliveryAt === today || s.receivedAt === today
    );

    // Recent services (up to 8)
    const recentServices = allServices.slice(0, 8);

    return {
      stats,
      alerts,
      revenueByDay,
      revenueByMonth,
      todayServices,
      recentServices,
    };
  },
};

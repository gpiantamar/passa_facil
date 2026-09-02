import type { DashboardData } from "../types";
import { mockServices } from "./services";

export const mockDashboardData: DashboardData = {
  stats: {
    pendingServices: 3,
    inProgressServices: 2,
    readyServices: 3,
    totalReceivable: 840.0,
    monthlyRevenue: 4250.0,
    totalPiecesProcessed: 287,
  },
  alerts: [
    {
      id: "a1",
      type: "warning",
      message: "3 serviços estão atrasados",
      count: 3,
      link: "/servicos?status=EM_ANDAMENTO",
    },
    {
      id: "a2",
      type: "danger",
      message: "R$ 320,00 em pagamentos pendentes",
      count: 320,
      link: "/pagamentos",
    },
    {
      id: "a3",
      type: "info",
      message: "5 serviços prontos aguardando retirada",
      count: 5,
      link: "/servicos?status=PRONTO",
    },
  ],
  revenueByDay: [
    { label: "27/ago", value: 380 },
    { label: "28/ago", value: 520 },
    { label: "29/ago", value: 290 },
    { label: "30/ago", value: 610 },
    { label: "31/ago", value: 450 },
    { label: "01/set", value: 730 },
    { label: "02/set", value: 480 },
  ],
  revenueByMonth: [
    { label: "Mar", value: 2100 },
    { label: "Abr", value: 2800 },
    { label: "Mai", value: 3200 },
    { label: "Jun", value: 2900 },
    { label: "Jul", value: 3800 },
    { label: "Ago", value: 4100 },
    { label: "Set", value: 4250 },
  ],
  todayServices: mockServices.filter((s) =>
    ["2026-09-02"].includes(s.receivedAt) ||
    ["s1", "s3", "s4", "s14", "s15"].includes(s.id)
  ).slice(0, 5),
  recentServices: mockServices.slice(0, 8),
};

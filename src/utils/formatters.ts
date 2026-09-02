import type { ServiceStatus, PaymentStatus, PaymentMethod } from "../types";

// =============================================
// CURRENCY
// =============================================

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

// =============================================
// DATE
// =============================================

export function formatDate(dateStr: string): string {
  if (!dateStr) return "-";
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

export function formatDateShort(dateStr: string): string {
  if (!dateStr) return "-";
  const [, month, day] = dateStr.split("-");
  return `${day}/${month}`;
}

export function isOverdue(expectedDeliveryAt: string, status: ServiceStatus): boolean {
  if (status === "FINALIZADO") return false;
  const today = new Date();
  const expected = new Date(expectedDeliveryAt);
  return expected < today;
}

export function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

// =============================================
// PHONE
// =============================================

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return phone;
}

// =============================================
// SERVICE STATUS
// =============================================

export function formatServiceStatus(status: ServiceStatus): string {
  const labels: Record<ServiceStatus, string> = {
    RECEBIDO: "Recebido",
    EM_ANDAMENTO: "Em andamento",
    PRONTO: "Pronto",
    AGUARDANDO_PAGAMENTO: "Aguardando pagamento",
    FINALIZADO: "Finalizado",
  };
  return labels[status] ?? status;
}

export function getServiceStatusColor(status: ServiceStatus): {
  bg: string;
  text: string;
  dot: string;
} {
  const colors: Record<ServiceStatus, { bg: string; text: string; dot: string }> = {
    RECEBIDO: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      dot: "bg-blue-500",
    },
    EM_ANDAMENTO: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      dot: "bg-amber-500",
    },
    PRONTO: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      dot: "bg-emerald-500",
    },
    AGUARDANDO_PAGAMENTO: {
      bg: "bg-orange-50",
      text: "text-orange-700",
      dot: "bg-orange-500",
    },
    FINALIZADO: {
      bg: "bg-slate-100",
      text: "text-slate-600",
      dot: "bg-slate-400",
    },
  };
  return colors[status] ?? { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" };
}

// =============================================
// PAYMENT STATUS
// =============================================

export function formatPaymentStatus(status: PaymentStatus): string {
  const labels: Record<PaymentStatus, string> = {
    PAGO: "Pago",
    PENDENTE: "Pendente",
    PARCIAL: "Parcial",
  };
  return labels[status] ?? status;
}

export function getPaymentStatusColor(status: PaymentStatus): {
  bg: string;
  text: string;
} {
  const colors: Record<PaymentStatus, { bg: string; text: string }> = {
    PAGO: { bg: "bg-emerald-50", text: "text-emerald-700" },
    PENDENTE: { bg: "bg-red-50", text: "text-red-600" },
    PARCIAL: { bg: "bg-amber-50", text: "text-amber-700" },
  };
  return colors[status] ?? { bg: "bg-gray-100", text: "text-gray-600" };
}

// =============================================
// PAYMENT METHOD
// =============================================

export function formatPaymentMethod(method: PaymentMethod): string {
  const labels: Record<PaymentMethod, string> = {
    PIX: "PIX",
    DINHEIRO: "Dinheiro",
    CARTAO: "Cartão",
    OUTRO: "Outro",
  };
  return labels[method] ?? method;
}

// =============================================
// SERVICE CODE
// =============================================

export function formatServiceCode(code: string): string {
  return `#${code}`;
}

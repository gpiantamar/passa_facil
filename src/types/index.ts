// =============================================
// ENUMS / UNION TYPES
// =============================================

export type ServiceStatus =
  | "RECEBIDO"
  | "EM_ANDAMENTO"
  | "PRONTO"
  | "AGUARDANDO_PAGAMENTO"
  | "FINALIZADO";

export type PaymentStatus = "PAGO" | "PENDENTE" | "PARCIAL";

export type PaymentMethod = "PIX" | "DINHEIRO" | "CARTAO" | "OUTRO";

// =============================================
// ENTITIES
// =============================================

export interface Client {
  id: string;
  name: string;
  phone: string;
  address?: string;
  notes?: string;
  createdAt: string;
  totalServices: number;
  totalSpent: number;
  totalPaid: number;
  pendingAmount: number;
  lastServiceDate?: string;
}

export interface ClothingType {
  id: string;
  name: string;
  pricePerUnit: number;
  active: boolean;
}

export interface ServiceItem {
  id: string;
  serviceId: string;
  clothingTypeId: string;
  clothingTypeName: string;
  quantity: number;
  pricePerUnit: number;
  subtotal: number;
}

export interface Service {
  id: string;
  code: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  status: ServiceStatus;
  receivedAt: string;
  expectedDeliveryAt: string;
  deliveredAt?: string;
  items: ServiceItem[];
  totalPieces: number;
  totalAmount: number;
  paidAmount: number;
  notes?: string;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
}

export interface Payment {
  id: string;
  serviceId: string;
  serviceCode: string;
  clientId: string;
  clientName: string;
  amount: number;
  method: PaymentMethod;
  paidAt: string;
  notes?: string;
}

// =============================================
// DASHBOARD
// =============================================

export interface DashboardStats {
  pendingServices: number;
  inProgressServices: number;
  readyServices: number;
  totalReceivable: number;
  monthlyRevenue: number;
  totalPiecesProcessed: number;
}

export interface DashboardAlert {
  id: string;
  type: "warning" | "info" | "danger";
  message: string;
  count: number;
  link: string;
}

export interface RevenueDataPoint {
  label: string;
  value: number;
}

export interface DashboardData {
  stats: DashboardStats;
  alerts: DashboardAlert[];
  revenueByDay: RevenueDataPoint[];
  revenueByMonth: RevenueDataPoint[];
  todayServices: Service[];
  recentServices: Service[];
}

// =============================================
// FORM TYPES
// =============================================

export interface NewClientForm {
  name: string;
  phone: string;
  address?: string;
  notes?: string;
}

export interface NewServiceItemForm {
  clothingTypeId: string;
  clothingTypeName: string;
  quantity: number;
  pricePerUnit: number;
}

export interface NewServiceForm {
  clientId: string;
  receivedAt: string;
  expectedDeliveryAt: string;
  notes?: string;
  items: NewServiceItemForm[];
}

export interface NewPaymentForm {
  amount: number;
  method: PaymentMethod;
  paidAt: string;
  notes?: string;
}

// =============================================
// FILTERS
// =============================================

export interface ServiceFilters {
  search: string;
  status: ServiceStatus | "TODOS";
  dateFrom?: string;
  dateTo?: string;
}

export interface ClientFilters {
  search: string;
}

export interface ReportPeriod {
  type: "today" | "last7days" | "thisMonth" | "lastMonth" | "custom";
  from?: string;
  to?: string;
}

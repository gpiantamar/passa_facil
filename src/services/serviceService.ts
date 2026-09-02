import type { Service, ServiceFilters, NewServiceForm, ServiceStatus } from "../types";
import { mockServices } from "../mocks/services";

let services = [...mockServices];
let nextCode = 129;

export const serviceService = {
  async getAll(filters?: ServiceFilters): Promise<Service[]> {
    let result = [...services];

    if (filters?.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(
        (s) =>
          s.clientName.toLowerCase().includes(search) ||
          s.code.includes(search)
      );
    }

    if (filters?.status && filters.status !== "TODOS") {
      result = result.filter((s) => s.status === filters.status);
    }

    if (filters?.dateFrom) {
      result = result.filter((s) => s.receivedAt >= filters.dateFrom!);
    }

    if (filters?.dateTo) {
      result = result.filter((s) => s.receivedAt <= filters.dateTo!);
    }

    return result.sort((a, b) => b.code.localeCompare(a.code));
  },

  async getById(id: string): Promise<Service | null> {
    return services.find((s) => s.id === id) ?? null;
  },

  async getByClientId(clientId: string): Promise<Service[]> {
    return services
      .filter((s) => s.clientId === clientId)
      .sort((a, b) => b.code.localeCompare(a.code));
  },

  async create(data: NewServiceForm, clientName: string, clientPhone: string): Promise<Service> {
    const totalAmount = data.items.reduce((sum, item) => sum + item.quantity * item.pricePerUnit, 0);
    const totalPieces = data.items.reduce((sum, item) => sum + item.quantity, 0);
    const code = String(nextCode++).padStart(6, "0");

    const newService: Service = {
      id: `s${Date.now()}`,
      code,
      clientId: data.clientId,
      clientName,
      clientPhone,
      status: "RECEBIDO",
      receivedAt: data.receivedAt,
      expectedDeliveryAt: data.expectedDeliveryAt,
      notes: data.notes,
      items: data.items.map((item, i) => ({
        id: `si${Date.now()}${i}`,
        serviceId: `s${Date.now()}`,
        clothingTypeId: item.clothingTypeId,
        clothingTypeName: item.clothingTypeName,
        quantity: item.quantity,
        pricePerUnit: item.pricePerUnit,
        subtotal: item.quantity * item.pricePerUnit,
      })),
      totalPieces,
      totalAmount,
      paidAmount: 0,
      paymentStatus: "PENDENTE",
    };

    services = [newService, ...services];
    return newService;
  },

  async updateStatus(id: string, status: ServiceStatus): Promise<Service> {
    const index = services.findIndex((s) => s.id === id);
    if (index === -1) throw new Error("Serviço não encontrado");
    services[index] = { ...services[index], status };
    return services[index];
  },
};

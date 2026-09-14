import type { Service, ServiceFilters, NewServiceForm, ServiceStatus } from "../types";
import { getPedidos, criarPedido, atualizarStatusPedido } from "./api.js";

function mapPedidoToService(p: any): Service {
  const code = String(p.id).padStart(6, "0");
  const items = (p.itens || []).map((item: any) => ({
    id: String(item.id),
    serviceId: String(p.id),
    clothingTypeId: String(item.servicoId),
    clothingTypeName: item.servico?.nome || `Serviço #${item.servicoId}`,
    quantity: item.quantidade,
    pricePerUnit: item.valorUnit,
    subtotal: item.quantidade * item.valorUnit,
  }));
  const totalPieces = items.reduce((sum: number, it: any) => sum + (it.quantity || 0), 0);

  let status: ServiceStatus = "RECEBIDO";
  const rawStatus = (p.status || "").toLowerCase();
  if (rawStatus === "passando" || rawStatus === "em andamento" || rawStatus === "em_andamento") {
    status = "EM_ANDAMENTO";
  } else if (rawStatus === "pronto") {
    status = "PRONTO";
  } else if (rawStatus === "entregue") {
    status = "ENTREGUE";
  } else if (rawStatus === "finalizado") {
    status = "FINALIZADO";
  } else if (rawStatus === "aguardando_pagamento") {
    status = "AGUARDANDO_PAGAMENTO";
  } else {
    status = "RECEBIDO";
  }

  return {
    id: String(p.id),
    code,
    clientId: String(p.clienteId),
    clientName: p.cliente?.nome || "Cliente",
    clientPhone: p.cliente?.telefone || "",
    status,
    receivedAt: p.criadoEm ? p.criadoEm.split("T")[0] : new Date().toISOString().split("T")[0],
    expectedDeliveryAt: p.previsaoPara ? p.previsaoPara.split("T")[0] : "",
    deliveredAt: rawStatus === "entregue" || rawStatus === "finalizado" ? (p.criadoEm ? p.criadoEm.split("T")[0] : undefined) : undefined,
    items,
    totalPieces,
    totalAmount: p.valorTotal || 0,
    paidAmount: 0,
    notes: p.observacoes || undefined,
    paymentStatus: "PENDENTE",
  };
}

export const serviceService = {
  async getAll(filters?: ServiceFilters): Promise<Service[]> {
    const pedidos = await getPedidos();
    let result = (pedidos || []).map(mapPedidoToService);

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
    const all = await this.getAll();
    return all.find((s) => s.id === id) ?? null;
  },

  async getByClientId(clientId: string): Promise<Service[]> {
    const all = await this.getAll();
    return all
      .filter((s) => s.clientId === clientId)
      .sort((a, b) => b.code.localeCompare(a.code));
  },

  async create(data: NewServiceForm, _clientName?: string, _clientPhone?: string): Promise<Service> {
    const payload = {
      clienteId: data.clientId,
      observacoes: data.notes || undefined,
      previsaoPara: data.expectedDeliveryAt || undefined,
      itens: data.items.map((item) => ({
        servicoId: item.clothingTypeId,
        quantidade: item.quantity,
        valorUnit: item.pricePerUnit,
      })),
    };

    const criado = await criarPedido(payload);
    return mapPedidoToService(criado);
  },

  async updateStatus(id: string, status: ServiceStatus | string): Promise<Service> {
    // Converte para o padrão aceito pelo backend
    let backendStatus = (status || "").toLowerCase();
    if (backendStatus === "em_andamento") backendStatus = "em andamento";

    const atualizado = await atualizarStatusPedido(id, backendStatus);
    return mapPedidoToService(atualizado);
  },

  async update(id: string, data: Partial<Service>): Promise<Service> {
    if (data.status) {
      return await this.updateStatus(id, data.status);
    }
    const current = await this.getById(id);
    if (!current) throw new Error("Serviço não encontrado");
    return { ...current, ...data };
  },
};

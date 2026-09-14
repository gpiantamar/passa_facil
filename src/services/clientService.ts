import type { Client, ClientFilters, NewClientForm } from "../types";
import { getClientes, criarCliente } from "./api.js";

export const clientService = {
  async getAll(filters?: ClientFilters): Promise<Client[]> {
    const data = await getClientes();
    let result: Client[] = (data || []).map((c: any) => ({
      id: String(c.id),
      name: c.nome || c.name || "",
      phone: c.telefone || c.phone || "",
      address: c.endereco || c.address || "",
      notes: c.notes || "",
      createdAt: c.criadoEm ? c.criadoEm.split("T")[0] : new Date().toISOString().split("T")[0],
      totalServices: Array.isArray(c.pedidos) ? c.pedidos.length : 0,
      totalSpent: 0,
      totalPaid: 0,
      pendingAmount: 0,
    }));

    if (filters?.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(search) ||
          c.phone.includes(search)
      );
    }
    return result;
  },

  async getById(id: string): Promise<Client | null> {
    const all = await this.getAll();
    return all.find((c) => c.id === id) ?? null;
  },

  async create(data: NewClientForm): Promise<Client> {
    const criado = await criarCliente({
      nome: data.name,
      telefone: data.phone,
      endereco: data.address,
    });
    return {
      id: String(criado.id),
      name: criado.nome,
      phone: criado.telefone,
      address: criado.endereco || "",
      notes: data.notes || "",
      createdAt: criado.criadoEm ? criado.criadoEm.split("T")[0] : new Date().toISOString().split("T")[0],
      totalServices: 0,
      totalSpent: 0,
      totalPaid: 0,
      pendingAmount: 0,
    };
  },

  async update(id: string, data: Partial<NewClientForm>): Promise<Client> {
    const client = await this.getById(id);
    if (!client) throw new Error("Cliente não encontrado");
    return { ...client, ...data };
  },

  async delete(_id: string): Promise<void> {
    // API futura de deleção
  },
};

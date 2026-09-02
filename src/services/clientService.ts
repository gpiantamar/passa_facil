import type { Client, ClientFilters, NewClientForm } from "../types";
import { mockClients } from "../mocks/clients";

// This service layer is prepared for future Supabase/API integration.
// Replace the implementations below with real API calls when backend is ready.

let clients = [...mockClients];

export const clientService = {
  async getAll(filters?: ClientFilters): Promise<Client[]> {
    let result = [...clients];
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
    return clients.find((c) => c.id === id) ?? null;
  },

  async create(data: NewClientForm): Promise<Client> {
    const newClient: Client = {
      id: `c${Date.now()}`,
      name: data.name,
      phone: data.phone,
      address: data.address,
      notes: data.notes,
      createdAt: new Date().toISOString().split("T")[0],
      totalServices: 0,
      totalSpent: 0,
      totalPaid: 0,
      pendingAmount: 0,
    };
    clients = [newClient, ...clients];
    return newClient;
  },

  async update(id: string, data: Partial<NewClientForm>): Promise<Client> {
    const index = clients.findIndex((c) => c.id === id);
    if (index === -1) throw new Error("Cliente não encontrado");
    clients[index] = { ...clients[index], ...data };
    return clients[index];
  },

  async delete(id: string): Promise<void> {
    clients = clients.filter((c) => c.id !== id);
  },
};

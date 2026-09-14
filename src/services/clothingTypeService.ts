import type { ClothingType } from "../types";
import { getServicos, criarServico } from "./api.js";

export const clothingTypeService = {
  async getAll(): Promise<ClothingType[]> {
    const servicos = await getServicos();
    return (servicos || []).map((s: any) => ({
      id: String(s.id),
      name: s.nome,
      pricePerUnit: s.preco,
      active: true,
    }));
  },

  async getActive(): Promise<ClothingType[]> {
    return this.getAll();
  },

  async getById(id: string): Promise<ClothingType | null> {
    const all = await this.getAll();
    return all.find((c) => c.id === id) ?? null;
  },

  async create(data: Omit<ClothingType, "id">): Promise<ClothingType> {
    const servico = await criarServico({
      nome: data.name,
      preco: data.pricePerUnit,
    });
    return {
      id: String(servico.id),
      name: servico.nome,
      pricePerUnit: servico.preco,
      active: true,
    };
  },

  async update(id: string, data: Partial<ClothingType>): Promise<ClothingType> {
    const all = await this.getAll();
    const found = all.find((c) => c.id === id);
    if (!found) throw new Error("Tipo de roupa não encontrado");
    return { ...found, ...data };
  },

  async delete(_id: string): Promise<void> {
    // API futura de deleção
  },
};

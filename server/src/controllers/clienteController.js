import { prisma } from "../lib/prisma.js";

export const clienteController = {
  // GET /clientes
  async getAll(req, res, next) {
    try {
      const clientes = await prisma.cliente.findMany({
        orderBy: { createdAt: "desc" },
      });
      return res.status(200).json(clientes);
    } catch (error) {
      next(error);
    }
  },

  // POST /clientes
  async create(req, res, next) {
    try {
      const { nome, telefone, endereco } = req.body;

      if (!nome || typeof nome !== "string" || !nome.trim()) {
        return res.status(400).json({ error: "O campo 'nome' é obrigatório." });
      }

      if (!telefone || typeof telefone !== "string" || !telefone.trim()) {
        return res.status(400).json({ error: "O campo 'telefone' é obrigatório." });
      }

      const cliente = await prisma.cliente.create({
        data: {
          nome: nome.trim(),
          telefone: telefone.trim(),
          endereco: endereco && typeof endereco === "string" ? endereco.trim() : null,
        },
      });

      return res.status(201).json(cliente);
    } catch (error) {
      next(error);
    }
  },
};

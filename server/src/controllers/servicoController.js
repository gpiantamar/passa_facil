import { prisma } from "../lib/prisma.js";

export const servicoController = {
  // GET /servicos
  async getAll(req, res, next) {
    try {
      const servicos = await prisma.servico.findMany({
        orderBy: { nome: "asc" },
      });
      return res.status(200).json(servicos);
    } catch (error) {
      next(error);
    }
  },

  // POST /servicos
  async create(req, res, next) {
    try {
      const { nome, preco, unidade = "un" } = req.body;

      if (!nome || typeof nome !== "string" || !nome.trim()) {
        return res.status(400).json({ error: "O campo 'nome' é obrigatório." });
      }

      const precoNumerico = typeof preco === "number" ? preco : parseFloat(preco);
      if (isNaN(precoNumerico) || precoNumerico <= 0) {
        return res.status(400).json({ error: "O campo 'preco' deve ser um número positivo." });
      }

      const unidadeValida = typeof unidade === "string" ? unidade.toLowerCase().trim() : "un";
      if (!["un", "kg"].includes(unidadeValida)) {
        return res.status(400).json({ error: "A 'unidade' deve ser 'un' ou 'kg'." });
      }

      const servico = await prisma.servico.create({
        data: {
          nome: nome.trim(),
          preco: precoNumerico,
          unidade: unidadeValida,
        },
      });

      return res.status(201).json(servico);
    } catch (error) {
      next(error);
    }
  },
};

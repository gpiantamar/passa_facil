import "dotenv/config";
import { PrismaClient } from "@prisma/client";

// Singleton Prisma para serverless
const globalForPrisma = globalThis;
const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export default async function handler(req, res) {
  Object.entries(corsHeaders).forEach(([k, v]) => res.setHeader(k, v));
  if (req.method === "OPTIONS") return res.status(200).end();

  // GET /api/servicos
  if (req.method === "GET") {
    try {
      const servicos = await prisma.servico.findMany({
        orderBy: { nome: "asc" },
      });
      return res.status(200).json(servicos);
    } catch (error) {
      console.error("[GET /api/servicos]", error);
      return res.status(500).json({ error: "Erro interno ao buscar serviços." });
    }
  }

  // POST /api/servicos
  if (req.method === "POST") {
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
      console.error("[POST /api/servicos]", error);
      return res.status(500).json({ error: "Erro interno ao criar serviço." });
    }
  }

  return res.status(405).json({ error: "Método não permitido." });
}

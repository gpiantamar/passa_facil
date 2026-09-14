import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

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
  // CORS preflight
  Object.entries(corsHeaders).forEach(([k, v]) => res.setHeader(k, v));
  if (req.method === "OPTIONS") return res.status(200).end();

  // GET /api/clientes
  if (req.method === "GET") {
    try {
      const clientes = await prisma.cliente.findMany({
        orderBy: { createdAt: "desc" },
      });
      return res.status(200).json(clientes);
    } catch (error) {
      console.error("[GET /api/clientes]", error);
      return res.status(500).json({ error: "Erro interno ao buscar clientes." });
    }
  }

  // POST /api/clientes
  if (req.method === "POST") {
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
      console.error("[POST /api/clientes]", error);
      if (error.code === "P2002") {
        return res.status(409).json({ error: "Registro duplicado." });
      }
      return res.status(500).json({ error: "Erro interno ao criar cliente." });
    }
  }

  return res.status(405).json({ error: "Método não permitido." });
}

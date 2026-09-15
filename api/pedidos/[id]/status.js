import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "../../_lib/auth.js";

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
  "Access-Control-Allow-Methods": "PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const STATUS_PERMITIDOS = ["recebido", "passando", "pronto", "entregue"];

export default async function handler(req, res) {
  Object.entries(corsHeaders).forEach(([k, v]) => res.setHeader(k, v));
  if (req.method === "OPTIONS") return res.status(200).end();

  // 🔒 Autenticação obrigatória
  const auth = requireAuth(req, res);
  if (!auth) return;

  // PATCH /api/pedidos/[id]/status
  if (req.method === "PATCH") {
    try {
      const { id } = req.query;
      const { status } = req.body;

      // IDs são Int no schema Prisma (autoincrement)
      const parsedId = parseInt(id, 10);
      if (isNaN(parsedId) || parsedId <= 0) {
        return res.status(400).json({ error: "ID do pedido deve ser um número inteiro válido." });
      }

      if (!status || typeof status !== "string") {
        return res.status(400).json({ error: "O campo 'status' é obrigatório." });
      }

      const statusNormalizado = status.toLowerCase().trim();
      if (!STATUS_PERMITIDOS.includes(statusNormalizado)) {
        return res.status(400).json({
          error: `Status inválido: '${status}'. Permitidos: ${STATUS_PERMITIDOS.join(", ")}.`,
        });
      }

      const pedidoExistente = await prisma.pedido.findUnique({ where: { id: parsedId } });
      if (!pedidoExistente) {
        return res.status(404).json({ error: "Pedido não encontrado." });
      }

      const pedidoAtualizado = await prisma.pedido.update({
        where: { id: parsedId },
        data: { status: statusNormalizado },
        include: {
          cliente: true,
          itens: { include: { servico: true } },
        },
      });

      return res.status(200).json(pedidoAtualizado);
    } catch (error) {
      console.error("[PATCH /api/pedidos/[id]/status]", error);
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Pedido não encontrado." });
      }
      return res.status(500).json({ error: "Erro interno ao atualizar status do pedido." });
    }
  }

  return res.status(405).json({ error: "Método não permitido." });
}

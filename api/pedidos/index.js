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

const STATUS_PERMITIDOS = ["recebido", "passando", "pronto", "entregue"];

export default async function handler(req, res) {
  Object.entries(corsHeaders).forEach(([k, v]) => res.setHeader(k, v));
  if (req.method === "OPTIONS") return res.status(200).end();

  // GET /api/pedidos
  if (req.method === "GET") {
    try {
      const pedidos = await prisma.pedido.findMany({
        include: {
          cliente: true,
          itens: { include: { servico: true } },
        },
        orderBy: { createdAt: "desc" },
      });
      return res.status(200).json(pedidos);
    } catch (error) {
      console.error("[GET /api/pedidos]", error);
      return res.status(500).json({ error: "Erro interno ao buscar pedidos." });
    }
  }

  // POST /api/pedidos
  if (req.method === "POST") {
    try {
      const { clienteId, itens, observacoes, previsaoPara, status = "recebido" } = req.body;

      if (!clienteId || typeof clienteId !== "string") {
        return res.status(400).json({ error: "O campo 'clienteId' é obrigatório." });
      }

      const clienteExiste = await prisma.cliente.findUnique({ where: { id: clienteId } });
      if (!clienteExiste) {
        return res.status(404).json({ error: "Cliente não encontrado." });
      }

      if (!Array.isArray(itens) || itens.length === 0) {
        return res.status(400).json({ error: "O pedido deve conter uma lista não vazia de 'itens'." });
      }

      const itensProcessados = [];
      let valorTotalCalculado = 0;

      for (const item of itens) {
        if (!item.servicoId || typeof item.servicoId !== "string") {
          return res.status(400).json({ error: "Cada item do pedido deve possuir um 'servicoId' válido." });
        }

        const quantidade = parseInt(item.quantidade, 10);
        if (isNaN(quantidade) || quantidade <= 0) {
          return res.status(400).json({
            error: `Quantidade inválida para o serviço '${item.servicoId}'. Deve ser um inteiro positivo.`,
          });
        }

        const servico = await prisma.servico.findUnique({ where: { id: item.servicoId } });
        if (!servico) {
          return res.status(404).json({ error: `Serviço com id '${item.servicoId}' não foi encontrado.` });
        }

        const valorUnit =
          item.valorUnit !== undefined && !isNaN(parseFloat(item.valorUnit))
            ? parseFloat(item.valorUnit)
            : servico.preco;

        valorTotalCalculado += quantidade * valorUnit;
        itensProcessados.push({ servicoId: item.servicoId, quantidade, valorUnit });
      }

      const statusFinal = typeof status === "string" ? status.toLowerCase().trim() : "recebido";
      if (!STATUS_PERMITIDOS.includes(statusFinal)) {
        return res.status(400).json({
          error: `Status inválido. Status permitidos: ${STATUS_PERMITIDOS.join(", ")}.`,
        });
      }

      const novoPedido = await prisma.pedido.create({
        data: {
          clienteId,
          status: statusFinal,
          valorTotal: parseFloat(valorTotalCalculado.toFixed(2)),
          observacoes: observacoes && typeof observacoes === "string" ? observacoes.trim() : null,
          previsaoPara: previsaoPara ? new Date(previsaoPara) : null,
          itens: { create: itensProcessados },
        },
        include: {
          cliente: true,
          itens: { include: { servico: true } },
        },
      });

      return res.status(201).json(novoPedido);
    } catch (error) {
      console.error("[POST /api/pedidos]", error);
      if (error.code === "P2002") {
        return res.status(409).json({ error: "Violação de campo único (registro duplicado)." });
      }
      return res.status(500).json({ error: "Erro interno ao criar pedido." });
    }
  }

  return res.status(405).json({ error: "Método não permitido." });
}

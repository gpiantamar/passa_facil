import "dotenv/config";
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3333;

// Middlewares
app.use(cors());
app.use(express.json());

// =============================================
// ROTA BASE / HEALTH CHECK
// =============================================
app.get("/", (req, res) => {
  return res.status(200).json({
    message: "API PassaFácil rodando com sucesso!",
    status: "online",
    endpoints: {
      clientes: "/clientes",
      servicos: "/servicos",
      pedidos: "/pedidos",
    },
  });
});

// =============================================
// ROTAS DE CLIENTES
// =============================================

// GET /clientes: Lista todos os clientes ordenados por nome
app.get("/clientes", async (req, res) => {
  try {
    const clientes = await prisma.cliente.findMany({
      orderBy: { nome: "asc" },
    });
    return res.status(200).json(clientes);
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    return res.status(500).json({ error: "Erro interno ao buscar clientes." });
  }
});

// POST /clientes: Cria novo cliente
app.post("/clientes", async (req, res) => {
  try {
    const { nome, telefone, endereco } = req.body;

    if (!nome || typeof nome !== "string" || !nome.trim()) {
      return res.status(400).json({ error: "O campo 'nome' é obrigatório." });
    }

    if (!telefone || typeof telefone !== "string" || !telefone.trim()) {
      return res.status(400).json({ error: "O campo 'telefone' é obrigatório." });
    }

    const novoCliente = await prisma.cliente.create({
      data: {
        nome: nome.trim(),
        telefone: telefone.trim(),
        endereco: endereco ? String(endereco).trim() : null,
      },
    });

    return res.status(201).json(novoCliente);
  } catch (error) {
    console.error("Erro ao cadastrar cliente:", error);
    return res.status(500).json({ error: "Erro interno ao cadastrar cliente." });
  }
});

// =============================================
// ROTAS DE SERVIÇOS
// =============================================

// GET /servicos: Lista todos os serviços ordenados por nome
app.get("/servicos", async (req, res) => {
  try {
    const servicos = await prisma.servico.findMany({
      orderBy: { nome: "asc" },
    });
    return res.status(200).json(servicos);
  } catch (error) {
    console.error("Erro ao buscar serviços:", error);
    return res.status(500).json({ error: "Erro interno ao buscar serviços." });
  }
});

// POST /servicos: Cria novo serviço
app.post("/servicos", async (req, res) => {
  try {
    const { nome, preco, unidade = "un" } = req.body;

    if (!nome || typeof nome !== "string" || !nome.trim()) {
      return res.status(400).json({ error: "O campo 'nome' é obrigatório." });
    }

    const precoFloat = parseFloat(preco);
    if (isNaN(precoFloat) || precoFloat < 0) {
      return res.status(400).json({ error: "O campo 'preco' deve ser um número válido." });
    }

    const novoServico = await prisma.servico.create({
      data: {
        nome: nome.trim(),
        preco: precoFloat,
        unidade: unidade ? String(unidade).trim().toLowerCase() : "un",
      },
    });

    return res.status(201).json(novoServico);
  } catch (error) {
    console.error("Erro ao cadastrar serviço:", error);
    return res.status(500).json({ error: "Erro interno ao cadastrar serviço." });
  }
});

// =============================================
// ROTAS DE PEDIDOS
// =============================================

// GET /pedidos: Lista todos os pedidos com cliente, itens e serviços associados
app.get("/pedidos", async (req, res) => {
  try {
    const pedidos = await prisma.pedido.findMany({
      include: {
        cliente: true,
        itens: {
          include: {
            servico: true,
          },
        },
      },
      orderBy: {
        criadoEm: "desc",
      },
    });
    return res.status(200).json(pedidos);
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    return res.status(500).json({ error: "Erro interno ao buscar pedidos." });
  }
});

// POST /pedidos: Cria pedido calculando automaticamente o valorTotal dos itens
app.post("/pedidos", async (req, res) => {
  try {
    const { clienteId, observacoes, itens, status, previsaoPara } = req.body;

    const parsedClienteId = parseInt(clienteId, 10);
    if (isNaN(parsedClienteId)) {
      return res.status(400).json({ error: "O campo 'clienteId' deve ser um número inteiro válido." });
    }

    // Verifica se o cliente existe
    const clienteExiste = await prisma.cliente.findUnique({
      where: { id: parsedClienteId },
    });

    if (!clienteExiste) {
      return res.status(404).json({ error: "Cliente informado não foi encontrado." });
    }

    if (!Array.isArray(itens) || itens.length === 0) {
      return res.status(400).json({ error: "O pedido deve conter pelo menos um item no array 'itens'." });
    }

    let valorTotal = 0;
    const itensFormatados = [];

    for (const item of itens) {
      const servicoId = parseInt(item.servicoId, 10);
      const quantidade = parseInt(item.quantidade, 10);

      if (isNaN(servicoId) || isNaN(quantidade) || quantidade <= 0) {
        return res.status(400).json({
          error: "Cada item deve possuir 'servicoId' e 'quantidade' maior que zero.",
        });
      }

      // Se valorUnit não foi informado, busca o valor do serviço no banco
      let valorUnit = item.valorUnit !== undefined ? parseFloat(item.valorUnit) : null;

      if (valorUnit === null || isNaN(valorUnit)) {
        const servico = await prisma.servico.findUnique({
          where: { id: servicoId },
        });

        if (!servico) {
          return res.status(404).json({ error: `Serviço com ID ${servicoId} não foi encontrado.` });
        }

        valorUnit = servico.preco;
      }

      const subtotal = quantidade * valorUnit;
      valorTotal += subtotal;

      itensFormatados.push({
        servicoId,
        quantidade,
        valorUnit: parseFloat(valorUnit.toFixed(2)),
      });
    }

    const novoPedido = await prisma.pedido.create({
      data: {
        clienteId: parsedClienteId,
        status: status && typeof status === "string" ? status.trim().toLowerCase() : "recebido",
        valorTotal: parseFloat(valorTotal.toFixed(2)),
        observacoes: observacoes ? String(observacoes).trim() : null,
        previsaoPara: previsaoPara ? new Date(previsaoPara) : null,
        itens: {
          create: itensFormatados,
        },
      },
      include: {
        cliente: true,
        itens: {
          include: {
            servico: true,
          },
        },
      },
    });

    return res.status(201).json(novoPedido);
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    return res.status(500).json({ error: "Erro interno ao criar pedido." });
  }
});

// PATCH /pedidos/:id/status: Atualiza o status do pedido
app.patch("/pedidos/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      return res.status(400).json({ error: "ID do pedido deve ser um número inteiro válido." });
    }

    if (!status || typeof status !== "string" || !status.trim()) {
      return res.status(400).json({ error: "O campo 'status' é obrigatório no corpo da requisição." });
    }

    const pedidoExistente = await prisma.pedido.findUnique({
      where: { id: parsedId },
    });

    if (!pedidoExistente) {
      return res.status(404).json({ error: "Pedido não encontrado." });
    }

    const pedidoAtualizado = await prisma.pedido.update({
      where: { id: parsedId },
      data: {
        status: status.trim().toLowerCase(),
      },
      include: {
        cliente: true,
        itens: {
          include: {
            servico: true,
          },
        },
      },
    });

    return res.status(200).json(pedidoAtualizado);
  } catch (error) {
    console.error("Erro ao atualizar status do pedido:", error);
    return res.status(500).json({ error: "Erro interno ao atualizar status do pedido." });
  }
});

// =============================================
// INICIALIZAÇÃO DO SERVIDOR
// =============================================
app.listen(PORT, () => {
  console.log(`🚀 Servidor PassaFácil rodando em http://localhost:${PORT}`);
  console.log(`📋 Rotas disponíveis:`);
  console.log(`   - GET/POST  http://localhost:${PORT}/clientes`);
  console.log(`   - GET/POST  http://localhost:${PORT}/servicos`);
  console.log(`   - GET/POST  http://localhost:${PORT}/pedidos`);
  console.log(`   - PATCH     http://localhost:${PORT}/pedidos/:id/status`);
});

export default app;

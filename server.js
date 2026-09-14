import "dotenv/config";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3333;

// =============================================
// 1. CONFIGURAÇÃO DE CORS PERMISSIVO TOTAL
// =============================================
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// =============================================
// 2. BODY PARSERS GLOBAIS
// =============================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =============================================
// 3. MIDDLEWARE GLOBAL DE LOGGING
// =============================================
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`, req.body);
  next();
});

// =============================================
// 4. ROTA DE HEALTH CHECK / STATUS
// =============================================
const handleStatus = (req, res) => {
  return res.status(200).json({
    ok: true,
    timestamp: new Date(),
  });
};

app.get("/api/status", handleStatus);
app.get("/status", handleStatus);
app.get("/", handleStatus);

// =============================================
// 5. AUTENTICAÇÃO
// =============================================
const handleLogin = (req, res) => {
  const { email, password } = req.body || {};
  const appEmail = process.env.APP_EMAIL || "admin@passafacil.com";
  const appPassword = process.env.APP_PASSWORD || "admin123";
  const jwtSecret = process.env.JWT_SECRET || "passafacil-super-secret-key-development";

  if (!email || !password) {
    return res.status(400).json({ erro: "Email e senha são obrigatórios." });
  }

  if (email !== appEmail || password !== appPassword) {
    return res.status(401).json({ erro: "Credenciais inválidas. Verifique seu e-mail e senha." });
  }

  const token = jwt.sign({ role: "admin", email }, jwtSecret, { expiresIn: "7d" });
  return res.status(200).json({ token, expiresIn: 604800 });
};

app.post("/api/auth/login", handleLogin);
app.post("/auth/login", handleLogin);

// =============================================
// 6. ROTAS DE CLIENTES
// =============================================

// GET /clientes e /api/clientes
const handleGetClientes = async (req, res, next) => {
  try {
    const clientes = await prisma.cliente.findMany({
      orderBy: { nome: "asc" },
      include: {
        pedidos: {
          select: { id: true, criadoEm: true, valorTotal: true, status: true },
          orderBy: { criadoEm: "desc" },
        },
      },
    });
    return res.status(200).json(clientes);
  } catch (error) {
    next(error);
  }
};

app.get("/clientes", handleGetClientes);
app.get("/api/clientes", handleGetClientes);

// POST /clientes e /api/clientes
const handleCreateCliente = async (req, res, next) => {
  try {
    const { nome, telefone, endereco } = req.body || {};

    if (!nome || typeof nome !== "string" || !nome.trim()) {
      return res.status(400).json({ erro: "O campo 'nome' é obrigatório." });
    }

    if (!telefone || typeof telefone !== "string" || !telefone.trim()) {
      return res.status(400).json({ erro: "O campo 'telefone' é obrigatório." });
    }

    const novoCliente = await prisma.cliente.create({
      data: {
        nome: nome.trim(),
        telefone: telefone.trim(),
        endereco: endereco && typeof endereco === "string" ? endereco.trim() : null,
      },
    });

    return res.status(201).json(novoCliente);
  } catch (error) {
    next(error);
  }
};

app.post("/clientes", handleCreateCliente);
app.post("/api/clientes", handleCreateCliente);

// =============================================
// 7. ROTAS DE SERVIÇOS (CATÁLOGO DE PEÇAS)
// =============================================

// GET /servicos e /api/servicos
const handleGetServicos = async (req, res, next) => {
  try {
    const servicos = await prisma.servico.findMany({
      orderBy: { nome: "asc" },
    });
    return res.status(200).json(servicos);
  } catch (error) {
    next(error);
  }
};

app.get("/servicos", handleGetServicos);
app.get("/api/servicos", handleGetServicos);

// POST /servicos e /api/servicos com parseFloat()
const handleCreateServico = async (req, res, next) => {
  try {
    const { nome, preco, unidade = "un" } = req.body || {};

    if (!nome || typeof nome !== "string" || !nome.trim()) {
      return res.status(400).json({ erro: "O campo 'nome' é obrigatório." });
    }

    // Conversão explícita com parseFloat()
    const precoFloat = parseFloat(preco);
    if (isNaN(precoFloat) || precoFloat < 0) {
      return res.status(400).json({ erro: "O campo 'preco' deve ser um número válido e positivo." });
    }

    const unidadeLimpa =
      typeof unidade === "string" && ["un", "kg"].includes(unidade.toLowerCase().trim())
        ? unidade.toLowerCase().trim()
        : "un";

    const novoServico = await prisma.servico.create({
      data: {
        nome: nome.trim(),
        preco: precoFloat,
        unidade: unidadeLimpa,
      },
    });

    return res.status(201).json(novoServico);
  } catch (error) {
    next(error);
  }
};

app.post("/servicos", handleCreateServico);
app.post("/api/servicos", handleCreateServico);

// =============================================
// 8. ROTAS DE PEDIDOS (COMANDAS OPERACIONAIS)
// =============================================

// GET /pedidos e /api/pedidos
const handleGetPedidos = async (req, res, next) => {
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
    next(error);
  }
};

app.get("/pedidos", handleGetPedidos);
app.get("/api/pedidos", handleGetPedidos);

// POST /pedidos e /api/pedidos com parseInt() e parseFloat()
const handleCreatePedido = async (req, res, next) => {
  try {
    const { clienteId, observacoes, itens, status, previsaoPara } = req.body || {};

    // Conversão explícita de clienteId com parseInt()
    const parsedClienteId = parseInt(clienteId, 10);
    if (isNaN(parsedClienteId) || parsedClienteId <= 0) {
      return res.status(400).json({ erro: "O campo 'clienteId' deve ser um número inteiro válido." });
    }

    // Valida se cliente existe no banco
    const clienteExiste = await prisma.cliente.findUnique({
      where: { id: parsedClienteId },
    });
    if (!clienteExiste) {
      return res.status(404).json({ erro: `Cliente com ID ${parsedClienteId} não foi encontrado.` });
    }

    if (!Array.isArray(itens) || itens.length === 0) {
      return res.status(400).json({ erro: "O pedido deve conter pelo menos um item na lista 'itens'." });
    }

    let valorTotal = 0;
    const itensFormatados = [];

    for (const item of itens) {
      // Conversão explícita de servicoId e quantidade com parseInt()
      const servicoId = parseInt(item.servicoId, 10);
      const quantidade = parseInt(item.quantidade, 10);

      if (isNaN(servicoId) || isNaN(quantidade) || quantidade <= 0) {
        return res.status(400).json({
          erro: "Cada item deve possuir 'servicoId' válido e 'quantidade' maior que zero.",
        });
      }

      // Conversão explícita de valorUnit com parseFloat()
      let valorUnit =
        item.valorUnit !== undefined && item.valorUnit !== null && !isNaN(parseFloat(item.valorUnit))
          ? parseFloat(item.valorUnit)
          : null;

      if (valorUnit === null || isNaN(valorUnit)) {
        const servico = await prisma.servico.findUnique({
          where: { id: servicoId },
        });
        if (!servico) {
          return res.status(404).json({ erro: `Serviço com ID ${servicoId} não foi encontrado.` });
        }
        valorUnit = parseFloat(servico.preco);
      }

      if (isNaN(valorUnit)) {
        return res.status(400).json({ erro: `Valor unitário inválido para o serviço ID ${servicoId}.` });
      }

      const subtotal = quantidade * valorUnit;
      valorTotal += subtotal;

      itensFormatados.push({
        servicoId,
        quantidade,
        valorUnit: parseFloat(valorUnit.toFixed(2)),
      });
    }

    const statusPermitidos = ["recebido", "passando", "em andamento", "pronto", "entregue", "finalizado"];
    const statusFinal =
      status && typeof status === "string" && statusPermitidos.includes(status.trim().toLowerCase())
        ? status.trim().toLowerCase()
        : "recebido";

    const novoPedido = await prisma.pedido.create({
      data: {
        clienteId: parsedClienteId,
        status: statusFinal,
        valorTotal: parseFloat(valorTotal.toFixed(2)),
        observacoes: observacoes && typeof observacoes === "string" ? observacoes.trim() : null,
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
    next(error);
  }
};

app.post("/pedidos", handleCreatePedido);
app.post("/api/pedidos", handleCreatePedido);

// PATCH /pedidos/:id/status e /api/pedidos/:id/status com parseInt()
const handleUpdatePedidoStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body || {};

    // Conversão explícita de req.params.id com parseInt()
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId) || parsedId <= 0) {
      return res.status(400).json({ erro: "O ID do pedido deve ser um número inteiro válido." });
    }

    if (!status || typeof status !== "string" || !status.trim()) {
      return res.status(400).json({ erro: "O campo 'status' é obrigatório no corpo da requisição." });
    }

    const pedidoExistente = await prisma.pedido.findUnique({
      where: { id: parsedId },
    });
    if (!pedidoExistente) {
      return res.status(404).json({ erro: "Pedido não encontrado." });
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
    next(error);
  }
};

app.patch("/pedidos/:id/status", handleUpdatePedidoStatus);
app.patch("/api/pedidos/:id/status", handleUpdatePedidoStatus);

// =============================================
// 9. MIDDLEWARE GLOBAL DE TRATAMENTO DE ERRO (4 PARÂMETROS)
// =============================================
app.use((err, req, res, next) => {
  console.error(`[ERRO INTERNO] ${req.method} ${req.url}:`, err);
  return res.status(500).json({
    erro: err.message || "Erro interno no servidor.",
  });
});

// =============================================
// 10. INICIALIZAÇÃO DO SERVIDOR
// =============================================
app.listen(PORT, () => {
  console.log(`🚀 Servidor PassaFácil rodando em http://localhost:${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/status`);
  console.log(`📋 Endpoints operacionais:`);
  console.log(`   - GET/POST  http://localhost:${PORT}/api/clientes`);
  console.log(`   - GET/POST  http://localhost:${PORT}/api/servicos`);
  console.log(`   - GET/POST  http://localhost:${PORT}/api/pedidos`);
  console.log(`   - PATCH     http://localhost:${PORT}/api/pedidos/:id/status`);
});

export default app;

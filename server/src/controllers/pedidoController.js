import { prisma } from "../lib/prisma.js";

const STATUS_PERMITIDOS = ["recebido", "passando", "pronto", "entregue"];

export const pedidoController = {
  // GET /pedidos
  // Retorna todos os pedidos com include de cliente, itens e serviços associados,
  // ordenados por data decrescente (createdAt: "desc")
  async getAll(req, res, next) {
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
          createdAt: "desc",
        },
      });

      return res.status(200).json(pedidos);
    } catch (error) {
      next(error);
    }
  },

  // POST /pedidos
  // Calcula automaticamente o valorTotal a partir dos itens recebidos (quantidade * valorUnit)
  async create(req, res, next) {
    try {
      const { clienteId, itens, observacoes, previsaoPara, status = "recebido" } = req.body;

      // Validação do clienteId
      if (!clienteId || typeof clienteId !== "string") {
        return res.status(400).json({ error: "O campo 'clienteId' é obrigatório." });
      }

      const clienteExiste = await prisma.cliente.findUnique({
        where: { id: clienteId },
      });

      if (!clienteExiste) {
        return res.status(404).json({ error: "Cliente não encontrado." });
      }

      // Validação dos itens
      if (!Array.isArray(itens) || itens.length === 0) {
        return res.status(400).json({
          error: "O pedido deve conter uma lista não vazia de 'itens'.",
        });
      }

      // Validação e cálculo automático de cada item
      const itensProcessados = [];
      let valorTotalCalculado = 0;

      for (const item of itens) {
        if (!item.servicoId || typeof item.servicoId !== "string") {
          return res.status(400).json({
            error: "Cada item do pedido deve possuir um 'servicoId' válido.",
          });
        }

        const quantidade = parseInt(item.quantidade, 10);
        if (isNaN(quantidade) || quantidade <= 0) {
          return res.status(400).json({
            error: `Quantidade inválida para o serviço '${item.servicoId}'. Deve ser um inteiro positivo.`,
          });
        }

        // Busca o serviço para obter ou validar o preço
        const servico = await prisma.servico.findUnique({
          where: { id: item.servicoId },
        });

        if (!servico) {
          return res.status(404).json({
            error: `Serviço com id '${item.servicoId}' não foi encontrado.`,
          });
        }

        // Se o valorUnit foi fornecido no payload, utiliza-o; caso contrário, utiliza o preço cadastrado no serviço
        const valorUnit =
          item.valorUnit !== undefined && !isNaN(parseFloat(item.valorUnit))
            ? parseFloat(item.valorUnit)
            : servico.preco;

        const subtotal = quantidade * valorUnit;
        valorTotalCalculado += subtotal;

        itensProcessados.push({
          servicoId: item.servicoId,
          quantidade,
          valorUnit,
        });
      }

      // Validação do status
      const statusFinal = typeof status === "string" ? status.toLowerCase().trim() : "recebido";
      if (!STATUS_PERMITIDOS.includes(statusFinal)) {
        return res.status(400).json({
          error: `Status inválido. Status permitidos: ${STATUS_PERMITIDOS.join(", ")}.`,
        });
      }

      // Criação transacional do pedido com seus itens
      const novoPedido = await prisma.pedido.create({
        data: {
          clienteId,
          status: statusFinal,
          valorTotal: parseFloat(valorTotalCalculado.toFixed(2)),
          observacoes: observacoes && typeof observacoes === "string" ? observacoes.trim() : null,
          previsaoPara: previsaoPara ? new Date(previsaoPara) : null,
          itens: {
            create: itensProcessados,
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
  },

  // PATCH /pedidos/:id/status
  // Atualiza o status do pedido ("recebido", "passando", "pronto", "entregue")
  async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status || typeof status !== "string") {
        return res.status(400).json({ error: "O campo 'status' é obrigatório." });
      }

      const statusNormalizado = status.toLowerCase().trim();
      if (!STATUS_PERMITIDOS.includes(statusNormalizado)) {
        return res.status(400).json({
          error: `Status inválido: '${status}'. Status permitidos: ${STATUS_PERMITIDOS.join(", ")}.`,
        });
      }

      const pedidoExistente = await prisma.pedido.findUnique({
        where: { id },
      });

      if (!pedidoExistente) {
        return res.status(404).json({ error: "Pedido não encontrado." });
      }

      const pedidoAtualizado = await prisma.pedido.update({
        where: { id },
        data: { status: statusNormalizado },
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
  },
};

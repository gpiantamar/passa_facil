// API Client centralizado para o front-end Passa Fácil
// Em produção (Vercel), as chamadas vão para /api/* no mesmo domínio.
// Em dev local, aponta para o servidor Express rodando em localhost.
const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? "/api" : "http://localhost:3333/api");

/**
 * Utilitário de requisição genérico com tratamento de erros robusto.
 */
async function request(endpoint, options = {}) {
  // Garante que o endpoint não duplica o prefixo /api
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      let errorMessage = `Erro ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData?.error) errorMessage = errorData.error;
        else if (errorData?.message) errorMessage = errorData.message;
      } catch {
        // Ignora falha de parse JSON de resposta de erro
      }
      throw new Error(errorMessage);
    }

    // Se resposta não tiver conteúdo (ex: 204)
    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      console.error(`[API] Não foi possível conectar ao servidor em ${API_BASE_URL}. O backend está ativo?`);
      throw new Error("Não foi possível conectar ao servidor. Verifique se o back-end está ativo.");
    }
    throw error;
  }
}

// =============================================
// CLIENTES
// =============================================

/**
 * Busca todos os clientes cadastrados ordenados alfabeticamente.
 */
export async function getClientes() {
  return await request("/clientes");
}

/**
 * Cria um novo cliente.
 * @param {{ nome: string, telefone: string, endereco?: string }} param0
 */
export async function criarCliente({ nome, telefone, endereco }) {
  return await request("/clientes", {
    method: "POST",
    body: JSON.stringify({ nome, telefone, endereco }),
  });
}

// =============================================
// SERVIÇOS (CATÁLOGO DE PEÇAS)
// =============================================

/**
 * Busca todos os tipos de serviço/peças disponíveis no catálogo.
 */
export async function getServicos() {
  return await request("/servicos");
}

/**
 * Cadastra um novo serviço/tipo de peça no catálogo.
 * @param {{ nome: string, preco: number, unidade?: string }} param0
 */
export async function criarServico({ nome, preco, unidade = "un" }) {
  return await request("/servicos", {
    method: "POST",
    body: JSON.stringify({
      nome,
      preco: typeof preco === "number" ? preco : parseFloat(preco),
      unidade,
    }),
  });
}

// =============================================
// PEDIDOS
// =============================================

/**
 * Busca todos os pedidos incluindo cliente, itens e serviços associados.
 */
export async function getPedidos() {
  return await request("/pedidos");
}

/**
 * Cria um novo pedido com seus respectivos itens.
 * @param {{
 *   clienteId: number | string,
 *   observacoes?: string,
 *   previsaoPara?: string,
 *   status?: string,
 *   itens: Array<{ servicoId: number | string, quantidade: number, valorUnit?: number }>
 * }} param0
 */
export async function criarPedido({ clienteId, observacoes, itens, previsaoPara, status }) {
  const payload = {
    clienteId: String(clienteId),   // UUID — não converter para int
    observacoes: observacoes ? String(observacoes).trim() : null,
    previsaoPara: previsaoPara || null,
    status: status || "recebido",
    itens: itens.map((item) => ({
      servicoId: String(item.servicoId),   // UUID — não converter para int
      quantidade: parseInt(item.quantidade, 10),
      ...(item.valorUnit !== undefined && { valorUnit: parseFloat(item.valorUnit) }),
    })),
  };

  return await request("/pedidos", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Atualiza o status de um pedido existente.
 * @param {number | string} pedidoId
 * @param {"recebido" | "passando" | "em andamento" | "pronto" | "entregue" | string} status
 */
export async function atualizarStatusPedido(pedidoId, status) {
  return await request(`/pedidos/${pedidoId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export const api = {
  getClientes,
  criarCliente,
  getServicos,
  criarServico,
  getPedidos,
  criarPedido,
  atualizarStatusPedido,
};

export default api;

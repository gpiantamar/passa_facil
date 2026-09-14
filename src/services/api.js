// ============================================================================
// SERVIÇO DE CONEXÃO COM A API - PASSA FÁCIL
// Configurado com fallback inteligente, blindagem de CORS e conversão de tipos
// ============================================================================

// 1. Definição da URL base com fallback à prova de falhas
export const API_URL =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_URL) ||
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
  "http://localhost:3333";

// Remove barras no final para garantir padronização dos caminhos
const BASE_URL = API_URL.replace(/\/+$/, "");

/**
 * Função centralizadora de fetch que:
 * - Sempre injeta o header 'Content-Type': 'application/json'
 * - Injeta o token JWT de autenticação do localStorage se disponível
 * - Verifica if (!res.ok) lançando erro detalhado com o status e a mensagem da API
 * - Envolve toda requisição em try/catch detalhado printando no console
 */
export async function request(endpoint, options = {}) {
  // Garante que o endpoint comece com '/'
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${BASE_URL}${cleanEndpoint}`;

  const token = typeof window !== "undefined" ? localStorage.getItem("pf_auth_token") : null;

  const config = {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  };

  try {
    const res = await fetch(url, config);

    if (!res.ok) {
      // Notifica deslogamento suave se token expirar
      if (res.status === 401 && typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("pf:unauthorized"));
      }

      let errorDetail = `Status ${res.status} (${res.statusText})`;
      try {
        const errorData = await res.json();
        if (errorData?.erro) {
          errorDetail = errorData.erro;
        } else if (errorData?.error) {
          errorDetail = errorData.error;
        } else if (errorData?.message) {
          errorDetail = errorData.message;
        }
      } catch {
        try {
          const errorText = await res.text();
          if (errorText) errorDetail = `${errorDetail}: ${errorText}`;
        } catch {
          // Ignora erro de parsing do texto
        }
      }

      throw new Error(`Falha na requisição [${config.method} ${cleanEndpoint}]: ${errorDetail}`);
    }

    if (res.status === 204) {
      return null;
    }

    return await res.json();
  } catch (erro) {
    console.error(`Erro na requisição ${endpoint}:`, erro);
    throw erro;
  }
}

// ============================================================================
// 1. HEALTH CHECK / STATUS
// ============================================================================
export async function getStatus() {
  return await request("/api/status");
}

export const checkStatus = getStatus;

// ============================================================================
// 2. AUTENTICAÇÃO
// ============================================================================
export async function login({ email, password }) {
  return await request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

// ============================================================================
// 3. CLIENTES
// ============================================================================
export async function getClientes() {
  return await request("/api/clientes");
}

export async function criarCliente({ nome, telefone, endereco }) {
  const payload = {
    nome: String(nome || "").trim(),
    telefone: String(telefone || "").trim(),
    endereco: endereco ? String(endereco).trim() : null,
  };

  return await request("/api/clientes", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ============================================================================
// 4. SERVIÇOS (CATÁLOGO DE PEÇAS)
// ============================================================================
export async function getServicos() {
  return await request("/api/servicos");
}

export async function criarServico({ nome, preco, unidade = "un" }) {
  const precoNumerico = Number(preco);
  if (isNaN(precoNumerico) || precoNumerico < 0) {
    throw new Error("O preço do serviço deve ser um número válido e positivo.");
  }

  const payload = {
    nome: String(nome || "").trim(),
    preco: precoNumerico,
    unidade: String(unidade || "un").trim(),
  };

  return await request("/api/servicos", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ============================================================================
// 5. PEDIDOS (COMANDAS OPERACIONAIS)
// ============================================================================
export async function getPedidos() {
  return await request("/api/pedidos");
}

export async function criarPedido({ clienteId, observacoes, itens, previsaoPara, status }) {
  const numericClienteId = Number(clienteId);
  if (isNaN(numericClienteId) || numericClienteId <= 0) {
    throw new Error("clienteId inválido: deve ser um número inteiro válido.");
  }

  if (!Array.isArray(itens) || itens.length === 0) {
    throw new Error("O pedido deve conter pelo menos 1 item.");
  }

  const payload = {
    clienteId: numericClienteId,
    observacoes: observacoes ? String(observacoes).trim() : null,
    previsaoPara: previsaoPara || null,
    status: status || "recebido",
    itens: itens.map((item) => {
      const servicoId = Number(item.servicoId);
      const quantidade = Number(item.quantidade);
      const valorUnit =
        item.valorUnit !== undefined && item.valorUnit !== null
          ? Number(item.valorUnit)
          : undefined;

      if (isNaN(servicoId) || isNaN(quantidade) || quantidade <= 0) {
        throw new Error("Cada item deve ter 'servicoId' e 'quantidade' numéricos válidos.");
      }

      return {
        servicoId,
        quantidade,
        ...(valorUnit !== undefined && !isNaN(valorUnit) ? { valorUnit } : {}),
      };
    }),
  };

  return await request("/api/pedidos", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function atualizarStatusPedido(pedidoId, status) {
  const numericPedidoId = Number(pedidoId);
  if (isNaN(numericPedidoId) || numericPedidoId <= 0) {
    throw new Error("ID do pedido inválido: deve ser um número.");
  }

  return await request(`/api/pedidos/${numericPedidoId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status: String(status || "").trim().toLowerCase() }),
  });
}

// ============================================================================
// EXPORTAÇÃO CENTRALIZADA
// ============================================================================
export const api = {
  API_URL,
  request,
  getStatus,
  checkStatus,
  login,
  getClientes,
  criarCliente,
  getServicos,
  criarServico,
  getPedidos,
  criarPedido,
  atualizarStatusPedido,
};

export default api;

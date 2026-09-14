export interface ClienteApi {
  id: number;
  nome: string;
  telefone: string;
  endereco: string | null;
  criadoEm: string;
  pedidos?: Array<{ id: number; criadoEm: string; valorTotal: number; status: string }>;
}

export interface ServicoApi {
  id: number;
  nome: string;
  preco: number;
  unidade: string;
}

export interface ItemPedidoApi {
  id: number;
  pedidoId: number;
  servicoId: number;
  quantidade: number;
  valorUnit: number;
  servico?: ServicoApi;
}

export interface PedidoApi {
  id: number;
  clienteId: number;
  cliente: ClienteApi;
  status: string;
  valorTotal: number;
  observacoes: string | null;
  criadoEm: string;
  previsaoPara: string | null;
  itens: ItemPedidoApi[];
}

export const API_URL: string;
export function request<T = any>(endpoint: string, options?: RequestInit): Promise<T>;
export function getStatus(): Promise<{ ok: boolean; timestamp: string }>;
export function checkStatus(): Promise<{ ok: boolean; timestamp: string }>;

export function getClientes(): Promise<ClienteApi[]>;
export function criarCliente(data: { nome: string; telefone: string; endereco?: string | null }): Promise<ClienteApi>;

export function getServicos(): Promise<ServicoApi[]>;
export function criarServico(data: { nome: string; preco: number | string; unidade?: string }): Promise<ServicoApi>;

export function getPedidos(): Promise<PedidoApi[]>;
export function criarPedido(data: {
  clienteId: number | string;
  observacoes?: string | null;
  previsaoPara?: string | null;
  status?: string;
  itens: Array<{ servicoId: number | string; quantidade: number; valorUnit?: number }>;
}): Promise<PedidoApi>;

export function atualizarStatusPedido(pedidoId: number | string, status: string): Promise<PedidoApi>;

export function login(credentials: { email: string; password: string }): Promise<{ token: string; expiresIn: number }>;

export const api: {
  API_URL: string;
  request: typeof request;
  getStatus: typeof getStatus;
  checkStatus: typeof checkStatus;
  login: typeof login;
  getClientes: typeof getClientes;
  criarCliente: typeof criarCliente;
  getServicos: typeof getServicos;
  criarServico: typeof criarServico;
  getPedidos: typeof getPedidos;
  criarPedido: typeof criarPedido;
  atualizarStatusPedido: typeof atualizarStatusPedido;
};

export default api;

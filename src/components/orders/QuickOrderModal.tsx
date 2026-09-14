import React, { useState, useEffect } from "react";
import {
  Plus,
  Minus,
  Search,
  UserPlus,
  Calendar,
  AlertCircle,
  ShoppingBag,
  Check,
  X,
  Clock,
  Shirt,
} from "lucide-react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { PhoneInput } from "../ui/PhoneInput";
import { getClientes, getServicos, criarCliente, criarPedido } from "../../services/api.js";
import { formatCurrency, todayISO } from "../../utils/formatters";
import { useToastContext } from "../../lib/toastContext";

interface ClienteItem {
  id: string | number;
  nome: string;
  telefone: string;
  endereco?: string | null;
}

interface ServicoItem {
  id: string | number;
  nome: string;
  preco: number;
  unidade: string;
}

interface QuickOrderModalProps {
  open: boolean;
  onClose: () => void;
  onOrderCreated?: () => void;
}

export function QuickOrderModal({ open, onClose, onOrderCreated }: QuickOrderModalProps) {
  const { addToast } = useToastContext();

  const [clients, setClients] = useState<ClienteItem[]>([]);
  const [services, setServices] = useState<ServicoItem[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(false);

  // Cliente selecionado
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [clientSearch, setClientSearch] = useState<string>("");
  const [showNewClientForm, setShowNewClientForm] = useState(false);

  // Formulário rápido de novo cliente
  const [newClientName, setNewClientName] = useState("");
  const [newClientPhone, setNewClientPhone] = useState("");
  const [newClientAddress, setNewClientAddress] = useState("");
  const [savingClient, setSavingClient] = useState(false);

  // Itens da comanda: mapa de servicoId -> quantidade
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  // Datas e observações
  const [previsaoPara, setPrevisaoPara] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [observacoes, setObservacoes] = useState("");
  const [submittingOrder, setSubmittingOrder] = useState(false);

  // Carregar clientes e serviços ao abrir o modal
  useEffect(() => {
    if (!open) return;
    setLoadingInitial(true);
    Promise.all([getClientes(), getServicos()])
      .then(([cls, srvs]) => {
        setClients(cls || []);
        setServices(srvs || []);
      })
      .catch((err) => {
        console.error("Erro ao carregar dados da comanda:", err);
        addToast("Falha ao carregar lista de clientes e serviços.", "error");
      })
      .finally(() => setLoadingInitial(false));
  }, [open, addToast]);

  // Limpar estado ao fechar
  const handleClose = () => {
    setSelectedClientId("");
    setClientSearch("");
    setShowNewClientForm(false);
    setNewClientName("");
    setNewClientPhone("");
    setNewClientAddress("");
    setQuantities({});
    setObservacoes("");
    onClose();
  };

  // Alterar quantidade com (+) e (-)
  const setItemQuantity = (servicoId: string, qty: number) => {
    const cleanQty = Math.max(0, qty);
    setQuantities((prev) => {
      if (cleanQty === 0) {
        const next = { ...prev };
        delete next[servicoId];
        return next;
      }
      return { ...prev, [servicoId]: cleanQty };
    });
  };

  // Cadastrar novo cliente rapidamente
  const handleSaveQuickClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim()) {
      addToast("Informe o nome do cliente.", "warning");
      return;
    }
    const cleanDigits = newClientPhone.replace(/\D/g, "");
    if (cleanDigits.length < 10) {
      addToast("Informe um telefone válido com DDD.", "warning");
      return;
    }

    setSavingClient(true);
    try {
      const criado = await criarCliente({
        nome: newClientName.trim(),
        telefone: newClientPhone.trim(),
        endereco: newClientAddress.trim() || undefined,
      });

      addToast(`Cliente "${criado.nome}" cadastrado com sucesso!`, "success");
      setClients((prev) => [criado, ...prev]);
      setSelectedClientId(String(criado.id));
      setShowNewClientForm(false);
      setNewClientName("");
      setNewClientPhone("");
      setNewClientAddress("");
    } catch (err: any) {
      console.error("Erro ao cadastrar cliente rápido:", err);
      addToast(err?.message || "Erro ao salvar novo cliente.", "error");
    } finally {
      setSavingClient(false);
    }
  };

  // Clientes filtrados na busca
  const filteredClients = clients.filter((c) => {
    if (!clientSearch) return true;
    const term = clientSearch.toLowerCase();
    return c.nome.toLowerCase().includes(term) || (c.telefone && c.telefone.includes(term));
  });

  // Cálculos dinâmicos em tempo real
  const selectedItems = Object.entries(quantities)
    .filter(([_, qty]) => qty > 0)
    .map(([servicoId, qty]) => {
      const servico = services.find((s) => String(s.id) === String(servicoId));
      const preco = servico ? Number(servico.preco) || 0 : 0;
      return {
        servicoId,
        nome: servico?.nome || `Peça #${servicoId}`,
        preco,
        quantidade: qty,
        subtotal: qty * preco,
      };
    });

  const totalPieces = selectedItems.reduce((acc, it) => acc + it.quantidade, 0);
  const totalAmount = selectedItems.reduce((acc, it) => acc + it.subtotal, 0);

  // Submeter Pedido / Comanda
  const handleSubmitOrder = async () => {
    if (!selectedClientId) {
      addToast("Selecione um cliente para a comanda.", "warning");
      return;
    }

    if (selectedItems.length === 0) {
      addToast("Adicione ao menos uma peça na comanda.", "warning");
      return;
    }

    setSubmittingOrder(true);
    try {
      const payload = {
        clienteId: String(selectedClientId),
        observacoes: observacoes.trim() || undefined,
        previsaoPara: previsaoPara ? new Date(previsaoPara).toISOString() : undefined,
        status: "recebido",
        itens: selectedItems.map((it) => ({
          servicoId: String(it.servicoId),
          quantidade: it.quantidade,
          valorUnit: it.preco,
        })),
      };

      await criarPedido(payload);
      addToast("Comanda registrada com sucesso!", "success");
      handleClose();
      if (onOrderCreated) {
        onOrderCreated();
      }
    } catch (err: any) {
      console.error("Erro ao criar comanda:", err);
      addToast(err?.message || "Erro ao registrar comanda no sistema.", "error");
    } finally {
      setSubmittingOrder(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Nova Entrada de Roupas (Comanda Rápida)"
      size="lg"
    >
      <div className="flex flex-col gap-5 max-h-[80vh] overflow-y-auto pr-1">
        {/* ── 1. SELEÇÃO DE CLIENTE ───────────────────────────────────────── */}
        <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-200/80">
          <div className="flex items-center justify-between mb-2.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <span>1. Cliente da Comanda</span>
              <span className="text-red-500">*</span>
            </label>
            {!showNewClientForm && (
              <button
                type="button"
                onClick={() => setShowNewClientForm(true)}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Novo Cliente</span>
              </button>
            )}
          </div>

          {/* Subformulário inline de novo cliente */}
          {showNewClientForm ? (
            <div className="bg-white rounded-xl p-3.5 border border-indigo-200 shadow-xs flex flex-col gap-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-indigo-700">Cadastro Rápido de Cliente</p>
                <button
                  type="button"
                  onClick={() => setShowNewClientForm(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Nome completo *"
                  placeholder="Nome do cliente"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                />
                <PhoneInput
                  label="Telefone celular (WhatsApp) *"
                  value={newClientPhone}
                  onValueChange={setNewClientPhone}
                />
              </div>
              <Input
                label="Endereço (opcional)"
                placeholder="Rua, número, complemento"
                value={newClientAddress}
                onChange={(e) => setNewClientAddress(e.target.value)}
              />
              <div className="flex justify-end gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNewClientForm(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  size="sm"
                  loading={savingClient}
                  onClick={handleSaveQuickClient}
                >
                  Salvar Cliente
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Pesquisar cliente por nome ou telefone..."
                  value={clientSearch}
                  onChange={(e) => setClientSearch(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 text-sm bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
                />
              </div>

              {/* Lista compacta de clientes selecionáveis */}
              <div className="max-h-36 overflow-y-auto rounded-xl border border-slate-200/80 bg-white divide-y divide-slate-100">
                {filteredClients.length === 0 ? (
                  <div className="p-3 text-center text-xs text-slate-400">
                    Nenhum cliente encontrado. Clique em "+ Novo Cliente" para cadastrar.
                  </div>
                ) : (
                  filteredClients.map((c) => {
                    const isSelected = selectedClientId === String(c.id);
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setSelectedClientId(String(c.id))}
                        className={`w-full px-3.5 py-2 text-left flex items-center justify-between text-xs transition-colors ${
                          isSelected ? "bg-indigo-50/80 text-indigo-900 font-bold" : "hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <div>
                          <p className="font-semibold">{c.nome}</p>
                          <p className="text-[11px] text-slate-400">{c.telefone || "Sem telefone"}</p>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── 2. SELEÇÃO DE PEÇAS & QUANTIDADES COM BOTÕES (+) e (-) ─────── */}
        <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-200/80">
          <div className="flex items-center justify-between mb-2.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <span>2. Roupas e Serviços</span>
              <span className="text-red-500">*</span>
            </label>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
              {totalPieces} peça(s) selecionada(s)
            </span>
          </div>

          {services.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-400 bg-white rounded-xl border border-slate-200">
              Nenhum tipo de roupa cadastrado no catálogo. Adicione na Tabela de Preços.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-0.5">
              {services.map((s) => {
                const sId = String(s.id);
                const currentQty = quantities[sId] || 0;
                const preco = Number(s.preco) || 0;

                return (
                  <div
                    key={s.id}
                    className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-2 ${
                      currentQty > 0
                        ? "bg-indigo-50/40 border-indigo-200 shadow-2xs"
                        : "bg-white border-slate-200/70 hover:border-slate-300"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-800 truncate">{s.nome}</p>
                      <p className="text-[11px] text-slate-500">
                        {formatCurrency(preco)} / {s.unidade || "un"}
                      </p>
                    </div>

                    {/* Botões de controle de quantidade com (+) e (-) */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => setItemQuantity(sId, currentQty - 1)}
                        disabled={currentQty === 0}
                        className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 active:bg-slate-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-slate-700 transition-colors font-bold"
                        title="Diminuir quantidade"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <input
                        type="number"
                        min={0}
                        value={currentQty}
                        onChange={(e) => setItemQuantity(sId, parseInt(e.target.value, 10) || 0)}
                        className="w-10 h-7 text-center font-bold text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-400"
                      />

                      <button
                        type="button"
                        onClick={() => setItemQuantity(sId, currentQty + 1)}
                        className="w-7 h-7 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white flex items-center justify-center transition-colors font-bold shadow-2xs"
                        title="Aumentar quantidade"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── 3. PREVISÃO DE ENTREGA & OBSERVAÇÕES ─────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Previsão de entrega"
            type="date"
            required
            value={previsaoPara}
            onChange={(e) => setPrevisaoPara(e.target.value)}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Observações da comanda</label>
            <input
              type="text"
              placeholder="Ex: Dobrar sem amido, cuidar de botões delicados..."
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              className="w-full h-10 px-3 text-sm bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
            />
          </div>
        </div>

        {/* ── 4. RESUMO DINÂMICO & TOTAL EM REAL ───────────────────────────── */}
        <div className="bg-gradient-to-r from-indigo-50/80 via-sky-50/60 to-white p-4 rounded-2xl border border-indigo-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500">Resumo da Entrada</p>
            <p className="text-sm font-bold text-slate-800">
              {totalPieces} peça(s) no total
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">Total a Pagar</p>
            <p className="text-2xl font-extrabold text-indigo-700">
              {formatCurrency(totalAmount)}
            </p>
          </div>
        </div>

        {/* ── BOTÕES DE AÇÃO ──────────────────────────────────────────────── */}
        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            fullWidth
            onClick={handleClose}
            disabled={submittingOrder}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            fullWidth
            loading={submittingOrder}
            onClick={handleSubmitOrder}
            disabled={!selectedClientId || selectedItems.length === 0}
            className="shadow-md shadow-indigo-200"
          >
            Salvar e Gerar Pedido
          </Button>
        </div>
      </div>
    </Modal>
  );
}

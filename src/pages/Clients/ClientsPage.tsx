import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Plus,
  Phone,
  Clock,
  AlertCircle,
  RefreshCw,
  MessageCircle,
  Search,
  Check,
  X,
  UserPlus,
} from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { PhoneInput } from "../../components/ui/PhoneInput";
import { Modal } from "../../components/ui/Modal";
import { EmptyState } from "../../components/ui/EmptyState";
import { TableSkeleton } from "../../components/ui/Loading";
import { getClientes, criarCliente } from "../../services/api.js";
import type { Client } from "../../types";
import { formatDate, formatPhone } from "../../utils/formatters";
import { useDebounce } from "../../hooks/useDebounce";
import { useToastContext } from "../../lib/toastContext";

export function ClientsPage() {
  const navigate = useNavigate();
  const { addToast } = useToastContext();

  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  // Modal de cadastro de cliente
  const [modalOpen, setModalOpen] = useState(false);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getClientes();
      const mapped: Client[] = (data || []).map((c: any) => ({
        id: String(c.id),
        name: c.nome || c.name || "",
        phone: c.telefone || c.phone || "",
        address: c.endereco || c.address || "",
        notes: c.notes || "",
        createdAt: c.criadoEm ? c.criadoEm.split("T")[0] : new Date().toISOString().split("T")[0],
        totalServices: Array.isArray(c.pedidos) ? c.pedidos.length : 0,
        totalSpent: 0,
        totalPaid: 0,
        pendingAmount: 0,
        lastServiceDate: c.pedidos && c.pedidos.length > 0 ? c.pedidos[0].criadoEm?.split("T")[0] : undefined,
      }));
      setClients(mapped);
    } catch (err: any) {
      console.error("Erro ao carregar clientes:", err);
      setError(
        err?.message ||
          "Não foi possível conectar à API de clientes. Verifique o servidor local em http://localhost:3333."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // Salvar novo cliente via modal
  const handleSaveClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) {
      addToast("O nome do cliente é obrigatório.", "warning");
      return;
    }
    const cleanDigits = telefone.replace(/\D/g, "");
    if (cleanDigits.length < 10) {
      addToast("Informe um telefone válido com DDD (mínimo 10 dígitos).", "warning");
      return;
    }

    setSaving(true);
    try {
      await criarCliente({
        nome: nome.trim(),
        telefone: telefone.trim(),
        endereco: endereco.trim() || undefined,
      });

      addToast("Cliente cadastrado com sucesso!", "success");
      setModalOpen(false);
      setNome("");
      setTelefone("");
      setEndereco("");
      fetchClients();
    } catch (err: any) {
      console.error("Erro ao cadastrar cliente:", err);
      addToast(err?.message || "Não foi possível cadastrar o cliente.", "error");
    } finally {
      setSaving(false);
    }
  };

  const filteredClients = clients.filter((c) => {
    if (!debouncedSearch) return true;
    const term = debouncedSearch.toLowerCase();
    return (
      c.name.toLowerCase().includes(term) ||
      c.phone.includes(term) ||
      (c.address && c.address.toLowerCase().includes(term))
    );
  });

  return (
    <div className="animate-fade-in space-y-4">
      <PageHeader
        title="Gestão de Clientes"
        subtitle="Consulte clientes cadastrados e o total de pedidos realizados."
        actions={
          <Button
            onClick={() => setModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
            className="shadow-xs shadow-indigo-200 font-bold"
          >
            + Novo Cliente
          </Button>
        }
      />

      {/* Busca Rápida */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome ou telefone..."
          className="w-full h-10 pl-9 pr-3 text-sm bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
        />
      </div>

      {/* Mensagem de Erro com Retry */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-red-800">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm">Falha na conexão com a API de clientes</p>
              <p className="text-xs text-red-700 mt-0.5">{error}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchClients}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            className="border-red-200 hover:bg-red-100 text-red-800"
          >
            Tentar novamente
          </Button>
        </div>
      )}

      {loading ? (
        <TableSkeleton rows={6} cols={4} />
      ) : filteredClients.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Nenhum cliente encontrado."
          description={
            debouncedSearch
              ? `Nenhum resultado para "${debouncedSearch}".`
              : "Cadastre seu primeiro cliente para iniciar os atendimentos."
          }
          action={
            !debouncedSearch ? (
              <Button
                onClick={() => setModalOpen(true)}
                leftIcon={<Plus className="w-4 h-4" />}
                size="sm"
              >
                Cadastrar primeiro cliente
              </Button>
            ) : undefined
          }
        />
      ) : (
        <>
          {/* Tabela de Clientes Desktop */}
          <div className="hidden sm:block bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-x-auto w-full">
            <table className="w-full text-sm min-w-[600px]">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Telefone / WhatsApp
                  </th>
                  <th className="px-5 py-3.5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Total de Pedidos
                  </th>
                  <th className="px-5 py-3.5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredClients.map((client) => {
                  const cleanPhone = client.phone.replace(/\D/g, "");
                  const waUrl = cleanPhone
                    ? `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(
                        `Olá, ${client.name}! Tudo bem? Passando para falar sobre suas roupas no PassaFácil.`
                      )}`
                    : null;

                  return (
                    <tr
                      key={client.id}
                      onClick={() => navigate(`/clientes/${client.id}`)}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <p className="font-bold text-slate-900">{client.name}</p>
                        {client.address && (
                          <p className="text-xs text-slate-400 mt-0.5">{client.address}</p>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 font-mono text-xs">
                        {formatPhone(client.phone)}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <span className="font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full text-xs">
                          {client.totalServices} {client.totalServices === 1 ? "pedido" : "pedidos"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                          {waUrl && (
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Abrir WhatsApp"
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-xl transition-colors"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Cards Mobile */}
          <div className="sm:hidden flex flex-col gap-2.5">
            {filteredClients.map((client) => {
              const cleanPhone = client.phone.replace(/\D/g, "");
              const waUrl = cleanPhone
                ? `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(
                    `Olá, ${client.name}! Tudo bem? Passando para falar sobre suas roupas no PassaFácil.`
                  )}`
                : null;

              return (
                <div
                  key={client.id}
                  onClick={() => navigate(`/clientes/${client.id}`)}
                  className="bg-white rounded-xl border border-slate-200/80 shadow-2xs p-4 text-left w-full hover:shadow-xs transition-shadow cursor-pointer flex flex-col gap-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold text-slate-900">{client.name}</p>
                      {client.address && (
                        <p className="text-xs text-slate-400 mt-0.5">{client.address}</p>
                      )}
                    </div>
                    <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full text-[11px] flex-shrink-0">
                      {client.totalServices} ped.
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                    <span className="font-mono">{formatPhone(client.phone)}</span>
                    {waUrl && (
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ── MODAL DE CADASTRO DE CLIENTE ───────────────────────────────────── */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Cadastrar Novo Cliente"
        size="md"
      >
        <form onSubmit={handleSaveClient} className="flex flex-col gap-4">
          <Input
            label="Nome completo *"
            placeholder="Ex: Maria Oliveira"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />

          <PhoneInput
            label="Telefone celular (WhatsApp) *"
            value={telefone}
            onValueChange={setTelefone}
            required
          />

          <Input
            label="Endereço residencial ou comercial"
            placeholder="Rua, número, bairro, complemento"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
          />

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setModalOpen(false)}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button type="submit" loading={saving}>
              Cadastrar Cliente
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Plus, Phone, Clock, DollarSign, AlertCircle, RefreshCw } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { SearchInput } from "../../components/ui/SearchInput";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { Loading } from "../../components/ui/Loading";
import { getClientes } from "../../services/api.js";
import type { Client } from "../../types";
import { formatCurrency, formatDate, formatPhone } from "../../utils/formatters";
import { useDebounce } from "../../hooks/useDebounce";

export function ClientsPage() {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

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
      }));
      setClients(mapped);
    } catch (err: any) {
      console.error("Erro ao carregar clientes:", err);
      setError(
        err?.message ||
          "Não foi possível conectar ao servidor. Verifique se o back-end está rodando em http://localhost:3333."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

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
    <div className="animate-fade-in">
      <PageHeader
        title="Clientes"
        subtitle="Gerencie seus clientes e consulte o histórico."
        actions={
          <Button
            onClick={() => navigate("/clientes/novo")}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Novo cliente
          </Button>
        }
      />

      {/* Search */}
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Pesquisar por nome ou telefone..."
        className="mb-4 max-w-sm"
      />

      {/* Mensagem de Erro com Ação de Recarregar */}
      {error && (
        <div className="mb-4 p-4 rounded-2xl bg-red-50 border border-red-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-red-800">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm">Falha na conexão com a API</p>
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
        <Loading />
      ) : filteredClients.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Nenhum cliente encontrado."
          description={
            debouncedSearch
              ? `Nenhum resultado para "${debouncedSearch}".`
              : "Comece cadastrando seu primeiro cliente."
          }
          action={
            !debouncedSearch ? (
              <Button
                onClick={() => navigate("/clientes/novo")}
                leftIcon={<Plus className="w-4 h-4" />}
                size="sm"
              >
                Novo cliente
              </Button>
            ) : undefined
          }
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden sm:block bg-white rounded-2xl border border-slate-100 shadow-sm overflow-x-auto w-full">
            <table className="w-full text-sm min-w-[550px]">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-500">Cliente</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-500">Telefone</th>
                  <th className="px-5 py-3 text-right text-xs font-medium text-slate-500">Serviços</th>
                  <th className="px-5 py-3 text-right text-xs font-medium text-slate-500">Pendente</th>
                  <th className="px-5 py-3 text-right text-xs font-medium text-slate-500">Último serviço</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredClients.map((client) => (
                  <tr
                    key={client.id}
                    onClick={() => navigate(`/clientes/${client.id}`)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-800">{client.name}</p>
                      {client.address && (
                        <p className="text-xs text-slate-400 mt-0.5">{client.address}</p>
                      )}
                    </td>
                    <td className="px-5 py-4 text-slate-500">
                      {formatPhone(client.phone)}
                    </td>
                    <td className="px-5 py-4 text-right text-slate-700">
                      {client.totalServices}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span
                        className={
                          client.pendingAmount > 0
                            ? "text-red-600 font-semibold"
                            : "text-slate-500"
                        }
                      >
                        {client.pendingAmount > 0
                          ? formatCurrency(client.pendingAmount)
                          : "—"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right text-slate-500 text-xs">
                      {client.lastServiceDate
                        ? formatDate(client.lastServiceDate)
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden flex flex-col gap-3">
            {filteredClients.map((client) => (
              <button
                key={client.id}
                onClick={() => navigate(`/clientes/${client.id}`)}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-left w-full hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="font-semibold text-slate-800 truncate">{client.name}</p>
                    {client.address && (
                      <p className="text-xs text-slate-400 mt-0.5">{client.address}</p>
                    )}
                  </div>
                  {client.pendingAmount > 0 && (
                    <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full flex-shrink-0">
                      {formatCurrency(client.pendingAmount)} pendente
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-x-4 gap-y-1.5 flex-wrap text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1 flex-shrink-0">
                    <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>{formatPhone(client.phone)}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 flex-shrink-0">
                    <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>{client.totalServices} serviços</span>
                  </span>
                  {client.lastServiceDate && (
                    <span className="inline-flex items-center gap-1 flex-shrink-0">
                      <DollarSign className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span>{formatDate(client.lastServiceDate)}</span>
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Plus, Phone, Clock, DollarSign, AlertCircle, RefreshCw, MessageCircle } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { SearchInput } from "../../components/ui/SearchInput";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { TableSkeleton } from "../../components/ui/Loading";
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
          "Não foi possível conectar ao servidor. Verifique a conexão com o banco de dados."
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
        subtitle="Gerencie seus clientes e consulte o histórico de pedidos."
        actions={
          <Button
            onClick={() => navigate("/clientes/novo")}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Novo cliente
          </Button>
        }
      />

      {/* Busca */}
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
        <TableSkeleton rows={6} cols={5} />
      ) : filteredClients.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Nenhum cliente encontrado."
          description={
            debouncedSearch
              ? `Nenhum resultado encontrado para "${debouncedSearch}".`
              : "Comece cadastrando seu primeiro cliente no sistema."
          }
          action={
            !debouncedSearch ? (
              <Button
                onClick={() => navigate("/clientes/novo")}
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
          {/* Desktop table */}
          <div className="hidden sm:block bg-white rounded-3xl border border-slate-100 shadow-sm overflow-x-auto w-full">
            <table className="w-full text-sm min-w-[550px]">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">Cliente</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">Telefone / WhatsApp</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500">Pedidos</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredClients.map((client) => {
                  const cleanPhone = client.phone.replace(/\D/g, "");
                  const waUrl = cleanPhone
                    ? `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(`Olá, ${client.name}! Tudo bem?`)}`
                    : null;

                  return (
                    <tr
                      key={client.id}
                      onClick={() => navigate(`/clientes/${client.id}`)}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-800">{client.name}</p>
                        {client.address && (
                          <p className="text-xs text-slate-400 mt-0.5">{client.address}</p>
                        )}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {formatPhone(client.phone)}
                      </td>
                      <td className="px-5 py-4 text-right text-slate-700 font-medium">
                        {client.totalServices}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                          {waUrl && (
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Conversar no WhatsApp"
                              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/70 px-2.5 py-1.5 rounded-xl transition-colors"
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

          {/* Mobile cards */}
          <div className="sm:hidden flex flex-col gap-3">
            {filteredClients.map((client) => {
              const cleanPhone = client.phone.replace(/\D/g, "");
              const waUrl = cleanPhone
                ? `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(`Olá, ${client.name}! Tudo bem?`)}`
                : null;

              return (
                <div
                  key={client.id}
                  onClick={() => navigate(`/clientes/${client.id}`)}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-left w-full hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="font-bold text-slate-800 truncate">{client.name}</p>
                      {client.address && (
                        <p className="text-xs text-slate-400 mt-0.5">{client.address}</p>
                      )}
                    </div>
                    {waUrl && (
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center flex-shrink-0"
                        title="Abrir WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-x-4 gap-y-1.5 flex-wrap text-xs text-slate-500 pt-2 border-t border-slate-50">
                    <span className="inline-flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatPhone(client.phone)}</span>
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{client.totalServices} pedidos</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

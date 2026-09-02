import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Plus, Phone, Clock, DollarSign } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { SearchInput } from "../../components/ui/SearchInput";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { Loading } from "../../components/ui/Loading";
import { clientService } from "../../services/clientService";
import type { Client } from "../../types";
import { formatCurrency, formatDate, formatPhone } from "../../utils/formatters";
import { useDebounce } from "../../hooks/useDebounce";

export function ClientsPage() {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    setLoading(true);
    clientService
      .getAll({ search: debouncedSearch })
      .then(setClients)
      .finally(() => setLoading(false));
  }, [debouncedSearch]);

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

      {loading ? (
        <Loading />
      ) : clients.length === 0 ? (
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
          <div className="hidden sm:block bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
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
                {clients.map((client) => (
                  <tr
                    key={client.id}
                    onClick={() => navigate(`/clientes/${client.id}`)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-800">{client.name}</p>
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
            {clients.map((client) => (
              <button
                key={client.id}
                onClick={() => navigate(`/clientes/${client.id}`)}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-left w-full hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="font-semibold text-slate-800">{client.name}</p>
                  {client.pendingAmount > 0 && (
                    <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full flex-shrink-0">
                      {formatCurrency(client.pendingAmount)} pendente
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {formatPhone(client.phone)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {client.totalServices} serviços
                  </span>
                  {client.lastServiceDate && (
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      {formatDate(client.lastServiceDate)}
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

import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plus, Shirt } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { SearchInput } from "../../components/ui/SearchInput";
import { Button } from "../../components/ui/Button";
import { ServiceStatusBadge } from "../../components/ui/ServiceStatusBadge";
import { EmptyState } from "../../components/ui/EmptyState";
import { Loading } from "../../components/ui/Loading";
import { serviceService } from "../../services/serviceService";
import type { Service, ServiceStatus } from "../../types";
import {
  formatCurrency,
  formatDate,
  formatServiceCode,
} from "../../utils/formatters";
import { useDebounce } from "../../hooks/useDebounce";

const statusOptions: { value: ServiceStatus | "TODOS"; label: string }[] = [
  { value: "TODOS", label: "Todos" },
  { value: "RECEBIDO", label: "Recebido" },
  { value: "EM_ANDAMENTO", label: "Em andamento" },
  { value: "PRONTO", label: "Pronto" },
  { value: "AGUARDANDO_PAGAMENTO", label: "Aguardando pagamento" },
  { value: "FINALIZADO", label: "Finalizado" },
];

export function ServicesPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialStatus = (searchParams.get("status") as ServiceStatus | null) ?? "TODOS";

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ServiceStatus | "TODOS">(initialStatus);
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    setLoading(true);
    serviceService
      .getAll({ search: debouncedSearch, status })
      .then(setServices)
      .finally(() => setLoading(false));
  }, [debouncedSearch, status]);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Serviços"
        subtitle="Controle todos os serviços da passadoria."
        actions={
          <Button
            onClick={() => navigate("/servicos/novo")}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Novo serviço
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Pesquisar por cliente ou código..."
          className="sm:max-w-xs"
        />
        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 flex-wrap sm:flex-nowrap">
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStatus(opt.value)}
              className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                status === opt.value
                  ? "bg-indigo-600 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : services.length === 0 ? (
        <EmptyState
          icon={Shirt}
          title="Nenhum serviço encontrado."
          description={
            debouncedSearch || status !== "TODOS"
              ? "Tente outros filtros."
              : "Crie o primeiro serviço."
          }
          action={
            !debouncedSearch && status === "TODOS" ? (
              <Button
                onClick={() => navigate("/servicos/novo")}
                leftIcon={<Plus className="w-4 h-4" />}
                size="sm"
              >
                Novo serviço
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
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-500">Código</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-500">Cliente</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-500">Recebido</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-500">Entrega</th>
                  <th className="px-5 py-3 text-right text-xs font-medium text-slate-500">Peças</th>
                  <th className="px-5 py-3 text-right text-xs font-medium text-slate-500">Valor</th>
                  <th className="px-5 py-3 text-right text-xs font-medium text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {services.map((service) => (
                  <tr
                    key={service.id}
                    onClick={() => navigate(`/servicos/${service.id}`)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-xs text-slate-500">
                        {formatServiceCode(service.code)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-800">
                      {service.clientName}
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 text-xs">
                      {formatDate(service.receivedAt)}
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 text-xs">
                      {formatDate(service.expectedDeliveryAt)}
                    </td>
                    <td className="px-5 py-3.5 text-right text-slate-600">
                      {service.totalPieces}
                    </td>
                    <td className="px-5 py-3.5 text-right font-semibold text-slate-800">
                      {formatCurrency(service.totalAmount)}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <ServiceStatusBadge status={service.status} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden flex flex-col gap-3">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => navigate(`/servicos/${service.id}`)}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-left w-full"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400">
                      {formatServiceCode(service.code)}
                    </span>
                    <ServiceStatusBadge status={service.status} size="sm" />
                  </div>
                  <span className="text-sm font-bold text-slate-800">
                    {formatCurrency(service.totalAmount)}
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-800 mb-1">
                  {service.clientName}
                </p>
                <div className="flex gap-3 text-xs text-slate-500">
                  <span>{service.totalPieces} peças</span>
                  <span>Entrega: {formatDate(service.expectedDeliveryAt)}</span>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

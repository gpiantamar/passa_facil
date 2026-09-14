import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plus, Shirt, AlertCircle, RefreshCw, MessageCircle } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { SearchInput } from "../../components/ui/SearchInput";
import { Button } from "../../components/ui/Button";
import { ServiceStatusBadge } from "../../components/ui/ServiceStatusBadge";
import { EmptyState } from "../../components/ui/EmptyState";
import { TableSkeleton } from "../../components/ui/Loading";
import { getPedidos } from "../../services/api.js";
import type { Service, ServiceStatus } from "../../types";
import {
  formatCurrency,
  formatDate,
  formatServiceCode,
} from "../../utils/formatters";
import { useDebounce } from "../../hooks/useDebounce";

const statusOptions: { value: string; label: string }[] = [
  { value: "TODOS", label: "Todos" },
  { value: "RECEBIDO", label: "Recebido" },
  { value: "EM_ANDAMENTO", label: "Passando" },
  { value: "PRONTO", label: "Pronto" },
  { value: "ENTREGUE", label: "Entregue" },
];

function mapPedidoToService(p: any): Service {
  const code = String(p.id).padStart(6, "0");
  const items = (p.itens || []).map((item: any) => ({
    id: String(item.id),
    serviceId: String(p.id),
    clothingTypeId: String(item.servicoId),
    clothingTypeName: item.servico?.nome || `Item #${item.servicoId}`,
    quantity: item.quantidade,
    pricePerUnit: item.valorUnit,
    subtotal: item.quantidade * item.valorUnit,
  }));
  const totalPieces = items.reduce((sum: number, it: any) => sum + (it.quantity || 0), 0);

  let status: ServiceStatus = "RECEBIDO";
  const raw = (p.status || "").toLowerCase();
  if (raw === "passando" || raw === "em andamento" || raw === "em_andamento") {
    status = "EM_ANDAMENTO";
  } else if (raw === "pronto") {
    status = "PRONTO";
  } else if (raw === "entregue") {
    status = "ENTREGUE";
  } else if (raw === "finalizado") {
    status = "FINALIZADO";
  } else if (raw === "aguardando_pagamento") {
    status = "AGUARDANDO_PAGAMENTO";
  } else {
    status = "RECEBIDO";
  }

  return {
    id: String(p.id),
    code,
    clientId: String(p.clienteId),
    clientName: p.cliente?.nome || "Cliente",
    clientPhone: p.cliente?.telefone || "",
    status,
    receivedAt: p.criadoEm ? p.criadoEm.split("T")[0] : new Date().toISOString().split("T")[0],
    expectedDeliveryAt: p.previsaoPara ? p.previsaoPara.split("T")[0] : "",
    deliveredAt: raw === "entregue" || raw === "finalizado" ? (p.criadoEm ? p.criadoEm.split("T")[0] : undefined) : undefined,
    items,
    totalPieces,
    totalAmount: p.valorTotal || 0,
    paidAmount: 0,
    notes: p.observacoes || undefined,
    paymentStatus: "PENDENTE",
  };
}

export function ServicesPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialStatus = searchParams.get("status") ?? "TODOS";

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>(initialStatus);
  const debouncedSearch = useDebounce(search, 300);

  const fetchPedidos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPedidos();
      const mapped = (data || []).map(mapPedidoToService);
      setServices(mapped);
    } catch (err: any) {
      console.error("Erro ao carregar pedidos:", err);
      setError(
        err?.message ||
          "Não foi possível buscar os pedidos. Verifique a conexão com o servidor."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPedidos();
  }, [fetchPedidos]);

  const filteredServices = services.filter((s) => {
    if (search) {
      const term = search.toLowerCase();
      const matchSearch =
        s.clientName.toLowerCase().includes(term) ||
        s.code.includes(term) ||
        s.id.includes(term);
      if (!matchSearch) return false;
    }

    if (status !== "TODOS") {
      if (status === "EM_ANDAMENTO") {
        return s.status === "EM_ANDAMENTO" || s.status === "PASSANDO";
      }
      return s.status === status;
    }

    return true;
  });

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Pedidos & Serviços"
        subtitle="Acompanhe todos os pedidos e seus status em tempo real."
        actions={
          <Button
            onClick={() => navigate("/servicos/novo")}
            leftIcon={<Plus className="w-4 h-4 flex-shrink-0" />}
          >
            Novo pedido
          </Button>
        }
      />

      {/* Filtros e Busca */}
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
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex-shrink-0 ${
                status === opt.value
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Erro amigável com retry */}
      {error && (
        <div className="mb-4 p-4 rounded-2xl bg-red-50 border border-red-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-red-800">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm">Falha na conexão com a API de pedidos</p>
              <p className="text-xs text-red-700 mt-0.5">{error}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchPedidos}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            className="border-red-200 hover:bg-red-100 text-red-800"
          >
            Tentar novamente
          </Button>
        </div>
      )}

      {loading ? (
        <TableSkeleton rows={7} cols={6} />
      ) : filteredServices.length === 0 ? (
        <EmptyState
          icon={Shirt}
          title="Nenhum pedido encontrado."
          description={
            debouncedSearch || status !== "TODOS"
              ? "Nenhum pedido atende aos filtros selecionados."
              : "Cadastre o primeiro pedido no sistema."
          }
          action={
            !debouncedSearch && status === "TODOS" ? (
              <Button
                onClick={() => navigate("/servicos/novo")}
                leftIcon={<Plus className="w-4 h-4 flex-shrink-0" />}
                size="sm"
              >
                Novo pedido
              </Button>
            ) : undefined
          }
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden sm:block bg-white rounded-3xl border border-slate-100 shadow-sm overflow-x-auto w-full">
            <table className="w-full text-sm min-w-[650px]">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">Código</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">Cliente</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">Recebido</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">Entrega prevista</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500">Peças</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500">Valor Total</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredServices.map((service) => {
                  const cleanPhone = service.clientPhone.replace(/\D/g, "");
                  const waUrl = cleanPhone
                    ? `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(
                        `Olá, ${service.clientName}! Passando para falar sobre o seu pedido ${formatServiceCode(service.code)}.`
                      )}`
                    : null;

                  return (
                    <tr
                      key={service.id}
                      onClick={() => navigate(`/servicos/${service.id}`)}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-xs text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded-md">
                          {formatServiceCode(service.code)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-medium text-slate-800">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{service.clientName}</span>
                          {waUrl && (
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              title="Abrir WhatsApp"
                              className="text-emerald-600 hover:text-emerald-700"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                        {service.clientPhone && (
                          <div className="text-xs text-slate-400 font-normal">{service.clientPhone}</div>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 text-xs">
                        {formatDate(service.receivedAt)}
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 text-xs">
                        {service.expectedDeliveryAt
                          ? formatDate(service.expectedDeliveryAt)
                          : "—"}
                      </td>
                      <td className="px-5 py-3.5 text-right text-slate-700">
                        {service.totalPieces} un
                      </td>
                      <td className="px-5 py-3.5 text-right font-bold text-slate-900">
                        {formatCurrency(service.totalAmount)}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <ServiceStatusBadge status={service.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden flex flex-col gap-3">
            {filteredServices.map((service) => {
              const cleanPhone = service.clientPhone.replace(/\D/g, "");
              const waUrl = cleanPhone
                ? `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(
                    `Olá, ${service.clientName}! Passando para falar sobre o seu pedido ${formatServiceCode(service.code)}.`
                  )}`
                : null;

              return (
                <div
                  key={service.id}
                  onClick={() => navigate(`/servicos/${service.id}`)}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-left w-full hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="font-mono text-xs text-indigo-700 font-bold bg-indigo-50 px-1.5 py-0.5 rounded-md">
                        {formatServiceCode(service.code)}
                      </span>
                      <p className="font-bold text-slate-800 mt-1">{service.clientName}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {waUrl && (
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"
                          title="WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <ServiceStatusBadge status={service.status} size="sm" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-50">
                    <span>{service.totalPieces} peça(s)</span>
                    <span className="font-bold text-slate-900 text-sm">
                      {formatCurrency(service.totalAmount)}
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

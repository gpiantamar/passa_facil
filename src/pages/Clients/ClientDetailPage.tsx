import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, Phone, MapPin, FileText, Shirt } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { ServiceStatusBadge } from "../../components/ui/ServiceStatusBadge";
import { Loading } from "../../components/ui/Loading";
import { EmptyState } from "../../components/ui/EmptyState";
import { clientService } from "../../services/clientService";
import { serviceService } from "../../services/serviceService";
import type { Client, Service } from "../../types";
import {
  formatCurrency,
  formatDate,
  formatPhone,
  formatServiceCode,
} from "../../utils/formatters";

export function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      clientService.getById(id),
      serviceService.getByClientId(id),
    ]).then(([c, s]) => {
      setClient(c);
      setServices(s);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <Loading />;

  if (!client) {
    return (
      <EmptyState
        title="Cliente não encontrado."
        description="O cliente que você procura não existe."
        action={
          <Button onClick={() => navigate("/clientes")} size="sm">
            Voltar para clientes
          </Button>
        }
      />
    );
  }

  return (
    <div className="animate-fade-in max-w-2xl">
      <PageHeader
        title={client.name}
        breadcrumbs={[
          { label: "Clientes", href: "/clientes" },
          { label: client.name },
        ]}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/clientes/${id}/editar`)}
            >
              Editar
            </Button>
            <Button
              size="sm"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => navigate(`/servicos/novo?clientId=${id}`)}
            >
              Novo serviço
            </Button>
          </div>
        }
      />

      {/* Client info */}
      <Card className="mb-4">
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span>{formatPhone(client.phone)}</span>
          </div>
          {client.address && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>{client.address}</span>
            </div>
          )}
          {client.notes && (
            <div className="flex items-start gap-2 text-sm text-slate-600">
              <FileText className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
              <span>{client.notes}</span>
            </div>
          )}
        </div>
      </Card>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total de serviços", value: String(client.totalServices) },
          { label: "Total gasto", value: formatCurrency(client.totalSpent) },
          { label: "Total pago", value: formatCurrency(client.totalPaid) },
          {
            label: "Pendente",
            value: formatCurrency(client.pendingAmount),
            highlight: client.pendingAmount > 0,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-slate-100 shadow-sm p-4"
          >
            <p className="text-xs text-slate-500 mb-1">{stat.label}</p>
            <p
              className={`text-base font-bold ${
                stat.highlight ? "text-red-600" : "text-slate-800"
              }`}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Service history */}
      <div>
        <p className="text-sm font-semibold text-slate-700 mb-3">
          Histórico de serviços
        </p>
        {services.length === 0 ? (
          <EmptyState
            icon={Shirt}
            title="Nenhum serviço registrado."
            description="Este cliente ainda não possui serviços."
          />
        ) : (
          <div className="flex flex-col gap-3">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => navigate(`/servicos/${service.id}`)}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-left w-full hover:shadow-md transition-shadow"
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
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span>Recebido: {formatDate(service.receivedAt)}</span>
                  <span>Entrega: {formatDate(service.expectedDeliveryAt)}</span>
                  <span>{service.totalPieces} peças</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

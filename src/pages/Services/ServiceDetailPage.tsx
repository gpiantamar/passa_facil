import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, Circle, Send } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { ServiceStatusBadge } from "../../components/ui/ServiceStatusBadge";
import { PaymentStatusBadge } from "../../components/ui/PaymentStatusBadge";
import { Loading } from "../../components/ui/Loading";
import { EmptyState } from "../../components/ui/EmptyState";
import { Modal } from "../../components/ui/Modal";
import { ShareServiceModal } from "../../components/ui/ShareServiceModal";
import { serviceService } from "../../services/serviceService";
import { paymentService } from "../../services/paymentService";
import type { Service, ServiceStatus } from "../../types";
import {
  formatCurrency,
  formatDate,
  formatServiceCode,
  formatPaymentMethod,
} from "../../utils/formatters";
import { useToastContext } from "../../lib/toastContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { newPaymentSchema, type NewPaymentSchema } from "../../utils/validators";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";

const statusFlow: { status: ServiceStatus; label: string }[] = [
  { status: "RECEBIDO", label: "Recebido" },
  { status: "EM_ANDAMENTO", label: "Em andamento" },
  { status: "PRONTO", label: "Pronto" },
  { status: "AGUARDANDO_PAGAMENTO", label: "Aguardando pagamento" },
  { status: "FINALIZADO", label: "Finalizado" },
];

const statusOrder: Record<ServiceStatus, number> = {
  RECEBIDO: 0,
  EM_ANDAMENTO: 1,
  PRONTO: 2,
  AGUARDANDO_PAGAMENTO: 3,
  FINALIZADO: 4,
};

const paymentMethodOptions = [
  { value: "PIX", label: "PIX" },
  { value: "DINHEIRO", label: "Dinheiro" },
  { value: "CARTAO", label: "Cartão" },
  { value: "OUTRO", label: "Outro" },
];

export function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToastContext();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewPaymentSchema>({
    resolver: zodResolver(newPaymentSchema),
    defaultValues: { amount: 0, paidAt: new Date().toISOString().split("T")[0] },
  });

  useEffect(() => {
    if (!id) return;
    serviceService.getById(id).then((s) => {
      setService(s);
      setLoading(false);
    });
  }, [id]);

  const handleAdvanceStatus = async () => {
    if (!service) return;
    const currentIndex = statusOrder[service.status];
    if (currentIndex >= statusFlow.length - 1) return;
    const nextStatus = statusFlow[currentIndex + 1].status;
    const updated = await serviceService.updateStatus(service.id, nextStatus);
    setService(updated);
    addToast(`Status atualizado para "${statusFlow[currentIndex + 1].label}".`, "success");
  };

  const onPaymentSubmit = async (data: NewPaymentSchema) => {
    if (!service) return;
    try {
      await paymentService.create(
        service.id,
        service.code,
        service.clientId,
        service.clientName,
        data
      );
      addToast("Pagamento registrado com sucesso.", "success");
      setPaymentModalOpen(false);
      reset();
      // Update service paidAmount in mock
      const updatedService = { ...service, paidAmount: service.paidAmount + data.amount };
      if (updatedService.paidAmount >= updatedService.totalAmount) {
        const s = await serviceService.updateStatus(service.id, "AGUARDANDO_PAGAMENTO");
        setService({ ...s, paidAmount: updatedService.paidAmount, paymentStatus: "PAGO" });
      } else {
        setService(updatedService);
      }
    } catch {
      addToast("Erro ao registrar pagamento.", "error");
    }
  };

  if (loading) return <Loading />;

  if (!service) {
    return (
      <EmptyState
        title="Serviço não encontrado."
        action={
          <Button onClick={() => navigate("/servicos")} size="sm">
            Voltar
          </Button>
        }
      />
    );
  }

  const currentStatusIndex = statusOrder[service.status];
  const canAdvance = currentStatusIndex < statusFlow.length - 1;

  return (
    <div className="animate-fade-in max-w-2xl">
      <PageHeader
        title={`Serviço ${formatServiceCode(service.code)}`}
        breadcrumbs={[
          { label: "Serviços", href: "/servicos" },
          { label: formatServiceCode(service.code) },
        ]}
        actions={
          <div className="flex gap-2">
            {service.paymentStatus !== "PAGO" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPaymentModalOpen(true)}
              >
                Registrar pagamento
              </Button>
            )}
            {canAdvance && (
              <Button size="sm" onClick={handleAdvanceStatus}>
                Avançar status
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              leftIcon={<Send className="w-3.5 h-3.5" />}
              onClick={() => setShareModalOpen(true)}
            >
              Compartilhar
            </Button>
          </div>
        }
      />

      {/* Client info */}
      <Card className="mb-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <button
              onClick={() => navigate(`/clientes/${service.clientId}`)}
              className="text-base font-bold text-slate-800 hover:text-indigo-600 transition-colors"
            >
              {service.clientName}
            </button>
            <p className="text-sm text-slate-500">{service.clientPhone}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <ServiceStatusBadge status={service.status} />
            <PaymentStatusBadge status={service.paymentStatus} size="sm" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100">
          <div>
            <p className="text-xs text-slate-500 mb-0.5">Recebido em</p>
            <p className="text-sm font-medium text-slate-800">{formatDate(service.receivedAt)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-0.5">Entrega prevista</p>
            <p className="text-sm font-medium text-slate-800">{formatDate(service.expectedDeliveryAt)}</p>
          </div>
          {service.deliveredAt && (
            <div>
              <p className="text-xs text-slate-500 mb-0.5">Entregue em</p>
              <p className="text-sm font-medium text-emerald-700">{formatDate(service.deliveredAt)}</p>
            </div>
          )}
          {service.notes && (
            <div className="col-span-2">
              <p className="text-xs text-slate-500 mb-0.5">Observações</p>
              <p className="text-sm text-slate-700">{service.notes}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Status timeline */}
      <Card className="mb-4">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">
          Progresso
        </p>
        <div className="flex flex-col gap-0">
          {statusFlow.map((step, i) => {
            const isDone = i < currentStatusIndex;
            const isCurrent = i === currentStatusIndex;
            return (
              <div key={step.status} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                      isDone
                        ? "bg-emerald-500"
                        : isCurrent
                        ? "bg-indigo-600"
                        : "bg-slate-100"
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    ) : isCurrent ? (
                      <Circle className="w-4 h-4 text-white fill-white" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-300" />
                    )}
                  </div>
                  {i < statusFlow.length - 1 && (
                    <div
                      className={`w-0.5 h-6 mt-1 ${
                        isDone ? "bg-emerald-300" : "bg-slate-100"
                      }`}
                    />
                  )}
                </div>
                <p
                  className={`text-sm leading-7 ${
                    isDone
                      ? "text-emerald-700 font-medium"
                      : isCurrent
                      ? "text-indigo-700 font-semibold"
                      : "text-slate-400"
                  }`}
                >
                  {step.label}
                </p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Items */}
      <Card className="mb-4">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">
          Itens do serviço
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="pb-2 text-left text-xs text-slate-500 font-medium">Roupa</th>
                <th className="pb-2 text-right text-xs text-slate-500 font-medium">Qtd</th>
                <th className="pb-2 text-right text-xs text-slate-500 font-medium">Valor unit.</th>
                <th className="pb-2 text-right text-xs text-slate-500 font-medium">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {service.items.map((item) => (
                <tr key={item.id}>
                  <td className="py-2.5 text-slate-800 font-medium">{item.clothingTypeName}</td>
                  <td className="py-2.5 text-right text-slate-600">{item.quantity}</td>
                  <td className="py-2.5 text-right text-slate-600">{formatCurrency(item.pricePerUnit)}</td>
                  <td className="py-2.5 text-right font-semibold text-slate-800">{formatCurrency(item.subtotal)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-slate-100">
                <td colSpan={3} className="pt-3 text-sm font-semibold text-slate-700">
                  Total
                </td>
                <td className="pt-3 text-right text-lg font-bold text-slate-800">
                  {formatCurrency(service.totalAmount)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Payment info */}
        {service.paymentMethod && (
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-sm text-slate-600">
            <span>Pago via {formatPaymentMethod(service.paymentMethod)}</span>
          </div>
        )}
      </Card>

      {/* Payment Modal */}
      <Modal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        title="Registrar pagamento"
      >
        <form onSubmit={handleSubmit(onPaymentSubmit)} noValidate className="flex flex-col gap-4">
          <div className="bg-slate-50 rounded-xl p-3 mb-1">
            <p className="text-xs text-slate-500 mb-0.5">Valor total do serviço</p>
            <p className="text-lg font-bold text-slate-800">{formatCurrency(service.totalAmount)}</p>
          </div>

          <Input
            label="Valor"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0,00"
            error={errors.amount?.message}
            required
            {...register("amount", { valueAsNumber: true })}
          />

          <Select
            label="Forma de pagamento"
            options={paymentMethodOptions}
            placeholder="Selecionar..."
            error={errors.method?.message}
            required
            {...register("method")}
          />

          <Input
            label="Data do pagamento"
            type="date"
            error={errors.paidAt?.message}
            required
            {...register("paidAt")}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Observação</label>
            <textarea
              rows={2}
              placeholder="Opcional..."
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 resize-none transition-colors"
              {...register("notes")}
            />
          </div>

          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={() => setPaymentModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" fullWidth loading={isSubmitting}>
              Registrar pagamento
            </Button>
          </div>
        </form>
      </Modal>

      {/* Share modal */}
      <ShareServiceModal
        open={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        service={service}
      />
    </div>
  );
}

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  CheckCircle2,
  Circle,
  Send,
  AlertCircle,
  RefreshCw,
  Loader2,
  Package,
} from "lucide-react";
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
import { atualizarStatusPedido } from "../../services/api.js";
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

// As 4 opções de status solicitadas pelo requisito
const availableStatuses = [
  { value: "recebido", internal: "RECEBIDO", label: "Recebido", desc: "Pedido recebido" },
  { value: "em andamento", internal: "EM_ANDAMENTO", label: "Em andamento", desc: "Passando roupas" },
  { value: "pronto", internal: "PRONTO", label: "Pronto", desc: "Pronto p/ retirada" },
  { value: "entregue", internal: "ENTREGUE", label: "Entregue", desc: "Entregue ao cliente" },
];

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
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const loadService = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const s = await serviceService.getById(id);
      setService(s);
    } catch (err: any) {
      console.error("Erro ao carregar detalhes do pedido:", err);
      setError(
        err?.message ||
          "Não foi possível carregar os detalhes do pedido. Verifique se o servidor está ativo."
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadService();
  }, [loadService]);

  // Alterar status diretamente refletindo no banco via PATCH /pedidos/:id/status
  const handleStatusChange = async (newStatusValue: string, label: string) => {
    if (!service || updatingStatus) return;

    setUpdatingStatus(true);
    try {
      const updated = await serviceService.updateStatus(service.id, newStatusValue);
      setService(updated);
      addToast(`Status do pedido alterado para "${label}" com sucesso!`, "success");
    } catch (err: any) {
      console.error("Erro ao atualizar status:", err);
      addToast(
        err?.message || "Erro ao atualizar status no servidor. Tente novamente.",
        "error"
      );
    } finally {
      setUpdatingStatus(false);
    }
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
      const newPaid = service.paidAmount + data.amount;
      const isPaid = newPaid >= service.totalAmount;
      const updated = await serviceService.update(service.id, {
        paidAmount: newPaid,
        paymentStatus: isPaid ? "PAGO" : "PARCIAL",
        paymentMethod: data.method,
      });
      setService(updated);
    } catch {
      addToast("Erro ao registrar pagamento.", "error");
    }
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="animate-fade-in max-w-2xl py-8">
        <div className="p-5 rounded-2xl bg-red-50 border border-red-200 text-red-800 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-base">Falha ao carregar pedido</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <Button
              size="sm"
              onClick={loadService}
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              Tentar novamente
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate("/servicos")}
            >
              Voltar para pedidos
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <EmptyState
        title="Serviço não encontrado."
        description="O pedido solicitado não existe ou foi removido."
        action={
          <Button onClick={() => navigate("/servicos")} size="sm">
            Voltar para pedidos
          </Button>
        }
      />
    );
  }

  const currentStatusNormalized = (service.status || "").toUpperCase();

  return (
    <div className="animate-fade-in max-w-2xl">
      <PageHeader
        title={`Pedido ${formatServiceCode(service.code)}`}
        breadcrumbs={[
          { label: "Serviços", href: "/servicos" },
          { label: formatServiceCode(service.code) },
        ]}
        actions={
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap flex-shrink-0">
            {service.paymentStatus !== "PAGO" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPaymentModalOpen(true)}
              >
                Registrar pagamento
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              leftIcon={<Send className="w-3.5 h-3.5 flex-shrink-0" />}
              onClick={() => setShareModalOpen(true)}
            >
              Compartilhar
            </Button>
          </div>
        }
      />

      {/* Informações do Cliente */}
      <Card className="mb-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <button
              onClick={() => navigate(`/clientes/${service.clientId}`)}
              className="text-base font-bold text-slate-800 hover:text-indigo-600 transition-colors text-left"
            >
              {service.clientName}
            </button>
            <p className="text-sm text-slate-500">{service.clientPhone}</p>
          </div>
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
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

      {/* Alteração e Linha do Tempo do Status */}
      <Card className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Status do Pedido no Banco de Dados
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Clique em qualquer status para alterar diretamente no sistema:
            </p>
          </div>
          {updatingStatus && (
            <span className="inline-flex items-center gap-1 text-xs text-indigo-600 font-medium animate-pulse">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Atualizando...
            </span>
          )}
        </div>

        {/* Botões de Seleção Rápida de Status */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
          {availableStatuses.map((st) => {
            const isActive =
              currentStatusNormalized === st.internal ||
              (st.internal === "EM_ANDAMENTO" && currentStatusNormalized === "PASSANDO");

            return (
              <button
                key={st.value}
                type="button"
                disabled={updatingStatus}
                onClick={() => handleStatusChange(st.value, st.label)}
                className={`p-2.5 rounded-xl text-left border transition-all flex flex-col justify-between cursor-pointer ${
                  isActive
                    ? "bg-indigo-50 border-indigo-500 text-indigo-900 shadow-sm ring-2 ring-indigo-200"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                } ${updatingStatus ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-xs font-bold">{st.label}</span>
                  {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />}
                </div>
                <span className="text-[10px] text-slate-500 line-clamp-1">{st.desc}</span>
              </button>
            );
          })}
        </div>

        {/* Linha visual de progresso */}
        <div className="border-t border-slate-100 pt-4 flex flex-col gap-0">
          {availableStatuses.map((step, i) => {
            const isStepCurrent =
              currentStatusNormalized === step.internal ||
              (step.internal === "EM_ANDAMENTO" && currentStatusNormalized === "PASSANDO");

            const currentIndex = availableStatuses.findIndex(
              (s) =>
                s.internal === currentStatusNormalized ||
                (s.internal === "EM_ANDAMENTO" && currentStatusNormalized === "PASSANDO")
            );
            const isStepDone = i < currentIndex;

            return (
              <div key={step.value} className="flex items-start gap-3">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                      isStepDone
                        ? "bg-emerald-500"
                        : isStepCurrent
                        ? "bg-indigo-600"
                        : "bg-slate-100"
                    }`}
                  >
                    {isStepDone ? (
                      <CheckCircle2 className="w-4 h-4 text-white flex-shrink-0" />
                    ) : isStepCurrent ? (
                      <Circle className="w-4 h-4 text-white fill-white flex-shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-300 flex-shrink-0" />
                    )}
                  </div>
                  {i < availableStatuses.length - 1 && (
                    <div
                      className={`w-0.5 h-6 mt-1 ${
                        isStepDone ? "bg-emerald-300" : "bg-slate-100"
                      }`}
                    />
                  )}
                </div>
                <div className="flex items-center justify-between flex-1 py-1">
                  <p
                    className={`text-sm ${
                      isStepDone
                        ? "text-emerald-700 font-medium"
                        : isStepCurrent
                        ? "text-indigo-700 font-semibold"
                        : "text-slate-400"
                    }`}
                  >
                    {step.label}
                  </p>
                  {isStepCurrent && (
                    <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
                      Status atual
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Itens do Pedido */}
      <Card className="mb-4">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">
          Itens do serviço ({service.totalPieces} peças)
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="pb-2 text-left text-xs text-slate-500 font-medium">Serviço / Roupa</th>
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

        {/* Informação de Pagamento */}
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

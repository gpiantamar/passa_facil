import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card } from "../../components/ui/Card";
import { StatCard } from "../../components/ui/StatCard";
import { PaymentStatusBadge } from "../../components/ui/PaymentStatusBadge";
import { Modal } from "../../components/ui/Modal";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Loading } from "../../components/ui/Loading";
import { EmptyState } from "../../components/ui/EmptyState";
import { paymentService } from "../../services/paymentService";
import { serviceService } from "../../services/serviceService";
import type { Payment, Service } from "../../types";
import {
  formatCurrency,
  formatDate,
  formatPaymentMethod,
  formatServiceCode,
} from "../../utils/formatters";
import { useToastContext } from "../../lib/toastContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { newPaymentSchema, type NewPaymentSchema } from "../../utils/validators";
import { DollarSign, CheckCircle2, Clock } from "lucide-react";

const paymentMethodOptions = [
  { value: "PIX", label: "PIX" },
  { value: "DINHEIRO", label: "Dinheiro" },
  { value: "CARTAO", label: "Cartão" },
  { value: "OUTRO", label: "Outro" },
];

export function PaymentsPage() {
  const navigate = useNavigate();
  const { addToast } = useToastContext();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [pendingServices, setPendingServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

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
    Promise.all([
      paymentService.getAll(),
      serviceService.getAll({ search: "", status: "AGUARDANDO_PAGAMENTO" }),
    ]).then(([p, s]) => {
      setPayments(p);
      setPendingServices(s);
      setLoading(false);
    });
  }, []);

  const totalReceived = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalPending = pendingServices.reduce((s, sv) => s + (sv.totalAmount - sv.paidAmount), 0);
  const todayPayments = payments.filter(
    (p) => p.paidAt === new Date().toISOString().split("T")[0]
  ).reduce((s, p) => s + p.amount, 0);

  const onSubmit = async (data: NewPaymentSchema) => {
    if (!selectedService) return;
    try {
      const payment = await paymentService.create(
        selectedService.id,
        selectedService.code,
        selectedService.clientId,
        selectedService.clientName,
        data
      );
      setPayments((prev) => [payment, ...prev]);
      addToast("Pagamento registrado com sucesso.", "success");
      setModalOpen(false);
      setSelectedService(null);
      reset();
    } catch {
      addToast("Erro ao registrar pagamento.", "error");
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Pagamentos"
        subtitle="Controle pagamentos recebidos e valores pendentes."
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <StatCard
          title="Total recebido"
          value={formatCurrency(totalReceived)}
          icon={CheckCircle2}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <StatCard
          title="Total pendente"
          value={formatCurrency(totalPending)}
          icon={Clock}
          iconBg="bg-orange-50"
          iconColor="text-orange-600"
        />
        <StatCard
          title="Recebido hoje"
          value={formatCurrency(todayPayments)}
          icon={DollarSign}
          iconBg="bg-indigo-50"
          iconColor="text-indigo-600"
        />
      </div>

      {/* Pending services */}
      {pendingServices.length > 0 && (
        <Card className="mb-6">
          <p className="text-sm font-semibold text-slate-700 mb-3">
            Aguardando pagamento
          </p>
          <div className="flex flex-col gap-2">
            {pendingServices.map((service) => (
              <div
                key={service.id}
                className="flex items-center justify-between gap-3 p-3 rounded-xl bg-orange-50 border border-orange-100"
              >
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-mono text-slate-400">
                      {formatServiceCode(service.code)}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-800">
                    {service.clientName}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatCurrency(service.totalAmount)}
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    setSelectedService(service);
                    setModalOpen(true);
                  }}
                >
                  Registrar
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Payments list */}
      <Card>
        <p className="text-sm font-semibold text-slate-700 mb-4">
          Histórico de pagamentos
        </p>
        {loading ? (
          <Loading />
        ) : payments.length === 0 ? (
          <EmptyState
            icon={CreditCard}
            title="Nenhum pagamento registrado."
          />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="pb-2 text-left text-xs text-slate-500 font-medium">Cliente</th>
                    <th className="pb-2 text-left text-xs text-slate-500 font-medium">Serviço</th>
                    <th className="pb-2 text-left text-xs text-slate-500 font-medium">Forma</th>
                    <th className="pb-2 text-left text-xs text-slate-500 font-medium">Data</th>
                    <th className="pb-2 text-right text-xs text-slate-500 font-medium">Valor</th>
                    <th className="pb-2 text-right text-xs text-slate-500 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {payments.map((payment) => (
                    <tr
                      key={payment.id}
                      onClick={() => navigate(`/servicos/${payment.serviceId}`)}
                      className="hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <td className="py-3 font-medium text-slate-800">{payment.clientName}</td>
                      <td className="py-3 text-slate-500 font-mono text-xs">
                        {formatServiceCode(payment.serviceCode)}
                      </td>
                      <td className="py-3 text-slate-600">
                        {formatPaymentMethod(payment.method)}
                      </td>
                      <td className="py-3 text-slate-500 text-xs">
                        {formatDate(payment.paidAt)}
                      </td>
                      <td className="py-3 text-right font-semibold text-slate-800">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="py-3 text-right">
                        <PaymentStatusBadge status="PAGO" size="sm" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden flex flex-col divide-y divide-slate-50">
              {payments.map((payment) => (
                <button
                  key={payment.id}
                  onClick={() => navigate(`/servicos/${payment.serviceId}`)}
                  className="flex items-center justify-between gap-3 py-3 text-left w-full"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{payment.clientName}</p>
                    <p className="text-xs text-slate-500">
                      {formatPaymentMethod(payment.method)} · {formatDate(payment.paidAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-800">
                      {formatCurrency(payment.amount)}
                    </p>
                    <PaymentStatusBadge status="PAGO" size="sm" />
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </Card>

      {/* Payment modal */}
      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setSelectedService(null); reset(); }}
        title="Registrar pagamento"
      >
        {selectedService && (
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-500">Serviço</p>
              <p className="text-sm font-semibold text-slate-800">{selectedService.clientName}</p>
              <p className="text-xs text-slate-500 font-mono">{formatServiceCode(selectedService.code)}</p>
              <p className="text-base font-bold text-indigo-700 mt-1">
                {formatCurrency(selectedService.totalAmount)}
              </p>
            </div>

            <Input
              label="Valor"
              type="number"
              step="0.01"
              min="0.01"
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
              label="Data"
              type="date"
              error={errors.paidAt?.message}
              required
              {...register("paidAt")}
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Observação</label>
              <textarea
                rows={2}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 resize-none"
                {...register("notes")}
              />
            </div>

            <div className="flex gap-3 pt-1">
              <Button
                type="button"
                variant="outline"
                fullWidth
                onClick={() => { setModalOpen(false); setSelectedService(null); reset(); }}
              >
                Cancelar
              </Button>
              <Button type="submit" fullWidth loading={isSubmitting}>
                Registrar pagamento
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

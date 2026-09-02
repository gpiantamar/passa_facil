import type { Payment, NewPaymentForm } from "../types";
import { mockPayments } from "../mocks/payments";

let payments = [...mockPayments];

export const paymentService = {
  async getAll(): Promise<Payment[]> {
    return [...payments].sort((a, b) => b.paidAt.localeCompare(a.paidAt));
  },

  async getByServiceId(serviceId: string): Promise<Payment[]> {
    return payments.filter((p) => p.serviceId === serviceId);
  },

  async create(
    serviceId: string,
    serviceCode: string,
    clientId: string,
    clientName: string,
    data: NewPaymentForm
  ): Promise<Payment> {
    const newPayment: Payment = {
      id: `p${Date.now()}`,
      serviceId,
      serviceCode,
      clientId,
      clientName,
      amount: data.amount,
      method: data.method,
      paidAt: data.paidAt,
      notes: data.notes,
    };
    payments = [newPayment, ...payments];
    return newPayment;
  },

  async getTotalReceived(): Promise<number> {
    return payments.reduce((sum, p) => sum + p.amount, 0);
  },
};

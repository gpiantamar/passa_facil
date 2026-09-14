import { z } from "zod";

// =============================================
// CLIENT FORM SCHEMA
// =============================================

export const newClientSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nome deve ter ao menos 2 caracteres")
    .max(100, "Nome muito longo"),
  phone: z
    .string()
    .trim()
    .min(1, "Telefone é obrigatório")
    .refine((val) => {
      const digits = val.replace(/\D/g, "");
      return digits.length >= 10 && digits.length <= 11;
    }, "Digite um telefone válido com DDD (ex: (11) 98765-4321)"),
  address: z.string().trim().max(200, "Endereço muito longo").optional(),
  notes: z.string().trim().max(500, "Observações muito longas").optional(),
});

export type NewClientSchema = z.infer<typeof newClientSchema>;

// =============================================
// SERVICE ITEM FORM SCHEMA
// =============================================

export const serviceItemSchema = z.object({
  clothingTypeId: z.string().min(1, "Selecione um tipo de roupa"),
  clothingTypeName: z.string(),
  quantity: z
    .number()
    .int("Quantidade deve ser inteira")
    .min(1, "Quantidade mínima é 1"),
  pricePerUnit: z
    .number()
    .min(0.01, "Preço deve ser maior que zero"),
});

// =============================================
// SERVICE FORM SCHEMA
// =============================================

export const newServiceSchema = z.object({
  clientId: z.string().min(1, "Selecione um cliente"),
  receivedAt: z.string().min(1, "Informe a data de recebimento"),
  expectedDeliveryAt: z.string().min(1, "Informe a data de entrega prevista"),
  notes: z.string().max(500).optional(),
  items: z
    .array(serviceItemSchema)
    .min(1, "Adicione ao menos uma peça ao pedido"),
});

export type NewServiceSchema = z.infer<typeof newServiceSchema>;

// =============================================
// PAYMENT FORM SCHEMA
// =============================================

export const newPaymentSchema = z.object({
  amount: z
    .number()
    .min(0.01, "Valor deve ser maior que zero"),
  method: z.enum(["PIX", "DINHEIRO", "CARTAO", "OUTRO"]).refine(
    (v) => ["PIX", "DINHEIRO", "CARTAO", "OUTRO"].includes(v),
    "Selecione a forma de pagamento"
  ),
  paidAt: z.string().min(1, "Informe a data do pagamento"),
  notes: z.string().max(300).optional(),
});

export type NewPaymentSchema = z.infer<typeof newPaymentSchema>;

// =============================================
// SETTINGS SCHEMA
// =============================================

export const profileSchema = z.object({
  name: z.string().trim().min(2, "Nome deve ter ao menos 2 caracteres"),
  email: z.string().trim().email("Email inválido"),
});

export type ProfileSchema = z.infer<typeof profileSchema>;

export const clothingTypeSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome"),
  pricePerUnit: z
    .number()
    .min(0.01, "Preço deve ser maior que zero"),
});

export type ClothingTypeSchema = z.infer<typeof clothingTypeSchema>;

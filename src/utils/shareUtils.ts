import type { Service } from "../types";
import {
  formatCurrency,
  formatDate,
  formatServiceCode,
  formatServiceStatus,
} from "./formatters";

/**
 * Generates a friendly WhatsApp-ready message to send to the client
 * before they come to pick up their clothes.
 */
export function generateServiceShareText(service: Service): string {
  const itemLines = service.items
    .map(
      (item) =>
        `  • ${item.quantity}x ${item.clothingTypeName} — ${formatCurrency(item.subtotal)}`
    )
    .join("\n");

  const statusLabel = formatServiceStatus(service.status);

  const message = [
    `Olá, ${service.clientName.split(" ")[0]}! 👋`,
    ``,
    `Seu serviço de passadoria está *${statusLabel.toUpperCase()}* 🧺`,
    ``,
    `📋 *Resumo do serviço ${formatServiceCode(service.code)}*`,
    ``,
    `*Itens passados:*`,
    itemLines,
    ``,
    `🗓 Recebido em: ${formatDate(service.receivedAt)}`,
    `📦 Peças: ${service.totalPieces} no total`,
    ``,
    `💰 *Total: ${formatCurrency(service.totalAmount)}*`,
    service.paidAmount > 0 && service.paidAmount < service.totalAmount
      ? `✅ Pago: ${formatCurrency(service.paidAmount)} | Restante: ${formatCurrency(service.totalAmount - service.paidAmount)}`
      : service.paymentStatus === "PAGO"
      ? `✅ Pagamento: *Quitado*`
      : `⚠️ Pagamento: *Pendente*`,
    ``,
    `Qualquer dúvida, estamos à disposição! 😊`,
    `— *PassaFácil*`,
  ]
    .join("\n");

  return message;
}

/**
 * Opens WhatsApp with a pre-filled message for the client.
 * Strips non-digit characters from phone and prepends Brazil country code.
 */
export function shareViaWhatsApp(phone: string, text: string): void {
  const digits = phone.replace(/\D/g, "");
  // Add Brazil country code if not present
  const fullNumber = digits.startsWith("55") ? digits : `55${digits}`;
  const encodedText = encodeURIComponent(text);
  window.open(`https://wa.me/${fullNumber}?text=${encodedText}`, "_blank");
}

/**
 * Copies text to clipboard and returns true on success.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

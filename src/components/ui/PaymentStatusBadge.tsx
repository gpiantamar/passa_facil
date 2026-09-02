import React from "react";
import type { PaymentStatus } from "../../types";
import { formatPaymentStatus, getPaymentStatusColor } from "../../utils/formatters";

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  size?: "sm" | "md";
}

export function PaymentStatusBadge({ status, size = "md" }: PaymentStatusBadgeProps) {
  const { bg, text } = getPaymentStatusColor(status);
  const label = formatPaymentStatus(status);

  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full
        ${bg} ${text}
        ${size === "sm" ? "text-xs px-2 py-0.5" : "text-xs px-2.5 py-1"}
      `.trim()}
    >
      {label}
    </span>
  );
}

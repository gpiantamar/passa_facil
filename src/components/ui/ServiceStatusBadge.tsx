import React from "react";
import type { ServiceStatus } from "../../types";
import { formatServiceStatus, getServiceStatusColor } from "../../utils/formatters";

interface ServiceStatusBadgeProps {
  status: ServiceStatus;
  size?: "sm" | "md";
}

export function ServiceStatusBadge({ status, size = "md" }: ServiceStatusBadgeProps) {
  const { bg, text, dot } = getServiceStatusColor(status);
  const label = formatServiceStatus(status);

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium rounded-full
        ${bg} ${text}
        ${size === "sm" ? "text-xs px-2 py-0.5" : "text-xs px-2.5 py-1"}
      `.trim()}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`} />
      {label}
    </span>
  );
}

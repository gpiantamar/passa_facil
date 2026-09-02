import React from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";
import type { Toast, ToastType } from "../../hooks/useToast";

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
  error: <XCircle className="w-5 h-5 text-red-500" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
  info: <Info className="w-5 h-5 text-blue-500" />,
};

const borderColors: Record<ToastType, string> = {
  success: "border-l-emerald-500",
  error: "border-l-red-500",
  warning: "border-l-amber-500",
  info: "border-l-blue-500",
};

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  return (
    <div
      className={`flex items-start gap-3 bg-white rounded-xl shadow-lg border border-slate-100 border-l-4 ${borderColors[toast.type]} p-4 min-w-[280px] max-w-[380px] animate-slide-in-right`}
      role="alert"
    >
      <span className="flex-shrink-0 mt-0.5">{icons[toast.type]}</span>
      <p className="flex-1 text-sm text-slate-700 font-medium leading-snug">
        {toast.message}
      </p>
      <button
        onClick={() => onRemove(toast.id)}
        className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
        aria-label="Fechar notificação"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div
      className="fixed top-4 right-4 z-50 flex flex-col gap-2"
      aria-live="polite"
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  );
}

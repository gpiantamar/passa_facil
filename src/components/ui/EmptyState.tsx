import React from "react";
import type { LucideIcon } from "lucide-react";
import { Package } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  compact?: boolean;
}

export function EmptyState({
  icon: Icon = Package,
  title,
  description,
  action,
  compact = false,
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center animate-fade-in ${
        compact ? "py-8 px-4" : "py-16 px-6 bg-white/60 rounded-3xl border border-slate-100/80 shadow-sm"
      }`}
    >
      <div className="relative mb-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-50 to-sky-50 border border-indigo-100/60 flex items-center justify-center shadow-sm">
          <Icon className="w-8 h-8 text-indigo-500" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-indigo-500/10 blur-sm" />
      </div>

      <h3 className="text-base font-bold text-slate-800 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-slate-500 mb-5 max-w-sm leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}

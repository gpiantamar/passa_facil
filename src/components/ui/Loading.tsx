import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingProps {
  text?: string;
  fullPage?: boolean;
}

export function Loading({ text = "Carregando...", fullPage = false }: LoadingProps) {
  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-slate-900 animate-spin" />
          <p className="text-sm font-medium text-slate-600">{text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <Loader2 className="w-8 h-8 text-slate-900 animate-spin" />
      <p className="text-sm font-medium text-slate-500">{text}</p>
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-slate-100/90 rounded-xl ${className}`} />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 overflow-hidden">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-8 w-28" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex items-center gap-4 py-2 border-b border-slate-50 last:border-0">
            {Array.from({ length: cols }).map((__, c) => (
              <Skeleton
                key={c}
                className={`h-4 ${c === 0 ? "w-1/4" : c === cols - 1 ? "w-16 ml-auto" : "flex-1"}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function OrderCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-16" />
      </div>
      <Skeleton className="h-4 w-3/4" />
      <div className="flex items-center justify-between pt-2 border-t border-slate-50">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-5 w-20" />
      </div>
    </div>
  );
}

export function KanbanSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-slate-50/70 rounded-2xl p-4 border border-slate-100 flex flex-col gap-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-7 rounded-full" />
          </div>
          <OrderCardSkeleton />
          <OrderCardSkeleton />
        </div>
      ))}
    </div>
  );
}

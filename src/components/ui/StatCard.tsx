import React from "react";
import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "./Card";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  trend?: number;
  subtitle?: string;
  onClick?: () => void;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  iconColor = "text-indigo-600",
  iconBg = "bg-indigo-50",
  trend,
  subtitle,
  onClick,
}: StatCardProps) {
  return (
    <Card hover={!!onClick} onClick={onClick} className="animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
            {title}
          </p>
          <p className="text-2xl font-bold text-slate-800 leading-none">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1.5">{subtitle}</p>
          )}
          {trend !== undefined && (
            <div
              className={`flex items-center gap-1 mt-1.5 text-xs font-medium ${
                trend >= 0 ? "text-emerald-600" : "text-red-500"
              }`}
            >
              {trend >= 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span>
                {trend >= 0 ? "+" : ""}
                {trend}% este mês
              </span>
            </div>
          )}
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
      </div>
    </Card>
  );
}

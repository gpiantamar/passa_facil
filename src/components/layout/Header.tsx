import React from "react";
import { Bell, Menu } from "lucide-react";
import { useLocation } from "react-router-dom";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/clientes": "Clientes",
  "/clientes/novo": "Novo Cliente",
  "/servicos": "Serviços",
  "/servicos/novo": "Novo Serviço",
  "/pagamentos": "Pagamentos",
  "/relatorios": "Relatórios",
  "/configuracoes": "Configurações",
};

function getPageTitle(pathname: string): string {
  if (pageTitles[pathname]) return pageTitles[pathname];
  if (pathname.startsWith("/clientes/")) return "Detalhes do Cliente";
  if (pathname.startsWith("/servicos/")) return "Detalhes do Serviço";
  return "PassaFácil";
}

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { pathname } = useLocation();
  const title = getPageTitle(pathname);

  return (
    <header className="flex items-center h-14 px-4 sm:px-5 bg-white border-b border-slate-100 flex-shrink-0">
      {/* Mobile menu toggle */}
      <button
        onClick={onMenuClick}
        className="p-2 -ml-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors lg:hidden"
        aria-label="Abrir menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Title (mobile) */}
      <h1 className="text-sm font-semibold text-slate-800 ml-2 lg:hidden">
        {title}
      </h1>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Notifications */}
      <button
        className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
        aria-label="Notificações"
      >
        <Bell className="w-5 h-5" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
      </button>

      {/* Avatar */}
      <div className="ml-2 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
        <span className="text-xs font-bold text-indigo-700">A</span>
      </div>
    </header>
  );
}

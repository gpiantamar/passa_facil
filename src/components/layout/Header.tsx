import React, { useState } from "react";
import { Bell, Menu, LogOut } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const pageTitles: Record<string, string> = {
  "/app": "Dashboard",
  "/app/clientes": "Clientes",
  "/app/clientes/novo": "Novo Cliente",
  "/app/servicos": "Serviços",
  "/app/servicos/novo": "Novo Serviço",
  "/app/pagamentos": "Pagamentos",
  "/app/relatorios": "Relatórios",
  "/app/configuracoes": "Configurações",
};

function getPageTitle(pathname: string): string {
  if (pageTitles[pathname]) return pageTitles[pathname];
  if (pathname.startsWith("/app/clientes/")) return "Detalhes do Cliente";
  if (pathname.startsWith("/app/servicos/")) return "Detalhes do Serviço";
  return "PassaFácil";
}

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [confirmLogout, setConfirmLogout] = useState(false);
  const title = getPageTitle(pathname);

  const handleLogout = () => {
    if (confirmLogout) {
      logout();
      navigate("/entrar", { replace: true });
    } else {
      setConfirmLogout(true);
      // Cancela confirmação após 3 segundos
      setTimeout(() => setConfirmLogout(false), 3000);
    }
  };

  return (
    <header className="flex items-center h-14 px-4 sm:px-5 bg-white border-b border-slate-100 flex-shrink-0">
      {/* Mobile menu toggle */}
      <button
        onClick={onMenuClick}
        className="p-2 -ml-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors lg:hidden flex items-center justify-center flex-shrink-0"
        aria-label="Abrir menu"
      >
        <Menu className="w-5 h-5 flex-shrink-0" />
      </button>

      {/* Title (mobile) */}
      <h1 className="text-sm font-semibold text-slate-800 ml-2 lg:hidden truncate">
        {title}
      </h1>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Notifications */}
      <button
        className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors flex items-center justify-center flex-shrink-0"
        aria-label="Notificações"
      >
        <Bell className="w-5 h-5 flex-shrink-0" />
      </button>

      {/* Logout button */}
      <button
        onClick={handleLogout}
        title={confirmLogout ? "Clique novamente para confirmar" : "Sair"}
        className={`ml-1 p-2 rounded-xl transition-all flex items-center gap-1.5 flex-shrink-0 text-xs font-medium
          ${confirmLogout
            ? "bg-red-50 text-red-600 hover:bg-red-100 px-2.5"
            : "text-slate-500 hover:bg-slate-100"
          }`}
        aria-label="Sair da conta"
      >
        <LogOut className="w-4 h-4 flex-shrink-0" />
        {confirmLogout && <span>Confirmar</span>}
      </button>

      {/* Avatar */}
      <div className="ml-2 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
        <span className="text-xs font-bold text-indigo-700">P</span>
      </div>
    </header>
  );
}

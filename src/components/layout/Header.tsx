import React, { useState } from "react";
import { Menu, LogOut, Globe } from "lucide-react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { DarkModeToggle } from "../ui/DarkModeToggle";

const pageTitles: Record<string, string> = {
  "/painel": "Painel Operacional",
  "/painel/pedidos": "Fluxo de Pedidos",
  "/painel/servicos": "Fluxo de Pedidos",
  "/painel/servicos/novo": "Nova Entrada de Roupas",
  "/painel/clientes": "Gestão de Clientes",
  "/painel/clientes/novo": "Novo Cliente",
  "/painel/tabela-precos": "Tabela de Preços",
  "/painel/pagamentos": "Pagamentos",
  "/painel/relatorios": "Relatórios Operacionais",
  "/painel/configuracoes": "Configurações",
};

function getPageTitle(pathname: string): string {
  if (pageTitles[pathname]) return pageTitles[pathname];
  if (pathname.startsWith("/painel/clientes/")) return "Detalhes do Cliente";
  if (pathname.startsWith("/painel/servicos/")) return "Detalhes do Pedido";
  return "PassaFácil Operacional";
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
      navigate("/login", { replace: true });
    } else {
      setConfirmLogout(true);
      setTimeout(() => setConfirmLogout(false), 3000);
    }
  };

  return (
    <header className="flex items-center h-14 px-4 sm:px-5 bg-white border-b border-slate-200/80 flex-shrink-0">
      {/* Botão de Menu Mobile */}
      <button
        onClick={onMenuClick}
        className="p-2 -ml-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors lg:hidden flex items-center justify-center flex-shrink-0"
        aria-label="Abrir menu"
      >
        <Menu className="w-5 h-5 flex-shrink-0" />
      </button>

      {/* Título da Página no Header */}
      <h1 className="text-sm sm:text-base font-bold text-slate-900 ml-2 truncate">
        {title}
      </h1>

      <div className="flex-1" />

      {/* Toggle dark mode */}
      <DarkModeToggle className="mr-1" />

      {/* Botão para alternar e voltar à Landing Page */}
      <Link
        to="/"
        className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200/80 transition-colors mr-2"
        title="Ver Landing Page pública"
      >
        <Globe className="w-3.5 h-3.5 text-slate-400" />
        <span>Voltar ao Início</span>
      </Link>

      {/* Botão Sair */}
      <button
        onClick={handleLogout}
        title={confirmLogout ? "Clique para confirmar saída" : "Sair do sistema"}
        className={`ml-1 p-2 rounded-xl transition-all flex items-center gap-1.5 flex-shrink-0 text-xs font-semibold
          ${confirmLogout
            ? "bg-red-50 text-red-600 hover:bg-red-100 px-2.5"
            : "text-slate-500 hover:bg-slate-100"
          }`}
        aria-label="Sair da conta"
      >
        <LogOut className="w-4 h-4 flex-shrink-0" />
        {confirmLogout && <span>Confirmar</span>}
      </button>

      {/* Avatar do Operador */}
      <div className="ml-2 w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center flex-shrink-0">
        <span className="text-xs font-bold text-white">OP</span>
      </div>
    </header>
  );
}

import React from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Shirt,
  Tag,
  BarChart3,
  Settings,
  Wind,
  LogOut,
  X,
  CreditCard,
  Globe,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const navItems = [
  { to: "/painel", label: "Painel Operacional", icon: LayoutDashboard, end: true },
  { to: "/painel/pedidos", label: "Fluxo de Pedidos", icon: Shirt },
  { to: "/painel/clientes", label: "Clientes", icon: Users },
  { to: "/painel/tabela-precos", label: "Tabela de Preços", icon: Tag },
  { to: "/painel/pagamentos", label: "Pagamentos", icon: CreditCard },
  { to: "/painel/relatorios", label: "Relatórios", icon: BarChart3 },
  { to: "/painel/configuracoes", label: "Configurações", icon: Settings },
];

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const content = (
    <aside className="flex flex-col h-full bg-white border-r border-slate-200/80">
      {/* Logo e Identificação Operacional */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
        <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0 shadow-xs shadow-indigo-200 text-white">
          <Wind className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-extrabold text-slate-900 leading-tight">PassaFácil</p>
          <p className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider">Painel Operacional</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors lg:hidden flex items-center justify-center flex-shrink-0"
            aria-label="Fechar menu"
          >
            <X className="w-4 h-4 flex-shrink-0" />
          </button>
        )}
      </div>

      {/* Navegação Principal */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto" aria-label="Menu operacional">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700 shadow-2xs"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      className={`w-4.5 h-4.5 flex-shrink-0 ${
                        isActive ? "text-indigo-600" : "text-slate-400"
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Acesso Rápido para Voltar à Landing Page */}
      <div className="px-3 py-2 border-t border-slate-100">
        <Link
          to="/"
          onClick={onClose}
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-indigo-600 hover:bg-slate-50 transition-colors"
        >
          <Globe className="w-4 h-4 text-slate-400" />
          <span>Voltar ao Início (Site)</span>
        </Link>
      </div>

      {/* Rodapé do Usuário Operador */}
      <div className="px-3 py-3 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3 px-2 py-1.5 rounded-xl">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-indigo-700">OP</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-800 leading-tight truncate">
              Operador
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
              <p className="text-[11px] text-slate-500">Online</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors flex items-center justify-center flex-shrink-0"
            aria-label="Sair"
            title="Sair do sistema"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      <div className="hidden lg:flex flex-col w-56 flex-shrink-0 h-full">
        {content}
      </div>

      {open !== undefined && (
        <>
          <div
            className={`fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300 ${
              open ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={onClose}
            aria-hidden="true"
          />
          <div
            className={`fixed inset-y-0 left-0 z-50 w-64 lg:hidden transform transition-transform duration-300 ${
              open ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {content}
          </div>
        </>
      )}
    </>
  );
}

import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Shirt,
  CreditCard,
  BarChart3,
  Settings,
  Wind,
  LogOut,
  X,
} from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/clientes", label: "Clientes", icon: Users },
  { to: "/servicos", label: "Serviços", icon: Shirt },
  { to: "/pagamentos", label: "Pagamentos", icon: CreditCard },
  { to: "/relatorios", label: "Relatórios", icon: BarChart3 },
  { to: "/configuracoes", label: "Configurações", icon: Settings },
];

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  const content = (
    <aside className="flex flex-col h-full bg-white border-r border-slate-100">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-100">
        <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0">
          <Wind className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-800 leading-tight">PassaFácil</p>
          <p className="text-xs text-slate-500 leading-tight">Gestão de passadoria</p>
        </div>
        {/* Mobile close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors lg:hidden"
            aria-label="Fechar menu"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto" aria-label="Menu principal">
        <ul className="space-y-0.5">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                  }`
                }
                aria-current={undefined}
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      className={`w-4.5 h-4.5 flex-shrink-0 ${
                        isActive ? "text-indigo-600" : "text-slate-400"
                      }`}
                    />
                    {item.label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-slate-100">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-indigo-700">A</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-700 leading-tight truncate">
              Administradora
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <p className="text-xs text-slate-500">Online</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Sair"
            title="Sair"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col w-60 flex-shrink-0 h-full">
        {content}
      </div>

      {/* Mobile drawer */}
      {open !== undefined && (
        <>
          {/* Overlay */}
          <div
            className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
              open ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={onClose}
            aria-hidden="true"
          />
          {/* Drawer */}
          <div
            className={`fixed inset-y-0 left-0 z-50 w-72 lg:hidden transform transition-transform duration-300 ${
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

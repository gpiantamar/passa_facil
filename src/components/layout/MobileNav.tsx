import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Plus,
  CreditCard,
  MoreHorizontal,
} from "lucide-react";

export function MobileNav() {
  const navigate = useNavigate();

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-100 flex items-center safe-area-bottom"
      aria-label="Navegação principal"
    >
      <div className="flex items-center w-full px-2">
        {/* Dashboard */}
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center gap-0.5 py-3 text-xs font-medium transition-colors ${
              isActive ? "text-indigo-600" : "text-slate-500"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <LayoutDashboard className={`w-5 h-5 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
              <span>Início</span>
            </>
          )}
        </NavLink>

        {/* Clients */}
        <NavLink
          to="/clientes"
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center gap-0.5 py-3 text-xs font-medium transition-colors ${
              isActive ? "text-indigo-600" : "text-slate-500"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Users className={`w-5 h-5 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
              <span>Clientes</span>
            </>
          )}
        </NavLink>

        {/* New Service — central FAB */}
        <div className="flex-1 flex items-center justify-center py-1">
          <button
            onClick={() => navigate("/servicos/novo")}
            className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:bg-indigo-800 transition-all"
            aria-label="Novo serviço"
          >
            <Plus className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Payments */}
        <NavLink
          to="/pagamentos"
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center gap-0.5 py-3 text-xs font-medium transition-colors ${
              isActive ? "text-indigo-600" : "text-slate-500"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <CreditCard className={`w-5 h-5 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
              <span>Pagamentos</span>
            </>
          )}
        </NavLink>

        {/* More */}
        <NavLink
          to="/relatorios"
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center gap-0.5 py-3 text-xs font-medium transition-colors ${
              isActive ? "text-indigo-600" : "text-slate-500"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <MoreHorizontal className={`w-5 h-5 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
              <span>Mais</span>
            </>
          )}
        </NavLink>
      </div>
    </nav>
  );
}

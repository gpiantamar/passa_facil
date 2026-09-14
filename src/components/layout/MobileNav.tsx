import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Plus,
  Shirt,
  Tag,
} from "lucide-react";

export function MobileNav() {
  const navigate = useNavigate();

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 flex items-center safe-area-bottom shadow-lg"
      aria-label="Navegação rápida"
    >
      <div className="flex items-center w-full px-2 py-1">
        {/* Painel Operacional */}
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center gap-0.5 py-2 text-[11px] font-bold transition-colors ${
              isActive ? "text-indigo-600" : "text-slate-500"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <LayoutDashboard className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
              <span className="truncate">Painel</span>
            </>
          )}
        </NavLink>

        {/* Clientes */}
        <NavLink
          to="/clientes"
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center gap-0.5 py-2 text-[11px] font-bold transition-colors ${
              isActive ? "text-indigo-600" : "text-slate-500"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Users className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
              <span className="truncate">Clientes</span>
            </>
          )}
        </NavLink>

        {/* Central FAB - Nova Comanda */}
        <div className="flex-1 flex items-center justify-center">
          <button
            onClick={() => navigate("/servicos/novo")}
            className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-300 hover:bg-indigo-700 active:scale-95 transition-all flex-shrink-0"
            aria-label="Nova comanda"
            title="Nova comanda"
          >
            <Plus className="w-6 h-6 text-white flex-shrink-0" />
          </button>
        </div>

        {/* Pedidos */}
        <NavLink
          to="/pedidos"
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center gap-0.5 py-2 text-[11px] font-bold transition-colors ${
              isActive ? "text-indigo-600" : "text-slate-500"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Shirt className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
              <span className="truncate">Pedidos</span>
            </>
          )}
        </NavLink>

        {/* Tabela de Preços */}
        <NavLink
          to="/tabela-precos"
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center gap-0.5 py-2 text-[11px] font-bold transition-colors ${
              isActive ? "text-indigo-600" : "text-slate-500"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Tag className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
              <span className="truncate">Preços</span>
            </>
          )}
        </NavLink>
      </div>
    </nav>
  );
}

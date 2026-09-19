import React from "react";
import { Moon, Sun } from "lucide-react";
import { useDarkMode } from "../../hooks/useDarkMode";

interface DarkModeToggleProps {
  className?: string;
}

export function DarkModeToggle({ className = "" }: DarkModeToggleProps) {
  const { isDark, toggle } = useDarkMode();

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
      title={isDark ? "Modo claro" : "Modo escuro"}
      className={`relative w-9 h-9 rounded-xl flex items-center justify-center
        transition-all duration-200
        ${isDark
          ? "bg-slate-700 hover:bg-slate-600 text-amber-400"
          : "bg-slate-100 hover:bg-slate-200 text-slate-600"
        }
        ${className}
      `}
    >
      <span
        key={isDark ? "moon" : "sun"}
        className="animate-scale-in"
      >
        {isDark
          ? <Sun className="w-4 h-4" />
          : <Moon className="w-4 h-4" />
        }
      </span>
    </button>
  );
}

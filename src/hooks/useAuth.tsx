import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react";

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

// ─── Chave do localStorage ────────────────────────────────────────────────────
const TOKEN_KEY = "pf_auth_token";

// ─── Utilitário: decodifica o payload do JWT sem verificar assinatura ─────────
// (a verificação real acontece no servidor a cada requisição)
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const base64 = token.split(".")[1];
    const json = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function isTokenStillValid(token: string): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== "number") return false;
  // Considera expirado 30s antes do prazo real (margem de segurança)
  return payload.exp * 1000 > Date.now() + 30_000;
}

function loadToken(): string | null {
  try {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (stored && isTokenStillValid(stored)) return stored;
    // Token expirado ou inválido: remove imediatamente
    localStorage.removeItem(TOKEN_KEY);
    return null;
  } catch {
    return null;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(loadToken);

  const login = useCallback((newToken: string) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!token, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de <AuthProvider>.");
  return ctx;
}

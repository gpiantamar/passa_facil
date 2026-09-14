import React, { useEffect } from "react";
import { AppRouter } from "./routes";
import { ToastProvider } from "./lib/toastContext";
import { AuthProvider, useAuth } from "./hooks/useAuth";

/**
 * Ouve o evento global "pf:unauthorized" disparado pelo api.js
 * quando qualquer requisição recebe HTTP 401.
 * Faz logout automático e redireciona para login.
 */
function UnauthorizedWatcher() {
  const { logout } = useAuth();

  useEffect(() => {
    const handle = () => {
      logout();
      // Redireciona sem usar o router (evita loops)
      if (!window.location.pathname.startsWith("/login")) {
        window.location.replace("/login");
      }
    };
    window.addEventListener("pf:unauthorized", handle);
    return () => window.removeEventListener("pf:unauthorized", handle);
  }, [logout]);

  return null;
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <UnauthorizedWatcher />
        <AppRouter />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;

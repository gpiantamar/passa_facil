import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { AppLayout } from "../layouts/AppLayout";
import { LandingPage } from "../pages/Landing/LandingPage";
import { LoginPage } from "../pages/Login/LoginPage";
import { DashboardPage } from "../pages/Dashboard/DashboardPage";
import { ClientsPage } from "../pages/Clients/ClientsPage";
import { NewClientPage } from "../pages/Clients/NewClientPage";
import { ClientDetailPage } from "../pages/Clients/ClientDetailPage";
import { ServicesPage } from "../pages/Services/ServicesPage";
import { NewServicePage } from "../pages/Services/NewServicePage";
import { ServiceDetailPage } from "../pages/Services/ServiceDetailPage";
import { PaymentsPage } from "../pages/Payments/PaymentsPage";
import { ReportsPage } from "../pages/Reports/ReportsPage";
import { SettingsPage } from "../pages/Settings/SettingsPage";
import { useAuth } from "../hooks/useAuth";

/**
 * Guarda de rota: redireciona para /entrar se não autenticado.
 */
function ProtectedLayout() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/entrar" replace />;
  }
  return <AppLayout />;
}

/**
 * Rota só para usuários NÃO autenticados.
 * Se já estiver logado, vai direto para o app.
 */
function PublicOnlyRoute({ element }: { element: React.ReactElement }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/app" replace />;
  }
  return element;
}

const router = createBrowserRouter([
  // Landing page — pública, sempre acessível
  {
    path: "/",
    element: <LandingPage />,
  },
  // Login — só para quem não está logado
  {
    path: "/entrar",
    element: <PublicOnlyRoute element={<LoginPage />} />,
  },
  // Compatibilidade com link antigo /login
  {
    path: "/login",
    element: <Navigate to="/entrar" replace />,
  },
  // App — protegido por autenticação
  {
    path: "/app",
    element: <ProtectedLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "clientes", element: <ClientsPage /> },
      { path: "clientes/novo", element: <NewClientPage /> },
      { path: "clientes/:id", element: <ClientDetailPage /> },
      { path: "servicos", element: <ServicesPage /> },
      { path: "servicos/novo", element: <NewServicePage /> },
      { path: "servicos/:id", element: <ServiceDetailPage /> },
      { path: "pagamentos", element: <PaymentsPage /> },
      { path: "relatorios", element: <ReportsPage /> },
      { path: "configuracoes", element: <SettingsPage /> },
      { path: "*", element: <Navigate to="/app" replace /> },
    ],
  },
  // Qualquer rota desconhecida → landing
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

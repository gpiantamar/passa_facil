import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { AppLayout } from "../layouts/AppLayout";
import { LoginPage } from "../pages/Login/LoginPage";
import { DashboardPage } from "../pages/Dashboard/DashboardPage";
import { ClientsPage } from "../pages/Clients/ClientsPage";
import { NewClientPage } from "../pages/Clients/NewClientPage";
import { ClientDetailPage } from "../pages/Clients/ClientDetailPage";
import { ServicesPage } from "../pages/Services/ServicesPage";
import { NewServicePage } from "../pages/Services/NewServicePage";
import { ServiceDetailPage } from "../pages/Services/ServiceDetailPage";
import { PriceTablePage } from "../pages/PriceTable/PriceTablePage";
import { PaymentsPage } from "../pages/Payments/PaymentsPage";
import { ReportsPage } from "../pages/Reports/ReportsPage";
import { SettingsPage } from "../pages/Settings/SettingsPage";
import { useAuth } from "../hooks/useAuth";

/**
 * Guarda de rota: redireciona para /login se não autenticado.
 */
function ProtectedLayout() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <AppLayout />;
}

/**
 * Rota só para quem não está autenticado.
 * Se já estiver logado, vai direto para o painel operacional.
 */
function PublicOnlyRoute({ element }: { element: React.ReactElement }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return element;
}

const router = createBrowserRouter([
  // Login direto do sistema
  {
    path: "/login",
    element: <PublicOnlyRoute element={<LoginPage />} />,
  },
  {
    path: "/entrar",
    element: <Navigate to="/login" replace />,
  },

  // Painel Interno de Gestão Operacional (Protegido)
  {
    path: "/",
    element: <ProtectedLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "app", element: <Navigate to="/" replace /> },
      { path: "app/*", element: <Navigate to="/" replace /> },
      { path: "dashboard", element: <Navigate to="/" replace /> },

      // Módulo de Clientes
      { path: "clientes", element: <ClientsPage /> },
      { path: "clientes/novo", element: <NewClientPage /> },
      { path: "clientes/:id", element: <ClientDetailPage /> },

      // Módulo de Pedidos e Comandas
      { path: "pedidos", element: <ServicesPage /> },
      { path: "servicos", element: <ServicesPage /> },
      { path: "servicos/novo", element: <NewServicePage /> },
      { path: "servicos/:id", element: <ServiceDetailPage /> },

      // Módulo de Tabela de Preços
      { path: "tabela-precos", element: <PriceTablePage /> },
      { path: "precos", element: <Navigate to="/tabela-precos" replace /> },

      // Financeiro e Relatórios
      { path: "pagamentos", element: <PaymentsPage /> },
      { path: "relatorios", element: <ReportsPage /> },
      { path: "configuracoes", element: <SettingsPage /> },
    ],
  },

  // Fallback
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

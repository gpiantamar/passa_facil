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
import { PriceTablePage } from "../pages/PriceTable/PriceTablePage";
import { PaymentsPage } from "../pages/Payments/PaymentsPage";
import { ReportsPage } from "../pages/Reports/ReportsPage";
import { SettingsPage } from "../pages/Settings/SettingsPage";
import { useAuth } from "../hooks/useAuth";

/**
 * Guarda de rota para o Painel: redireciona para /login se não autenticado.
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
    return <Navigate to="/painel" replace />;
  }
  return element;
}

const router = createBrowserRouter([
  // 1. Rota Raiz (/) -> Landing Page Pública Moderna
  {
    path: "/",
    element: <LandingPage />,
  },

  // 2. Login
  {
    path: "/login",
    element: <PublicOnlyRoute element={<LoginPage />} />,
  },
  {
    path: "/entrar",
    element: <Navigate to="/login" replace />,
  },

  // 3. Rota do Painel (/painel) -> Dashboard Operacional Protegido
  {
    path: "/painel",
    element: <ProtectedLayout />,
    children: [
      { index: true, element: <DashboardPage /> },

      // Clientes
      { path: "clientes", element: <ClientsPage /> },
      { path: "clientes/novo", element: <NewClientPage /> },
      { path: "clientes/:id", element: <ClientDetailPage /> },

      // Pedidos / Fluxo de Produção
      { path: "pedidos", element: <ServicesPage /> },
      { path: "servicos", element: <ServicesPage /> },
      { path: "servicos/novo", element: <NewServicePage /> },
      { path: "servicos/:id", element: <ServiceDetailPage /> },

      // Tabela de Preços
      { path: "tabela-precos", element: <PriceTablePage /> },
      { path: "precos", element: <Navigate to="/painel/tabela-precos" replace /> },

      // Financeiro e Relatórios
      { path: "pagamentos", element: <PaymentsPage /> },
      { path: "relatorios", element: <ReportsPage /> },
      { path: "configuracoes", element: <SettingsPage /> },
      { path: "*", element: <Navigate to="/painel" replace /> },
    ],
  },

  // Compatibilidade com rota antiga /app -> /painel
  {
    path: "/app",
    element: <Navigate to="/painel" replace />,
  },
  {
    path: "/app/*",
    element: <Navigate to="/painel" replace />,
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

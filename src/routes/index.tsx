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
import { PaymentsPage } from "../pages/Payments/PaymentsPage";
import { ReportsPage } from "../pages/Reports/ReportsPage";
import { SettingsPage } from "../pages/Settings/SettingsPage";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <AppLayout />,
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
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

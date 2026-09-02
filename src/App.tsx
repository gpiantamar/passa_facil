import React from "react";
import { AppRouter } from "./routes";
import { ToastProvider } from "./lib/toastContext";

function App() {
  return (
    <ToastProvider>
      <AppRouter />
    </ToastProvider>
  );
}

export default App;

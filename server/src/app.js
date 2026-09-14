import express from "express";
import cors from "cors";
import clienteRoutes from "./routes/clienteRoutes.js";
import servicoRoutes from "./routes/servicoRoutes.js";
import pedidoRoutes from "./routes/pedidoRoutes.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";

const app = express();

// 1. Configuração de CORS aberta para integração irrestrita com o front-end
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 2. Parser para JSON no corpo das requisições
app.use(express.json());

// 3. Rota de boas-vindas e Health Check
app.get("/", (req, res) => {
  res.status(200).json({
    name: "PassaFácil API",
    version: "1.0.0",
    status: "online",
    endpoints: {
      clientes: "/clientes",
      servicos: "/servicos",
      pedidos: "/pedidos",
    },
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// 4. Registro dos endpoints da API
app.use("/clientes", clienteRoutes);
app.use("/servicos", servicoRoutes);
app.use("/pedidos", pedidoRoutes);

// 5. Middleware de 404 para rotas não encontradas
app.use(notFoundHandler);

// 6. Middleware global de tratamento de erros
app.use(errorHandler);

export default app;

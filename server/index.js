import "dotenv/config";
import app from "./src/app.js";

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`🚀 PassaFácil API rodando com sucesso na porta ${PORT}`);
  console.log(`📡 Endpoints disponíveis:`);
  console.log(`   - Clientes: http://localhost:${PORT}/clientes`);
  console.log(`   - Serviços: http://localhost:${PORT}/servicos`);
  console.log(`   - Pedidos:  http://localhost:${PORT}/pedidos`);
});

// Encerramento gracioso
const gracefulShutdown = (signal) => {
  console.log(`\nRecebido sinal ${signal}. Encerrando servidor HTTP...`);
  server.close(() => {
    console.log("Servidor HTTP encerrado.");
    process.exit(0);
  });
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

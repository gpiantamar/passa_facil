// Middleware global para tratamento de erros e exceções
export function errorHandler(err, req, res, next) {
  console.error("[API Error]", err);

  // Tratamento de erros conhecidos do Prisma
  if (err.code === "P2002") {
    return res.status(409).json({
      error: "Violação de campo único (registro duplicado).",
      meta: err.meta,
    });
  }

  if (err.code === "P2025") {
    return res.status(404).json({
      error: "Registro solicitado não foi encontrado no banco de dados.",
    });
  }

  // Erro de JSON malformado no body
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      error: "JSON inválido no corpo da requisição.",
    });
  }

  // Erro padrão 500
  const statusCode = err.statusCode || 500;
  const message = err.message || "Ocorreu um erro interno no servidor.";

  return res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === "development" ? { stack: err.stack } : {}),
  });
}

// Middleware para rotas inexistentes (404)
export function notFoundHandler(req, res) {
  return res.status(404).json({
    error: `Rota '${req.method} ${req.originalUrl}' não encontrada.`,
  });
}

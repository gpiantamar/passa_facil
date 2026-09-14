import jwt from "jsonwebtoken";

/**
 * Verifica o token JWT da requisição.
 * Lança um erro com statusCode 401 se inválido/ausente.
 */
export function verifyToken(req) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    const err = new Error("JWT_SECRET não configurado no servidor.");
    err.statusCode = 500;
    throw err;
  }

  const authHeader = req.headers["authorization"] || "";
  if (!authHeader.startsWith("Bearer ")) {
    const err = new Error("Token de autenticação não fornecido.");
    err.statusCode = 401;
    throw err;
  }

  const token = authHeader.slice(7);
  try {
    return jwt.verify(token, secret, { issuer: "passa-facil" });
  } catch {
    const err = new Error("Token inválido ou expirado. Faça login novamente.");
    err.statusCode = 401;
    throw err;
  }
}

/**
 * Helper: chama verifyToken e responde 401 automaticamente se falhar.
 * Retorna o payload do token, ou null se a resposta já foi enviada.
 */
export function requireAuth(req, res) {
  try {
    return verifyToken(req);
  } catch (err) {
    res.status(err.statusCode || 401).json({ error: err.message });
    return null;
  }
}

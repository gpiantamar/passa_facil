import jwt from "jsonwebtoken";
import crypto from "crypto";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

/**
 * Comparação de strings resistente a timing-attacks.
 * Evita que um atacante descubra a senha medindo o tempo de resposta.
 */
function timingSafeCompare(a, b) {
  // Sempre cria buffers do mesmo tamanho para não vazar info sobre comprimento
  const bufA = Buffer.from(String(a).padEnd(256, "\0"));
  const bufB = Buffer.from(String(b).padEnd(256, "\0"));
  // crypto.timingSafeEqual garante tempo constante
  return crypto.timingSafeEqual(bufA, bufB) && a.length === b.length;
}

/**
 * POST /api/auth/login
 * Body: { email: string, password: string }
 * Resposta: { token: string, expiresIn: number }
 */
export default async function handler(req, res) {
  Object.entries(corsHeaders).forEach(([k, v]) => res.setHeader(k, v));
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido." });
  }

  const APP_EMAIL = process.env.APP_EMAIL;
  const APP_PASSWORD = process.env.APP_PASSWORD;
  const JWT_SECRET = process.env.JWT_SECRET;

  // Validação de configuração do servidor
  if (!APP_EMAIL || !APP_PASSWORD || !JWT_SECRET) {
    console.error("[auth/login] Variáveis APP_EMAIL, APP_PASSWORD ou JWT_SECRET não configuradas.");
    return res.status(500).json({ error: "Configuração de autenticação incompleta no servidor." });
  }

  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: "Email e senha são obrigatórios." });
  }

  // Comparação timing-safe para email e senha (evita brute-force por timing)
  const emailOk = timingSafeCompare(
    email.toLowerCase().trim(),
    APP_EMAIL.toLowerCase().trim()
  );
  const passwordOk = timingSafeCompare(password, APP_PASSWORD);

  // Sempre executa ambas as comparações antes de decidir (evita short-circuit timing leak)
  if (!emailOk || !passwordOk) {
    // Delay artificial de 200ms para dificultar brute-force de tempo de resposta
    await new Promise((r) => setTimeout(r, 200));
    return res.status(401).json({ error: "Email ou senha incorretos." });
  }

  const EXPIRES_IN_SECONDS = 7 * 24 * 60 * 60; // 7 dias

  const token = jwt.sign(
    {
      sub: APP_EMAIL,
      role: "admin",
      iat: Math.floor(Date.now() / 1000),
    },
    JWT_SECRET,
    {
      expiresIn: EXPIRES_IN_SECONDS,
      issuer: "passa-facil",
      algorithm: "HS256",
    }
  );

  return res.status(200).json({
    token,
    expiresIn: EXPIRES_IN_SECONDS,
  });
}

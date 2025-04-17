// controllers/authController.js
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { tokenBlacklist } = require("../utils/tokenBlacklist");

const prisma = new PrismaClient();

/** Função simples para validar email via regex */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * REGISTER (criar novo usuário)
 * - username, email, password obrigatórios
 * - fullName opcional
 */
const registerUser = async (req, res) => {
  const { username, email, password, fullName } = req.body;

  // Arrays para armazenar parâmetros ausentes e inválidos
  const missingParams = [];
  const invalidParams = [];

  if (!username) missingParams.push("username");
  if (!email) missingParams.push("email");
  if (!password) missingParams.push("password");

  if (missingParams.length > 0) {
    return res.status(400).json({
      erro: "Parâmetros obrigatórios ausentes",
      detalhes: { missingParams },
    });
  }

  // Valida tipos/formato
  if (typeof username !== "string") {
    invalidParams.push("username (deve ser string)");
  }
  if (typeof email !== "string" || !isValidEmail(email)) {
    invalidParams.push("email (formato inválido)");
  }
  if (typeof password !== "string" || password.length < 6) {
    invalidParams.push("password (mínimo de 6 caracteres)");
  }
  if (fullName !== undefined && typeof fullName !== "string") {
    invalidParams.push("fullName (deve ser string)");
  }

  if (invalidParams.length > 0) {
    return res.status(400).json({
      erro: "Campos inválidos",
      detalhes: invalidParams,
    });
  }

  try {
    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar o user no Prisma
    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash: hashedPassword,
        fullName,
      },
    });

    // Gerar token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(201).json({ user, token });
  } catch (error) {
    console.error("Erro ao criar utilizador:", error.message);

    // Se for duplicidade (P2002), provavelmente username ou email já existe
    if (error.code === "P2002") {
      return res.status(400).json({
        erro: "Username ou Email já existe",
        detalhes: error.message,
      });
    }

    return res.status(500).json({
      erro: "Erro ao criar o utilizador",
      detalhes: error.message,
    });
  }
};

/**
 * LOGIN
 * - Recebe email, password
 * - Retorna token JWT se credenciais forem válidas
 */
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const missingParams = [];
  const invalidParams = [];

  if (!email) missingParams.push("email");
  if (!password) missingParams.push("password");

  if (missingParams.length > 0) {
    return res.status(400).json({
      erro: "Parâmetros obrigatórios ausentes",
      detalhes: { missingParams },
    });
  }

  if (typeof email !== "string" || !isValidEmail(email)) {
    invalidParams.push("email (formato inválido)");
  }
  if (typeof password !== "string" || password.length < 6) {
    invalidParams.push("password (mínimo de 6 caracteres)");
  }

  if (invalidParams.length > 0) {
    return res.status(400).json({
      erro: "Campos inválidos",
      detalhes: invalidParams,
    });
  }

  try {
    // Encontrar user pelo email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ erro: "Usuário não encontrado." });
    }

    // Verificar senha
    const passwordIsValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordIsValid) {
      return res.status(400).json({ erro: "Senha incorreta." });
    }

    // Gerar token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({ token });
  } catch (error) {
    console.error("Erro no login:", error.message);
    return res.status(500).json({
      erro: "Erro no login",
      detalhes: error.message,
    });
  }
};


const logoutUser = (req, res) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(400).json({ erro: "Token não fornecido" });
  }

  try {
    const tokenValue = token.startsWith("Bearer ")
      ? token.slice(7)
      : token;

    tokenBlacklist.add(tokenValue);

    return res.status(200).json({
      mensagem: "Logout realizado com sucesso. Token invalidado.",
    });
  } catch (error) {
    console.error("Erro no logout:", error.message);
    return res.status(500).json({
      erro: "Erro ao realizar o logout.",
      detalhes: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};

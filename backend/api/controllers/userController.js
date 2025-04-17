const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

// Regex simples para validar formato de email
function isValidEmail(email) {
  // Regex simples, não cobre 100% dos casos de email, mas é suficiente para a maioria
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Criação de utilizador
 * Campos obrigatórios: username (string), email (string, formato válido), password (string, min 6)
 * Campo opcional: fullName (string)
 */
const createUser = async (req, res) => {
  const { username, email, password, fullName } = req.body;

  const missingParams = [];
  const invalidParams = [];

  // Checa campos obrigatórios
  if (!username) missingParams.push("username");
  if (!email) missingParams.push("email");
  if (!password) missingParams.push("password");

  // Se algum obrigatório estiver faltando, retorna
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
  if (typeof email !== "string") {
    invalidParams.push("email (deve ser string)");
  } else if (!isValidEmail(email)) {
    invalidParams.push("email (formato inválido)");
  }
  if (typeof password !== "string") {
    invalidParams.push("password (deve ser string)");
  } else if (password.length < 6) {
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
    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria o utilizador
    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash: hashedPassword,
        fullName,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    console.error("Erro ao criar utilizador:", error.message);

    // Erro de duplicidade (P2002) no Prisma (username ou email já existe)
    if (error.code === "P2002") {
      return res
        .status(400)
        .json({ erro: "Username ou Email já existem", detalhes: error.message });
    }

    res.status(500).json({
      erro: "Não foi possível criar o utilizador.",
      detalhes: error.message,
    });
  }
};

/**
 * Retorna todos os utilizadores
 * (Sem validações pois não recebe parâmetros do corpo)
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.error("Erro ao buscar utilizadores:", error.message);
    res.status(500).json({
      erro: "Não foi possível obter os utilizadores.",
      detalhes: error.message,
    });
  }
};

/**
 * Retorna um utilizador por ID
 * Valida se o ID é um número
 */
const getUserById = async (req, res) => {
  const { id } = req.params;
  const numericId = parseInt(id, 10);

  // Se o ID não for numérico, erro 400
  if (isNaN(numericId)) {
    return res.status(400).json({
      erro: "ID inválido",
      detalhes: "O ID deve ser um número.",
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: numericId },
    });

    if (!user) {
      return res.status(404).json({
        erro: `Utilizador com ID ${numericId} não encontrado.`,
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(`Erro ao buscar utilizador com ID ${id}:`, error.message);
    res.status(500).json({
      erro: "Erro ao buscar utilizador.",
      detalhes: error.message,
    });
  }
};

/**
 * Atualiza um utilizador (tudo opcional, mas valida tipos/formato)
 */
const updateUser = async (req, res) => {
  const { id } = req.params;
  const numericId = parseInt(id, 10);

  // Valida ID numérico
  if (isNaN(numericId)) {
    return res.status(400).json({
      erro: "ID inválido",
      detalhes: "O ID deve ser um número válido.",
    });
  }

  // Extrai campos do body
  const { username, email, password, fullName } = req.body;
  const dataToUpdate = {};
  const invalidParams = [];

  // Se username foi enviado, valida
  if (username !== undefined) {
    if (typeof username !== "string") {
      invalidParams.push("username (deve ser string)");
    } else {
      dataToUpdate.username = username;
    }
  }

  // Se email foi enviado, valida
  if (email !== undefined) {
    if (typeof email !== "string") {
      invalidParams.push("email (deve ser string)");
    } else if (!isValidEmail(email)) {
      invalidParams.push("email (formato inválido)");
    } else {
      dataToUpdate.email = email;
    }
  }

  // Se password foi enviado, valida
  if (password !== undefined) {
    if (typeof password !== "string") {
      invalidParams.push("password (deve ser string)");
    } else if (password.length < 6) {
      invalidParams.push("password (mínimo de 6 caracteres)");
    } else {
      // Criptografa a nova senha
      const hashed = await bcrypt.hash(password, 10);
      dataToUpdate.passwordHash = hashed;
    }
  }

  // Se fullName foi enviado, valida
  if (fullName !== undefined) {
    if (typeof fullName !== "string") {
      invalidParams.push("fullName (deve ser string)");
    } else {
      dataToUpdate.fullName = fullName;
    }
  }

  // Se encontramos parâmetros inválidos
  if (invalidParams.length > 0) {
    return res.status(400).json({
      erro: "Campos inválidos para atualização",
      detalhes: invalidParams,
    });
  }

  // Se não chegou nenhum campo para atualizar
  if (Object.keys(dataToUpdate).length === 0) {
    return res.status(400).json({
      erro: "Não há dados para atualizar.",
    });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: numericId },
      data: dataToUpdate,
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(`Erro ao atualizar utilizador com ID ${id}:`, error.message);
    if (error.code === "P2002") {
      return res
        .status(400)
        .json({ erro: "Username ou Email já existem", detalhes: error.message });
    }
    res.status(500).json({
      erro: "Não foi possível atualizar o utilizador.",
      detalhes: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  const numericId = parseInt(id, 10);

  if (isNaN(numericId)) {
    return res.status(400).json({
      erro: "ID inválido",
      detalhes: "O ID deve ser um número válido.",
    });
  }

  try {
    await prisma.user.delete({
      where: { id: numericId },
    });

    return res.status(200).json({
      mensagem: `Utilizador com ID ${numericId} foi apagado com sucesso.`,
    });
  } catch (error) {
    console.error(`Erro ao apagar utilizador com ID ${id}:`, error.message);
    return res.status(500).json({
      erro: "Não foi possível apagar o utilizador.",
      detalhes: error.message,
    });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};

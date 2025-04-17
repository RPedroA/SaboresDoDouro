const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Cria (ou atualiza) um DailyHealthMetrics para um usuário em um determinado dia.
 *
 * - Se já existir um registro para o usuário e a data fornecida, ele será atualizado.
 * - Se não existir, um novo registro será criado.
 */
const createOrUpdateDailyHealthMetrics = async (req, res) => {
  const {
    userId,
    date,
    caloriesConsumed,
    waterConsumedMl,
    stepsCount,
    weightKg,
    sleepQuality,
    sleepHours,
  } = req.body;

  // Validações iniciais
  const missingParams = [];
  const invalidParams = [];

  if (!userId) {
    missingParams.push("userId");
  } else if (typeof userId !== "number") {
    invalidParams.push("userId deve ser um número");
  }

  if (!date) {
    missingParams.push("date");
  } else if (isNaN(new Date(date))) {
    invalidParams.push("date deve ser uma data válida");
  }

  if (caloriesConsumed !== undefined && typeof caloriesConsumed !== "number") {
    invalidParams.push("caloriesConsumed deve ser um número");
  }
  if (waterConsumedMl !== undefined && typeof waterConsumedMl !== "number") {
    invalidParams.push("waterConsumedMl deve ser um número");
  }
  if (stepsCount !== undefined && typeof stepsCount !== "number") {
    invalidParams.push("stepsCount deve ser um número");
  }
  if (weightKg !== undefined && isNaN(parseFloat(weightKg))) {
    invalidParams.push("weightKg deve ser um número decimal");
  }
  if (sleepQuality !== undefined && (typeof sleepQuality !== "number" || sleepQuality < 0 || sleepQuality > 100)) {
    invalidParams.push("sleepQuality deve estar entre 0 e 100");
  }
  if (sleepHours !== undefined && (typeof sleepHours !== "number" || sleepHours < 0 || sleepHours > 24)) {
    invalidParams.push("sleepHours deve estar entre 0 e 24");
  }

  // Retorna erro se há parâmetros obrigatórios ausentes
  if (missingParams.length > 0) {
    return res.status(400).json({
      erro: "Parâmetros obrigatórios ausentes",
      detalhes: missingParams,
    });
  }

  // Retorna erro se há parâmetros inválidos
  if (invalidParams.length > 0) {
    return res.status(400).json({
      erro: "Parâmetros inválidos",
      detalhes: invalidParams,
    });
  }

  try {
    // Verifica se já existe um registro para o mesmo userId e date
    const existingMetrics = await prisma.dailyHealthMetrics.findUnique({
      where: { userId_date: { userId, date: new Date(date) } },
    });

    if (existingMetrics) {
      // Atualiza o registro existente
      const updatedMetrics = await prisma.dailyHealthMetrics.update({
        where: { id: existingMetrics.id },
        data: {
          caloriesConsumed,
          waterConsumedMl,
          stepsCount,
          weightKg: weightKg !== undefined ? String(weightKg) : existingMetrics.weightKg,
          sleepQuality,
          sleepHours,
        },
      });

      return res.status(200).json(updatedMetrics);
    }

    // Cria um novo registro se não existir um para esse dia
    const newMetrics = await prisma.dailyHealthMetrics.create({
      data: {
        userId,
        date: new Date(date),
        caloriesConsumed,
        waterConsumedMl,
        stepsCount,
        weightKg: weightKg !== undefined ? String(weightKg) : undefined,
        sleepQuality,
        sleepHours,
      },
    });

    return res.status(201).json(newMetrics);
  } catch (error) {
    console.error("Erro ao criar/atualizar DailyHealthMetrics:", error.message);

    if (error.code === "P2002") {
      return res.status(400).json({
        erro: "Já existe um DailyHealthMetrics para este usuário e esta data",
        detalhes: error.message,
      });
    }

    return res.status(500).json({
      erro: "Falha ao processar DailyHealthMetrics",
      detalhes: error.message,
    });
  }
};

/**
 * Obtém todos os registros de DailyHealthMetrics.
 */
const getAllDailyHealthMetrics = async (req, res) => {
  try {
    const metrics = await prisma.dailyHealthMetrics.findMany();
    return res.status(200).json(metrics);
  } catch (error) {
    console.error("Erro ao buscar DailyHealthMetrics:", error.message);
    return res.status(500).json({
      erro: "Não foi possível buscar os registros",
      detalhes: error.message,
    });
  }
};

/**
 * Obtém um registro de DailyHealthMetrics por ID.
 */
const getDailyHealthMetricsById = async (req, res) => {
  const { id } = req.params;
  const numericId = parseInt(id, 10);

  if (isNaN(numericId)) {
    return res.status(400).json({ erro: "ID inválido", detalhes: "O ID deve ser um número válido" });
  }

  try {
    const metrics = await prisma.dailyHealthMetrics.findUnique({ where: { id: numericId } });

    if (!metrics) {
      return res.status(404).json({ erro: `Registro com ID ${numericId} não encontrado` });
    }

    return res.status(200).json(metrics);
  } catch (error) {
    console.error(`Erro ao buscar DailyHealthMetrics com ID ${id}:`, error.message);
    return res.status(500).json({
      erro: "Não foi possível buscar o registro",
      detalhes: error.message,
    });
  }
};

/**
 * Atualiza um DailyHealthMetrics pelo ID.
 */
const updateDailyHealthMetrics = async (req, res) => {
  const { id } = req.params;
  const numericId = parseInt(id, 10);

  if (isNaN(numericId)) {
    return res.status(400).json({ erro: "ID inválido", detalhes: "O ID deve ser um número válido" });
  }

  const {
    date,
    caloriesConsumed,
    waterConsumedMl,
    stepsCount,
    weightKg,
    sleepQuality,
    sleepHours,
  } = req.body;

  const dataToUpdate = {};

  if (date !== undefined && !isNaN(new Date(date))) {
    dataToUpdate.date = new Date(date);
  }
  if (caloriesConsumed !== undefined) {
    dataToUpdate.caloriesConsumed = caloriesConsumed;
  }
  if (waterConsumedMl !== undefined) {
    dataToUpdate.waterConsumedMl = waterConsumedMl;
  }
  if (stepsCount !== undefined) {
    dataToUpdate.stepsCount = stepsCount;
  }
  if (weightKg !== undefined && !isNaN(parseFloat(weightKg))) {
    dataToUpdate.weightKg = String(weightKg);
  }
  if (sleepQuality !== undefined) {
    dataToUpdate.sleepQuality = sleepQuality;
  }
  if (sleepHours !== undefined) {
    dataToUpdate.sleepHours = sleepHours;
  }

  try {
    const updatedMetrics = await prisma.dailyHealthMetrics.update({
      where: { id: numericId },
      data: dataToUpdate,
    });

    return res.status(200).json(updatedMetrics);
  } catch (error) {
    console.error(`Erro ao atualizar DailyHealthMetrics com ID ${id}:`, error.message);
    return res.status(500).json({
      erro: "Não foi possível atualizar o registro",
      detalhes: error.message,
    });
  }
};

/**
 * Remove um DailyHealthMetrics pelo ID.
 */
const deleteDailyHealthMetrics = async (req, res) => {
  const { id } = req.params;
  const numericId = parseInt(id, 10);

  if (isNaN(numericId)) {
    return res.status(400).json({ erro: "ID inválido", detalhes: "O ID deve ser um número válido" });
  }

  try {
    await prisma.dailyHealthMetrics.delete({ where: { id: numericId } });

    return res.status(200).json({ mensagem: `DailyHealthMetrics com ID ${numericId} foi removido com sucesso.` });
  } catch (error) {
    console.error(`Erro ao apagar DailyHealthMetrics com ID ${id}:`, error.message);
    return res.status(500).json({
      erro: "Não foi possível apagar o registro",
      detalhes: error.message,
    });
  }
};

module.exports = {
    createOrUpdateDailyHealthMetrics,  
    getAllDailyHealthMetrics,
    getDailyHealthMetricsById,
    updateDailyHealthMetrics,  
    deleteDailyHealthMetrics,
};

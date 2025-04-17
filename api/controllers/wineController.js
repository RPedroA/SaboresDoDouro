const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Criar um vinho
const createWine = async (req, res) => {
  const {
    name,
    description,
    price,
    imagem,
    bottleSizes,
    isPromotion,
    promotionPrice,
    emDestaque,
    descricaoDestaque,
  } = req.body;

  const missingParams = [];
  const invalidParams = [];

  if (!name) missingParams.push("name");
  else if (typeof name !== "string") invalidParams.push("name");

  if (!description) missingParams.push("description");
  else if (typeof description !== "string") invalidParams.push("description");

  if (!price) missingParams.push("price");
  else if (typeof price !== "number") invalidParams.push("price");

  if (!imagem) missingParams.push("imagem");
  else if (typeof imagem !== "string") invalidParams.push("imagem");

  if (!bottleSizes || !Array.isArray(bottleSizes)) missingParams.push("bottleSizes");

  if (isPromotion !== undefined && typeof isPromotion !== "boolean")
    invalidParams.push("isPromotion");

  if (promotionPrice !== undefined && typeof promotionPrice !== "number")
    invalidParams.push("promotionPrice");

  if (emDestaque !== undefined && typeof emDestaque !== "boolean")
    invalidParams.push("emDestaque");

  if (descricaoDestaque !== undefined && typeof descricaoDestaque !== "string")
    invalidParams.push("descricaoDestaque");

  if (missingParams.length > 0 || invalidParams.length > 0) {
    return res.status(400).json({
      erro: "Parâmetros inválidos ou em falta",
      detalhes: {
        emFalta: missingParams,
        tiposIncorretos: invalidParams,
      },
    });
  }

  try {
    const wine = await prisma.wine.create({
      data: {
        nome: name,
        descricao: description,
        preco: price,
        imagem, 
        emPromocao: isPromotion || false,
        precoPromocao: promotionPrice || null,
        emDestaque: emDestaque || false,
        descricaoDestaque: descricaoDestaque || null,
        bottleSizes: {
          connect: bottleSizes.map((sizeId) => ({ bottle_size_id: sizeId })),
        },
      },
    });

    res.status(201).json(wine);
  } catch (error) {
    console.error("Erro ao criar o vinho:", error.message);
    res.status(500).json({
      erro: "Erro interno ao criar o vinho.",
      detalhes: error.message,
    });
  }
};

// Obter todos os vinhos
const getAllWines = async (req, res) => {
  try {
    const wines = await prisma.wine.findMany({
      include: { bottleSizes: true },
    });

    wines.forEach((wine) => {
      wine.imagem = wine.imagem || "default-image.jpg";
    });

    res.status(200).json(wines);
  } catch (error) {
    console.error("Erro ao buscar todos os vinhos:", error.message);
    res.status(500).json({
      erro: "Não foi possível obter os vinhos.",
      detalhes: error.message,
    });
  }
};

// Obter um vinho por ID
const getWineById = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({
      erro: "ID inválido",
      detalhes: "O ID deve ser um número válido.",
    });
  }

  try {
    const wine = await prisma.wine.findUnique({
      where: { wine_id: parseInt(id) },
      include: { bottleSizes: true },
    });

    if (!wine) {
      return res.status(404).json({ erro: `Vinho com ID ${id} não encontrado.` });
    }

    wine.imagem = wine.imagem || "default-image.jpg";
    res.status(200).json(wine);
  } catch (error) {
    res.status(500).json({
      erro: "Erro ao buscar o vinho",
      detalhes: error.message,
    });
  }
};

// Atualizar um vinho
const updateWine = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    description,
    price,
    imagem,
    bottleSizes,
    isPromotion,
    promotionPrice,
    emDestaque,
    descricaoDestaque,
  } = req.body;

  if (!id || isNaN(id)) {
    return res.status(400).json({
      erro: "ID inválido",
      detalhes: "O ID deve ser um número válido.",
    });
  }

  try {
    const updateData = {};

    if (name) updateData.nome = name;
    if (description) updateData.descricao = description;
    if (price) updateData.preco = price;
    if (imagem) updateData.imagem = imagem; 
    if (isPromotion !== undefined) updateData.emPromocao = isPromotion;
    if (promotionPrice !== undefined) updateData.precoPromocao = promotionPrice;
    if (emDestaque !== undefined) updateData.emDestaque = emDestaque;
    if (descricaoDestaque) updateData.descricaoDestaque = descricaoDestaque;

    const updatedWine = await prisma.wine.update({
      where: { wine_id: parseInt(id) },
      data: updateData,
    });

    if (bottleSizes && Array.isArray(bottleSizes)) {
      await prisma.wineBottleSize.deleteMany({
        where: { wine_id: parseInt(id) },
      });

      const sizeConnections = bottleSizes.map((sizeId) => ({
        wine_id: parseInt(id),
        bottle_size_id: sizeId,
      }));
      await prisma.wineBottleSize.createMany({ data: sizeConnections });
    }

    res.status(200).json({
      mensagem: "Vinho atualizado com sucesso.",
      dados: updatedWine,
    });
  } catch (error) {
    console.error("Erro ao atualizar o vinho:", error.message);
    res.status(500).json({
      erro: "Erro ao atualizar o vinho.",
      detalhes: error.message,
    });
  }
};

const deleteWine = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({
      erro: "ID inválido",
      detalhes: "O ID deve ser um número válido.",
    });
  }

  try {
    const wine = await prisma.wine.findUnique({
      where: { wine_id: parseInt(id) },
    });

    if (!wine) {
      return res.status(404).json({ erro: `Vinho com ID ${id} não encontrado.` });
    }

    if (wine.emDestaque) {
      return res.status(400).json({
        erro: "Não é possível apagar o vinho em destaque.",
      });
    }
    await prisma.wineBottleSize.deleteMany({ where: { wine_id: parseInt(id) } });
    await prisma.review.deleteMany({ where: { wine_id: parseInt(id) } });
    await prisma.wine.delete({ where: { wine_id: parseInt(id) } });

    return res.status(200).json({ mensagem: `Vinho com ID ${id} apagado com sucesso.` });
  } catch (error) {
    console.error("Erro ao apagar o vinho:", error.message);
    return res.status(500).json({
      erro: "Erro ao apagar o vinho.",
      detalhes: error.message,
    });
  }
};


module.exports = {
  createWine,
  getAllWines,
  getWineById,
  updateWine,
  deleteWine,
};

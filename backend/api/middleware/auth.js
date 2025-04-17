const jwt = require("jsonwebtoken");
const { tokenBlacklist } = require("../utils/tokenBlacklist");

const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]; 

  if (!token) {
    return res.status(401).json({ erro: "Token não fornecido" });
  }

  try {
    const tokenValue = token.startsWith("Bearer ")
      ? token.slice(7)
      : token;

    if (tokenBlacklist.has(tokenValue)) {
      return res.status(403).json({ erro: "Token inválido (blacklisted)" });
    }

    const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    next();
  } catch (err) {
    console.error("Erro ao verificar token:", err.message);
    return res.status(403).json({ erro: "Token inválido ou expirado" });
  }
};

module.exports = authenticateToken;

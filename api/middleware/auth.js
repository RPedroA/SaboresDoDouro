const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]; // Pega o token do cabeçalho Authorization

  if (!token) {
    return res.status(401).json({ erro: "Token não fornecido" }); // Retorna erro se o token não for fornecido
  }

  try {
    // Remove o prefixo "Bearer ", se existir
    const tokenValue = token.startsWith("Bearer ") ? token.slice(7) : token;

    // Verifica e decodifica o token
    const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);

    // Adiciona as informações decodificadas ao req.user
    req.user = {
      id: decoded.id,       
      email: decoded.email,  
      isAdmin: decoded.isAdmin, 
    };

    next(); 
  } catch (err) {
    console.error("Erro ao verificar token:", err.message);
    return res.status(403).json({ erro: "Token inválido ou expirado" }); 
  }
};

module.exports = authenticateToken;

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const router = require("./routes/");

const app = express();

// Middleware para JSON
app.use(bodyParser.json());

// Configuração do CORS
const allowedOrigins = [
    "http://127.0.0.1:5500",
    "http://saboresdodouro.com", 
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use("/images", express.static(path.join(__dirname, "images")));

// Rotas principais
app.use(router);

app.get("/ping", (req, res) => {
    res.status(200).json({ message: "🙂 O servidor está a funcionar!" });
});

app.post("/logout", (req, res) => {
    res.status(200).json({ message: "Logout realizado com sucesso!" });
});

const port = process.env.PORT || 8080;
if (process.env.NODE_ENV !== "production") {
    app.listen(port, () => console.log(`Servidor a correr na porta ${port}`));
}

module.exports = app;

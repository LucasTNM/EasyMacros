import express from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

// Conectar ao banco de dados
connectDB();

const app = express();
app.use(express.json());

app.use(cors());


const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

app.get("/", (req, res) => {
    res.send("API EasyMacros está rodando!");
  });
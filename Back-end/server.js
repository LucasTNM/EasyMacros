import express from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from "cookie-parser";
import userRoutes from './Routes/userRoutes.js'
import chatRoutes from './Routes/chatRoutes.js'

dotenv.config();

connectDB();

const app = express();
app.use(express.json());

app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:3000", "https://easymacros.onrender.com", "https://easy-macros.vercel.app"],
    credentials: true,
  })
);

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

app.get("/", (req, res) => {
    res.send("API EasyMacros está rodando!");
  });
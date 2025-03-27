import axios from "axios";
import User from "../models/user.js";
import UserInfo from "../models/userInfo.js";
import UserMetabolism from "../models/userMetabolism.js";
import Chat from "../models/chat.js";

export const GenerateDiet = async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });

    let userInfo, metabolism, chat;

    if (user) {
      userInfo = await UserInfo.findOne({ userId: user._id });
      metabolism = await UserMetabolism.findOne({ userId: user._id });
      if (!userInfo || !metabolism) {
        return res
          .status(404)
          .json({ message: "Dados incompletos do usuário." });
      }

      chat = await Chat.findOne({ userId: user._id });
    } else {
      userInfo = req.body.userInfo;
      metabolism = req.body.metabolism;
      if (!userInfo || !metabolism)
        return res.status(400).json({ message: "Dados não fornecidos. " });
    }

    const timeNow = new Date();

    if (user && chat) {
      const lastRequest = new Date(chat.ultimaRequisicao);
      const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;

      if (timeNow - lastRequest < oneWeekInMs) {
        return res.status(429).json({
            message: "Limite semanal atingido. Tente novamente na próxima semana."
        });
      }
    }

    const prompt = `Crie uma dieta diária personalizada para uma pessoa com as seguintes necessidades:
- Gênero: ${userInfo.sexo}
- Proteínas: ${metabolism.proteinas}g
- Carboidratos: ${metabolism.carboidratos}g
- Gorduras: ${metabolism.gorduras}g
- Calorias: ${metabolism.consumo} kcal

A dieta deve conter café da manhã, almoço, lanche e jantar. 
Liste apenas os alimentos e suas quantidades, sem introduções ou explicações adicionais. 
O texto deve estar em português.`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "anthropic/claude-3-haiku",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
      }
    );

    const dietPlan = response.data.choices[0].message.content;

    if (user) {
      if (chat) {
        chat.dieta = dietPlan;
        chat.ultimaRequisicao = timeNow;
        await chat.save();
      } else {
        await Chat.create({
          userId: user._id,
          dieta: dietPlan,
          ultimaRequisicao: timeNow,
        });
      }
    }

    return res
      .status(200)
      .json({ message: "Dieta gerada com sucesso", dieta: dietPlan });
  } catch (err) {
    return res.status(500).json({
      message:
        "Erro ao gerar dieta. " +
        (err.response ? err.response.data : err.message),
    });
  }
};

export const getDiet = async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });
    const chat = await Chat.findOne({ userId: user._id });

    if (!user || !chat) {
      return res
        .status(404)
        .json({ message: "Erro ao buscar por dados da dieta. " });
    }

    return res.status(200).json({ dieta: chat.dieta });
  } catch (err) {
    return res.status(500).json({ message: "Dieta não encontrada. " });
  }
};

export const getCredits = async (req, res) => {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/auth/key", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res
        .status(response.status)
        .json({ message: "Erro ao consultar créditos", error: errorData });
    }

    const data = await response.json();
    const keyData = data.data;

    let remainingCredits = null;
    if (keyData.limit !== null) {
      remainingCredits = keyData.limit - keyData.usage;
    }

    return res.status(200).json({
      label: keyData.label,
      usage: keyData.usage,
      limit: keyData.limit,
      remaining: remainingCredits,
      is_free_tier: keyData.is_free_tier,
      rate_limit: keyData.rate_limit,
    });
  } catch (error) {
    console.error("Erro ao consultar créditos:", error);
    return res
      .status(500)
      .json({ message: "Erro ao consultar créditos", error: error.message });
  }
};

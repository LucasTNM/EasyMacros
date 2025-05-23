import User from "../models/user.js";
import UserInfo from "../models/userInfo.js";
import UserMetabolism from "../models/userMetabolism.js";
import Chat from "../models/chat.js";
import { generateTokenAndSetCookie, clearAuthCookie } from "../utils/auth.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export const registerUser = async (req, res) => {
  const {
    nome,
    email,
    senha,
    idade,
    sexo,
    peso,
    altura,
    nivelAtividade,
    objetivo,
  } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({
      message: "O email já pertence a um usuário, tente fazer o login. ",
    });
  }

  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])(?=.{8,}).*$/;
    
    if (!passwordRegex.test(senha)) {
      return res.status(400).json({
        message: "A senha deve ter no mínimo 8 dígitos, um caractere especial e uma letra maiúscula"
      });
    }

  const saltRounds = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(senha, saltRounds);

  const user = new User({
    nome,
    email,
    senha: hashedPassword,
  });

  try {
    const createdUser = await user.save();

    const userInfo = new UserInfo({
      userId: createdUser._id,
      idade,
      sexo,
      peso,
      altura,
      nivelAtividade,
      objetivo,
    });

    await userInfo.save();

    generateTokenAndSetCookie(res, user._id);

    res.status(201).json({
      _id: createdUser._id,
      nome: createdUser.nome,
      email: createdUser.email,
      userInfo: {
        idade: userInfo.idade,
        sexo: userInfo.sexo,
        peso: userInfo.peso,
        altura: userInfo.altura,
        nivelAtividade: userInfo.nivelAtividade,
        objetivo: userInfo.objetivo,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Erro ao registrar usuário. " });
  }
};

export const getUser = async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado. " });
    }

    const userInfo = await UserInfo.findOne({ userId: user._id });

    if (!userInfo) {
      return res
        .status(404)
        .json({ message: "Informações do usuário não encontradas. " });
    }

    const userMetabolism = await UserMetabolism.findOne({ userId: user._id });

    if (!userMetabolism) {
      return res.status(200).json({
        message: "Usuário ainda não fez o cálculo do metabolismo. ",
        _id: user._id,
        nome: user.nome,
        email: user.email,
        dataRedefinicao: user.dataRedefinicao,
        userInfo: {
          idade: userInfo.idade,
          sexo: userInfo.sexo,
          peso: userInfo.peso,
          altura: userInfo.altura,
          nivelAtividade: userInfo.nivelAtividade,
          objetivo: userInfo.objetivo,
        },
      });
    }

    const chat = await Chat.findOne({ userId: user._id });

    if (!chat) {
      return res.status(200).json({
        message: "Usuário tem todas as informações. ",
        _id: user._id,
        nome: user.nome,
        email: user.email,
        userInfo: {
          idade: userInfo.idade,
          sexo: userInfo.sexo,
          peso: userInfo.peso,
          altura: userInfo.altura,
          nivelAtividade: userInfo.nivelAtividade,
          objetivo: userInfo.objetivo,
        },
        userMetabolism: {
          taxaMetabolicaBasal: userMetabolism.taxaMetabolicaBasal,
          gastoTotalDiario: userMetabolism.gastoTotalDiario,
          consumo: userMetabolism.consumo,
          calorias: userMetabolism.calorias,
          proteinas: userMetabolism.proteinas,
          carboidratos: userMetabolism.carboidratos,
          gorduras: userMetabolism.gorduras,
        },
      });
    }

    return res.status(200).json({
      message: "Usuário tem todas as informações. ",
      _id: user._id,
      nome: user.nome,
      email: user.email,
      userInfo: {
        idade: userInfo.idade,
        sexo: userInfo.sexo,
        peso: userInfo.peso,
        altura: userInfo.altura,
        nivelAtividade: userInfo.nivelAtividade,
        objetivo: userInfo.objetivo,
      },
      userMetabolism: {
        taxaMetabolicaBasal: userMetabolism.taxaMetabolicaBasal,
        gastoTotalDiario: userMetabolism.gastoTotalDiario,
        consumo: userMetabolism.consumo,
        calorias: userMetabolism.calorias,
        proteinas: userMetabolism.proteinas,
        carboidratos: userMetabolism.carboidratos,
        gorduras: userMetabolism.gorduras,
      },
      Chat: {
        dieta: chat.dieta,
        ultimaRequisicao: chat.ultimaRequisicao,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Erro ao obter dados do usuário. " + err });
  }
};

export const getEmail = async (req, res) => {
  try {

    if (!req.user._id) {
      return res.status(400).json({ message: "ID do usuário inválido." });
    }

    const user = await User.findById(req.user._id).select("email");

    if (!user) {
      console.error("Usuário não encontrado.");
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    res.json({ email: user.email });
  } catch (error) {
    console.error("Erro ao buscar o email do usuário:", error);
    res.status(500).json({ message: "Erro ao buscar o email do usuário." });
  }
};

export const deleteUser = async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOneAndDelete({ email });
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    await UserInfo.findOneAndDelete({ userId: user._id });
    await UserMetabolism.findOneAndDelete({ userId: user._id });
    await Chat.findOneAndDelete({ userId: user._id });

    return res.status(200).json({ message: "Usuário deletado com sucesso." });
  } catch (err) {
    res.status(500).json({ message: "Erro ao deletar usuário. " + err });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, senha } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Usuário não encontrado" });
    }

    const senhaCorreta = await bcrypt.compare(senha, user.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    generateTokenAndSetCookie(res, user._id);

    res.json({ message: "Login bem-sucedido" });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};

export const logout = (req, res) => {
  try {

    clearAuthCookie(res);

    res.status(200).json({ message: "Logout realizado com sucesso." });
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    res.status(500).json({ message: "Erro ao fazer logout." });
  }
};

export const updateUser = async (req, res) => {
  const { email } = req.params;
  const { nome, idade, sexo, peso, altura, nivelAtividade, objetivo } =
    req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    const userInfo = await UserInfo.findOne({ userId: user._id });
    if (!userInfo) {
      return res
        .status(404)
        .json({ message: "Informações do usuário não encontradas." });
    }

    if (nome) user.nome = nome;
    await user.save();

    if (idade) userInfo.idade = idade;
    if (sexo) userInfo.sexo = sexo;
    if (peso) userInfo.peso = peso;
    if (altura) userInfo.altura = altura;
    if (nivelAtividade) userInfo.nivelAtividade = nivelAtividade;
    if (objetivo) userInfo.objetivo = objetivo;
    await userInfo.save();

    return res
      .status(200)
      .json({ message: "Informações do usuário atualizadas com sucesso." });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Erro ao atualizar informações do usuário. " + err });
  }
};

export const sendResetEmail = async (email, code) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Código de Redefinição de Senha do WebSite EasyMacros",
    text: `Você solicitou a redefinição de sua senha. Use o código abaixo para redefinir sua senha:\n\n${code}\n
    \nSe você não solicitou isso, por favor ignore este email.`,
  };

  await transporter.sendMail(mailOptions);
};

export const sendResetCode = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    const resetCode = () => {
      return Math.floor(1000 + Math.random() * 9000).toString();
    }

    user.codigoRedefinicao = resetCode();
    user.dataRedefinicao = new Date();
    await user.save();

    await sendResetEmail(email, user.codigoRedefinicao);

    return res.status(200).json({ message: "Código de redefinição enviado com sucesso." });

  } catch (err) {
    console.error("Erro ao enviar código de redefinição:", err.message);
    return res.status(500).json({ message: "Não foi possível enviar o código." });
  }
};

export const verifyResetCode = async (req, res) => {
  const { email, code } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    if (!user.codigoRedefinicao) {
      return res.status(400).json({ message: "Código de redefinição não solicitado." });
    }

    const now = new Date();
    const oneHourInMs = 60 * 60 * 1000;

    if (now - user.dataRedefinicao > oneHourInMs) {
      return res.status(400).json({ message: "Tempo de redefinição de senha expirou, solicite um novo código." });
    }

    if (String(user.codigoRedefinicao).trim() !== String(code).trim()) {
      return res.status(400).json({ message: "Código de redefinição incorreto." });
    }

    user.codigoRedefinicao = undefined;
    await user.save();

    generateTokenAndSetCookie(res, user._id);

    return res.status(200).json({ message: "Código verificado com sucesso." });
  } catch (err) {
    console.error("Erro ao verificar código:", err.message);
    res.status(500).json({ message: "Não foi possível verificar o código." });
  }
};

export const createNewPassword = async (req, res) => {
  const { email, senha } = req.body;

  try {

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }
    
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])(?=.{8,}).*$/;
    if (!passwordRegex.test(senha)) {
      return res.status(422).json({
        message: "A senha deve ter no mínimo 8 dígitos, um caractere especial e uma letra maiúscula"
      });
    }

    const isEqual = await bcrypt.compare(senha, user.senha);
    if (isEqual) {
      return res.status(400).json({ message: "Sua nova senha não pode ser igual à anterior." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(senha, salt);
    user.senha = hashedPassword;
    await user.save();

    clearAuthCookie(res);

    return res.status(200).json({ message: "Senha atualizada com sucesso." });

  } catch (err) {
    console.error("Erro ao criar nova senha:", err.message);
    return res.status(500).json({ message: "Erro ao criar nova senha." });
  }
};
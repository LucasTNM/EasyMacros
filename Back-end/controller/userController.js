import User from "../models/user.js";
import UserInfo from "../models/userInfo.js";
import UserMetabolism from "../models/userMetabolism.js";
import Chat from "../models/chat.js";
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

  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(senha)) {
      return res.status(400).json({
        message: "A senha deve ter no mínimo 8 caracteres, incluindo uma letra maiúscula, um número e um símbolo especial."
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

    const token = jwt.sign(
      { _id: createdUser._id, email: createdUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, { maxAge: 3600000, httpOnly: true });

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
    res.status(500).json({ message: "Erro ao registrar usuário.  " + err });
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
    console.log("ID do usuário recebido no middleware:", req.user._id);

    const user = await User.findById(req.user._id).select("email");

    if (!user) {
      console.error("Usuário não encontrado.");
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    console.log("Email encontrado:", user.email);
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
  const { email, senha } = req.body;

  const hasAccount = await User.findOne({ email });

  if (!hasAccount) {
    return res.status(500).json({ message: "Usuário não encontrado." });
  }

  try {
    const isPasswordCorrect = await bcrypt.compare(senha, hasAccount.senha);

    if (!isPasswordCorrect) {
      return res.status(500).json({ message: "Senha incorreta." });
    } else {
      const token = jwt.sign(
        { _id: hasAccount._id, email: hasAccount.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.cookie("token", token, { maxAge: 3600000, httpOnly: true });

      return res.status(200).json({ message: "login feito com sucesso." });
    }
  } catch (err) {
    res.status(500).json({ message: "Erro ao fazer login." + err });
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

    if (!user.dataRedefinicao) {
      return res.status(400).json({ message: "Código de redefinição não solicitado." });
    }

    const now = new Date();
    const oneHourInMs = 60 * 60 * 1000;

    if (now - user.dataRedefinicao > oneHourInMs) {
      return res.status(400).json({ message: "Tempo de redefinição de senha expirou, solicite um novo código." });
    }

    if (user.codigoRedefinicao.toString().trim() !== code.toString().trim()) {
      return res.status(400).json({ message: "Código de redefinição incorreto." });
    }

    user.codigoRedefinicao = undefined;
    await user.save();
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    return res.status(200).json({ message: "Código verificado com sucesso.", token });

  } catch (err) {
    console.error("Erro ao verificar código:", err.message);
    res.status(500).json({ message: "Não foi possível verificar o código." });
  }
};

export const createNewPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ _id: decoded._id });
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: "A senha deve ter no mínimo 8 caracteres, incluindo uma letra maiúscula, um número e um símbolo especial."
      });
    }

    const isEqual = await bcrypt.compare(password, user.senha);
    if (isEqual) {
      return res.status(400).json({ message: "Sua nova senha não pode ser igual à anterior." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.senha = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Senha atualizada com sucesso." });

  } catch (err) {
    console.error("Erro ao criar nova senha:", err.message);
    return res.status(500).json({ message: "Erro ao criar nova senha." });
  }
};
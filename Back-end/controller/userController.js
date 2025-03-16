import User from "../models/user.js";
import UserInfo from "../models/userInfo.js";
import UserMetabolism from "../models/userMetabolism.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

  const saltRounds = 10;
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
      return res.status(404).json({ message: "Informações do usuário não encontradas. " });
    }

    const userMetabolism = await UserMetabolism.findOne({ userId: user._id });

    if (!userMetabolism) {
      return res.status(200).json({ message: "Usuário ainda não fez o cálculo do metabolismo. ",
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
      });
    }

    return res.status(200).json({ message: "Usuário tem todas as informações. ",
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
  } catch (err) {
    res.status(500).json({ message: "Erro ao obter dados do usuário. " + err });
  }
};

  export const Login = async (req, res) => {
    const { email, senha } = req.body;

    const hasAccount = await User.findOne({ email });

    if(!hasAccount) {
      return res.status(500).json({ message: "Usuário não encontrado."})
    }

    try {
      const isPasswordCorrect = await bcrypt.compare(senha, hasAccount.senha);
      
      if(!isPasswordCorrect) {
        return res.status(500).json({ message: "Senha incorreta."});
      } else {
        
        const token = jwt.sign(
          { _id: hasAccount._id, email: hasAccount.email },
          process.env.JWT_SECRET,
          { expiresIn: '1h'}
        );

        res.cookie('token', token, { masAge: 3600000, httpOnly: true});

        return res.status(200).json({ message: "login feito com sucesso."});
      }

    }catch(err) {
      res.status(500).json({ message: "Erro ao fazer login." + err});
    }
  };
import User from "../models/user.js";
import UserInfo from "../models/userInfo.js";
import UserMetabolism from "../models/userMetabolism.js";


export const tmbCalculator = async (req, res) => {
    const { email } = req.params;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }

        const userInfo = await UserInfo.findOne({ userId: user._id });
        if (!userInfo) {
            return res.status(404).json({ message: "Usuário encontrado, mas sem informações cadastradas (peso, altura, etc.)." });
        }

        const calcularTMB = (idade, peso, altura, sexo) => {
            if (sexo === "Masculino") {
                return Math.round((10 * peso) + (6.25 * altura) - (5 * idade) + 5);
            } else if (sexo === "Feminino") {
                return Math.round((10 * peso) + (6.25 * altura) - (5 * idade) - 161);
            } else {
                return null;
            }
        };

        const taxaMetabolicaBasal = calcularTMB(userInfo.idade, userInfo.peso, userInfo.altura, userInfo.sexo);
        if (taxaMetabolicaBasal === null) {
            return res.status(400).json({ message: "Sexo inválido ou não especificado." });
        }

        const calcularGastoTotal = (tmb, nivelAtividade) => {
            const fatoresAtividade = {
                "Sedentário": 1.2,
                "Leve": 1.375,
                "Moderado": 1.55,
                "Ativo": 1.725,
                "Muito ativo": 1.9,
            };

            return fatoresAtividade[nivelAtividade] ? tmb * fatoresAtividade[nivelAtividade] : null;
        };

        const gastoTotalDiario = Math.round(calcularGastoTotal(taxaMetabolicaBasal, userInfo.nivelAtividade));
        if (gastoTotalDiario === null) {
            return res.status(400).json({ message: "Nível de atividade inválido ou não definido." });
        }

        const existingMetabolism = await UserMetabolism.findOne({ userId: user._id });

        if (existingMetabolism) {
            await UserMetabolism.updateOne(
                { userId: user._id },
                { $set: { taxaMetabolicaBasal, gastoTotalDiario } }
            );
        } else {
            const userMetabolism = new UserMetabolism({
                userId: user._id,
                taxaMetabolicaBasal,
                gastoTotalDiario,
                consumo: 0,
                calorias: 0,
                proteinas: 0,
                carboidratos: 0,
                gorduras: 0,
            });

            await userMetabolism.save();
        }

        return res.status(200).json({
            message: "Cálculo feito com sucesso.",
            taxaMetabolicaBasal,
            gastoTotalDiario,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Erro ao calcular a TMB: " + err.message });
    }
};

  export const macrosCalculator = async (req, res) => {
    const { email } = req.params;
    const { calorias } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }
  
      const userInfo = await UserInfo.findOne({ userId: user._id });
      if (!userInfo) {
        return res.status(404).json({ message: "Informações de usuário não encontradas." });
      }
  
      const userMetabolism = await UserMetabolism.findOne({ userId: user._id });
      if (!userMetabolism) {
        return res.status(404).json({ message: "Metabolismo do usuário não encontrado." });
      }
  
      let gastoTotalDiario = userMetabolism.gastoTotalDiario;
      console.log(`Gasto Total Diário Inicial: ${gastoTotalDiario}`);
  
      const caloriasValidas = calorias !== undefined ? calorias : 0;
      const Min = Math.round(userMetabolism.taxaMetabolicaBasal * 1.05);
  
      if (caloriasValidas !== 0) {
        if (userInfo.objetivo === "Emagrecimento") {
            gastoTotalDiario -= caloriasValidas;
            if (gastoTotalDiario < userMetabolism.taxaMetabolicaBasal) {
                return res.status(400).json({ 
                    message: "O número de calorias está muito baixo, diminua o déficit ou deixe que nós ajustamos para você. "
                })
            }
        } else if (userInfo.objetivo === "Ganho de massa") {
          gastoTotalDiario += caloriasValidas;
        }
      } else {
        if (userInfo.objetivo === "Emagrecimento") {
          gastoTotalDiario -= 500;
            if (gastoTotalDiario < userMetabolism.taxaMetabolicaBasal) {
                gastoTotalDiario = Min;
            }
        } else if (userInfo.objetivo === "Ganho de massa") {
          gastoTotalDiario += 500;
        }
      }
  
      const macrosCalc = (gastoTotalDiario, peso, nivelAtividade) => {
        const activityLevels = {
          "Sedentário": { proteinas: 1.2, gorduras: 0.3 },
          "Leve": { proteinas: 1.5, gorduras: 0.28 },
          "Moderado": { proteinas: 2.0, gorduras: 0.25 },
          "Ativo": { proteinas: 2.2, gorduras: 0.22 },
          "Muito ativo": { proteinas: 2.4, gorduras: 0.20 },
        };
  
        const { proteinas: proteinFactor, gorduras: fatFactor } = activityLevels[nivelAtividade] || { proteinas: 0, gorduras: 0 };
  
        let proteinas = Math.round(peso * proteinFactor);
        let gorduras = Math.round((gastoTotalDiario * fatFactor) / 9);
        let carboidratos = Math.max(0, Math.round((gastoTotalDiario - (proteinas * 4) - (gorduras * 9)) / 4));
  
        return { proteinas, carboidratos, gorduras };
      };
  
      const { proteinas, carboidratos, gorduras } = macrosCalc(gastoTotalDiario, userInfo.peso, userInfo.nivelAtividade);

      const consumoTotal = gastoTotalDiario;
  
      const updateResult = await UserMetabolism.updateOne({ userId: user._id }, { proteinas, carboidratos, gorduras, 
        consumo: consumoTotal, calorias });

        if (updateResult.modifiedCount === 0) {
          return res.status(500).json({ message: "Erro ao atualizar o metabolismo do usuário." });
        }
  
      return res.status(200).json({
        message: "Cálculo de macros feito com sucesso.",
        proteinas,
        carboidratos,
        gorduras,
        consumo: consumoTotal,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Erro ao calcular Macros: " + err.message });
    }
  };
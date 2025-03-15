import mongoose from "mongoose";

const userInfoSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    idade: {
      type: Number,
      required: true,
      min: 10,
    },
    sexo: {
      type: String,
      enum: ["Masculino", "Feminino", "Outro"],
      required: true,
    },
    peso: {
      type: Number,
      required: true,
    },
    altura: {
      type: Number,
      required: true,
    },
    nivelAtividade: {
      type: String,
      enum: ["Sedentário", "Leve", "Moderado", "Ativo", "Muito ativo"],
      required: true,
    },
    objetivo: {
      type: String,
      enum: ["Emagrecimento", "Manutenção", "Ganho de massa"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const UserInfo = mongoose.model("User_info", userInfoSchema);

export default UserInfo;
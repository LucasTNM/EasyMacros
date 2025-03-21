import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    nome: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "E-mail inválido"],
    },
    senha: {
      type: String,
      required: true,
    },
    codigoRedefinicao: {
      type: Number,
      required: false,
    },
    dataRedefinicao: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
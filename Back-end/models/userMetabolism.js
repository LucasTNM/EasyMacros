import mongoose from "mongoose";

const metabolismoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    taxaMetabolicaBasal: {
      type: Number,
      required: true,
    },
    gastoTotalDiario: {
      type: Number,
      required: true,
    },
    calorias: {
        type: Number,
        required: true,
    },
    consumo: {
        type: Number,
        required: true,
    },
    proteinas: {
      type: Number,
      required: true,
    },
    carboidratos: {
      type: Number,
      required: true,
    },
    gorduras: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const UserMetabolism = mongoose.model("User_metabolism", metabolismoSchema);

export default UserMetabolism;
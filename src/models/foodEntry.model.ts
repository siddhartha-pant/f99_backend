import mongoose from "mongoose";

const foodEntrySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, required: true },
    foods: [
      {
        name: String,
        calories: Number,
        protein: Number,
        carbs: Number,
        fats: Number,
        quantity: Number,
        time: String,
      },
    ],
    water: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.model("FoodEntry", foodEntrySchema);

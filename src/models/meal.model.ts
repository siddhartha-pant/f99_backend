import mongoose, { Document, Schema } from "mongoose";

export interface IMeal extends Document {
  user: mongoose.Types.ObjectId;
  date: Date;
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

const mealSchema = new Schema<IMeal>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true, default: Date.now },
  name: { type: String, required: true },
  calories: { type: Number, required: true },
  protein: { type: Number },
  carbs: { type: Number },
  fat: { type: Number },
});

export default mongoose.model<IMeal>("Meal", mealSchema);

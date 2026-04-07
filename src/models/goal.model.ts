import mongoose, { Document, Schema } from "mongoose";

export interface IGoal extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  current: number;
  target: number;
  unit: string;
  createdAt: Date;
  updatedAt: Date;
}

const goalSchema = new Schema<IGoal>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    current: { type: Number, required: true, default: 0 },
    target: { type: Number, required: true },
    unit: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model<IGoal>("Goal", goalSchema);

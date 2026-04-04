import mongoose, { Document, Schema } from 'mongoose';

export interface IWaterIntake extends Document {
  user: mongoose.Types.ObjectId;
  date: Date;
  amount: number; // in milliliters
}

const waterIntakeSchema = new Schema<IWaterIntake>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true, default: Date.now },
  amount: { type: Number, required: true },
});

export default mongoose.model<IWaterIntake>('WaterIntake', waterIntakeSchema);

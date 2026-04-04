import mongoose, { Document, Schema } from 'mongoose';

export interface IProgress extends Document {
  user: mongoose.Types.ObjectId;
  date: Date;
  weight?: number;
  energyLevel?: string;
  notes?: string;
  [key: string]: any;
}

const progressSchema = new Schema<IProgress>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true, default: Date.now },
  weight: { type: Number },
  energyLevel: { type: String },
  notes: { type: String },
  // Add more daily metrics as needed
});

export default mongoose.model<IProgress>('Progress', progressSchema);

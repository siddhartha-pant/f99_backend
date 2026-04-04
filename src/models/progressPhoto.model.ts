import mongoose, { Document, Schema } from 'mongoose';

export interface IProgressPhoto extends Document {
  user: mongoose.Types.ObjectId;
  date: Date;
  photoUrl: string;
  note?: string;
}

const progressPhotoSchema = new Schema<IProgressPhoto>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true, default: Date.now },
  photoUrl: { type: String, required: true },
  note: { type: String },
});

export default mongoose.model<IProgressPhoto>('ProgressPhoto', progressPhotoSchema);

// src/models/profile.model.ts

import mongoose, { Document, Schema } from "mongoose";

export interface IProfile extends Document {
  user: mongoose.Types.ObjectId;
  age?: number;
  gender?: string;
  weight?: number;
  bodyFat?: number; // ← Add this
  trainingExperience?: string;
  aim?: string;
  bodyMeasurements?: Record<string, any>;
  targets?: {
    // ← Add this
    calories?: number;
    protein?: number;
    water?: number;
  };
}

const profileSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  age: { type: Number },
  gender: { type: String },
  weight: { type: Number },
  bodyFat: { type: Number, default: 15 },
  trainingExperience: { type: String },
  aim: { type: String },
  bodyMeasurements: { type: Schema.Types.Mixed },
  targets: {
    type: {
      calories: { type: Number, default: 2300 },
      protein: { type: Number, default: 140 },
      water: { type: Number, default: 3000 },
    },
    default: {},
  },
});

export default mongoose.model<IProfile>("Profile", profileSchema);

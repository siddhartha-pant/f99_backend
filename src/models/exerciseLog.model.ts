import mongoose, { Schema, Document, Types } from "mongoose";

export interface ISet {
  weight: number; // kg
  reps: number;
}

export interface IExerciseLog extends Document {
  userId: Types.ObjectId;
  programId: Types.ObjectId;

  exerciseName: string;
  workoutDay: string; // "Upper", "Push", etc.

  sets: ISet[];

  notes?: string;

  // Auto-calculated helpers
  maxWeight?: number;
  totalVolume?: number; // weight * reps * sets

  createdAt: Date;
  updatedAt: Date;
}

const setSchema = new Schema<ISet>(
  {
    weight: {
      type: Number,
      required: true,
      min: 0
    },
    reps: {
      type: Number,
      required: true,
      min: 0
    }
  },
  { _id: false }
);

const exerciseLogSchema = new Schema<IExerciseLog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    programId: {
      type: Schema.Types.ObjectId,
      ref: "Program",
      required: true,
      index: true
    },

    exerciseName: {
      type: String,
      required: true,
      trim: true
    },

    workoutDay: {
      type: String,
      required: true
    },

    sets: {
      type: [setSchema],
      required: true
    },

    notes: {
      type: String,
      default: ""
    },

    maxWeight: {
      type: Number,
      default: 0
    },

    totalVolume: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// AUTO CALCULATIONS BEFORE SAVE
exerciseLogSchema.pre("save", function (next) {
  if (this.sets && this.sets.length > 0) {
    // Max weight
    this.maxWeight = Math.max(...this.sets.map((s) => s.weight));

    // Total volume = sum(weight * reps)
    this.totalVolume = this.sets.reduce((acc, s) => acc + s.weight * s.reps, 0);
  }

  next();
});

//  INDEXES (for fast queries later)
exerciseLogSchema.index({ userId: 1, exerciseName: 1 });

export default mongoose.model<IExerciseLog>("ExerciseLog", exerciseLogSchema);

import mongoose, { Schema, Document, Types } from "mongoose";

export interface IExercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  progressionType: string;
}

export interface IWorkout {
  day: string;
  exercises: IExercise[];
}

export interface IProgram extends Document {
  userId: Types.ObjectId;
  daysPerWeek: number;
  goal: string;
  location: string;
  split: string;
  duration: number;

  workouts: IWorkout[];

  currentWeek: number;
  startedAt: Date;

  createdAt: Date;
  updatedAt: Date;
}

const exerciseSchema = new Schema<IExercise>({
  name: String,
  sets: Number,
  reps: String,
  rest: String,
  progressionType: String
});

const workoutSchema = new Schema<IWorkout>({
  day: String,
  exercises: [exerciseSchema]
});

const programSchema = new Schema<IProgram>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    daysPerWeek: Number,
    goal: String,
    location: String,
    split: String,
    duration: Number,
    workouts: [workoutSchema],
    currentWeek: { type: Number, default: 1 },
    startedAt: Date
  },
  { timestamps: true }
);

export default mongoose.model<IProgram>("Program", programSchema);

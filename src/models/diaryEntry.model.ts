import mongoose from "mongoose";

const diaryEntrySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, required: true },
    mood: { type: String, default: "😐" },
    rating: { type: Number, required: true, min: 1, max: 10 },
    note: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.model("DiaryEntry", diaryEntrySchema);

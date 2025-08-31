import mongoose, { Schema } from "mongoose";

const transcriptSchema = new Schema(
  {
    lecture: { type: Schema.Types.ObjectId, ref: "Lecture", required: true },
    content: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Transcript = mongoose.model("Transcript", transcriptSchema);
export { Transcript };

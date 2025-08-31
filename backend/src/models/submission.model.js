import mongoose, { Schema } from "mongoose";

const submissionSchema = new Schema(
  {
    assignment: { type: Schema.Types.ObjectId, ref: "Assignment", required: true },
    student: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String },
    fileUrl: { type: String },
    grade: { type: String },
  },
  { timestamps: true }
);

const Submission = mongoose.model("Submission", submissionSchema);
export { Submission };

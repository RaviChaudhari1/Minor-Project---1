import mongoose, { Schema } from "mongoose";

const assignmentSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    classroom: { type: Schema.Types.ObjectId, ref: "Classroom", required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true }, // teacher
    submissions: [{ type: Schema.Types.ObjectId, ref: "Submission" }],
    dueDate: { type: Date, required: true },
  },
  { timestamps: true }
);

const Assignment = mongoose.model("Assignment", assignmentSchema);
export { Assignment };

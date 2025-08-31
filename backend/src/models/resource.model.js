import mongoose, { Schema } from "mongoose";

const resourceSchema = new Schema({
  fileUrl: { type: String, required: true },
  fileType: { type: String, enum: ["pdf", "ppt", "doc", "image", "video"], required: true },
  lecture: {
    type: Schema.Types.ObjectId,
    ref: "Lecture",
    required: true
  },
  uploadedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });

const Resource = mongoose.model("Resource", resourceSchema);
export { Resource };

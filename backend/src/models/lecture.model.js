import mongoose, { Schema } from "mongoose";

const lectureSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, default: Date.now },
  audioUrl: { type: String },   // ✅ added field
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  classroom: {
    type: Schema.Types.ObjectId,
    ref: "Classroom",  // ✅ correct model
    required: true
  }
}, { timestamps: true });

// Middleware → link lecture to classroom
lectureSchema.post("save", async function (doc) {
  await mongoose.model("Classroom").findByIdAndUpdate(doc.classroom, {
    $addToSet: { lectures: doc._id }
  });
});

const Lecture = mongoose.model("Lecture", lectureSchema);
export { Lecture };

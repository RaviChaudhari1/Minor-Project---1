import mongoose, { Schema } from "mongoose";

const lectureSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, default: Date.now },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  classroom: {
    type: Schema.Types.ObjectId,
    ref: "Class",
    required: true
  },
  resources: [
    {
      type: Schema.Types.ObjectId,
      ref: "Resource"
    }
  ]
}, { timestamps: true });

// Middleware → link lecture to class
lectureSchema.post("save", async function (doc) {
  await mongoose.model("Class").findByIdAndUpdate(doc.classroom, {
    $addToSet: { lectures: doc._id }
  });
});

const Lecture = mongoose.model("Lecture", lectureSchema);
export { Lecture };

import mongoose, { Schema } from "mongoose";

const classSchema = new Schema({
  name: { type: String, required: true },
  subject: { type: String, required: true },
  teacher: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  lectures: [
    {
      type: Schema.Types.ObjectId,
      ref: "Lecture",
    }
  ],
}, { timestamps: true });

// Middleware → automatically push classId to User's classesTeaching
classSchema.post("save", async function (doc) {
  await mongoose.model("User").findByIdAndUpdate(doc.teacher, {
    $addToSet: { classesTeaching: doc._id }
  });
});

const Classroom = mongoose.model("Classroom", classSchema);
export { Classroom };

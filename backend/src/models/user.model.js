import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      default: "student",
    },

    // If the user is a teacher -> stores classes they created
    classroomsTeaching: [
      {
        type: Schema.Types.ObjectId,
        ref: "Classroom",
      },
    ],

    // If the user is a student -> stores classes they are enrolled in
    classroomsEnrolled: [
      {
        type: Schema.Types.ObjectId,
        ref: "Classroom",
      },
    ],

    // If teacher, lectures they created across classrooms
    lecturesCreated: [
      {
        type: Schema.Types.ObjectId,
        ref: "Lecture",
      },
    ],
  },
  { timestamps: true }
);


// Hash the password before saving the user - Mongoose middleware
userSchema.pre("save", async function (next){
    if(!this.isModified("password")) return next(); //only hash the password if it has been modified (or is new)
    this.password = await bcrypt.hash(this.password, 10);
    next()

    // if (this.isModified("password")) {
    //     this.password = await bcrypt.hash(this.password, 10);
    // }
    // next();
})


// Mongoose custom method to check if the entered password is correct
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password) // password is the plain text password, this.password is the hashed password
}


// Mongoose custom method to generate JWT tokens
userSchema.methods.generateAccessToken = function () {
    // jwt.sign(payload, secretOrPrivateKey, [options, callback])
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
)
}

// _id is a primary key for each document in MongoDB.
// It makes every document uniquely identifiable within a collection.
// Even if you don’t define it, MongoDB will create one for you.

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
)
}


export const User = mongoose.model("User", userSchema);

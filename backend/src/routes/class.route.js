



import express from "express";
import { createClass } from "../controllers/createClass.controller.js";
import { editClass } from "../controllers/editClass.controller.js";
import { deleteClass } from "../controllers/deleteClass.controller.js";
import  {verifyJWT}  from "../middlewares/auth.middleware.js";
import { Classroom } from "../models/classroom.model.js";


const router = express.Router();

router.post("/create-class",verifyJWT, createClass);

// Get all classes
router.get("/get-classes", verifyJWT, async (req, res) => {
    try {
      const classes = await Classroom.find().populate("teacher", "name email _id");
      res.status(200).json(classes);
    } catch (error) {
      res.status(500).json({ message: "Error fetching classes", error });
    }
  });

// Edit class
router.put("/:classId", verifyJWT, editClass);

// Delete class
router.delete("/:classId", verifyJWT, deleteClass);

export default router;

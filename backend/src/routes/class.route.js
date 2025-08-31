



import express from "express";
import { createClass } from "../controllers/createClass.controller.js";
import  {verifyJWT}  from "../middlewares/auth.middleware.js";
import { Classroom } from "../models/classroom.model.js";


const router = express.Router();

router.post("/create-class",verifyJWT, createClass);

// Get all classes
router.get("/get-classes", async (req, res) => {
    try {
      const classes = await Classroom.find().populate("teacher", "name email");
      res.status(200).json(classes);
    } catch (error) {
      res.status(500).json({ message: "Error fetching classes", error });
    }
  });

export default router;

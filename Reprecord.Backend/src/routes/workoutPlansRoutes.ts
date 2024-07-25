import express from "express";
import { createWorkoutPlan } from "../controllers/workoutPlansController";

const router = express.Router();

router.post("/", createWorkoutPlan);

router.get("/", createWorkoutPlan);

export default router;

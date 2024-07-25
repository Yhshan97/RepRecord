import express from "express";
import { addExerciseToWorkoutPlan } from "../controllers/exercisesController";

const router = express.Router();

router.post("/:planId/exercises", addExerciseToWorkoutPlan);

export default router;

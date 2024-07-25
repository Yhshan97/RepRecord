import { Request, Response } from "express";
import { ExercisesApi } from "../api/exercisesApi";
import { Exercise } from "../model/exercise";

const apiClient = new ExercisesApi();

export const addExerciseToWorkoutPlan = async (req: Request, res: Response) => {
	try {
		const planId = req.params.planId;
		const exercise: Exercise = req.body;
		const result = await apiClient.addExerciseToWorkoutPlan(planId, exercise);
		res.status(201).json(result.body);
	} catch (error) {
		console.error("Error adding exercise:", error);
		res.status(500).json({ error: "An error occurred while adding exercise." });
	}
};

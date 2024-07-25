import { Request, Response } from "express";
import { WorkoutPlansApi } from "../api/workoutPlansApi";
import { WorkoutPlan } from "../model/workoutPlan";

const apiClient = new WorkoutPlansApi();

export const createWorkoutPlan = async (req: Request, res: Response) => {
	try {
		const workoutPlan: WorkoutPlan = req.body;
		const result = await apiClient.createWorkoutPlan(workoutPlan);
		res.status(201).json(result.body);
	} catch (error) {
		console.error("Error creating workout plan:", error);
		res.status(500).json({ error: "An error occurred while creating workout plan." });
	}
};

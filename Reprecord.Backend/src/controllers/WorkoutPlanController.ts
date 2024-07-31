import { Request, Response, NextFunction } from "express";

export const getAllWorkoutPlans = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const workoutPlans: never[] = [];
		res.status(200).json(workoutPlans);
	} catch (err) {
		next(err);
	}
};

export const createWorkoutPlan = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const workoutPlan = req.body;
		res.status(201).json(workoutPlan);
	} catch (err) {
		next(err);
	}
};

export const getWorkoutPlanById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const workoutPlan = { id: req.params.id, name: "Sample Plan" };
		res.status(200).json(workoutPlan);
	} catch (err) {
		next(err);
	}
};

export const updateWorkoutPlanById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const updatedWorkoutPlan = req.body;
		res.status(200).json(updatedWorkoutPlan);
	} catch (err) {
		next(err);
	}
};

export const deleteWorkoutPlanById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		res.status(204).send();
	} catch (err) {
		next(err);
	}
};

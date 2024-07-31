import { Request, Response, NextFunction } from "express";

export const addExerciseToWorkoutPlan = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const exercise = req.body;
		res.status(201).json(exercise);
	} catch (err) {
		next(err);
	}
};

export const updateExerciseById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const updatedExercise = req.body;
		res.status(200).json(updatedExercise);
	} catch (err) {
		next(err);
	}
};

export const deleteExerciseById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		res.status(204).send();
	} catch (err) {
		next(err);
	}
};

import { Request, Response, NextFunction } from "express";

export const getCurrentUserProfile = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = { id: "1", username: "test", email: "test@example.com" };
		res.status(200).json(user);
	} catch (err) {
		next(err);
	}
};

export const updateCurrentUserProfile = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const updatedUser = req.body;
		res.status(200).json(updatedUser);
	} catch (err) {
		next(err);
	}
};

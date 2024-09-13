import { Request, Response, NextFunction } from "express";

export const getCurrentUserProfile = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = { id: req.userID, name: req.userName };
		res.status(200).json(user);
	} catch (err) {
		next(err);
	}
};

export const updateCurrentUserProfile = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const updatedUser = req.body;
		// To be implemented
		res.status(200).json(updatedUser);
	} catch (err) {
		next(err);
	}
};

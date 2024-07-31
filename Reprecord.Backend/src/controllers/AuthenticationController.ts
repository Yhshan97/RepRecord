import { Request, Response, NextFunction } from "express";

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = req.body;
		res.status(201).json(user);
	} catch (err) {
		next(err);
	}
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { username, password } = req.body;
		const token = "token goes here";
		res.status(200).json({ token });
	} catch (err) {
		next(err);
	}
};

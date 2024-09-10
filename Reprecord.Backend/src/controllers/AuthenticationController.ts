import { Request, Response, NextFunction } from "express";
import { exchangeAuthCode, getNewAccessToken } from "../utils/cognitoUtils";

export const callback = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { code } = req.query;

		const tokens = await exchangeAuthCode(code?.toString() || "");
		res.status(200).json(tokens);
	} catch (err) {
		next(err);
	}
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { refreshToken } = req.body;

		const newTokens = await getNewAccessToken(refreshToken);
		res.status(200).json(newTokens);
	} catch (err) {
		next(err);
	}
};

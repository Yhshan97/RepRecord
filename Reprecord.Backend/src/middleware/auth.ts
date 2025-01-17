import { CognitoJwtVerifier } from "aws-jwt-verify";
import { Request, Response, NextFunction } from "express";

const jwtVerifier = CognitoJwtVerifier.create({
	userPoolId: process.env.COGNITO_USER_POOL_ID!,
	clientId: process.env.COGNITO_CLIENT_ID!,
	tokenUse: "access",
});

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const token = req.headers.authorization?.split(" ")[1];
		const payload = await jwtVerifier.verify(token!); // verified by O

		req.userID = payload.sub;
		req.userName = payload.username;

		next();
	} catch (err) {
		return res.status(403).json({ message: "Forbidden" });
	}
};

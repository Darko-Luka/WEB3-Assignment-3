import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import HTTPError from "../lib/error-handling/HTTPError";
import { AuthenticatedRequest } from "../lib/globalTypes";

type AuthData = {
	username: string;
};

export function verifyToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
	const token: string | undefined = req.headers["authorization"] as string;

	if (typeof token !== "undefined") {
		jwt.verify(token, process.env.JWT_SECRET_KEY || "", (err: any, authData: any) => {
			if (err) {
				res.status(403).json({ message: "Token is not valid" });
			} else {
				req.authData = authData;
				next();
			}
		});
	} else {
		res.status(401).json({ message: "Token is not provided" });
	}
}

export function isUserVerified(token: string): boolean {
	try {
		const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET_KEY || "");
		// If verification succeeds, return true
		return !!decodedToken;
	} catch (error) {
		// If verification fails, return false
		return false;
	}
}

export async function validateAuthData(req: AuthenticatedRequest): Promise<AuthData> {
	const authData = req.authData;
	if (authData === undefined) throw new HTTPError(401, "Access denied!");

	return authData;
}

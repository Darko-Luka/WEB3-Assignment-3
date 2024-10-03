import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Define a new interface that extends the existing Request interface
interface AuthenticatedRequest extends Request {
	authData?: any;
}

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

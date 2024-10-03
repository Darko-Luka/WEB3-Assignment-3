import { NextFunction, Request, Response } from "express";
import HTTPError from "../lib/error-handling/HTTPError";

// The middleware is executed when a exception is thrown
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
	// Catching and handling HTTPError's
	if (err instanceof HTTPError) {
		console.log(err);
		res.status(err.status).send(err.serializeError());
	}

	// Handling other errors
	res.status(500).send(err);
};

export default errorHandler;

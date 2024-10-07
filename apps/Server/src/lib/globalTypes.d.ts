import "./socketMessageTypes";
import { Request } from "express";

export interface AuthenticatedRequest extends Request {
	authData?: AuthData;
}

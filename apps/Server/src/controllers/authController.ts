import express, { Router, Request, Response } from "express";
import dotenv from "dotenv";
import { LoginType } from "../entities/loginEntity";
import authLogic from "../logic/authLogic";
import { validateAuthData, verifyToken } from "../middlewares/JWT";
import { AuthenticatedRequest } from "../lib/globalTypes";

const router: Router = express.Router();

dotenv.config();

router.post("/auth/login", async (req: Request, res: Response) => {
	const { username, password }: LoginType = req.body;
	const token = await authLogic.login({ username, password });
	res.json({ token, user: { username } });
});

router.post("/auth/register", async (req: Request, res: Response) => {
	const { username, password }: LoginType = req.body;
	await authLogic.register({ username, password });
	const token = await authLogic.login({ username, password });
	res.status(201);
	res.json({ token, user: { username } });
});

router.get("/auth/me", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
	const { username } = await validateAuthData(req);
	res.json({ user: { username } });
});

export default router;

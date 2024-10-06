import express, { Router, Request, Response } from "express";
import dotenv from "dotenv";
import { LoginType } from "../entities/loginEntity";
import authLogic from "../logic/authLogic";

const router: Router = express.Router();

dotenv.config();

router.post("/auth/login", async (req: Request, res: Response) => {
	const { username, password }: LoginType = req.body;
	const token = await authLogic.login({ username, password });
	res.json({ token });
});

router.post("/auth/register", async (req: Request, res: Response) => {
	const { username, password }: LoginType = req.body;
	await authLogic.register({ username, password });
	res.status(201);
	res.send("Created!");
});

export default router;

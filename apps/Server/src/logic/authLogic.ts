import jwt from "jsonwebtoken";
import { LoginEntity, LoginType } from "../entities/loginEntity";
import { MongoDBClient } from "../DB/connection";
import HTTPError from "../lib/error-handling/HTTPError";
import { RegisterEntity, RegisterType } from "../entities/registerEntity";

const authLogic = {
	login: async (login: LoginType): Promise<string> => {
		await LoginEntity.parseAsync(login);

		const user = await (await MongoDBClient.getDatabase())
			.collection("Users")
			.findOne({ username: login.username, password: login.password });

		if (user) {
			const { pass, ...userWithoutPass } = user;

			return jwt.sign(userWithoutPass, process.env.JWT_SECRET_KEY || "", {
				expiresIn: "30min",
			});
		} else {
			throw new HTTPError(401, "Invalid email or password");
		}
	},
	register: async (register: RegisterType): Promise<void> => {
		RegisterEntity.parse(register);

		const user = await (await MongoDBClient.getDatabase()).collection("Users").findOne({ username: register.username });

		if (user) throw new HTTPError(409, "User already exists");

		(await MongoDBClient.getDatabase()).collection("Users").insertOne({ ...register });
	},
};

export default authLogic;

import { WithId } from "mongodb";
import { MongoDBClient } from "../DB/connection";
import HTTPError from "../lib/error-handling/HTTPError";

const sessionLogic = {
	createSession: async (session: any): Promise<void> => {
		const exists = await (await MongoDBClient.getDatabase())
			.collection("GameSessions")
			.findOne({ sessionName: session.sessionName });

		if (exists) throw new HTTPError(409, "Session already exists");

		(await MongoDBClient.getDatabase())
			.collection("GameSessions")
			.insertOne({ sessionName: session.sessionName, maxPlayers: session.maxPlayers });
	},
	getSessions: async (): Promise<WithId<any>[]> => {
		return await (await MongoDBClient.getDatabase()).collection<any>("GameSessions").find({}).toArray();
	},
};

export default sessionLogic;

import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const pass = process.env.DB_PASS;
const username = process.env.DB_USERNAME;

export class MongoDBClient {
	private static instance: MongoClient | null = null;
	private static db: Db | null = null;
	private static readonly uri: string = `mongodb+srv://${username}:${pass}@cluster0.6hgea.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
	private static readonly dbName: string = "UnoDB";

	private constructor() {}

	public static async getInstance(): Promise<MongoClient> {
		if (!MongoDBClient.instance) {
			MongoDBClient.instance = new MongoClient(MongoDBClient.uri);
			await MongoDBClient.instance.connect();
			console.log("Connected to MongoDB");
		}
		return MongoDBClient.instance;
	}

	public static async getDatabase(): Promise<Db> {
		if (!MongoDBClient.db) {
			const client = await MongoDBClient.getInstance();
			MongoDBClient.db = client.db(MongoDBClient.dbName);
		}
		return MongoDBClient.db;
	}

	public static async close(): Promise<void> {
		if (MongoDBClient.instance) {
			await MongoDBClient.instance.close();
			MongoDBClient.instance = null;
			MongoDBClient.db = null;
			console.log("MongoDB connection closed");
		}
	}
}

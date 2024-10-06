import { MongoClient, Db } from "mongodb";

const pass = process.env.DB_PASS;

export class MongoDBClient {
	private static instance: MongoClient | null = null;
	private static db: Db | null = null;
	private static readonly uri: string = `mongodb+srv://lukaudovicic10:${pass}@cluster0.6hgea.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
	private static readonly dbName: string = "UnoDB";

	// Private constructor to prevent instantiation
	private constructor() {}

	// Method to get the MongoClient instance
	public static async getInstance(): Promise<MongoClient> {
		if (!MongoDBClient.instance) {
			MongoDBClient.instance = new MongoClient(MongoDBClient.uri);
			await MongoDBClient.instance.connect();
			console.log("Connected to MongoDB");
		}
		return MongoDBClient.instance;
	}

	// Method to get the database instance
	public static async getDatabase(): Promise<Db> {
		if (!MongoDBClient.db) {
			const client = await MongoDBClient.getInstance();
			MongoDBClient.db = client.db(MongoDBClient.dbName);
		}
		return MongoDBClient.db;
	}

	// Optional method to close the client
	public static async close(): Promise<void> {
		if (MongoDBClient.instance) {
			await MongoDBClient.instance.close();
			MongoDBClient.instance = null;
			MongoDBClient.db = null;
			console.log("MongoDB connection closed");
		}
	}
}

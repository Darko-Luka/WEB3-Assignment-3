import "express-async-errors";
import express, { Express } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import errorHandler from "./middlewares/globalErrorHandler";
import { WebSocketHandler } from "./lib/webSocketHandler";
import loginController from "./controllers/authController";
import GameSessionsHandler from "./lib/game-session/gameSessionHandler";
import GameHandler from "./lib/game/gameHandler";

dotenv.config();

// Initiate express, and prepare variables for port, and api venison
const app: Express = express();
const port = process.env.PORT || 3001;
const apiVersion: string = process.env.API_VERSION || "v1";
const cors = require("cors");
app.use(cors());

// --- START MIDDLEWARES ---

// JSON parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

// --- END MIDDLEWARES ---

app.use("/" + apiVersion, loginController);

// Start server
const server = app.listen(port, () => {
	console.log(`[http server]: Server is running at http://localhost:${port}`);
});

// Instantiate WebSocketHandler
WebSocketHandler.createGlobalInstance(server);

new GameSessionsHandler().init();
new GameHandler().init();

// Error Handling middleware
app.use(errorHandler);

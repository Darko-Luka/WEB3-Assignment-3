import WebSocket from "ws";

import { Request } from "express";
import { Duplex } from "stream";
import { Server } from "http";
import { isUserVerified } from "../middlewares/JWT";
const url = require("url");

type MessageResponseCallback = (data: any) => void;
interface MessageCallbackProps {
	webSocketMessage: WebSocketMessage;
	response: MessageResponseCallback;
	ws: WebSocket;
}
type MessageCallback = ({ webSocketMessage, response, ws }: MessageCallbackProps) => void;

export class WebSocketHandler {
	private static instance: WebSocketHandler;
	private listeners: Map<string, Map<string, MessageCallback>> = new Map();

	private wss: WebSocket.Server;

	private constructor(server: Server) {
		// Create a WebSocket server with no HTTP server
		this.wss = new WebSocket.Server({ noServer: true });
		console.log(`[web socket server]: Server is running`);

		// Handle WebSocket upgrade on the server
		server.on("upgrade", (request: Request, socket: Duplex, head: any) => {
			socket.on("error", this.onSocketPreError);
			const query = url.parse(request.url, true).query;

			// preform auth
			if (!isUserVerified(query.token || "")) {
				socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
				socket.destroy();
				return;
			}

			// Handle WebSocket upgrade
			this.wss.handleUpgrade(request, socket, head, (ws) => {
				socket.removeListener("error", this.onSocketPreError);
				this.wss.emit("connection", ws, request);
			});
		});

		this.wss.on("connection", (ws: WebSocket, request: Request) => {
			ws.on("error", this.onSocketPostError);

			// Extract query parameters from the WebSocket URL
			const query = url.parse(request.url, true).query;

			// Handle the WebSocket connection
			this.handleWebSocketConnection(ws, query.serverType);
		});
	}

	// Create a global instance of WebSocketHandler for the given server
	static createGlobalInstance(server: Server) {
		if (!WebSocketHandler.instance) {
			WebSocketHandler.instance = new WebSocketHandler(server);
		}
	}

	// Get the global instance of WebSocketHandler
	static getInstance(): WebSocketHandler {
		if (!WebSocketHandler.instance) {
			throw new Error("Instance of WebSocketHandler not created");
		}

		return WebSocketHandler.instance;
	}

	// Subscribe to a specific event type and associate a callback
	subscribeEvent(connectionType: string, messageType: string, callback: MessageCallback): void {
		if (!this.listeners.has(connectionType)) {
			this.listeners.set(connectionType, new Map());
		}

		if (!this.listeners.get(connectionType)!.has(messageType)) {
			this.listeners.get(connectionType)!.set(messageType, callback);
		}
	}

	// Handle WebSocket connection, setting up event listeners
	private handleWebSocketConnection(ws: WebSocket, serverType: string): void {
		ws.on("message", (message: string) => {
			try {
				const parsedMessage: WebSocketMessage = JSON.parse(message);
				this.handleMessageType(parsedMessage, ws, serverType);
			} catch (error) {
				console.error("Error parsing message:", error);
			}
		});

		// Listen for WebSocket close event
		ws.on("close", () => {
			// Trigger the 'onClose' callback if subscribed
			const callback = this.listeners.get(serverType)?.get("onClose");
			if (callback !== undefined)
				callback({
					webSocketMessage: { type: "" },
					ws: ws,
					response: () => {},
				});
		});
	}

	// Handle incoming WebSocket messages based on their type
	private handleMessageType(webSocketMessage: WebSocketMessage, ws: WebSocket, serverType: string): void {
		this.listeners.get(serverType)?.forEach((event, key) => {
			if (key === webSocketMessage.type) {
				const messageResponseCallback = (_data: any) => {
					this.MessageResponseHandler(_data, ws);
				};
				event({
					webSocketMessage,
					response: messageResponseCallback,
					ws,
				});
			}
		});
	}

	// Handle responses to WebSocket messages by sending them back to the client
	private MessageResponseHandler(data: any, ws: WebSocket) {
		ws.send(JSON.stringify(data));
	}

	// Error handler for the WebSocket socket before upgrade
	private onSocketPreError(e: Error) {
		console.log(e);
	}

	// Error handler for the WebSocket socket after connection
	private onSocketPostError(e: Error) {
		console.log(e);
	}
}

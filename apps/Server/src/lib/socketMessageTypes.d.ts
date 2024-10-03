interface BaseMessage {
	type: string;
}

interface EmptyMessage extends BaseMessage {
	type: "";
}

type WebSocketMessage = Type;

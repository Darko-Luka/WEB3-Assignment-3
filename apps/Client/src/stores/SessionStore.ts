import { defineStore } from "pinia";
import { onUnmounted, ref } from "vue";

export const useSessionStore = defineStore("gameSession", () => {
	const ws = ref<WebSocket | null>(null);
	const sessions = ref<{ id: string; maxPlayers: number; name: string; players: number }[]>([]);
	const currentSessionId = ref<string | null>(null);
	const onMessage = ref<Array<(data: any) => void>>([]);
	const isHost = ref(false);
	const isConnected = ref(false);
	const error = ref<any>(null);

	function onMessageSubscribe(callback: (data: any) => void) {
		onMessage.value.push(callback);
	}

	function onMessageUnsubscribe(callback: (data: any) => void) {
		onMessage.value = onMessage.value.filter((sub) => sub !== callback);
	}

	const connect = (url: string) => {
		ws.value = new WebSocket(url);

		ws.value.onopen = () => {
			isConnected.value = true;
		};

		ws.value.onmessage = (event) => {
			const data = JSON.parse(event.data);
			onMessage.value.forEach((callback) => callback(data));
			if (data.type === "notify") sessions.value = data.data;
			if (data.type === "checkGameSessionPrivileges") isHost.value = data.data.isHost;
		};

		ws.value.onerror = (err) => {
			error.value = err;
		};

		ws.value.onclose = () => {
			isConnected.value = false;
		};
	};

	const sendMessage = (message: any) => {
		if (ws.value && isConnected.value) {
			ws.value.send(JSON.stringify(message));
		}
	};

	onUnmounted(() => {
		if (ws.value) {
			ws.value.close();
		}
	});

	return {
		connect,
		sendMessage,
		sessions,
		isConnected,
		error,
		isHost,
		onMessageSubscribe,
		onMessageUnsubscribe,
		currentSessionId,
	};
});

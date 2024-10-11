import { defineStore } from "pinia";
import { onUnmounted, ref } from "vue";

//TODO: session screen:
// host: start session
// player: leave session
// if host leaves the session is deleted

export const useSessionStore = defineStore("gameSession", () => {
	const ws = ref<WebSocket | null>(null);
	const sessions = ref<{ id: string; maxPlayers: number; name: string; players: number }[]>([]);
	const isConnected = ref(false);
	const error = ref<any>(null);

	const connect = (url: string) => {
		ws.value = new WebSocket(url);

		ws.value.onopen = () => {
			isConnected.value = true;
		};

		ws.value.onmessage = (event) => {
			const data = JSON.parse(event.data);
			if (data.type === "notify") sessions.value = data.data;
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
	};
});

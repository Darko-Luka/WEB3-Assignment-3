<template>
	<ul>
		<li v-for="player in players">{{ player.username }} {{ player.isHost ? "(Host)" : "" }}</li>
	</ul>
	<Button @click="handleLeave()">Leave</Button>
</template>

<script setup lang="ts">
import { useSessionStore } from "@/stores/SessionStore";
import { onMounted, ref } from "vue";
import Button from "./ui/button/Button.vue";
import { useRouter } from "vue-router";
const players = ref<{ username: string; isHost: boolean }[]>([]);

const store = useSessionStore();
const router = useRouter();

function handleLeave() {
	store.sendMessage({
		type: "leave",
		data: { sessionId: store.currentSessionId },
	});
	store.currentSessionId = null;
}

onMounted(() => {
	store.sendMessage({
		type: "getAllPlayersFromSession",
		data: {
			sessionId: store.currentSessionId,
		},
	});
});

store.onMessageSubscribe((data) => {
	if (data.type !== "getAllPlayersFromSession") return;

	players.value = data.data;
});

store.onMessageSubscribe((data) => {
	if (data.type !== "sessionDeleted") return;

	store.currentSessionId = null;
});

store.onMessageSubscribe((data) => {
	if (data.type !== "startGame") return;

	router.push("/game");
});
</script>

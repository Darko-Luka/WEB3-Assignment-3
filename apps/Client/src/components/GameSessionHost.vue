<template>
	<ul>
		<li v-for="player in players">{{ player.username }} {{ player.isHost ? "(Host)" : "" }}</li>
	</ul>
	<div class="flex items-center space-x-4">
		<Button>Play</Button>
		<Button @click="handleCancel()">Cancel</Button>
	</div>
</template>

<script setup lang="ts">
import { useSessionStore } from "@/stores/SessionStore";
import { onMounted, ref } from "vue";
import Button from "./ui/button/Button.vue";
const players = ref<{ username: string; isHost: boolean }[]>([]);

const store = useSessionStore();

function handleCancel() {
	store.sendMessage({
		type: "cancel",
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
</script>

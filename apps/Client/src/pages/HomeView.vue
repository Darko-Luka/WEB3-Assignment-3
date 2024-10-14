<template>
	<div v-if="store.currentSessionId">
		<GameSessionView />
	</div>
	<div v-else>
		<CreateSession />
		<JoinSession />
	</div>
</template>

<script setup lang="ts">
import CreateSession from "@/components/CreateSession.vue";
import JoinSession from "@/components/JoinSession.vue";
import { useAuthStore } from "@/stores/AuthStore";
import { useSessionStore } from "@/stores/SessionStore";
import { onMounted, watch } from "vue";
import GameSessionView from "../components/GameSessionView.vue";

const store = useSessionStore();
const authStore = useAuthStore();

watch(
	() => store.isConnected,
	() => {
		store.sendMessage({
			type: "onConnection",
			data: {
				username: authStore.user?.username,
			},
		});
	}
);
onMounted(() => {
	store.connect("ws://localhost:3001?serverType=gameSession&token=" + localStorage.getItem("token"));
});
</script>

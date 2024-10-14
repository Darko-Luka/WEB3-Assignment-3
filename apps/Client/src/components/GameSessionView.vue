<template>
	<GameSessionHost v-if="sessionStore.isHost" />
	<GameSessionGuest v-else />
</template>

<script setup lang="ts">
import GameSessionGuest from "@/components/GameSessionGuest.vue";
import GameSessionHost from "@/components/GameSessionHost.vue";
import { useAuthStore } from "@/stores/AuthStore";
import { useSessionStore } from "@/stores/SessionStore";
import { onMounted } from "vue";

const sessionStore = useSessionStore();
const authStore = useAuthStore();

onMounted(() => {
	sessionStore.sendMessage({
		type: "checkGameSessionPrivileges",
		data: {
			username: authStore.user?.username,
			sessionId: sessionStore.currentSessionId,
		},
	});
});
</script>

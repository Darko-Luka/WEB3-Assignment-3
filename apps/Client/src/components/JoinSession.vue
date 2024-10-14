<template>
	<div class="mt-12 space-y-8">
		<h1>Game sessions:</h1>
		<ul class="space-y-4">
			<li
				v-for="session in store.sessions"
				:key="session.id"
				class="flex items-center space-x-4 bg-slate-300 px-4 py-2 w-fit rounded-md"
			>
				<p>{{ session.name }}</p>
				<p>{{ session.players }}/{{ session.maxPlayers }}</p>
				<Button @click="handleJoin(session.id)" :disabled="session.players >= session.maxPlayers">Join</Button>
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import { useSessionStore } from "@/stores/SessionStore";
import Button from "./ui/button/Button.vue";

const store = useSessionStore();

function handleJoin(sessionId: string) {
	store.sendMessage({
		type: "joinSession",
		data: { sessionId },
	});

	store.currentSessionId = sessionId;
}
</script>

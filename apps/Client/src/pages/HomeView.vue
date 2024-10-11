<template>
	<CreateSession />
	<JoinSession />
</template>

<script setup lang="ts">
import CreateSession from "@/components/CreateSession.vue";
import JoinSession from "@/components/JoinSession.vue";
import { useSessionStore } from "@/stores/SessionStore";
import { watch } from "vue";

const store = useSessionStore();

watch(
	() => store.isConnected,
	() => {
		store.sendMessage({
			type: "onConnection",
		});
	}
);

store.connect("ws://localhost:3001?serverType=gameSession&token=" + localStorage.getItem("token"));
</script>

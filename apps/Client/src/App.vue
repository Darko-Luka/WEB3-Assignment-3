<script setup lang="ts">
import { RouterView } from "vue-router";
import Header from "./components/Header.vue";
</script>

<template>
	<main class="bg-gray-200 w-ful min-h-screen">
		<Header />
		<div class="container mx-auto px-4 py-40">
			<RouterView />
		</div>
	</main>
</template>

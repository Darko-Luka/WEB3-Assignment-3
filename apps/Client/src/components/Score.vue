<template>
	<Label class="text-white text-xl">Score: {{ score }} </Label>
</template>

<script setup lang="ts">
import Label from "@/components/ui/label/Label.vue";
import { defineProps } from "vue";

const props = defineProps<{ score: number }>();
</script>

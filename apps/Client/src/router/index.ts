import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../pages/HomeView.vue";
import GameOverView from "../pages/GameOverView.vue";
import NotFound from "../pages/NotFound.vue";
import GameView from "../pages/GameView.vue";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "home",
			component: HomeView,
		},
		{
			path: "/game",
			name: "game",
			component: GameView,
		},
		{
			path: "/over",
			name: "game over",
			component: GameOverView,
		},
		{
			path: "/:pathMatch(.*)*",
			name: "notFound",
			component: NotFound,
		},
	],
});

export default router;

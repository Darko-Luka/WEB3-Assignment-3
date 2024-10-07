import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../pages/HomeView.vue";
import GameOverView from "../pages/GameOverView.vue";
import NotFound from "../pages/NotFound.vue";
import GameView from "../pages/GameView.vue";
import LoginView from "@/pages/LoginView.vue";
import { useAuthStore } from "@/stores/AuthStore";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "home",
			component: HomeView,
			meta: { requireAuth: true },
		},
		{
			path: "/game",
			name: "game",
			component: GameView,
			meta: { requireAuth: true },
		},
		{
			path: "/over",
			name: "game over",
			component: GameOverView,
			meta: { requireAuth: true },
		},
		{
			path: "/login",
			name: "login",
			component: LoginView,
		},
		{
			path: "/:pathMatch(.*)*",
			name: "notFound",
			component: NotFound,
		},
	],
});

router.beforeEach((to, from, next) => {
	const authStore = useAuthStore();

	if (to.meta.requireAuth && !authStore.token) {
		next("/login");
	} else {
		next();
	}
});

export default router;

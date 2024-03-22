import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: 'home',
		component: () => import('@/views/pages/dashboard.page.vue')
	},
	{
		path: '/dashboard',
		name: 'dashboard',
		component: () => import('@/views/pages/dashboard.page.vue')
	}
]

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes
})

export default router

// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/explore',
      name: 'explore',
      component: () => import('@/views/ExploreBotsView.vue')
    },
    {
      path: '/explore/:id',
      name: 'bot-public',
      component: () => import('@/views/BotPublicView.vue')
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/bots',
      name: 'bots',
      component: () => import('@/views/BotsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/bots/:id/manage',
      name: 'bot-manage',
      component: () => import('@/views/BotDetailView.vue'),
      meta: { requiresAuth: true, requiresOwner: true } // дополнительно проверим владельца
    },
    {
      path: '/docs',
      name: 'docs',
      component: () => import('@/views/DocumentationView.vue')
    }
  ]
})

// Ждём восстановления сессии перед проверкой закрытых маршрутов.
// Авторизация владельца бота дополнительно проверяется backend API.
router.beforeEach(async (to) => {
  // Публичные страницы не блокируем ожиданием сетевого refresh.
  if (!to.meta.requiresAuth) return

  const authStore = useAuthStore()
  await authStore.initAuth()

  if (!authStore.isAuthenticated) {
    localStorage.setItem('redirect_after_login', to.fullPath)
    return { name: 'home', query: { login: '1' } }
  }
})

export default router

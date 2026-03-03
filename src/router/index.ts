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

// Глобальный guard для проверки авторизации
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Используем computed getter isAuthenticated вместо прямого чтения storage
  // Это учитывает и localStorage и sessionStorage и актуальность сессии в state
  const isAuthenticated = authStore.isAuthenticated

  if (to.meta.requiresAuth && !isAuthenticated) {
    // Сохраняем куда шли, чтобы вернуть после логина
    if (to.path !== '/') {
      localStorage.setItem('redirect_after_login', to.fullPath)
    }
    next('/')
  } else {
    next()
  }
})

export default router

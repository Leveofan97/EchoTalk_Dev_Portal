<template>
  <header class="header">
    <div class="container header__container">
      <div class="header__brand">
        <RouterLink to="/" class="logo">
          <img src="/echo.ico" alt="EchoTalk" class="logo__icon-img" />
          <span class="logo__text">EchoTalk <span class="gradient-text">Dev</span></span>
        </RouterLink>
      </div>

      <nav class="header__nav">
        <RouterLink
          v-for="item in visibleNavItems"
          :key="item.path"
          :to="item.path"
          class="nav-link"
          active-class="nav-link--active"
        >
          {{ item.label }}
        </RouterLink>
      </nav>

      <div class="header__actions">
        <div class="theme-selector">
          <button
            class="theme-btn"
            @click="showThemeMenu = !showThemeMenu"
          >
            <span class="theme-btn__dot" :style="{ background: currentThemeColor }"></span>
          </button>

          <Transition name="fade">
            <div v-if="showThemeMenu" class="theme-menu">
              <button
                v-for="theme in themeStore.themes"
                :key="theme.value"
                class="theme-option"
                @click="selectTheme(theme.value)"
              >
                <span class="theme-option__dot" :style="{ background: theme.preview }"></span>
                {{ theme.label }}
              </button>
            </div>
          </Transition>
        </div>

        <template v-if="authStore.isAuthenticated">
          <div class="user-menu">
            <img
              v-if="authStore.user?.avatarURL"
              :src="authStore.user.avatarURL"
              class="user-avatar"
              alt="Avatar"
            />
            <div v-else class="user-avatar user-avatar--placeholder">
              {{ authStore.user?.login?.charAt(0).toUpperCase() }}
            </div>
            <span class="user-name">{{ authStore.user?.login }}</span>
            <Button variant="ghost" size="sm" @click="handleLogout">
              Выйти
            </Button>
          </div>
        </template>
        <template v-else>
          <Button variant="secondary" size="sm" @click="showLoginModal = true">
            Войти
          </Button>
        </template>
      </div>
    </div>

    <LoginModal
      :is-open="showLoginModal"
      @close="showLoginModal = false"
      @success="handleLoginSuccess"
    />
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import Button from '@/components/ui/Button.vue'
import LoginModal from '@/components/auth/LoginModal.vue'
import type { Theme } from '@/types'

const authStore = useAuthStore()
const themeStore = useThemeStore()
const router = useRouter()
const route = useRoute()

const showLoginModal = ref(false)
const showThemeMenu = ref(false)

// Все возможные пункты навигации
const allNavItems = [
  { path: '/', label: 'Главная', public: true },
  { path: '/explore', label: 'Каталог ботов', public: true }, // ← новый пункт, виден всем
  { path: '/dashboard', label: 'Панель', public: false, requiresAuth: true },
  { path: '/bots', label: 'Мои боты', public: false, requiresAuth: true },
  { path: '/docs', label: 'Документация', public: true },
]

// Фильтруем пункты в зависимости от авторизации
const visibleNavItems = computed(() => {
  return allNavItems.filter(item => {
    // Если требуется авторизация — показываем только авторизованным
    if (item.requiresAuth && !authStore.isAuthenticated) {
      return false
    }
    // Остальные показываем всем
    return true
  })
})

const currentThemeColor = computed(() => {
  const theme = themeStore.themes.find(t => t.value === themeStore.currentTheme)
  return theme?.preview || '#6366f1'
})

const selectTheme = (theme: Theme) => {
  themeStore.setTheme(theme)
  showThemeMenu.value = false
}

const handleLoginSuccess = () => {
  showLoginModal.value = false

  // Проверяем есть ли куда возвращаться
  const redirectPath = localStorage.getItem('redirect_after_login')
  if (redirectPath) {
    localStorage.removeItem('redirect_after_login')
    router.push(redirectPath)
  } else {
    router.push('/dashboard')
  }
}

const handleLogout = () => {
  authStore.logout()
  // Если текущая страница требует авторизацию — редирект на главную
  const authRequiredRoutes = ['/dashboard', '/bots', '/bots/:id/manage']
  const currentPath = route.path
  const needsRedirect = authRequiredRoutes.some(pattern => {
    if (pattern.includes(':')) {
      return currentPath.startsWith(pattern.split('/:')[0])
    }
    return currentPath === pattern
  })

  if (needsRedirect) {
    router.push('/')
  }
}
</script>

<style scoped>
/* Стили без изменений */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: var(--glass);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-color);
}

.header__container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 800;
  text-decoration: none;
  color: var(--text-primary);
}

.logo__icon-img {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  object-fit: cover;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
}

.header__nav {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: var(--text-secondary);
  font-weight: 500;
  padding: 0.5rem 0;
  position: relative;
  transition: var(--transition);
  text-decoration: none;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--accent-gradient);
  transition: var(--transition);
}

.nav-link:hover,
.nav-link--active {
  color: var(--text-primary);
}

.nav-link--active::after {
  width: 100%;
}

.header__actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.theme-selector {
  position: relative;
}

.theme-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid var(--border-color);
  background: var(--bg-tertiary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
}

.theme-btn:hover {
  border-color: var(--accent-primary);
  transform: scale(1.1);
}

.theme-btn__dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
}

.theme-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 0.5rem;
  min-width: 180px;
  box-shadow: var(--shadow);
  z-index: 101;
}

.theme-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: var(--transition);
  background: none;
  border: none;
  color: var(--text-primary);
  font-size: 0.875rem;
  width: 100%;
  text-align: left;
}

.theme-option:hover {
  background: var(--bg-tertiary);
}

.theme-option__dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.user-avatar--placeholder {
  background: var(--accent-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  color: white;
}

.user-name {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 768px) {
  .header__nav {
    display: none;
  }
}
</style>

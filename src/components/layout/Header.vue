<template>
  <header class="header">
    <div class="container header__container">
      <div class="header__brand">
        <RouterLink to="/" class="logo">
          <img src="/echo.ico" alt="EchoTalk" class="logo__icon-img" />
          <span class="logo__text">EchoTalk <span class="gradient-text">Dev</span></span>
        </RouterLink>
      </div>

      <nav
        id="devportal-main-navigation"
        class="header__nav"
        :class="{ 'header__nav--open': isMobileMenuOpen }"
        aria-label="Основная навигация"
      >
        <RouterLink
          v-for="item in visibleNavItems"
          :key="item.path"
          :to="item.path"
          class="nav-link"
          active-class="nav-link--active"
          @click="isMobileMenuOpen = false"
        >
          {{ item.label }}
        </RouterLink>
      </nav>

      <div class="header__actions">
        <button
          type="button"
          class="mobile-menu-toggle"
          :aria-expanded="isMobileMenuOpen"
          aria-controls="devportal-main-navigation"
          :aria-label="isMobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
        ><AppIcon :name="isMobileMenuOpen ? 'x' : 'menu'" :size="24" /></button>
        <div class="theme-selector">
          <button
            class="theme-btn"
            type="button"
            aria-label="Выбрать цветовую тему"
            :aria-expanded="showThemeMenu"
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
                type="button"
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
              alt="Аватар пользователя"
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
      @close="closeLoginModal"
      @success="handleLoginSuccess"
    />
  </header>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import Button from '@/components/ui/Button.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import LoginModal from '@/components/auth/LoginModal.vue'
import type { Theme } from '@/types'

const authStore = useAuthStore()
const themeStore = useThemeStore()
const router = useRouter()
const route = useRoute()

const showLoginModal = ref(false)
const showThemeMenu = ref(false)
const isMobileMenuOpen = ref(false)

// Все возможные пункты навигации
const allNavItems = [
  { path: '/', label: 'Главная', public: true },
  { path: '/explore', label: 'Каталог ботов', public: true },
  { path: '/dashboard', label: 'Панель разработчика', public: false, requiresAuth: true },
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

watch(() => route.query.login, (value) => {
  if (value === '1' && !authStore.isAuthenticated) showLoginModal.value = true
}, { immediate: true })

watch(() => route.fullPath, () => { isMobileMenuOpen.value = false })

const closeLoginModal = () => {
  showLoginModal.value = false
  // При отмене входа не сохраняем незавершённый сценарий создания/установки бота.
  localStorage.removeItem('redirect_after_login')
  if (route.query.login === '1') {
    const query = { ...route.query }
    delete query.login
    void router.replace({ path: route.path, query, hash: route.hash })
  }
}

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
  const storedRedirect = localStorage.getItem('redirect_after_login')
  localStorage.removeItem('redirect_after_login')

  let redirectPath = '/dashboard'
  if (storedRedirect) {
    try {
      const url = new URL(storedRedirect, window.location.origin)
      if (url.origin === window.location.origin) {
        redirectPath = `${url.pathname}${url.search}${url.hash}`
      }
    } catch {
      // Повреждённый redirect игнорируем.
    }
  }
  router.push(redirectPath)
}

const handleLogout = () => {
  isMobileMenuOpen.value = false
  authStore.logout()
  // Если текущая страница требует авторизацию — редирект на главную
  const authRequiredRoutes = ['/dashboard', '/bots', '/bots/:id/manage']
  const currentPath = route.path
  const needsRedirect = authRequiredRoutes.some(pattern => {
    if (pattern.includes(':')) {
      return currentPath.startsWith(pattern.split('/:')[0] ?? pattern)
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

/* Мобильная навигация не должна исчезать полностью. */
.mobile-menu-toggle { display: none; }
@media (max-width: 900px) {
  .header__container { gap: .7rem; }
  .header__nav {
    display: none;
    position: absolute;
    top: 72px;
    left: 0;
    right: 0;
    padding: 1rem max(1rem, calc((100vw - 1200px) / 2));
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border-color);
    box-shadow: var(--shadow);
    flex-direction: column;
    gap: .45rem;
  }
  .header__nav--open { display: flex; }
  .header__nav .nav-link { padding: .7rem .4rem; }
  .mobile-menu-toggle {
    display: inline-flex;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    background: var(--bg-tertiary);
    color: var(--text-primary);
    padding: .45rem .6rem;
    cursor: pointer;
    font: inherit;
    font-size: .85rem;
  }
  .header__actions { gap: .65rem; }
  .user-name { display: none; }
}
@media (max-width: 540px) {
  .logo { font-size: 1.05rem; gap: .4rem; }
  .logo__icon-img { width: 28px; height: 28px; }
  .header__actions { gap: .35rem; }
  .theme-selector { display: none; }
  .user-menu { gap: .3rem; }
  .user-avatar { display: none; }
}
</style>

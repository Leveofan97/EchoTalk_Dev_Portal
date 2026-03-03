<template>
  <div class="app">
    <Header @login="showLogin = true" />

    <main class="main">
      <RouterView />
    </main>

    <footer class="footer">
      <div class="container">
        <div class="footer__content">
          <div class="footer__brand">
            <img src="/echo.ico" alt="EchoTalk" class="footer__logo" />
            <span>EchoTalk Dev Portal</span>
          </div>
          <p class="footer__copy">© 2026 EchoTalk. Все права защищены.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import Header from '@/components/layout/Header.vue'

const themeStore = useThemeStore()
const authStore = useAuthStore()

onMounted(() => {
  themeStore.initTheme()
  authStore.initAuth()
})
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main {
  flex: 1;
}

.footer {
  padding: 2rem 0;
  border-top: 1px solid var(--border-color);
  background: var(--bg-secondary);
}

.footer__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.footer__brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 700;
}

.footer__logo {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  object-fit: cover;
}

.footer__copy {
  color: var(--text-muted);
  font-size: 0.875rem;
  margin: 0;
}

@media (max-width: 768px) {
  .footer__content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>

<template>
  <div class="bots-view">
    <div class="container">
      <div class="page-header">
        <div>
          <h1>Мои боты</h1>
          <p v-if="botsStore.error" class="error-text">{{ botsStore.error }}</p>
          <p v-else>Создавайте и настраивайте ботов EchoTalk</p>
        </div>
        <Button variant="primary" @click="showCreateModal = true" :loading="botsStore.isLoading">
          <AppIcon name="plus" :size="22" /> Создать бота
        </Button>
      </div>

      <!-- Данные только из реального списка ботов -->
      <div class="stats-grid">
        <Card>
          <div class="stat-card">
            <span class="stat-card__value">{{ totalBots }}</span>
            <span class="stat-card__label">Всего ботов</span>
          </div>
        </Card>
        <Card>
          <div class="stat-card">
            <span class="stat-card__value stat-card__value--success">{{ activeBots }}</span>
            <span class="stat-card__label">Активных</span>
          </div>
        </Card>
        <Card>
          <div class="stat-card">
            <span class="stat-card__value">{{ draftBots }}</span>
            <span class="stat-card__label">Черновиков</span>
          </div>
        </Card>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="loading">
        <div class="spinner"></div>
        <p>Загрузка ботов...</p>
      </div>

      <!-- Error -->
      <div v-else-if="hasError" class="empty-state">
        <AppIcon name="alert-triangle" class="empty-state__icon" :size="42" />
        <h3>Ошибка загрузки</h3>
        <p>{{ errorMessage }}</p>
        <Button variant="primary" @click="loadBots">
          Повторить
        </Button>
      </div>

      <!-- Empty -->
      <div v-else-if="isEmpty" class="empty-state">
        <AppIcon name="package" class="empty-state__icon" :size="42" />
        <h3>У вас пока нет ботов</h3>
        <p>Укажите имя и разрешения. После создания откроются настройки OAuth, команд и событий.</p>
        <Button variant="primary" @click="showCreateModal = true">Создать бота</Button>
        <RouterLink to="/docs" class="docs-link">Посмотреть документацию</RouterLink>
      </div>

      <!-- Bots Grid с фильтрацией -->
      <div v-else class="bots-grid">
        <BotCard
          v-for="bot in validBots"
          :key="bot.id"
          :bot="bot"
          @manage="handleManage"
        />
      </div>
    </div>

    <CreateBotModal
      :is-open="showCreateModal"
      @close="closeCreateModal"
      @created="handleCreated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { useBotsStore } from '@/stores/bots'
import Button from '@/components/ui/Button.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import Card from '@/components/ui/Card.vue'
import BotCard from '@/components/bots/BotCard.vue'
import CreateBotModal from '@/components/bots/CreateBotModal.vue'
import type { BotApp } from '@/types'

const router = useRouter()
const route = useRoute()
const botsStore = useBotsStore()

const showCreateModal = ref(route.query.create === '1')

// ✅ Computed с защитой
const isLoading = computed(() => botsStore.isLoading)
const hasError = computed(() => !!botsStore.error && botsStore.bots.length === 0)
const errorMessage = computed(() => botsStore.error || 'Не удалось загрузить список ботов')
const isEmpty = computed(() => !isLoading.value && !hasError.value && validBots.value.length === 0)
const totalBots = computed(() => validBots.value.length)
const activeBots = computed(() => validBots.value.filter(bot => bot.status === 'active').length)
const draftBots = computed(() => validBots.value.filter(bot => bot.status === 'draft').length)

// ✅ Фильтруем только валидные боты
const validBots = computed(() => {
  return botsStore.bots.filter((bot): bot is BotApp =>
    bot &&
    typeof bot === 'object' &&
    bot.id !== undefined &&
    bot.id !== null
  )
})

watch(() => route.query.create, (value) => {
  if (value === '1') showCreateModal.value = true
})

onMounted(() => { void loadBots() })

const loadBots = () => botsStore.fetchBots()

const closeCreateModal = () => {
  showCreateModal.value = false
  if (route.query.create === '1') void router.replace({ name: 'bots' })
}

const handleManage = (bot: BotApp) => {
  if (!bot?.id) return
  router.push(`/bots/${bot.id}/manage`)
}

const handleCreated = (botId: number) => {
  showCreateModal.value = false
  void router.push({ name: 'bot-manage', params: { id: botId } })
}
</script>

<style scoped>
/* Стили без изменений из предыдущей версии */
.bots-view {
  padding: 100px 0 60px;
  min-height: 100vh;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.page-header h1 {
  margin-bottom: 0.25rem;
}

.error-text {
  color: #ef4444;
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1rem;
}

.stat-card__value {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1;
}

.stat-card__value--success {
  color: #22c55e;
}

.stat-card__label {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.bots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  color: var(--text-secondary);
}

.spinner {
  width: 48px;
  height: 48px;
  border: 3px solid var(--border-color);
  border-top-color: var(--accent-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 4rem;
  background: var(--glass);
  border: 2px dashed var(--border-color);
  border-radius: var(--border-radius);
}

.empty-state__icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

.docs-link {
  display: inline-block;
  margin-left: 1rem;
  color: var(--accent-primary);
  font-size: 0.9rem;
  text-decoration: none;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .bots-grid { grid-template-columns: 1fr; }

  .page-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>

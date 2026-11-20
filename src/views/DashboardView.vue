<template>
  <div class="dashboard">
    <div class="container">
      <div class="page-heading">
        <div>
          <span class="eyebrow">Рабочее пространство</span>
          <h1>Панель разработчика</h1>
          <p>Ваши боты, их настройки и следующий шаг разработки.</p>
        </div>
        <Button variant="primary" @click="goToCreate">Создать бота</Button>
      </div>

      <div class="dashboard-grid">
        <Card class="my-bots">
          <div class="card-heading">
            <h2>Мои боты</h2>
            <RouterLink to="/bots">Все боты</RouterLink>
          </div>

          <div v-if="botsStore.isLoading" class="state" role="status">Загружаем ботов…</div>
          <div v-else-if="botsStore.error" class="state" role="alert">
            <p>{{ botsStore.error }}</p>
            <Button variant="secondary" size="sm" @click="loadBots">Повторить</Button>
          </div>
          <div v-else-if="recentBots.length === 0" class="state">
            <p>У вас ещё нет ботов. Создайте первого, чтобы перейти к настройкам.</p>
            <Button variant="primary" size="sm" @click="goToCreate">Создать бота</Button>
          </div>
          <ul v-else class="bot-list">
            <li v-for="bot in recentBots" :key="bot.id">
              <RouterLink :to="{ name: 'bot-manage', params: { id: bot.id } }" class="bot-row">
                <span class="bot-row__avatar" aria-hidden="true">{{
                  bot.name.charAt(0).toUpperCase()
                }}</span>
                <span class="bot-row__info">
                  <strong>{{ bot.name }}</strong>
                  <small
                    >{{ statusName(bot.status) }} · Создан {{ formatDate(bot.created_at) }}</small
                  >
                </span>
                <span class="bot-row__link" aria-hidden="true"
                  >Открыть <AppIcon name="chevron-right" :size="16"
                /></span>
              </RouterLink>
            </li>
          </ul>
        </Card>

        <Card class="quick-actions">
          <h2>Быстрые действия</h2>
          <nav aria-label="Быстрые действия разработчика" class="actions-list">
            <RouterLink to="/bots" class="action-link">
              <strong>Управление ботами</strong>
              <span>Разрешения, OAuth, команды и подключения</span>
            </RouterLink>
            <RouterLink to="/docs" class="action-link">
              <strong>Документация API</strong>
              <span>Примеры запросов, события и Gateway</span>
            </RouterLink>
            <RouterLink to="/explore" class="action-link">
              <strong>Каталог ботов</strong>
              <span>Публичные боты, доступные для установки</span>
            </RouterLink>
          </nav>
        </Card>

        <Card class="getting-started">
          <h2>Как запустить бота</h2>
          <ol class="steps">
            <li v-for="(step, index) in steps" :key="step.title" class="step">
              <span class="step__number">{{ index + 1 }}</span>
              <div>
                <strong>{{ step.title }}</strong>
                <p>{{ step.description }}</p>
              </div>
            </li>
          </ol>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useBotsStore } from '@/stores/bots'
import Button from '@/components/ui/Button.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import Card from '@/components/ui/Card.vue'
import type { BotStatus } from '@/types'

const router = useRouter()
const botsStore = useBotsStore()
const recentBots = computed(() =>
  [...botsStore.bots]
    .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))
    .slice(0, 4),
)

const goToCreate = () => router.push({ name: 'bots', query: { create: '1' } })
const loadBots = () => void botsStore.fetchBots()
const statusName = (status: BotStatus): string =>
  ({
    draft: 'Черновик',
    active: 'Активен',
    suspended: 'Приостановлен',
    inactive: 'Неактивен',
  })[status]
const formatDate = (value: string): string => {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('ru-RU')
}

const steps = [
  {
    title: 'Зарегистрируйте бота',
    description: 'Название и разрешения можно настроить в соответствующем разделе.',
  },
  {
    title: 'Создайте OAuth credentials',
    description: 'Client ID и Secret используются для подключения вашего приложения.',
  },
  { title: 'Установите на сервер', description: 'Выберите сервер и подтвердите доступ бота.' },
  { title: 'Подключите runtime', description: 'Настройте команды, события и вызовы Bot API.' },
]

onMounted(loadBots)
</script>

<style scoped>
.dashboard {
  padding: 110px 0 76px;
  min-height: 100vh;
}
.page-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  margin-bottom: 2rem;
}
.page-heading h1 {
  margin: 0.5rem 0 0.45rem;
}
.page-heading p {
  margin: 0;
  color: var(--text-secondary);
}
.eyebrow {
  color: var(--accent-primary);
  font-size: 0.8rem;
  font-weight: 750;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.dashboard-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
  gap: 1.5rem;
  align-items: start;
}
.my-bots {
  grid-row: span 2;
}
.card-heading {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
}
.dashboard h2 {
  font-size: 1.2rem;
  margin: 0 0 1.25rem;
}
.card-heading h2 {
  margin: 0;
}
.card-heading a {
  color: var(--accent-primary);
  text-decoration: none;
  font-size: 0.9rem;
}
.bot-list {
  padding: 0;
  margin: 0;
  list-style: none;
}
.bot-list li + li {
  border-top: 1px solid var(--border-color);
}
.bot-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0.35rem;
  text-decoration: none;
  border-radius: 8px;
}
.bot-row:hover {
  background: var(--bg-tertiary);
}
.bot-row__avatar {
  flex: 0 0 42px;
  height: 42px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  background: var(--bg-elevated);
  color: var(--text-primary);
  font-weight: 700;
}
.bot-row__info {
  min-width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.bot-row__info strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--text-primary);
}
.bot-row__info small {
  color: var(--text-secondary);
}
.bot-row__link {
  color: var(--accent-primary);
  white-space: nowrap;
  font-size: 0.8rem;
}
.state {
  padding: 2rem 0.5rem;
  color: var(--text-secondary);
  line-height: 1.55;
}
.state p {
  margin: 0 0 1rem;
}
.actions-list {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}
.action-link {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  text-decoration: none;
  padding: 0.95rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: var(--bg-tertiary);
}
.action-link:hover {
  border-color: var(--accent-primary);
}
.action-link strong {
  color: var(--text-primary);
}
.action-link span {
  color: var(--text-secondary);
  font-size: 0.86rem;
}
.steps {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  list-style: none;
  margin: 0;
  padding: 0;
}
.step {
  display: flex;
  align-items: flex-start;
  gap: 0.9rem;
}
.step__number {
  flex: 0 0 28px;
  height: 28px;
  background: var(--bg-elevated);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent-primary);
  font-weight: 700;
  font-size: 0.8rem;
}
.step strong {
  display: block;
  font-size: 0.93rem;
  margin-bottom: 0.22rem;
}
.step p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.86rem;
  line-height: 1.5;
}
@media (max-width: 900px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  .my-bots {
    grid-row: auto;
  }
}
@media (max-width: 620px) {
  .page-heading {
    flex-direction: column;
    align-items: flex-start;
  }
  .bot-row__link {
    display: none;
  }
}
</style>

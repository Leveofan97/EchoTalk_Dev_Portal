<!-- views/ExploreBotsView.vue - Публичный каталог -->
<template>
  <div class="explore-view">
    <div class="container">
      <div class="page-header">
        <div>
          <h1>🤖 Каталог ботов</h1>
          <p>Найдите полезных ботов для ваших серверов EchoTalk</p>
        </div>
        <div class="header-actions">
          <Button variant="secondary" @click="$router.push('/bots')">
            Мои боты
          </Button>
          <Button variant="primary" @click="$router.push('/bots')">
            + Создать бота
          </Button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Загрузка ботов...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="error-state">
        <p>{{ error }}</p>
        <Button variant="primary" @click="loadBots">Повторить</Button>
      </div>

      <!-- Grid -->
      <div v-else class="bots-grid">
        <div
          v-for="bot in bots"
          :key="bot.id"
          class="bot-card"
          @click="openBot(bot.id)"
        >
          <div class="bot-avatar">
            <img v-if="bot.avatar_url" :src="bot.avatar_url" :alt="bot.name">
            <span v-else>{{ bot.name[0] }}</span>
          </div>

          <div class="bot-content">
            <h3>{{ bot.name }}</h3>
            <p class="description">{{ bot.description }}</p>

            <div class="bot-meta">
              <span class="owner">
                <img v-if="bot.owner_avatar" :src="bot.owner_avatar" class="owner-avatar">
              <span v-else class="owner-avatar">
                {{ bot.owner_name[0] }}
              </span>
                {{ bot.owner_name }}
              </span>
              <span class="servers">🌐 {{ bot.server_count }}</span>
            </div>

            <div class="scopes-preview">
              <Badge
                v-for="scope in bot.scopes.slice(0, 3)"
                :key="scope"
                variant="secondary"
                size="sm"
              >
                {{ scope }}
              </Badge>
              <span v-if="bot.scopes.length > 3" class="more">
                +{{ bot.scopes.length - 3 }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div v-if="!loading && !error && bots.length === 0" class="empty-state">
        <div class="empty-icon">🔍</div>
        <h3>Пока нет публичных ботов</h3>
        <p>Станьте первым, кто создаст бота для EchoTalk!</p>
        <Button variant="primary" @click="$router.push('/bots')">
          Создать бота
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { botsApi, type PublicBotInfo } from '@/api/bots'
import { useToastStore } from '@/stores/toast'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'

const router = useRouter()
const toastStore = useToastStore()

const bots = ref<PublicBotInfo[]>([])
const loading = ref(true)
const error = ref('')

const loadBots = async () => {
  loading.value = true
  error.value = ''

  const response = await botsApi.getPublicBots()

  if (response.error) {
    error.value = response.error
    toastStore.error('Ошибка загрузки каталога')
  } else {
    bots.value = response.data || []
  }

  loading.value = false
}

const openBot = (id: string) => {
  router.push(`/explore/${id}`)
}

onMounted(() => {
  loadBots()
})
</script>

<style scoped>
.explore-view {
  padding: 100px 0 60px;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.bots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.bot-card {
  background: var(--glass);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  gap: 1rem;
}

.bot-card:hover {
  border-color: var(--accent-primary);
  transform: translateY(-2px);
  box-shadow: 0 10px 40px rgba(139, 92, 246, 0.1);
}

.bot-avatar {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.bot-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.bot-avatar span {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
}

.bot-content {
  flex: 1;
  min-width: 0;
}

.bot-content h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.125rem;
  color: var(--text-primary);
}

.description {
  margin: 0 0 1rem 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.bot-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.owner {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.owner-avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--accent-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.625rem;
  color: white;
}

.servers {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.servers .icon {
  opacity: 0.7;
}

.scopes-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.more {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 4rem;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 3px solid var(--border-color);
  border-top-color: var(--accent-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
}

.empty-state p {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .bots-grid {
    grid-template-columns: 1fr;
  }
}
</style>

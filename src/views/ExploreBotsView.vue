<template>
  <main class="explore-view">
    <div class="container">
      <header class="page-header">
        <div>
          <h1 class="icon-heading"><AppIcon name="package" :size="32" /> Каталог ботов</h1>
          <p>Найдите полезных ботов для ваших серверов EchoTalk</p>
        </div>
        <div class="header-actions">
          <Button variant="secondary" @click="router.push('/bots')">Мои боты</Button>
          <Button variant="primary" @click="router.push('/bots')">
            <AppIcon name="plus" :size="20" /> Создать бота
          </Button>
        </div>
      </header>

      <div class="catalog-toolbar">
        <label class="catalog-search">
          <AppIcon name="search" :size="21" />
          <span class="sr-only">Поиск бота по названию или описанию</span>
          <input
            v-model="searchQuery"
            type="search"
            placeholder="Найти бота по названию, описанию или автору"
            autocomplete="off"
            aria-label="Поиск по каталогу ботов"
          />
        </label>
        <span v-if="!loading && !error" class="catalog-count">
          Найдено: {{ filteredBots.length }} из {{ bots.length }}
        </span>
      </div>

      <div v-if="loading" class="loading-state" role="status">
        <div class="spinner" aria-hidden="true"></div>
        <p>Загрузка каталога...</p>
      </div>
      <div v-else-if="error" class="error-state" role="alert">
        <AppIcon name="alert-triangle" :size="32" />
        <h2>Не удалось загрузить каталог</h2>
        <p>{{ error }}</p>
        <Button variant="primary" @click="loadBots">Повторить</Button>
      </div>
      <div v-else-if="bots.length === 0" class="empty-state">
        <AppIcon name="package" :size="42" />
        <h2>Пока нет публичных ботов</h2>
        <p>Создайте бота и откройте его для других пользователей EchoTalk.</p>
        <Button variant="primary" @click="router.push('/bots')">Создать бота</Button>
      </div>
      <div v-else-if="filteredBots.length === 0" class="empty-state">
        <AppIcon name="search" :size="42" />
        <h2>Ничего не найдено</h2>
        <p>Попробуйте изменить поисковый запрос.</p>
        <Button variant="secondary" @click="searchQuery = ''">Сбросить поиск</Button>
      </div>
      <div v-else class="bots-grid">
        <RouterLink
          v-for="bot in filteredBots"
          :key="bot.id"
          class="bot-card"
          :to="{ name: 'bot-public', params: { id: bot.id } }"
          :aria-label="`Посмотреть бота ${bot.name}`"
        >
          <div class="bot-avatar">
            <img v-if="bot.avatar_url" :src="bot.avatar_url" :alt="''" loading="lazy" />
            <span v-else>{{ bot.name?.[0]?.toUpperCase() || 'B' }}</span>
          </div>
          <div class="bot-content">
            <h3>{{ bot.name }}</h3>
            <p class="description">{{ bot.description || 'Описание пока не добавлено' }}</p>
            <div class="bot-meta">
              <span class="owner">
                <img v-if="bot.owner_avatar" :src="bot.owner_avatar" class="owner-avatar" alt="" loading="lazy" />
                <span v-else class="owner-avatar">{{ bot.owner_name?.[0]?.toUpperCase() || 'Р' }}</span>
                {{ bot.owner_name || 'Разработчик' }}
              </span>
              <span class="servers"><AppIcon name="server" :size="18" /> {{ bot.server_count }} серверов</span>
            </div>
            <div v-if="bot.scopes?.length" class="scopes-preview">
              <Badge v-for="scope in bot.scopes.slice(0, 3)" :key="scope" variant="default">
                {{ scopeTitle({ name: scope, label: scope }) }}
              </Badge>
              <span v-if="bot.scopes.length > 3" class="more">+{{ bot.scopes.length - 3 }}</span>
            </div>
          </div>
        </RouterLink>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { botsApi, type PublicBotInfo } from '@/api/bots'
import { filterPublicBots } from '@/utils/publicBotCatalog'
import { scopeTitle } from '@/utils/botScopeCatalog'
import Button from '@/components/ui/Button.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import Badge from '@/components/ui/Badge.vue'

const router = useRouter()
const bots = ref<PublicBotInfo[]>([])
const loading = ref(true)
const error = ref('')
const searchQuery = ref('')
const filteredBots = computed(() => filterPublicBots(bots.value, searchQuery.value))

const loadBots = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await botsApi.getPublicBots()
    if (response.error) {
      error.value = response.error
      return
    }
    if (!Array.isArray(response.data)) {
      error.value = 'Сервер вернул некорректный список ботов'
      return
    }
    bots.value = response.data
  } catch {
    error.value = 'Не удалось связаться с сервером'
  } finally {
    loading.value = false
  }
}

onMounted(loadBots)
</script>

<style scoped>
.explore-view { padding: 100px 0 60px; min-height: 100vh; }
.page-header { display: flex; justify-content: space-between; align-items: center; gap: 1.5rem; margin-bottom: 1.5rem; }
.page-header h1 { margin: 0 0 0.5rem; color: var(--text-primary); }
.page-header p { margin: 0; color: var(--text-secondary); }
.icon-heading, .servers { display: inline-flex; align-items: center; gap: 9px; }
.icon-heading svg { color: var(--accent-primary); }
.header-actions { display: flex; flex-wrap: wrap; gap: 0.75rem; }
.catalog-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 1.5rem; }
.catalog-search { display: flex; align-items: center; gap: 0.75rem; width: min(100%, 620px); padding: 0 1rem; color: var(--text-secondary); background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--control-radius, 10px); transition: border-color 150ms ease, box-shadow 150ms ease; }
.catalog-search:focus-within { border-color: var(--accent-primary); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent-primary) 15%, transparent); }
.catalog-search input { width: 100%; min-width: 0; height: 48px; padding: 0; border: 0; outline: none; background: transparent; color: var(--text-primary); font: inherit; }
.catalog-search input::placeholder { color: var(--text-secondary); }
.catalog-count { white-space: nowrap; color: var(--text-secondary); font-size: 0.875rem; }
.bots-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 320px), 1fr)); gap: 1.25rem; }
.bot-card { display: flex; align-items: flex-start; gap: 1rem; padding: 1.5rem; min-width: 0; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--border-radius); text-decoration: none; color: inherit; transition: border-color 170ms ease, box-shadow 170ms ease, transform 170ms ease; }
.bot-card:hover { border-color: var(--accent-primary); transform: translateY(-2px); box-shadow: var(--shadow); }
.bot-card:focus-visible { outline: 2px solid var(--accent-primary); outline-offset: 4px; }
.bot-avatar { width: 64px; height: 64px; border-radius: 16px; background: var(--accent-gradient); display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden; }
.bot-avatar img { width: 100%; height: 100%; object-fit: cover; }
.bot-avatar span { font-size: 1.5rem; font-weight: 700; color: white; }
.bot-content { flex: 1; min-width: 0; }
.bot-content h3 { margin: 0 0 0.5rem; color: var(--text-primary); font-size: 1.125rem; overflow-wrap: anywhere; }
.description { margin: 0 0 1rem; min-height: 2.5em; color: var(--text-secondary); font-size: 0.875rem; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.bot-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 0.65rem 1rem; margin-bottom: 0.75rem; font-size: 0.75rem; color: var(--text-secondary); }
.owner { display: inline-flex; align-items: center; gap: 0.5rem; min-width: 0; overflow-wrap: anywhere; }
.owner-avatar { width: 22px; height: 22px; border-radius: 50%; background: var(--accent-primary); display: inline-flex; align-items: center; justify-content: center; object-fit: cover; font-size: 0.7rem; color: white; flex-shrink: 0; }
.scopes-preview { display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center; }
.more { font-size: 0.75rem; color: var(--text-secondary); }
.loading-state, .error-state, .empty-state { min-height: 240px; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 0.8rem; text-align: center; padding: 3rem 1rem; color: var(--text-secondary); }
.error-state h2, .empty-state h2 { margin: 0; color: var(--text-primary); font-size: 1.25rem; }
.error-state p, .empty-state p { margin: 0 0 0.75rem; }
.spinner { width: 42px; height: 42px; border: 3px solid var(--border-color); border-top-color: var(--accent-primary); border-radius: 50%; animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
@media (max-width: 768px) { .page-header { align-items: stretch; flex-direction: column; } .header-actions { justify-content: flex-start; } .catalog-toolbar { align-items: stretch; flex-direction: column; } .catalog-count { align-self: flex-end; } }
@media (prefers-reduced-motion: reduce) { .bot-card, .catalog-search { transition: none; } .bot-card:hover { transform: none; } .spinner { animation: none; } }
</style>

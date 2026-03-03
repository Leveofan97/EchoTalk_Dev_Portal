<template>
  <div class="dashboard">
    <div class="container">
      <h1 class="page-title">Панель разработчика</h1>

      <div class="dashboard-grid">
        <!-- Quick Actions -->
        <Card class="quick-actions">
          <h3>Быстрые действия</h3>
          <div class="actions-list">
            <button class="action-btn" @click="$router.push('/bots')">
              <span class="action-btn__icon">🤖</span>
              <div class="action-btn__content">
                <span class="action-btn__title">Мои боты</span>
                <span class="action-btn__desc">Управление приложениями</span>
              </div>
            </button>

            <button class="action-btn" @click="$router.push('/docs')">
              <span class="action-btn__icon">📚</span>
              <div class="action-btn__content">
                <span class="action-btn__title">Документация</span>
                <span class="action-btn__desc">API reference и гайды</span>
              </div>
            </button>

            <button class="action-btn">
              <span class="action-btn__icon">🔑</span>
              <div class="action-btn__content">
                <span class="action-btn__title">API Keys</span>
                <span class="action-btn__desc">Управление ключами</span>
              </div>
            </button>
          </div>
        </Card>

        <!-- Recent Activity -->
        <Card class="activity">
          <h3>Недавняя активность</h3>
          <div class="activity-list">
            <div v-for="(item, i) in activities" :key="i" class="activity-item">
              <div class="activity-item__icon" :style="{ background: item.color }">
                {{ item.icon }}
              </div>
              <div class="activity-item__content">
                <p class="activity-item__text">{{ item.text }}</p>
                <span class="activity-item__time">{{ item.time }}</span>
              </div>
            </div>
          </div>
        </Card>

        <!-- Getting Started -->
        <Card class="getting-started">
          <h3>С чего начать?</h3>
          <div class="steps">
            <div v-for="(step, i) in steps" :key="i" class="step">
              <span class="step__number">{{ i + 1 }}</span>
              <div class="step__content">
                <h4>{{ step.title }}</h4>
                <p>{{ step.description }}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Card from '@/components/ui/Card.vue'

const activities = [
  { icon: '✓', text: 'Бот "Moderator Bot" установлен на сервер "Gaming Hub"', time: '2 мин назад', color: '#22c55e' },
  { icon: '🔄', text: 'Ротация credentials для "Music Bot"', time: '1 час назад', color: '#3b82f6' },
  { icon: '🚀', text: 'Бот "Music Bot" опубликован в каталоге', time: '3 часа назад', color: '#8b5cf6' },
  { icon: '⚠️', text: 'Превышен rate limit для бота "Test Bot"', time: 'Вчера', color: '#ef4444' },
]

const steps = [
  { title: 'Создайте бота', description: 'Нажмите "Создать бота" и заполните базовую информацию' },
  { title: 'Получите токен', description: 'Скопируйте credentials для авторизации вашего бота' },
  { title: 'Подключите к серверу', description: 'Установите бота на один из ваших серверов' },
  { title: 'Начните разработку', description: 'Используйте наш API для создания функционала' },
]
</script>

<style scoped>
.dashboard {
  padding: 100px 0 60px;
  min-height: 100vh;
}

.page-title {
  margin-bottom: 2rem;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 1.5rem;
}

.quick-actions {
  grid-row: span 2;
}

.quick-actions h3,
.activity h3,
.getting-started h3 {
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
}

.actions-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
  text-align: left;
  width: 100%;
}

.action-btn:hover {
  border-color: var(--accent-primary);
  transform: translateX(4px);
}

.action-btn__icon {
  width: 48px;
  height: 48px;
  border-radius: var(--border-radius);
  background: var(--bg-elevated);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.action-btn__content {
  display: flex;
  flex-direction: column;
}

.action-btn__title {
  font-weight: 600;
  color: var(--text-primary);
}

.action-btn__desc {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.activity-item__icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  color: white;
  flex-shrink: 0;
}

.activity-item__content {
  flex: 1;
}

.activity-item__text {
  margin: 0;
  font-size: 0.9375rem;
  color: var(--text-primary);
  line-height: 1.4;
}

.activity-item__time {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.steps {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.step {
  display: flex;
  gap: 1rem;
}

.step__number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--accent-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
  color: white;
  flex-shrink: 0;
}

.step__content h4 {
  margin: 0 0 0.25rem;
  font-size: 1rem;
}

.step__content p {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

@media (max-width: 968px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .quick-actions {
    grid-row: span 1;
  }
}
</style>

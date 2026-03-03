<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero__bg">
        <div class="floating-shape shape-1"></div>
        <div class="floating-shape shape-2"></div>
        <div class="floating-shape shape-3"></div>
      </div>

      <div class="container hero__content">
        <div class="hero__badge animate-slide-up">
          <Badge variant="info">Beta</Badge>
          <span>Платформа для разработчиков EchoTalk</span>
        </div>

        <h1 class="hero__title animate-slide-up">
          Создавайте ботов для<br />
          <span class="gradient-text">EchoTalk</span>
        </h1>

        <p class="hero__subtitle animate-slide-up">
          Мощная платформа для создания интеграций, автоматизации модерации,<br />
          музыкальных ботов и многого другого для ваших серверов.
        </p>

        <div class="hero__actions animate-slide-up">
          <Button variant="primary" size="lg" @click="$router.push('/dashboard')">
            Начать разработку
          </Button>
          <Button variant="secondary" size="lg" @click="$router.push('/docs')">
            Документация
          </Button>
        </div>

        <div class="hero__stats animate-slide-up">
          <div class="stat">
            <span class="stat__value">10K+</span>
            <span class="stat__label">Активных ботов</span>
          </div>
          <div class="stat">
            <span class="stat__value">5M+</span>
            <span class="stat__label">Серверов</span>
          </div>
          <div class="stat">
            <span class="stat__value">99.9%</span>
            <span class="stat__label">Uptime</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features">
      <div class="container">
        <h2 class="section-title">Возможности платформы</h2>

        <div class="grid grid-3">
          <Card v-for="feature in features" :key="feature.title" hover>
            <div class="feature">
              <div class="feature__icon" :style="{ background: feature.gradient }">
                {{ feature.icon }}
              </div>
              <h3>{{ feature.title }}</h3>
              <p>{{ feature.description }}</p>
            </div>
          </Card>
        </div>
      </div>
    </section>

    <!-- Code Example Section -->
    <section class="code-section">
      <div class="container">
        <div class="code-section__grid">
          <div class="code-section__content">
            <h2>Простой API</h2>
            <p>Начните отправлять сообщения всего за несколько строк кода. Поддержка WebSocket и Webhook для real-time событий.</p>
            <ul class="feature-list">
              <li>RESTful API с интуитивной структурой</li>
              <li>WebSocket Gateway для real-time событий</li>
              <li>Webhook поддержка с подписью запросов</li>
              <li>SDK для популярных языков</li>
            </ul>
          </div>

          <div class="code-block">
            <div class="code-block__header">
              <span class="code-block__dot"></span>
              <span class="code-block__dot"></span>
              <span class="code-block__dot"></span>
              <span class="code-block__lang">JavaScript</span>
            </div>
            <pre class="code-block__content"><code>const bot = new EchoTalkBot({
  token: 'your-bot-token'
});

// Отправка сообщения
await bot.sendMessage({
  roomId: '123456',
  content: 'Привет, мир! 👋'
});

// Обработка событий
bot.on('message', (msg) => {
  console.log(`Новое сообщение: ${msg.content}`);
});</code></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta">
      <div class="container">
        <Card glass class="cta__card">
          <div class="cta__content">
            <h2>Готовы создать своего бота?</h2>
            <p>Присоединяйтесь к тысячам разработчиков, создающих удивительные интеграции для EchoTalk.</p>
            <Button variant="primary" size="lg" @click="$router.push('/dashboard')">
              Создать бота бесплатно
            </Button>
          </div>
        </Card>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import Badge from '@/components/ui/Badge.vue'

const features = [
  {
    icon: '⚡',
    title: 'Real-time события',
    description: 'Мгновенная доставка событий через WebSocket или Webhook с гарантией доставки.',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)'
  },
  {
    icon: '🛡️',
    title: 'Безопасность',
    description: 'OAuth2 авторизация, ротация токенов, подпись webhook запросов и минимальные привилегии.',
    gradient: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)'
  },
  {
    icon: '📊',
    title: 'Аналитика',
    description: 'Подробная статистика использования, метрики производительности и логи аудита.',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)'
  },
  {
    icon: '🎯',
    title: 'Slash команды',
    description: 'Создавайте интерактивные команды с автодополнением и контекстной помощью.',
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)'
  },
  {
    icon: '🔧',
    title: 'Гибкая настройка',
    description: 'Гранулярные permissions, scopes и room overrides для точного контроля доступа.',
    gradient: 'linear-gradient(135deg, #f97316 0%, #eab308 100%)'
  },
  {
    icon: '🚀',
    title: 'Масштабируемость',
    description: 'Автоматическое масштабирование, rate limiting и надёжная доставка сообщений.',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)'
  }
]
</script>

<style scoped>
.home {
  flex: 1;
}

/* Hero */
.hero {
  position: relative;
  padding: 140px 0 100px;
  overflow: hidden;
  min-height: 90vh;
  display: flex;
  align-items: center;
}

.hero__bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.floating-shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;
}

.shape-1 {
  width: 600px;
  height: 600px;
  background: var(--accent-primary);
  top: -200px;
  right: -200px;
  animation: float 8s ease-in-out infinite;
}

.shape-2 {
  width: 400px;
  height: 400px;
  background: var(--accent-secondary);
  bottom: -100px;
  left: -100px;
  animation: float 10s ease-in-out infinite reverse;
}

.shape-3 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: pulse 4s ease-in-out infinite;
}

.hero__content {
  position: relative;
  z-index: 1;
  text-align: center;
}

.hero__badge {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
  padding: 0.5rem 1rem;
  background: var(--glass);
  border: 1px solid var(--border-color);
  border-radius: 50px;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.hero__title {
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.1;
}

.hero__subtitle {
  font-size: 1.25rem;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto 2.5rem;
}

.hero__actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 4rem;
}

.hero__stats {
  display: flex;
  justify-content: center;
  gap: 4rem;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.stat__value {
  font-size: 2.5rem;
  font-weight: 800;
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.stat__label {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

/* Features */
.features {
  padding: 100px 0;
  background: var(--bg-secondary);
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
}

.feature {
  text-align: center;
}

.feature__icon {
  width: 64px;
  height: 64px;
  border-radius: var(--border-radius);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto 1.5rem;
}

.feature h3 {
  margin-bottom: 0.75rem;
}

.feature p {
  color: var(--text-secondary);
  font-size: 0.9375rem;
  line-height: 1.6;
}

/* Code Section */
.code-section {
  padding: 100px 0;
}

.code-section__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.code-section__content h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.code-section__content p {
  color: var(--text-secondary);
  font-size: 1.125rem;
  margin-bottom: 2rem;
}

.feature-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.feature-list li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-secondary);
}

.feature-list li::before {
  content: '✓';
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  flex-shrink: 0;
}

.code-block {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  overflow: hidden;
}

.code-block__header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: var(--bg-elevated);
  border-bottom: 1px solid var(--border-color);
}

.code-block__dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ef4444;
}

.code-block__dot:nth-child(2) { background: #eab308; }
.code-block__dot:nth-child(3) { background: #22c55e; }

.code-block__lang {
  margin-left: auto;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.code-block__content {
  padding: 1.5rem;
  margin: 0;
  overflow-x: auto;
}

.code-block__content code {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.875rem;
  line-height: 1.7;
  color: var(--text-primary);
}

/* CTA */
.cta {
  padding: 100px 0;
  background: var(--bg-secondary);
}

.cta__card {
  text-align: center;
  padding: 4rem;
}

.cta__content h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.cta__content p {
  color: var(--text-secondary);
  font-size: 1.125rem;
  max-width: 500px;
  margin: 0 auto 2rem;
}

@media (max-width: 968px) {
  .hero__title {
    font-size: 2.5rem;
  }

  .hero__stats {
    gap: 2rem;
  }

  .code-section__grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .cta__card {
    padding: 2rem;
  }
}
</style>

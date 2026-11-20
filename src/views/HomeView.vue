<template>
  <div class="home">
    <section class="hero">
      <div class="container hero__grid">
        <div class="hero__content">
          <div class="hero__eyebrow">EchoTalk / Портал разработчика</div>
          <h1>Создайте бота.<br /><span class="gradient-text">Подключите к EchoTalk.</span></h1>
          <p class="hero__description">
            Зарегистрируйте приложение, выберите разрешения, настройте команды и события.
            Управляйте подключениями к серверам в одном месте.
          </p>
          <div class="hero__actions">
            <Button variant="primary" size="lg" @click="goToCreate">Создать бота</Button>
            <Button variant="secondary" size="lg" @click="router.push('/docs')">
              Читать документацию
            </Button>
          </div>
          <p class="hero__note">Для создания бота потребуется учётная запись EchoTalk.</p>
        </div>

        <div class="start-panel" aria-label="Первые шаги разработчика">
          <div class="start-panel__heading">
            <span class="start-panel__caption">Быстрый старт</span>
            <span class="start-panel__caption">4 шага</span>
          </div>
          <ol class="start-steps">
            <li v-for="(step, index) in startSteps" :key="step.title">
              <span class="start-steps__number">{{ String(index + 1).padStart(2, '0') }}</span>
              <div>
                <strong>{{ step.title }}</strong>
                <p>{{ step.description }}</p>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </section>

    <section class="features" aria-labelledby="features-title">
      <div class="container">
        <div class="section-heading">
          <span class="section-eyebrow">Возможности</span>
          <h2 id="features-title">Всё необходимое для интеграции</h2>
          <p>Управление ботом — в портале. Выполнение команд и обработка событий — в вашем приложении.</p>
        </div>
        <div class="feature-grid">
          <Card v-for="feature in features" :key="feature.title" class="feature-card">
            <span class="feature-card__index">{{ feature.number }}</span>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </Card>
        </div>
      </div>
    </section>

    <section class="integration" aria-labelledby="integration-title">
      <div class="container integration__grid">
        <div class="integration__content">
          <span class="section-eyebrow">REST API</span>
          <h2 id="integration-title">От первого токена до сообщения</h2>
          <p>
            После установки бота на сервер получите его токен доступа через OAuth и
            используйте Bot API. Ниже — пример настоящего HTTP-запроса без SDK.
          </p>
          <p class="integration__hint">
            <code>ECHOTALK_API_URL</code>, <code>BOT_ACCESS_TOKEN</code> и <code>ROOM_ID</code> —
            переменные вашего окружения. Токен не следует вставлять в клиентский JavaScript.
          </p>
          <Button variant="secondary" @click="router.push('/docs')">Открыть справочник API</Button>
        </div>
        <div class="code-panel">
          <div class="code-panel__header">
            <span>Отправка сообщения</span>
            <span>cURL</span>
          </div>
          <pre><code>{{ messageExample }}</code></pre>
        </div>
      </div>
    </section>

    <section class="closing">
      <div class="container closing__inner">
        <div>
          <h2>Готовы попробовать?</h2>
          <p>Начните с регистрации бота. Остальные настройки можно добавить позже.</p>
        </div>
        <Button variant="primary" size="lg" @click="goToCreate">Создать первого бота</Button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'

const router = useRouter()
const goToCreate = () => router.push({ name: 'bots', query: { create: '1' } })

const startSteps = [
  { title: 'Создайте приложение', description: 'Укажите имя бота и минимально необходимые разрешения.' },
  { title: 'Настройте доступ', description: 'Создайте OAuth credentials и подключите бота к серверу.' },
  { title: 'Выберите транспорт', description: 'Настройте webhook либо WebSocket Gateway для событий.' },
  { title: 'Добавьте команды', description: 'Зарегистрируйте команды и проверьте ответы в EchoTalk.' },
]

const features = [
  { number: '01', title: 'Команды и взаимодействия', description: 'Слэш-команды, кнопки, списки выбора, формы и ответы на действия пользователей.' },
  { number: '02', title: 'События и доставка', description: 'Подписки на события, подписанные webhook-запросы, WebSocket Gateway и повторное чтение событий.' },
  { number: '03', title: 'Управление сервером', description: 'Сообщения, роли, модерация, комнаты и категории — в рамках выданных разрешений.' },
  { number: '04', title: 'Голос и медиа', description: 'Подключение к голосовым комнатам и работа с аудио, видео и демонстрацией экрана через LiveKit.' },
  { number: '05', title: 'Безопасный доступ', description: 'OAuth 2.0, управление credentials, scopes и ограничения действий бота.' },
  { number: '06', title: 'Диагностика', description: 'Статус Gateway, история доставки событий, повторные попытки и показатели ограничений.' },
]

const messageExample = `curl -X POST "$ECHOTALK_API_URL/bot/rooms/$ROOM_ID/messages" \\
  -H "Authorization: Bearer $BOT_ACCESS_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"content":"Привет из EchoTalk Bot API!"}'`
</script>

<style scoped>
.home { flex: 1; }
.hero { padding: 152px 0 104px; }
.hero__grid { display: grid; grid-template-columns: minmax(0, 1.12fr) minmax(320px, 0.88fr); gap: clamp(2rem, 6vw, 6rem); align-items: center; }
.hero__eyebrow, .section-eyebrow { display: inline-block; color: var(--accent-primary); font-size: .82rem; font-weight: 750; letter-spacing: .09em; text-transform: uppercase; }
.hero h1 { font-size: clamp(2.6rem, 5vw, 4.5rem); letter-spacing: -.055em; line-height: 1.09; margin: 1.2rem 0 1.5rem; }
.hero__description { max-width: 610px; color: var(--text-secondary); font-size: 1.14rem; line-height: 1.75; }
.hero__actions { display: flex; flex-wrap: wrap; gap: .85rem; margin-top: 2rem; }
.hero__note { margin-top: 1.2rem; color: var(--text-muted); font-size: .85rem; }
.start-panel { background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 16px; padding: 1.75rem; box-shadow: var(--shadow); }
.start-panel__heading { display: flex; justify-content: space-between; gap: .75rem; padding-bottom: 1.25rem; border-bottom: 1px solid var(--border-color); }
.start-panel__caption { color: var(--text-secondary); font-size: .82rem; font-weight: 700; }
.start-steps { list-style: none; padding: 0; margin: 1.5rem 0 0; display: flex; flex-direction: column; gap: 1.35rem; }
.start-steps li { display: flex; align-items: flex-start; gap: 1rem; }
.start-steps__number { color: var(--accent-primary); font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: .83rem; font-weight: 700; margin-top: .17rem; }
.start-steps strong { display: block; margin-bottom: .25rem; color: var(--text-primary); }
.start-steps p { margin: 0; color: var(--text-secondary); font-size: .89rem; line-height: 1.55; }
.features { padding: 88px 0 104px; background: var(--bg-secondary); }
.section-heading { max-width: 710px; margin-bottom: 2.25rem; }
.section-heading h2, .integration h2, .closing h2 { font-size: clamp(1.8rem, 3vw, 2.5rem); letter-spacing: -.035em; margin: .85rem 0; }
.section-heading p, .integration p, .closing p { color: var(--text-secondary); line-height: 1.65; }
.feature-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; }
.feature-card { height: 100%; }
.feature-card__index { font-family: ui-monospace, SFMono-Regular, Consolas, monospace; color: var(--accent-primary); font-size: .8rem; font-weight: 700; }
.feature-card h3 { font-size: 1.08rem; margin: 1.1rem 0 .65rem; }
.feature-card p { color: var(--text-secondary); font-size: .92rem; line-height: 1.6; margin: 0; }
.integration { padding: 108px 0; }
.integration__grid { display: grid; grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr); align-items: center; gap: clamp(2rem, 5vw, 5rem); }
.integration__content .btn { margin-top: .75rem; }
.integration__hint { font-size: .88rem; }
.integration__hint code { font-size: .83rem; }
.code-panel { border: 1px solid var(--border-color); border-radius: 12px; background: var(--bg-secondary); overflow: hidden; min-width: 0; }
.code-panel__header { display: flex; justify-content: space-between; padding: 1rem 1.25rem; border-bottom: 1px solid var(--border-color); font-size: .8rem; color: var(--text-secondary); }
.code-panel pre { margin: 0; padding: 1.5rem; overflow-x: auto; line-height: 1.8; font-size: .85rem; color: var(--text-primary); }
.code-panel code { font-family: ui-monospace, SFMono-Regular, Consolas, monospace; }
.closing { padding: 65px 0; background: var(--bg-secondary); border-top: 1px solid var(--border-color); }
.closing__inner { display: flex; align-items: center; justify-content: space-between; gap: 2rem; }
.closing h2 { margin-top: 0; }
.closing p { margin-bottom: 0; }
@media (max-width: 960px) {
  .hero__grid, .integration__grid { grid-template-columns: 1fr; }
  .start-panel { max-width: 680px; }
  .feature-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 620px) {
  .hero { padding: 112px 0 72px; }
  .features, .integration { padding: 64px 0; }
  .feature-grid { grid-template-columns: 1fr; }
  .closing__inner { flex-direction: column; align-items: flex-start; }
}
</style>

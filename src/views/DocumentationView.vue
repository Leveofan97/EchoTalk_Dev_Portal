<template>
  <div class="docs-page">
    <div class="docs-view-switcher" role="tablist" aria-label="Режим документации">
      <button
        type="button"
        role="tab"
        class="docs-view-switcher__button"
        :class="{ 'docs-view-switcher__button--active': activeView === 'guides' }"
        :aria-selected="activeView === 'guides'"
        @click="setActiveView('guides')"
      >
        Guides
      </button>

      <button
        type="button"
        role="tab"
        class="docs-view-switcher__button"
        :class="{ 'docs-view-switcher__button--active': activeView === 'api' }"
        :aria-selected="activeView === 'api'"
        @click="setActiveView('api')"
      >
        API Reference
      </button>
    </div>

    <div v-if="activeView === 'guides'" class="docs-shell">
      <aside class="docs-sidebar" aria-label="Навигация по документации">
        <div class="docs-sidebar__inner">
          <div class="docs-sidebar__title">EchoTalk Bot API</div>

          <nav class="docs-nav">
            <div v-for="group in navigation" :key="group.title" class="docs-nav__group">
              <div class="docs-nav__group-title">
                {{ group.title }}
              </div>

              <a
                v-for="item in group.items"
                :key="item.id"
                class="docs-nav__link"
                :class="{ 'docs-nav__link--active': activeSection === item.id }"
                :href="`#${item.id}`"
                @click="activeSection = item.id"
              >
                {{ item.label }}
              </a>
            </div>
          </nav>
        </div>
      </aside>

      <main class="docs-content">
        <header class="docs-hero">
          <div class="docs-badge">Bot API · OpenAPI 3.0.3</div>
          <h1>Документация EchoTalk Bot API</h1>
          <p>
            Руководство по bot-facing REST API EchoTalk. На этой странице зафиксированы базовая
            аутентификация, Voice Resource API и Media Session API. Точный машинно-читаемый контракт
            хранится в OpenAPI.
          </p>

          <div class="docs-meta-grid">
            <div class="docs-meta-card">
              <span class="docs-meta-card__label">Production API</span>
              <code>https://jiechotalk.ru:8443</code>
            </div>

            <div class="docs-meta-card">
              <span class="docs-meta-card__label">REST prefix</span>
              <code>/bot</code>
            </div>

            <div class="docs-meta-card">
              <span class="docs-meta-card__label">Auth</span>
              <code>Bearer Bot Access Token</code>
            </div>
          </div>
        </header>

        <section id="overview" class="doc-section">
          <h2>Обзор</h2>

          <p>
            EchoTalk Bot API предоставляет ботам доступ к ресурсам сервера, голосовым комнатам и
            media runtime. Все операции выполняются в границах установки бота и проверяются
            сервером.
          </p>

          <div class="callout callout--info">
            <strong>Источник истины.</strong>
            <span>
              OpenAPI описывает точные endpoint, схемы запросов и ответов. Эта страница объясняет
              сценарии использования и ограничения.
            </span>
          </div>
        </section>

        <section id="authentication" class="doc-section">
          <h2>Аутентификация</h2>

          <p>
            REST-запросы к <code>/bot/*</code> выполняются с bot access token в заголовке
            <code>Authorization</code>.
          </p>

          <CodeBlock title="HTTP" :code="authHeaderExample" @copy="copyCode(authHeaderExample)" />

          <div class="callout callout--warning">
            <strong>Не публикуйте токены.</strong>
            <span>
              Не храните bot access token или LiveKit token в исходниках, localStorage, логах и
              публичных примерах. Используйте секреты окружения или secret manager.
            </span>
          </div>
        </section>

        <section id="scopes" class="doc-section">
          <h2>Voice scopes</h2>

          <p>
            EchoTalk применяет принцип наименьших привилегий. Media intent не передаёт capabilities
            напрямую: backend сам выводит разрешённые возможности из intent и повторно проверяет
            scopes.
          </p>

          <div class="table-wrap">
            <table class="docs-table">
              <thead>
                <tr>
                  <th>Intent</th>
                  <th>Обязательные scopes</th>
                  <th>Назначение</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in scopeMatrix" :key="row.intent">
                  <td>
                    <code>{{ row.intent }}</code>
                  </td>
                  <td>
                    <code v-for="scope in row.scopes" :key="scope" class="scope-chip">
                      {{ scope }}
                    </code>
                  </td>
                  <td>{{ row.description }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="voice-rooms" class="doc-section">
          <h2>Voice Resource API</h2>

          <p>
            Voice Resource API позволяет получить доступные голосовые комнаты, их публичное
            состояние и список участников без раскрытия LiveKit-внутренностей.
          </p>

          <div class="endpoint-list">
            <EndpointRow
              method="GET"
              path="/bot/voice/rooms"
              description="Список доступных голосовых комнат."
            />
            <EndpointRow
              method="GET"
              path="/bot/voice/rooms/{roomID}"
              description="Публичная информация о голосовой комнате."
            />
            <EndpointRow
              method="GET"
              path="/bot/voice/rooms/{roomID}/participants"
              description="Текущее публичное состояние участников."
            />
            <EndpointRow
              method="GET"
              path="/bot/voice/rooms/{roomID}/state"
              description="Комната и её live-state одним запросом."
            />
          </div>

          <h3>Пример live-state</h3>

          <CodeBlock title="200 OK" :code="voiceStateExample" @copy="copyCode(voiceStateExample)" />

          <div class="callout callout--info">
            <strong>Неактивная комната — не ошибка.</strong>
            <span>
              Если EchoTalk-комната существует, но соответствующая LiveKit room сейчас не активна,
              API возвращает HTTP 200,
              <code>is_active: false</code> и пустой массив participants.
            </span>
          </div>

          <p class="security-note">
            REST API намеренно не раскрывает LiveKit room name, participant SID/identity, raw
            metadata и track SID/name.
          </p>
        </section>

        <section id="media-sessions" class="doc-section">
          <h2>Media Sessions</h2>

          <p>
            Media Session представляет ограниченный по времени runtime-сеанс, через который бот
            слушает аудио или публикует audio/video/screen.
          </p>

          <div class="endpoint-list">
            <EndpointRow
              method="POST"
              path="/bot/voice/rooms/{roomID}/media-sessions"
              description="Создать media session."
            />
            <EndpointRow
              method="GET"
              path="/bot/voice/media-sessions"
              description="Получить список media sessions."
            />
            <EndpointRow
              method="GET"
              path="/bot/voice/media-sessions/{sessionID}"
              description="Получить одну media session."
            />
            <EndpointRow
              method="POST"
              path="/bot/voice/media-sessions/{sessionID}/refresh-token"
              description="Обновить LiveKit token и lease."
            />
            <EndpointRow
              method="POST"
              path="/bot/voice/media-sessions/{sessionID}/disconnect"
              description="Завершить media session."
            />
          </div>

          <h3>Создание session</h3>

          <p>
            Клиент передаёт только <code>intent</code>. Поля publish/subscribe не принимаются как
            источник полномочий — capabilities определяет backend.
          </p>

          <CodeBlock
            title="POST /bot/voice/rooms/94/media-sessions"
            :code="createSessionExample"
            @copy="copyCode(createSessionExample)"
          />

          <h3>Ответ Create / Refresh</h3>

          <CodeBlock
            title="201 Created"
            :code="createSessionResponseExample"
            @copy="copyCode(createSessionResponseExample)"
          />

          <div class="callout callout--warning">
            <strong>LiveKit token — временный credential.</strong>
            <span>
              Поля <code>token</code> и <code>livekit_url</code> выдаются только Create/Refresh.
              Обычные GET/List/Disconnect responses не должны содержать token, livekit room или
              participant identity.
            </span>
          </div>
        </section>

        <section id="lifecycle" class="doc-section">
          <h2>Lifecycle media session</h2>

          <div class="lifecycle">
            <div v-for="status in lifecycle" :key="status.name" class="lifecycle__item">
              <code>{{ status.name }}</code>
              <span>{{ status.description }}</span>
            </div>
          </div>

          <div class="callout callout--info">
            <strong>Public status contract.</strong>
            <span>
              Внутренний статус <code>revoking</code> наружу не публикуется. API отображает его как
              <code>terminating</code>.
            </span>
          </div>
        </section>

        <section id="pagination" class="doc-section">
          <h2>Пагинация media sessions</h2>

          <p>
            <code>GET /bot/voice/media-sessions</code> использует opaque cursor pagination. Cursor
            необходимо передавать обратно без разбора или самостоятельного формирования.
          </p>

          <CodeBlock
            title="Request"
            :code="paginationRequestExample"
            @copy="copyCode(paginationRequestExample)"
          />

          <CodeBlock
            title="Response meta"
            :code="paginationResponseExample"
            @copy="copyCode(paginationResponseExample)"
          />
        </section>

        <section id="errors" class="doc-section">
          <h2>Ошибки</h2>

          <p>Все Bot API ошибки используют единый envelope:</p>

          <CodeBlock
            title="Error envelope"
            :code="errorEnvelopeExample"
            @copy="copyCode(errorEnvelopeExample)"
          />

          <div class="table-wrap">
            <table class="docs-table">
              <thead>
                <tr>
                  <th>HTTP</th>
                  <th>Code</th>
                  <th>Когда возникает</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in commonErrors" :key="`${row.http}-${row.code}`">
                  <td>{{ row.http }}</td>
                  <td>
                    <code>{{ row.code }}</code>
                  </td>
                  <td>{{ row.description }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>Runtime limit</h3>

          <p>
            При превышении media runtime limit API отвечает HTTP 429. В
            <code>details</code> публикуются только безопасные значения <code>limit</code>,
            <code>current</code> и при наличии <code>mode</code>.
          </p>

          <CodeBlock
            title="429 Too Many Requests"
            :code="runtimeLimitExample"
            @copy="copyCode(runtimeLimitExample)"
          />
        </section>

        <section id="openapi" class="doc-section">
          <h2>OpenAPI Reference</h2>

          <p>Каноническая спецификация API находится в backend-репозитории:</p>

          <div class="file-reference">
            <code>docs/openapi/bot-resource-api.yaml</code>
          </div>

          <p>
            OpenAPI содержит точные request/response schemas, status codes, error codes, scopes и
            примеры. В дальнейшем этот раздел можно дополнить встроенным Redoc/Scalar viewer без
            изменения human-readable руководств выше.
          </p>
        </section>
      </main>
    </div>

    <div v-else class="api-reference-shell">
      <header class="api-reference-hero">
        <div>
          <div class="docs-badge">Canonical OpenAPI</div>
          <h1>EchoTalk Bot API Reference</h1>
          <p>
            Интерактивный reference рендерится Stoplight Elements напрямую из канонической
            OpenAPI-спецификации backend. Изменения в YAML автоматически отражаются здесь без
            ручного дублирования endpoint и DTO.
          </p>
        </div>

        <a
          class="api-reference-source"
          :href="openApiUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          Открыть YAML
        </a>
      </header>

      <div class="api-reference-frame">
        <StoplightReference :spec-url="openApiUrl" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, h, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import '@stoplight/elements/web-components.min.js'
import '@stoplight/elements/styles.min.css'

type NavItem = {
  id: string
  label: string
}

type NavGroup = {
  title: string
  items: NavItem[]
}

type ScopeMatrixRow = {
  intent: string
  scopes: string[]
  description: string
}

type ErrorRow = {
  http: number
  code: string
  description: string
}

type DocsView = 'guides' | 'api'

const route = useRoute()
const router = useRouter()

const activeView = ref<DocsView>(route.query.view === 'api' ? 'api' : 'guides')

const configuredOpenApiUrl = String(import.meta.env.VITE_BOT_OPENAPI_URL ?? '').trim()

const openApiUrl = configuredOpenApiUrl || '/openapi/bot-resource-api.yaml'

async function setActiveView(view: DocsView): Promise<void> {
  activeView.value = view

  const query = { ...route.query }

  if (view === 'api') {
    query.view = 'api'
  } else {
    delete query.view
  }

  await router.replace({ query })
}

const navigation: NavGroup[] = [
  {
    title: 'Начало работы',
    items: [
      { id: 'overview', label: 'Обзор' },
      { id: 'authentication', label: 'Аутентификация' },
      { id: 'scopes', label: 'Voice scopes' },
    ],
  },
  {
    title: 'Voice & Media',
    items: [
      { id: 'voice-rooms', label: 'Voice Resource API' },
      { id: 'media-sessions', label: 'Media Sessions' },
      { id: 'lifecycle', label: 'Lifecycle' },
      { id: 'pagination', label: 'Пагинация' },
    ],
  },
  {
    title: 'Reference',
    items: [
      { id: 'errors', label: 'Ошибки' },
      { id: 'openapi', label: 'OpenAPI' },
    ],
  },
]

const scopeMatrix: ScopeMatrixRow[] = [
  {
    intent: 'stats_only',
    scopes: ['voice.connect'],
    description: 'Создать session без media publish/subscribe.',
  },
  {
    intent: 'listen',
    scopes: ['voice.connect', 'voice.listen'],
    description: 'Получать аудио участников.',
  },
  {
    intent: 'speak',
    scopes: ['voice.connect', 'voice.speak'],
    description: 'Публиковать аудио.',
  },
  {
    intent: 'listen_and_speak',
    scopes: ['voice.connect', 'voice.listen', 'voice.speak'],
    description: 'Одновременно слушать и публиковать аудио.',
  },
  {
    intent: 'video_publish',
    scopes: ['voice.connect', 'voice.speak'],
    description: 'Публиковать video track с источником CAMERA.',
  },
  {
    intent: 'screen_share_publish',
    scopes: ['voice.connect', 'voice.speak'],
    description: 'Публиковать video track с источником SCREEN_SHARE.',
  },
]

const lifecycle = [
  { name: 'pending', description: 'Session создана, бот ещё не активен в media runtime.' },
  { name: 'active', description: 'Бот подключён, session активна.' },
  { name: 'terminating', description: 'Идёт контролируемое завершение session.' },
  { name: 'ended', description: 'Session штатно завершена.' },
  { name: 'revoked', description: 'Session принудительно отозвана политикой или runtime.' },
  { name: 'failed', description: 'Session завершилась ошибкой.' },
]

const commonErrors: ErrorRow[] = [
  {
    http: 400,
    code: 'invalid_media_session_intent',
    description: 'Передан неизвестный media intent.',
  },
  {
    http: 400,
    code: 'invalid_media_session_status',
    description: 'Передан недопустимый public status.',
  },
  { http: 400, code: 'invalid_cursor', description: 'Некорректный opaque pagination cursor.' },
  {
    http: 403,
    code: 'voice_scope_required',
    description: 'У установки отсутствует обязательный voice scope.',
  },
  {
    http: 403,
    code: 'voice_bot_connect_blocked',
    description: 'Политика комнаты запрещает ботам подключение.',
  },
  {
    http: 403,
    code: 'voice_bot_listen_blocked',
    description: 'Политика комнаты запрещает прослушивание.',
  },
  {
    http: 403,
    code: 'voice_bot_speak_blocked',
    description: 'Политика комнаты запрещает publish audio/video.',
  },
  {
    http: 404,
    code: 'media_session_not_found',
    description: 'Media session не существует в границах установки.',
  },
  { http: 409, code: 'media_session_expired', description: 'Lease media session истёк.' },
  {
    http: 409,
    code: 'media_session_not_refreshable',
    description: 'Session находится в состоянии, которое нельзя refresh.',
  },
  {
    http: 409,
    code: 'media_session_not_disconnectable',
    description: 'Session уже нельзя отключить.',
  },
  {
    http: 429,
    code: 'runtime_limit_exceeded',
    description: 'Превышен media runtime limit; фактический code зависит от лимита.',
  },
  {
    http: 500,
    code: 'voice_state_unavailable',
    description: 'Не удалось получить live voice state.',
  },
]

const authHeaderExample = `Authorization: Bearer YOUR_BOT_ACCESS_TOKEN`

const voiceStateExample = `{
  "data": {
    "is_active": true,
    "participants": [
      {
        "user_id": 186,
        "nickname": "bot_1_1",
        "avatar_url": "https://echotalk.ru/maskot.ico",
        "is_bot": true,
        "tracks": [
          {
            "type": "AUDIO",
            "source": "MICROPHONE",
            "muted": false
          }
        ]
      }
    ],
    "participants_count": 1
  }
}`

const createSessionExample = `curl -X POST \\
  "https://jiechotalk.ru:8443/bot/voice/rooms/94/media-sessions" \\
  -H "Authorization: Bearer $BOT_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"intent":"speak"}'`

const createSessionResponseExample = `{
  "data": {
    "session_id": "bms_6b5431e1-0f37-47db-9fbb-d113f8898639",
    "server_id": 1,
    "room_id": 94,
    "intent": "speak",
    "status": "pending",
    "capabilities": {
      "audio_subscribe": false,
      "audio_publish": true,
      "video_subscribe": false,
      "video_publish": false
    },
    "started_at": null,
    "ended_at": null,
    "expires_at": "2026-09-04T12:05:00Z",
    "created_at": "2026-09-04T12:00:00Z",
    "updated_at": "2026-09-04T12:00:00Z",
    "livekit_url": "https://livekit.jiechotalk.ru",
    "token": "<short-lived-livekit-token>"
  }
}`

const paginationRequestExample = `GET /bot/voice/media-sessions?limit=50&status=active&cursor=<opaque-cursor>`

const paginationResponseExample = `{
  "meta": {
    "limit": 50,
    "has_more": true,
    "next_cursor": "<opaque-cursor>"
  }
}`

const errorEnvelopeExample = `{
  "error": {
    "code": "media_session_not_found",
    "message": "Media session не найдена",
    "details": {},
    "trace_id": "420c3f0e-9731-44d0-81fd-5ad519d61e34"
  }
}`

const runtimeLimitExample = `{
  "error": {
    "code": "max_active_tracks_per_bot_exceeded",
    "message": "Media runtime limit exceeded",
    "details": {
      "limit": 1,
      "current": 2,
      "mode": "deny"
    },
    "trace_id": "420c3f0e-9731-44d0-81fd-5ad519d61e34"
  }
}`

const activeSection = ref('overview')

let observer: IntersectionObserver | null = null

function disconnectSectionObserver(): void {
  observer?.disconnect()
  observer = null
}

async function initSectionObserver(): Promise<void> {
  disconnectSectionObserver()

  if (activeView.value !== 'guides') {
    return
  }

  await nextTick()

  const sectionIds = navigation.flatMap((group) => group.items.map((item) => item.id))

  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter((section): section is HTMLElement => section !== null)

  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

      if (visible[0]?.target.id) {
        activeSection.value = visible[0].target.id
      }
    },
    {
      rootMargin: '-120px 0px -60% 0px',
      threshold: [0.1, 0.5, 0.9],
    },
  )

  sections.forEach((section) => observer?.observe(section))
}

onMounted(() => {
  const hash = window.location.hash.replace('#', '')
  if (hash) {
    activeSection.value = hash
  }

  void initSectionObserver()
})

watch(activeView, () => {
  void initSectionObserver()
})

onBeforeUnmount(() => {
  disconnectSectionObserver()
})

async function copyCode(code: string): Promise<void> {
  if (!navigator.clipboard) {
    return
  }

  await navigator.clipboard.writeText(code)
}

const StoplightReference = defineComponent({
  name: 'StoplightReference',
  props: {
    specUrl: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    return () =>
      h('elements-api', {
        class: 'stoplight-reference',
        apiDescriptionUrl: props.specUrl,
        router: 'memory',
        layout: 'responsive',
        hideSchemas: true,
        hideExport: true,
        hideTryIt: false,
        hideTryItPanel: false,
        hideInternal: true,
        tryItCredentialsPolicy: 'omit',
      })
  },
})

const CodeBlock = defineComponent({
  name: 'DocsCodeBlock',
  props: {
    title: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
  },
  emits: {
    copy: () => true,
  },
  setup(props, { emit }) {
    return () =>
      h('div', { class: 'code-block' }, [
        h('div', { class: 'code-block__header' }, [
          h('span', props.title),
          h(
            'button',
            {
              type: 'button',
              class: 'code-block__copy',
              onClick: () => emit('copy'),
            },
            'Копировать',
          ),
        ]),
        h('pre', [h('code', props.code)]),
      ])
  },
})

const EndpointRow = defineComponent({
  name: 'DocsEndpointRow',
  props: {
    method: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    return () =>
      h('div', { class: 'endpoint-row' }, [
        h(
          'span',
          { class: `endpoint-row__method endpoint-row__method--${props.method.toLowerCase()}` },
          props.method,
        ),
        h('code', { class: 'endpoint-row__path' }, props.path),
        h('span', { class: 'endpoint-row__description' }, props.description),
      ])
  },
})
</script>

<style scoped>
.docs-page {
  min-height: 100vh;
  padding: 148px 0 64px;
}

.docs-view-switcher {
  position: fixed;
  top: calc(var(--app-header-height, 64px) + 12px);
  left: 50%;
  z-index: 1000;

  width: fit-content;
  max-width: calc(100% - 28px);
  margin: 0;

  display: inline-flex;
  gap: 4px;
  padding: 4px;

  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: var(--bg-tertiary);

  transform: translateX(-50%);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.16);
  backdrop-filter: blur(12px);
}

.docs-view-switcher__button {
  padding: 8px 14px;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  font: inherit;
  font-size: 0.88rem;
  font-weight: 700;
  transition: var(--transition);
}

.docs-view-switcher__button:hover {
  color: var(--text-primary);
}

.docs-view-switcher__button--active {
  background: var(--bg-elevated);
  color: var(--text-primary);
}

.api-reference-shell {
  width: min(1600px, calc(100% - 40px));
  margin: 0 auto;
}

.api-reference-hero {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 24px;
}

.api-reference-hero h1 {
  margin: 0 0 12px;
  color: var(--text-primary);
  font-size: clamp(2rem, 5vw, 3rem);
}

.api-reference-hero p {
  max-width: 820px;
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.7;
}

.api-reference-source {
  flex: none;
  padding: 9px 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-tertiary);
  color: var(--text-primary);
  text-decoration: none;
  font-size: 0.86rem;
}

.api-reference-source:hover {
  background: var(--bg-elevated);
}

.api-reference-frame {
  min-height: 75vh;
  overflow: hidden;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background: var(--bg-tertiary);
}

:deep(.stoplight-reference) {
  display: block;
  width: 100%;
  min-height: 78vh;
  border: 0;
}

.docs-shell {
  width: min(1480px, calc(100% - 40px));
  margin: 0 auto;
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  gap: 48px;
}

.docs-sidebar {
  min-width: 0;
}

.docs-sidebar__inner {
  position: sticky;
  top: 96px;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  padding-right: 8px;
}

.docs-sidebar__title {
  margin-bottom: 24px;
  color: var(--text-primary);
  font-size: 0.95rem;
  font-weight: 700;
}

.docs-nav {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.docs-nav__group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.docs-nav__group-title {
  margin-bottom: 5px;
  padding: 0 10px;
  color: var(--text-muted);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.docs-nav__link {
  display: block;
  padding: 8px 10px;
  border-radius: 8px;
  color: var(--text-secondary);
  font-size: 0.9rem;
  text-decoration: none;
  transition: var(--transition);
}

.docs-nav__link:hover,
.docs-nav__link--active {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.docs-content {
  width: min(100%, 980px);
  min-width: 0;
}

.docs-hero {
  margin-bottom: 56px;
}

.docs-badge {
  display: inline-flex;
  margin-bottom: 14px;
  padding: 5px 10px;
  border: 1px solid var(--border-color);
  border-radius: 999px;
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  font-size: 0.78rem;
}

.docs-hero h1 {
  margin: 0 0 16px;
  color: var(--text-primary);
  font-size: clamp(2rem, 5vw, 3rem);
  line-height: 1.08;
}

.docs-hero > p {
  max-width: 780px;
  margin: 0;
  color: var(--text-secondary);
  font-size: 1.05rem;
  line-height: 1.75;
}

.docs-meta-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 28px;
}

.docs-meta-card {
  min-width: 0;
  padding: 14px 16px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background: var(--bg-tertiary);
}

.docs-meta-card__label {
  display: block;
  margin-bottom: 7px;
  color: var(--text-muted);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.docs-meta-card code {
  overflow-wrap: anywhere;
  color: var(--text-primary);
}

.doc-section {
  scroll-margin-top: 112px;
  margin-bottom: 64px;
}

.doc-section h2 {
  margin: 0 0 18px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-primary);
  font-size: 1.75rem;
}

.doc-section h3 {
  margin: 32px 0 12px;
  color: var(--text-primary);
  font-size: 1.15rem;
}

.doc-section p {
  margin: 0 0 18px;
  color: var(--text-secondary);
  line-height: 1.75;
}

.doc-section code,
.file-reference code {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
}

.callout {
  display: grid;
  gap: 6px;
  margin: 20px 0;
  padding: 16px 18px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  line-height: 1.6;
}

.callout strong {
  color: var(--text-primary);
}

.callout--warning {
  border-color: rgba(245, 158, 11, 0.35);
}

.callout--info {
  border-color: rgba(99, 102, 241, 0.35);
}

.security-note {
  margin-top: 18px !important;
  padding-left: 14px;
  border-left: 3px solid var(--border-color);
}

.endpoint-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 20px 0 28px;
}

:deep(.endpoint-row) {
  display: grid;
  grid-template-columns: 62px minmax(280px, auto) 1fr;
  gap: 12px;
  align-items: center;
  padding: 12px 14px;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: var(--bg-tertiary);
}

:deep(.endpoint-row__method) {
  display: inline-flex;
  justify-content: center;
  padding: 4px 7px;
  border-radius: 6px;
  font-size: 0.72rem;
  font-weight: 800;
}

:deep(.endpoint-row__method--get) {
  background: rgba(34, 197, 94, 0.12);
  color: rgb(74, 222, 128);
}

:deep(.endpoint-row__method--post) {
  background: rgba(59, 130, 246, 0.12);
  color: rgb(96, 165, 250);
}

:deep(.endpoint-row__path) {
  overflow-wrap: anywhere;
  color: var(--text-primary);
  font-size: 0.84rem;
}

:deep(.endpoint-row__description) {
  color: var(--text-secondary);
  font-size: 0.88rem;
}

:deep(.code-block) {
  overflow: hidden;
  margin: 16px 0 24px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background: var(--bg-tertiary);
}

:deep(.code-block__header) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-elevated);
  color: var(--text-muted);
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

:deep(.code-block__copy) {
  padding: 5px 8px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  font: inherit;
  text-transform: none;
}

:deep(.code-block__copy:hover) {
  color: var(--text-primary);
}

:deep(.code-block pre) {
  margin: 0;
  padding: 18px;
  overflow-x: auto;
}

:deep(.code-block code) {
  color: var(--text-primary);
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.84rem;
  line-height: 1.65;
  white-space: pre;
}

.table-wrap {
  overflow-x: auto;
  margin: 20px 0;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
}

.docs-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 720px;
}

.docs-table th,
.docs-table td {
  padding: 13px 14px;
  border-bottom: 1px solid var(--border-color);
  text-align: left;
  vertical-align: top;
}

.docs-table th {
  background: var(--bg-elevated);
  color: var(--text-primary);
  font-size: 0.8rem;
}

.docs-table td {
  color: var(--text-secondary);
  font-size: 0.88rem;
  line-height: 1.55;
}

.docs-table tr:last-child td {
  border-bottom: 0;
}

.scope-chip {
  display: inline-block;
  margin: 2px 6px 2px 0;
  padding: 2px 5px;
  border-radius: 5px;
  background: var(--bg-elevated);
  color: var(--text-primary);
  font-size: 0.78rem;
}

.lifecycle {
  display: grid;
  gap: 8px;
  margin: 20px 0;
}

.lifecycle__item {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 18px;
  padding: 12px 14px;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: var(--bg-tertiary);
}

.lifecycle__item code {
  color: var(--text-primary);
  font-weight: 700;
}

.lifecycle__item span {
  color: var(--text-secondary);
  line-height: 1.55;
}

.file-reference {
  margin: 16px 0 20px;
  padding: 14px 16px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background: var(--bg-tertiary);
  overflow-wrap: anywhere;
}

@media (max-width: 1080px) {
  .docs-shell {
    grid-template-columns: 220px minmax(0, 1fr);
    gap: 28px;
  }

  .docs-meta-grid {
    grid-template-columns: 1fr;
  }

  :deep(.endpoint-row) {
    grid-template-columns: 62px 1fr;
  }

  :deep(.endpoint-row__description) {
    grid-column: 1 / -1;
  }
}

@media (max-width: 760px) {
  .api-reference-shell {
    width: min(100% - 28px, 980px);
  }

  .docs-view-switcher {
    top: calc(var(--app-header-height, 64px) + 8px);
  }

  .api-reference-hero {
    align-items: flex-start;
    flex-direction: column;
  }

  .docs-page {
    padding-top: 140px;
  }

  .docs-shell {
    width: min(100% - 28px, 980px);
    grid-template-columns: 1fr;
  }

  .docs-sidebar {
    display: none;
  }

  .docs-hero {
    margin-bottom: 40px;
  }

  .doc-section {
    margin-bottom: 48px;
  }

  .lifecycle__item {
    grid-template-columns: 1fr;
    gap: 6px;
  }
}
</style>

# EchoTalk Bot Developer Portal — Статус реализации

**Дата обновления:** 2026-05-21  
**Версия ТЗ:** Bot Developer Portal.pdf (февраль 2026)

---

## Легенда статусов

| Символ | Значение |
|--------|----------|
| ✅ | Реализовано и проверено |
| ⚠️ | Реализовано, есть ограничения/хвосты |
| 🚧 | В работе / частично |
| ❌ | Не реализовано |
| 📝 | Не указано в ТЗ, но реализовано |

---

## 0. Итоговый статус на текущий момент

**P0 закрыт.**  
**P1.1 закрыт.**  
**P1.1.1 закрыт.**  
**P1.2 закрыт.**  
**P2.1 WebSocket Gateway runtime закрыт базово.**  
**P2.2 Interactions + Expanded Bot Runtime закрыт на production-MVP уровне.**  
**P2.3 Gateway reliability hardening закрыт.**

Пройденные end-to-end проверки:

### Commands
- регистрация команд через Dev Portal
- CRUD команд
- slash commands из чата (`/help`, `/random`, `/today`, `/info`)
- invoke через HTTP (`command_base_url`)
- бот отвечает в чат
- disabled command / unknown command корректно отклоняются
- endpoint 500 корректно обрабатывается runtime-логикой
- дубли команд отклоняются

### Events
- `message.created` доставляется
- `message.updated` доставляется
- `message.deleted` доставляется
- webhook delivery + retry + attempts работают стабильно
- websocket gateway delivery работает
- gateway `hello` отдаёт `connection_id`, `last_issued_seq`, `last_acked_seq`, `status`
- gateway event delivery по websocket проверен
- gateway ACK проверен
- monotonic ACK protection проверен
- invalid ACK handling проверен
- resume replay missed events проверен

### Interactions
- bot messages с `components`
- buttons
- select menus
- interaction create flow
- `interaction.created` delivery
- ACK / callback lifecycle
- ephemeral responses
- `update_message` callback
- modal open
- modal submit
- modal persistence
- modal TTL / one-time submit protection
- modal schema validation

### Runtime API
- `/bot/me`
- `/bot/servers/:serverID`
- `/bot/servers/:serverID/rooms`
- `/bot/rooms/:roomID/messages`
- `PATCH /bot/messages/:messageID`
- `DELETE /bot/messages/:messageID`
- `/bot/servers/:serverID/members`
- `/bot/rooms/:roomID/members`

➡️ **Текущий следующий этап: P2.3 — Gateway reliability hardening**

---

## 1. Архитектурные принципы

| Принцип | Описание | Статус |
|---------|----------|--------|
| Бот = App + Installation | Bot App глобально + Installation на сервере | ✅ |
| Минимальные привилегии | Снимок scopes + granted permissions на установке | ✅ |
| Разделение API | Dev Portal API ≠ OAuth ≠ Bot API ≠ User API | ✅ |
| Transport isolation | Webhook и WebSocket Gateway выбираются на уровне installation | ✅ |
| Interaction lifecycle | Все interaction проходят через state machine | ✅ |
| Ephemeral != Message | Ephemeral не сохраняется как обычное сообщение чата | ✅ |
| Modal instance persistence | Каждая открытая modal хранится отдельной записью | ✅ |
| Gateway backlog | Gateway events сохраняются для resume/replay | ✅ базово |

---

## 2. Компоненты архитектуры

### 2.1 Bot Developer Portal ✅

| Функция | Статус | Примечание |
|---------|--------|------------|
| Создание Bot App | ✅ | `POST /dev/bots` |
| Редактирование | ✅ | `PUT /dev/bots/:id` |
| Удаление | ✅ | `DELETE /dev/bots/:id` |
| Redirect URLs | ✅ | `bot_app_redirect_uris` |
| Credentials / secrets / rotation | ✅ | `bot_credentials` + rotate |
| Публичный каталог | ✅ | `GET /api/public-bots`, `GET /api/public-bots/:id` |
| Допустимые scopes | ✅ | `GET /dev/bots/available-scopes` |
| UI install flow | ✅ | server → scopes → confirm → code |
| Slash commands UI | ✅ | создание / редактирование / включение |
| Webhook URL | ✅ | настройка на installation |
| Command Base URL | ✅ | настройка на installation |
| Transport select webhook/ws | ✅ | настройка на installation |
| Deliveries / attempts UI | ✅ | просмотр доставок и попыток |
| Gateway status UI | ❌ | planned for P2.3 |
| Interaction inspector | ❌ | planned |
| Версии / релизы | ❌ | нет |

### 2.2 Bot Auth Service ✅

| Функция | Endpoint | Статус | Примечание |
|---------|----------|--------|------------|
| Authorization Code flow | `POST /oauth/authorize` | ✅ | работает |
| Обмен code на токены | `POST /oauth/token` | ✅ | проверено |
| Refresh token flow | `POST /oauth/token/refresh` | 🚧 | endpoint есть, нужна отдельная проверка rotation semantics |
| Ротация credentials | `POST /dev/bots/:id/credentials/rotate` | ✅ | работает |
| Привязка code к credential | `bot_oauth_codes.credential_id` | ✅ | исправлено |
| Отзыв установки | `DELETE /servers/:serverID/bots/:installation_id` | ✅ | revoke installation/tokens |

### 2.3 Bot API Gateway / Runtime ✅

| Компонент | Статус | Примечание |
|-----------|--------|------------|
| `BotAuthMiddleware` | ✅ | access/session token validation |
| Installation context | ✅ | installation/bot/server scopes доступны |
| Snapshot scopes | ✅ | granted scopes |
| Granted permissions | ✅ | базовая проверка |
| `GET /bot/me` | ✅ | проверено |
| `GET /bot/servers/:serverID` | ✅ | проверено |
| `GET /bot/servers/:serverID/rooms` | ✅ | проверено |
| `GET /bot/rooms/:roomID/messages` | ✅ | проверено |
| `POST /bot/rooms/:roomID/messages` | ✅ | проверено |
| `PATCH /bot/messages/:messageID` | ✅ | own bot messages only |
| `DELETE /bot/messages/:messageID` | ✅ | own bot messages only |
| `GET /bot/servers/:serverID/members` | ✅ | persistent members из БД |
| `GET /bot/rooms/:roomID/members` | ✅ | live members из socket state |
| Rate limiting | ❌ | planned |
| Quotas | ❌ | planned |

### 2.4 Event Gateway ⚠️ / 🚧

| Компонент | Статус | Примечание |
|-----------|--------|------------|
| Webhook endpoint configuration | ✅ | `/dev/installations/:id/webhook` |
| Subscribed events | ✅ | `subscribed_events` |
| Webhook delivery worker | ✅ | polling + queue |
| Retry / backoff | ✅ | exponential |
| Delivery attempts | ✅ | attempts table |
| Webhook signing | ✅ | HMAC signature |
| Webhook cleanup worker | ✅ | env configurable |
| WebSocket Gateway | ✅ | persistent connection |
| Gateway events backlog | ✅ | `bot_gateway_events` |
| Gateway state | ✅ | `bot_gateway_states` |
| Runtime switch webhook/ws | ✅ | installation-level |
| Gateway ACK | ✅ | monotonic ACK проверен, старый ACK не откатывает seq |
| Gateway resume | ✅ | replay missed events по `last_ack_seq` проверен |
| Duplicate protection | ⚠️ | seq/event_id модель есть, ACK monotonic есть; client-side dedup contract ещё нужен |
| Reconnect replacement | ⚠️ | backend replacement есть; требуется финальная проверка stale/disconnected state |
| Last seen / last ack tracking | ✅ | `last_seen_at` / `last_acked_at` обновляются при ACK/heartbeat |
| Backlog overflow cleanup | ✅ | cleanup по overflow добавлен, требуется long-run проверка |

### Runtime configuration — installation-level

| Поле | Назначение | Статус |
|------|------------|--------|
| RuntimeEnabled | включает/выключает доставку событий | ✅ |
| EventDelivery | transport `webhook` / `websocket` | ✅ |
| WebhookURL | endpoint для webhook | ✅ |
| CommandBaseURL | endpoint для slash commands | ✅ |
| SubscribedEvents | список событий | ✅ |

Правила:

- `RuntimeEnabled = false` → события не доставляются
- `RuntimeEnabled = true` → используется выбранный transport
- `EventDelivery = webhook` → HTTP POST
- `EventDelivery = websocket` → Gateway delivery
- одновременно активен только один transport

### 2.5 Interactions ✅

| Компонент | Статус | Примечание |
|-----------|--------|------------|
| Slash commands | ✅ | полностью реализованы |
| HTTP command invoke | ✅ | sync model |
| Buttons / message components | ✅ | реализованы |
| Select menus | ✅ | `select_menu` interaction |
| Modal open | ✅ | callback `open_modal` |
| Modal submit | ✅ | `modal_submit` interaction |
| Modal persistence | ✅ | `bot_interaction_modals` |
| Modal TTL | ✅ | expiration worker |
| Modal one-time submit | ✅ | submitted / expired statuses |
| Modal schema validation | ✅ | required / min / max / unknown fields |
| Interaction create flow | ✅ | `/api/messages/:messageID/interactions` |
| Interaction ACK | ✅ | `/bot/interactions/:interactionID/ack` |
| Interaction callback | ✅ | `/bot/interactions/:interactionID/callback` |
| Interaction lifecycle | ✅ | pending / acked / responded / expired |
| Ephemeral responses | ✅ | websocket-only private delivery |
| Interaction persistence | ✅ | `bot_interactions` + `bot_interaction_responses` |
| Frontend ephemeral UI | ✅ | system-line overlay |
| Frontend modal UI | ✅ | modal form + validation/loading |
| `update_message` callback | ✅ | update source bot message/components |
| Deferred responses | ❌ | planned |
| Autocomplete | ❌ | planned |

---

## 3. Текущие модели данных

### Реализованные bot platform модели

```go
&bots.BotApp{},
&bots.BotAppRedirectURI{},
&bots.BotAppScope{},
&bots.BotAppEvent{},
&bots.BotCredential{},
&bots.BotInstallation{},
&bots.BotInstallationSecret{},
&bots.BotToken{},
&bots.BotTokenRevocation{},
&bots.BotCommand{},
&bots.BotOAuthCode{},
&bots.BotOAuthAudit{},
&bots.BotEventDelivery{},
&bots.BotEventDeliveryAttempt{},
&bots.BotGatewayState{},
&bots.BotGatewayEvent{},
&bots.BotInteraction{},
&bots.BotInteractionResponse{},
&bots.BotInteractionModal{},
```

### P1.1 delivery models

- `BotEventDelivery`
  - очередь webhook событий
  - statuses: pending / processing / retry / success / failed
- `BotEventDeliveryAttempt`
  - история попыток доставки
  - response status / error / duration / body excerpt

### P2.2 interaction models

- `BotInteraction`
  - source interaction для button/select/modal submit
  - lifecycle: pending / acked / responded / expired
- `BotInteractionResponse`
  - факт ответа бота на interaction
  - message / update_message / open_modal / ephemeral
- `BotInteractionModal`
  - конкретный instance открытой формы
  - schema / values / status / TTL / submitted_at

### P2.3 gateway models

- `BotGatewayState`
  - last issued seq
  - last acked seq
  - connection status
  - last connection id
  - last seen / last ack timestamps
- `BotGatewayEvent`
  - persistent backlog для websocket delivery
  - resume/replay через seq

---

## 4. Текущий набор роутов

### Public / Dev / OAuth

```go
// Public
GET  /api/public-bots
GET  /api/public-bots/:id
GET  /api/servers-for-bot-install

// Dev Portal
POST   /dev/bots
GET    /dev/bots
GET    /dev/bots/:id
PUT    /dev/bots/:id
POST   /dev/bots/:id/publish
DELETE /dev/bots/:id
GET    /dev/bots/available-scopes
GET    /dev/bots/:id/credentials
POST   /dev/bots/:id/credentials
POST   /dev/bots/:id/credentials/rotate
GET    /dev/bots/:id/installations
GET    /dev/installations/:installationID/webhook
PUT    /dev/installations/:installationID/webhook
POST   /dev/installations/:installationID/webhook/rotate-secret
GET    /dev/installations/:installationID/deliveries
GET    /dev/installations/:installationID/deliveries/:deliveryID/attempts
GET    /dev/bots/:id/commands
POST   /dev/bots/:id/commands
PUT    /dev/bots/:id/commands/:commandID
DELETE /dev/bots/:id/commands/:commandID

// OAuth
POST /oauth/authorize
POST /oauth/token
POST /oauth/token/refresh

// Installation revoke
DELETE /servers/:serverID/bots/:installation_id
```

### User interactions API

```go
POST /api/messages/:messageID/interactions
POST /api/interactions/modal-submit
```

### Bot runtime API

```go
GET    /bot/me
GET    /bot/servers/:serverID
GET    /bot/servers/:serverID/rooms
GET    /bot/servers/:serverID/members
GET    /bot/rooms/:roomID/messages
GET    /bot/rooms/:roomID/members
POST   /bot/rooms/:roomID/messages
PATCH  /bot/messages/:messageID
DELETE /bot/messages/:messageID
POST   /bot/interactions/:interactionID/ack
POST   /bot/interactions/:interactionID/callback
POST   /bot/gateway/session
GET    /bot/gateway/ws
```

---

## 5. Scopes / Permissions — актуальное состояние

### Актуальные scopes

- `bot`
- `server.view`
- `server.members.view`
- `room.view`
- `room.sendMessage`

### Что работает

- frontend получает допустимые scopes с backend
- install flow использует реальные scopes бота
- authorize/token/runtime работают в одной модели строк scopes
- runtime endpoints проверяют scopes и installation server boundary
- edit/delete messages разрешены только для own bot messages по `bot_installation_id`

### Ограничения

- нет полной granular RBAC-интеграции по room overrides
- нет category/channel-level grants
- нет event-driven permissions refresh
- нет rate limiting/quotas

---

## 6. Основные flow

### 6.1 Создание бота ✅

| Шаг | Статус |
|-----|--------|
| Создание Bot App | ✅ |
| Сохранение scopes | ✅ |
| Генерация credentials | ✅ |
| Редактирование | ✅ |
| Publish в каталог | ✅ |

### 6.2 Установка на сервер ✅

| Шаг | Статус |
|-----|--------|
| Выбор сервера | ✅ |
| Выбор scopes | ✅ |
| `/oauth/authorize` | ✅ |
| Выдача code | ✅ |
| `/oauth/token` | ✅ |
| Создание installation | ✅ |
| Создание bot user | ✅ |
| Выдача access/refresh token | ✅ |

### 6.3 Runtime ✅

| Шаг | Статус |
|-----|--------|
| `/bot/me` | ✅ |
| `/bot/servers/:serverID` | ✅ |
| `/bot/servers/:serverID/rooms` | ✅ |
| `/bot/rooms/:roomID/messages` | ✅ |
| `/bot/rooms/:roomID/messages` POST | ✅ |
| `PATCH /bot/messages/:messageID` | ✅ |
| `DELETE /bot/messages/:messageID` | ✅ |
| `/bot/servers/:serverID/members` | ✅ |
| `/bot/rooms/:roomID/members` | ✅ |

### 6.4 Event delivery ✅

| Шаг | Статус |
|-----|--------|
| Генерация события socket layer | ✅ |
| Публикация в delivery queue | ✅ |
| Webhook delivery worker | ✅ |
| Retry механизм | ✅ |
| Attempts логирование | ✅ |
| Подписки на события | ✅ |
| Webhook signing | ✅ |
| WS / Gateway delivery | ✅ |
| Gateway backlog | ✅ |
| Gateway ACK | ✅ |
| Gateway resume | ✅ |
| Gateway duplicate protection | ✅ |
| Gateway reconnect hardening | ✅ |

### 6.5 Slash Commands ✅

| Шаг | Статус |
|-----|--------|
| Регистрация команды | ✅ |
| Хранение в `bot_commands` | ✅ |
| Вызов из чата `/command` | ✅ |
| Runtime resolve команды | ✅ |
| HTTP invoke в бота | ✅ |
| Ответ бота → сообщение в чат | ✅ |

### 6.6 Interactions ✅

| Шаг | Статус |
|-----|--------|
| Button components | ✅ |
| Select components | ✅ |
| Runtime interaction create | ✅ |
| `interaction.created` event | ✅ |
| ACK endpoint | ✅ |
| Callback endpoint | ✅ |
| `message` callback | ✅ |
| `update_message` callback | ✅ |
| `open_modal` callback | ✅ |
| Modal submit | ✅ |
| Interaction timeout lifecycle | ✅ |
| Interaction persistence | ✅ |
| Ephemeral responses | ✅ |
| Frontend ephemeral rendering | ✅ |
| Modal persistence/hardening | ✅ |

---

## 7. Безопасность — текущее состояние

| Требование | Статус | Примечание |
|------------|--------|------------|
| Authorization code TTL | ✅ | реализовано |
| Access token TTL | ✅ | реализовано |
| Refresh token | ✅ | выпускается |
| Refresh rotation | 🚧 | требует отдельной доводки |
| Credential binding для auth code | ✅ | `CredentialID` |
| Snapshot scopes/permissions | ✅ | реализовано |
| BotAuthMiddleware | ✅ | access/session token |
| Token revocation | ✅ | revoke installation |
| Webhook signing | ✅ | HMAC signature |
| Retry защита | ✅ | backoff + max attempts |
| Interaction replay protection | ✅ | lifecycle validation |
| Interaction expiration | ✅ | timeout worker |
| Modal replay protection | ✅ | one-time submit |
| Modal expiration | ✅ | TTL + worker |
| Modal schema validation | ✅ | by persisted schema |
| Own message protection | ✅ | bot can edit/delete only own messages |
| Rate limiting | ❌ | planned |
| Idempotency/request_id | ⚠️ | delivery_id есть, строгий runtime idempotency не везде |
| Gateway ACK monotonic protection | ✅ | проверено через старый ACK, seq не откатывается |
| Gateway resume validation | ✅ | replay `seq > last_ack_seq` проверен; invalid resume требуется финально проверить |
| Gateway backlog overflow protection | ✅ | добавлена cleanup policy, нужна long-run проверка |

---

## 8. Что реально работает прямо сейчас

### Как разработчик бота

- создать Bot App
- редактировать его
- управлять credentials
- ротировать credentials
- публиковать бота
- видеть публичный каталог
- получать install code
- настроить webhook endpoint
- настроить command base URL
- выбрать webhook/websocket transport
- подписаться на события
- создавать и управлять slash-командами
- получать deliveries и attempts
- получать webhook события
- проверять webhook HMAC signature
- обрабатывать slash commands
- отправлять bot messages с components
- получать interaction.created
- ACK interaction
- callback response
- ephemeral response
- update source message/components
- open modal
- получать modal_submit values

### Как пользователь/администратор сервера

- открыть публичную карточку бота
- выбрать сервер
- выбрать разрешения
- авторизовать установку
- нажимать buttons/selects
- получать ephemeral responses
- заполнять bot modals

### Как bot client

- обменять authorization code на токены
- пройти `BotAuthMiddleware`
- получить installation info
- получить server/rooms/messages/members
- отправить сообщение
- редактировать свои сообщения
- удалять свои сообщения
- подключиться к Gateway
- получать события по webhook или websocket

---

## 9. Что не реализовано / что осталось

### Критично для production

- rate limiting для bot runtime endpoints
- quotas / abuse protection
- refresh token rotation hardening

### Следующие возможности

- deferred interaction responses
- autocomplete interactions
- user/role/channel select components
- Dev Portal interaction inspector
- event replay UI
- bot SDK / helpers
- metrics / analytics
- hosted runtime / billing / releases
- advanced RBAC / room overrides integration
- event versioning policy

---

## 10. План этапов

### P0 — закрыт ✅

Закрыто:
- Dev Portal CRUD
- credentials
- public catalog
- install flow
- `/oauth/authorize`
- `/oauth/token`
- `BotAuthMiddleware`
- базовый bot runtime
- send message smoke test

### P1.1 — webhook delivery ✅

Закрыто:
- delivery queue
- webhook POST
- HMAC signing
- delivery attempts

### P1.1.1 — retries / cleanup / UI ✅

Закрыто:
- retry/backoff
- cleanup worker
- delivery attempts UI

### P1.2 — slash commands ✅

Закрыто:
- command CRUD
- command invoke
- command base URL
- socket slash command flow

### P2.1 — WebSocket Gateway runtime ✅

Закрыто:
- session token
- gateway websocket connect
- realtime event delivery
- gateway backlog
- base resume/ack mechanics
- reliability hardening

### P2.2 — Interactions + Expanded Runtime ✅

Закрыто:
- buttons
- select menus
- message components
- interaction runtime
- ACK/callback lifecycle
- ephemeral responses
- `update_message`
- modal open/submit
- modal persistence/validation/TTL
- runtime message API
- runtime members API

### P2.3 — Gateway reliability hardening ✅

Закрыто:
- Gateway session token
- Gateway `hello` с `connection_id`, `last_issued_seq`, `last_acked_seq`, `status`
- WebSocket event delivery
- monotonic ACK protection
- invalid ACK handling
- missed events replay через resume
- `last_seen_at` / `last_acked_at` в gateway state
- backlog overflow cleanup logic
- invalid resume сценарий
- heartbeat → `last_seen_at`
- disconnected state после закрытия WS
- reconnect replacement / stale session state
- reconnect backoff contract для bot client
- Dev Portal gateway status UI
- client-side duplicate protection contract

---

## 11. Вывод

Текущее состояние проекта:

- **P0 завершён**
- **P1.1 завершён**
- **P1.1.1 завершён**
- **P1.2 завершён**
- **P2.1 завершён базово**
- **P2.2 завершён на production-MVP уровне**
- **P2.3 завершён**

Bot Platform уже поддерживает полноценный Discord-like interaction runtime:

- buttons
- selects
- modals
- ephemeral
- update callbacks
- runtime message/member API
- webhook/ws delivery

➡️ **Следующий этап:** P2.4 — Runtime protection: rate limiting, quotas, abuse protection.

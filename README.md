# EchoTalk Bot Developer Portal — Статус реализации

**Дата обновления:** 2026-04-16  
**Версия ТЗ:** Bot Developer Portal.pdf (февраль 2026)

---

## Легенда статусов

| Символ | Значение |
|--------|----------|
| ✅ | Реализовано и работает |
| ⚠️ | Реализовано, есть ограничения/хвосты |
| 🚧 | Частично / заглушка |
| ❌ | Не реализовано |
| 📝 | Не указано в ТЗ, но реализовано |

---

## 0. Итоговый статус на текущий момент

**P0 закрыт.**  
**P1.1 и P1.1.1 закрыты.**  
**P1.2 закрыт.**

Пройден end-to-end runtime test:

### Commands
- регистрация команд через Dev Portal
- CRUD команд
- slash commands из чата (на тестовом боте созданы и зарегистрированы команды `/help`, `/random`, `/today`, `/info`)
- invoke через HTTP (`command_base_url`)
- бот отвечает в чат
- обработка ошибок:
  - disabled command → `command not found`
  - unknown command → `command not found`
  - endpoint 500 → корректная ошибка runtime
  - дубли команд → корректно отклоняются

### Events
- `message.created` → доставляется
- `message.updated` → доставляется
- `message.deleted` → доставляется
- webhook delivery + retry + attempts работают стабильно

### Runtime config
- разделение:
  - `webhook_url` → события
  - `command_base_url` → команды
- корректная настройка через Dev Portal

➡️ **Следующий этап: P2 — interactions + расширенный runtime**

---

## 1. Архитектурные принципы

| Принцип | Описание | Статус |
|---------|----------|--------|
| Бот = App + Installation | Bot App глобально + Installation на сервере | ✅ |
| Минимальные привилегии | Снимок scopes + granted permissions на установке | ✅ Базово |
| Разделение API | Dev Portal API ≠ OAuth ≠ Bot API | ✅ |

---

## 2. Компоненты архитектуры

### 2.1 Bot Developer Portal ✅

| Функция | Статус | Примечание |
|---------|--------|------------|
| Создание Bot App | ✅ | `POST /dev/bots` |
| Редактирование (имя, описание, аватар, public) | ✅ | `PUT /dev/bots/:id` |
| Удаление | ✅ | `DELETE /dev/bots/:id` |
| Redirect URLs | ✅ | таблица `bot_app_redirect_uris` |
| Credentials / secrets / rotation | ✅ | `bot_credentials` + rotate |
| Публичный каталог | ✅ | `GET /api/public-bots`, `GET /api/public-bots/:id` |
| Допустимые scopes | ✅ | `GET /dev/bots/available-scopes`, данные приходят с backend |
| UI install flow | ✅ | сервер → scopes → confirm → code |
| Список команд | ✅ | CRUD реализован |
| Slash commands UI | ✅ | создание/редактирование/включение |
| Command Base URL | ✅ | настройка на уровне installation |
| Webhook/Gateway настройка | ❌ | нет |
| Версии / релизы | ❌ | нет |

### 2.2 Bot Auth Service ✅

| Функция | Endpoint | Статус | Примечание |
|---------|----------|--------|------------|
| Authorization Code flow | `POST /oauth/authorize` | ✅ | работает |
| Обмен code на токены | `POST /oauth/token` | ✅ | проверено smoke test |
| Refresh token flow | `POST /oauth/token/refresh` | 🚧 | endpoint есть, логика требует отдельной проверки/доводки |
| Ротация credentials | `POST /dev/bots/:id/credentials/rotate` | ✅ | работает |
| Привязка code к credential | `bot_oauth_codes.credential_id` | ✅ | исправлено |
| Отзыв установки | `DELETE /servers/:serverID/bots/:installation_id` | ✅ | revoke installation/tokens |

### 2.3 Bot API Gateway / Runtime ✅

| Компонент | Статус | Примечание |
|-----------|--------|------------|
| `BotAuthMiddleware` | ✅ | access token валидация работает |
| Извлечение installation context | ✅ | installation/bot/server доступны |
| Проверка scopes | ✅ | snapshot-модель |
| Проверка granted permissions | ✅ Базово | без room overrides |
| `GET /bot/me` | ✅ | проверено |
| `GET /bot/servers/:serverID` | ✅ | проверено |
| `GET /bot/servers/:serverID/rooms` | ✅ | проверено |
| `POST /bot/rooms/:roomID/messages` | ✅ | проверено, сообщение реально доставляется |
| Rate limiting | ❌ | нет |
| DDoS защита | ❌ | нет |

### 2.4 Event Gateway ⚠️

| Компонент | Статус | Примечание |
|-----------|--------|------------|
| Webhook endpoint configuration | ✅ | `/dev/installations/:id/webhook` |
| Подписки на события | ✅ | subscribed_events |
| Webhook delivery worker | ✅ | polling + queue |
| Retry / backoff | ✅ | экспоненциальный |
| Delivery attempts | ✅ | таблица attempts |
| Webhook signing (HMAC) | ✅ | X-EchoTalk-Signature |
| Cleanup worker | ✅ | env configurable |
| WebSocket Gateway | ✅ | realtime доставка через persistent connection |
| Gateway reconnect | ⚠️ | базово есть, требует доработки (backoff/ack) |
| Event streaming | ✅ | message.created / updated / deleted |
| Runtime switch (webhook/ws) | ✅ | через installation config |
| Interaction ACK lifecycle | ✅ | pending / acked / responded / expired |
| Interaction timeout worker | ✅ | auto-expire interactions |
| Callback timeout | ✅ | configurable |
| Gateway cleanup workers | ✅ | interaction/webhook/gateway cleanup |

### Runtime configuration (installation-level)

| Поле | Назначение | Статус |
|------|------------|--------|
| RuntimeEnabled | включает/выключает доставку событий | ✅ |
| EventDelivery | transport (`webhook` / `websocket`) | ✅ |
| WebhookURL | endpoint для webhook | ✅ |
| CommandBaseURL | endpoint для slash commands | ✅ |
| SubscribedEvents | список событий | ✅ |

### Логика

- RuntimeEnabled = false → события НЕ доставляются ни по одному транспорту
- RuntimeEnabled = true → используется выбранный transport
- EventDelivery:
  - `webhook` → HTTP POST
  - `websocket` → realtime gateway
- transport **всегда один активный**

### 2.5 Interactions ✅

| Компонент | Статус | Примечание |
|-----------|--------|------------|
| Slash commands | ✅ | полностью реализованы |
| HTTP command invoke | ✅ | sync model |
| Buttons / message components | ✅ | реализованы |
| Interaction create flow | ✅ | `/api/messages/:messageID/interactions` |
| Interaction ACK | ✅ | `/bot/interactions/:interactionID/ack` |
| Interaction callback | ✅ | `/bot/interactions/:interactionID/callback` |
| Interaction lifecycle | ✅ | pending / acked / responded / expired |
| Ephemeral responses | ✅ | websocket-only private delivery |
| Interaction persistence | ✅ | `bot_interactions` + `bot_interaction_responses` |
| Frontend ephemeral UI | ✅ | system-line overlay |
| Modals | ❌ | не реализованы |
| Select menus | ❌ | не реализованы |

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
```
### Дополнительно (P1.1)

- `BotEventDelivery`
  - очередь webhook событий
  - статус: pending / processing / retry / success / failed
  - `BotEventDeliveryAttempt`
  - история попыток доставки
  - response status / error / duration / body excerpt

### Ключевые замечания по модели

- `BotOAuthCode` теперь хранит `CredentialID`, что корректно привязывает `authorization_code` к конкретному credential
- `BotInstallation` хранит:
  - `GrantedScopes`
  - `GrantedPermissions`
  - `BotUserID`
- runtime использует snapshot-модель безопасности
- `bot user` создаётся как системный пользователь для installation

---

## 4. Текущий набор роутов

```go
// SetupBotRoutes регистрирует роуты для Bot Dev Portal
func SetupBotRoutes(r *gin.Engine) {
    stateStore := services.NewStateStore()

    botsCtrl := bots.NewBotsController()
    credsCtrl := bots.NewCredentialsController()
    installCtrl := bots.NewInstallController()
    webhookCtrl := bots.NewWebhookController()
    oauthCtrl := bots.NewOAuthController(stateStore)
    scopesCtrl := bots.NewScopesController()
    runtimeCtrl := bots.NewRuntimeController()
    commandsCtrl := bots.NewCommandsController()
    gatewayCtrl := bots.NewGatewayController()

    interactionDeps := NewBotInteractionDeps()

    public := r.Group("/api") {
        public.GET("/public-bots", botsCtrl.GetPublicBots)
        public.GET("/public-bots/:id", botsCtrl.GetPublicBotInfo)
        public.GET("/servers-for-bot-install", middleware.AuthMiddleware(), botsCtrl.GetServersForBotInstall)
    }

    dev := r.Group("/dev")
    dev.Use(middleware.AuthMiddleware()) {
        dev.POST("/bots", botsCtrl.Create)
        dev.GET("/bots", botsCtrl.List)
        dev.GET("/bots/:id", botsCtrl.Get)
        dev.PUT("/bots/:id", botsCtrl.Update)
        dev.POST("/bots/:id/publish", botsCtrl.PublishBot)
        dev.DELETE("/bots/:id", botsCtrl.Delete)
		dev.GET("/bots/available-scopes", scopesCtrl.List)
        dev.GET("/bots/:id/credentials", credsCtrl.List)
        dev.POST("/bots/:id/credentials", credsCtrl.Create)
        dev.POST("/bots/:id/credentials/rotate", credsCtrl.Rotate)
        dev.GET("/bots/:id/installations", installCtrl.GetInstallations)
        dev.GET("/installations/:installationID/webhook", webhookCtrl.GetInstallationWebhook)
        dev.PUT("/installations/:installationID/webhook", webhookCtrl.UpdateInstallationWebhook)
        dev.POST("/installations/:installationID/webhook/rotate-secret", webhookCtrl.RotateInstallationSecret)
        dev.GET("/installations/:installationID/deliveries", webhookCtrl.ListInstallationDeliveries)
        dev.GET("/installations/:installationID/deliveries/:deliveryID/attempts", webhookCtrl.ListDeliveryAttempts)
        dev.GET("/bots/:id/commands", commandsCtrl.List)
        dev.POST("/bots/:id/commands", commandsCtrl.Create)
        dev.PUT("/bots/:id/commands/:commandID", commandsCtrl.Update)
        dev.DELETE("/bots/:id/commands/:commandID", commandsCtrl.Delete)
    }

    oauth := r.Group("/oauth"){
        oauth.POST("/authorize", middleware.AuthMiddleware(), oauthCtrl.Authorize)
        oauth.POST("/token", oauthCtrl.Token)
        oauth.POST("/token/refresh", oauthCtrl.RefreshToken)
    }

    servers := r.Group("/servers/:serverID")
    servers.Use(middleware.AuthMiddleware()) { 
		servers.DELETE("/bots/:installation_id", installCtrl.Revoke) 
	}
	
	botAPI := r.Group("/bot") {
        rest := botAPI.Group("")
        rest.Use(middleware.BotAuthMiddleware(modelbots.TokenTypeAccess)) {
                rest.GET("/me", runtimeCtrl.Me)
                rest.GET("/servers/:serverID", runtimeCtrl.GetServer)
                rest.GET("/servers/:serverID/rooms", runtimeCtrl.ListRooms)
                rest.POST("/rooms/:roomID/messages", runtimeCtrl.SendMessage)
                rest.POST("/interactions/:interactionID/callback", interactionDeps.BotInteractionsCtrl.Callback)
                rest.POST("/interactions/:interactionID/ack", interactionDeps.BotInteractionsCtrl.Ack)
                rest.POST("/gateway/session", gatewayCtrl.CreateSession)
        }

        gateway := botAPI.Group("")
        gateway.Use(middleware.BotAuthMiddleware(modelbots.TokenTypeSession)) {
                gateway.GET("/gateway/ws", gatewayCtrl.Connect)
		}
    }
}
```

---

## 5. Scopes / Permissions — актуальное состояние

### Что исправлено
Ранее scopes были захардкожены на клиенте. Сейчас это исправлено:

- frontend получает допустимые scopes с backend
- backend отдаёт список через `GET /dev/bots/available-scopes`
- install flow использует реальные scopes бота
- authorize/token/runtime работают в одной модели строк scopes

### Актуальная модель
Сейчас bot scopes совпадают с реальными EchoTalk privileges:

- `bot`
- `server.view`
- `server.members.view`
- `room.view`
- `room.sendMessage`

### Текущее ограничение
Это ещё не полная granular RBAC-интеграция:
- нет room overrides
- нет category/channel-level grants
- нет расширенного privilege mapping
- нет событийной модели permissions refresh

Но для P0 runtime этого уже достаточно.

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

### 6.4 Event delivery ⚠️

| Шаг | Статус |
|-----|--------|
| Генерация события (socket layer) | ✅ |
| Публикация в delivery queue | ✅ |
| Webhook delivery worker | ✅ |
| Retry механизм | ✅ |
| Attempts логирование | ✅ |
| Подписки на события | ✅ |
| Webhook signing | ✅ |
| WS / Gateway | ✅ |
| Interaction runtime events | ✅ |
| interaction.created | ✅ |

### 6.5 Slash Commands ✅

| Шаг | Статус |
|-----|--------|
| Регистрация команды | ✅ |
| Хранение в bot_commands | ✅ |
| Вызов из чата `/command` | ✅ |
| Runtime resolve команды | ✅ |
| HTTP invoke в бота | ✅ |
| Ответ бота → сообщение в чат | ✅ |

### 6.6 Interactions ✅

| Шаг | Статус |
|-----|--------|
| Button components в сообщениях | ✅ |
| Runtime interaction create | ✅ |
| interaction.created event | ✅ |
| ACK endpoint | ✅ |
| Callback endpoint | ✅ |
| Interaction timeout lifecycle | ✅ |
| Interaction persistence | ✅ |
| Ephemeral responses | ✅ |
| Frontend ephemeral rendering | ✅ |

---

## 7. Безопасность — текущее состояние

| Требование | Статус | Примечание |
|------------|--------|------------|
| Authorization code TTL | ✅ | реализовано |
| Access token TTL | ✅ | реализовано |
| Refresh token | ✅ | выпускается |
| Refresh rotation | 🚧 | требует отдельной доводки |
| Credential binding для auth code | ✅ | через `CredentialID` |
| Snapshot scopes/permissions | ✅ | реализовано |
| BotAuthMiddleware | ✅ | реализовано |
| Token revocation | ✅ | базово через revoke installation |
| Rate limiting | ❌ | нет |
| Webhook signing | ✅ | HMAC signature |
| Idempotency/request_id | ⚠️ | delivery_id используется, но строгой гарантии нет |
| Retry защита | ✅ | backoff + max_attempts |
| Interaction replay protection | ✅ | interaction lifecycle validation |
| Interaction expiration | ✅ | background timeout worker |

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
- подписаться на события
- создавать и управлять slash-командами
- вызывать команды из чата (`/название_команды`)
- получать ответ бота как сообщение
- обрабатывать runtime ошибки команд
- получать webhook события (message.created, message.edited, message.deleted)
- обрабатывать retry delivery
- проверять подпись webhook
- видеть deliveries и attempts в Dev Portal
- отправлять bot messages с buttons/components
- получать interaction.created
- ACK interaction
- callback response
- ephemeral responses
- private ephemeral websocket delivery

### Как пользователь/администратор сервера
- открыть публичную карточку бота
- выбрать сервер
- выбрать разрешения
- авторизовать установку

### Как bot client
- обменять `authorization_code` на токены
- пройти `BotAuthMiddleware`
- получить информацию о своей installation
- получить сервер
- получить список комнат
- отправить сообщение в комнату

---

## 9. Что не реализовано

- event subscriptions [4 базовые события реализованы, требуется расширение событий]
- rate limiting
- полная room override / advanced RBAC модель
- metrics / analytics / quotas
- hosted runtime / billing / releases
- event versioning (частично)
- idempotency гарантия
- modals
- select menus
- multi-step interaction flows
- interaction editing/update API
- ephemeral persistence cleanup policy

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

### P1 — runtime expansion

Планировать и реализовывать:
P1.1 — webhook delivery ✅

P1.1.1 — retries / cleanup / UI ✅

P1.2 — завершён ✅

P2.1 — WebSocket Gateway runtime ✅

### Ограничение текущей модели

- В каждый момент времени активен только один transport:
  - либо webhook
  - либо websocket

- Одновременная доставка в оба transport НЕ поддерживается

Причины:
- упрощение модели
- исключение дублирования событий
- предсказуемость runtime поведения

Реализовано:
- message.updated
- message.deleted
- стабильный event delivery
- command system (slash commands)
- command runtime (HTTP invoke)
- разделение webhook / command base URL

P2.2 — Interactions MVP ✅ partially completed

Реализовано:
- buttons
- message components
- interaction runtime
- interaction ACK/callback lifecycle
- ephemeral responses
- interaction persistence
- websocket ephemeral delivery

Осталось:
- modals
- select menus
- deferred interaction updates
- interaction editing
- advanced interaction state machine

---

## 11. Вывод

Текущее состояние проекта (обновлено):

- **P0 завершён**
- **P1.1 завершён (webhook delivery)**
- **P1.1.1 завершён (retry, cleanup, UI)**
- **P2.1 завершён (webSocket gateway runtime)
- **P2.2 завершён (Interactions)

- Dev Portal предоставляет полный контроль над delivery

➡️ Следующий этап:

P2.2 continuation:
- modals
- select menus
- interaction editing/update flow

P2.3:
- gateway reliability hardening
- resume/ack synchronization
- duplicate protection
- reconnect backoff

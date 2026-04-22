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
| WebSocket Gateway | ❌ | не реализован |
| Deadline/ack | ❌ | нет |

### 2.5 Interactions ⚠️

| Компонент | Статус | Примечание |
|-----------|--------|------------|
| Slash commands | ✅ | полностью реализованы |
| HTTP command invoke | ✅ | sync model |
| Buttons / message components | ❌ | не реализованы |
| Modals / interactions | ❌ | не реализованы |

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

// Публичные endpoints (без авторизации)
public := r.Group("/api")
{
    public.GET("/public-bots", botsCtrl.GetPublicBots)  
    public.GET("/public-bots/:id", botsCtrl.GetPublicBotInfo)
    public.GET("/servers-for-bot-install", middleware.AuthMiddleware(), botsCtrl.GetServersForBotInstall)
}

// === Dev Portal API (требует авторизации пользователя) ===
dev := r.Group("/dev")
dev.Use(middleware.AuthMiddleware())
{
// Bots CRUD
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

    // Installations (для владельца бота)
    dev.GET("/bots/:id/installations", installCtrl.GetInstallations)

    // Webhooks
    dev.GET("/installations/:installationID/webhook", webhookCtrl.GetInstallationWebhook)
    dev.PUT("/installations/:installationID/webhook", webhookCtrl.UpdateInstallationWebhook)
    dev.POST("/installations/:installationID/webhook/rotate-secret", webhookCtrl.RotateInstallationSecret)
    dev.GET("/installations/:installationID/deliveries", webhookCtrl.ListInstallationDeliveries)
    dev.GET("/installations/:installationID/deliveries/:deliveryID/attempts", webhookCtrl.ListDeliveryAttempts)

    // Commands
    dev.GET("/bots/:id/commands", commandsCtrl.List)
    dev.POST("/bots/:id/commands", commandsCtrl.Create)
    dev.PUT("/bots/:id/commands/:commandID", commandsCtrl.Update)
    dev.DELETE("/bots/:id/commands/:commandID", commandsCtrl.Delete)
}

oauth := r.Group("/oauth")
{
    oauth.POST("/authorize", middleware.AuthMiddleware(), oauthCtrl.Authorize)
    oauth.POST("/token", oauthCtrl.Token)
    oauth.POST("/token/refresh", oauthCtrl.RefreshToken)
}

servers := r.Group("/servers/:serverID")
servers.Use(middleware.AuthMiddleware())
{
    servers.DELETE("/bots/:installation_id", installCtrl.Revoke)
}

// === Bot API (требует Bot Token) ===
botAPI := r.Group("/bot")
botAPI.Use(middleware.BotAuthMiddleware())
    {
        botAPI.GET("/me", runtimeCtrl.Me)
        botAPI.GET("/servers/:serverID", runtimeCtrl.GetServer)
        botAPI.GET("/servers/:serverID/rooms", runtimeCtrl.ListRooms)
        botAPI.POST("/rooms/:roomID/messages", runtimeCtrl.SendMessage)
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
| WS / Gateway | ❌ |

### 6.5 Slash Commands ✅

| Шаг | Статус |
|-----|--------|
| Регистрация команды | ✅ |
| Хранение в bot_commands | ✅ |
| Вызов из чата `/command` | ✅ |
| Runtime resolve команды | ✅ |
| HTTP invoke в бота | ✅ |
| Ответ бота → сообщение в чат | ✅ |

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

- WS/gateway delivery
- event subscriptions [требуется расширение событий]
- rate limiting
- полная room override / advanced RBAC модель
- metrics / analytics / quotas
- hosted runtime / billing / releases
- event versioning (частично)
- idempotency гарантия
- buttons / message components
- modals / interactions

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

Реализовано:
- message.updated
- message.deleted
- стабильный event delivery
- command system (slash commands)
- command runtime (HTTP invoke)
- разделение webhook / command base URL

### P2 — следующий этап

- interactions (buttons, components, modals)
- расширенный runtime API
- улучшение error handling UX
- rate limiting / quotas
- возможный WS runtime для ботов
---

## 11. Вывод

Текущее состояние проекта (обновлено):

- **P0 завершён**
- **P1.1 завершён (webhook delivery)**
- **P1.1.1 завершён (retry, cleanup, UI)**
- реализована полноценная webhook-based event система
- Dev Portal предоставляет полный контроль над delivery

Следующий этап:

➡️ **P2 — interactions + расширение bot runtime**

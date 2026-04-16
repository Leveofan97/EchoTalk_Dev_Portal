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
Пройден end-to-end smoke test полного install/runtime цикла:

- создание и редактирование Bot App через Dev Portal
- получение допустимых scopes с backend
- публикация бота в публичный каталог
- установка бота на сервер через `/oauth/authorize`
- обмен `authorization_code` на `access_token` / `refresh_token` через `/oauth/token`
- успешная аутентификация через `BotAuthMiddleware`
- рабочие runtime endpoint'ы:
  - `GET /bot/me`
  - `GET /bot/servers/:serverID`
  - `GET /bot/servers/:serverID/rooms`
  - `POST /bot/rooms/:roomID/messages`
- тестовое сообщение реально доставляется в комнату от bot user

**P1.1 и P1.1.1 закрыты.**

Дополнительно реализовано:

- webhook delivery (HTTP)
- retry механизм с backoff
- delivery attempts логирование
- webhook signing (HMAC)
- Dev Portal UI для webhook:
  - настройка URL
  - подписка на события
  - rotate secret
  - просмотр deliveries
  - просмотр attempts
- cleanup worker:
  - автоочистка attempts / deliveries

**Следующий этап:** P1.2 — расширение runtime событий и command system

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
| Список команд | 🚧 | модель есть, API нет |
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

### 2.5 Interactions ❌

| Компонент | Статус | Примечание |
|-----------|--------|------------|
| Команды | 🚧 | модель `bot_commands` есть |
| Slash commands API | ❌ | нет |
| Buttons / message components | ❌ | нет |
| Modals / interactions | ❌ | нет |

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
func SetupBotRoutes(r *gin.Engine) {
	stateStore := services.NewStateStore()

	botsCtrl := bots.NewBotsController()
	credsCtrl := bots.NewCredentialsController()
	installCtrl := bots.NewInstallController()
	oauthCtrl := bots.NewOAuthController(stateStore)
	scopesCtrl := bots.NewScopesController()
	runtimeCtrl := bots.NewRuntimeController()

	public := r.Group("/api")
	{
		public.GET("/public-bots", botsCtrl.GetPublicBots)
		public.GET("/public-bots/:id", botsCtrl.GetPublicBotInfo)
		public.GET("/servers-for-bot-install", middleware.AuthMiddleware(), botsCtrl.GetServersForBotInstall)
	}

	dev := r.Group("/dev")
	dev.Use(middleware.AuthMiddleware())
	{
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
- получать webhook события (message.created)
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

- webhook delivery
- WS/gateway delivery
- event subscriptions
- commands/interactions
- rate limiting
- полная room override / advanced RBAC модель
- metrics / analytics / quotas
- hosted runtime / billing / releases
- commands/interactions
- event versioning (частично)
- idempotency гарантия

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

P1.2 — следующий этап:
1. message.updated
2. message.deleted
3. стабильный event envelope
4. commands system
5. расширение runtime API

### P2+

- webhook / WS gateway
- commands / interactions
- расширенный RBAC для ботов
- rate limits / quotas / delivery retry

---

## 11. Вывод

Текущее состояние проекта (обновлено):

- **P0 завершён**
- **P1.1 завершён (webhook delivery)**
- **P1.1.1 завершён (retry, cleanup, UI)**
- реализована полноценная webhook-based event система
- Dev Portal предоставляет полный контроль над delivery

Следующий этап:

➡️ **P1.2 — расширение runtime (events + commands)**

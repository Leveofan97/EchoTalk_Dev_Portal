# EchoTalk Bot Developer Portal — Статус реализации

**Дата обновления:** 2026-03-03  
**Версия ТЗ:** Bot Developer Portal (февраль 2026)

---

## Легенда статусов

| Символ | Значение |
|--------|----------|
| ✅ | Реализовано и работает |
| ⚠️ | Реализовано, есть ограничения/баги |
| 🚧 | Частично / заглушка |
| ❌ | Не реализовано |
| 📝 | Не указано в ТЗ, но реализовано |

---

## 0. Архитектурные принципы

| Принцип | Описание из ТЗ | Статус |
|---------|---------------|--------|
| Бот = App + Installation | Bot App (глобально) + Installation (на сервере) | ✅ Реализовано |
| Минимальные привилегии | Platform scopes → Server role/permission → Room overrides | ⚠️ Частично (scopes есть, permissions/roles нет) |
| Разделение API | Dev Portal API ≠ Bot API ≠ Gateway/Webhooks ≠ Interactions | ✅ Структура соблюдена |

---

## 1. Компоненты архитектуры

### 1.1 Bot Developer Portal ✅

**Требования:**
&gt; Создание Bot App, настройка (имя/иконка/описание, redirect URLs, публичный ключ/секреты, список команд, webhook endpoint/gateway режим, допустимые scopes), управление версиями

| Функция | Статус | Примечание |
|---------|--------|------------|
| Создание Bot App | ✅ | `POST /dev/bots` |
| Редактирование (имя, описание, аватар) | ✅ | `PUT /dev/bots/:id` |
| Удаление | ✅ | `DELETE /dev/bots/:id` |
| Redirect URLs | ✅ | `bot_app_redirect_uris` таблица |
| Публичный ключ/секреты | ✅ | `bot_app_credentials` (type: secret/public_key) |
| Список команд | 🚧 | Модель `bot_commands` есть, API управления нет |
| Webhook endpoint/gateway режим | ❌ | Модели есть, API нет |
| Допустимые scopes | ⚠️ | **Заглушка на клиенте** — константный список, нет API получения доступных привилегий |
| Управление версиями | ❌ | Не реализовано |

**Сверка с ТЗ:** Версионирование не указано явно как обязательное для MVP, но упомянуто в "Stage 4".

---

### 1.2 Bot Auth Service ✅

**Требования:**
&gt; OAuth2-like токены (Authorization Code, Refresh tokens), ротация секретов, отзыв токенов

| Функция | Endpoint | Статус | Примечание |
|---------|----------|--------|------------|
| Authorization Code flow | `POST /oauth/authorize` | ✅ | Исправлен тип `bot_id` (string→uint) |
| Обмен code на токены | `POST /oauth/token` | ✅ | Возвращает access + refresh |
| Refresh tokens | `POST /oauth/token/refresh` | 🚧 | Заглушка, не реализована логика |
| Ротация секретов | `POST /dev/bots/:id/credentials/rotate` | ✅ | Работает |
| Отзыв токенов | `DELETE /servers/:id/bots/:installation_id` | ✅ | Revoke installation + tokens |

**Сверка с ТЗ:** Refresh token rotation не реализован, но это не блокер для MVP.

---

### 1.3 Bot API Gateway 🚧

**Требования:**
&gt; Валидация token → bot_id → installation_id → scopes → server/room permissions, защита от DDoS (rate limit, debounce, WAF)

| Компонент | Статус | Примечание |
|-----------|--------|------------|
| Middleware валидации токена | 🚧 | `BotAuthMiddleware` объявлен, пустой |
| Извлечение installation_id | ❌ | Нет |
| Проверка scopes | ❌ | Нет |
| Проверка server/room permissions | ❌ | Нет |
| Rate limiting | ❌ | Нет (только заглушка `bot_quotas`) |
| DDoS защита | ❌ | Нет |

**Сверка с ТЗ:** Критичный пробел. Без этого бот не может безопасно вызывать API.

---

### 1.4 Event Gateway ❌

**Требования:**
&gt; Webhooks (push HTTP) и/или WS Gateway (persistent), подписки на события, retry/очередь недоставленных, дедлайн на ответ

| Компонент | Статус | Примечание |
|-----------|--------|------------|
| Webhook endpoint configuration | ❌ | Нет API |
| WebSocket Gateway | ❌ | Нет |
| Подписки на события | ❌ | Модель `bot_event_subscriptions` есть, не используется |
| Retry логика | ❌ | Нет |
| Очередь недоставленных | ❌ | Нет |
| Дедлайн на ответ | ❌ | Нет |

**Сверка с ТЗ:** Не реализовано. Блокер для реактивных ботов (только polling возможен).

---

### 1.5 Interactions ❌

**Требования:**
&gt; Slash-команды/кнопки/модалки

| Компонент | Статус | Примечание |
|-----------|--------|------------|
| Регистрация команд | ❌ | Модель `bot_commands` есть, API нет |
| Slash commands в UI | ❌ | Нет |
| Кнопки (message components) | ❌ | Нет |
| Модалки (forms) | ❌ | Нет |
| Interaction handlers | ❌ | Нет |

**Сверка с ТЗ:** Stage 2. Не критично для MVP.

---

## 2. Модели данных (таблицы PostgreSQL)

### Полный список миграций (актуальный):

```go
// Bot platform models
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
```
### 2.1 BotApp & Metadata ✅

| Таблица                 | Модель              | Поля (ключевые)                                               | Статус | Сверка с ТЗ   |
| ----------------------- | ------------------- | ------------------------------------------------------------- | ------ | ------------- |
| `bot_apps`              | `BotApp`            | `ID, OwnerID, Name, Description, AvatarURL, IsPublic, Status` | ✅      | Соответствует |
| `bot_app_redirect_uris` | `BotAppRedirectURI` | `BotAppID, URI`                                               | ✅      | Соответствует |
| `bot_app_scopes`        | `BotAppScope`       | `BotAppID, Scope`                                             | ✅      | Соответствует |
| `bot_app_events`        | `BotAppEvent`       | `BotAppID, EventType, Intent`                                 | ✅      | Соответствует |

Примечание: Intent в BotAppEvent — дополнительное поле для группировки событий.

### 2.2 Credentials ✅
| Таблица           | Модель          | Поля (ключевые)                                                                          | Статус | Сверка с ТЗ   |
| ----------------- | --------------- | ---------------------------------------------------------------------------------------- | ------ | ------------- |
| `bot_credentials` | `BotCredential` | `BotAppID, Type, ClientID, SecretHash/PublicKeyPEM, RevokedAt, LastUsedAt, RotationHint` | ✅      | Соответствует |

Особенности реализации:
- Поддержка двух типов: secret (bcrypt hash) и public_key (PEM)
- RotationHint — подсказка о сроке ротации (не в ТЗ, но полезно)
- LastUsedAt — аудит использования

### 2.3 Installation ✅
| Таблица                    | Модель                  | Поля (ключевые)                                                                                                    | Статус | Сверка с ТЗ   |
| -------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------ | ------ | ------------- |
| `bot_installations`        | `BotInstallation`       | `BotAppID, ServerID, InstalledBy, Status, GrantedScopes, GrantedPermissions, BotUserID, EventDelivery, WebhookURL` | ✅      | Соответствует |
| `bot_installation_secrets` | `BotInstallationSecret` | `InstallationID, WebhookSecretHash, RotatedAt`                                                                     | ✅      | Соответствует |

Особенности реализации:
- EventDelivery — выбор между webhook и gateway (подготовка для Stage 2)
- WebhookURL — хранится на уровне installation (гибкость)
- GrantedScopes и GrantedPermissions — JSONB снимок на момент установки
- BotUserID — связь с системным пользователем-ботом
- Уникальный индекс idx_bot_server — один бот = одна установка на сервер

### 2.4 Tokens ✅

| Таблица                 | Модель               | Поля (ключевые)                                                                          | Статус | Сверка с ТЗ   |
| ----------------------- | -------------------- | ---------------------------------------------------------------------------------------- | ------ | ------------- |
| `bot_tokens`            | `BotToken`           | `InstallationID, TokenHash, TokenType, ExpiresAt, ScopesSnapshot, LastIP, LastUserAgent` | ✅      | Соответствует |
| `bot_token_revocations` | `BotTokenRevocation` | `TokenID, JTI, Reason`                                                                   | ✅      | Соответствует |

Особенности реализации:
- Три типа токенов: access, refresh, session (для WS Gateway)
- ScopesSnapshot — JSONB снимок scopes на момент выдачи (важно для безопасности)
- JTI (JWT ID) в revocation для быстрой проверки отозванности без хеширования

### 2.5 Commands 🚧
| Таблица        | Модель       | Поля (ключевые)                                                     | Статус | Сверка с ТЗ          |
| -------------- | ------------ | ------------------------------------------------------------------- | ------ | -------------------- |
| `bot_commands` | `BotCommand` | `BotAppID, Name, Description, OptionsSchema, DefaultRequiredScopes` | ✅      | Модель есть, API нет |

Примечание: OptionsSchema — JSON Schema для параметров команды (Stage 2).

### 2.6 OAuth & Audit ✅
| Таблица           | Модель          | Поля (ключевые)                                                                     | Статус | Сверка с ТЗ   |
| ----------------- | --------------- | ----------------------------------------------------------------------------------- | ------ | ------------- |
| `bot_oauth_codes` | `BotOAuthCode`  | `Code, BotAppID, ServerID, UserID, Scopes, RedirectURI, State, Used, ExpiresAt`     | ✅      | Соответствует |
| `bot_oauth_audit` | `BotOAuthAudit` | `BotAppID, ServerID, UserID, InstallationID, Action, IP, UserAgent, Success, Error` | ✅      | Соответствует |

Особенности реализации:
- State в BotOAuthCode — CSRF protection
- Used + UsedAt — защита от повторного использования кода
- Полный audit trail в BotOAuthAudit (action: authorize, exchange_token, revoke)

### 2.7 Отсутствующие в реализации ❌

| Таблица (из ТЗ)           | Назначение                    | Статус | Комментарий    |
| ------------------------- | ----------------------------- | ------ | -------------- |
| `bot_event_subscriptions` | Подписки на события           | ❌      | Не реализовано |
| `bot_quotas`              | Rate limits (установка)       | ❌      | Не реализовано |
| `bot_rate_limit_counters` | Rate limits (counters, Redis) | ❌      | Не реализовано |

### 2.8 Сводка соответствия ТЗ
| Категория           | В ТЗ          | Реализовано   | Покрытие      |
| ------------------- | ------------- | ------------- | ------------- |
| BotApp + metadata   | 5 таблиц      | 5 таблиц      | 100%          |
| Credentials         | 1 таблица     | 1 таблица     | 100%          |
| Installation        | 2 таблицы     | 2 таблицы     | 100%          |
| Tokens              | 2 таблицы     | 2 таблицы     | 100%          |
| Commands            | 1 таблица     | 1 таблица     | 100% (модель) |
| OAuth + Audit       | 2 таблицы     | 2 таблицы     | 100%          |
| Event Subscriptions | 1 таблица     | 0             | 0%            |
| Rate Limits         | 2 таблицы     | 0             | 0%            |
| **Итого**           | **16 таблиц** | **13 таблиц** | **81%**       |

Вывод: Все критичные для MVP таблицы реализованы. Отсутствуют только Stage 2+ (events, rate limits).

## 3. Scopes vs Permissions

### 3.1 Текущая ситуация ⚠️
Проблема: Сейчас в Dev Portal отсутствует API для получения списка доступных привилегий в контексте сервера. Выбор возможностей бота жёстко зашит в клиенте как константный массив.

Где это в коде:

```Typescript
// frontend/src/constants/scopes.ts (или аналог)
export const AVAILABLE_SCOPES = [
  'bot',
  'messages:read',
  'messages:write',
  'members:read',
  'rooms:read',
  'server:manage'
]
```

Последствия:
- Нет динамической проверки "может ли бот запросить эту привилегию на этом сервере"
- Нет интеграции с существующей RBAC-системой EchoTalk
- При добавлении новых привилегий в платформу — нужно обновлять клиент вручную

### 3.2 Существующая RBAC-система EchoTalk
В системе действует ролевая модель с 70+ привилегиями:

**Global scope:**
- global.login,
- global.profile.*,
- global.friends.*,
- global.dm.*
- global.server.create,
- global.serverDirectory.browse

**Server scope:**
- server.view,
- server.members.* (view/kick/ban/timeout)
- server.name.edit,
- server.description.*,
- server.banner.set,
- server.avatar.set
- server.roles.manage,
- server.audit.view,
- server.invites.*
- server.category.* (create/rename/update_icon/update_colors/delete)
- server.manageRooms,
- server.export.import,
- server.archive,
- server.roles.view

**Room scope:**
- server.room.create.* (фактически серверная привилегия),
- server.room.delete.* (фактически серверная привилегия),
- server.room.move
- room.edit.name,
- room.edit.type
- room.view,
- room.members.view
- room.voice.connect,
- room.voice.members.view,
- room.voice.speak,
- room.voice.stream.*
- room.voice.muteMembers,
- room.voice.kickMembers
- room.sendMessage,
- room.reply,
- room.copy,
- room.editOwnMessage,
- room.editOthersMessages
- room.deleteOwnMessages,
- room.deleteOthersMessages,
- room.addReactions
- room.pinMessages,
- room.unpinMessages,
- room.viewReadReceipts,
- room.background.edit

### 3.3 Platform Scopes (Dev Portal) — текущая заглушка
| Scope            | Статус         | Маппинг на RBAC                                   | Примечание               |
| ---------------- | -------------- | ------------------------------------------------- | ------------------------ |
| `bot`            | ✅ Обязательный | —                                                 | Базовый scope            |
| `messages:read`  | 🚧 Заглушка    | `room.view` + `room.sendMessage` (чтение истории) | Нет точного соответствия |
| `messages:write` | 🚧 Заглушка    | `room.sendMessage`                                | Частично соответствует   |
| `members:read`   | 🚧 Заглушка    | `server.members.view` + `room.members.view`       | Частично соответствует   |
| `rooms:read`     | 🚧 Заглушка    | `room.view`                                       | Частично соответствует   |
| `server:manage`  | 🚧 Заглушка    | `server.*` (все server-scope)                     | Слишком широко           |

Проблемы маппинга:
- messages:read в Discord-like системе ≠ room.view в EchoTalk (нужно разделение "видеть канал" vs "читать историю")
- Нет scopes для: files, calls, reactions, pins, moderation
- server:manage даёт слишком много прав — нужна гранулярность

### 3.4 Требуемая интеграция (TODO)
Нужен API:

```json
GET /dev/bots/available-scopes
Authorization: <user_token>

Response:

{
  "scopes": [
    {
      "name": "messages:read",
      "description": "Читать сообщения в разрешённых комнатах",
      "requires_privileges": ["room.view"],
      "category": "messaging"
    },
    {
      "name": "messages:write",
      "description": "Отправлять сообщения",
      "requires_privileges": ["room.sendMessage"],
      "category": "messaging"
    }
  ]
}
```

```json
POST /oauth/authorize
{
  "bot_id": "123",
  "server_id": 456,
  "scopes": ["messages:read", "messages:write"]
}

// Backend проверяет:
// 1. Есть ли у пользователя права назначать эти privileges боту?
// 2. Может ли бот запросить эти scopes (AllowedScopes в BotApp)?
// 3. Создаёт BotInstallation с GrantedScopes + GrantedPermissions (снимок privileges)
```
### 3.5 Рекомендации по интеграции

Краткосрочно (MVP):
- Оставить текущие 6 scopes как заглушку
- Добавить простой маппинг на checkout:
  - messages:write → проверить room.sendMessage у installing user
  - rooms:read → проверить room.view

Среднесрочно (Stage 2):
- Создать полный маппинг Platform Scopes ↔ RBAC Privileges
- API /dev/bots/available-scopes с динамическим списком
- Granular permissions: messages:read:history, messages:read:live, files:attach, etc.

Долгосрочно (Stage 3):
- Room-level overrides для ботов (как у пользователей)
- Category-level permissions
- Channel-specific grants

## 4. Основные Flow (по ТЗ)

### 4.1 Создание бота ✅

>Пользователь → "Создать Bot App" → bot_app_id → генерация credentials (client_secret или key pair) → настройка redirect_uris, allowed scopes, intents, команды

| Шаг                      | Статус                                                              |
| ------------------------ | ------------------------------------------------------------------- |
| Создание Bot App         | ✅                                                                   |
| Генерация credentials    | ✅                                                                   |
| Настройка redirect\_uris | ✅                                                                   |
| Allowed scopes           | ⚠️ **Заглушка на клиенте** — нет API получения доступных привилегий |
| Intents                  | ❌ Не реализовано                                                    |
| Команды                  | ❌ Нет API                                                           |

Сверка: Intents не реализованы (не было в MVP). Scopes — заглушка.

### 4.2 Установка на сервер ✅
> OAuth authorization code flow → выбор сервера, роли бота, ограничений → Auth Service выдаёт code → Backend обмен на токены, создание bot_installation, installation secrets, bot_user

| Шаг                           | Статус                                                 |
| ----------------------------- | ------------------------------------------------------ |
| OAuth authorization code flow | ✅                                                      |
| Выбор сервера                 | ✅                                                      |
| Роли бота                     | ❌ Не реализовано                                       |
| Ограничения (scopes)          | ⚠️ **Заглушка** — выбор из констант, без проверки RBAC |
| Выдача code                   | ✅                                                      |
| Обмен на токены               | ✅                                                      |
| Создание installation         | ✅                                                      |
| Installation secrets          | ✅                                                      |
| Bot user                      | ⚠️ Создаётся, но не интегрирован в ACL                 |

Сверка: Роли бота не реализованы (Stage 2). Scopes — без интеграции с RBAC.

### 4.3 Подключение событий ❌

> Выбор delivery (webhook endpoint или gateway WS) → для webhook: webhook_secret + endpoint health check (challenge) → для WS: подключение по access token, session_id, heartbeat/ping-pong

| Шаг                      | Статус |
| ------------------------ | ------ |
| Выбор delivery           | ❌      |
| Webhook secret           | ❌      |
| Health check (challenge) | ❌      |
| WS подключение           | ❌      |
| Heartbeat/ping-pong      | ❌      |

Сверка: Не реализовано.

### 4.4 Вызов API ботом ❌
> POST /bot/messages.send → Gateway валидирует токен, извлекает installation_id, проверяет scope messages:write, проверяет permission на room_id → пишет в БД/шину событий → возвращает response + request_id

| Шаг                         | Статус |
| --------------------------- | ------ |
| Endpoint /bot/messages.send | ❌      |
| Валидация токена            | ❌      |
| Извлечение installation\_id | ❌      |
| Проверка scope              | ❌      |
| Проверка permission         | ❌      |
| Запись в БД                 | ❌      |
| Request ID                  | ❌      |

Сверка: Не реализовано. Критичный блокер.

### 4.5 Ротация и отзыв ✅
> "Отключить бота" → installation.status=revoked, revoke всех токенов, WS disconnect, webhooks disabled

| Шаг                     | Статус             |
| ----------------------- | ------------------ |
| Отключение бота         | ✅                  |
| Смена status на revoked | ✅                  |
| Revoke токенов          | ✅                  |
| WS disconnect           | N/A (нет WS)       |
| Webhooks disabled       | N/A (нет webhooks) |

Сверка: Реализовано для существующей функциональности.

## 5. Безопасность

| Требование                             | ТЗ | Статус | Примечание                                 |
| -------------------------------------- | -- | ------ | ------------------------------------------ |
| Access token 5-15 мин                  | ✅  | ⚠️     | Поле `expires_at` есть, проверка не везде  |
| Refresh token 7-30 дней                | ✅  | ✅      |                                            |
| Rotation refresh token                 | ✅  | 🚧     | Заглушка                                   |
| WS session token                       | ✅  | ❌      | Нет                                        |
| SHA-256 подпись webhook                | ✅  | ❌      | Нет                                        |
| Timestamp header ±5 мин                | ✅  | ❌      | Нет                                        |
| Idempotency (nonce/request\_id)        | ✅  | ❌      | Нет                                        |
| Retry с event\_id                      | ✅  | ❌      | Нет                                        |
| Bot user в ACL                         | ✅  | ⚠️     | Поле есть, интеграции нет                  |
| Audit log (кто, что, где, request\_id) | ✅  | ⚠️     | `bot_oauth_audit` есть, не полное покрытие |


## 6. План реализации — актуальный статус

#### Stage 1: MVP (2-4 недели) — Частично ✅

| Задача                                             | ТЗ | Статус | % Готовности                     |
| -------------------------------------------------- | -- | ------ | -------------------------------- |
| BotApp + credentials                               | ✅  | ✅      | 100%                             |
| Установка на сервер (UI авторизации + вызов API)   | ✅  | ⚠️     | 80% — scopes без RBAC интеграции |
| Bot API (чтение сообщений, инфо о сервере/комнате) | ✅  | ❌      | 0%                               |
| Webhook/WS доставка событий                        | ✅  | ❌      | 0%                               |
| Audit log + лимиты очереди доставки                | ✅  | ⚠️     | 50%                              |

Итого Stage 1: ~50% (без Bot API нельзя считать завершённым)

#### Stage 2: Permissions/roles полноценные ❌

| Задача                               | ТЗ | Статус |
| ------------------------------------ | -- | ------ |
| Роль бота в сервере + room overrides | ✅  | ❌      |
| Scopes + permissions проверка        | ✅  | ❌      |
| Расширение API                       | ✅  | ❌      |
| Команды: кнопки/модалки/follow-up    | ✅  | ❌      |

#### Stage 3: Надёжность, масштаб ❌
| Задача                   | ТЗ | Статус |
| ------------------------ | -- | ------ |
| Шина данных              | ✅  | ❌      |
| Метрики/алерты/аналитика | ✅  | ❌      |

#### Stage 4: "Фабрика"/маркетплейс 📝
| Задача                  | ТЗ | Статус | Примечание           |
| ----------------------- | -- | ------ | -------------------- |
| Публичный каталог ботов | ✅  | ✅      | Сделано раньше срока |
| Версии/релизы/модерация | ✅  | ❌      |                      |
| Billing/tiers/лимиты    | ✅  | ❌      |                      |
| Hosted runtime          | ✅  | ❌      |                      |


## 7. Минимальный набор API — проверка

#### Dev Portal API

| Endpoint            | Метод ТЗ | Метод реал | Статус |
| ------------------- | -------- | ---------- | ------ |
| Создать бота        | —        | POST       | ✅      |
| Ротация credentials | POST     | POST       | ✅      |
| Список команд       | POST     | ❌          | ❌      |
| Список установок    | GET      | GET        | ✅      |
| Метрики             | GET      | ❌          | ❌      |

#### Install/Auth
| Endpoint             | Метод ТЗ | Метод реал | Статус              |
| -------------------- | -------- | ---------- | ------------------- |
| Авторизация          | GET      | POST       | ⚠️ Метод отличается |
| Токен                | POST     | POST       | ✅                   |
| Установка (internal) | POST     | —          | ✅ Через OAuth       |
| Отзыв                | DELETE   | DELETE     | ✅                   |

#### Bot API ❌ НЕТ

| Endpoint                             | ТЗ | Статус |
| ------------------------------------ | -- | ------ |
| GET /bot/servers/{server\_id}        | ✅  | ❌      |
| GET /bot/rooms?server\_id=...        | ✅  | ❌      |
| POST /bot/messages (send)            | ✅  | ❌      |
| POST /bot/interactions/{id}/ack      | ✅  | ❌      |
| POST /bot/interactions/{id}/followup | ✅  | ❌      |


#### Events ❌ НЕТ
| Endpoint                   | ТЗ | Статус |
| -------------------------- | -- | ------ |
| POST /bot/webhook/verify   | ✅  | ❌      |
| POST /bot/events/subscribe | ✅  | ❌      |

## 8. Что можно делать прямо сейчас

✅ Работает:
- Как разработчик:
  - Создать Bot App в Dev Portal
  - Настроить scopes (ограниченный константный набор)
  - Получить client_id / client_secret
  - Опубликовать бота в каталог
  - Просмотреть статистику установок
- Как админ сервера:
  - Найти бота в каталоге
  - Установить бота через OAuth flow
  - Выбрать scopes при установке (без проверки RBAC)
  - Отозвать бота
- Как бот:
  - Получить access_token и refresh_token
  - Дальше — ничего (нет API для действий)

❌ Не работает (блокеры):

| Блокер                       | Влияние                                           |
| ---------------------------- | ------------------------------------------------- |
| Нет Bot Runtime API          | Бот не может отправить сообщение                  |
| Нет интеграции scopes с RBAC | Нет проверки "может ли админ дать боту эти права" |
| Нет Event Delivery           | Бот не реагирует на события                       |
| Нет permissions проверки     | Нет безопасности на уровне комнат                 |
| Нет refresh rotation         | Токены протухают безвозвратно                     |

## 9. Рекомендации по приоритетам
#### P0 (блокер для MVP):
1. Bot Runtime API — минимум 4 endpoint'а:
  - GET /bot/me — инфо о боте
  - GET /bot/servers/:id — проверка доступа
  - GET /bot/servers/:id/rooms — список комнат
  - POST /bot/rooms/:id/messages — отправка сообщений
2. BotAuthMiddleware — полная реализация валидации
3. Интеграция scopes с RBAC — API /dev/bots/available-scopes + проверка при установке

#### P1 (важно):
1. Refresh token rotation — /oauth/token/refresh
2. Permissions проверка — интеграция с room overrides
3. Event Subscriptions API — настройка webhooks

#### P2 (Stage 2):
1. Slash commands
2. Interactions (кнопки, модалки)
3. Роли бота в сервере

# Вывод
- Соответствие ТЗ: ~35%
- Критические отклонения:
- Bot API полностью отсутствует (в ТЗ — обязательно для MVP)
- Scopes — заглушка без интеграции с RBAC (неявный блокер)
- Event Delivery не реализован (в ТЗ — обязательно для MVP)
- Permissions проверка не реализована (в ТЗ — обязательно для безопасности)

#### Что работает лучше ТЗ:
- Публичный каталог (реализован раньше Stage 4)
- UI/UX Dev Portal (не описан детально в ТЗ, но реализован полноценно)
- Следующий шаг: Реализация Bot Runtime API + интеграция scopes с RBAC-системой.

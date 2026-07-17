# EchoTalk Bot Developer Portal — Статус реализации

**Дата обновления:** 2026-07-17  
**Версия ТЗ:** Bot Developer Portal.pdf (февраль 2026)  
**Текущий релиз:** release 0.22.0  
**Текущий рабочий статус:** после P3.9.8.1 Bot Video Publish Capability

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

- **P0 закрыт.**
- **P1.1 закрыт.**
- **P1.1.1 закрыт.**
- **P1.2 закрыт.**
- **P2.1 WebSocket Gateway runtime закрыт базово.**
- **P2.2 Interactions + Expanded Bot Runtime закрыт на production-MVP уровне.**
- **P2.3 Gateway reliability hardening закрыт.**
- **P2.4 Runtime protection: rate limiting, abuse protection закрыт на production-MVP уровне.**
- **P3.1 Moderation Runtime закрыт на production-MVP уровне.**
- **P3.2 Roles Runtime закрыт на production-MVP уровне.**
- **P3.3 Room Permissions & Overrides Runtime закрыт на production-MVP уровне.**
- **P3.4 Room / Category Structure Runtime закрыт на production-MVP уровне.**
- **P3.5 Server Events Runtime закрыт на production-MVP уровне.**
- **P3.6 Invite & Server Lifecycle Events закрыт на production-MVP уровне.**
- **P3.7 Event Replay API + Dev Portal Event Replay UI закрыт на production-MVP уровне.**
- **P3.8.1 Resource Core Completion закрыт.**
- **P3.8.2 Message Resource API Core закрыт.**
- **P3.8.3 User / Member Context API Core закрыт.**
- **P3.8.4 Room / Category Context API закрыт.**
- **P3.8.5 Roles / Permissions API закрыт.**
- **P3.8.6 Invite Resource API закрыт.**
- **P3.8.7 Audit / Moderation Context API закрыт.**
- **P3.8.8 Event Context API закрыт.**
- **P3.8.9 Search API отложен.**
- **P3.8.10 Batch Resource API закрыт.**
- **P3.8.11 Resource API Hardening & Contract Stabilization закрыт.**
- **P3.9.1 Create Bot Media Session закрыт на production-MVP уровне.**
- **P3.9.1.1 Bot Voice Lobby Integration + Moderator Kick закрыт и end-to-end проверен.**
- **P3.9.1.2 / P3.9.1.3 Voice Media Session Hardening & Refactoring закрыты.**
- **P3.9.2 Listen Runtime Core закрыт на production-MVP уровне.**
- **P3.9.2.1 Voice Media Session Public DTO Contract закрыт.**
- **P3.9.3 Transcription Runtime / Meeting Notes закрыт на production-MVP уровне.**
- **P3.9.4 Speak / Publish Audio Runtime закрыт и end-to-end проверен.**
- **P3.9.5.1 Voice Media Session Audit + Admin UI закрыт.**
- **P3.9.5.2 Bots Policy for Voice Rooms закрыт.**
- **P3.9.5.3 Policy Change Active Session Enforcement закрыт.**
- **P3.9.6 Voice / Media Admin Diagnostics & Runtime Observability закрыт.**
- **P3.9.7.1 Bot Media Track State закрыт.**
- **P3.9.7.2 Bot Speak Control via Track Mute / Unmute закрыт и проверен.**
- **P3.9.7.2.1 Voice Track Control Hardening остаётся cleanup/test этапом, но не блокирует video runtime.**
- **P3.9.7.3 Speak Runtime Limits закрыт на production-MVP уровне.**
- **P3.9.7.3.1 Media Limits Post-check on Track Published закрыт и проверен.**
- **P3.9.7.3.2 Speak Duration Observe-only Counters закрыт и проверен.**
- **P3.9.7.3.3 Обновление статусной документации закрыто.**
- **P3.9.8.1 Bot Video Publish Capability закрыт и end-to-end проверен.**

➡️ **Текущий этап: P3.9 Voice / Media Bot Runtime API. Audio runtime стабилизирован, а P3.9.8.1 Bot Video Publish Capability завершён и подтверждён end-to-end. Следующий инженерный шаг — P3.9.8.2 Bot Screen Share Publish Capability.**

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
- `message.reaction.added` доставляется
- `message.reaction.removed` доставляется
- `message.pinned` доставляется
- `message.unpinned` доставляется

- `server.member.joined` доставляется
- `server.member.left` доставляется

- `room.member.joined` доставляется
- `room.member.left` доставляется

- `server.role.created` доставляется
- `server.role.updated` доставляется
- `server.role.deleted` доставляется
- `server.role.assigned` доставляется
- `server.role.unassigned` доставляется

- `server.member.banned` доставляется
- `server.member.unbanned` доставляется
- `server.member.kicked` доставляется
- `server.member.timed_out` доставляется
- `server.member.timeout_removed` доставляется

- `server.room.created` доставляется
- `server.room.updated` доставляется
- `server.room.deleted` доставляется
- `server.room.moved` доставляется

- `server.category.created` доставляется
- `server.category.updated` доставляется
- `server.category.deleted` доставляется

- `server.room_overrides.updated` доставляется
- `server.updated` доставляется
- `server.invite.created` доставляется
- `server.invite.revoked` доставляется
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
- `/bot/events`
- `/dev/installations/:installationID/events`

### Bot Context / Resource Runtime API
- direct lookup: member / room / message / message context
- permissions check и batch-check
- message reactions / replies / pin-state / pins / search / by-date
- member profile / activity / compact context
- category / room context / room activity / server structure / room stats
- room effective overrides
- role detail / role members
- invite list/detail/uses/join-source
- audit logs / member audit logs / moderation-state
- event detail / event context
- batch resource resolve / partial item errors

### Resource API Hardening / Contract Stabilization
- unified bot error contract: `error.code/message/details/trace_id`
- request trace middleware и `X-Request-ID`
- error code constants и normalization smoke-check
- Scope / Boundary Matrix: `docs/bot_resource_api_matrix.md`
- Safe DTO audit tests и denylist для приватных полей
- recursive audit meta sanitization
- table-driven contract tests для Batch / Message / Event contracts
- minimal OpenAPI draft: `docs/openapi/bot-resource-api.yaml`
- OpenAPI lint проверен

### Voice / Media Bot Runtime API
- LiveKit self-hosted используется как media runtime для bot voice sessions
- `POST /bot/voice/rooms/:roomID/media-sessions` создаёт bot media session и выдаёт LiveKit join token
- media session создаётся со статусом `pending`, после LiveKit webhook становится `active`
- LiveKit participant identity для бота: `bot:<installation_id>:<media_session_id>`
- LiveKit token содержит безопасную metadata: `userID`, `nickname`, `avatar`, `isBot`, `mediaSessionID`, `installationID`, `botAppID`
- bot user добавляется как server participant при установке/переустановке, чтобы платформа могла отображать и модерировать бота как участника сервера
- frontend VoiceLobby нормализует LiveKit participant в `Tile` с `userId`, `isBot`, `mediaSessionId`, `label`, `livekitIdentity`
- moderator kick из voice lobby для bot participant end-to-end проверен
- при moderator kick backend переводит session в `revoked` с `end_reason=moderator_kick`
- LiveKit participant disconnect после moderator kick проверен
- повторный voluntary bot disconnect после revoke корректно отклоняется как `media_session_not_disconnectable`
- `voice.participant.joined` и `voice.participant.left` доставляются через Gateway с LiveKit room и participant DTO
- `participant.is_bot` и `actor_type=bot` подготовлены для корректного voice event contract
- Voice Media Session Public DTO Contract стабилизирован: bot-facing ответы не раскрывают raw DB/LiveKit internals
- Listen Runtime Core реализован: bot runtime умеет подключаться к LiveKit и получать audio frames/track stream; STT остаётся ответственностью bot developer / transcription layer
- Transcription Runtime / Meeting Notes реализован как runtime слой для voice transcript / notes сценариев
- Speak / Publish Audio Runtime реализован и проверен: bot может публиковать audio track в voice room, звук слышен участникам комнаты
- Voice Media Session Audit реализован: session lifecycle, disconnect/revoke/policy decisions отражаются в audit/runtime событиях
- Admin UI для voice media session audit / diagnostics добавлен
- Bots Policy for Voice Rooms реализован: room-level policy определяет возможность присутствия/подключения ботов в голосовые комнаты
- Policy Change Active Session Enforcement реализован: изменение политики применяется к активным bot media sessions
- Voice / Media Admin Diagnostics & Runtime Observability реализованы: backend/admin слой показывает состояние sessions/tracks/policy/runtime событий
- Bot Media Track State реализован: опубликованные bot tracks сохраняются в `bot_media_tracks`, включая `track_s_id`, `track_name`, `track_type`, `track_source`, `muted`, `status`, timestamps
- Bot Speak Control via Track Mute / Unmute реализован: LiveKit `MutePublishedTrack` используется для mute/unmute user/bot audio tracks
- для bot tracks состояние `bot_media_tracks.muted` синхронизируется с успешным LiveKit mute/unmute
- для обычных пользователей `bot_media_tracks` не используется, mute/unmute работает только через LiveKit state
- frontend VoiceLobby корректно отражает mic state по LiveKit publications и `participantInfo.tracks`, включая начальное состояние при подключении пользователя/бота
- `track_sid` optional: если клиент передал track SID, backend проверяет принадлежность track участнику; если не передал — backend ищет первый track нужного media-типа
- `room_name` из клиента считается deprecated/backward-compatible полем и не должен использоваться как source of truth
- Speak Runtime Limits реализованы: enforced active limits для speaking bots/tracks, post-check после `track_published`, observe-only duration counters и runtime limit audit
- `max_active_speaking_bots_per_room` ограничивает количество разных bot installations, публикующих audio в одной voice room
- `max_active_tracks_per_bot` ограничивает количество активных published tracks одной installation
- `max_speak_session_duration_sec` и `max_daily_speak_duration_sec` работают в `observe_only` режиме: фиксируют превышение, но не отключают бота
- `bot_media_usage_daily` агрегирует daily publish usage по installation/date: audio/video/screen duration и количество опубликованных tracks
- `usage_accumulated_at` в `bot_media_tracks` защищает duration accounting от двойного начисления при `track_unpublished`, `participant_left` и `room_finished`
- `media_auto_revoke_on_limit` заложен как policy flag, но auto revoke намеренно выключен до отдельного runtime enforcement worker
- Bot Video Publish Capability реализован: intent `video_publish` создаёт publish-only media session без audio/video subscribe
- LiveKit join token ограничивает публикацию video session источником `CAMERA` через `CanPublishSources`; `SCREEN_SHARE` не выдаётся
- для video publish переиспользуются scope `voice.speak`, room policy `allow_speak`, installation/server/room boundary и media runtime limits
- тестовая команда `/videopublish` публикует synthetic video test-pattern через `@livekit/rtc-node`
- video publish end-to-end проверен на параметрах 640x360, 10 FPS, 60 секунд: пользователь видел video track как camera stream
- Gateway доставляет `voice.track.published` и `voice.track.unpublished` с `type=VIDEO`, `source=CAMERA`
- `bot_media_tracks` фиксирует lifecycle video track и usage accumulation; проверено финальное состояние `unpublished`
- `bot_media_usage_daily` корректно увеличивает `video_publish_duration_sec` и `published_video_tracks`, не затрагивая audio/screen counters


### Moderation Runtime
- `/bot/servers/:serverID/bans`
- `POST /bot/servers/:serverID/bans`
- `DELETE /bot/servers/:serverID/bans/:userID`
- `POST /bot/servers/:serverID/members/:userID/kick`
- `POST /bot/servers/:serverID/members/:userID/timeout`

### Roles Runtime
- `/bot/servers/:serverID/roles`
- `POST /bot/servers/:serverID/roles`
- `PATCH /bot/servers/:serverID/roles/:roleID`
- `DELETE /bot/servers/:serverID/roles/:roleID`
- `POST /bot/servers/:serverID/roles/:roleID/assign/:userID`
- `DELETE /bot/servers/:serverID/roles/:roleID/assign/:userID`

### Room Overrides Runtime
- `GET /bot/rooms/:roomID/overrides`
- `PUT /bot/rooms/:roomID/overrides`

### Room / Category Structure Runtime
- `GET /bot/servers/:serverID/categories`
- `POST /bot/servers/:serverID/categories`
- `PATCH /bot/categories/:categoryID`
- `DELETE /bot/categories/:categoryID`

- `POST /bot/servers/:serverID/rooms`
- `PATCH /bot/rooms/:roomID`
- `DELETE /bot/rooms/:roomID`
- `POST /bot/rooms/:roomID/move-to-category`

### Server Events Runtime

Поддерживаются runtime события:

#### Message Events

- message.created
- message.updated
- message.deleted
- message.reaction.added
- message.reaction.removed
- message.pinned
- message.unpinned

#### Membership Events

- server.member.joined
- server.member.left

#### Room Activity Events

- room.member.joined
- room.member.left

#### Moderation Events

- server.member.banned
- server.member.unbanned
- server.member.kicked
- server.member.timed_out
- server.member.timeout_removed

#### Roles Events

- server.role.created
- server.role.updated
- server.role.deleted
- server.role.assigned
- server.role.unassigned

#### Structure Events

- server.room.created
- server.room.updated
- server.room.deleted
- server.room.moved

- server.category.created
- server.category.updated
- server.category.deleted

#### Permissions Events

- server.room_overrides.updated

### Invite & Server Lifecycle Events

Поддерживаются события:

- server.updated
- server.invite.created
- server.invite.revoked

Назначение:

- отслеживание изменений сервера
- отслеживание создания invite-ссылок
- отслеживание отзыва invite-ссылок
- поддержка invite tracker / audit / moderation bot сценариев

➡️ **Текущий этап: P3.9 Voice / Media Bot Runtime API. Runtime уже включает audio listen/speak, transcription, audit, policy, diagnostics, track-state, mute/unmute, limits и подтверждённый video publish через `VIDEO/CAMERA`; следующий шаг — P3.9.8.2 Bot Screen Share Publish Capability.**


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
| Gateway status UI | ✅ | реализовано |
| Runtime Protection UI | ✅ | лимиты, burst, violations, auto-block |
| Event Replay UI | ✅ | просмотр сохранённых Gateway events по installation |
| Event subscriptions search UI | ✅ | поиск событий подписки в Dev Portal |
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

| Компонент | Статус | Примечание                              |
|-----------|--------|-----------------------------------------|
| `BotAuthMiddleware` | ✅ | access/session token validation         |
| Installation context | ✅ | installation/bot/server scopes доступны |
| Snapshot scopes | ✅ | granted scopes                          |
| Granted permissions | ✅ | базовая проверка                        |
| `GET /bot/me` | ✅ | проверено                               |
| `GET /bot/servers/:serverID` | ✅ | проверено                               |
| `GET /bot/servers/:serverID/rooms` | ✅ | проверено                               |
| `GET /bot/rooms/:roomID/messages` | ✅ | проверено                               |
| `POST /bot/rooms/:roomID/messages` | ✅ | проверено                               |
| `PATCH /bot/messages/:messageID` | ✅ | own bot messages only                   |
| `DELETE /bot/messages/:messageID` | ✅ | own bot messages only                   |
| `GET /bot/servers/:serverID/members` | ✅ | persistent members из БД                |
| `GET /bot/rooms/:roomID/members` | ✅ | live members из socket state            |
| Rate limiting | ✅ | проверено|
| Quotas | 🚧 | planned                                 |
| Moderation Runtime API | ✅ | bans / kick / timeout |
| Roles Runtime API | ✅ | CRUD + assign/unassign |
| Room Overrides Runtime API | ✅ | allow/deny overrides |
| Room Structure Runtime API | ✅ | create/update/delete/move |
| Category Structure Runtime API | ✅ | create/update/delete |


### 2.4 Event Gateway ✅

| Компонент | Статус | Примечание |
|-----------|--------|-----------|
| Webhook endpoint configuration | ✅ | `/dev/installations/:id/webhook` |
| Subscribed events | ✅ | `subscribed_events` |
| Available runtime events API | ✅ | backend-driven catalog |
| Runtime event scopes validation | ✅ | event ↔ scope policy |
| Event subscription UI | ✅ | Dev Portal использует backend catalog |
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
| Duplicate protection | ✅ | |
| Reconnect replacement | ✅ | |
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
| AvailableEvents | backend event catalog | ✅ |

Правила:

- `RuntimeEnabled = false` → события не доставляются
- `RuntimeEnabled = true` → используется выбранный transport
- `EventDelivery = webhook` → HTTP POST
- `EventDelivery = websocket` → Gateway delivery
- одновременно активен только один transport

### Event Replay API

Реализовано:

- `GET /bot/events`
- `GET /dev/installations/:installationID/events`
- replay по `after_seq`
- limit protection
- чтение из `bot_gateway_events`
- server/installation boundary
- Dev Portal UI для ручного просмотра событий
- красивые карточки событий
- поиск и прокрутка event subscriptions в Dev Portal

Назначение:

- восстановление состояния bot client после downtime
- ручная диагностика событий разработчиком
- отладка webhook / gateway сценариев
- база для будущего Bot SDK replay helper

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
&bots.BotMediaSession{},
&bots.BotMediaTrack{},
&bots.BotMediaUsageDaily{},
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

### P2.4 runtime protection models

- `BotRuntimeLimit`
  - runtime protection configuration
  - requests/messages/interactions/gateway limits
  - burst protection
  - violation tracking
  - auto-block state
  - media runtime limits: active speaking bots per room, active tracks per bot
  - duration limit modes: `disabled`, `observe_only`, `enforced`
  - speak session / daily speak duration thresholds
  - `media_auto_revoke_on_limit` заложен, но выключен для текущего observe-only этапа

- `BotRuntimeAuditEvent`
  - runtime protection audit trail
  - rate limit violations
  - auto-block events
  - adaptive penalty escalation

### P3.9 voice / media runtime models

- `BotMediaSession`
  - lifecycle bot media session для LiveKit voice room
  - `session_id` публичный bot-facing идентификатор формата `bms_*`
  - `installation_id`, `server_id`, `room_id`, `bot_id` фиксируют boundary
  - `livekit_room` и `participant_identity` связывают EchoTalk session с LiveKit participant
  - statuses: `pending`, `active`, `ended`, `revoked`, `failed`
  - terminal reasons: `bot_disconnect`, `expired`, `moderator_kick`, `policy_violation`, `token_generation_failed`
  - capabilities snapshot: subscribe/publish audio/video
  - `expires_at`, `started_at`, `ended_at` используются для lifecycle control и диагностики

- `BotMediaTrack`
  - runtime state опубликованных bot media tracks
  - связывает `session_id`, `installation_id`, `server_id`, `room_id`, `livekit_room`, `participant_identity`
  - хранит LiveKit track identity: `track_s_id`, `track_name`, `track_type`, `track_source`
  - хранит control state: `muted`, `status`, `published_at`, `unpublished_at`, `updated_at`
  - хранит usage accounting fields: `usage_duration_sec`, `usage_accumulated_at`
  - используется для Bot Speak Control, diagnostics, audit, runtime limits и будущего video/screen runtime
  - обычные user tracks в эту таблицу не пишутся

- `BotMediaUsageDaily`
  - daily aggregate media publish usage по bot installation
  - уникальный ключ: `installation_id + usage_date`
  - хранит `audio_publish_duration_sec`, `video_publish_duration_sec`, `screen_publish_duration_sec`
  - хранит `published_audio_tracks`, `published_video_tracks`, `published_screen_tracks`
  - используется для observe-only duration limits, diagnostics, будущих quotas/billing и video/screen runtime

- `LiveKitWebhookEvent`
  - журнал входящих LiveKit webhook events
  - используется для диагностики runtime lifecycle, track publish/unpublish и idempotency/hardening сценариев

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

GET    /dev/installations/:installationID/runtime-limits
PUT    /dev/installations/:installationID/runtime-limits
GET    /dev/installations/:installationID/runtime-protection/stats

GET    /dev/installations/:installationID/events

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
// Base Info Runtime
GET    /bot/me
GET    /bot/servers/:serverID
GET    /bot/servers/:serverID/rooms
GET    /bot/servers/:serverID/members
GET    /bot/rooms/:roomID/messages
GET    /bot/rooms/:roomID/members

// Message Runtime
POST   /bot/rooms/:roomID/messages
PATCH  /bot/messages/:messageID
DELETE /bot/messages/:messageID

// Interactions Runtime
POST   /bot/interactions/:interactionID/ack
POST   /bot/interactions/:interactionID/callback

// Connections Runtime
POST   /bot/gateway/session
GET    /bot/gateway/ws

// Event Replay Runtime
GET    /bot/events

// Moderation Runtime
GET    /bot/servers/:serverID/bans
POST   /bot/servers/:serverID/bans
DELETE /bot/servers/:serverID/bans/:userID

POST   /bot/servers/:serverID/members/:userID/kick
POST   /bot/servers/:serverID/members/:userID/timeout

// Roles Runtime
GET    /bot/servers/:serverID/roles
POST   /bot/servers/:serverID/roles
PATCH  /bot/servers/:serverID/roles/:roleID
DELETE /bot/servers/:serverID/roles/:roleID

POST   /bot/servers/:serverID/roles/:roleID/assign/:userID
DELETE /bot/servers/:serverID/roles/:roleID/assign/:userID

// Room Overrides Runtime
GET    /bot/rooms/:roomID/overrides
PUT    /bot/rooms/:roomID/overrides

// Room / Category Structure Runtime
GET    /bot/servers/:serverID/categories
POST   /bot/servers/:serverID/categories
PATCH  /bot/categories/:categoryID
DELETE /bot/categories/:categoryID

POST   /bot/servers/:serverID/rooms
PATCH  /bot/rooms/:roomID
DELETE /bot/rooms/:roomID
POST   /bot/rooms/:roomID/move-to-category

// Bot Context / Resource Runtime API — P3.8
GET    /bot/servers/:serverID/members/:userID
GET    /bot/rooms/:roomID
GET    /bot/messages/:messageID
GET    /bot/messages/:messageID/context
GET    /bot/servers/:serverID/members/:userID/permissions
GET    /bot/rooms/:roomID/members/:userID/permissions
GET    /bot/permissions/check
POST   /bot/permissions/batch-check

// Message Resource API
GET    /bot/messages/:messageID/reactions
GET    /bot/messages/:messageID/replies
GET    /bot/messages/:messageID/pin-state
GET    /bot/rooms/:roomID/pins
GET    /bot/rooms/:roomID/messages/search
GET    /bot/rooms/:roomID/messages/by-date

// User / Member Context API
GET    /bot/servers/:serverID/members/:userID/profile
GET    /bot/servers/:serverID/members/:userID/activity
GET    /bot/servers/:serverID/members/:userID/context

// Room / Category Context API
GET    /bot/categories/:categoryID
GET    /bot/categories/:categoryID/rooms
GET    /bot/rooms/:roomID/context
GET    /bot/rooms/:roomID/activity
GET    /bot/servers/:serverID/resources/categories
GET    /bot/servers/:serverID/structure
GET    /bot/rooms/:roomID/overrides/effective
GET    /bot/rooms/:roomID/stats

// Roles / Permissions Resource API
GET    /bot/servers/:serverID/roles/:roleID
GET    /bot/servers/:serverID/roles/:roleID/members

// Invite Resource API
GET    /bot/servers/:serverID/resources/invites
GET    /bot/servers/:serverID/resources/invites/:inviteID
GET    /bot/servers/:serverID/resources/invites/:inviteID/uses
GET    /bot/servers/:serverID/members/:userID/join-source

// Audit / Moderation Context API
GET    /bot/servers/:serverID/audit-logs
GET    /bot/servers/:serverID/audit-logs/:auditID
GET    /bot/servers/:serverID/members/:userID/audit-logs
GET    /bot/servers/:serverID/members/:userID/moderation-state

// Event Context API
GET    /bot/events/:eventID
GET    /bot/events/:eventID/context

// Batch Resource API
POST   /bot/resources/batch-resolve

// Voice / Media Bot Runtime API — P3.9
POST   /bot/voice/rooms/:roomID/media-sessions
GET    /bot/voice/media-sessions/:sessionID
POST   /bot/voice/media-sessions/:sessionID/refresh-token
POST   /bot/voice/media-sessions/:sessionID/disconnect

// User/Admin Voice Track Control
POST   /moderate-voice-participant

// Implemented admin/diagnostics layer
// Voice/media session audit, policy enforcement and runtime observability are implemented in backend/admin UI.
// Exact admin route names are kept in application routing files and should be mirrored in OpenAPI during P3.9.7.2.2.
```

---

## 5. Scopes / Permissions — актуальное состояние

### Актуальные scopes

- `bot`
- `server.view`
- `server.members.view`
- `server.members.kick`
- `server.members.ban`
- `server.members.timeout`
- `server.roles.view`
- `server.roles.manage`
- `server.manageRooms`
- `server.invites.view`
- `server.audit.view`
- `room.view`
- `room.sendMessage`
- `message.content.view`

Важно:

Scopes определяют доступ бота к Runtime API, Resource API и группам событий.

События не являются scopes.

Пример:

- `room.view` → чтение комнат, room/member/message metadata events и room resource APIs
- `message.content.view` → выдача содержимого сообщений и поиск по content
- `server.members.view` → просмотр участников, member context и membership events
- `server.roles.view` → чтение ролей и role resource APIs
- `server.invites.view` → read-only invite resource APIs
- `server.audit.view` → audit logs и moderation context APIs
- `server.roles.manage` → управление ролями через runtime API
- `server.manageRooms` → управление комнатами/категориями и чтение effective overrides

Подписка на событие дополнительно проверяется через event policy.

### Что работает

- frontend получает допустимые scopes с backend
- install flow использует реальные scopes бота
- authorize/token/runtime работают в одной модели строк scopes
- runtime endpoints проверяют scopes и installation server boundary
- Resource API использует safe DTO, server boundary и room visibility checks
- чтение message content вынесено в отдельный scope `message.content.view`
- invite/audit resource endpoints используют отдельные read-only scopes
- resource read operations логируются в audit как `bot.resource.*`
- edit/delete messages разрешены только для own bot messages по `bot_installation_id`
- Voice / Media API проверяет installation/server/room boundary и capabilities через `validateVoiceScopes`
- Voice room bot policy проверяется при создании/поддержании media session
- Active policy changes применяются к уже активным bot media sessions
- Voice track control не доверяет client `room_name`, проверяет room_id, LiveKit participant и track ownership

### Ограничения

- нет event-driven permissions refresh
- нет distributed/global quotas
- нет advanced anomaly detection
- rich presence `current_activities` зарезервирован в API, но источник Activity пока не используется
- invite uses сейчас восстанавливаются из audit logs, отдельной таблицы `invite_uses` нет

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
| Добавление bot user в server participants | ✅ | Нужно для отображения/модерации бота как участника сервера |
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


### 6.7 Moderation Runtime ✅

| Шаг | Статус |
|-----|--------|
| Runtime bans API | ✅ |
| Runtime unban API | ✅ |
| Runtime kick API | ✅ |
| Runtime timeout API | ✅ |
| Scope enforcement | ✅ |
| Audit integration | ✅ |

### 6.8 Roles Runtime ✅

| Шаг | Статус |
|-----|--------|
| Runtime roles list | ✅ |
| Runtime role create | ✅ |
| Runtime role update | ✅ |
| Runtime role delete | ✅ |
| Runtime role assign | ✅ |
| Runtime role unassign | ✅ |
| Scope enforcement | ✅ |
| Audit integration | ✅ |

### 6.9 Room Overrides Runtime ✅

| Шаг | Статус |
|-----|--------|
| Runtime overrides get | ✅ |
| Runtime overrides replace | ✅ |
| Allow/deny sync | ✅ |
| Scope enforcement | ✅ |
| Audit integration | ✅ |

### 6.10 Room / Category Structure Runtime ✅

| Шаг | Статус |
|-----|--------|
| Runtime category create | ✅ |
| Runtime category update | ✅ |
| Runtime category delete | ✅ |
| Runtime room create | ✅ |
| Runtime room update | ✅ |
| Runtime room delete | ✅ |
| Runtime move room | ✅ |
| Realtime structure broadcast | ✅ |
| Audit integration | ✅ |
| Structure services refactor | ✅ |



### 6.11 Bot Context / Resource Runtime API ✅

| Шаг | Статус |
|-----|--------|
| Direct member / room / message lookup | ✅ |
| Message context lookup | ✅ |
| Permission check / batch-check | ✅ |
| Message reactions / replies / pin-state / pins | ✅ |
| Message search / by-date | ✅ |
| Member profile / activity / compact context | ✅ |
| Category lookup / category rooms | ✅ |
| Room context / room activity / room stats | ✅ |
| Server resource categories / server structure | ✅ |
| Room effective overrides | ✅ |
| Role detail / role members | ✅ |
| Invite list / detail / uses / member join-source | ✅ |
| Audit logs / member audit logs / moderation-state | ✅ |
| Event detail / event context | ✅ |
| Safe DTO / no raw DB models | ✅ |
| Runtime audit for resource reads | ✅ |
| Search API | ⏸️ postponed | Глобальный поиск отложен до появления полноценного поиска в ядре системы |
| Batch Resource API | ✅ | `POST /bot/resources/batch-resolve`, partial success, item-level errors |


### 6.12 Voice / Media Bot Runtime API ✅ / 🚧

| Шаг | Статус | Примечание |
|-----|--------|------------|
| LiveKit self-hosted integration для bot runtime | ✅ | `livekitHost`, API key/secret, BotTokenService |
| Create bot media session | ✅ | `POST /bot/voice/rooms/:roomID/media-sessions` |
| LiveKit join token для bot participant | ✅ | identity `bot:<installation_id>:<session_id>` |
| Safe LiveKit metadata для frontend resolve | ✅ | `userID`, `nickname`, `avatar`, `isBot`, `mediaSessionID`, `installationID`, `botAppID` |
| Refresh media session token | ✅ | metadata/profile helper сохранён для reconnect |
| Bot disconnect media session | ✅ | voluntary disconnect: `ended/bot_disconnect` |
| Moderator kick bot from voice room | ✅ | end-to-end проверено: `revoked/moderator_kick` |
| LiveKit webhook participant joined/left | ✅ | session `pending -> active`, `voice.participant.*` events |
| Gateway delivery voice events | ✅ | `voice.participant.joined`, `voice.participant.left` доставлены bot client |
| Public DTO contract | ✅ | `P3.9.2.1`, bot-facing DTO без raw internals |
| Listen Runtime Core | ✅ | bot runtime получает audio frames/track stream; STT вне core listen layer |
| Transcription Runtime / Meeting Notes | ✅ | runtime слой для transcript / notes сценариев |
| Speak / Publish Audio Runtime | ✅ | bot публикует audio track, звук слышен участникам комнаты |
| Voice Media Session Audit | ✅ | audit lifecycle и session actions |
| Admin audit UI | ✅ | admin panel обновлён для voice media session audit |
| Bots Policy for Voice Rooms | ✅ | room-level policy для bot media sessions |
| Policy Change Active Session Enforcement | ✅ | active sessions приводятся к новой policy |
| Admin Diagnostics & Runtime Observability | ✅ | backend/admin diagnostics для sessions/runtime state |
| Bot Media Track State | ✅ | `bot_media_tracks` хранит published/unpublished/muted track state |
| Bot Speak Control via Track Mute / Unmute | ✅ | user/bot mute/unmute через LiveKit `MutePublishedTrack` |
| Bot media track DB sync | ✅ | `bot_media_tracks.muted` обновляется для bot tracks |
| VoiceLobby mic state sync | ✅ | начальное и event-driven состояние Mic/MicOff отражает LiveKit reality |
| Voice Track Control Hardening | ⚠️ | cleanup/test этап остаётся запланированным, но не блокирует video runtime |
| Speak Runtime Limits | ✅ | active limits enforced, post-check, duration observe-only accounting, audit |
| Media Limits Post-check | ✅ | `track_published` запускает actual-state check после записи `bot_media_tracks` |
| Speak Duration Observe-only Counters | ✅ | session/daily duration считаются и пишут audit без revoke |
| Bot Video Publish Capability | ✅ | P3.9.8.1: `video_publish`, LiveKit `VIDEO/CAMERA`, Gateway lifecycle, track state и usage accounting проверены end-to-end |
| Bot Screen Share Publish Runtime | 🚧 | следующий этап P3.9.8.2: publish source `SCREEN_SHARE` с отдельными capability/token/policy checks |


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
| Runtime rate limiting | ✅ | Redis-backed runtime protection |
| Burst protection | ✅ | messages/interactions/session flood |
| Auto-block | ✅ | adaptive penalties |
| Adaptive penalties | ✅ | escalation ladder |
| Runtime audit trail | ✅ | audit events + retention cleanup |
| Prometheus metrics | ✅ | runtime metrics exported |
| Quotas | ⚠️ | daily quotas postponed |
| Idempotency/request_id | ⚠️ | delivery_id есть, строгий runtime idempotency не везде |
| Gateway ACK monotonic protection | ✅ | проверено через старый ACK, seq не откатывается |
| Gateway resume validation | ✅ | replay `seq > last_ack_seq` проверен; invalid resume требуется финально проверить |
| Gateway backlog overflow protection | ✅ | добавлена cleanup policy, нужна long-run проверка |
| Runtime protection middleware | ✅ | all runtime routes protected |
| Redis block cache | ✅ | fast-path blocked installations |
| Structured runtime logs | ✅ | production runtime diagnostics |
| Unified bot error contract | ✅ | `error.code/message/details/trace_id` |
| Request trace ID | ✅ | `RequestTraceMiddleware`, `X-Request-ID` |
| Safe DTO audit | ✅ | denylist tests, no private fields in bot responses |
| Audit meta sanitization | ✅ | recursive sensitive-key removal |
| Resource API contract tests | ✅ | Batch / Message / Event table-driven tests |
| Bot Resource OpenAPI | ✅ | `docs/openapi/bot-resource-api.yaml`, lint OK |
| Voice media session boundary | ✅ | session ограничена `installation_id`, `server_id`, `room_id` |
| Voice room validation | ✅ | media session создаётся только для voice room, room/server boundary проверяется |
| LiveKit token metadata safety | ✅ | в metadata только UI-safe поля, без tokens/secrets/scopes |
| Moderator kick authorization | ✅ | frontend кнопка не является защитой; backend проверяет право кика через socket authorizer |
| Terminal session protection | ✅ | `revoked` не перетирается обычным bot disconnect, повторный disconnect отклоняется |
| Voice media session public DTO contract | ✅ | public DTO стабилизирован, raw internal fields не выдаются bot-facing API |
| Voice room bot policy | ✅ | bots policy for voice rooms + active session enforcement |
| Voice media session audit | ✅ | session lifecycle и control actions фиксируются audit/runtime событиями |
| Bot media track state protection | ✅ | track state хранится только для bot tracks, ordinary user tracks не пишутся в bot tables |
| Voice track control authorization | ✅ | backend проверяет право mute, room boundary, LiveKit participant и track ownership |
| Voice track control DB sync safety | ✅ | sync `bot_media_tracks` не должен ломать успешный LiveKit mute/unmute |
| Media runtime active limits | ✅ | `max_active_speaking_bots_per_room` и `max_active_tracks_per_bot` проверяются pre-create и post-track-published |
| Media runtime duration accounting | ✅ | `max_speak_session_duration_sec` и `max_daily_speak_duration_sec` работают observe-only через `bot_media_usage_daily` |
| Media runtime auto revoke | ⚠️ | flag `media_auto_revoke_on_limit` заложен, но отключён до отдельного enforcement worker |
| Media usage idempotency | ✅ | `usage_accumulated_at` предотвращает двойное начисление usage |
| Video publish least privilege | ✅ | LiveKit grant для `video_publish` ограничен `CanPublishSources=[CAMERA]`; screen share и video subscribe не выдаются |
| Video publish authorization | ✅ | обязательны `voice.connect` + `voice.speak`, room `allow_speak`, server/room boundary и active track limits |

| Frontend LiveKit logs | ⚠️ | полный participant object содержит временный access token в `ws.url`; production logs нужно санитизировать |

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
- видеть runtime protection limits
- видеть violation statistics
- видеть auto-block status
- runtime abuse protection
- adaptive auto-block penalties
- Prometheus runtime metrics
- банить участников
- снимать баны
- кикать участников
- выдавать timeout
- создавать роли
- редактировать роли
- удалять роли
- выдавать роли
- снимать роли
- управлять room overrides
- создавать категории
- изменять категории
- удалять категории
- создавать комнаты
- изменять комнаты
- удалять комнаты
- перемещать комнаты между категориями


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
- получать пачку ресурсов одним batch-запросом через `/bot/resources/batch-resolve`
- создавать bot media session для voice room
- подключаться к LiveKit voice room как bot participant
- получать `voice.participant.joined` / `voice.participant.left` events через Gateway
- получать audio frames / track stream в Listen Runtime
- использовать transcription / meeting notes runtime слой
- публиковать audio track через Speak Runtime
- публиковать camera video track через intent `video_publish` и команду `/videopublish`
- получать `voice.track.published` / `voice.track.unpublished` для `VIDEO/CAMERA` через Gateway
- учитывать video publish duration и количество video tracks в `bot_media_usage_daily`
- быть замьюченным/размьюченным через Track Mute / Unmute control
- видеть синхронизированное состояние `muted` в `bot_media_tracks` для bot tracks
- корректно переживать moderator kick: session становится `revoked/moderator_kick`, LiveKit disconnect приходит bot client
- работать под active speak runtime limits: room-level speaking bots и per-bot active tracks
- попадать в media duration accounting: session duration и daily audio publish duration фиксируются observe-only
- получать audit/runtime visibility по превышениям media limits без принудительного отключения

---

## 9. Что не реализовано / что осталось

### Критично для production

- enforced daily quotas и runtime enforcement worker для длительных media sessions
- distributed/global quotas
- advanced anomaly detection
- ML-based abuse detection

### Следующие возможности

- P3.9.8.2 Bot Screen Share Publish Capability
- P3.9.8.x Screen Share lifecycle/control hardening и diagnostics
- Dev Portal Media Runtime Limits UI для новых media-полей
- Active Media Usage Monitor / Runtime Enforcement Worker для enforced duration quotas и auto revoke
- P3.9.7.2.1 Voice Track Control Hardening: service/use-case cleanup, tests, final audit/error contract
- deferred interaction responses
- autocomplete interactions
- user/role/channel select components
- Dev Portal interaction inspector
- Search API для глобального scoped search — отложен до появления системного поиска
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

### P2.4 — Runtime protection / abuse protection ✅

Закрыто:
- Redis-backed runtime rate limiting
- message/interactions/gateway flood protection
- burst protection
- runtime protection middleware
- violation tracking
- auto-block
- Redis block cache
- adaptive penalties
- runtime audit trail
- audit cleanup worker
- Prometheus metrics
- structured runtime logs
- Dev Portal runtime protection UI
- gateway flood testing
- adaptive penalties testing

Adaptive penalties:
- 1-й autoblock → 10m
- 2-й → 30m
- 3-й → 3h
- 4-й → 6h
- 5-й → 12h
- 6-й+ → 24h


### P3.1 — Moderation Runtime ✅

Закрыто:
- bans runtime
- unban runtime
- kick runtime
- timeout runtime
- audit integration
- runtime scopes
- owner/self moderation protection

### P3.2 — Roles Runtime ✅

Закрыто:
- roles CRUD runtime
- role assignment runtime
- role removal runtime
- runtime RBAC integration
- audit integration

### P3.3 — Room Permissions & Overrides Runtime ✅

Закрыто:
- runtime overrides API
- allow/deny synchronization
- runtime override validation
- audit integration

### P3.4 — Room / Category Structure Runtime ✅

Закрыто:
- room CRUD runtime
- category CRUD runtime
- move room to category
- realtime structure broadcast
- centralized structure services
- audit integration
- runtime scope enforcement

### P3.5 — Server Events Runtime ✅

Закрыто:

#### Message Events

- message.created
- message.updated
- message.deleted
- message.reaction.added
- message.reaction.removed
- message.pinned
- message.unpinned

#### Membership Events

- server.member.joined
- server.member.left

#### Room Activity Events

- room.member.joined
- room.member.left

#### Moderation Events

- server.member.banned
- server.member.unbanned
- server.member.kicked
- server.member.timed_out
- server.member.timeout_removed

#### Roles Events

- server.role.created
- server.role.updated
- server.role.deleted
- server.role.assigned
- server.role.unassigned

#### Structure Events

- server.room.created
- server.room.updated
- server.room.deleted
- server.room.moved

- server.category.created
- server.category.updated
- server.category.deleted

#### Permissions Events

- server.room_overrides.updated

Дополнительно:

- backend event catalog
- event policy validation
- runtime event subscriptions
- webhook delivery support
- websocket gateway delivery support
- actor metadata
- room metadata in room activity events

### P3.6 — Invite & Server Lifecycle Events ✅

Закрыто:

- server.updated
- server.invite.created
- server.invite.revoked
- delivery через webhook
- delivery через websocket gateway
- event catalog integration
- event policy validation
- Dev Portal subscription support

### P3.7 — Event Replay API + Dev Portal Replay UI ✅

### P3.8 — Bot Context / Resource Runtime API ✅

Цель:

Дать ботам безопасный способ получать расширенный контекст по ID из событий без раскрытия raw DB models и приватных полей.

Enterprise requirements:

- strict installation/server boundary
- safe DTO only, no raw DB models
- no email/password/private fields
- room visibility checks
- scopes enforcement
- отдельный scope `message.content.view` для чтения content
- отдельные read-only scopes `server.invites.view` и `server.audit.view`
- runtime audit для resource reads (`bot.resource.*`)
- rate limiting and abuse protection через Runtime Protection middleware
- OpenAPI contract создан: `docs/openapi/bot-resource-api.yaml`
- table-driven backend contract tests добавлены для Batch / Message / Event contracts

#### P3.8.1 — Resource Core Completion ✅

Закрыто и smoke-tested:

- `GET /bot/servers/:serverID/members/:userID`
- `GET /bot/rooms/:roomID`
- `GET /bot/rooms/:roomID/members/:userID`
- `GET /bot/messages/:messageID`
- `GET /bot/messages/:messageID/context`
- `GET /bot/servers/:serverID/members/:userID/permissions`
- `GET /bot/rooms/:roomID/members/:userID/permissions`
- `GET /bot/permissions/check`
- `POST /bot/permissions/batch-check`

Особенности:

- проверка installation boundary
- проверка server boundary
- проверка room visibility
- bot-visible permission whitelist
- batch-check до 50 проверок за запрос
- `message.content.view` управляет выдачей content

#### P3.8.2 — Message Resource API Core ✅

Закрыто и smoke-tested:

- `GET /bot/messages/:messageID/reactions`
- `GET /bot/messages/:messageID/replies`
- `GET /bot/messages/:messageID/pin-state`
- `GET /bot/rooms/:roomID/pins`
- `GET /bot/rooms/:roomID/messages/search`
- `GET /bot/rooms/:roomID/messages/by-date`

Особенности:

- search требует `message.content.view`
- by-date поддерживает `date`, `from/to`, `after_id`, `before_id`, `limit`, `order`
- ответы используют `content_redacted` при отсутствии content scope
- реакции группируются по emoji/code и включают safe user DTO

#### P3.8.3 — User / Member Context API Core ✅

Закрыто и smoke-tested:

- `GET /bot/servers/:serverID/members/:userID/profile`
- `GET /bot/servers/:serverID/members/:userID/activity`
- `GET /bot/servers/:serverID/members/:userID/context`

Особенности:

- `/profile` отдаёт safe member DTO + роли
- `/activity` считает messages/replies/pins/reactions/audit/recent messages
- `/context` намеренно сделан компактным snapshot, без большого audit dump
- `current_activities` зарезервирован в контракте, но rich presence source пока не используется
- audit meta санитизируется перед выдачей ботам

#### P3.8.4 — Room / Category Context API ✅

Закрыто и smoke-tested:

- `GET /bot/categories/:categoryID`
- `GET /bot/categories/:categoryID/rooms`
- `GET /bot/rooms/:roomID/context`
- `GET /bot/rooms/:roomID/activity`
- `GET /bot/servers/:serverID/resources/categories`
- `GET /bot/servers/:serverID/structure`
- `GET /bot/rooms/:roomID/overrides/effective`
- `GET /bot/rooms/:roomID/stats`

Особенности:

- `/structure` отдаёт server + categories + visible rooms + uncategorized
- комнаты в structure фильтруются по `room.view` для bot user
- read-only categories вынесены в `/resources/categories`, чтобы не конфликтовать с Structure Runtime route `/servers/:serverID/categories`
- `overrides/effective` требует `server.manageRooms`
- room activity/stats поддерживают date range

#### P3.8.5 — Roles / Permissions API ✅

Закрыто и smoke-tested:

- `GET /bot/servers/:serverID/roles/:roleID`
- `GET /bot/servers/:serverID/roles/:roleID/members`

Уже было доступно из runtime/resource layers:

- `GET /bot/servers/:serverID/roles`
- `GET /bot/servers/:serverID/members/:userID/roles`
- `GET /bot/permissions/check`
- `POST /bot/permissions/batch-check`
- `GET /bot/servers/:serverID/members/:userID/permissions`
- `GET /bot/rooms/:roomID/members/:userID/permissions`
- `GET /bot/rooms/:roomID/overrides/effective`

Особенности:

- role detail отдаёт роль + permissions
- role members поддерживает `limit/offset`
- server boundary и `role_not_found` проверены smoke-тестами

#### P3.8.6 — Invite Resource API ✅

Закрыто и smoke-tested:

- `GET /bot/servers/:serverID/resources/invites`
- `GET /bot/servers/:serverID/resources/invites/:inviteID`
- `GET /bot/servers/:serverID/resources/invites/:inviteID/uses`
- `GET /bot/servers/:serverID/members/:userID/join-source`

Особенности:

- добавлен read-only scope `server.invites.view`
- поддерживается фильтр `status=all|active|expired|revoked|maxed`
- list использует cursor pagination
- `uses` восстанавливаются из `audit_logs`, так как отдельной таблицы `invite_uses` пока нет
- `join-source` определяет invite/manual/unknown из audit meta (`via`, `method`, `invite_code`, `code`)

#### P3.8.7 — Audit / Moderation Context API ✅

Закрыто и smoke-tested:

- `GET /bot/servers/:serverID/audit-logs`
- `GET /bot/servers/:serverID/audit-logs/:auditID`
- `GET /bot/servers/:serverID/members/:userID/audit-logs`
- `GET /bot/servers/:serverID/members/:userID/moderation-state`

Особенности:

- добавлен read-only scope `server.audit.view`
- audit list поддерживает `from/to`, `limit`, `cursor`, `action`, `target_type`, `actor_id`
- moderation-state собирает active ban/timeout, counters и recent moderation events
- audit meta санитизируется перед выдачей ботам
- в audit feed сейчас видны `bot.resource.*`; позже можно добавить `include_bot_resource_events=false`

#### P3.8.8 — Event Context API ✅

Закрыто и smoke-tested:

- `GET /bot/events/:eventID`
- `GET /bot/events/:eventID/context`

Особенности:

- использует существующий backlog `bot_gateway_events`
- event lookup ограничен текущей installation и `expires_at`
- context извлекает refs из nested payload: server_id, room_id, message_id, actor_user_id, user_id, invite_id, role_id, category_id
- context может собрать server, room, actor, member, message, invite, role, category при наличии соответствующих scopes
- `event_not_found` проверен для неизвестного event_id

#### P3.8.9 — Search API ⏸️ postponed

Статус:

- этап осознанно отложен;
- полноценного глобального поиска в ядре EchoTalk пока нет;
- пилить отдельный Bot Search API без системного search layer сейчас нецелесообразно.

Потенциальный будущий план:

- `GET /bot/search`
- `GET /bot/servers/:serverID/members/search`
- `GET /bot/servers/:serverID/rooms/search`

Уже реализовано в рамках Message Resource API:

- `GET /bot/rooms/:roomID/messages/search`

#### P3.8.10 — Batch Resource API ✅

Закрыто и smoke-tested:

- `POST /bot/resources/batch-resolve`

Поддерживаемые resource types:

- `server`
- `room`
- `category`
- `message`
- `server_member`
- `room_member`
- `role`
- `invite`
- `event`
- `permission_check`

Особенности:

- максимум 50 ресурсов за один batch-запрос;
- partial success: ошибка одного item не валит весь batch;
- item-level errors: каждый элемент возвращает `ok=true/false` и собственный `error.code`;
- strict server boundary для каждого item;
- scope checks для каждого item;
- room visibility / permission checks для room/message resources;
- `message.content.view` управляет выдачей message content;
- `permission_check` переиспользует bot-visible permission whitelist;
- runtime audit фиксирует batch resolve как resource read operation.

Smoke-tested сценарии:

- успешный batch для `server`, `room`, `server_member`, `message`, `role`, `invite`, `permission_check`;
- partial error для несуществующего `message_id`;
- partial error для `unsupported_resource_type`;
- весь batch корректно возвращает `200 OK` при частичных ошибках внутри items.

#### P3.8.11 — Resource API Hardening & Contract Stabilization ✅

Закрыто и проверено:

- unified bot error contract для `/bot/*` ошибок:
  - `error.code`;
  - `error.message`;
  - `error.details`;
  - `error.trace_id`;
- `RequestTraceMiddleware` добавляет request trace ID и возвращает `X-Request-ID`;
- `writeBotError` вынесен в единый helper и переиспользуется bot controllers;
- error code constants добавлены в `controllers/bots/error_codes.go`;
- error code normalization smoke-tested для:
  - `message_not_found`;
  - `server_boundary_violation`;
  - batch item-level errors;
- Scope / Boundary Matrix добавлена в `docs/bot_resource_api_matrix.md`;
- Safe DTO Audit добавлен:
  - denylist test helper для приватных полей;
  - DTO tests для user/member/message/audit/batch responses;
  - recursive audit meta sanitization;
  - nested sensitive fields removal test;
- table-driven contract tests добавлены для:
  - Batch Resource API validation / item errors / JSON contract;
  - Message DTO content included/redacted contract;
  - Event refs extraction / invalid payload safety / event DTO contract;
- `go test ./controllers/bots` проходит;
- `go test ./...` выявил только старые `go vet` замечания в `internal/sockets/roomOperationHandler.go`, не связанные с P3.8.11;
- minimal OpenAPI draft создан: `docs/openapi/bot-resource-api.yaml`;
- OpenAPI lint пройден.

Итог:

- Resource API получил стабильный публичный contract layer;
- ошибки унифицированы;
- traceability улучшена;
- safe DTO/no raw DB model policy закреплена тестами;
- batch/message/event поведение зафиксировано contract tests;
- появилась основа для Swagger/Redoc/Bot SDK.

### P3.9 — Voice / Media Bot Runtime API 🚧

Цель:

Дать ботам безопасный runtime-доступ к голосовым комнатам EchoTalk через LiveKit: подключение, подписка/получение audio, transcription/notes сценарии, публикация audio, lifecycle control, voice events, policy enforcement, diagnostics, track state и подготовка к video/screen runtime.

#### P3.9.1 — Create Bot Media Session ✅

Закрыто и smoke-tested:

- `POST /bot/voice/rooms/:roomID/media-sessions`;
- создание `BotMediaSession` со статусом `pending`;
- генерация LiveKit room name через legacy room naming;
- генерация bot LiveKit participant identity `bot:<installation_id>:<session_id>`;
- выдача LiveKit join token через `BotTokenService`;
- проверка room exists / voice room only / server boundary;
- проверка requested capabilities через `normalizeVoiceMediaCapabilities` и `validateVoiceScopes`;
- корректные ошибки для non-voice room, missing room, unsupported capability, insufficient scopes;
- переход session в `active` после LiveKit webhook participant joined.

#### P3.9.1.1 — Bot Voice Lobby Integration + Moderator Kick ✅

Закрыто и end-to-end проверено:

- bot user добавляется как server participant при install/token flow;
- LiveKit token содержит безопасную metadata для frontend resolve:
  - `userID`;
  - `nickname`;
  - `avatar`;
  - `isBot`;
  - `mediaSessionID`;
  - `installationID`;
  - `botAppID`;
- `RefreshMediaSessionToken` переведён на тот же metadata/profile helper, чтобы reconnect не терял `userID` и `nickname`;
- VoiceLobby формирует `Tile` из LiveKit participant metadata;
- kick из VoiceLobby отправляет `user_id`, а не LiveKit `identity`;
- backend socket handler вызывает media session revoker для bot user;
- media session переводится в `revoked` с `end_reason=moderator_kick`;
- LiveKit participant disconnect происходит успешно;
- `voice.participant.left` доставляется bot client;
- повторный voluntary disconnect после revoke отклоняется как `media_session_not_disconnectable`;
- БД подтверждает финальное состояние `revoked/moderator_kick`.

#### P3.9.1.2 / P3.9.1.3 — Voice Media Session Hardening & Refactoring ✅

Закрыто:

- hardening media session lifecycle;
- refactoring runtime/service слоя;
- защита terminal statuses от некорректного перетирания;
- нормализация session metadata/profile helper;
- подготовка к diagnostics, public DTO и listen/speak runtime;
- route param fixes и cleanup по результатам smoke-тестов.

#### P3.9.2 — Listen Runtime Core ✅

Закрыто и проверено:

- bot подключается к LiveKit voice room;
- bot получает audio frames / track stream от участников комнаты;
- тестовый bot listener подтверждает получение audio;
- Dev Portal command `/voicelisten` добавлен и используется для runtime проверки;
- clarified contract: core listen runtime отдаёт audio frames/stream, а STT является отдельным слоем bot developer / transcription runtime.

#### P3.9.2.1 — Voice Media Session Public DTO Contract ✅

Закрыто:

- стабилизирован публичный DTO для media session;
- bot-facing ответы не раскрывают raw DB/LiveKit internals;
- закреплены public fields для session, participant, room, capabilities, status, timestamps;
- подготовлена база для diagnostics UI и OpenAPI.

#### P3.9.3 — Transcription Runtime / Meeting Notes ✅

Закрыто на production-MVP уровне:

- добавлен runtime слой для transcription / meeting notes сценариев;
- voice listen layer используется как источник audio context;
- заложена архитектура для будущих bot developer сценариев: transcript, notes, summaries, meeting assistant;
- функциональность отделена от core listen runtime, чтобы платформа не навязывала конкретный STT provider.

#### P3.9.4 — Speak / Publish Audio Runtime ✅

Закрыто и end-to-end проверено:

- bot может публиковать audio track в LiveKit voice room;
- звук bot audio track слышен участникам voice room;
- test command `/voicespeak` используется для проверки publish audio runtime;
- bot media session корректно завершается через disconnect;
- DB фиксирует lifecycle `active/ended`, `started_at`, `ended_at`, `end_reason=bot_disconnect`.

#### P3.9.5.1 — Voice Media Session Audit ✅

Закрыто:

- добавлен audit для voice media session lifecycle;
- session create/connect/disconnect/revoke/policy decisions отражаются в audit/runtime событиях;
- Admin UI обновлён для просмотра voice media session audit;
- audit используется для диагностики moderator kick, bot disconnect и policy actions.

#### P3.9.5.2 — Bots Policy for Voice Rooms ✅

Закрыто:

- реализована room-level policy для bot media sessions в voice rooms;
- backend проверяет возможность подключения/присутствия ботов в конкретной voice room;
- user middleware / room overrides flow приведены к единой policy-модели;
- исправлены switcher и single-handler scenarios для room overrides.

#### P3.9.5.3 — Policy Change Active Session Enforcement ✅

Закрыто:

- изменение voice room bot policy применяется к активным bot media sessions;
- active sessions могут быть приведены к новой policy;
- заложена база для будущего auto revoke / runtime protection enforcement.

#### P3.9.6 — Voice / Media Admin Diagnostics & Runtime Observability ✅

Закрыто:

- backend/admin diagnostics для voice/media runtime;
- route param fixes;
- runtime observability для media sessions и LiveKit state;
- Dockerfile/build обновления в рамках runtime deployment cleanup;
- diagnostics используются для проверки session/track lifecycle и админского анализа runtime.

#### P3.9.7.1 — Bot Media Track State ✅

Закрыто и проверено:

- добавлена таблица/модель `bot_media_tracks`;
- track publish state фиксируется при LiveKit webhook `track_published`;
- сохраняются `session_id`, `participant_identity`, `livekit_room`, `room_id`, `track_s_id`, `track_name`, `track_type`, `track_source`, `muted`, `status`;
- track unpublish state фиксируется без перетирания terminal/revoked statuses;
- исправлено имя/маппинг track name column;
- состояние track стало основой для Bot Speak Control, diagnostics и будущего video/screen runtime.

#### P3.9.7.2 — Bot Speak Control via Track Mute / Unmute ✅

Закрыто и end-to-end проверено:

- backend использует LiveKit `MutePublishedTrack` для mute/unmute audio track;
- работает mute/unmute обычных пользователей voice room;
- работает mute/unmute bot participant;
- frontend передаёт `room_id`, `target_identity`, optional `track_sid`, `media`, `muted`;
- backend не доверяет `room_name` клиента и строит LiveKit room name по `room_id` из БД;
- если `track_sid` передан, backend проверяет принадлежность track participant и media type;
- если `track_sid` не передан, backend fallback-ом выбирает первый track нужного типа;
- для ordinary user `bot_media_tracks` не обновляется;
- для bot participant `bot_media_tracks.muted` синхронизируется с successful LiveKit mute/unmute;
- `bot_track_updated=true/false` отражает результат bot track DB sync;
- VoiceLobby корректно определяет `track_sid` через LiveKit publications и fallback `participantInfo.tracks`;
- VoiceLobby mic state корректно отражает реальность при подключении пользователя/бота и после TrackMuted/TrackUnmuted;
- release `0.22.0` включает финальные fixes по P3.9.7.2.

#### P3.9.7.2.1 — Voice Track Control Hardening 🚧 next cleanup

Запланировано ближайшим cleanup/test этапом:

- вынести `MuteParticipant` из controller в `VoiceTrackControlService`;
- controller оставить тонким: bind/auth/call service/response;
- добавить DTO request/response для voice track control;
- добавить table-driven unit tests для:
  - `botMediaSessionIDFromIdentity`;
  - `resolveParticipantTrackSID`;
  - media type mapping;
  - explicit wrong `track_sid`;
  - fallback without `track_sid`;
- добавить/закрепить audit events `voice.track.mute` / `voice.track.unmute`;
- нормализовать error contract и traceability;
- сохранить backward compatibility payload с deprecated `room_name`.

#### P3.9.7.3.3 — Обновление статусной документации ✅

Предыдущее обновление:

- статусная документация обновлена после закрытия P3.9.7.3.1 и P3.9.7.3.2;
- отражены Speak Runtime Limits, post-check after `track_published` и duration observe-only counters;
- отражена новая модель `BotMediaUsageDaily` и usage accounting fields в `BotMediaTrack`;
- отражён release `0.22.0` и рабочий статус после P3.9.7.3;
- зафиксированы known limitations и roadmap перед стартом P3.9.8.1.

#### P3.9.7.3 — Speak Runtime Limits ✅

Закрыто на production-MVP уровне:

- `max_active_speaking_bots_per_room` реализован как enforced active limit;
- room-level limit считает разные `installation_id`, а не LiveKit participant sessions;
- `max_active_tracks_per_bot` реализован как enforced per-installation active track limit;
- media limit error contract отдаёт реальный runtime code вместо generic `media_session_create_failed`;
- runtime limit modes используются для duration policy: `disabled`, `observe_only`, `enforced`;
- `max_speak_session_duration_sec` и `max_daily_speak_duration_sec` заложены и работают в observe-only режиме;
- `media_auto_revoke_on_limit` заложен, но отключён по умолчанию;
- audit/runtime protection events пишутся для deny и observe-only decisions;
- реализован архитектурный мост к video/screen runtime через `bot_media_tracks` и `bot_media_usage_daily`.

#### P3.9.7.3.1 — Media Limits Post-check on Track Published ✅

Закрыто и проверено:

- pre-check выполняется перед созданием media session/token;
- post-check выполняется после фактического `track_published` и записи `bot_media_tracks`;
- post-check считает actual state, без `current + requestedTracks`;
- violation не ломает LiveKit webhook processing;
- violation пишет `bot.voice.media.runtime_limit` audit/log;
- auto revoke branch заложен, но не выполняется при `media_auto_revoke_on_limit=false`.

#### P3.9.7.3.2 — Speak Duration Observe-only Counters ✅

Закрыто и проверено:

- добавлена модель/таблица `bot_media_usage_daily`;
- `bot_media_tracks` получил `usage_duration_sec` и `usage_accumulated_at`;
- duration считается как разница между `published_at` и `unpublished_at`;
- usage accumulation идемпотентен и защищён от двойного начисления;
- `track_unpublished`, `participant_left` и `room_finished` начисляют closed-track usage;
- daily usage агрегируется по `installation_id + usage_date`;
- `max_speak_session_duration_sec` пишет `max_speak_session_duration_observed`;
- `max_daily_speak_duration_sec` пишет `max_daily_speak_duration_observed`;
- оба duration лимита работают observe-only, без disconnect/revoke/block.

#### P3.9.8 — Bot Video / Screen Stream Runtime 🚧

Общий media runtime расширяется от audio publish к video и screen-share источникам с переиспользованием session lifecycle, track state, usage accounting, policies, limits и diagnostics.

#### P3.9.8.1 — Bot Video Publish Capability ✅

Закрыто и end-to-end проверено:

- добавлен intent `video_publish`;
- session создаётся как publish-only: audio subscribe/publish выключены, video subscribe выключен, video publish включён;
- video subscribe остаётся unsupported capability;
- для подключения требуется `voice.connect`, для публикации переиспользуется `voice.speak`;
- room policy `allow_speak` применяется и к audio, и к video publish;
- active policy enforcement отзывает video session при запрете publish policy;
- pre-create media limit check выполняется для ожидаемого track `VIDEO/CAMERA`;
- `max_active_tracks_per_bot` применяется к video track, а `max_active_speaking_bots_per_room` остаётся audio-only;
- LiveKit token использует source-level least privilege: `CanPublishSources=[CAMERA]`;
- refresh-token сохраняет исходные video capabilities и source restrictions;
- тестовый bot client получил команду `/videopublish` и synthetic video generator на `@livekit/rtc-node`;
- smoke test выполнен для 640x360, 10 FPS, 60 секунд, 600 frames;
- video stream был виден участнику комнаты как camera video;
- Gateway подтвердил `voice.participant.joined`, `voice.track.published`, `voice.track.unpublished`, `voice.participant.left`;
- опубликованный track зафиксирован как `track_type=VIDEO`, `track_source=CAMERA`;
- session завершилась штатно: `ended/bot_disconnect`;
- `bot_media_tracks` зафиксировал `unpublished`, timestamps, `usage_duration_sec` и `usage_accumulated_at`;
- daily usage подтвердил раздельный учёт video: `video_publish_duration_sec` и `published_video_tracks` растут без изменения audio/screen counters;
- новые таблицы и миграции не потребовались: использованы существующие `BotMediaSession`, `BotMediaTrack`, `BotMediaUsageDaily`.

Проверенный пример:

- session: `bms_88dd6faa-897b-43b7-bb01-6c7a0df01137`;
- track SID: `TR_VC7Wyr3jmd6Dyv`;
- track lifecycle: `VIDEO/CAMERA -> unpublished`;
- measured track usage: `64` seconds;
- daily aggregate после двух video tests: `76` seconds и `2` published video tracks.

#### P3.9.8.2 — Bot Screen Share Publish Capability 🚧 next

Следующий инженерный этап:

- отдельный intent/capability для screen-share publish;
- LiveKit source restriction `SCREEN_SHARE` без расширения grants до `CAMERA`/`MICROPHONE`;
- отдельная проверка policy/limits semantics для screen publish;
- reuse `bot_media_tracks` с `VIDEO/SCREEN_SHARE`;
- reuse `bot_media_usage_daily.screen_publish_duration_sec` и `published_screen_tracks`;
- test bot command и end-to-end smoke test;
- проверка Gateway lifecycle, disconnect/revoke и usage idempotency.


## Changelog после последнего обновления документации от 2026-06-26

Сводка по git commit list и реализованным этапам:

- `feat(resource_runtime_api) - P3.9.3.7.1 — moderator kick bot media session - Done`
- `feat(resource_runtime_api) - P3.9.1.2 refactoring`
- `feat(resource_runtime_api) - P3.9.1.3 refactoring`
- `feat(resource_runtime_api) - P3.9.2.1 — Voice Media Session Public DTO Contract`
- `feat(resource_runtime_api) - P3.9.3 — Transcription Runtime / Meeting Notes`
- `feat(resource_runtime_api) - P3.9.5.1 — Voice Media Session Audit`
- `feat(resource_runtime_api) - P3.9.5.1 — Voice Media Session Audit (update UI admin panel)`
- `feat(resource_runtime_api) - P3.9.5.2 — Bots Policy for voice rooms`
- `fix(resource_runtime_api) - P3.9.5.2 — Bots Policy for voice rooms, user middleware`
- `fix(resource_runtime_api) - P3.9.5.2 — single handler room overrides`
- `fix(resource_runtime_api) - P3.9.5.2 — correctly switcher bot policy`
- `feat(resource_runtime_api) - P3.9.5.3 — Policy Change Active Session Enforcement`
- `feat(resource_runtime_api) - P3.9.6 — Voice / Media Admin Diagnostics & Runtime Observability`
- `fix(resource_runtime_api) - P3.9.6 — Voice / Media Admin Diagnostics & Runtime Observability - fix route param`
- `(resource_runtime_api) - P3.9.6 — Voice / Media Admin Diagnostics & Runtime Observability - update Dockerfile`
- `(resource_runtime_api) - P3.9.7.1 — Bot Media Track State`
- `fix(resource_runtime_api) - P3.9.7.1 — Bot Media Track State - fix name column`
- `feat(resource_runtime_api) - P3.9.7.2 — Bot Speak Control via Track Mute / Unmute`
- `fix(resource_runtime_api) - P3.9.7.2 — Bot Speak Control via Track Mute / Unmute - fixes update`
- `fix(resource_runtime_api) - P3.9.7.2 — Bot Speak Control via Track Mute / update state - fixes`
- `feat(resource_runtime_api) - P3.9.7.3 — Speak Runtime Limits`
- `feat(resource_runtime_api) - P3.9.7.3.1 — Media Limits Post-check on Track Published`
- `feat(resource_runtime_api) - P3.9.7.3.2 — Speak Duration Observe-only Counters`
- `release 0.22.0`
- `P3.9.8.1 — Bot Video Publish Capability: backend capability + test bot smoke flow, end-to-end verified`

## Observability

### Реализовано

- structured runtime logs
- Prometheus metrics
- runtime protection audit trail
- gateway diagnostics UI
- runtime protection diagnostics UI
- delivery attempts tracking
- voice/media session audit
- voice/media admin diagnostics
- bot media track state diagnostics
- media runtime limit audit через `bot.voice.media.runtime_limit`
- media usage daily accounting через `bot_media_usage_daily`
- voice track control audit planned/finalizing in P3.9.7.2.1

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
- **P2.4 завершён на production-MVP уровне**
- **P3.1 завершён**
- **P3.2 завершён**
- **P3.3 завершён**
- **P3.4 завершён**
- **P3.5 завершён**
- **P3.6 завершён**
- **P3.7 завершён**
- **P3.8.1–P3.8.8 завершены**
- **P3.8.9 Search API отложен**
- **P3.8.10 Batch Resource API завершён**
- **P3.8.11 Resource API Hardening & Contract Stabilization завершён**
- **P3.9.1 Create Bot Media Session завершён на production-MVP уровне**
- **P3.9.1.1 Bot Voice Lobby Integration + Moderator Kick завершён и end-to-end проверен**
- **P3.9.1.2 / P3.9.1.3 Voice Media Session Hardening & Refactoring завершены**
- **P3.9.2 Listen Runtime Core завершён**
- **P3.9.2.1 Voice Media Session Public DTO Contract завершён**
- **P3.9.3 Transcription Runtime / Meeting Notes завершён на production-MVP уровне**
- **P3.9.4 Speak / Publish Audio Runtime завершён и проверен**
- **P3.9.5.1 Voice Media Session Audit + Admin UI завершён**
- **P3.9.5.2 Bots Policy for Voice Rooms завершён**
- **P3.9.5.3 Policy Change Active Session Enforcement завершён**
- **P3.9.6 Voice / Media Admin Diagnostics & Runtime Observability завершён**
- **P3.9.7.1 Bot Media Track State завершён**
- **P3.9.7.2 Bot Speak Control via Track Mute / Unmute завершён и проверен**
- **P3.9.7.2.1 Voice Track Control Hardening — cleanup/test этап, не блокирует video runtime**
- **P3.9.7.3 Speak Runtime Limits завершён на production-MVP уровне**
- **P3.9.7.3.1 Media Limits Post-check on Track Published завершён и проверен**
- **P3.9.7.3.2 Speak Duration Observe-only Counters завершён и проверен**
- **P3.9.7.3.3 Обновление статусной документации завершено**
- **P3.9.8.1 Bot Video Publish Capability завершён и end-to-end проверен**
- **P3.9.8.2 Bot Screen Share Publish Capability — следующий инженерный этап**


Bot Platform уже поддерживает полноценный Discord-like server management runtime:

- buttons
- selects
- modals
- ephemeral responses
- interaction callbacks
- webhook/ws delivery
- moderation runtime
- roles runtime
- room overrides runtime
- room/category structure runtime
- runtime protection
- adaptive penalties
- gateway reliability layer
- Bot Context / Resource Runtime API Core
- safe resource DTO lookup для members / rooms / messages / roles / invites / audit / events
- Batch Resource API для получения пачки ресурсов одним запросом
- unified error contract и trace_id для bot-facing ошибок
- Scope / Boundary Matrix для Resource API
- Safe DTO audit и recursive audit meta sanitization
- table-driven contract tests для Batch / Message / Event contracts
- minimal OpenAPI draft для Bot Resource API
- Voice / Media Bot Runtime API: media sessions, LiveKit token, metadata, voice participant events, listen runtime, transcription/notes, speak/publish audio, publish camera video, audit, policy, diagnostics, bot media track state, track mute/unmute
- Speak Runtime Limits: enforced active limits, post-check after `track_published`, observe-only duration counters, daily media usage accounting
- moderator kick bot из voice room с финальным `revoked/moderator_kick` lifecycle
- bot speak control через LiveKit Track Mute/Unmute с синхронизацией `bot_media_tracks.muted`

Платформа уже позволяет ботам не только взаимодействовать с сообщениями, но и полноценно управлять серверной структурой, moderation lifecycle и runtime permissions.


Поддерживается полноценная event-driven модель взаимодействия.

Боты могут получать события:

- сообщений
- реакций
- закреплений
- участников сервера
- активности комнат
- модерации
- ролей
- структуры сервера
- permission overrides

через webhook delivery либо WebSocket Gateway с поддержкой ACK, resume и replay.

➡️ **Следующий этап:** P3.9.8.2 — Bot Screen Share Publish Capability.

P3.9.8.1 video publish завершён: `VIDEO/CAMERA` publication, Gateway lifecycle, track persistence и usage accounting подтверждены end-to-end. После screen-share publish планируются lifecycle/control hardening и Dev Portal UI/diagnostics для media limits и usage.

P3.8.9 Search API остаётся отложенным до появления полноценного системного поиска в EchoTalk.

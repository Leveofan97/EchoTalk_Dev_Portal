# EchoTalk Bot Developer Portal — Статус реализации

**Дата обновления:** 2026-11-19  
**Версия ТЗ:** Bot Developer Portal.pdf (февраль 2026)  
**Исторический базовый релиз:** release 0.22.0; актуальный backend содержит последующие hardening/runtime changes и работает на VPS. Присвоение backend релизных Docker/Git-тегов не входит в процесс публикации Dev Portal.  
**Текущий рабочий статус:** backend Bot Platform реализован, развёрнут и прошёл основные функциональные и media/recovery проверки 2026-11-18—19. P4.0.1–P4.0.6 закрыты; **P4.0.8 принят по проверенному объёму duration enforcement/recovery, Gateway и bounded soak**, но infrastructure chaos и часть глубоких метрик/проверок остаются отложенными. **P4.0.10 выполнен частично:** backup/restore, healthchecks, регрессионные и production smoke-пробы пройдены; риски с секретами, миграциями, offsite backup и реальным rollback осознанно отложены. **Следующий этап — аудит понятности и полноты интерфейса Dev Portal, затем сборка, публикация на хостинге, подключение домена и публичный запуск.** Формальный RC1/Git-теги/Docker-тегирование не используются как обязательные шаги процесса выпуска.

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
- **P3.9.7.2.1 Voice Track Control Hardening закрыт и проверен.**
- **P3.9.7.3 Speak Runtime Limits закрыт на production-MVP уровне.**
- **P3.9.7.3.1 Media Limits Post-check on Track Published закрыт и проверен.**
- **P3.9.7.3.2 Speak Duration Observe-only Counters закрыт и проверен.**
- **P3.9.7.3.3 Обновление статусной документации закрыто.**
- **P3.9.8.1 Bot Video Publish Capability закрыт и end-to-end проверен.**
- **P3.9.8.2 Bot Screen Share Publish Capability закрыт и end-to-end проверен.**
- **P3.9.8.3 Video / Screen Runtime Hardening закрыт и проверен.**
- **P3.9.8.3.1 Intent / Capability / Source Contract Hardening закрыт.**
- **P3.9.8.3.2 Media Lifecycle Reconciliation закрыт и проверен.**
- **P3.9.8.3.3 Active Policy / Source Enforcement Hardening закрыт и проверен.**
- **P3.9.8.3.4 Contract & Observability Hardening закрыт и проверен.**
- **P3.9.9.1 Media Session Expiration Enforcement закрыт и end-to-end проверен.**
- **P3.9.9.2 Active Media Usage Monitor реализован.**
- **P3.9.9.3 Duration Limit Enforcement / Auto Revoke закрыт по E2E-сценариям session/daily limits и принудительному revoke (2026-11-18).**
- **P3.9.9.4 Recovery / Idempotency / Observability закрыт по проверенным сценариям recovery, backend restart, LiveKit error/retry, конкурентного CAS и стабильности usage; отдельные infra chaos/длительные soak-наблюдения отложены.**
- **P3.9.10 Contract Stabilization частично закрыт: REST OpenAPI + Gateway AsyncAPI + typed event payloads стабилизированы; Media Runtime Limits/Usage UI остаётся отдельным UX-хвостом.**
- **P4.0 Backend Hardening — функциональная проверка завершена; не все эксплуатационные риски устранены.**
- **P4.0.1 OAuth refresh rotation & replay hardening — закрыт.**
- **P4.0.2 Outbound SSRF protection — закрыт.**
- **P4.0.3 Event Scope Symmetry & Data Minimization — закрыт.**
- **P4.0.4 Secret / Token Log Sanitization — закрыт.**
- **P4.0.5 SCA / dependency / container security gate — закрыт для release gate.**
- **P4.0.6 Cross-installation IDOR + scope downgrade regression — закрыт.**
- **P4.0.8 Gateway + Media Enforcement / Recovery — ✅ принят по проведённым bounded/E2E и integration-тестам; infra fault windows и глубокие Go/backlog метрики отложены.**
- **P4.0.10 Operational Readiness / Backup / Smoke — ⚠️ частично завершён; пройдены backup/restore, healthchecks, API/Gateway/Slash/Voice smoke, metrics; известные security/infra риски отложены.**

➡️ **Текущий этап: Dev Portal UX / Developer Onboarding Review → frontend build → hosting/domain → публичный запуск.** Backend пересобирать, тегировать и релизить заново ради формальной процедуры не требуется. Отложенные security/infra вопросы остаются открытыми и не считаются проверенными.

### 0.1 Оценка готовности к первому публичному запуску

Статус на 2026-11-19 (инженерная/продуктовая оценка, не KPI). Числовые проценты из снимка 2026-11-13 больше не используются: они не отражают фактическую проверку UX Dev Portal.

| Область | Статус | Комментарий |
|---|---|---|
| Bot Platform functional core | ✅ Проверено | OAuth/runtime, Gateway, commands, resource API, LiveKit/media функциональность ранее реализованы; в ноябре выполнены контрольные smoke-тесты |
| REST / Gateway contracts | ✅ Реализовано | OpenAPI/AsyncAPI, typed events и примеры присутствуют; доступность и удобство документации в UI ещё нужно оценить |
| Media duration/recovery | ✅ Проверено в ограниченных сценариях | E2E duration/daily revoke, stuck `revoking`, restart, LiveKit failure mock, concurrent CAS, usage stability |
| Operations / recovery | ⚠️ Есть отложенные проверки | backup/restore и readiness пройдены; rollback не запускался, Redis/PostgreSQL outage и глубокий soak не проверялись |
| Security | ⚠️ Открытые риски | исторические P4.0.1–P4.0.6 закрыты, однако `.env` отслеживается Git, права `644`, backend process `root` |
| Developer Portal UX / onboarding | 🚧 Следующий этап | необходимо оценить путь разработчика от регистрации бота до установки, команд, событий, документации и диагностики |
| Публичная публикация Dev Portal | ❌ Ещё не выполнена | frontend build, хостинг, домен, HTTPS, final UX smoke |

**Принятое решение по выпуску:** backend остаётся одной тщательно протестированной рабочей сборкой на VPS; публичный выпуск — это готовый и опубликованный клиент Dev Portal. Формальный RC1, Git-tag и выпуск новых backend-образов не являются обязательными действиями. Отложенные проблемы безопасности и восстановления не исчезают от такого решения и задокументированы отдельно.

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
- webhook delivery + retry + attempts работают; 2026-11-13 отдельно подтверждён `503 → retry → 200`, `attempt_count=2` и две записи attempts в PostgreSQL
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
- `max_speak_session_duration_sec` и `max_daily_speak_duration_sec` поддерживают `observe_only` и `enforced`; auto revoke при enforced-политике подтверждён E2E в ноябре 2026
- `bot_media_usage_daily` агрегирует daily publish usage по installation/date: audio/video/screen duration и количество опубликованных tracks
- `usage_accumulated_at` в `bot_media_tracks` защищает duration accounting от двойного начисления при `track_unpublished`, `participant_left` и `room_finished`
- `media_auto_revoke_on_limit` используется duration enforcement; в режиме `enforced` с включённым auto revoke worker отключает нарушающую session (проверено в P4.0.8)
- Bot Video Publish Capability реализован: intent `video_publish` создаёт publish-only media session без audio/video subscribe
- LiveKit join token ограничивает публикацию video session источником `CAMERA` через `CanPublishSources`; `SCREEN_SHARE` не выдаётся
- для video publish переиспользуются scope `voice.speak`, room policy `allow_speak`, installation/server/room boundary и media runtime limits
- тестовая команда `/videopublish` публикует synthetic video test-pattern через `@livekit/rtc-node`
- video publish end-to-end проверен на параметрах 640x360, 10 FPS, 60 секунд: пользователь видел video track как camera stream
- Gateway доставляет `voice.track.published` и `voice.track.unpublished` с `type=VIDEO`, `source=CAMERA`
- `bot_media_tracks` фиксирует lifecycle video track и usage accumulation; проверено финальное состояние `unpublished`
- `bot_media_usage_daily` корректно увеличивает `video_publish_duration_sec` и `published_video_tracks`, не затрагивая audio/screen counters
- Bot Screen Share Publish Capability реализован: intent `screen_share_publish` создаёт publish-only media session без audio/video subscribe
- LiveKit join token ограничивает screen-share session источником `SCREEN_SHARE` через `CanPublishSources`; `CAMERA` и `MICROPHONE` не выдаются
- для screen-share publish переиспользуются scope `voice.speak`, room policy `allow_speak`, installation/server/room boundary и media runtime limits
- тестовая команда `/screenpublish` публикует synthetic desktop/application test-pattern через `@livekit/rtc-node`
- screen-share publish end-to-end проверен на параметрах 960x540, 5 FPS, 20 секунд, 100 frames; stream отображался пользователю как демонстрация экрана
- Gateway доставляет `voice.track.published` и `voice.track.unpublished` с `type=VIDEO`, `source=SCREEN_SHARE`
- `bot_media_tracks` фиксирует lifecycle screen-share track и usage accumulation; проверено финальное состояние `unpublished`
- `bot_media_usage_daily` корректно увеличивает `screen_publish_duration_sec` и `published_screen_tracks`, не затрагивая audio/video counters
- Video / Screen Runtime Hardening завершён: intent, capabilities, expected track type/source, token grants, webhook lifecycle, policy enforcement и diagnostics сведены к единому контракту
- единый internal policy resolver покрывает `stats_only`, `listen`, `speak`, `listen_and_speak`, `video_publish`, `screen_share_publish`
- для publish-intents backend централизованно определяет capability, ожидаемые `track_type` / `track_source`, LiveKit publish source, media kind и runtime-limit operation
- refresh-token повторно проверяет persisted capabilities против intent policy и не расширяет права session
- `BotTokenService` работает fail-closed: publish grant без `CanPublishSources` отклоняется, а publish sources при `CanPublish=false` запрещены
- source contract закреплён матрицей: `speak -> AUDIO/MICROPHONE`, `video_publish -> VIDEO/CAMERA`, `screen_share_publish -> VIDEO/SCREEN_SHARE`; `listen` и `stats_only` не могут публиковать tracks
- webhook lifecycle reconciliation защищает от duplicate/out-of-order events: terminal track не переоткрывается, duplicate unpublish идемпотентен, один track SID не может принадлежать другой session
- поздний `track_unpublished` после terminal transition не перетирает более сильный `end_reason`; session и track сохраняют собственную корректную lifecycle-семантику
- participant loss/process stop проверен: `track_unpublished` начисляет usage, затем `participant_left` завершает session без double accounting
- room policy `allow_speak=false` отзывает активные `speak`, `video_publish` и `screen_share_publish` sessions
- policy revoke проверен для CAMERA и SCREEN_SHARE: session становится `revoked/policy_speak_blocked`, track — `unpublished/policy_speak_blocked`, фактический usage начисляется один раз
- source mismatch enforcement работает как второй защитный слой поверх LiveKit grants: нарушающая session отзывается, participant удаляется из LiveKit, expected/actual source фиксируются в audit
- `max_active_tracks_per_bot` применяется ко всем media sources, а `max_active_speaking_bots_per_room` остаётся ограничением только для `AUDIO/MICROPHONE`
- Gateway `voice.track.published` / `voice.track.unpublished` стабилизированы: `track.sid`, `track.type`, `track.source`, `track.muted` обязательны
- для bot track Gateway добавляет безопасный `media_session` context: `session_id`, `installation_id`, `intent`, `status`, optional `end_reason`
- policy revoke Gateway contract проверен: `voice.track.unpublished` содержит `media_session.status=revoked` и `end_reason=policy_speak_blocked`
- voice/media diagnostics расширены: active/pending/ended/revoked sessions, tracks по MICROPHONE/CAMERA/SCREEN_SHARE, usage duration, stale sessions, orphan tracks, runtime violations и disconnect failures
- временное окно diagnostics учитывает фактические `ended_at`, `unpublished_at`, `usage_accumulated_at` и `updated_at`, а не только время создания записей
- diagnostics endpoints проверены: `GET /servers/:serverID/bot-voice/diagnostics` и `GET /rooms/:roomID/bot-voice/diagnostics`
- исправлен DB mapping diagnostics для GORM-колонок `live_kit_room` и `track_s_id`
- `last_session_at` теперь отражает последнюю session комнаты, включая завершённые sessions, а не только `pending/active`
- внутренний audit meta `_ctx` удаляется из публичного diagnostics DTO
- disconnect failure получил отдельное безопасное audit action `bot.voice.media.disconnect_failure`
- итоговая diagnostics-проверка показала отсутствие stale/open и orphan published state: `stale_open_sessions=0`, `orphan_published_tracks=0`, `disconnect_failures=0`
- Voice Track Control Hardening завершён: `MuteParticipant` вынесен в отдельный service/use-case слой, controller оставлен тонким, добавлены source-aware resolver и строгая проверка bot identity/session boundary
- Track control различает `AUDIO/MICROPHONE`, `VIDEO/CAMERA` и `VIDEO/SCREEN_SHARE`; неоднозначный video selector без `track_sid/source` fail-closed вместо выбора случайного video track
- audit actions `voice.track.mute` / `voice.track.unmute` end-to-end проверены; diagnostics считает `track_mute_actions`, `track_unmute_actions`, `track_control_noop_actions`
- P3.9.9.1 Media Session Expiration Enforcement завершён: expiration worker удаляет просроченный active bot participant из LiveKit, переводит session в `ended/expired`, закрывает media lifecycle и финализирует usage
- expiration worker использует grace period 30 секунд; end-to-end тест подтвердил `participant_removed=true`, `usage_finalized=true`, отсутствие `bot.voice.media.disconnect_failure` и audit action `bot.voice.media_session.expire`
- refresh-token continuity проверена: refresh до старого `expires_at` продлевает lease примерно на 5 минут без разрыва текущего LiveKit connection; старый expiration больше не срабатывает, а worker корректно завершает session только после нового `expires_at + grace`
- expiration processing защищён от multi-instance гонок через row locking / `FOR UPDATE SKIP LOCKED`; terminal transitions и usage accounting остаются идемпотентными


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

➡️ **Текущий этап: UX-аудит и подготовка Dev Portal к публикации; результаты P4.0.8/P4.0.10 и отложенные проверки приведены в разделе 9.**


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
| Refresh token flow | `POST /oauth/token/refresh` | ✅ | atomic rotation, replay/reuse protection и concurrent refresh regression закрыты в P4.0.1 |
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
| Gateway close/send/replay hardening | ✅ | concurrency-safe close, durable ACK ordering, expired replay filtering, bounded replay queue hardening |
| Per-installation event payload redaction | ✅ | `message.content.view` применяется до webhook persistence / Gateway backlog |
| Typed Gateway event contract | ✅ | AsyncAPI 1.1.x: typed payload variants для публичных runtime events |
| Gateway AsyncAPI reference | ✅ | lifecycle, ACK/resume, examples, recovery semantics опубликованы |
| Event scope symmetry audit | ✅ | P4.0.3: invite/roles/membership/structure/overrides/voice payload symmetry и data minimization закрыты regression tests |

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
    - `media_auto_revoke_on_limit` поддерживает enforced auto revoke; observe-only остаётся отдельным режимом политики

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
    - terminal reasons включают `bot_disconnect`, `participant_left`, `expired`, `moderator_kick`, `policy_speak_blocked`, `media_source_mismatch`, `token_generation_failed`
    - capabilities snapshot: subscribe/publish audio/video
    - `expires_at`, `started_at`, `ended_at` используются для lifecycle control и диагностики

- `BotMediaTrack`
    - runtime state опубликованных bot media tracks
    - связывает `session_id`, `installation_id`, `server_id`, `room_id`, `livekit_room`, `participant_identity`
    - хранит LiveKit track identity: `track_s_id`, `track_name`, `track_type`, `track_source`
    - хранит control state: `muted`, `status`, `published_at`, `unpublished_at`, `updated_at`
    - хранит usage accounting fields: `usage_duration_sec`, `usage_accumulated_at`
    - используется для Bot Speak Control, diagnostics, audit, runtime limits и production video/screen runtime
    - обычные user tracks в эту таблицу не пишутся

- `BotMediaUsageDaily`
    - daily aggregate media publish usage по bot installation
    - уникальный ключ: `installation_id + usage_date`
    - хранит `audio_publish_duration_sec`, `video_publish_duration_sec`, `screen_publish_duration_sec`
    - хранит `published_audio_tracks`, `published_video_tracks`, `published_screen_tracks`
    - используется для duration accounting в observe-only/enforced режимах, diagnostics, будущих quotas/billing и video/screen runtime

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

// User/Admin Voice / Media Diagnostics
GET    /servers/:serverID/bot-voice/diagnostics
GET    /rooms/:roomID/bot-voice/diagnostics

// Voice/media session audit, policy enforcement and runtime observability are implemented in backend/admin UI.
// Diagnostics routes require server-scoped administrative permission and return sanitized audit/runtime data.
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
- `voice.view`
- `voice.connect`
- `voice.listen`
- `voice.speak`

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
- `voice.view` → read-only voice room/state и voice lifecycle events
- `voice.connect` → создание/поддержание media session
- `voice.listen` → получение audio runtime / track events, где требуется listen visibility
- `voice.speak` → публикация audio/video/screen-share согласно intent policy

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
| Voice Track Control Hardening | ✅ | service/use-case cleanup, source-aware resolver, strict bot boundary, audit/error contract и diagnostics counters завершены и проверены |
| Speak Runtime Limits | ✅ | active limits enforced, post-check, duration observe-only accounting, audit |
| Media Limits Post-check | ✅ | `track_published` запускает actual-state check после записи `bot_media_tracks` |
| Speak Duration Observe-only Counters | ✅ | session/daily duration считаются и пишут audit без revoke |
| Bot Video Publish Capability | ✅ | P3.9.8.1: `video_publish`, LiveKit `VIDEO/CAMERA`, Gateway lifecycle, track state и usage accounting проверены end-to-end |
| Bot Screen Share Publish Capability | ✅ | P3.9.8.2: `screen_share_publish`, LiveKit `VIDEO/SCREEN_SHARE`, Gateway lifecycle, track state и usage accounting проверены end-to-end |
| Intent / Capability / Source Contract Hardening | ✅ | P3.9.8.3.1: единый intent policy resolver, refresh validation, fail-closed LiveKit publish grants |
| Media Lifecycle Reconciliation | ✅ | P3.9.8.3.2: duplicate/out-of-order webhook safety, terminal-state preservation, idempotent usage accounting |
| Active Policy / Source Enforcement | ✅ | P3.9.8.3.3: CAMERA/SCREEN_SHARE policy revoke и source mismatch enforcement |
| Gateway Media Session Contract | ✅ | `voice.track.*` содержит обязательный track contract и optional safe `media_session` context |
| Contract & Observability Hardening | ✅ | P3.9.8.3.4: usage/source diagnostics, stale/orphan counters, runtime violations, disconnect failures |
| Diagnostics Corrective Hardening | ✅ | `live_kit_room` mapping, `last_session_at`, public audit `_ctx` sanitization исправлены и проверены |
| Media Session Expiration Enforcement | ✅ | P3.9.9.1: active/pending expiration lifecycle, LiveKit participant removal, 30s grace, usage finalization, refresh race hardening проверены end-to-end |
| Active Media Usage Monitor | ✅ | P3.9.9.2 реализован; duration enforcement/recovery E2E пройдены, infra chaos отдельно отложен |
| Duration Auto Revoke / Recovery | ✅ | P3.9.9.3 / P3.9.9.4: session/daily limit, restart, retry, concurrent CAS и usage stability проверены |


## 7. Безопасность — текущее состояние

| Требование | Статус | Примечание |
|------------|--------|------------|
| Authorization code TTL | ✅ | реализовано |
| Access token TTL | ✅ | реализовано |
| Refresh token | ✅ | выпускается |
| Refresh rotation | ✅ | P4.0.1: atomic consume/rotate, replay/reuse protection, concurrent refresh regression |
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
| Gateway resume validation | ✅ | replay `seq > last_ack_seq` + invalid resume handling реализованы |
| Gateway backlog overflow protection | ✅ | добавлена cleanup policy, нужна long-run проверка |
| Runtime protection middleware | ✅ | all runtime routes protected |
| Redis block cache | ✅ | fast-path blocked installations |
| Structured runtime logs | ✅ | production runtime diagnostics |
| Unified bot error contract | ✅ | `error.code/message/details/trace_id` |
| Request trace ID | ✅ | `RequestTraceMiddleware`, `X-Request-ID` |
| Safe DTO audit | ✅ | denylist tests, no private fields in bot responses |
| Audit meta sanitization | ✅ | recursive sensitive-key removal |
| Resource API contract tests | ✅ | Batch / Message / Event table-driven tests |
| Bot Resource OpenAPI | ✅ | canonical REST contract, lint/render проверены |
| Bot Gateway AsyncAPI | ✅ | canonical WebSocket/Gateway contract, typed payloads + examples |
| Message event content redaction | ✅ | `message.created/updated` redacted per-installation без `message.content.view` до persistence/delivery |
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
| Voice track control DB sync safety | ✅ | строгий sync по installation/session/room/LiveKit room/participant/track SID; успешный LiveKit mute/unmute не ломается DB sync |
| Media runtime active limits | ✅ | `max_active_speaking_bots_per_room` и `max_active_tracks_per_bot` проверяются pre-create и post-track-published |
| Media runtime duration accounting | ✅ | `bot_media_usage_daily` учитывает duration; `observe_only` и `enforced` поддержаны runtime-политикой |
| Media runtime auto revoke | ✅ | enforced session/daily duration и принудительный revoke проверены 2026-11-18 |
| Media session expiration enforcement | ✅ | просроченный active participant удаляется из LiveKit после grace period; session завершается `ended/expired`, usage финализируется |
| Media session refresh race protection | ✅ | refresh продлевает lease только для refreshable open session; старый expiration не может завершить уже продлённую session |
| Media expiration multi-instance safety | ✅ | worker использует row locking / `FOR UPDATE SKIP LOCKED`; повторная обработка не должна дублировать terminal transition/usage |
| Media usage idempotency | ✅ | `usage_accumulated_at` предотвращает двойное начисление usage |
| Video publish least privilege | ✅ | LiveKit grant для `video_publish` ограничен `CanPublishSources=[CAMERA]`; screen share и video subscribe не выдаются |
| Video publish authorization | ✅ | обязательны `voice.connect` + `voice.speak`, room `allow_speak`, server/room boundary и active track limits |
| Screen-share publish least privilege | ✅ | LiveKit grant для `screen_share_publish` ограничен `CanPublishSources=[SCREEN_SHARE]`; `CAMERA`, `MICROPHONE` и video subscribe не выдаются |
| Screen-share publish authorization | ✅ | обязательны `voice.connect` + `voice.speak`, room `allow_speak`, installation/server/room boundary и active track limits |
| Screen-share source integrity | ✅ | backend token разрешает только `SCREEN_SHARE`; test bot использует корректный rtc-node enum `TrackSource.SOURCE_SCREENSHARE` |
| Unified media intent/source policy | ✅ | capabilities, expected type/source, LiveKit grants, refresh и limiter input вычисляются из единого internal policy resolver |
| LiveKit publish grant fail-closed | ✅ | publish без source whitelist и sources при `CanPublish=false` отклоняются до выдачи token |
| Media source mismatch enforcement | ✅ | actual track сверяется с intent; mismatch вызывает revoke, LiveKit participant removal и safe audit expected/actual |
| Video/screen active policy enforcement | ✅ | `allow_speak=false` отзывает active CAMERA/SCREEN_SHARE sessions и сохраняет `policy_speak_blocked` |
| Webhook lifecycle idempotency | ✅ | duplicate/out-of-order publish/unpublish/participant events не переоткрывают terminal state и не дублируют usage |
| Gateway media-session data minimization | ✅ | bot track events содержат только safe session context без JWT/secrets/authorization metadata |
| Voice diagnostics authorization/boundary | ✅ | server/room diagnostics ограничены administrative permission и server boundary |
| Voice diagnostics audit sanitization | ✅ | internal `_ctx` удаляется из public diagnostics DTO; raw LiveKit errors/secrets не выдаются |

| Frontend LiveKit logs | ⚠️ | полный participant object содержит временный access token в `ws.url`; production logs нужно санитизировать |
| Outbound Webhook/Command SSRF protection | ✅ | P4.0.2: HTTPS-only, DNS/IP validation, private/loopback/link-local/CGNAT/reserved block, redirects disabled, safe dial + timeouts/size caps |
| Invite event scope symmetry | ✅ | P4.0.3: invite events требуют `server.invites.view` |
| Moderation/event data minimization | ✅ | P4.0.3: public event payloads приведены к scope symmetry / data-minimization policy |
| Voice Gateway internal identifiers | ✅ | P4.0.3: raw LiveKit/runtime internals минимизированы; bot-facing media context ограничен safe public fields |
| Frontend/token log sanitization | ✅ | P4.0.4: centralized security log redaction/fingerprinting; token/Authorization/Cookie/URL/body sanitization applied to critical runtime paths |
| Dependency/SCA gate | ✅ | P4.0.5: govulncheck reachable=0, frontend audit clean, Trivy source/image vulnerability scan clean for release gate; backend root runtime documented as temporary TLS-key exception |
| Effective scope downgrade | ✅ | P4.0.6: runtime использует effective scopes из `BotAuthMiddleware`; старый token не может получить scope вне token snapshot и немедленно теряет отозванный scope |
| Cross-installation / cross-server IDOR regression | ✅ | P4.0.6: resource/event/interaction/media boundaries проверены; batch permission check использует единый access validator; media session Get/List/Refresh/Disconnect изолированы по `installation_id` |

---

### 7.1 Release security risk matrix

| Приоритет | Риск | Состояние | Release action |
|---|---|---|---|
| **P0 / High** | OAuth refresh token replay/rotation semantics | ✅ закрыто в P4.0.1 | atomic consume/rotate, replay/reuse handling, concurrent refresh regression |
| **P0 / High** | SSRF через developer-controlled `WebhookURL` / `CommandBaseURL` | ✅ закрыто в P4.0.2 | safe outbound transport, HTTPS-only, DNS/IP validation, redirects disabled, strict timeouts/response caps |
| **P0 / High** | Invite/event payload scope mismatch | ✅ закрыто в P4.0.3 | event scope symmetry + data minimization regression |
| **P0 / High** | Token leakage через production logs | ✅ закрыто в P4.0.4 | centralized sanitizer/redaction/fingerprint helpers applied to critical paths |
| **P1 / Medium-High** | Event sensitive payload exposure | ✅ закрыто в P4.0.3 | scope symmetry / redaction / public DTO minimization |
| **P1 / Medium** | Raw LiveKit identifiers в public Gateway payloads | ✅ закрыто в P4.0.3 | public payload minimization; raw runtime internals не считаются public API |
| **P1 / Medium** | Duplicate mutations при retries | post-release backlog, если P4.0.6/P4.0.8 не покажут release blocker | P4.1: `Idempotency-Key` для наиболее дорогих/опасных mutations |
| **P1 / Medium** | Event contract evolution | post-release backlog | текущий v1 contract фиксируется для релиза; formal deprecation machinery — P4.1 |
| **P1 / Medium** | Supply-chain vulnerabilities | ✅ текущий release gate закрыт в P4.0.5 | автоматизацию постоянного SCA/CI можно расширять post-release |

**Уже закрытая утечка:** message content больше не должен обходить `message.content.view` через Webhook/Gateway: event payload redaction выполняется per-installation до persistence и replay.

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
- просматривать server/room voice-media diagnostics с session, track, policy, usage и runtime violation context
- видеть stale sessions, orphan tracks, source-specific active tracks и disconnect failures

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
- публиковать screen-share track через intent `screen_share_publish` и команду `/screenpublish`
- получать `voice.track.published` / `voice.track.unpublished` для `VIDEO/SCREEN_SHARE` через Gateway
- учитывать screen-share publish duration и количество screen tracks в `bot_media_usage_daily`
- быть замьюченным/размьюченным через Track Mute / Unmute control
- видеть синхронизированное состояние `muted` в `bot_media_tracks` для bot tracks
- корректно переживать moderator kick: session становится `revoked/moderator_kick`, LiveKit disconnect приходит bot client
- работать под active speak runtime limits: room-level speaking bots и per-bot active tracks
- попадать в media duration accounting: observe-only и enforced режимы доступны для session/daily audio publish duration
- получать audit/runtime visibility по превышениям; в режиме `observe_only` без отключения, в `enforced` при auto revoke — с отзывом session
- получать стабильный `media_session` context в `voice.track.published` / `voice.track.unpublished`
- видеть `intent`, session `status` и terminal `end_reason` прямо в Gateway track lifecycle event
- работать под strict source contract: `AUDIO/MICROPHONE`, `VIDEO/CAMERA`, `VIDEO/SCREEN_SHARE`
- корректно переживать abrupt process stop/participant loss без reopening terminal track и без двойного usage
- получать согласованный policy revoke lifecycle для camera/screen publication
- обновлять media session lease через refresh-token без разрыва уже установленного LiveKit connection
- продолжать полезную voice/media работу после refresh: старый `expires_at` больше не завершает продлённую session
- автоматически отключаться платформой при окончательном истечении media session: после `expires_at + grace` active participant удаляется из LiveKit и session завершается как `ended/expired`

---

## 9. План публичного запуска и зафиксированные проверки

### 9.1 Принцип релиза (решение 2026-11-19)

**Backend:** одна актуальная рабочая сборка Go, уже развёрнутая на VPS и проверенная реальными тестами. Не вводим обязательный Git-tag, Docker release-tag, RC1-процедуру и повторное развёртывание ради формальности. Для rollback сохранён отдельный Docker image прежней сборки, но реальный откат пока не тестировался.

**Публичный релиз Bot Platform:** удобный для разработчика, собранный и размещённый на публичном хостинге **Dev Portal**, доступный по домену с HTTPS и понятным процессом регистрации/установки ботов. Не путать готовность backend с готовностью публичного developer experience.

```text
Backend: реализован → E2E/regression/smoke проверен → работает на VPS
                                                   ↓
Dev Portal: UX/onboarding audit → исправления интерфейса → production build
                                                  ↓
                         хостинг + домен + HTTPS + frontend smoke
                                                  ↓
                                     официальный публичный запуск
```

### 9.2 Что подтверждено — P4.0.8 (2026-11-13—18)

| Проверка | Фактическое доказательство | Статус |
|---|---|---|
| Gateway reconnect + client resume | 2026-11-13: 1 контролируемый WS drop, восстановление 1260 мс, `invalid_resume=0` | ✅ PASS (bounded) |
| Event delivery + duplicate protection | 40/40 доставленных voice lifecycle событий, дубли event ID не обнаружены | ✅ PASS (bounded) |
| Media lifecycle soak | 10/10 последовательных create/active/end, ~10 минут, 37 Docker snapshots; это не stress/concurrent soak | ✅ PASS (bounded) |
| Webhook retry/backoff | `message.created`: HTTP `503 → 200`, ровно две попытки, одна запись на HTTP-attempt | ✅ PASS (E2E) |
| Session duration enforcement | Лимит 10 с, активная media session автоматически `revoked`, причина `runtime_speak_session_duration_limit` | ✅ PASS (E2E) |
| Daily duration enforcement | Лимит 25 с, auto revoke с причиной `runtime_daily_speak_duration_limit` | ✅ PASS (E2E) |
| Recovery зависшей `revoking` session | Stale session восстановлена до `revoked`; `participant_removed=true`, `usage_finalized=true` | ✅ PASS (E2E) |
| Usage/idempotency | Проверена стабильность начислений по повторным замерам без double accounting | ✅ PASS (ограниченный сценарий) |
| LiveKit admin failure → recovery | Go integration с PostgreSQL + mock LiveKit: первый `RemoveParticipant` завершился ошибкой, повтор — успешно, status `revoked` | ✅ PASS (integration; audit/usage не проверялись в этом тесте) |
| Backend restart в состоянии `revoking` | 2026-11-18: после restart worker восстановил session, `participant_removed=true`, `usage_finalized=true`, `failed_sessions=0` | ✅ PASS (E2E) |
| Concurrent Recovery, PostgreSQL CAS | Два конкурентных recovery scan: `checked=2`, `recovered=1`, `failed=0`, `livekit_remove_calls=1`, status `revoked` | ✅ PASS (integration; mock LiveKit) |
| Redis/PostgreSQL outage / восстановление | Не проводилось контролируемое отключение инфраструктуры | ⏸️ Отложено |
| Go goroutine/heap/process collectors | `go_*` / `process_*` не были показаны текущим `/metrics`; Docker PIDs не заменяют проверку goroutines | ⏸️ Отложено |
| Длительное backlog accumulation и orphan invariants под outage | Отдельный стресс/отказный прогон не проводился | ⏸️ Отложено |

**Итог P4.0.8:** duration enforcement и recovery проверены; bounded Gateway/media/workers пройдены. **Этап принят для перехода к Dev Portal, но не заявляется как полный инфраструктурный chaos/stress proof.** Для Redis/PostgreSQL/LiveKit fault windows нужна отдельная staging-проверка, без остановки сервисов на действующем VPS.

Исторические evidence 2026-11-13: `p408-2026-11-13T10-09-50-931Z-summary.json`, JSONL и 37 Docker resource snapshots; PostgreSQL evidence для webhook retry. Дополнительные 2026-11-18 результаты подтверждены SQL, worker logs и интеграционными тестами (`TestDurationRevoke_LiveKitFailOnceThenRecovery`, `TestDurationRevoke_ConcurrentRecoveryExactlyOnce`).

### 9.3 Что подтверждено — P4.0.10 (2026-11-19)

| Проверка | Фактический результат | Статус |
|---|---|---|
| Диск VPS | `/` освобождён с 100% до 88% (2.3 ГБ свободно), Docker data на `/mnt/docker` | ✅ Диагностика и частичная очистка |
| PostgreSQL backup | `pg_dump` 17.11, custom/gzip, backup `echo_20261119T050907Z.dump` (~820 КБ), 686 TOC entries | ✅ PASS |
| PostgreSQL restore | Успешно восстановлена отдельная `echo_restore_test`: 69 таблиц, 171 media sessions, 73 media tracks, 14 daily usage rows; тестовая БД удалена | ✅ PASS |
| Docker rollback preparedness | Сохранён прежний image `530f1044b561`; текущий backend image `b4e1db6f8567`; **реальный rollback не выполнялся** | ⚠️ Image сохранён, rollback не проверен |
| Healthchecks | Отдельный порт 9090: `/healthz=204`, `/readyz=204`; docker `/healthcheck` exit 0, status `healthy` | ✅ PASS |
| Go regression | `go test ./services/botplatform`: PASS, 0.032s **без DB integration tests** | ✅ PASS (unit subset) |
| Auth negative/positive | `GET /bot/me`: без токена `401`, с Bot Access Token `200` | ✅ PASS |
| Gateway session | `POST /bot/gateway/session` → `200` | ✅ PASS |
| WebSocket connect/hello | `hello`, `installation_id=1`, `server_id=1`, heartbeat interval 30s | ✅ PASS |
| Heartbeat | `last_seen_at` был недавним, но изменение непосредственно до/после heartbeat не сравнивалось | ⚠️ Косвенно подтверждено |
| Gateway disconnect | DB: `status=disconnected`, `last_disconnected_at` обновлён | ✅ PASS |
| Bot REST API | `GET /bot/servers/1/rooms` → `200`; `GET /bot/events` → `200` | ✅ Доступ проверен; payload/replay content не перепроверялся |
| Slash command | `/help` выполнена через клиент EchoTalk и вернула корректный ответ | ✅ PASS |
| Voice/audio | `/voicespeak 94 5000 440`: звук воспроизведён; DB `ended/bot_disconnect`, 2026-11-19 07:00 UTC | ✅ PASS |
| Metrics/Recovery Health | `/metrics` доступен; 7 recovery/scan error/pending/stale показателей равны 0 | ✅ PASS (snapshot) |
| Ошибки логов | panic/fatal в просмотренном окне не обнаружены; присутствует `PERMS DEBUG` и единичный TLS handshake EOF | ✅ С замечаниями |

**Границы smoke:** базовые установка/OAuth flow, interactive components, video/screen publish и весь набор RBAC проверялись на более ранних этапах. В ноябрьском финальном прогоне **не переиспытан целиком** полный путь `создать бота → выдать scopes → установить → получить code → exchange token → interaction → media`. Эти сценарии желательно пройти ещё раз именно с точки зрения UX нового разработчика на Dev Portal.

### 9.4 Осознанно отложенные проверки и риски (не считать закрытыми)

| Приоритет | Тема | Что обнаружено или осталось | Текущее решение |
|---|---|---|---|
| **Высокий** | Secrets в Git | `.env` и `EchoTalkClient/.env` отслеживаются Git; на VPS имели `644`; содержимое и история не проверялись | Отложено владельцем. Требуются исключение из индекса/истории по плану, ротация секретов и права `600` |
| **Высокий** | Container privilege | Backend-процесс выполняется от `root`; private TLS key читается приложением | Отложено; отдельно спланировать non-root / TLS termination |
| **Средний/высокий** | Offsite backup | Есть проверенная локальная копия на том же VPS, но нет подтверждения удалённой резервной копии | Отложено |
| **Средний/высокий** | Реальный Docker rollback | Старый image сохранён, но сценарий возврата после обновления ещё не выполнялся | Отложено |
| **Средний** | DB migration rollback | `ConnectDatabase()` при старте вызывает GORM `AutoMigrate`; схема не откатывается при возврате старого образа | Отложено по решению владельца; обратная совместимость обеспечивается перед релизом |
| **Средний** | Redis/PostgreSQL failure windows | Не тестировали сбой и восстановление основных dependencies | Отложено для staging |
| **Средний** | Go runtime/backlog/orphan stress | Нет достаточного длинного stress/chaos proof с heap/goroutine и outage backlog | Отложено |
| **Низкий** | Debug permission logs | В production видны многословные `[PERMS DEBUG]` с набором разрешений | Рекомендуется выключить до публичного запуска |

Подробный отдельный список отложенных работ: `EchoTalk_P4.0.10_deferred_release_preparation.md` (зафиксирован ранее). Это не означает, что все перечисленные риски безопасны; особенно секреты в Git требуют отдельного устранения.

### 9.5 Следующий этап — Dev Portal UX / Developer Onboarding Review 🚧

**Цель:** разработчик, впервые открывший Dev Portal, должен самостоятельно понять, как зарегистрировать Bot App, настроить transport, установить бота на сервер, получить токен, подписаться на события, добавить slash commands и отладить ошибки. До завершения аудита удобство интерфейса **не подтверждено**.

| Путь разработчика | Что проверим в UI | Статус |
|---|---|---|
| Первое посещение | Понятное назначение Dev Portal, вход, навигация, документация, очевидная кнопка создания бота | ⏳ UX review |
| Создание Bot App | Название, описание, иконка, scopes, валидация, ошибки, пустые состояния | ⏳ UX review |
| Credentials & OAuth | Понятное отличие Client ID/Secret, user JWT, Bot Access/Refresh; безопасное копирование и rotation | ⏳ UX review |
| Install flow | Как выбрать сервер и разрешения, подтвердить установку, узнать installation ID и дальнейшие действия | ⏳ UX review |
| Transport | Когда использовать Webhook vs WebSocket; endpoint URL, подпись, subscribe events, connection status | ⏳ UX review |
| Slash Commands | Command Base URL, создание `/help`, включение, проверка, error/timeout feedback | ⏳ UX review |
| Event debugging | Deliveries/attempts, replay, Gateway seq/ACK/heartbeat, понятные ошибки и пустые состояния | ⏳ UX review |
| Runtime Protection | Как увидеть лимиты, блокировки, violations, что делать при `429` | ⏳ UX review |
| REST / Gateway docs | Доступность OpenAPI/AsyncAPI, Quick Start, примеры request/response и авторизации | ⏳ UX review |
| Интерфейс | Адаптивность, формулировки, подтверждения опасных действий, состояния загрузки/ошибок, доступность | ⏳ UX review |

UX-аудит может выявить небольшие **публикационные исправления клиента**, но не повод заново расширять backend feature scope.

### 9.6 Публикация Dev Portal — после UX Review

- [ ] Внести UX/контент-исправления в Vue Dev Portal.
- [ ] Выполнить production frontend build и typecheck/lint.
- [ ] Проверить маршрутизацию SPA при прямом открытии и перезагрузке URL.
- [ ] Разместить статическую сборку на выбранном хостинге.
- [ ] Подключить домен, HTTPS и корректную конфигурацию API/CORS/redirect URLs (строгий allowlist, без wildcard CORS).
- [ ] Выполнить публичный frontend smoke: login → create → credentials → OAuth/install → commands → events/diagnostics.
- [ ] Опубликовать Dev Portal и документацию для разработчиков ботов EchoTalk.

**Финал:** публичный Dev Portal доступен по домену и позволяет стороннему разработчику пройти весь путь от создания бота до работы с runtime. Backend остаётся текущей проверенной сборкой; новые теги не требуются.

### 9.7 После запуска / post-release backlog

- P4.0.7 strict mutation idempotency для high-risk endpoints;
- P4.0.9 formal public API/event versioning и deprecation policy;
- Media Runtime Limits / Usage UI;
- daily/global quotas, deferred/autocomplete, specialized selects, interaction inspector;
- global scoped Search API, официальный SDK, advanced analytics;
- hosted runtime/billing/releases и anomaly detection;
- отложенные operations/security задачи из §9.4 — по отдельному приоритетному плану (не считать выполненными после публикации).

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

#### P3.9.7.2.1 — Voice Track Control Hardening ✅

Закрыто и проверено:

- `MuteParticipant` вынесен из controller в отдельный `VoiceTrackControlService`; controller оставлен тонким и отвечает за bind/runtime context/call service/HTTP response;
- добавлены отдельные DTO/типы и порты для track-control use-case, LiveKit adapter, repository и audit;
- canonical LiveKit room name строится backend-ом по доверенным `server_id + room name + room_id`; client `room_name` остаётся deprecated/backward-compatible полем и не является source of truth;
- добавлен source-aware selector/resolver:
    - audio → `MICROPHONE`;
    - video → `CAMERA` или `SCREEN_SHARE`;
    - aliases нормализуются;
    - explicit `track_sid` проверяется на принадлежность participant, media type и source;
    - fallback без `track_sid` разрешён только при единственном подходящем track;
    - несколько подходящих video tracks приводят к `voice_track_ambiguous`, а не к выбору случайного track;
- bot participant identity валидируется строго как `bot:<positive installation_id>:bms_*`;
- bot track DB sync ограничен полным runtime boundary: installation/session/room/LiveKit room/participant identity/track SID/status=`published`;
- mute/unmute стал идемпотентным: если фактический `muted` уже равен запрошенному, LiveKit mutation не вызывается, а response фиксирует `changed=false`;
- добавлены audit actions:
    - `voice.track.mute`;
    - `voice.track.unmute`;
- audit meta фиксирует media/source, previous/current muted state, `changed`, `bot_track_updated`, installation/session для bot tracks;
- audit failure не ломает успешный LiveKit mutation;
- публичный error contract нормализован через typed `VoiceTrackControlError`;
- table-driven tests добавлены для identity parser, selector/source normalization и resolver edge-cases;
- end-to-end mute/unmute проверен на bot audio track;
- diagnostics интеграция проверена:
    - `track_mute_actions=2`;
    - `track_unmute_actions=2`;
    - `track_control_noop_actions=0`;
- public diagnostics продолжает удалять internal audit `_ctx`.

Итог:

- Track Mute / Unmute больше не зависит от controller-level ad-hoc resolver;
- CAMERA и SCREEN_SHARE различаются явно;
- ownership/boundary и DB sync закреплены отдельным use-case слоем;
- P3.9.7.2.1 закрыт и не является roadmap-хвостом.

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
- на момент этапа P3.9.7.3 `max_speak_session_duration_sec` и `max_daily_speak_duration_sec` работали в observe-only режиме; с 2026-11-18 отдельно проверен `enforced` auto revoke;
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

#### P3.9.8 — Bot Video / Screen Stream Runtime ✅

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

#### P3.9.8.2 — Bot Screen Share Publish Capability ✅

Закрыто и end-to-end проверено:

- добавлен отдельный intent `screen_share_publish`;
- session создаётся как publish-only: audio subscribe/publish выключены, video subscribe выключен, video publish включён;
- video subscribe остаётся unsupported capability;
- для подключения требуется `voice.connect`, для публикации переиспользуется `voice.speak`;
- room policy `allow_speak` применяется к screen-share publish и active policy enforcement;
- pre-create media limit check выполняется для ожидаемого track `VIDEO/SCREEN_SHARE`;
- `max_active_tracks_per_bot` применяется к screen-share track, а `max_active_speaking_bots_per_room` остаётся audio-only;
- LiveKit token использует source-level least privilege: `CanPublishSources=[SCREEN_SHARE]`; grants не расширяются до `CAMERA` или `MICROPHONE`;
- refresh-token сохраняет исходный intent, video capability и source restriction `SCREEN_SHARE`;
- тестовый bot client получил команду `/screenpublish` и synthetic desktop/application generator на `@livekit/rtc-node`;
- исправлено точное имя rtc-node enum: `TrackSource.SOURCE_SCREENSHARE`; первоначальный timeout был диагностирован по LiveKit warning `no permission to publish track`, возникшему из-за undefined source при использовании неверного имени enum;
- smoke test выполнен для 960x540, 5 FPS, 20 секунд, 100 frames;
- screen-share stream был виден участнику комнаты как демонстрация экрана;
- Gateway подтвердил `voice.participant.joined`, `voice.track.published`, `voice.track.unpublished`, `voice.participant.left`;
- опубликованный track зафиксирован как `track_type=VIDEO`, `track_source=SCREEN_SHARE`;
- session завершилась штатно: `ended/bot_disconnect`;
- `bot_media_tracks` зафиксировал `unpublished`, timestamps, `usage_duration_sec` и `usage_accumulated_at`;
- daily usage подтвердил раздельный учёт screen share: `screen_publish_duration_sec` и `published_screen_tracks` растут без изменения audio/video counters;
- новые таблицы и миграции не потребовались: использованы существующие `BotMediaSession`, `BotMediaTrack`, `BotMediaUsageDaily`.

Проверенный пример:

- session: `bms_7173f749-1b50-4e3f-8594-e5068e1eb9fc`;
- track SID: `TR_VS4wv7GFjguGAu`;
- track name: `echotalk-bot-test-screen-share`;
- track lifecycle: `VIDEO/SCREEN_SHARE -> unpublished`;
- published interval: `2026-07-20 11:58:03Z` → `2026-07-20 11:58:25Z`;
- measured track usage: `22` seconds;
- daily screen aggregate на момент проверки: `63` seconds;
- audio/video daily counters для этого этапа не изменились.

#### P3.9.8.3 — Video / Screen Runtime Hardening ✅

Закрыт полный hardening-цикл для camera video и screen-share runtime:

- intent/capability/source contract централизован;
- LiveKit publish grants переведены на fail-closed source restrictions;
- webhook lifecycle защищён от duplicate/out-of-order delivery;
- terminal session/track state и first terminal reason сохраняются;
- source mismatch и active room policy enforcement реализованы;
- Gateway track contract расширен безопасным media-session context;
- diagnostics расширены source-specific usage и stale/orphan/runtime counters;
- corrective diagnostics fixes по DB column mapping, `last_session_at` и audit meta sanitization применены и проверены;
- новые таблицы и миграции не потребовались.

#### P3.9.8.3.1 — Intent / Capability / Source Contract Hardening ✅

Закрыто:

- добавлен единый internal `botMediaIntentPolicy` resolver;
- resolver покрывает `stats_only`, `listen`, `speak`, `listen_and_speak`, `video_publish`, `screen_share_publish`;
- capabilities normalization, expected publish sources, pre-create limits, audit и refresh-token используют один policy contract;
- `speak` и `listen_and_speak` разрешают только `AUDIO/MICROPHONE`;
- `video_publish` разрешает только `VIDEO/CAMERA`;
- `screen_share_publish` разрешает только `VIDEO/SCREEN_SHARE`;
- `listen` и `stats_only` не разрешают publication;
- refresh-token проверяет persisted capabilities против session intent;
- `BotTokenService` fail-closed:
    - `CanPublish=true` без sources → ошибка;
    - `CanPublish=false` с sources → ошибка.

#### P3.9.8.3.2 — Media Lifecycle Reconciliation ✅

Закрыто и regression-tested:

- webhook processor больше не проглатывает repository/usage/audit errors;
- room state очищается только после успешной публикации runtime event;
- `participant_joined`, `participant_left`, `track_published`, `track_unpublished`, `room_finished` приведены к согласованному lifecycle;
- duplicate active publish обновляет только безопасное mutable state и не сбрасывает lifecycle timestamps;
- один LiveKit track SID не может быть переиспользован другой media session;
- terminal или уже accumulated track не может быть повторно открыт delayed `track_published`;
- duplicate `track_unpublished` идемпотентен;
- missing publish + early unpublish фиксируется как terminal zero-duration row;
- stronger terminal state/reason не перетирается поздним webhook;
- abrupt bot process stop проверен:
    - track закрывается `unpublished/track_unpublished`;
    - usage начисляется один раз;
    - session завершается `ended/participant_left`;
- различие track `end_reason` и session `end_reason` зафиксировано как корректная семантика, а не ошибка.

#### P3.9.8.3.3 — Active Policy / Source Enforcement Hardening ✅

Закрыто и end-to-end проверено:

- actual published track сверяется с persisted media session intent;
- source contract:
    - `speak` / `listen_and_speak` → `AUDIO/MICROPHONE`;
    - `video_publish` → `VIDEO/CAMERA`;
    - `screen_share_publish` → `VIDEO/SCREEN_SHARE`;
    - `listen` / `stats_only` → publication forbidden;
- source mismatch приводит к revoke session, track termination, LiveKit participant removal и safe audit expected/actual;
- повторный enforcement идемпотентен и не создаёт double revoke/double usage;
- room policy `allow_speak=false` применяется к активным audio, camera и screen-share publish sessions;
- video policy revoke проверен:
    - session `revoked/policy_speak_blocked`;
    - track `unpublished/policy_speak_blocked`;
    - usage `6` seconds, `usage_accumulated_at` заполнен;
- screen-share policy revoke проверен с тем же contract и `6` seconds usage;
- `max_active_tracks_per_bot` продолжает считать AUDIO/CAMERA/SCREEN_SHARE;
- `max_active_speaking_bots_per_room` остаётся audio-only и считает `AUDIO/MICROPHONE`.

#### P3.9.8.3.4 — Contract & Observability Hardening ✅

Закрыто и end-to-end проверено:

- Gateway `voice.track.published` / `voice.track.unpublished` стабилизированы:
    - `track.sid`;
    - `track.type`;
    - `track.source`;
    - `track.muted`;
- bot track events получили optional safe `media_session`:
    - `session_id`;
    - `installation_id`;
    - `intent`;
    - `status`;
    - optional `end_reason`;
- Gateway contract проверен для:
    - `AUDIO/MICROPHONE` + `intent=speak`;
    - `VIDEO/CAMERA` + `intent=video_publish`;
    - `VIDEO/SCREEN_SHARE` + `intent=screen_share_publish`;
- policy revoke event проверен: `voice.track.unpublished` содержит `status=revoked` и `end_reason=policy_speak_blocked`;
- diagnostics summary расширен:
    - active/pending/ended/revoked/failed sessions;
    - published/unpublished/revoked/failed tracks;
    - source mismatch revokes;
    - runtime limit violations;
    - disconnect failures;
    - stale open sessions;
    - orphan published tracks;
    - active MICROPHONE/CAMERA/SCREEN_SHARE tracks;
    - audio/camera/screen usage duration;
- временное окно учитывает lifecycle timestamps, а не только `created_at`;
- track DTO содержит `usage_duration_sec` и `usage_accumulated_at`;
- добавлен audit action `bot.voice.media.disconnect_failure`;
- diagnostics routes зафиксированы:
    - `GET /servers/:serverID/bot-voice/diagnostics`;
    - `GET /rooms/:roomID/bot-voice/diagnostics`;
- corrective hardening:
    - scanner mapping исправлен с `livekit_room` на реальную GORM-колонку `live_kit_room`;
    - `track_s_id` mapping подтверждён;
    - `last_session_at` учитывает завершённые sessions;
    - internal audit meta `_ctx` удаляется из public response;
- итоговая проверка:
    - `livekit_room` возвращается для sessions/tracks;
    - `last_session_at` заполнен для комнаты с историей;
    - `_ctx` отсутствует;
    - `stale_open_sessions=0`;
    - `orphan_published_tracks=0`;
    - `disconnect_failures=0`;
    - usage summary совпадает с суммой track durations.

### P3.9.9 — Active Media Usage Monitor / Runtime Enforcement Worker 🚧

Цель:

Довести media runtime от observe-only duration accounting до production enforcement: корректно завершать просроченные media sessions, затем контролировать фактическую active duration и применять `enforced` limits / auto revoke без гонок, double accounting и orphan LiveKit participants.

#### P3.9.9.1 — Media Session Expiration Enforcement ✅

Закрыто и end-to-end проверено:

- существующий media-session cleanup переработан из DB-only cleanup в полноценный expiration enforcement lifecycle;
- `pending` session после истечения lease завершается без LiveKit removal, так как participant ещё не подключался;
- `active` session после истечения lease:
    - ждёт grace period;
    - удаляет bot participant из LiveKit через room admin service;
    - переводит session в `ended`;
    - сохраняет `end_reason=expired`;
    - закрывает/финализирует media lifecycle;
    - финализирует usage accounting;
    - пишет audit `bot.voice.media_session.expire`;
- grace period на текущем runtime установлен в `30s`;
- worker обрабатывает expiration пакетами и использует row locking / `FOR UPDATE SKIP LOCKED`, чтобы несколько backend-инстансов не выполняли один terminal transition одновременно;
- LiveKit/admin failure не должен оставлять ложный успешный DB terminal state; failure фиксируется через `bot.voice.media.disconnect_failure` и может быть повторно обработан;
- refresh/expiration race hardened:
    - refresh разрешён только для `pending/active` refreshable session;
    - успешный refresh продлевает `BotMediaSession.expires_at`;
    - новый LiveKit JWT выдаётся без разрыва существующего WebRTC connection;
    - старый `expires_at` после refresh больше не должен использоваться worker-ом;
- developer contract закреплён:
    - refresh должен выполняться до `expires_at`;
    - grace period является worker safety window, а не дополнительным refresh TTL.

End-to-end проверки от 2026-08-25:

1. **Expiration без refresh**
- active `video_publish` session вручную получила короткий `expires_at`;
- после окончания lease + ~30s grace бот фактически исчез из LiveKit voice room;
- DB: session `ended/expired`;
- audit: `bot.voice.media_session.expire`;
- audit meta подтвердил:
    - `was_active=true`;
    - `participant_removed=true`;
    - `usage_finalized=true`;
    - `grace_period_sec=30`;
- `bot.voice.media.disconnect_failure` для тестовой session отсутствовал.

2. **Refresh continuity**
- active `listen` session получила короткий старый `expires_at`;
- до истечения выполнен `POST /bot/voice/media-sessions/:sessionID/refresh-token`;
- `expires_at` продлился примерно на 5 минут;
- session осталась `active` после старого `expires_at + grace`;
- текущий LiveKit connection не прервался;
- worker завершил session только после уже нового `expires_at + grace`;
- финальный state: `ended/expired`.

Проверенный timing refresh-continuity сценария:

- старый `expires_at`: `2026-08-25 12:37:47Z`;
- новый `expires_at` после refresh: `2026-08-25 12:42:21Z`;
- после старой expiration boundary session продолжала оставаться `active`;
- `ended_at`: `2026-08-25 12:42:56Z`;
- `end_reason=expired`;
- фактическая задержка после нового expiry ~35 секунд соответствует `30s grace + worker tick`.

Итог:

- media-session lease теперь является реально enforced server-side lifecycle contract;
- refresh продлевает lease без необходимости прерывать полезную voice/media работу бота;
- бот, который перестал refresh-ить lease, не может бесконечно оставаться подключённым к LiveKit;
- P3.9.9.1 закрыт.

#### P3.9.9.2 — Active Media Usage Monitor ✅

Фактический runtime уже реализует:

- periodic scan active media sessions;
- active `AUDIO/MICROPHONE` track usage без постоянной записи duration на каждом tick;
- объединение текущего active usage с finalized daily usage;
- session/daily duration decisions через `BotMediaRuntimeLimiter`;
- violation counters/logging и report cooldown;
- runtime wiring через `StartBotMediaActiveUsageMonitor`.

#### P3.9.9.3 — Duration Limit Enforcement / Auto Revoke ✅

Реализация присутствует в runtime и подтверждена E2E 2026-11-18:

- `enforced` duration decision вызывает `EnforceBotMediaDurationLimit` и при policy `AutoRevoke` отзывает session;
- переход состояния `active → revoking → revoked` с контролируемым отключением LiveKit participant;
- session-duration limit 10 секунд → `runtime_speak_session_duration_limit`;
- daily-duration limit 25 секунд → `runtime_daily_speak_duration_limit`;
- worker финализирует usage, предотвращается двойное начисление в проверенных сценариях;
- режим `observe_only` сохранён как альтернативная политика.

**Статус:** ✅ E2E PASS для обоих типов duration limit. Длительный нагрузочный прогон и инфраструктурные fault windows вынесены в отдельный deferred backlog.

#### P3.9.9.4 — Recovery / Idempotency / Observability ✅ (bounded proof)

Реализовано и проверено 2026-11-18—19:

- `StartBotMediaDurationRevokeRecoveryWorker`, периодический recovery зависших `revoking` sessions;
- optimistic PostgreSQL CAS по `updated_at` для защиты от multi-worker contention;
- retry после сбоя `LiveKit.RemoveParticipant`, оставление session в `revoking` до успешного завершения;
- восстановление после реального backend restart (`participant_removed=true`, `usage_finalized=true`);
- PostgreSQL integration test с mock LiveKit: первый вызов ошибка, retry завершает `revoked`;
- concurrent integration test: два scan, только один успешный recovery и один вызов `RemoveParticipant`;
- проверка стабильного usage accounting без двойных начислений;
- recovery-health/Prometheus snapshot: `stale_revoking_sessions=0`, `pending_usage_recovery_tracks=0`, recovery failed/scan errors `0`.

**Статус:** ✅ PASS по перечисленным сценариям. Нет утверждения о полностью проверенной работе при отказе Redis/PostgreSQL, о production multi-instance deployment и о полном длинном soak.

#### P3.9.10 — Media Runtime Dev Portal & Contract Stabilization ⚠️

Закрыто:

- REST OpenAPI contract;
- Gateway AsyncAPI contract;
- typed runtime event payloads;
- Gateway ACK/resume/lifecycle documentation;
- Scalar rendering для Gateway reference;
- message event per-installation content redaction contract.

Остаётся:

- Media Runtime Limits / Usage UI;
- release/deprecation policy;
- финальная сверка public voice identifiers / data minimization.

### P4.0 — Backend Hardening / Release Preparation ✅ / ⚠️

Цель: стабилизировать существующую функциональность и проверить backend перед публикацией Dev Portal, без расширения bot feature scope.

| Этап | Статус на 2026-11-19 |
|---|---|
| P4.0.1 OAuth refresh rotation/replay | ✅ Закрыт |
| P4.0.2 Outbound SSRF | ✅ Закрыт |
| P4.0.3 Event Scope Symmetry / Data Minimization | ✅ Закрыт |
| P4.0.4 Secret/Token Log Sanitization | ✅ Закрыт (для runtime логов; не устраняет обнаруженные `.env` в Git) |
| P4.0.5 SCA/dependency/container security gate | ✅ Закрыт в исходной проверке 2026-11-12; не означает отсутствие новых CVE позднее |
| P4.0.6 IDOR + Scope Downgrade | ✅ Закрыт |
| P4.0.7 Runtime mutation idempotency | ⏸️ Post-release |
| P4.0.8 Gateway/Media bounded soak + duration recovery | ✅ Проверенный subset закрыт; infra chaos/Go metrics отложены |
| P4.0.9 Formal API version/deprecation | ⏸️ Post-release |
| P4.0.10 Backup/Health/Smoke/Operational Readiness | ⚠️ Практические проверки пройдены, security/infra/rollback хвосты отложены |

**Принятое решение:** не вводить RC1/Docker-tag/Git-tag как обязательные действия. Следующий непосредственный этап — **Dev Portal UX Review**, затем frontend build, hosting/domain и публичный запуск. См. §9.

## Changelog после последнего обновления документации от 2026-06-26

### Актуализация 2026-11-19 — backend regression/smoke → Dev Portal publication

- **P4.0.8:** session/daily duration auto revoke, stuck `revoking`, usage idempotency, LiveKit failure/retry (integration mock), backend restart recovery и concurrent CAS recovery проверены; длительные infra fault windows оставлены открытыми.
- **P4.0.10:** локальный `pg_dump` базы `echo`, restore в `echo_restore_test` и проверка 69 таблиц/171 media sessions/73 media tracks/14 daily usage rows — PASS; тестовая БД удалена.
- Сохранён rollback image прежней сборки; реальный Docker rollback не выполнялся. Backend текущего VPS проверен как рабочая одиночная сборка, новый release tag не нужен.
- Добавлены `/healthz`, `/readyz` на metrics-порту 9090 и Docker healthcheck для distroless runtime; HTTP 204/204, Docker healthy, exit code 0 — PASS.
- `go test ./services/botplatform` — PASS (DB integration subset пропущен), Bot API auth 401/200, rooms/events API 200, Gateway session 200, WS hello/disconnect, `/help`, voice `/voicespeak` → `ended/bot_disconnect` — PASS.
- Prometheus recovery counters/gauges: 7 проверенных ошибок/stale/pending значений = 0; обязательность дальнейшего длинного наблюдения не снята.
- Secrets audit: `.env` и `EchoTalkClient/.env` отслеживаются Git, права на момент осмотра 644; backend запущен от root. Миграции через `AutoMigrate`, offsite backup и реальный rollback отложены по решению владельца.
- **Изменён процесс публикации:** не требуются формальные RC1, Git/Docker release-теги. Следующий этап — аудит Dev Portal для разработчика, исправления UX/контента, production build, хостинг, домен, HTTPS, публичный запуск.


### Актуализация 2026-11-13 — P4.0.8 bounded client proof + Webhook Retry (PARTIAL PASS)

*Историческая запись о состоянии на 2026-11-13. Финальные результаты duration/recovery от 2026-11-18 и дальнейшие решения отражены выше, в актуализации 2026-11-19 и §9.*

- Gateway client disconnect/reconnect восстановлен за 1260 мс; за 10 минут доставлены 40/40 voice lifecycle events без duplicate event IDs, `invalid_resume=0`;
- media lifecycle 10/10: created/active/ended, `errors=[]`, `unresolved=[]`, `end_reason=bot_disconnect`;
- Docker resource snapshots backend/Redis/PostgreSQL/LiveKit без runaway в тестовом окне; это не заменяет Go goroutine/heap metrics и длительный soak;
- Media Recovery Health проверен через `/metrics`: нет stale revoking sessions, pending usage recovery tracks, failed recovery sessions и scan errors на момент замера;
- Webhook Retry Proof: временный `503`, последующая попытка `200`, 2/6 attempts, terminal `success`; результат подтверждён SQL и логами Node.js-бота;
- исправлено двойное сохранение non-2xx HTTP attempt в webhook worker;
- P4.0.8 остаётся 🚧: Redis/PostgreSQL/LiveKit/backend failure recovery, enforced duration revoke/worker restart, backlog/orphan invariants и Go runtime metrics не завершены;
- P4.0.10 не начинать как закрытый gate до завершения P4.0.8.

### Актуализация 2026-11-13 — P4.0.6 закрыт

- P4.0.6 Cross-installation IDOR + Scope Downgrade Regression закрыт;
- исправлен central runtime-context path: `getBotRuntimeContext()` использует только effective scopes из `BotAuthMiddleware`, предотвращая повторное расширение прав из raw `installation.GrantedScopes`;
- runtime-context fail-closed при отсутствии/некорректном `botGrantedScopes`;
- batch `permission_check` приведён к единому security path через `validatePermissionCheckAccess`, включая проверку room visibility bot user;
- interaction ACK/Callback regression подтверждает isolation по `BotInstallationID + BotID`;
- media runtime подтверждён installation-scoped:
    - `ListMediaSessions` фильтрует по `installation_id`;
    - `GetMediaSession`, `RefreshMediaSessionToken`, `DisconnectMediaSession` используют `installation_id + session_id`;
- добавлены regression tests для effective scopes/server boundary, interaction IDOR и media-session IDOR;
- следующий и предпоследний обязательный gate перед RC1 — P4.0.8 Gateway + Media Soak / Chaos Proof;
- после P4.0.8 остаётся только P4.0.10 Release Candidate Checklist / Rollback / Backup Verification.

### Актуализация 2026-11-12 — Release Scope Freeze

*Исторический план на 2026-11-12; процесс релиза позднее изменён решением от 2026-11-19 (см. §9).*

- P4.0.1 OAuth refresh rotation/replay hardening закрыт;
- P4.0.2 outbound SSRF hardening закрыт;
- P4.0.3 event scope symmetry/data minimization закрыт;
- P4.0.4 secret/token log sanitization закрыт;
- P4.0.5 dependency/SCA/container gate закрыт:
    - `govulncheck`: 0 reachable vulnerabilities;
    - Trivy source dependency scan: 0 Go/Python HIGH/CRITICAL vulnerabilities;
    - Trivy backend image scan: 0 HIGH/CRITICAL vulnerabilities;
    - frontend `npm audit`: предупреждения закрыты обновлением dependency tree;
    - backend root runtime принят как временное documented exception из-за прямого чтения Let's Encrypt private key;
- SQL dump artifacts с OAuth material удалены из рабочего дерева;
- release scope заморожен: до 1.0 обязательны только P4.0.6, P4.0.8 и P4.0.10;
- P4.0.7 и P4.0.9 перенесены в P4.1/post-release, если regression/soak не выявят конкретный release blocker;
- целевой путь зафиксирован: `P4.0.6 -> P4.0.8 -> P4.0.10 -> RC1 -> production smoke -> v1.0.0`.


### Актуализация 2026-11-11

- Gateway hardening: durable ACK ordering, expired backlog filtering, replay queue/close concurrency hardening;
- REST API reference стабилизирован в OpenAPI;
- Gateway reference стабилизирован в AsyncAPI 1.1.x;
- AsyncAPI получил typed payload variants для публичных runtime events и examples;
- Dev Portal использует отдельные REST / Gateway reference views;
- `message.content.view` распространён на event delivery: per-installation redaction выполняется до webhook persistence / Gateway backlog;
- regression tests для message event redaction проходят;
- roadmap переведён из feature-expansion режима в P4.0 Release Candidate Hardening;
- security review выявил release-gate задачи: OAuth refresh rotation, outbound SSRF validation, event scope symmetry/data minimization, token-log sanitization, SCA.

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
- `P3.9.8.2 — Bot Screen Share Publish Capability: SCREEN_SHARE grant/source, test bot /screenpublish flow, Gateway/track/usage end-to-end verified`
- `P3.9.8.3.1 — Intent / Capability / Source Contract Hardening: unified intent policy + fail-closed LiveKit sources`
- `P3.9.8.3.2 — Media Lifecycle Reconciliation: duplicate/out-of-order webhook safety + terminal state preservation`
- `P3.9.8.3.3 — Active Policy / Source Enforcement Hardening: camera/screen policy revoke + source mismatch enforcement`
- `P3.9.8.3.4 — Contract & Observability Hardening: Gateway media_session context + extended diagnostics`
- `P3.9.8.3.4.1 — Diagnostics corrective: live_kit_room mapping, last_session_at, audit _ctx sanitization`
- `P3.9.7.2.1 — Voice Track Control Hardening: service/use-case extraction, source-aware resolver, strict bot boundary, mute/unmute audit + diagnostics integration, end-to-end verified`
- `P3.9.9.1 — Media Session Expiration Enforcement: active participant removal after expires_at + grace, refresh race hardening, multi-instance locking, usage finalization, end-to-end verified`

## Observability

### Реализовано

- structured runtime logs
- Prometheus application metrics (`echotalk_http_*`, `echotalk_bot_*`); стандартные Go/process collectors пока не подтверждены/не экспортируются
- runtime protection audit trail
- gateway diagnostics UI
- runtime protection diagnostics UI
- delivery attempts tracking
- voice/media session audit
- voice/media admin diagnostics
- bot media track state diagnostics
- media runtime limit audit через `bot.voice.media.runtime_limit`
- media usage daily accounting через `bot_media_usage_daily`
- screen-share lifecycle diagnostics через `VIDEO/SCREEN_SHARE` track state и Gateway events
- Gateway bot track events содержат safe `media_session` context для correlation session ↔ participant ↔ track
- source contract audit содержит expected/actual type/source и validity
- diagnostics summary разделяет active/usage по MICROPHONE, CAMERA и SCREEN_SHARE
- stale session / orphan track / disconnect failure counters
- lifecycle time-window queries учитывают end/unpublish/usage timestamps
- diagnostics DB mapping для `live_kit_room` / `track_s_id` проверен на реальной PostgreSQL schema
- `last_session_at` показывает последнюю session комнаты независимо от terminal status
- public diagnostics audit meta очищается от internal `_ctx`
- voice track control audit `voice.track.mute` / `voice.track.unmute` реализован и включён в diagnostics counters
- media session expiration audit `bot.voice.media_session.expire` реализован; meta включает `was_active`, `participant_removed`, `usage_finalized`, `grace_period_sec`, `expired_at`
- expiration disconnect failures фиксируются отдельным `bot.voice.media.disconnect_failure`
- 2026-11-13: проверены recovery-health counters (`stale_revoking_sessions=0`, `pending_usage_recovery_tracks=0`, recovery errors/failures=0); это snapshot, а не доказательство восстановления после отказа
- 2026-11-13: Docker CPU/RAM/PIDs sampled в 10-минутном окне; Go `go_goroutines`, heap/GC и process series в `/metrics` отсутствовали — отдельное измерение отложено
- 2026-11-19: `/metrics` доступен, все 7 проверенных recovery error/stale/pending значений — `0`; healthz/readyz возвращают `204`, Docker отмечает backend как `healthy`

---

## 11. Вывод

### Текущее состояние на 2026-11-19

Backend Bot Platform реализован и работает на VPS: OAuth/install/credentials, webhook/WS Gateway (ACK/resume/replay), slash commands, interactions, resource/context API, RBAC, moderation, roles, voice/media и runtime protection. Существуют REST OpenAPI и Gateway AsyncAPI.

**Проверено:** в ноябре выполнены session/daily duration revoke, recovery после сбоя/restart/конкурентной гонки, PostgreSQL backup/restore, health/readiness, unit regression subset, HTTP/Gateway/Slash/Voice smoke и Recovery Metrics snapshot. Это достаточный проверенный функциональный объём для начала публикационной работы по Dev Portal, **но не эквивалент полного отказоустойчивого, security- и нагрузочного аудита**.

### Что осталось до публичного запуска

**Основная задача — клиент Dev Portal:** оценить понятность интерфейса для нового разработчика, исправить UX/onboarding проблемы, собрать production frontend, разместить на хостинге, подключить домен и HTTPS, выполнить реальный путь регистрации/установки бота через опубликованную страницу.

Официальный запуск будет означать **публичную доступность Dev Portal**. Отдельные backend RC1, Git-теги или Docker release-теги для этого не требуются.

### Что сознательно не закрыто

- автоматический `AutoMigrate` без отдельного миграционного rollback;
- offsite backup и реальный Docker rollback;
- controlled Redis/PostgreSQL fault windows и длительные Go/backlog/orphan стресс-проверки;
- Media Limits/Usage UI, interaction inspector, официальный SDK, global Search API — после запуска.

➡️ **Текущий этап: Dev Portal — UX Review → frontend build → hosting/domain → официальный запуск.** Подробные сценарии проверки и ограничения — §9.

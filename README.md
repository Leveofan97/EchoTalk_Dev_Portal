# EchoTalk Bot Developer Portal — Статус реализации

**Дата обновления:** 2026-11-25

**Версия ТЗ:** Bot Developer Portal.pdf (февраль 2026)  
**Исторический базовый релиз:** release 0.22.0; backend Bot Platform работает на VPS. Последующие изменения DP 3.10.1 прошли локальный staging, но развёртывание всего актуального security-набора на VPS и post-deploy regression ещё не подтверждены. Формальные Docker/Git release-теги по-прежнему не обязательны.  
**Текущий рабочий статус:** backend Bot Platform реализован, исторические backend smoke/E2E, media duration/recovery и ограниченные эксплуатационные проверки 2026-11-18—19 пройдены. P4.0.1–P4.0.6 закрыты в историческом объёме, P4.0.8 принят по проверенным сценариям, P4.0.10 закрыт частично. DP 3.9.1–3.9.5: локальный OAuth E2E и Developer Onboarding завершены (84/84 тестов предыдущей серии). **DP 3.10.1 — OAuth & Tokens Security Audit завершён в запланированном объёме (STAGING VERIFIED, 2026-11-25): финальная регрессия 110 PASS / 0 FAIL / 4 SKIP; все четыре пропущенных блока проверены отдельно, 12/12 контрольных блоков завершены.** Полный security audit, публичная публикация Dev Portal и production-проверка накопленных исправлений ещё не завершены.

**Следующий этап: DP 3.10.2 — RBAC & IDOR Security Audit.** Перед обновлением VPS — backup, проверка миграций и совместимости, план rollback и post-deploy smoke. Затем DP 3.10.3–3.10.4, DP 3.11 — финальный общеплатформенный E2E/regression, DP 3.12 — публикация/production readiness и решение GO / NO-GO. Формальные RC1/Git/Docker-теги не обязательны; release-blocking security риски остаются обязательными к рассмотрению.

**Обозначение:** исторические `P3.9.x` ниже — этапы **backend Voice/Media API**; новые `DP 3.9.x–3.12` — этапы **Dev Portal**. Это разные дорожные карты.

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

**Dev Portal — отдельная линейка DP (новое по состоянию на 2026-11-25):**

- **DP 3.1–3.8 — ✅** основные UX/onboarding-страницы, создание и настройки бота, credentials, OAuth-настройки, установки, webhook/gateway diagnostics, каталог и API-документация реализованы в предыдущих итерациях.
- **DP 3.8.1 — ✅** README бота (`readme_md`, ограничение 64 КБ), Markdown-редактор и безопасное отображение в публичной карточке.
- **DP 3.9 — ✅ по локальному QA:** frontend tests, read-only API smoke, Bot REST/Gateway и OAuth refresh/revoke пройдены в описанных сценариях; полный публичный E2E не выполнялся.
- **DP 3.9.1 — ✅ OAuth redirect flow:** `OAuth Start URL`, браузерный redirect на Go backend бота, `state`, callback, обмен кода и `/bot/me` подтверждены реальным локальным тестом; ручная выдача кода в модальном окне заменена автоматическим переходом.
- **DP 3.9.x UI/docs (этапы 3.9.1–3.9.5) — ✅ по реализованным изменениям:** единый вид OAuth Start URL/Redirect URI, HTTP-контракты, end-to-end Quick Start, устранение ссылок на приватный исходный код и путаницы localhost/HTTPS, публичный Go OAuth demo в `public/examples/oauth-demo/main.go`.
- **DP 3.10 — 🚧** Security Audit в работе: DP 3.10.1 закрыт в проверенном объёме; DP 3.10.2–3.10.4 остаются открытыми.
- **DP 3.10.1.1–3.10.1.6 — ✅** JWT/User Auth, Bot Token Lifecycle, Credentials Rotation, OAuth Code/State, PKCE/Redirect URI и OAuth Rate Limiting реализованы и проверены в рамках DP 3.10.1.
- **DP 3.10.1.7 — ✅ STAGING VERIFIED:** Security Regression & OAuth E2E, Gateway lifecycle/backlog isolation, User Recovery & Session Security, Redis Outage Fail-Closed и Linux Go Race Detector. Финальный отчёт: `security-report-20261125T105918.114319400Z.json` — 110 PASS / 0 FAIL / 4 SKIP (четыре блока проверены отдельно).
- **DP 3.10.2 — ⏳ следующий этап:** RBAC & IDOR Security Audit; DP 3.10.3 Browser & HTTP и DP 3.10.4 Runtime & Infrastructure/Dependencies ещё впереди.
- **DP 3.11 — ⏳** сквозные E2E/regression и негативные сценарии после исправлений.
- **DP 3.12 — ⏳** публичная сборка/хостинг/домен/HTTPS, продакшн-проверки и release decision.

➡️ **Текущий этап: DP 3.10.2 — RBAC & IDOR Security Audit.** DP 3.10.1 завершён по локальному staging; production rollout накопленных security fixes и контрольная проверка на VPS не подтверждены. Полный security gate и публичная сборка ещё впереди (см. §9.6).

### 0.1 Оценка готовности к первому публичному запуску

Статус на 2026-11-25 (инженерная/продуктовая оценка, не KPI). Исторические backend-проверки 2026-11-18—19 дополнены локальным OAuth/UX QA и Security Regression DP 3.10.1 от 2026-11-25. Числовые проценты общей готовности не используются; 12/12 относится только к контрольным блокам DP 3.10.1.7.

| Область | Статус | Комментарий |
|---|---|---|
| Bot Platform functional core | ✅ Проверено | OAuth/runtime, Gateway, commands, resource API, LiveKit/media функциональность ранее реализованы; в ноябре выполнены контрольные smoke-тесты |
| REST / Gateway contracts | ✅ Реализовано | OpenAPI/AsyncAPI и typed events; Developer Onboarding/Quick Start переработаны, но их UX на публичном домене ещё не проверен |
| Media duration/recovery | ✅ Проверено в ограниченных сценариях | E2E duration/daily revoke, stuck `revoking`, restart, LiveKit failure mock, concurrent CAS, usage stability |
| Operations / recovery | ⚠️ Есть отложенные проверки | backup/restore и readiness пройдены; Redis OAuth fail-closed и восстановление проверены на staging; PostgreSQL/LiveKit outage, runtime-wide Redis failure, реальный rollback и длительный soak ещё не проверены |
| Security | ⚠️ DP 3.10.1 STAGING VERIFIED | 110 PASS / 0 FAIL / 4 SKIP (проверены отдельно); JWT, OAuth/PKCE, token lifecycle, Gateway, user sessions и OAuth rate limiter проверены в описанных сценариях. RBAC/IDOR, browser/HTTP, runtime/dependencies и production deployment ещё впереди; известные infra/secret риски открыты |
| Developer Portal UX / onboarding | ✅ Основная итерация завершена, финальный UX smoke впереди | OAuth settings UI, публичный каталог/README, Quick Start, примеры HTTP/Gateway/Webhook и скачиваемый Go OAuth demo; локальная проверка 84/84 тестов, без подтверждения широкого пользовательского тестирования |
| Публичная публикация Dev Portal | ❌ Не подтверждена | production build/typecheck на актуальной интеграции, размещение и проверка HTTPS/домен/CORS/SPA, final UX/E2E и security sign-off ещё впереди |

**Принятое решение по выпуску:** сохраняем принцип одной рабочей backend-сборки на VPS без обязательных формальных RC1/Git/Docker-тегов. Публичный выпуск — готовый Dev Portal; при этом проверенные security fixes должны быть развёрнуты контролируемо, с backup, совместимыми миграциями, rollback plan и post-deploy проверками. Staging PASS не равен production deployment.

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

➡️ **Текущий этап: DP 3.10.2 RBAC & IDOR; DP 3.10.1 и его E2E завершены на staging.** Evidence и план дальнейшего запуска — §9.6; исторические P4.0.8/P4.0.10 сохраняются.


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
| Gateway backlog | Gateway events сохраняются для resume/replay; текущая generation (`GatewayEpoch`) ограничивает replay/read | ✅ staging (DP 3.10.1.7) |

---

## 2. Компоненты архитектуры

### 2.1 Bot Developer Portal ✅

| Функция | Статус | Примечание |
|---------|--------|------------|
| Создание Bot App | ✅ | `POST /dev/bots` |
| Редактирование | ✅ | `PUT /dev/bots/:id` |
| Удаление | ✅ | `DELETE /dev/bots/:id` |
| Redirect URLs | ✅ | `bot_app_redirect_uris`; добавление и удаление в модальном диалоге |
| OAuth Start URL | ✅ | `bot_apps.oauth_start_url`, переход к backend бота перед OAuth; UI управления через модалку |
| Credentials / secrets / rotation | ✅ | `bot_credentials` + rotate |
| Публичный каталог | ✅ | `GET /api/public-bots`, `GET /api/public-bots/:id` |
| Допустимые scopes | ✅ | `GET /dev/bots/available-scopes` |
| UI install flow | ✅ | browser → bot `/oauth/start` → Dev Portal server/scopes/confirm → bot `/oauth/callback` → token exchange; E2E подтверждён |
| Slash commands UI | ✅ | создание / редактирование / включение |
| Webhook URL | ✅ | настройка на installation |
| Command Base URL | ✅ | настройка на installation |
| Transport select webhook/ws | ✅ | настройка на installation |
| Deliveries / attempts UI | ✅ | просмотр доставок и попыток |
| Gateway status UI | ✅ | реализовано |
| Runtime Protection UI | ✅ | лимиты, burst, violations, auto-block |
| Event Replay UI | ✅ | просмотр сохранённых Gateway events по installation |
| README бота и публичная карточка | ✅ | Markdown до 64 КБ, sanitization, редактор, описание в каталоге |
| Developer Quick Start | ✅ | объяснение OAuth с едиными HTTPS-примерами, HTTP-контрактами, installation/server/room, REST и событиями |
| Публичный OAuth Go demo | ✅ в исходниках | `public/examples/oauth-demo/main.go`, запуск внешним разработчиком без доступа к приватному репозиторию; доступность через публичный домен ещё проверить |
| Event subscriptions search UI | ✅ | поиск событий подписки в Dev Portal |
| Interaction inspector | ❌ | planned |
| Версии / релизы | ❌ | нет |

### 2.2 Bot Auth Service ✅

| Функция | Endpoint | Статус | Примечание |
|---------|----------|--------|------------|
| Authorization Code flow | `POST /oauth/authorize` | ✅ | browser E2E; обязательны зарегистрированный точный Redirect URI, `state`, PKCE S256 (DP 3.10.1) |
| Обмен code на токены | `POST /oauth/token` | ✅ | client credentials, точный `redirect_uri`, `code_verifier`, одноразовый code; конкурентный redemption PASS на staging |
| Refresh token flow | `POST /oauth/token/refresh` | ✅ | atomic rotation, replay/reuse protection и concurrent refresh regression закрыты в P4.0.1 |
| Ротация credentials | `POST /dev/bots/:id/credentials/rotate` | ✅ | CAS rotation: один победитель; pending codes старого credential инвалидируются, действующие access tokens сохраняются (staging) |
| OAuth code / state storage | PostgreSQL | ✅ | digest, TTL, одноразовость, rollback/atomic consume (staging/integration) |
| Redirect URI / PKCE | authorize + token | ✅ | S256 обязателен, plain/missing отклоняются; HTTP loopback только для явно разрешённых тестовых BotApp ID |
| OAuth rate limiting | authorize/token/refresh/credentials | ✅ | Redis atomic quota, bounded payload, 429/503, fail-closed при отказе Redis (staging) |
| Привязка code к credential | `bot_oauth_codes.credential_id` | ✅ | исправлено |
| OAuth Start URL | `bot_apps.oauth_start_url` / `PUT /dev/bots/:id` | ✅ по E2E | GORM должен явно использовать `column:oauth_start_url`, чтобы не создавать `o_auth_start_url` |
| Отзыв установки | `DELETE /servers/:serverID/bots/:installation_id` | ✅ | revoke installation/tokens |

### 2.3 Bot API Gateway / Runtime ✅

| Компонент | Статус | Примечание                              |
|-----------|--------|-----------------------------------------|
| `BotAuthMiddleware` | ✅ | проверка типов токенов и effective scopes; Gateway session token не является Bot Access Token |
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
| Gateway resume | ✅ | replay missed events по `last_ack_seq`; проверка текущего connection/epoch/scopes, E2E на реальном событии |
| Gateway single-use session token | ✅ | replay/reconnect/concurrent handshake regression; только один победитель при повторном использовании (staging) |
| Gateway lifecycle authorization | ✅ | suspend/revoke/reinstall и runtime configuration changes закрывают старое соединение и инвалидируют соответствующие session tokens (staging) |
| Gateway epoch isolation | ✅ | текущая generation для backlog, ACK/resume и REST reads; старые события не возвращаются после смены подписок или reinstall (staging) |
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
- current `GatewayEpoch`, expiry, event subscription и scope filtering для list/detail/context/batch и Dev Portal event list (DP 3.10.1.7, staging)
- прежние поколения недоступны для replay; sequence не сбрасывается
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
    - `gateway_epoch` (default 0 для исторических записей)
- `BotInstallation` (дополнение DP 3.10.1.7)
    - `gateway_epoch` (default 1) — текущая authorization generation Gateway
    - не повышать epoch старых событий при миграции; они недоступны и удаляются по retention
    - новая generation при релевантных lifecycle/config transitions; обычный reconnect/credential rotation сохраняют epoch и последовательность seq

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

**Актуальный сценарий (DP 3.9.1 + DP 3.10.1.5):** разработчик задаёт `OAuth Start URL` и зарегистрированный `Redirect URI`; backend бота создаёт случайные `state` и `code_verifier`, вычисляет `code_challenge` (S256) и хранит state/verifier на своей стороне. Браузер открывает Dev Portal с `state`, `redirect_uri`, `code_challenge`, `code_challenge_method=S256`; пользователь подтверждает сервер и scopes. Dev Portal передаёт эти параметры в `/oauth/authorize`, затем переходит по `redirect_to`. Backend бота проверяет `state` и обменивает code через `/oauth/token` с `client_id`, `client_secret`, исходным `redirect_uri` и `code_verifier`, затем вызывает `/bot/me`. Client secret и runtime-токены не передаются через browser redirect. Исторический локальный flow на порту 3001 завершился `OAuth callback and /bot/me succeeded. (TEST ONLY: tokens not stored.)`; обновлённый PKCE-flow отдельно подтверждён browser E2E на staging. Production — HTTPS; HTTP loopback только для выделенных BotApp ID из `BOT_OAUTH_LOOPBACK_BOT_IDS` (по умолчанию пусто).

| Шаг | Статус |
|-----|--------|
| Выбор сервера | ✅ |
| Выбор scopes | ✅ |
| `/oauth/authorize` | ✅ |
| Выдача code и redirect_to на callback | ✅ |
| `/oauth/token` | ✅ |
| Создание installation | ✅ |
| Создание bot user | ✅ |
| Добавление bot user в server participants | ✅ | Нужно для отображения/модерации бота как участника сервера |
| Выдача access/refresh token | ✅ |
| Проверка `state` на callback и автоматический обмен code | ✅ E2E |
| Проверка access token через `/bot/me` после обмена | ✅ E2E |
| PKCE S256 / точное совпадение Redirect URI | ✅ staging E2E |
| Replay/concurrent redemption, refresh rotation и revoke/reinstall | ✅ staging E2E |

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
| Gateway real event delivery → ACK → Resume → REST | ✅ staging E2E |
| Gateway subscription epoch / reinstall backlog isolation | ✅ staging E2E |
| Gateway concurrent connect / revoke и runtime config lifecycle | ✅ staging E2E (bounded) |

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
| Cross-installation / cross-server IDOR regression | ✅ | P4.0.6: resource/event/interaction/media boundaries проверены; batch permission check использует единый access validator; media session Get/List/Refresh/Disconnect изолированы по `installation_id`; расширенная ревизия DP 3.10.2 впереди |
| User JWT validation | ✅ | DP 3.10.1.1: HS256, signing key из окружения, expiry/issuer/session validation; tampered/alg none, token-type confusion, ordinary user admin denial проверены |
| OAuth code / state / PKCE | ✅ | digest, TTL, atomic consume, обязательный S256, exact redirect, ограниченный HTTP loopback; DP 3.10.1 staging |
| Credential rotation / token lifecycle | ✅ | atomic rotation/revoke, no secret metadata, pending code invalidation, one active installation, old token denial after reinstall |
| OAuth Rate Limiter Fail-Closed | ✅ | Redis outage: пять защищённых routes возвращают 503 + `rate_limiter_unavailable`, `Retry-After`, `Cache-Control: no-store`; восстановление подтверждено |
| Gateway authorization generation | ✅ | single-use session tokens, current connection fence, epoch-bound delivery/replay/read; live E2E PASS, room-level RBAC отдельно |
| User recovery & session revocation | ✅ | recovery TTL/attempt limit/one-time, atomic login/revoke, exact-session kick, Refresh WS continuity, concurrent Login/Reset, Logout E2E PASS |
| Backend race detector | ✅ | Linux CGO `go test -race`: пять тестируемых пакетов PASS; `auth` без test files; не доказывает отсутствие гонок за пределами покрытия |
| Production deployment DP 3.10.1 | ⚠️ | полное развёртывание последнего staging-набора и post-deploy smoke не подтверждены |

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

**Уже закрытая утечка:** message content больше не должен обходить `message.content.view` через Webhook/Gateway: event payload redaction выполняется per-installation до persistence и replay. DP 3.10.1.7 дополнительно проверяет current generation и scope filtering для Gateway backlog/read paths. Это не заменяет ревизию комнатного RBAC и Webhook в DP 3.10.2/3.10.4.

Дополнение release risk matrix после DP 3.10.1:

| Риск | Статус | Release action |
|---|---|---|
| JWT tampering / token-type confusion / admin access | ✅ staging regression | post-deploy safe smoke |
| OAuth code/state replay, credential rotation race, PKCE downgrade | ✅ staging regression | синхронное обновление backend/Dev Portal/examples; повторить browser flow |
| Gateway session replay, stale connection, stale backlog | ✅ staging regression | проверить schema/epoch и взаимодействие с Interaction Runtime до релиза |
| User session races / password recovery / stale WS | ✅ staging regression | post-deploy проверка Login/Refresh/Logout без затрагивания чужих сессий |
| Redis OAuth limiter fail-open | ✅ staging outage | отдельно проверить прочие runtime/dependency fault paths |
| Room-level RBAC, privilege escalation, cross-tenant access | 🚧 DP 3.10.2 | расширенная отрицательная матрица прав |
| Browser/HTTP, secrets, supply chain, infrastructure | 🚧 DP 3.10.3–3.10.4 | актуальный audit и решение по release blockers |

---

## 8. Что реально работает прямо сейчас

### Как разработчик бота

- создать Bot App
- редактировать его
- управлять credentials
- ротировать credentials
- публиковать бота
- видеть публичный каталог
- получать authorization code через OAuth Redirect/Callback (без ручного копирования кода)
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

**Backend (решение 2026-11-19):** одна рабочая сборка Go на VPS; не вводим обязательный Git-tag, Docker release-tag, RC1-процедуру и повторное развёртывание ради формальности. Для rollback сохранён отдельный Docker image прежней сборки, но реальный откат пока не тестировался. Дополнение 2026-11-25: накопленные DP 3.10.1 security fixes требуют контролируемого обновления VPS; полное применение последнего staging-набора ещё не подтверждено.

**Публичный релиз Bot Platform:** удобный для разработчика, собранный и размещённый на публичном хостинге **Dev Portal**, доступный по домену с HTTPS и понятным процессом регистрации/установки ботов. Не путать готовность backend с готовностью публичного developer experience.

```text
Backend: рабочая сборка на VPS → security fixes проверены на staging → controlled deploy/smoke
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
| Redis/PostgreSQL outage / восстановление | На момент P4.0.8 не проводилось; позднее DP 3.10.1 проверил OAuth Redis limiter на staging | ⏸️ Полный runtime/media outage отложен |
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

**Границы smoke:** базовые установка/OAuth flow, interactive components, video/screen publish и весь набор RBAC проверялись на более ранних этапах. В финальном backend-прогоне 2026-11-19 **не переиспытан целиком** путь `создать бота → scopes → установить → code → token → interaction → media`. **Позднее, в DP 3.9.1, отдельно прошёл E2E OAuth Start → Callback → `/bot/me`**, однако он не заменяет полного прогона interactions/media и UX с публично размещённого Dev Portal. Эти сценарии остаются в DP 3.11.

### 9.4 Осознанно отложенные проверки и риски (не считать закрытыми)

| Приоритет | Тема | Что обнаружено или осталось | Текущее решение |
|---|---|---|---|
| **Высокий** | Secrets в Git | `.env` и `EchoTalkClient/.env` отслеживаются Git; на VPS имели `644`; содержимое и история не проверялись | Отложено владельцем. Требуются исключение из индекса/истории по плану, ротация секретов и права `600` |
| **Высокий** | Container privilege | Backend-процесс выполняется от `root`; private TLS key читается приложением | Отложено; отдельно спланировать non-root / TLS termination |
| **Средний/высокий** | Offsite backup | Есть проверенная локальная копия на том же VPS, но нет подтверждения удалённой резервной копии | Отложено |
| **Средний/высокий** | Реальный Docker rollback | Старый image сохранён, но сценарий возврата после обновления ещё не выполнялся | Отложено |
| **Средний** | DB migration rollback | `ConnectDatabase()` при старте вызывает GORM `AutoMigrate`; схема не откатывается при возврате старого образа | Отложено по решению владельца; обратная совместимость обеспечивается перед релизом |
| **Средний** | Redis/PostgreSQL failure windows | OAuth Redis limiter fail-closed и восстановление подтверждены 2026-11-25 на staging; PostgreSQL outage, LiveKit/Redis runtime-wide failure и backlog/orphan invariants не проверены | Частично проверено, остаток DP 3.10.4 |
| **Средний** | Go runtime/backlog/orphan stress | Нет достаточного длинного stress/chaos proof с heap/goroutine и outage backlog | Отложено |
| **Низкий** | Debug permission logs | В production видны многословные `[PERMS DEBUG]` с набором разрешений | Рекомендуется выключить до публичного запуска |

Подробный отдельный список отложенных работ: `EchoTalk_P4.0.10_deferred_release_preparation.md` (зафиксирован ранее). Это не означает, что все перечисленные риски безопасны; особенно секреты в Git требуют отдельного устранения.

### 9.5 Dev Portal UX / Developer Onboarding — итерация завершена, итоговый sign-off ожидается ✅ / ⚠️

**Цель:** внешний разработчик должен самостоятельно зарегистрировать Bot App, настроить OAuth, получить токены, определить установку/сервер/комнату, отправить первое сообщение и подключить события. Вопросы UX и документации проработаны в DP 3.1–3.9.5; фактический путь OAuth подтверждён E2E. Окончательное утверждение безопасности и поведения на публичном домене — отдельные этапы.

| Направление | Фактически выполнено | Статус |
|---|---|---|
| Основной интерфейс Dev Portal | создание/управление ботом, credentials, installations, Gateway status, Runtime Protection, slash commands, event replay, публичный каталог | ✅ |
| README/карточка бота | `readme_md`, редактор/публичный Markdown, sanitization | ✅ |
| OAuth settings UI | Start URL и Redirect URI приведены к единой структуре с модалками управления | ✅ |
| Полный OAuth Flow | Start → Dev Portal → authorize → callback → token → `/bot/me`; локальная проверка с Go-сервером прошла | ✅ E2E |
| Quick Start / REST / Gateway docs | переработаны определения, адреса, HTTP-контракты, примеры, ошибки, security-примечания, installation/server/room, Gateway и Webhook | ✅ по локальному QA |
| Самостоятельный пример | Go OAuth demo в публичной папке frontend; отсутствие зависимости от приватного backend-репозитория | ✅ исходники, публикация не подтверждена |
| Локальный QA frontend | последняя серия сообщала 84/84 успешных теста; Go demo компилировался и проходил проверки start/invalid state | ✅ в рамках предыдущих проверок |
| Production UX smoke | тест реальным сторонним разработчиком на опубликованном HTTPS-хосте, прямые URL/перезагрузка SPA, адаптивность | ⏳ |

**Примечание:** локальный E2E использовал Dev Portal на `localhost:3000` и Go OAuth demo на `127.0.0.1:3001`. Это адреса конкретного теста, а не рекомендуемая конфигурация публичного бота; опубликованному боту необходим публичный HTTPS URL. Страница документации не должна ссылаться на закрытые `examples/*` из репозитория EchoTalk.

### 9.6 Следующие этапы Dev Portal — 3.10 → 3.11 → 3.12

#### DP 3.10 — Security Audit 🚧 (текущий: 3.10.2)

| Подэтап | Область проверки | Что считаем результатом |
|---|---|---|
| **3.10.1 OAuth & Tokens — ✅ STAGING VERIFIED** | JWT/user auth, token lifecycle, credentials, code/state digest/TTL, PKCE S256/exact redirect, OAuth limiter, Gateway lifecycle/backlog и user recovery | финальная регрессия 110 PASS / 0 FAIL / 4 SKIP; отдельные проверки выполнены; 12/12 блоков |
| **3.10.2 RBAC & API — ⏳ следующий** | owner access, installation/server boundary, cross-installation IDOR, effective scopes, downgrade, resource/interaction/voice permissions | отрицательные тесты доступа и отсутствие расширения полномочий |
| **3.10.3 Frontend & HTTP** | XSS/Markdown, браузерное хранение сессии, cookies/CSRF, CORS, CSP, security headers, unsafe redirects, ошибки и логирование | устранённые подтверждённые проблемы, production-safe headers |
| **3.10.4 Runtime & Dependencies** | Webhook/Gateway/commands abuse controls, SSRF, payload/timeouts, audit/PII, Go SCA, `npm audit`, контейнерные настройки | актуальные отчёты и решение по release blockers |

**Оставшиеся вопросы OAuth:** обязательный PKCE S256 и loopback policy реализованы и проверены в рамках DP 3.10.1. Проверить production-конфигурацию allowlist, unsafe Start URL/browser redirects, актуальные публичные docs/examples, browser session storage, поведение сторонних клиентов и ранее опубликованные секреты. Отдельно оценить refresh token family/reuse policy и восстановление при истечении refresh token, не считать их полностью покрытыми только по atomic rotation/replay regression. P4.0.1–P4.0.6 сохраняются как исторические проверки.

**Принцип исправлений:** изучаем актуальные файлы; без широкого рефакторинга; backend-валидация является источником истины; не ослабляем CSRF/CORS ради тестов; покрываем изменения Go table-driven/integration и Vue component/contract tests. API и документация корректируются только после фактического изменения контрактов.

##### DP 3.10.1 — OAuth & Tokens Security Audit ✅ (2026-11-25, STAGING VERIFIED)

**Цель:** исключить проверенные обходы аутентификации, повторное использование OAuth/Gateway токенов, гонки ротации/отзыва, доступ к устаревшим событиям и сохранение пользовательских WebSocket после отзыва сессии. Backend и Dev Portal правились точечно; проверки destructive/mutation выполнялись на выделенном локальном staging (`http://127.0.0.1:18443`), PostgreSQL/Redis и временных fixtures. Production-safe проверки проводились отдельно и не доказывают, что последний staging build уже на VPS.

| Подэтап | Реализованный hardening | Статус |
|---|---|---|
| 3.10.1.1 — JWT & User Authentication | HS256 и обязательные JWT claims; ключ из env, проверка активной сессии, admin privilege guard; recovery code crypto/HMAC, TTL и ограничение попыток | ✅ Проверено |
| 3.10.1.2 — Bot Token Lifecycle | атомарное погашение и отзыв токенов, active app/installation checks, unique active installation, effective scope intersection, revoke/reinstall | ✅ Проверено |
| 3.10.1.3 — Credentials Security & Rotation | CAS rotation, один активный credential, invalidation pending codes, metadata без секретов; обычная rotation не отзывает действующий runtime access | ✅ Проверено |
| 3.10.1.4 — OAuth Code & State | случайные code/state, digest storage, TTL, atomic consume и rollback; повторный и конкурентный redemption | ✅ Проверено |
| 3.10.1.5 — PKCE & Redirect URI | обязательный S256, точное сравнение redirect, явный loopback allowlist, обновление Vue OAuth flow/Go demo | ✅ Browser + staging E2E |
| 3.10.1.6 — OAuth Rate Limiting | Redis-backed atomic quota, shared token/refresh bucket, payload cap, rate limits/concurrency, trusted proxy policy; fail-closed | ✅ Integration + outage E2E |
| 3.10.1.7 — Security Regression & OAuth E2E | Security Runner, staging, browser callback, Gateway, recovery/sessions, outage, Linux race | ✅ 12/12 блоков |

###### Финальный Security Runner — 110 PASS / 0 FAIL / 4 SKIP

```text
Date: 2026-11-25
Mode: staging
Report: security-report-20261125T105918.114319400Z.json
PASS=110 FAIL=0 SKIP=4
```

Финальный результат подтверждён присланным выводом терминала после пересборки staging с user session hardening. Предыдущий успешный JSON-отчёт: `security-report-20261125T095110.306903800Z.json` (110/0/4). Ранее ошибки E2E fixture (room create permission и casing `ServerID`) устранены без ослабления production-авторизации. Fixture cleanup — PASS; исторические записи сохраняются. Финальный JSON отдельно не приложен, имя и итог взяты из вывода запуска.

| Контрольный блок 3.10.1.7 | Evidence | Статус |
|---|---|---|
| Security Runner Unit Tests | unit/regression standalone runner | ✅ PASS |
| Production Safe Anonymous | 8 PASS, 7 SKIP — read-only/negative subset ранее | ✅ PASS в пределах subset |
| Production Safe Authenticated | 15 PASS, 6 SKIP — ordinary user JWT, safe subset ранее | ✅ PASS в пределах subset |
| Backend Unit Tests | `go test` и `go vet` по затронутым пакетам, успешная staging Docker build/readiness | ✅ PASS |
| PostgreSQL Integration Tests | `TestOAuthCodeStorePostgres`, token consume, `TestGatewayEventSecurityPostgres`, `TestUserRecoverySessionPostgres` | ✅ PASS отдельно |
| Redis Integration Tests | `TestOAuthRateLimiterRedis`: atomic quota | ✅ PASS отдельно |
| Staging OAuth E2E | финальный runner 110/0/4 | ✅ PASS |
| Browser OAuth E2E | реальный Dev Portal → callback → token → `/bot/me`, включая PKCE | ✅ PASS отдельно |
| Gateway Security Regression | real event/ACK/Resume/REST, subscription epoch, reinstall, config, concurrent connect/revoke | ✅ PASS |
| User Recovery & Session Security | PostgreSQL + actual HTTP/WS E2E, 5 сценариев | ✅ PASS отдельно |
| Redis Outage Fail-Closed | `redis-outage-e2e.ps1`: pause/unpause, 503 contract, readiness recovery | ✅ PASS отдельно |
| Backend Go Race Detector | Linux Docker, CGO=1, `go test -race` по выбранным пакетам | ✅ PASS (test subset) |

Четыре SKIP Security Runner ожидаемы и не являются FAIL: `browser Dev Portal / actual callback`, `PostgreSQL digest / TTL / rollback`, `Redis fail-closed / atomic quota`, `user recovery / session revocation` выполнены отдельными проверками. Их результаты не прибавляются к 110 PASS как дополнительные автоматические тесты runner.

###### Gateway Security Regression

- Single-use Gateway session token: разделение Bot Access/session tokens, повторный и конкурентный handshake, fresh reconnect и replacement старого сокета.
- Lifecycle: при app suspension/installation revoke старый WS закрывается, unused tokens и новые session requests отклоняются; reinstall не оживляет старые access/refresh/session tokens; сохраняется уникальная installation.
- `GatewayEpoch` на installation/event: current authorization generation проверяется при публикации, ACK/resume, heartbeat и чтении backlog; события старого поколения не видны, seq остаётся монотонным. Смена подписок, transport/runtime и revoke/reinstall проверены; ordinary reconnect/credential rotation не сбрасывают generation.
- E2E с реальным `server.room.created`: доставка по WS, reconnect/resume, ACK с проверкой persisted status, REST list/detail/context/batch и owner event list; положительные и отрицательные проверки после изменения subscription и reinstall.
- `TestGatewayEventSecurityRedaction`, `TestGatewayEventSecurityPolicy`, `TestGatewayEventSecurityPostgres` пройдены отдельно; дополнительная фильтрация message content и scopes на read paths.
- Final runner: `Gateway real event delivery / ACK / Resume / REST`, `Gateway subscription epoch isolation`, `Gateway event delivery / backlog isolation`, `Gateway runtime config lifecycle`, `Gateway concurrent connect / revoke` — PASS. В последнем race-сценарии `upgrades=0, denied=3`: подтверждён отказ, а не закрытие успешно upgraded socket в этом конкретном запуске; отдельные live revoke/disconnect тесты PASS.
- Ограничения: GW-006 (ошибки persistence/state) проверен частично; room-level effective RBAC — DP 3.10.2; `interaction.created` теперь подчиняется subscription/scopes policy, требуется повторный interaction E2E; multi-process Gateway, DB fault windows и in-flight delivery остаются вне полного доказательства.

###### User Recovery & Session Security

- `TestUserRecoverySessionPostgres` — PASS (1.83 s): TTL, attempts, one-time recovery, transactional session issue/revoke и rollback на временных таблицах.
- `TestUserSessionKickExact` и `TestUserSessionCurrentConnectionFence` — PASS: адресный kick по SessionID и защита нового соединения.
- `TestUserSessionE2EStaging` — PASS (6.26 s): Refresh сохраняет WS и SessionID; concurrent Login отклоняет старый JWT/WS; concurrent Reset отзывает сессии и запрещает replay; concurrent Login/Reset не оставляет active session со старой авторизацией; новый пароль работает, Logout отзывает HTTP/WS.
- Использованы отдельная учётная запись staging и тестовый recovery code в БД, без реальной отправки писем. Сохранена политика одной активной пользовательской сессии, JWT/session TTL 72 часа и sliding refresh. Не утверждается абсолютное прекращение операций, уже начавшихся до revoke, или полное multi-instance покрытие.

###### Redis outage и Go Race Detector

- `tools/staging/redis-outage-e2e.ps1`: healthy OAuth/credentials invalid requests → HTTP 400; при `docker pause` Redis — HTTP 503 на `/oauth/authorize`, `/oauth/token`, `/oauth/token/refresh`, credentials create/rotate; проверены `rate_limiter_unavailable`, `Retry-After`, `Cache-Control: no-store`.
- `/healthz` при outage остаётся 204, `/readyz` становится 503; после восстановления Redis readiness 204 и все пять запросов снова 400. `PASS Redis Outage Fail-Closed E2E`.
- Это доказательство fail-closed на пяти защищённых routes с намеренно некорректными запросами, не полный runtime/media chaos test и не проверка успешной выдачи валидного токена в outage.
- `go test -race -p 2 -count=1 -timeout=10m ./auth ./controllers ./controllers/bots ./middleware ./services/botplatform ./internal/sockets` выполнен в `golang:1.27.4-alpine` с CGO/build-base: пять пакетов PASS, `auth [no test files]`. `WARNING: DATA RACE` отсутствует; opt-in DB/E2E tests не были явно включены в этот запуск. Не заменяет race-instrumented server E2E, полный `./...` и нагрузочные проверки.

###### Воспроизведение и evidence

```powershell
# Из корня EchoTalkServer, только локальный staging
.\tools\staging\staging.ps1 -Action Up
.\tools\staging\user-session-e2e.ps1
.\tools\staging\redis-outage-e2e.ps1
.\tools\staging\staging.ps1 -Action Test
```

Дополнительно: opt-in PostgreSQL/Redis integration tests с локальными переменными окружения по staging README; ручной browser E2E; Linux race detector командой выше. Не сохранять пароли, токены, `.env.staging.local` и чувствительные fixture outputs в Git. Evidence: `security-report-20261125T105918.114319400Z.json`, предыдущий JSON 110/0/4, терминальные логи `TestUserRecoverySessionPostgres`, `TestUserSessionE2EStaging`, Redis outage и race. Ссылки на evidence — имена локальных файлов/тестов, не публичные URL.

###### Production checkpoint / оставшиеся ограничения

**Статус DP 3.10.1: COMPLETED — STAGING VERIFIED.** Не равен GO на публичный запуск и не означает завершение всего DP 3.10. До rollout проверить свежий backup PostgreSQL и restore/rollback plan, schema changes (OAuth code/state digest, `code_challenge`, `gateway_epoch`, unique active installation), параметры signing/HMAC keys, proxy allowlist и production-пустой `BOT_OAUTH_LOOPBACK_BOT_IDS`. Старые pending codes без новых обязательных полей могут стать непригодными — начать новый authorize flow. `gateway_epoch` для installations default 1, historical events default 0: не backfill старые события в текущую generation; не запускать смешанные old/new Gateway-инстансы. Возврат старого Docker image сам по себе не откатывает схему и security policy. Backend, Dev Portal и публичный Go OAuth demo/документация должны быть совместимы по PKCE. После обновления — safe production smoke, проверка browser flow и controlled interaction regression; не проводить outage/fixture mutations на production без выделенного плана. Полный актуальный frontend build/typecheck/SCA и широкие RBAC/HTTP/runtime проверки остаются впереди.

#### DP 3.11 — Final E2E & Regression ⏳

DP 3.10.1 OAuth/Gateway/user session E2E уже выполнены на staging. DP 3.11 — отдельная финальная общеплатформенная регрессия после DP 3.10.2–3.10.4, с актуальным frontend и полным путём разработчика; результаты 110/0/4 являются baseline, а не заменой DP 3.11.

- полный путь стороннего разработчика: создать → credentials → OAuth Start/Callback → `/bot/me` → server/rooms → сообщение;
- OAuth негативные сценарии: неверный/повторный/истёкший code и `state`, redirect mismatch, refresh rotation/reuse, revoke, повторная установка;
- установка/удаление на разных серверах и проверка scope/IDOR boundary;
- Gateway hello/heartbeat/ACK/reconnect/resume, Webhook подпись/retry/дубли, slash/interactions;
- браузерные сценарии после frontend/backend изменений, build/typecheck/lint/tests;
- фиксируем evidence и явно отмечаем непроверенные infra chaos / long-run сценарии.

#### DP 3.12 — Production Readiness & публикация ⏳

- [x] Переработать OAuth UI, Quick Start и примеры (локальная проверка выполнена).
- [x] Завершить DP 3.10.1 и staging security regression (110 PASS / 0 FAIL / 4 SKIP; отдельно проверены).
- [ ] Контролируемый production rollout DP 3.10.1: backup, schema compatibility, rollback plan и safe smoke.
- [ ] Завершить DP 3.10.2–3.10.4 и устранить release-blocking проблемы.
- [ ] Выполнить 3.11 E2E/regression после исправлений.
- [ ] Получить успешные production build, typecheck, lint, SCA на актуальном frontend/backend.
- [ ] Проверить SPA history fallback, прямые ссылки, перезагрузку страниц и загрузку `public/examples/oauth-demo/main.go`.
- [ ] Разместить frontend на публичном хостинге и подключить HTTPS-домен.
- [ ] Сверить CORS allowlist, CSP, cookie/CSRF policy, OAuth Start/Redirect URI и API endpoint для публичного домена.
- [ ] Провести публичный smoke: login → create → OAuth/install → messages → events/diagnostics.
- [ ] Повторно оценить отложенные high-risk задачи §9.4 (`.env`/permissions/root); формальное решение о выпуске фиксировать только после оценки рисков.

**Критерий публичного запуска:** Dev Portal доступен по домену и HTTPS и позволяет внешнему разработчику выполнить путь от создания бота до работы с Bot API без обращения к приватному репозиторию. Backend Git/Docker release-tag не является обязательным, но security-fix может требовать обновления running backend.

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

**Принятое решение:** не вводить RC1/Docker-tag/Git-tag как обязательные действия. После DP 3.1–3.9.5 завершён DP 3.10.1 (staging verified); следующий этап DP 3.10.2, далее DP 3.10.3–3.10.4, DP 3.11 и DP 3.12. См. §9.

### DP 3.9.1–3.9.5 — OAuth Flow / Developer Onboarding ✅ (локально)

**Не путать с backend `P3.9.x Voice/Media`.** Для Dev Portal выполнены OAuth start/callback, обновление UI настроек и несколько последовательных итераций Quick Start. Итоговая реализация включает адрес Start URL, зарегистрированные Redirect URI, автоматический browser redirect вместо модального вывода code, серверный token exchange, `/bot/me` check и публичный standalone Go OAuth demo.

**Evidence:** пользовательский E2E показал `OAuth callback and /bot/me succeeded. (TEST ONLY: tokens not stored.)`; последняя серия тестов по frontend документации/demo сообщала `84/84 PASS`. Production-публикация и полная независимая сборка актуальной frontend-ветки не подтверждены; последующий DP 3.10.1 security audit завершён в проверенном staging-объёме (см. §9.6).

### DP 3.10–3.12 — Public Release Preparation ⏳

- **DP 3.10 — 🚧:** 3.10.1 OAuth/Tokens ✅ STAGING VERIFIED (110/0/4, 12/12 блоков); 3.10.2 RBAC/IDOR ⏳ следующий; 3.10.3 Frontend/HTTP и 3.10.4 Runtime/Dependencies ⏳.
- **DP 3.11:** финальные E2E/regression, включая негативные и межустановочные сценарии.
- **DP 3.12:** production build, deploy, HTTPS, домен и публичный smoke/sign-off.

## Changelog после последнего обновления документации от 2026-06-26

### Актуализация 2026-11-25 — DP 3.10.1 Security Audit / Final Staging E2E ✅

- Реализованы и проверены DP 3.10.1.1–3.10.1.6: JWT/user auth, bot tokens/credentials, code/state digest, PKCE S256/exact redirect, Redis OAuth limiter.
- DP 3.10.1.7: single-use Gateway sessions, current connection/lifecycle fences, `GatewayEpoch` и scope/subscription filtering; real event delivery/ACK/Resume/REST, subscription и reinstall backlog isolation — PASS.
- User recovery/session hardening: atomic session issue/revoke, recovery TTL/attempts/replay, exact-session kick, Refresh continuity; PostgreSQL/socket tests и пять HTTP/WS E2E сценариев — PASS.
- Redis outage E2E: protected OAuth/credentials routes fail-closed 503, liveness 204/readiness 503, после восстановления 204 и нормальная обработка — PASS.
- Linux `go test -race`: 5 packages PASS, `auth` без тестовых файлов; нет DATA RACE в выполненных тестах.
- Финальный staging runner: `security-report-20261125T105918.114319400Z.json`, **110 PASS / 0 FAIL / 4 SKIP**, четыре skip проверены отдельно; 12/12 контрольных блоков DP 3.10.1.7 завершены.
- Статус **COMPLETED — STAGING VERIFIED**. Контролируемый production deploy/backup/schema/rollback/smoke ещё не подтверждён. Следующий этап — DP 3.10.2 RBAC & IDOR; 3.10.3, 3.10.4, 3.11 и 3.12 открыты. Границы доказательства — §9.6.

### Актуализация 2026-11-25 — Dev Portal OAuth / Developer Onboarding → Security Audit

*Историческая запись до завершения DP 3.10.1; актуальные результаты security audit приведены выше.*

- **DP 3.1–3.8:** выполнены основные итерации Dev Portal UX/onboarding, credentials, installations, webhook/gateway diagnostics, public catalog, docs.
- **DP 3.8.1:** добавлено Markdown README бота (`readme_md`, до 64 КБ) с безопасным отображением в каталоге.
- **DP 3.9:** проведены локальные frontend QA, read-only API smoke (18/18) и Bot REST/Gateway/OAuth проверки; ручная проверка Go runtime OAuth refresh/revoke пройдена в указанных сценариях.
- **DP 3.9.1:** реализован полный браузерный OAuth redirect/callback: OAuth Start URL → Dev Portal authorize → callback → обмен кода на токены → `/bot/me`; пользователь подтвердил E2E success на локальном Go-сервере.
- **DP 3.9.x UI:** унифицировано управление OAuth Start URL и Redirect URI через модалки; исправлено явное имя SQL-колонки `oauth_start_url` для GORM. Не подтверждено, удалена ли техническая лишняя колонка `o_auth_start_url` из БД — проверить при следующей схематической ревизии.
- **DP 3.9.2–3.9.4:** Quick Start и OAuth-документация переработаны по замечаниям пользователя, Kimi и Gemini: точные HTTP-контракты, `state` и callback, installation/server/room, Bot API и Gateway/Webhook, единые HTTPS-примеры, локальный тест отдельно, без ссылок на приватные исходники.
- **DP 3.9.5:** добавлен самостоятельный Go OAuth demo в `public/examples/oauth-demo/main.go`, ссылка скачивания и PowerShell-инструкция. По последней сообщённой серии локальных проверок — 84/84 frontend tests; Go demo компилируется и прошёл целевые обработчики. **Публичная доступность файла после deploy ещё не проверялась**.
- **Текущий план:** DP 3.10 Security Audit → DP 3.11 final E2E/regression → DP 3.12 production readiness/hosting/domain/HTTPS. Документация принята как законченная итерация, но security audit и release gate не закрыты.
- **Безопасность/операции:** исторические backend P4.0.1–P4.0.6 и P4.0.8 ограниченно подтверждены; `.env` в Git/права файлов, container root, миграции/rollback/offsite/chaos, возможные OAuth loopback/PKCE и актуальные зависимости остаются под review. Старый SCA PASS (2026-11-12) не отменяет нового `npm audit` на свежем frontend dependency tree.

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
- 2026-11-25: OAuth Redis outage на staging: liveness 204/readiness 503, после unpause readiness 204; пять OAuth/credentials routes fail-closed с безопасным error contract; не заменяет полный infrastructure chaos test

---

## 11. Вывод

### Текущее состояние на 2026-11-25

Backend Bot Platform реализован и работает на VPS: OAuth/install/credentials, webhook/WS Gateway (ACK/resume/replay), slash commands, interactions, resource/context API, RBAC, moderation, roles, voice/media и runtime protection. Существуют REST OpenAPI и Gateway AsyncAPI. Backend media/recovery, backup/restore, health/readiness и smoke подтверждены в описанных ограниченных сценариях 2026-11-18—19.

**Dev Portal продвинулся дальше статуса от 2026-11-19:** основной интерфейс и onboarding переработаны; Markdown README и публичный каталог работают в реализованных сценариях; OAuth Start/Callback/token `/bot/me` локально прошёл E2E; OAuth Settings UI унифицирован; Quick Start дополнен спецификацией запросов, сценариями Bot REST/Gateway/Webhook и публично включаемым Go-примером. В последней серии этапа DP 3.9.5 сообщено о 84/84 успешно пройденных локальных тестах.

**DP 3.10.1 — OAuth & Tokens Security Audit завершён (STAGING VERIFIED, 2026-11-25):** 110 PASS / 0 FAIL / 4 SKIP в финальном Security Runner; все четыре skip проверены отдельно, 12/12 контрольных блоков. JWT/OAuth/PKCE, credentials/token lifecycle, Gateway event/backlog isolation, user recovery/session E2E, Redis fail-closed и Linux Race Detector подтверждены в описанном объёме. Полный rollout последнего security-набора на VPS и post-deploy regression не подтверждены.

### Что осталось до публичного запуска

**Обязательная последовательность:** подготовить контролируемый rollout DP 3.10.1 и safe smoke; продолжить DP 3.10.2 RBAC/IDOR → DP 3.10.3 Browser/HTTP → DP 3.10.4 Runtime/Infrastructure/Dependencies → DP 3.11 финальная общеплатформенная E2E/regression → DP 3.12 frontend build, hosting, домен, HTTPS, публичный smoke и GO / NO-GO. Staging OAuth/Gateway E2E не заменяет проверку всей платформы на актуальных зависимостях.

### Что не объявляется закрытым

- известные риски секретов в Git, прав `.env`/TLS и запуска контейнера от `root` — требуют обязательной переоценки перед публичным релизом;
- PKCE S256 и explicit loopback allowlist проверены; production-конфигурация, browser-security/unsafe redirects, frontend JWT storage/CORS/CSRF/CSP — DP 3.10.3;
- room-level RBAC/IDOR, privilege escalation, Interaction Runtime после ужесточения подписок — DP 3.10.2/3.11;
- GW-006 state/persistence faults, multi-process Gateway и in-flight concurrency, полный SCA/Runtime audit — DP 3.10.4;
- автоматический `AutoMigrate`, отсутствие миграционного rollback, offsite backup и реального Docker rollback;
- OAuth Redis outage проверен; PostgreSQL/LiveKit failure, Redis runtime-wide outage, долгий Go/backlog/orphan stress/chaos остаются открытыми;
- Media Limits/Usage UI, interaction inspector, официальный SDK и глобальный Search API — отложенный backlog;
- публичная production-сборка Dev Portal и итоговый smoke — ещё не подтверждены.

➡️ **Текущий этап: DP 3.10.2 — RBAC & IDOR Security Audit.** DP 3.10.1 закрыт в проверенном staging-объёме, весь DP 3.10 ещё в работе. Исторические P4.0 и текущие security E2E не подменяют финальный production sign-off.

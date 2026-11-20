<template>
  <div class="bot-detail">
    <ToastContainer />
    <AddRedirectModal
      :is-open="showAddRedirectModal"
      :is-loading="isSavingRedirectURIs"
      @close="showAddRedirectModal = false"
      @submit="addRedirectURI"
    />

    <div class="container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-left">
          <Button variant="ghost" @click="router.push({ name: 'bots' })" class="back-btn"><AppIcon name="arrow-left" :size="20" /> К моим ботам</Button>
          <div class="bot-title" v-if="bot">
            <div class="bot-avatar" :style="avatarStyle">
              {{ bot.name?.[0]?.toUpperCase() || '?' }}
            </div>
            <div class="bot-info">
              <h1>{{ bot.name }}</h1>
              <div class="bot-meta">
                <Badge :variant="bot.is_public ? 'success' : 'default'" size="sm">
                  {{ bot.is_public ? 'Публичный' : 'Приватный' }}
                </Badge>
                <Badge :variant="statusBadgeVariant" size="sm">
                  {{ statusLabel }}
                </Badge>
                <span class="bot-id">ID: {{ bot.id }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="header-actions" v-if="bot">
          <Button variant="secondary" @click="showEditModal = true"><AppIcon name="settings" :size="20" /> Редактировать</Button>
          <Button variant="secondary" @click="openCreateCredentialDialog"><AppIcon name="key-round" :size="20" /> Создать Client Secret</Button>
          <Button
            v-if="bot.status === 'draft'"
            variant="primary"
            :loading="isPublishing"
            @click="publishBot"
          >
            <AppIcon name="rocket" :size="20" /> Опубликовать бота
          </Button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>Загрузка информации о боте...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="error-state">
        <AppIcon name="alert-triangle" class="error-icon" :size="42" />
        <h3>Ошибка загрузки</h3>
        <p>{{ error }}</p>
        <Button variant="primary" @click="loadBot">Повторить</Button>
      </div>

      <!-- Content -->
      <div v-else-if="bot" class="bot-content">
<nav class="bot-section-nav" aria-label="Разделы управления ботом" role="tablist">
  <button v-for="tab in detailTabs" :key="tab.id" :id="`bot-tab-${tab.id}`" type="button" role="tab"
    :aria-selected="activeTab === tab.id" :aria-controls="`bot-panel-${tab.id}`"
    :tabindex="activeTab === tab.id ? 0 : -1"
    :class="{ 'is-active': activeTab === tab.id }"
    @click="selectTab(tab.id)" @keydown="handleTabKeydown($event, tab.id)">
    <AppIcon :name="tab.icon" :size="20" />
    <span>{{ tab.label }}</span>
  </button>
</nav>
<div v-if="installations.length && tabsWithInstallationContext.includes(activeTab)" class="installation-context">
  <div class="installation-context-label">
    <span>Выбранный сервер</span>
    <small>Настройки и подписки относятся к конкретной установке</small>
  </div>
  <select v-model="selectedWebhookInstallationId" class="form-select ui-control" :class="{ 'is-placeholder': !selectedWebhookInstallationId }" aria-label="Выберите установку" @change="handleSelectWebhookInstallation">
    <option value="">Выберите сервер</option>
    <option v-for="installation in activeInstallationsList" :key="installation.id" :value="String(installation.id)">
      {{ installation.server_name || `Сервер ${installation.server_id}` }} · #{{ installation.id }}
    </option>
  </select>
</div>
<section :id="'bot-panel-overview'" role="tabpanel" aria-labelledby="bot-tab-overview" v-show="activeTab === 'overview'" class="bot-tab-panel">
<div v-if="!credentials.length || !installations.length" class="setup-guide" role="note">
          <div>
            <h2>Первые шаги</h2>
            <p>Чтобы бот начал работать, подготовьте данные для подключения и установите его на сервер.</p>
          </div>
          <ol>
            <li :class="{ 'setup-done': activeCredential }">
              <span>{{ activeCredential ? '✓' : '1' }}</span>
              <div>
                <strong>Получите Client ID и Client Secret</strong>
                <p>Идентификатор и секрет нужны серверному приложению бота для OAuth.</p>
              </div>
            </li>
            <li>
              <span>2</span>
              <div>
                <strong>Проверьте разрешения</strong>
                <p>Выберите минимально необходимые доступы в настройках бота.</p>
              </div>
            </li>
            <li :class="{ 'setup-done': activeInstallations > 0 }">
              <span>{{ activeInstallations > 0 ? '✓' : '3' }}</span>
              <div>
                <strong>Установите бота и настройте доставку событий</strong>
                <p>После установки на сервер появятся настройки Webhook и WebSocket Gateway.</p>
              </div>
            </li>
          </ol>
          <RouterLink :to="{ name: 'docs' }" class="setup-docs-link">Документация по подключению</RouterLink>
        </div>
<!-- Сводные показатели показываем перед подробной информацией. -->
<Card class="section-card stats-card">
  <div class="quick-stats">
    <div class="stat-item">
      <span class="stat-value">{{ installations.length }}</span>
      <span class="stat-label">Серверов</span>
    </div>
    <div class="stat-item">
      <span class="stat-value">{{ activeInstallations }}</span>
      <span class="stat-label">Активных</span>
    </div>
    <div class="stat-item">
      <span class="stat-value">{{ activeCredentialsCount }}</span>
      <span class="stat-label">Активных ключей</span>
    </div>
  </div>
</Card>

<div class="overview-information-grid">
  <Card id="bot-scopes" class="section-card overview-info-card">
    <div class="section-header">
      <h2 class="section-title"><AppIcon name="shield-check" :size="24" /> Разрешения приложения</h2>
      <p class="section-desc">Определяют доступ бота к возможностям EchoTalk.</p>
    </div>
    <div class="tags-list">
      <Badge v-for="scope in allowedScopes" :key="scope" variant="info" size="sm">
        <span :title="scope">{{ scopeDisplayName(scope) }}</span>
      </Badge>
      <span v-if="!allowedScopes.length" class="empty-tags">Разрешения не заданы</span>
    </div>
  </Card>

  <Card class="section-card overview-info-card">
    <div class="section-header">
      <h2 class="section-title"><AppIcon name="list-checks" :size="24" /> События выбранной установки</h2>
      <p class="section-desc">
        {{ selectedWebhookInstallation?.server_name || 'Выберите сервер для просмотра сохранённых подписок' }}
      </p>
    </div>
    <div class="tags-list">
      <Badge v-for="event in savedSubscribedEvents" :key="event" variant="default" size="sm">
        <span :title="event">{{ eventDisplayName(event) }}</span>
      </Badge>
      <span v-if="isLoadingWebhook" class="empty-tags">Загрузка подписок…</span>
      <span v-else-if="!savedSubscribedEvents.length" class="empty-tags">
        {{ selectedWebhookInstallation ? 'Для этого сервера подписки не настроены' : 'Выберите установку бота' }}
      </span>
    </div>
    <button type="button" class="text-link" @click="selectTab('subscriptions')">
      Настроить подписки
    </button>
  </Card>
</div>
</section>
<section :id="'bot-panel-auth'" role="tabpanel" aria-labelledby="bot-tab-auth" v-show="activeTab === 'auth'" class="bot-tab-panel">
<Card id="bot-credentials" class="section-card">
              <div class="section-header">
                <h2 class="section-title"><AppIcon name="key-round" :size="24" /> Данные для авторизации</h2>
                <p class="section-desc">Client ID идентифицирует приложение, а Client Secret подтверждает его подлинность при обмене OAuth-кода на токены.</p>
              </div>

              <div class="oauth-howto" aria-label="Порядок подключения бота">
                <div class="oauth-howto-step">
                  <span class="oauth-step-number">1</span>
                  <div><strong>Создайте учётные данные</strong><p>Скопируйте Client ID и Client Secret. Секрет показывается только при создании.</p></div>
                </div>
                <div class="oauth-howto-step">
                  <span class="oauth-step-number">2</span>
                  <div><strong>Установите бота на сервер</strong><p>При установке выберите сервер и разрешения. После подтверждения приложение получает OAuth-код.</p></div>
                </div>
                <div class="oauth-howto-step">
                  <span class="oauth-step-number">3</span>
                  <div><strong>Подключите серверную часть</strong><p>Обменяйте код на токены через <code>POST /oauth/token</code>. Секрет и токены храните только на сервере бота.</p></div>
                </div>
              </div>
              <div class="oauth-help-links">
                <RouterLink :to="{ name: 'docs' }" class="text-link">Документация API и OAuth</RouterLink>
                <button type="button" class="text-link" @click="selectTab('installations')">Перейти к установкам</button>
              </div>

              <!-- Пустое состояние -->
              <div
                v-if="credentials.length === 0 && !freshlyCreatedSecret"
                class="empty-credentials"
              >
                <p>Учётные данные ещё не созданы</p>
                <Button variant="primary" @click="openCreateCredentialDialog">
                  Создать Client Secret
                </Button>
              </div>

              <!-- Только что созданные (показываем один раз) -->
              <div v-else-if="freshlyCreatedSecret" class="fresh-secret-banner">
                <div class="secret-warning">
                  <strong class="inline-icon-label"><AppIcon name="alert-triangle" :size="20" /> Скопируйте эти данные сейчас!</strong>
                  <p>Они больше никогда не будут показаны.</p>
                </div>

                <!-- Client ID -->
                <CredentialCard
                  title="Client ID"
                  :value="freshlyCreatedSecret.client_id"
                  :sensitive="false"
                  hint="Публичный идентификатор приложения — его можно указывать в настройках интеграции"
                />

                <!-- Client Secret -->
                <CredentialCard
                  title="Client Secret"
                  :value="freshlyCreatedSecret.client_secret"
                  :is-new="true"
                  :sensitive="true"
                  hint="Храните в переменных окружения или менеджере секретов серверного приложения, не в Vue-клиенте"
                />

                <Button variant="secondary" @click="dismissFreshSecret">
                  Я сохранил данные
                </Button>
              </div>

              <!-- Существующие credentials (после закрытия баннера) -->
              <div v-else class="credentials-list">
                <CredentialCard
                  v-if="activeCredential"
                  title="Client ID"
                  :value="activeCredential.client_id"
                  :sensitive="false"
                  hint="Публичный идентификатор приложения"
                />

                <div class="secret-placeholder">
                  <span>Client Secret не показывается повторно</span>
                  <Button variant="ghost" size="sm" @click="openCreateCredentialDialog">
                    Создать новый
                  </Button>
                </div>
              </div>
            </Card>
            <Card id="bot-redirect-uris" class="section-card redirect-uri-section">
              <div class="section-header redirect-section-heading">
                <div>
                  <h2 class="section-title"><AppIcon name="link-2" :size="24" /> Адреса перенаправления OAuth</h2>
                  <p class="section-desc">Добавьте разрешённые callback-адреса. Сейчас код авторизации возвращается через API, без автоматического перехода на callback. Адрес проверяется при OAuth-авторизации и обмене кода на токен.</p>
                </div>
                <Button variant="secondary" :disabled="isSavingRedirectURIs || redirectURIs.length >= 10" @click="showAddRedirectModal = true">
                  <AppIcon name="plus" :size="19" /> Добавить адрес
                </Button>
              </div>
              <p class="redirect-count">Зарегистрировано: {{ redirectURIs.length }} из 10</p>
              <div v-if="!redirectURIs.length" class="redirect-empty" role="note">
                <AppIcon name="alert-triangle" :size="21" />
                <span>Адреса не зарегистрированы. Получение OAuth-кода недоступно, пока не добавлен хотя бы один Redirect URI.</span>
              </div>
              <ul v-else class="redirect-uri-list">
                <li v-for="(uri, index) in redirectURIs" :key="uri" class="redirect-uri-item">
                  <div class="redirect-uri-main">
                    <code>{{ uri }}</code>
                    <small v-if="index === 0">По умолчанию при установке через Dev Portal</small>
                  </div>
                  <div v-if="pendingRedirectURIToRemove === uri" class="redirect-uri-actions">
                    <span class="redirect-delete-label">Удалить адрес?</span>
                    <Button variant="ghost" size="sm" :disabled="isSavingRedirectURIs" @click="pendingRedirectURIToRemove = null">Отмена</Button>
                    <Button variant="danger" size="sm" :loading="isSavingRedirectURIs" @click="removeRedirectURI(uri)">Удалить</Button>
                  </div>
                  <Button v-else variant="ghost" size="sm" :disabled="isSavingRedirectURIs" @click="pendingRedirectURIToRemove = uri">
                    <AppIcon name="trash-2" :size="18" /> Удалить
                  </Button>
                </li>
              </ul>
            </Card>
</section>
<section :id="'bot-panel-commands'" role="tabpanel" aria-labelledby="bot-tab-commands" v-show="activeTab === 'commands'" class="bot-tab-panel">
<Card id="bot-commands" class="section-card">
              <div class="section-header">
                <h2 class="section-title"><AppIcon name="terminal" :size="24" /> Команды бота</h2>
                <p class="section-desc">Пользователи вызывают команды через /имя_команды в чате. Для выполнения запросов настройте «Адрес обработчика команд» во вкладке «Подключение».</p>
              </div>

              <div class="commands-section">
                <div class="command-form">
                  <div class="form-grid">
                    <div class="form-group">
                      <label>Имя команды</label>
                      <div class="command-name-input">
                        <span>/</span>
                        <input
                          v-model.trim="commandForm.name"
                          class="form-input ui-control"
                          type="text"
                          placeholder="help"
                          maxlength="32"
                        />
                      </div>
                    </div>
                    <div class="form-group form-group-full">
                      <label>Описание</label>
                      <input
                        v-model.trim="commandForm.description"
                        class="form-input ui-control"
                        type="text"
                        placeholder="Показать список доступных команд"
                        maxlength="100"
                      />
                    </div>

                    <div class="form-group">
                      <label class="checkbox-line">
                        <input v-model="commandForm.is_enabled" type="checkbox" class="ui-checkbox" />
                        <span>Команда включена</span>
                      </label>
                    </div>
                  </div>

                  <div class="test-actions">
                    <Button variant="primary" :loading="isSavingCommand" @click="handleSaveCommand">
                      {{ editingCommandId ? 'Сохранить команду' : 'Создать команду' }}
                    </Button>

                    <Button v-if="editingCommandId" variant="secondary" @click="resetCommandForm">
                      Отменить редактирование
                    </Button>
                  </div>
                </div>

                <div class="deliveries-block">
                  <h4>Список команд</h4>

                  <div v-if="isLoadingCommands" class="empty-urls">Загрузка команд...</div>

                  <div v-else-if="commands.length === 0" class="empty-urls">
                    Команды пока не созданы
                  </div>

                  <div v-else class="deliveries-list">
                    <div v-for="command in commands" :key="command.id" class="delivery-item">
                      <div class="delivery-top">
                        <strong>/{{ command.name }}</strong>

                        <div class="delivery-actions">
                          <Badge :variant="command.is_enabled ? 'success' : 'default'" size="sm">
                            {{ command.is_enabled ? 'Включена' : 'Выключена' }}
                          </Badge>

                          <Button variant="ghost" size="sm" @click="startEditCommand(command)">
                            Редактировать
                          </Button>

                          <Button variant="ghost" size="sm" @click="handleToggleCommand(command)">
                            {{ command.is_enabled ? 'Выключить' : 'Включить' }}
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            @click="handleDeleteCommand(command.id)"
                          >
                            Удалить
                          </Button>
                        </div>
                      </div>

                      <div class="delivery-meta">
                        <span>{{ command.description }}</span>
                      </div>

                      <div class="delivery-dates">
                        <span>Изменена: {{ formatDate(command.updated_at) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
</section>
<section :id="'bot-panel-installations'" role="tabpanel" aria-labelledby="bot-tab-installations" v-show="activeTab === 'installations'" class="bot-tab-panel">
<Card id="bot-installations" class="section-card">
              <div class="section-header">
                <h2 class="section-title"><AppIcon name="server" :size="24" /> Установки на серверы</h2>
                <p class="section-desc">Серверы, где установлен бот</p>
              </div>

              <div class="installations-list">
                <div v-if="installations.length > 0">
                  <InstallationCard
                    v-for="installation in installations"
                    :key="installation.id"
                    :installation="installation"
                    @revoke="handleRevokeInstallation"
                  />
                </div>
                <div v-else class="empty-installations">
                  <AppIcon name="inbox" class="empty-icon" :size="44" />
                  <p>Бот еще не установлен ни на один сервер</p>
                  <p class="empty-hint">Установите бота на сервер через страницу бота и OAuth-авторизацию</p>
                </div>
              </div>
            </Card>
</section>
<section :id="'bot-panel-connection'" role="tabpanel" aria-labelledby="bot-tab-connection" v-show="activeTab === 'connection'" class="bot-tab-panel">
<Card id="bot-delivery" class="section-card">
  <div class="section-header">
    <h2 class="section-title"><AppIcon name="plug-zap" :size="24" /> Подключение бота</h2>
    <p class="section-desc">Настройте способ доставки событий и адрес обработки команд для выбранной установки.</p>
  </div>
  <div v-if="!selectedWebhookInstallation" class="empty-urls">Выберите активную установку бота.</div>
  <div v-else-if="isLoadingWebhook" class="empty-urls">Загрузка настроек…</div>
  <div v-else class="connection-form">
    <div class="settings-group">
      <h3>Способ доставки</h3>
      <p class="settings-help">Выберите один режим. Команды работают независимо от доставки событий.</p>
      <div class="form-group">
                      <label class="sr-only">Режим доставки событий</label>


                      <div class="delivery-mode-list">
                        <label class="delivery-mode-card">
                          <input v-model="deliveryMode" type="radio" class="ui-checkbox" value="disabled" />
                          <div>
                            <strong>Выключено</strong>
                            <p>EchoTalk не будет отправлять события этому боту.</p>
                          </div>
                        </label>

                        <label class="delivery-mode-card">
                          <input v-model="deliveryMode" type="radio" class="ui-checkbox" value="webhook" />
                          <div>
                            <strong>Webhook</strong>
                            <p>
                              EchoTalk отправляет события HTTP POST-запросами на указанный адрес.
                            </p>
                          </div>
                        </label>

                        <label class="delivery-mode-card">
                          <input v-model="deliveryMode" type="radio" class="ui-checkbox" value="websocket" />
                          <div>
                            <strong>WebSocket Gateway</strong>
                            <p>
                              Бот поддерживает постоянное соединение WebSocket и получает события в
                              реальном времени.
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>
    </div>
    <div class="settings-group">
      <h3>Адреса интеграции</h3>
      <p class="settings-help">Укажите публичные HTTPS-адреса сервиса вашего бота.</p>
      <div v-if="isWebhookTransport" class="form-group">
                      <label>Адрес Webhook</label>
                      <input
                        v-model.trim="webhookForm.webhook_url"
                        class="form-input ui-control"
                        type="text"
                        placeholder="https://your-bot.example.com/webhook"
                      />
                    </div>
      <div class="form-group">
                      <label>Адрес обработчика команд</label>
                      <input
                        v-model.trim="webhookForm.command_base_url"
                        class="form-input ui-control"
                        type="text"
                        placeholder="https://your-bot.example.com/commands"
                      />
                      <p class="field-help">Формат вызова команды: <code>POST {command_base_url}/{command_name}</code></p>
                    </div>
    </div>
    <div class="settings-actions">
      <Button variant="primary" :loading="isSavingWebhook" @click="handleSaveWebhook">Сохранить подключение</Button>
      <Button v-if="isWebhookTransport && webhookForm.enabled" variant="secondary" :loading="isRotatingWebhookSecret" @click="handleRotateWebhookSecret">Сменить секрет Webhook</Button>
    </div>
    <div
                      v-if="isWebhookTransport && webhookForm.enabled && revealedWebhookSecret"
                      class="fresh-secret-banner"
                    >
                      <div class="secret-warning">
                        <strong class="inline-icon-label"><AppIcon name="alert-triangle" :size="20" /> Скопируйте секрет Webhook сейчас!</strong>
                        <p>Он показывается только один раз.</p>
                      </div>

                      <CredentialCard
                        title="Webhook Secret"
                        :value="revealedWebhookSecret"
                        :is-new="true"
                        show-reveal
                        hint="Используйте его для проверки X-EchoTalk-Signature"
                      />

                      <Button variant="secondary" @click="revealedWebhookSecret = null">
                        Я сохранил секрет
                      </Button>
                    </div>
    <div v-if="installationWebhook" class="field-hint">
                      <div>
                        Последняя ошибка:
                        <strong>{{ installationWebhook.last_delivery_error || 'нет' }}</strong>
                      </div>
                      <div>
                        Последняя доставка:
                        <strong>{{ installationWebhook.last_delivery_at || '—' }}</strong>
                      </div>
                    </div>
  </div>
</Card>
</section>
<section :id="'bot-panel-subscriptions'" role="tabpanel" aria-labelledby="bot-tab-subscriptions" v-show="activeTab === 'subscriptions'" class="bot-tab-panel">
<Card id="bot-subscriptions" class="section-card">
  <div class="section-header">
    <h2 class="section-title"><AppIcon name="list-checks" :size="24" /> Подписки на события</h2>
    <p class="section-desc">Отметьте события, которые бот должен получать после установки на сервер. Доступность зависит от разрешений установки.</p>
  </div>
  <div v-if="!selectedWebhookInstallation" class="empty-urls">Выберите активную установку бота.</div>
  <div v-else-if="isLoadingWebhook" class="empty-urls">Загрузка подписок…</div>
  <div v-else class="subscription-form">
    <div
                      class="form-group"
                      :class="{ 'is-disabled-block': deliveryMode === 'disabled' }"
                    >
                      <label>Доступные события</label>

                      <div class="event-subscription-panel">
                        <div class="event-subscription-toolbar">
                          <input
                            v-model.trim="eventSearchQuery"
                            class="form-input ui-control"
                            type="text"
                            placeholder="Поиск по названию или коду события"
                          />

                          <div class="event-subscription-counter" title="Показано из доступных событий">
                            {{ filteredSelectableEvents.length }} / {{ selectableEvents.length }}
                          </div>
                        </div>

                        <div class="webhook-events-list scrollable-events-list">
                          <label
                            v-for="event in filteredSelectableEvents"
                            :key="event.type"
                            class="checkbox-line event-subscription-item"
                          >
                            <input
                              v-model="webhookForm.subscribed_events"
                              type="checkbox"
                              class="ui-checkbox"
                              :value="event.type"
                            />

                            <span>
                              <strong>{{ eventDisplayName(event.type) }}</strong>
                              <small class="event-type">{{ event.type }}</small>
                            </span>
                          </label>

                          <p v-if="selectableEvents.length === 0" class="field-help">
                            Нет событий, доступных при текущих разрешениях бота.
                          </p>

                          <p
                            v-else-if="filteredSelectableEvents.length === 0"
                            class="field-help event-search-empty"
                          >
                            По запросу ничего не найдено.
                          </p>
                        </div>
                      </div>

                      <p v-if="deliveryMode === 'disabled'" class="field-help">
                        Список событий сохранится, но события не будут доставляться, пока режим
                        доставки выключен.
                      </p>
                    </div>
    <div class="settings-actions">
      <span class="selected-count">Выбрано: {{ webhookForm.subscribed_events.length }}</span>
      <Button variant="primary" :loading="isSavingWebhook" @click="handleSaveWebhook">Сохранить подписки</Button>
    </div>
  </div>
</Card>
</section>
<section :id="'bot-panel-journal'" role="tabpanel" aria-labelledby="bot-tab-journal" v-show="activeTab === 'journal'" class="bot-tab-panel">
<Card v-if="selectedWebhookInstallationId" id="bot-replay" class="section-card replay-card">
              <div class="section-header replay-header">
                <div>
                  <h2 class="section-title"><AppIcon name="scroll-text" :size="24" /> Журнал событий</h2>
                  <p class="section-desc">
                    История событий выбранной установки. Можно запросить события после указанного номера (seq).
                  </p>
                </div>

                <div class="replay-header-badges">
                  <Badge variant="default" size="sm"
                    >Установка #{{ selectedWebhookInstallationId }}</Badge
                  >
                  <Badge v-if="replayEvents.length > 0" variant="info" size="sm">
                    {{ replayEvents.length }} событий
                  </Badge>
                </div>
              </div>

              <div class="replay-toolbar">
                <div class="form-group replay-input">
                  <label>После номера (after_seq)</label>
                  <input v-model.number="replayAfterSeq" class="form-input ui-control" type="number" min="0" />
                </div>

                <div class="form-group replay-input">
                  <label>Количество (limit)</label>
                  <input
                    v-model.number="replayLimit"
                    class="form-input ui-control"
                    type="number"
                    min="1"
                    max="200"
                  />
                </div>

                <div class="replay-actions">
                  <Button
                    variant="primary"
                    :loading="isLoadingReplayEvents"
                    @click="loadReplayEvents"
                  >
                    Запросить события
                  </Button>

                  <Button
                    v-if="hasMoreReplayEvents"
                    variant="secondary"
                    :loading="isLoadingReplayEvents"
                    @click="loadNextReplayEvents"
                  >
                    Следующая пачка
                  </Button>
                </div>
              </div>

              <div v-if="replayEvents.length > 0" class="replay-meta-line">
                <span
                  >Загружено: <strong>{{ replayEvents.length }}</strong></span
                >
                <span
                  >Следующий after_seq: <strong>{{ nextReplayAfterSeq }}</strong></span
                >
              </div>

              <div v-if="isLoadingReplayEvents" class="empty-urls replay-empty">
                Загрузка событий...
              </div>

              <div v-else-if="replayEvents.length === 0" class="empty-urls replay-empty">
                События не найдены
              </div>

              <div v-else class="replay-events-list">
                <article
                  v-for="event in replayEvents"
                  :key="event.event_id"
                  class="replay-event-card"
                >
                  <div class="replay-event-main">
                    <div class="replay-event-icon"><AppIcon :name="botEventIcon(event.type)" :size="24" /></div>

                    <div class="replay-event-content">
                      <div class="replay-event-title-row">
                        <div>
                          <h3>{{ eventDisplayName(event.type) }}</h3>
                          <code class="replay-event-code">{{ event.type }}</code>
                          <p>#{{ event.seq }} · {{ formatDate(event.occurred_at) }}</p>
                        </div>

                        <Badge variant="default" size="sm">v{{ event.version }}</Badge>
                      </div>

                      <div class="replay-event-meta-grid">
                        <div>
                          <span>Сервер</span>
                          <strong>{{ event.payload?.payload?.server_id ?? '—' }}</strong>
                        </div>

                        <div>
                          <span>Комната</span>
                          <strong>{{ event.payload?.payload?.room_id ?? '—' }}</strong>
                        </div>

                        <div>
                          <span>Инициатор</span>
                          <strong>{{ event.payload?.payload?.actor_user_id ?? '—' }}</strong>
                        </div>

                        <div>
                          <span>Тип инициатора</span>
                          <strong>{{ event.payload?.payload?.actor_type ?? '—' }}</strong>
                        </div>
                      </div>

                      <div v-if="event.payload?.payload?.data" class="replay-event-data">
                        <div class="replay-data-title">Данные события</div>
                        <pre>{{ JSON.stringify(event.payload.payload.data, null, 2) }}</pre>
                      </div>

                      <details class="replay-raw">
                        <summary>Исходные данные JSON</summary>
                        <pre>{{ JSON.stringify(event.payload, null, 2) }}</pre>
                      </details>
                    </div>
                  </div>
                </article>
              </div>
            </Card>
<Card class="section-card">
  <div class="section-header">
    <h2 class="section-title"><AppIcon name="link-2" :size="24" /> Доставки Webhook</h2>
    <p class="section-desc">Последние HTTP-отправки и повторные попытки доставки.</p>
  </div>
  <div v-if="!selectedWebhookInstallation" class="empty-urls">Выберите активную установку бота.</div>
  <div v-else-if="isLoadingWebhook" class="empty-urls">Загрузка настроек доставки…</div>
  <div v-else-if="!installationWebhook?.enabled || installationWebhook.event_delivery !== 'webhook'" class="empty-urls">История HTTP-доставок доступна при включённом Webhook.</div>
  <template v-else>
    <Button variant="secondary" size="sm" :loading="isLoadingDeliveries" @click="loadInstallationDeliveries">Обновить доставки</Button>
    <div class="deliveries-block">
                      <h4>Последние доставки</h4>

                      <div v-if="isLoadingDeliveries" class="empty-urls">Загрузка доставок...</div>

                      <div v-else-if="installationDeliveries.length === 0" class="empty-urls">
                        Пока нет доставок
                      </div>

                      <div v-else class="deliveries-list">
                        <div
                          v-for="delivery in installationDeliveries"
                          :key="delivery.id"
                          class="delivery-item"
                        >
                          <div class="delivery-top">
                            <div class="delivery-event-title">
                              <strong>{{ eventDisplayName(delivery.event_type) }}</strong>
                              <code>{{ delivery.event_type }}</code>
                            </div>
                            <div class="delivery-actions">
                              <Badge
                                :variant="
                                  delivery.status === 'success'
                                    ? 'success'
                                    : delivery.status === 'failed'
                                      ? 'danger'
                                      : 'warning'
                                "
                                size="sm"
                              >
                                {{ deliveryStatusLabel(delivery.status) }}
                              </Badge>

                              <Button
                                variant="ghost"
                                size="sm"
                                @click="toggleDeliveryAttempts(delivery.id)"
                              >
                                {{
                                  expandedDeliveryId === delivery.id
                                    ? 'Скрыть попытки'
                                    : 'Попытки доставки'
                                }}
                              </Button>
                            </div>
                          </div>

                          <div class="delivery-meta">
                            <span
                              >Попытки: {{ delivery.attempt_count }}/{{
                                delivery.max_attempts
                              }}</span
                            >
                            <span>HTTP: {{ delivery.last_response_code ?? '—' }}</span>
                          </div>

                          <div v-if="delivery.last_error" class="delivery-error">
                            {{ delivery.last_error }}
                          </div>

                          <div class="delivery-dates">
                            <span>Создана: {{ formatDate(delivery.created_at) }}</span>
                            <span>Следующая попытка: {{ formatDate(delivery.next_attempt_at) }}</span>
                          </div>

                          <div v-if="expandedDeliveryId === delivery.id" class="attempts-block">
                            <div v-if="isLoadingAttempts" class="empty-urls">
                              Загрузка попыток...
                            </div>

                            <div
                              v-else-if="
                                !deliveryAttempts[delivery.id] ||
                                (deliveryAttempts[delivery.id]?.length ?? 0) === 0
                              "
                              class="empty-urls"
                            >
                              Попыток доставки нет
                            </div>

                            <div v-else class="attempts-list">
                              <div
                                v-for="attempt in deliveryAttempts[delivery.id]"
                                :key="attempt.id"
                                class="attempt-item"
                              >
                                <div class="attempt-top">
                                  <strong>Попытка #{{ attempt.attempt_no }}</strong>
                                  <span>HTTP: {{ attempt.response_status ?? '—' }}</span>
                                </div>

                                <div class="attempt-meta">
                                  <span>Длительность: {{ attempt.duration_ms }} мс</span>
                                  <span>Создана: {{ formatDate(attempt.created_at) }}</span>
                                </div>

                                <div v-if="attempt.error_text" class="delivery-error">
                                  {{ attempt.error_text }}
                                </div>

                                <div v-if="attempt.response_body_excerpt" class="attempt-body">
                                  {{ attempt.response_body_excerpt }}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
  </template>
</Card>
</section>
<section :id="'bot-panel-diagnostics'" role="tabpanel" aria-labelledby="bot-tab-diagnostics" v-show="activeTab === 'diagnostics'" class="bot-tab-panel">
<div v-if="!selectedWebhookInstallation" class="empty-urls">Выберите активную установку бота.</div>
<div v-else id="bot-protection" class="bot-diagnostics">
              <h2 class="section-title"><AppIcon name="shield-check" :size="24" /> Защита и диагностика установки</h2>
              <p class="section-desc">
                Показатели обновляются по запросу. Состояние WebSocket доступно при выбранном режиме Gateway.
              </p>
              <GatewayStatusCard
                v-if="deliveryMode === 'websocket'"
                :installation-id="Number(selectedWebhookInstallationId)"
              />
              <RuntimeProtectionCard
                :installation-id="Number(selectedWebhookInstallationId)"
              />
            </div>
</section>
<section :id="'bot-panel-danger'" role="tabpanel" aria-labelledby="bot-tab-danger" v-show="activeTab === 'danger'" class="bot-tab-panel">
<Card id="bot-danger" class="section-card danger-card">
              <div class="section-header">
                <h2 class="section-title"><AppIcon name="trash-2" :size="24" /> Опасная зона</h2>
              </div>
              <div class="danger-actions">
                <div class="danger-item">
                  <div>
                    <h4>Удалить бота</h4>
                    <p>Это действие нельзя отменить. Все данные будут удалены.</p>
                  </div>
                  <Button variant="danger" @click="handleDeleteBot"> Удалить </Button>
                </div>
              </div>
            </Card>
</section>
</div>
    </div>

    <!-- Modals -->
    <EditBotModal
      :is-open="showEditModal"
      :bot="bot"
      :is-loading="isUpdating"
      @close="showEditModal = false"
      @submit="handleUpdateBot"
    />

    <!-- Create Credential Confirmation -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showCreateCredential"
          class="modal-overlay"
          @click.self="closeCreateCredentialDialog"
          @keydown.esc="closeCreateCredentialDialog"
        >
          <div class="modal-content confirm-modal" role="dialog" aria-modal="true" aria-labelledby="credential-dialog-title">
            <div class="modal-header">
              <h2 id="credential-dialog-title">{{ activeCredential ? 'Заменить Client Secret?' : 'Создать Client Secret?' }}</h2>
            </div>
            <div class="modal-body">
              <p v-if="activeCredential">
                Новый секрет заменит действующий. Интеграции со старым секретом могут потерять доступ,
                пока вы не обновите их конфигурацию.
              </p>
              <p v-else>
                Новый секрет будет показан только один раз после создания. Сохраните его в защищённом хранилище.
              </p>
              <label v-if="activeCredential" class="credential-confirmation">
                <input v-model="credentialRotationAcknowledged" type="checkbox" class="ui-checkbox" />
                <span>Понимаю, что потребуется обновить секрет в работающих интеграциях</span>
              </label>
              <div class="modal-actions">
                <Button variant="ghost" :disabled="isCreatingCredential" @click="closeCreateCredentialDialog">Отмена</Button>
                <Button
                  variant="primary"
                  :disabled="!!activeCredential && !credentialRotationAcknowledged"
                  :loading="isCreatingCredential"
                  @click="handleCreateCredential"
                >
                  {{ activeCredential ? 'Заменить секрет' : 'Создать секрет' }}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBotsStore } from '@/stores/bots'
import { useToastStore } from '@/stores/toast'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import Badge from '@/components/ui/Badge.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import { botEventIcon } from '@/utils/appIcons'
import ToastContainer from '@/components/ui/ToastContainer.vue'
import CredentialCard from '@/components/bots/CredentialCard.vue'
import AddRedirectModal from '@/components/bots/AddRedirectModal.vue'
import InstallationCard from '@/components/bots/InstallationCard.vue'
import GatewayStatusCard from '@/components/bots/GatewayStatusCard.vue'
import RuntimeProtectionCard from '@/components/bots/RuntimeProtectionCard.vue'
import EditBotModal from '@/components/bots/EditBotModal.vue'
import { scopeTitle } from '@/utils/botScopeCatalog'
import { botEventTitle } from '@/utils/botEventCatalog'
import type { BotApp, BotCredential } from '@/types'
import {
  type BotEventDeliveryAttempt,
  type BotEventDelivery,
  type BotInstallation,
  type BotCommand,
  type InstallationWebhookConfig,
  type BotReplayEvent,
} from '@/api/bots.ts'

const route = useRoute()
const router = useRouter()
const botsStore = useBotsStore()
const toastStore = useToastStore()

const selectedInstallationId = ref<string>('')

const selectedWebhookInstallationId = ref<string>('')
const installationWebhook = ref<InstallationWebhookConfig | null>(null)
const installationDeliveries = ref<BotEventDelivery[]>([])
const deliveryAttempts = ref<Record<string, BotEventDeliveryAttempt[]>>({})
const expandedDeliveryId = ref<string | null>(null)
const isLoadingAttempts = ref(false)
const isLoadingWebhook = ref(false)
const isSavingWebhook = ref(false)
const isRotatingWebhookSecret = ref(false)
const isLoadingDeliveries = ref(false)
const revealedWebhookSecret = ref<string | null>(null)

const commands = ref<BotCommand[]>([])
const isLoadingCommands = ref(false)
const isSavingCommand = ref(false)
const editingCommandId = ref<number | null>(null)

const replayEvents = ref<BotReplayEvent[]>([])

const replayAfterSeq = ref<number>(0)
const replayLimit = ref<number>(50)
const isLoadingReplayEvents = ref(false)

const eventSearchQuery = ref('')

const filteredSelectableEvents = computed(() => {
  const query = eventSearchQuery.value.trim().toLowerCase()

  if (!query) return selectableEvents.value

  return selectableEvents.value.filter((event) => {
    return (
      event.type.toLowerCase().includes(query) ||
      botEventTitle(event.type, event.label).toLowerCase().includes(query) ||
      event.label.toLowerCase().includes(query) ||
      event.group?.toLowerCase().includes(query)
    )
  })
})

const commandForm = ref({
  name: '',
  description: '',
  is_enabled: true,
})

type EventDeliveryType = 'webhook' | 'websocket'

const createDefaultWebhookForm = () => ({
  webhook_url: '',
  command_base_url: '',
  subscribed_events: [] as string[],
  event_delivery: 'webhook' as EventDeliveryType,
  enabled: false,
})

const webhookForm = ref(createDefaultWebhookForm())
type DeliveryMode = 'disabled' | 'webhook' | 'websocket'

const isWebhookTransport = computed(() => webhookForm.value.event_delivery === 'webhook')

const selectedWebhookInstallation = computed(() => {
  return (
    installations.value.find((i) => String(i.id) === String(selectedWebhookInstallationId.value)) ||
    null
  )
})

const grantedScopes = computed(() => {
  return new Set(selectedWebhookInstallation.value?.granted_scopes ?? [])
})

const selectableEvents = computed(() => {

  return (bot.value?.available_events ?? []).filter((event) =>
    event.required_scopes.every((scope) => grantedScopes.value.has(scope)),
  )
})

const activeInstallationsList = computed(() => {
  return installations.value.filter((i) => i.status === 'active')
})

computed(() => {
  return (
    activeInstallationsList.value.find(
      (i) => String(i.id) === String(selectedInstallationId.value),
    ) || null
  )
})
const botId = computed(() => route.params.id as string)

// Each tab is a separate visible workspace; v-show preserves unsaved form state.
const detailTabs = [
  { id: 'overview', label: 'Обзор', icon: 'layout-dashboard' },
  { id: 'auth', label: 'Авторизация', icon: 'key-round' },
  { id: 'commands', label: 'Команды', icon: 'terminal' },
  { id: 'installations', label: 'Установки', icon: 'server' },
  { id: 'connection', label: 'Подключение', icon: 'plug-zap' },
  { id: 'subscriptions', label: 'Подписки', icon: 'list-checks' },
  { id: 'journal', label: 'Журнал', icon: 'scroll-text' },
  { id: 'diagnostics', label: 'Диагностика', icon: 'activity' },
  { id: 'danger', label: 'Опасная зона', icon: 'trash-2' },
] as const

type BotDetailTab = (typeof detailTabs)[number]['id']
const activeTab = ref<BotDetailTab>('overview')
const tabsWithInstallationContext: BotDetailTab[] = [
  'overview', 'connection', 'subscriptions', 'journal', 'diagnostics',
]
const selectTab = (tab: BotDetailTab) => {
  activeTab.value = tab
  // The selected tab is reflected in the URL for direct links and refresh.
  void router.replace({ query: { ...route.query, tab } })
}
const handleTabKeydown = (event: KeyboardEvent, current: BotDetailTab) => {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
  event.preventDefault()
  const index = detailTabs.findIndex((tab) => tab.id === current)
  const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? detailTabs.length - 1
    : (index + (event.key === 'ArrowRight' ? 1 : detailTabs.length - 1)) % detailTabs.length
  const next = detailTabs[nextIndex]
  if (!next) return
  selectTab(next.id)
  document.getElementById(`bot-tab-${next.id}`)?.focus()
}
watch(() => route.query.tab, (tab) => {
  activeTab.value = detailTabs.find((item) => item.id === tab)?.id ?? 'overview'
}, { immediate: true })

const scopeDisplayName = (name: string) => scopeTitle({ name, label: '' })

const eventDisplayName = (type: string): string => {
  const backendLabel = bot.value?.available_events?.find((event) => event.type === type)?.label
  return botEventTitle(type, backendLabel)
}

const deliveryStatusLabel = (status: string): string => {
  switch (status) {
    case 'success': return 'Доставлено'
    case 'failed': return 'Ошибка'
    case 'pending': return 'В очереди'
    case 'processing': return 'Отправляется'
    case 'retry': return 'Повторная попытка'
    default: return status
  }
}

const statusBadgeVariant = computed(() => {
  switch (bot.value?.status) {
    case 'active':
      return 'success'
    case 'draft':
      return 'warning'
    case 'suspended':
      return 'danger'
    default:
      return 'default'
  }
})

const statusLabel = computed(() => {
  switch (bot.value?.status) {
    case 'active':
      return bot.value?.is_public ? 'Публичный' : 'Активный'
    case 'draft':
      return 'Черновик'
    case 'inactive':
      return 'Неактивен'
    case 'suspended':
      return 'Приостановлен'
    default:
      return bot.value?.status
  }
})

// State
const bot = ref<BotApp | null>(null)
const installations = ref<BotInstallation[]>([])
const credentials = ref<BotCredential[]>([])
const isLoading = ref(true)
const isUpdating = ref(false)
const isCreatingCredential = ref(false)
const error = ref<string | null>(null)
const freshlyCreatedSecret = ref<{
  client_id: string
  client_secret: string
  createdAt: string
} | null>(null)
const isPublishing = ref(false)

// Modals
const showEditModal = ref(false)
const showCreateCredential = ref(false)
const credentialRotationAcknowledged = ref(false)
const showAddRedirectModal = ref(false)
const isSavingRedirectURIs = ref(false)
const pendingRedirectURIToRemove = ref<string | null>(null)
const redirectURIs = computed(() => bot.value?.redirect_uris ?? [])

const saveRedirectURIs = async (uris: string[]): Promise<boolean> => {
  if (isSavingRedirectURIs.value) return false
  isSavingRedirectURIs.value = true
  try {
    // Update uses PUT with an optional list; the remaining bot fields stay unchanged.
    const updated = await botsStore.updateBot(botId.value, { redirect_uris: uris })
    const details = await botsStore.fetchBotDetails(botId.value)
    if (!details) throw new Error('Не удалось загрузить обновлённые адреса')
    bot.value = details
    toastStore.success('Адреса перенаправления сохранены')
    return !!updated
  } catch (err: any) {
    toastStore.error(err.message || 'Не удалось сохранить Redirect URI')
    return false
  } finally {
    isSavingRedirectURIs.value = false
  }
}

const addRedirectURI = async (uri: string) => {
  if (redirectURIs.value.includes(uri)) {
    toastStore.error('Этот Redirect URI уже зарегистрирован')
    return
  }
  if (await saveRedirectURIs([...redirectURIs.value, uri])) showAddRedirectModal.value = false
}

const removeRedirectURI = async (uri: string) => {
  const remaining = redirectURIs.value.filter((item) => item !== uri)
  if (await saveRedirectURIs(remaining)) pendingRedirectURIToRemove.value = null
}

const openCreateCredentialDialog = () => {
  credentialRotationAcknowledged.value = false
  showCreateCredential.value = true
}

const closeCreateCredentialDialog = () => {
  if (isCreatingCredential.value) return
  showCreateCredential.value = false
  credentialRotationAcknowledged.value = false
}

// Computed
const avatarStyle = computed(() => {
  if (bot.value?.avatar_url) {
    return { backgroundImage: `url(${bot.value.avatar_url})`, backgroundSize: 'cover' }
  }
  return {}
})

const activeInstallations = computed(() => {
  return installations.value.filter((i) => i.status === 'active').length
})

const allowedScopes = computed(() => {
  return bot.value?.scopes || []
})

const savedSubscribedEvents = computed(() => {
  return installationWebhook.value?.subscribed_events ?? []
})

const activeCredential = computed(() => {
  return credentials.value.find((c) => c.is_active) || null
})
const activeCredentialsCount = computed(() => credentials.value.filter((c) => c.is_active).length)

// Methods
const deliveryMode = computed<DeliveryMode>({
  get() {
    if (!webhookForm.value.enabled) return 'disabled'
    return webhookForm.value.event_delivery
  },
  set(value) {
    if (value === 'disabled') {
      webhookForm.value.enabled = false
      return
    }

    webhookForm.value.enabled = true
    webhookForm.value.event_delivery = value

    if (value === 'websocket') {
      webhookForm.value.webhook_url = ''
      revealedWebhookSecret.value = null
      installationDeliveries.value = []
      deliveryAttempts.value = {}
      expandedDeliveryId.value = null
    }
  },
})

const loadInstallationWebhook = async () => {
  if (!selectedWebhookInstallationId.value) {
    installationWebhook.value = null
    installationDeliveries.value = []
    deliveryAttempts.value = {}
    expandedDeliveryId.value = null
    webhookForm.value = createDefaultWebhookForm()
    return
  }

  const requestedInstallationId = selectedWebhookInstallationId.value
  isLoadingWebhook.value = true
  try {
    const data = await botsStore.fetchInstallationWebhook(requestedInstallationId)
    if (requestedInstallationId !== selectedWebhookInstallationId.value) return
    installationWebhook.value = data

    webhookForm.value = {
      enabled: !!data?.enabled,
      webhook_url: data?.webhook_url || '',
      command_base_url: data?.command_base_url || '',
      subscribed_events: Array.isArray(data?.subscribed_events) ? [...data.subscribed_events] : [],
      event_delivery: data?.event_delivery === 'websocket' ? 'websocket' : 'webhook',
    }
  } catch (err: any) {
    if (requestedInstallationId === selectedWebhookInstallationId.value) {
      toastStore.error(err.message || 'Не удалось загрузить настройки подключения')
    }
  } finally {
    if (requestedInstallationId === selectedWebhookInstallationId.value) {
      isLoadingWebhook.value = false
    }
  }
}

const loadInstallationDeliveries = async () => {
  if (!selectedWebhookInstallationId.value) {
    installationDeliveries.value = []
    return
  }

  const requestedInstallationId = selectedWebhookInstallationId.value
  isLoadingDeliveries.value = true
  try {
    const rows = await botsStore.fetchInstallationDeliveries(requestedInstallationId, 20)
    if (requestedInstallationId !== selectedWebhookInstallationId.value) return
    installationDeliveries.value = rows || []
  } catch (err: any) {
    if (requestedInstallationId === selectedWebhookInstallationId.value) {
      toastStore.error(err.message || 'Не удалось загрузить доставки')
    }
  } finally {
    if (requestedInstallationId === selectedWebhookInstallationId.value) {
      isLoadingDeliveries.value = false
    }
  }
}

const toggleDeliveryAttempts = async (deliveryId: string) => {
  if (!selectedWebhookInstallationId.value) {
    return
  }

  if (expandedDeliveryId.value === deliveryId) {
    expandedDeliveryId.value = null
    return
  }

  expandedDeliveryId.value = deliveryId

  if (deliveryAttempts.value[deliveryId]) {
    return
  }

  isLoadingAttempts.value = true
  try {
    const rows = await botsStore.fetchDeliveryAttempts(
      selectedWebhookInstallationId.value,
      deliveryId,
    )

    deliveryAttempts.value = {
      ...deliveryAttempts.value,
      [deliveryId]: rows || [],
    }
  } catch (err: any) {
    toastStore.error(err.message || 'Не удалось загрузить attempts')
  } finally {
    isLoadingAttempts.value = false
  }
}

const handleSelectWebhookInstallation = async () => {
  installationWebhook.value = null
  webhookForm.value = createDefaultWebhookForm()
  installationDeliveries.value = []
  revealedWebhookSecret.value = null
  deliveryAttempts.value = {}
  expandedDeliveryId.value = null
  replayEvents.value = []
  replayAfterSeq.value = 0
  await loadInstallationWebhook()
  await loadInstallationDeliveries()
}

const handleSaveWebhook = async () => {
  if (!selectedWebhookInstallationId.value) {
    toastStore.error('Сначала выберите установку')
    return
  }

  isSavingWebhook.value = true

  const allowedEventTypes = new Set(selectableEvents.value.map((event) => event.type))

  webhookForm.value.subscribed_events = webhookForm.value.subscribed_events.filter((eventType) =>
    allowedEventTypes.has(eventType),
  )

  try {
    const payload = {
      webhook_url:
        webhookForm.value.event_delivery === 'webhook' && webhookForm.value.enabled
          ? webhookForm.value.webhook_url.trim()
          : '',
      command_base_url: webhookForm.value.command_base_url.trim(),
      event_delivery: webhookForm.value.event_delivery,
      subscribed_events: [...webhookForm.value.subscribed_events],
      enabled: webhookForm.value.enabled,
    }

    await botsStore.updateInstallationWebhook(selectedWebhookInstallationId.value, payload)

    await loadInstallationWebhook()

    if (webhookForm.value.event_delivery === 'webhook' && webhookForm.value.enabled) {
      await loadInstallationDeliveries()
    } else {
      installationDeliveries.value = []
      deliveryAttempts.value = {}
      expandedDeliveryId.value = null
    }

    toastStore.success(
      webhookForm.value.enabled
        ? `Настройки доставки сохранены (${webhookForm.value.event_delivery === 'websocket' ? 'WebSocket Gateway' : 'Webhook'})`
        : 'Доставка событий отключена',
    )
  } catch (err: any) {
    toastStore.error(err.message || 'Не удалось сохранить runtime конфигурацию')
  } finally {
    isSavingWebhook.value = false
  }
}

const handleRotateWebhookSecret = async () => {
  if (!selectedWebhookInstallationId.value) {
    toastStore.error('Сначала выберите установку')
    return
  }

  if (!confirm('Сгенерировать новый webhook secret? Старый перестанет работать.')) {
    return
  }

  isRotatingWebhookSecret.value = true
  try {
    const secret = await botsStore.rotateInstallationWebhookSecret(
      selectedWebhookInstallationId.value,
    )
    revealedWebhookSecret.value = secret || null
    toastStore.success('Новый webhook secret сгенерирован')
  } catch (err: any) {
    toastStore.error(err.message || 'Не удалось ротировать webhook secret')
  } finally {
    isRotatingWebhookSecret.value = false
  }
}
const loadBot = async () => {
  isLoading.value = true
  error.value = null

  try {
    // Load bot details
    const botData = await botsStore.fetchBotDetails(botId.value)
    if (botData) {
      bot.value = botData
    } else {
      error.value = 'Бот не найден'
      return
    }

    // Load credentials
    const credsData = await botsStore.fetchBotCredentials(botId.value)
    credentials.value = credsData || []

    // Load installations
    const instData = await botsStore.fetchBotInstallations(botId.value)
    installations.value = instData || []

    const commandsData = await botsStore.fetchBotCommands(botId.value)
    commands.value = commandsData || []

    if (!selectedWebhookInstallationId.value) {
      const firstActiveInstallation = (instData || []).find((i) => i.status === 'active')
      if (firstActiveInstallation) {
        selectedWebhookInstallationId.value = String(firstActiveInstallation.id)
        await loadInstallationWebhook()
        await loadInstallationDeliveries()
      }
    }
  } catch (err: any) {
    error.value = err.message || 'Ошибка загрузки данных'
    toastStore.error('Не удалось загрузить данные бота')
  } finally {
    isLoading.value = false
  }
}

const handleUpdateBot = async (updates: Partial<BotApp>) => {
  isUpdating.value = true
  try {
    await botsStore.updateBot(botId.value, updates)
    bot.value = { ...bot.value!, ...updates }
    toastStore.success('Бот успешно обновлен')
    showEditModal.value = false
  } catch (err: any) {
    toastStore.error('Ошибка обновления: ' + err.message)
  } finally {
    isUpdating.value = false
  }
}

const handleCreateCredential = async () => {
  if (isCreatingCredential.value || !showCreateCredential.value) return
  if (activeCredential.value && !credentialRotationAcknowledged.value) return

  isCreatingCredential.value = true
  try {
    // createCredential добавит в список новую запись (без секрета)
    const newCred = await botsStore.createCredential(botId.value, 'secret')

    // Сохраняем секрет отдельно, чтобы показать один раз
    freshlyCreatedSecret.value = {
      client_id: newCred.client_id,
      client_secret: newCred.client_secret,
      createdAt: newCred.created_at,
    }

    // Only close the dialog when the server confirmed creation.
    showCreateCredential.value = false
    credentialRotationAcknowledged.value = false
    await loadBot()
    // The secret is revealed once: bring the user directly to the authorization tab.
    selectTab('auth')

    toastStore.success('Client Secret создан. Сохраните его сейчас!')
  } catch (err: any) {
    toastStore.error('Ошибка создания секрета: ' + err.message)
  } finally {
    isCreatingCredential.value = false
  }
}

const handleRevokeInstallation = async (installationId: string | number) => {
  try {
    await botsStore.revokeInstallation(installationId)
    installations.value = installations.value.filter((i) => String(i.id) !== String(installationId))

    if (String(selectedWebhookInstallationId.value) === String(installationId)) {
      selectedWebhookInstallationId.value = ''
      installationWebhook.value = null
      installationDeliveries.value = []
      deliveryAttempts.value = {}
      expandedDeliveryId.value = null
      webhookForm.value = createDefaultWebhookForm()
    }

    toastStore.success('Доступ отозван')
  } catch (err: any) {
    toastStore.error('Ошибка отзыва доступа: ' + err.message)
  }
}

const handleDeleteBot = async () => {
  if (!confirm('Вы уверены? Это действие нельзя отменить. Бот будет удален навсегда.')) {
    return
  }

  try {
    await botsStore.deleteBot(botId.value)
    toastStore.success('Бот удален')
    router.push('/bots')
  } catch (err: any) {
    toastStore.error('Ошибка удаления: ' + err.message)
  }
}

const publishBot = async () => {
  if (!confirm('Опубликовать бота? Он станет доступен в каталоге публичных ботов.')) {
    return
  }

  isPublishing.value = true
  try {
    await botsStore.publishBot(botId.value)
    toastStore.success('Бот успешно опубликован и теперь виден в каталоге!')
  } catch (err: any) {
    toastStore.error('Ошибка публикации: ' + err.message)
  } finally {
    isPublishing.value = false
  }
}

const hasMoreReplayEvents = computed(() => {
  if (replayEvents.value.length < replayLimit.value) return false

  const last = replayEvents.value[replayEvents.value.length - 1]
  return Boolean(last?.seq)
})

const nextReplayAfterSeq = computed(() => {
  const last = replayEvents.value[replayEvents.value.length - 1]
  return last?.seq ?? replayAfterSeq.value
})

const loadReplayEvents = async () => {
  if (!selectedWebhookInstallationId.value) {
    toastStore.error('Сначала выберите установку')
    return
  }

  isLoadingReplayEvents.value = true
  try {
    const result = await botsStore.fetchInstallationEvents(
      selectedWebhookInstallationId.value,
      replayAfterSeq.value,
      replayLimit.value,
    )


    replayEvents.value = Array.isArray(result) ? result : []
  } catch (err: any) {
    toastStore.error(err.message || 'Не удалось загрузить replay events')
  } finally {
    isLoadingReplayEvents.value = false
  }
}

const loadNextReplayEvents = async () => {
  replayAfterSeq.value = nextReplayAfterSeq.value
  await loadReplayEvents()
}

const dismissFreshSecret = () => {
  freshlyCreatedSecret.value = null
}

const resetCommandForm = () => {
  commandForm.value = {
    name: '',
    description: '',
    is_enabled: true,
  }
  editingCommandId.value = null
}

const validateCommandForm = () => {
  const name = commandForm.value.name.trim().toLowerCase()
  const description = commandForm.value.description.trim()

  if (!/^[a-z0-9_-]{2,32}$/.test(name)) {
    toastStore.error(
      'Имя команды должно содержать 2-32 символа: строчные латинские буквы, цифры, "_" или "-"',
    )
    return false
  }

  if (!description) {
    toastStore.error('Введите описание команды')
    return false
  }

  if (description.length > 100) {
    toastStore.error('Описание не должно превышать 100 символов')
    return false
  }

  return true
}

const loadCommands = async () => {
  isLoadingCommands.value = true
  try {
    const rows = await botsStore.fetchBotCommands(botId.value)
    commands.value = rows || []
  } catch (err: any) {
    toastStore.error(err.message || 'Не удалось загрузить команды')
  } finally {
    isLoadingCommands.value = false
  }
}

const startEditCommand = (command: BotCommand) => {
  editingCommandId.value = command.id
  commandForm.value = {
    name: command.name,
    description: command.description,
    is_enabled: command.is_enabled,
  }
}

const handleSaveCommand = async () => {
  if (!validateCommandForm()) {
    return
  }

  isSavingCommand.value = true
  try {
    const payload = {
      name: commandForm.value.name.trim().toLowerCase(),
      description: commandForm.value.description.trim(),
      is_enabled: commandForm.value.is_enabled,
    }

    if (editingCommandId.value) {
      await botsStore.updateBotCommand(botId.value, editingCommandId.value, payload)
      toastStore.success('Команда обновлена')
    } else {
      await botsStore.createBotCommand(botId.value, payload)
      toastStore.success('Команда создана')
    }

    await loadCommands()
    resetCommandForm()
  } catch (err: any) {
    toastStore.error(err.message || 'Не удалось сохранить команду')
  } finally {
    isSavingCommand.value = false
  }
}

const handleDeleteCommand = async (commandId: number) => {
  if (!confirm('Удалить slash-команду?')) {
    return
  }

  try {
    await botsStore.deleteBotCommand(botId.value, commandId)
    commands.value = commands.value.filter((cmd) => cmd.id !== commandId)

    if (editingCommandId.value === commandId) {
      resetCommandForm()
    }

    toastStore.success('Команда удалена')
  } catch (err: any) {
    toastStore.error(err.message || 'Не удалось удалить команду')
  }
}

const handleToggleCommand = async (command: BotCommand) => {
  try {
    await botsStore.toggleBotCommand(botId.value, command.id, !command.is_enabled)
    await loadCommands()
    toastStore.success(
      command.is_enabled
        ? `Команда /${command.name} выключена`
        : `Команда /${command.name} включена`,
    )
  } catch (err: any) {
    toastStore.error(err.message || 'Не удалось изменить состояние команды')
  }
}

const formatDate = (value?: string | null) => {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString('ru-RU')
}

watch(
  () => webhookForm.value.event_delivery,
  (newValue) => {
    if (newValue === 'websocket') {
      webhookForm.value.webhook_url = ''
      revealedWebhookSecret.value = null
      installationDeliveries.value = []
      deliveryAttempts.value = {}
      expandedDeliveryId.value = null
    }
  },
)

onMounted(() => {
  loadBot()
})
</script>

<style scoped>
/* One active workspace at a time: no scrolling through unrelated settings. */
.bot-section-nav {
  position: sticky;
  top: 72px;
  z-index: 20;
  display: flex;
  gap: 4px;
  overflow-x: auto;
  margin-bottom: 20px;
  padding: 6px;
  border: 1px solid var(--border-color);
  border-radius: 14px;
  background: var(--bg-secondary);
  scrollbar-width: thin;
}
.bot-section-nav button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex: 0 0 auto;
  padding: 11px 14px;
  border: 0;
  border-radius: 9px;
  background: transparent;
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 170ms ease, color 170ms ease, box-shadow 170ms ease;
}
.bot-section-nav button:hover,
.bot-section-nav button:focus-visible {
  color: var(--text-primary);
  background: var(--glass);
}
.bot-section-nav button.is-active {
  color: var(--text-primary);
  background: var(--bg-tertiary);
  box-shadow: inset 0 -2px var(--accent-primary);
  font-weight: 600;
}
.bot-section-nav button:focus-visible { outline: 2px solid var(--accent-primary); outline-offset: -2px; }
.bot-section-nav button[aria-selected="true"] svg { color: var(--accent-primary); }
.section-title, .inline-icon-label { display: inline-flex; align-items: center; gap: 10px; }
.section-title svg { color: var(--accent-primary); }
.inline-icon-label svg { color: currentColor; }
.bot-detail .back-btn { gap: 8px; }
.bot-detail .back-btn:hover svg { transform: translateX(-2px); }
.bot-detail .back-btn svg { transition: transform 160ms ease; }
.bot-detail .section-card { transition: border-color 180ms ease, background-color 180ms ease; }
.bot-detail .section-card:focus-within { border-color: var(--accent-primary); }
.bot-detail .section-card:hover { border-color: color-mix(in srgb, var(--accent-primary) 32%, var(--border-color)); }
@media (prefers-reduced-motion: reduce) {
  .bot-detail .back-btn svg, .bot-detail .section-card { transition: none; }
  .bot-tab-panel { animation: none; }
}
.bot-tab-panel {
  width: 100%; min-width: 0; max-width: none; margin: 0;
  animation: bot-panel-enter 180ms ease-out both;
}
@keyframes bot-panel-enter {
  from { opacity: 0.72; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
.bot-tab-panel[style*="display: none"] { display: none; }
/* Единая ширина для всех вкладок, как у панели навигации. */
.overview-information-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  align-items: stretch;
}
.bot-tab-panel .overview-information-grid .overview-info-card {
  min-width: 0;
  margin-bottom: 0;
}
.overview-information-grid .tags-list { align-content: flex-start; }
.overview-information-grid .tags-list .badge {
  max-width: 100%;
  white-space: normal;
  overflow-wrap: anywhere;
  text-transform: none;
  line-height: 1.35;
}
.overview-information-grid .text-link { display: inline-block; margin-top: 16px; }
.delivery-event-title { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.delivery-event-title code { font-size: 12px; color: var(--text-secondary); overflow-wrap: anywhere; }
@media (max-width: 850px) {
  .overview-information-grid { grid-template-columns: minmax(0, 1fr); }
}
.installation-context {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  margin: 0 0 18px;
  padding: 14px 18px;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: var(--glass);
}
.installation-context-label { display: flex; flex-direction: column; gap: 3px; }
.installation-context-label span { font-size: 14px; font-weight: 600; color: var(--text-primary); }
.installation-context-label small { font-size: 12px; color: var(--text-secondary); }
/* Select подстраивается под любую из тем портала через CSS-переменные. */
.installation-context .form-select {
  width: min(100%, 360px);
  min-height: 44px;
  padding: 10px 14px;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  font: inherit;
  font-size: 14px;
  color-scheme: dark;
  transition: border-color 160ms ease, background-color 160ms ease;
}
.installation-context .form-select.is-placeholder {
  color: var(--text-secondary);
}
.installation-context .form-select option {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
}
.installation-context .form-select option[value=""] {
  color: var(--text-secondary);
}
/* Системное выпадающее меню должно быть светлым в светлых темах. */
:global(html[data-theme="lightDay"]) .installation-context .form-select,
:global(html[data-theme="softWarm"]) .installation-context .form-select {
  color-scheme: light;
}
.installation-context .form-select:hover {
  border-color: var(--accent-primary);
}
.installation-context .form-select:focus-visible {
  outline: 2px solid var(--accent-primary);
  outline-offset: 2px;
}
.scope-context { margin: -4px 0 10px; font-size: 12px; color: var(--text-secondary); }
.text-link { margin-top: 10px; padding: 0; border: 0; background: transparent; color: var(--accent-primary); font: inherit; font-size: 13px; cursor: pointer; }
.text-link:hover { text-decoration: underline; }
.text-link:focus-visible { outline: 2px solid var(--accent-primary); outline-offset: 4px; }
.connection-form, .subscription-form { display: flex; flex-direction: column; gap: 24px; }
.settings-group { display: flex; flex-direction: column; gap: 14px; padding-bottom: 24px; border-bottom: 1px solid var(--border-color); }
.settings-group h3 { margin: 0; color: var(--text-primary); font-weight: 600; font-size: 15px; }
.settings-help { margin: -8px 0 4px; color: var(--text-secondary); font-size: 13px; line-height: 1.5; }
.settings-actions { display: flex; justify-content: flex-end; align-items: center; flex-wrap: wrap; gap: 10px; }
.selected-count { margin-right: auto; color: var(--text-secondary); font-size: 13px; }
.connection-form .delivery-mode-list { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
.connection-form .delivery-mode-card { display: flex; gap: 10px; padding: 16px; border: 1px solid var(--border-color); border-radius: 12px; background: var(--glass); cursor: pointer; transition: border-color 160ms ease, background 160ms ease; }
.connection-form .delivery-mode-card:hover { border-color: var(--accent-primary); }
.connection-form .delivery-mode-card:has(input:checked) { border-color: var(--accent-primary); background: var(--bg-secondary); }
.connection-form .delivery-mode-card input { margin: 3px 0 0; accent-color: var(--accent-primary); }
.connection-form .delivery-mode-card div { min-width: 0; }
.connection-form .delivery-mode-card p { margin: 4px 0 0; }
.connection-form .field-hint { display: grid; gap: 6px; border-top: 1px solid var(--border-color); padding-top: 12px; color: var(--text-secondary); }
.connection-form .field-hint strong { font-weight: 500; color: var(--text-primary); overflow-wrap: anywhere; }
.connection-form .settings-group .form-group label { color: var(--text-primary); font-size: 13px; font-weight: 500; }
.subscription-form .event-subscription-item strong { font-weight: 500; }
.subscription-form .form-input, .replay-card .form-input { background: var(--bg-secondary); color: var(--text-primary); border-color: var(--border-color); }
.subscription-form .form-input::placeholder { color: var(--text-secondary); }
.subscription-form .event-subscription-item { border-bottom: 1px solid var(--border-color); border-radius: 0; }
.subscription-form .event-subscription-item:last-of-type { border-bottom: 0; }
.bot-tab-panel .section-card { margin-bottom: 18px; }
.bot-tab-panel .section-desc { line-height: 1.6; max-width: 78ch; }
.bot-tab-panel .form-select:focus-visible, .bot-tab-panel .form-input:focus-visible { outline: 2px solid var(--accent-primary); outline-offset: 1px; }
.connection-form .delivery-mode-card { align-items: flex-start; min-width: 0; margin: 0; }
.connection-form .delivery-mode-card strong { font-size: 13px; font-weight: 600; }
.connection-form .delivery-mode-card p { font-size: 12px; color: var(--text-secondary); line-height: 1.5; }
.connection-form .field-help { font-size: 12px; line-height: 1.5; color: var(--text-secondary); }
.connection-form .field-help code { font-family: monospace; font-weight: 400; }
.connection-form .form-input, .connection-form .form-select { background: var(--bg-secondary); color: var(--text-primary); border-color: var(--border-color); }
.subscription-form .scrollable-events-list { min-height: 260px; height: min(48vh, 460px); max-height: 460px; }
@media (max-width: 720px) {
  .installation-context { flex-direction: column; align-items: stretch; }
  .installation-context .form-select { width: 100%; }
  .connection-form .delivery-mode-list { grid-template-columns: 1fr; }
}
@media (prefers-reduced-motion: reduce) { .bot-section-nav button { transition: none; } }

.setup-guide {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
  padding: 18px 22px;
  border: 1px solid var(--border-color);
  border-radius: 14px;
  background: var(--glass);
}

.setup-guide h2 {
  margin: 0 0 4px;
  color: var(--text-primary);
  font-size: 17px;
}

.setup-guide p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.5;
}

.setup-guide ol {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.setup-guide li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  min-width: 0;
}

.setup-guide li > span {
  display: inline-flex;
  flex: 0 0 28px;
  justify-content: center;
  align-items: center;
  height: 28px;
  border-radius: 9px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  font-weight: 700;
}

.setup-guide li.setup-done > span {
  color: #22c55e;
}

.setup-guide li strong {
  display: block;
  color: var(--text-primary);
  font-size: 13px;
  margin-bottom: 4px;
}

.setup-docs-link {
  align-self: flex-start;
  color: var(--accent-primary);
  font-size: 13px;
  font-weight: 600;
}

.bot-diagnostics {
  display: grid;
  gap: 14px;
  min-width: 0;
  margin-bottom: 24px;
}

.bot-diagnostics h2 {
  margin: 0;
  font-size: 18px;
  color: var(--text-primary);
}

.replay-event-code {
  color: var(--text-secondary);
  font-size: 12px;
  overflow-wrap: anywhere;
}

@media (max-width: 800px) {
  .setup-guide ol { grid-template-columns: 1fr; }
  .bot-section-nav { top: 72px; }
}

.test-runtime-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  font-size: 14px;
}

.field-hint {
  font-size: 12px;
  color: var(--text-secondary);
}

.test-actions {
  justify-content: flex-start;
}

.bot-detail {
  padding: 100px 0 60px;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 1rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.back-btn {
  padding: 0.5rem 1rem;
}

.bot-title {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.bot-avatar {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
}

.bot-info h1 {
  margin: 0 0 0.5rem 0;
  font-size: 1.75rem;
  color: var(--text-primary);
}

.bot-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.bot-id {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-family: monospace;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

/* Content Grid */
.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
}

@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}

.section-card {
  margin-bottom: 1.5rem;
}

.section-header {
  margin-bottom: 1.5rem;
}

.section-header h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  color: var(--text-primary);
}

.section-desc {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

/* OAuth quick start + safe credential rotation */
.oauth-howto {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.875rem;
  margin: 0 0 1rem;
}
.oauth-howto-step {
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
  min-width: 0;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background: var(--bg-secondary);
  padding: 1rem;
}
.oauth-step-number {
  display: inline-flex;
  flex: 0 0 2rem;
  align-items: center;
  justify-content: center;
  height: 2rem;
  border-radius: 0.625rem;
  background: var(--bg-elevated);
  color: var(--accent-primary);
  font-weight: 700;
}
.oauth-howto-step strong { color: var(--text-primary); font-size: 0.9rem; }
.oauth-howto-step p { margin: 0.35rem 0 0; font-size: 0.82rem; line-height: 1.55; color: var(--text-secondary); }
.oauth-howto-step code { overflow-wrap: anywhere; color: var(--text-primary); }
.oauth-help-links { display: flex; gap: 1rem; flex-wrap: wrap; margin: 0 0 1.5rem; }
.oauth-help-links .text-link { cursor: pointer; background: none; border: 0; padding: 0; font: inherit; font-size: 0.875rem; }
.credential-confirmation { display: flex; align-items: flex-start; gap: 0.75rem; color: var(--text-primary); font-size: 0.875rem; line-height: 1.5; cursor: pointer; margin-bottom: 1rem; }
.credential-confirmation .ui-checkbox { margin-top: 0.15rem; }
@media (max-width: 960px) { .oauth-howto { grid-template-columns: 1fr; } }

/* Credentials */
.credentials-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.empty-credentials {
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
}

/* OAuth */
.oauth-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.oauth-url label,
.redirect-header label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.url-box {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(0, 0, 0, 0.2);
  padding: 0.75rem 1rem;
  border-radius: 8px;
}

.url-box code {
  flex: 1;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  color: var(--text-primary);
  word-break: break-all;
}

.redirect-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.urls-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.url-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: var(--glass);
  border: 1px solid var(--border-color);
  border-radius: 8px;
}

.url-item span {
  font-size: 0.875rem;
  color: var(--text-primary);
  word-break: break-all;
}

.empty-urls {
  padding: 1rem;
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

/* Scopes */
.scopes-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.scopes-block h4,
.events-block h4 {
  margin: 0 0 0.75rem 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.empty-tags {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-style: italic;
}

/* Installations */
.empty-installations {
  text-align: center;
  padding: 2rem;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-installations p {
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
}

.empty-hint {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.event-type {
  opacity: 0.65;
  margin-left: 6px;
  font-size: 12px;
}

/* Stats */
.stats-card {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1));
}

.quick-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  text-align: center;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-transform: uppercase;
}

/* Danger Zone */
.danger-card {
  border-color: rgba(239, 68, 68, 0.3);
}

.danger-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.danger-item h4 {
  margin: 0 0 0.25rem 0;
  color: #ef4444;
  font-size: 0.875rem;
}

.danger-item p {
  margin: 0;
  font-size: 0.75rem;
  color: var(--text-secondary);
}

/* Loading & Error */
.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  text-align: center;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 3px solid var(--border-color);
  border-top-color: var(--accent-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.error-state h3 {
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
}

.error-state p {
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  width: 100%;
  max-width: 500px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.confirm-modal .modal-header {
  padding: 1.5rem 1.5rem 0;
}

.confirm-modal .modal-body {
  padding: 1rem 1.5rem 1.5rem;
}

.confirm-modal p {
  margin: 0 0 1.5rem 0;
  color: var(--text-secondary);
  line-height: 1.6;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
  }

  .header-actions {
    width: 100%;
    justify-content: stretch;
  }

  .header-actions button {
    flex: 1;
  }

  .bot-title {
    flex-direction: column;
    text-align: center;
  }

  .danger-item {
    flex-direction: column;
    text-align: center;
  }
}

.checkbox-line {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.webhook-events-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.deliveries-block {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.deliveries-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.delivery-item {
  border: 1px solid var(--border-color);
  border-radius: 14px;
  padding: 14px;
  background: var(--glass);

  backdrop-filter: blur(10px);

  transition:
    border-color 0.2s ease,
    transform 0.2s ease,
    background 0.2s ease;
}

.delivery-item:hover {
  border-color: rgba(99, 102, 241, 0.35);
  background: rgba(255, 255, 255, 0.04);

  transform: translateY(-1px);
}

.delivery-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.delivery-meta {
  display: flex;
  gap: 16px;
  margin-top: 8px;
  font-size: 13px;
  color: var(--text-secondary);
}

.delivery-error {
  margin-top: 8px;
  color: #b91c1c;
  font-size: 13px;
  word-break: break-word;
}

.delivery-dates {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 8px;
  font-size: 12px;
  color: var(--text-secondary);
}

.delivery-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.attempts-block {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dashed #d1d5db;
}

.attempts-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.attempt-item {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px;
  background: #f9fafb;
}

.attempt-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.attempt-meta {
  display: flex;
  gap: 16px;
  margin-top: 6px;
  font-size: 12px;
  color: var(--text-secondary);
}

.attempt-body {
  margin-top: 8px;
  font-size: 12px;
  color: #374151;
  white-space: pre-wrap;
  word-break: break-word;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group-full {
  grid-column: 1 / -1;
}

.commands-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.command-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.command-name-input {
  display: flex;
  align-items: center;
  border: 1px solid var(--border-color);
  border-radius: var(--control-radius);
  background: var(--bg-secondary);
  padding: 0 12px;
  transition: border-color 160ms ease;
}

.command-name-input:hover { border-color: var(--accent-primary); }
.command-name-input:focus-within { outline: 2px solid var(--accent-primary); outline-offset: 2px; }

.command-name-input span {
  color: var(--text-secondary);
  font-weight: 600;
  margin-right: 6px;
}

.command-name-input input.ui-control {
  border: 0;
  min-height: 42px;
  width: 100%;
  padding: 10px 0;
  background: transparent;
}
.command-name-input input.ui-control:focus-visible { outline: none; }

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-group-full {
    grid-column: auto;
  }
}

.event-raw-details summary {
  cursor: pointer;
  opacity: 0.75;
  font-size: 13px;
}

.replay-card {
  margin-top: 24px;
}

.replay-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.replay-header-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-end;
}

.replay-toolbar {
  display: grid;
  grid-template-columns: 180px 140px auto;
  gap: 16px;
  align-items: end;
  margin-bottom: 14px;
}

.replay-input {
  min-width: 0;
}

.replay-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  flex-wrap: wrap;
}

.replay-meta-line {
  display: flex;
  gap: 18px;
  flex-wrap: wrap;
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: rgba(99, 102, 241, 0.06);
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 14px;
}

.replay-meta-line strong {
  color: var(--text-primary);
}

.replay-empty {
  padding: 24px;
  border: 1px dashed var(--border-color);
  border-radius: 14px;
  text-align: center;
}

.replay-events-list {
  display: grid;
  gap: 12px;
}

.replay-event-card {
  border: 1px solid var(--border-color);
  border-radius: 18px;
  background:
    linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(14, 165, 233, 0.04)), var(--glass);
  padding: 16px;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    background 0.2s ease;
}

.replay-event-card:hover {
  transform: translateY(-1px);
  border-color: rgba(99, 102, 241, 0.4);
}

.replay-event-main {
  display: flex;
  gap: 14px;
  align-items: flex-start;
}

.replay-event-icon {
  color: var(--accent-primary);
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  background: rgba(99, 102, 241, 0.14);
  border: 1px solid rgba(99, 102, 241, 0.22);
  font-size: 20px;
}

.replay-event-content {
  flex: 1;
  min-width: 0;
}

.replay-event-title-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
}

.replay-event-title-row h3 {
  margin: 0;
  font-size: 15px;
  color: var(--text-primary);
  word-break: break-word;
}

.replay-event-title-row p {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--text-secondary);
}

.replay-event-meta-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(110px, 1fr));
  gap: 10px;
  margin-top: 14px;
}

.replay-event-meta-grid > div {
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.035);
}

.replay-event-meta-grid span {
  display: block;
  font-size: 11px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 4px;
}

.replay-event-meta-grid strong {
  color: var(--text-primary);
  font-size: 13px;
}

.replay-event-data {
  margin-top: 14px;
}

.replay-data-title {
  font-size: 12px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 6px;
}

.replay-event-data pre,
.replay-raw pre {
  margin: 0;
  padding: 12px;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.06);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  font-size: 12px;
  line-height: 1.5;
  overflow: auto;
  max-height: 320px;
  white-space: pre-wrap;
  word-break: break-word;
}

.replay-raw {
  margin-top: 12px;
}

.replay-raw summary {
  cursor: pointer;
  color: var(--text-secondary);
  font-size: 13px;
  user-select: none;
}

.replay-raw summary:hover {
  color: var(--text-primary);
}

@media (max-width: 900px) {
  .replay-toolbar {
    grid-template-columns: 1fr 1fr;
  }

  .replay-actions {
    grid-column: 1 / -1;
    justify-content: flex-start;
  }

  .replay-event-meta-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .replay-header {
    flex-direction: column;
  }

  .replay-toolbar {
    grid-template-columns: 1fr;
  }

  .replay-event-main {
    flex-direction: column;
  }

  .replay-event-meta-grid {
    grid-template-columns: 1fr;
  }
}

.main-column,
.side-column {
  min-width: 0;
}

.side-column {
  align-self: start;
}

.event-subscription-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.event-subscription-toolbar {
  display: flex;
  gap: 10px;
  align-items: center;
}

.event-subscription-toolbar .form-input {
  flex: 1;
  min-width: 0;
}

.event-subscription-counter {
  flex: 0 0 auto;
  padding: 9px 10px;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  color: var(--text-secondary);
  font-size: 12px;
  background: var(--glass);
}

.scrollable-events-list {
  height: 460px;
  min-height: 460px;
  max-height: 460px;
  overflow-y: auto;
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.035);
}

.event-subscription-item {
  align-items: flex-start;
  padding: 9px 10px;
  border-radius: 10px;
  transition: background 0.15s ease;
}

.event-subscription-item:hover {
  background: rgba(99, 102, 241, 0.08);
}

.event-subscription-item span {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.event-subscription-item strong {
  font-size: 13px;
  color: var(--text-primary);
}

.event-type {
  color: var(--text-secondary);
  word-break: break-all;
}

.event-search-empty {
  padding: 16px;
  text-align: center;
}

.replay-card-embedded {
  margin-top: 0;
}

.replay-events-list {
  max-height: 660px;
  overflow-y: auto;
  padding-right: 4px;
}

.replay-events-list::-webkit-scrollbar,
.scrollable-events-list::-webkit-scrollbar {
  width: 8px;
}

.replay-events-list::-webkit-scrollbar-thumb,
.scrollable-events-list::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.45);
  border-radius: 999px;
}

.replay-events-list::-webkit-scrollbar-track,
.scrollable-events-list::-webkit-scrollbar-track {
  background: transparent;
}
</style>

<style scoped>
/* OAuth Redirect URI manager: all colors are inherited from the active theme. */
.redirect-uri-section { margin-top: 1.25rem; }
.redirect-section-heading { display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 1rem; }
.redirect-section-heading > div { flex: 1; min-width: 220px; }
.redirect-count { font-size: 0.8125rem; color: var(--text-secondary); margin: 0 0 0.75rem; }
.redirect-uri-list { list-style: none; padding: 0; margin: 0; display: grid; gap: 0.75rem; }
.redirect-uri-item { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.875rem; padding: 0.875rem 1rem; border: 1px solid var(--border-color); border-radius: var(--border-radius); background: var(--bg-secondary); }
.redirect-uri-main { display: flex; flex-direction: column; gap: 0.375rem; flex: 1; min-width: 180px; }
.redirect-uri-main code { color: var(--text-primary); overflow-wrap: anywhere; font-size: 0.875rem; }
.redirect-uri-main small { color: var(--text-secondary); }
.redirect-uri-actions { display: flex; align-items: center; flex-wrap: wrap; gap: 0.5rem; }
.redirect-delete-label { color: var(--text-secondary); font-size: 0.8125rem; }
.redirect-empty { display: flex; gap: 0.75rem; align-items: flex-start; color: var(--text-secondary); padding: 1rem; border: 1px dashed var(--border-color); border-radius: var(--border-radius); font-size: 0.875rem; }
.redirect-empty .app-icon { flex-shrink: 0; }
</style>

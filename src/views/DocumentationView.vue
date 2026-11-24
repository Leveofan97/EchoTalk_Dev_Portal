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
        Руководства
      </button>

      <button
        type="button"
        role="tab"
        class="docs-view-switcher__button"
        :class="{ 'docs-view-switcher__button--active': activeView === 'api' }"
        :aria-selected="activeView === 'api'"
        @click="setActiveView('api')"
      >
        Справочник API
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
        <nav class="docs-mobile-nav" aria-label="Быстрый переход к разделу">
          <a
            v-for="item in navigation.flatMap((group) => group.items)"
            :key="item.id"
            :href="`#${item.id}`"
          >
            {{ item.label }}
          </a>
        </nav>

        <header class="docs-hero">
          <div class="docs-badge">EchoTalk · Bot Platform</div>
          <h1>Документация для разработчиков ботов</h1>
          <p>
            От регистрации приложения и OAuth-установки до первого сообщения, событий и команд. Для
            точных схем Bot Resource API и Gateway откройте справочник API.
          </p>

          <div class="docs-hero-actions">
            <RouterLink :to="{ name: 'bots' }" class="docs-primary-action">
              <AppIcon name="plus" :size="18" /> Мои боты
            </RouterLink>
            <a href="#quickstart" class="docs-secondary-action">Быстрый старт</a>
            <button type="button" class="docs-secondary-action" @click="setActiveView('api')">
              Справочник API
            </button>
          </div>

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

        <section id="quickstart" class="doc-section">
          <h2>Быстрый старт: от регистрации до первого сообщения</h2>
          <p>
            Ниже — порядок действий для разработчика бота. Для HTTP-примеров используется тестовая
            установка: <code>bot_app_id=4</code>, <code>server_id=1</code>, <code>room_id=3</code>.
            Это иллюстративные значения, у вашего бота ID будут другими.
          </p>
          <ol class="docs-steps">
            <li>
              <strong>Создайте бота.</strong>
              В <RouterLink :to="{ name: 'bots' }">«Мои боты»</RouterLink> укажите имя (3–100
              символов), описание (до 500 символов) и минимальные разрешения: <code>bot</code>,
              <code>room.view</code>, <code>room.sendMessage</code>.
            </li>
            <li>
              <strong>Настройте свою серверную программу.</strong>
              Реализуйте два HTTP-адреса: <code>/oauth/start</code> и <code>/oauth/callback</code>.
              Укажите их как OAuth Start URL и Redirect URI в разделе «Авторизация» бота, создайте
              Client ID и Client Secret.
            </li>
            <li>
              <strong>Подготовьте установку.</strong>
              Опубликуйте бота (статус <code>active</code>) и включите публичность, чтобы его
              карточка появилась в каталоге. Для разработки используйте отдельного тестового бота и
              тестовый сервер. После локального теста снимите публичность и уберите loopback-адреса
              из OAuth-настроек.
            </li>
            <li>
              <strong>Попросите пользователя добавить бота.</strong>
              На публичной карточке он нажимает «Добавить на сервер», выбирает сервер и подтверждает
              разрешения. Сайт проводит его через OAuth Start URL и Callback.
            </li>
            <li>
              <strong>Получите токены на сервере бота.</strong>
              Обработчик Callback проверяет <code>state</code> и отправляет
              <code>POST /oauth/token</code> в API EchoTalk. В ответ получает
              <code>access_token</code> и <code>refresh_token</code>.
            </li>
            <li>
              <strong>Узнайте ID сервера и комнаты.</strong>
              С access token вызовите <code>GET /bot/me</code> и возьмите оттуда
              <code>server_id</code> и <code>installation_id</code>. Затем вызовите
              <code>GET /bot/servers/{serverID}/rooms</code> и выберите <code>id</code>
              доступной текстовой комнаты.
            </li>
            <li>
              <strong>Отправьте первое сообщение.</strong>
              Выполните <code>POST /bot/rooms/{roomID}/messages</code> с выбранным
              <code>room_id</code> в пути и <code>content</code> в JSON-теле. Пошаговые ответы API
              показаны в разделе «Первое сообщение».
            </li>
          </ol>
          <div class="callout callout--info">
            <strong>Кто получает токены?</strong>
            <span>
              Только серверная программа бота. Dev Portal получает согласие пользователя, но Client
              Secret и новые access/refresh token в браузер и Dev Portal не передаются. Для
              локальной проверки не нужны исходники EchoTalk: реализуйте два обработчика HTTP на
              своём сервере по <a href="#oauth-install">контрактам выше</a> и выполните
              <a href="#oauth-local-test">проверку шаг за шагом</a>.
            </span>
          </div>
        </section>

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

        <section id="installation-model" class="doc-section">
          <h2>Установка, сервер и токены: что с чем связано</h2>
          <p>
            <strong>Установка (installation)</strong> — запись о том, что определённый бот получил
            доступ к определённому серверу EchoTalk. Один бот может иметь установки на разных
            серверах. У каждой установки собственные <code>installation_id</code>, разрешения,
            настройки событий и токены.
          </p>
          <div class="docs-oauth-contract">
            <div>
              <strong><code>bot_app_id</code></strong
              ><span
                >ID приложения, которое создал разработчик в Dev Portal. Для нескольких установок
                одного бота он одинаковый.</span
              >
            </div>
            <div>
              <strong><code>server_id</code></strong
              ><span>ID сервера EchoTalk, на который бот был добавлен пользователем.</span>
            </div>
            <div>
              <strong><code>installation_id</code></strong
              ><span
                >ID конкретной установки «бот + сервер». Нужен в Dev Portal для настроек транспорта,
                подписок и диагностики.</span
              >
            </div>
            <div>
              <strong><code>room_id</code></strong
              ><span
                >ID комнаты внутри сервера. Получается из
                <code>GET /bot/servers/{serverID}/rooms</code>.</span
              >
            </div>
          </div>
          <p>
            <code>POST /oauth/token</code> возвращает токены, но
            <strong>не возвращает ID установки или сервера</strong>. После обмена кода сервер бота
            вызывает <code>GET /bot/me</code> с полученным access token. Ответ содержит
            <code>bot_app_id</code>, <code>installation_id</code> и <code>server_id</code>.
            Сохраняйте эту связь вместе с токенами в серверном хранилище.
          </p>
          <div class="callout callout--info">
            <strong>Нужно ли запрашивать список серверов?</strong>
            <span>
              Нет. Bot Access Token относится к одной установке на одном сервере.
              <code>/bot/me</code> уже сообщает её <code>server_id</code>. Для доступа к другому
              серверу требуется отдельная установка и её токен.
            </span>
          </div>
          <h3>Разные API и разные способы входа</h3>
          <div class="table-wrap">
            <table class="docs-table">
              <thead>
                <tr>
                  <th>Маршруты</th>
                  <th>Кто выполняет запросы</th>
                  <th>Авторизация</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>/dev/*</code></td>
                  <td>Сайт Dev Portal от имени владельца бота (настройки, установки, команды)</td>
                  <td>Пользовательская сессия EchoTalk; не Bot Token</td>
                </tr>
                <tr>
                  <td><code>/oauth/authorize</code></td>
                  <td>Сайт Dev Portal после подтверждения пользователем</td>
                  <td>Пользовательская сессия; сервер бота её не запрашивает</td>
                </tr>
                <tr>
                  <td><code>/oauth/token</code>, <code>/oauth/token/refresh</code></td>
                  <td>Только сервер бота</td>
                  <td>Authorization Code или Refresh Token вместе с Client ID и Client Secret</td>
                </tr>
                <tr>
                  <td><code>/bot/*</code></td>
                  <td>Сервер бота, выполняющий рабочие операции</td>
                  <td><code>Authorization: Bearer &lt;BOT_ACCESS_TOKEN&gt;</code></td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Права доступа проверяются на backend EchoTalk для каждой установки. Знание
            <code>server_id</code> или <code>room_id</code> не даёт доступа без соответствующих
            разрешений. Разделение API не означает, что можно использовать пользовательский JWT
            вместо токена бота.
          </p>
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

        <section id="oauth-install" class="doc-section">
          <h2>Установка бота через OAuth: адреса и запросы</h2>
          <p>
            Чтобы пользователь мог установить вашего бота из каталога EchoTalk, нужно создать
            <strong>два HTTP-обработчика на сервере бота</strong> и указать их адреса в Dev Portal.
            Во <strong>всех примерах этого раздела</strong> используется один сценарий: ID бота —
            <code>4</code>, сервер бота — <code>https://mybot.ru</code>, а сайт Dev Portal для
            наглядности обозначен как <code>https://portal.example</code>. Это условные адреса:
            вместо них используйте домен своего бота и
            <strong>фактический адрес Dev Portal</strong>, открытый в браузере. Локальная проверка
            вынесена в <a href="#oauth-local-test">отдельный раздел</a>.
          </p>

          <h3>Схема установки</h3>
          <ol class="docs-oauth-journey" aria-label="Последовательность OAuth-установки">
            <li>
              <strong>Dev Portal в браузере пользователя</strong>
              <span>После нажатия «Добавить на сервер» открывает OAuth Start URL.</span>
            </li>
            <li>
              <strong>Сервер вашего бота</strong>
              <span
                >Принимает <code>GET /oauth/start</code>, создаёт <code>state</code> и
                перенаправляет браузер обратно в Dev Portal.</span
              >
            </li>
            <li>
              <strong>Dev Portal и API EchoTalk</strong>
              <span
                >Пользователь подтверждает разрешения; запрос
                <code>POST /oauth/authorize</code> выдаёт одноразовый код.</span
              >
            </li>
            <li>
              <strong>Сервер вашего бота</strong>
              <span
                >Браузер открывает <code>GET /oauth/callback</code> с кодом; сервер проверяет
                <code>state</code>.</span
              >
            </li>
            <li>
              <strong>API EchoTalk</strong>
              <span
                >Получает серверный <code>POST /oauth/token</code> и выдаёт токены установки.</span
              >
            </li>
          </ol>

          <h3>1. Какие адреса указать в Dev Portal</h3>
          <p>
            Откройте «Мои боты» → ваш бот → «Авторизация». Адреса ниже должны соответствовать
            маршрутам, которые обрабатывает <strong>ваша программа бота</strong>, а не маршрутам Go
            API EchoTalk.
          </p>
          <div class="docs-oauth-addresses">
            <div>
              <h3>OAuth Start URL</h3>
              <code>https://mybot.ru/oauth/start</code>
              <p>
                Начало установки. Dev Portal открывает этот адрес
                <strong>в браузере пользователя</strong>. Ваш сервер принимает
                <code>GET /oauth/start</code>, создаёт <code>state</code>
                и возвращает HTTP-ответ с перенаправлением в Dev Portal.
              </p>
            </div>
            <div>
              <h3>Redirect URI (Callback)</h3>
              <code>https://mybot.ru/oauth/callback</code>
              <p>
                Завершение установки. После подтверждения разрешений браузер выполнит
                <strong>GET-запрос</strong> на этот адрес с параметрами <code>code</code> и
                <code>state</code>. Ваш сервер проверит <code>state</code> и обменяет код на токены.
              </p>
            </div>
          </div>
          <p>
            В этом сценарии укажите именно эти два HTTPS-адреса в настройках бота.
            <strong>Redirect URI должен точно совпадать</strong> со значением
            <code>redirect_uri</code> в запросах <code>/oauth/authorize</code> и
            <code>/oauth/token</code>. Для своего компьютера используйте отдельные
            <a href="#oauth-local-test">настройки локального теста</a> — не смешивайте локальные
            адреса с рабочими в одной цепочке запросов.
          </p>

          <h3>2. Какой запрос принимает OAuth Start URL</h3>
          <p>
            После нажатия «Добавить на сервер» сайт Dev Portal меняет адрес текущей вкладки на
            <code>https://mybot.ru/oauth/start</code>. Браузер выполняет
            <strong>HTTP GET-запрос без тела и без обязательных URL-параметров</strong>. В текущем
            OAuth Flow EchoTalk не передаёт в этот запрос ни Client ID, ни ID сервера, ни
            <code>state</code>. Сервер бота знает ID приложения, адрес Dev Portal и свой Redirect
            URI из конфигурации.
          </p>
          <CodeBlock
            title="Браузер → сервер бота · GET /oauth/start"
            :code="oauthStartRequestExample"
            @copy="copyCode(oauthStartRequestExample)"
          />
          <p>
            Обработчик должен создать новый <code>state</code>, сохранить его для этого браузера
            (например, в HttpOnly cookie), а затем ответить перенаправлением
            <code>303 See Other</code>. В заголовке <code>Location</code> укажите страницу
            <code>https://portal.example/explore/4</code> (замените домен на реальный адрес Dev
            Portal) с двумя параметрами: <code>state</code> и <code>redirect_uri</code>.
          </p>
          <CodeBlock
            title="Ответ сервера бота · HTTP 303 и заголовки"
            :code="oauthStartResponseExample"
            @copy="copyCode(oauthStartResponseExample)"
          />
          <p>
            Получив этот ответ, браузер сам открывает новый адрес из <code>Location</code>. Параметр
            <code>redirect_uri</code> должен содержать зарегистрированный Callback URL,
            закодированный для передачи в строке запроса. Ответ <code>303</code> — это не запрос
            сервера бота к EchoTalk: перенаправление выполняет браузер пользователя.
          </p>

          <h3>Что такое state и как его создать</h3>
          <p>
            <code>state</code> — случайная строка для проверки одной попытки установки. Её создаёт
            <strong>ваш сервер бота</strong> при каждом вызове <code>/oauth/start</code>. Она
            защищает от подмены процесса авторизации: при возвращении пользователя на Callback
            сервер должен получить тот же <code>state</code>, который сохранил в начале.
          </p>
          <div class="docs-oauth-contract">
            <div>
              <strong>Формат, принимаемый EchoTalk API</strong
              ><span
                >Длина от 16 до 256 символов; только латинские буквы, цифры и символы
                <code>.</code>, <code>_</code>, <code>~</code>, <code>-</code>.</span
              >
            </div>
            <div>
              <strong>Рекомендуемая генерация</strong
              ><span
                >32 случайных байта из криптографически стойкого генератора, кодированные в
                Base64URL без <code>=</code> (43 символа).</span
              >
            </div>
            <div>
              <strong>Хранение и срок действия</strong
              ><span
                >Привяжите значение к браузерной сессии; например, HttpOnly cookie на 10 минут с
                <code>SameSite=Lax</code>. Для публичного HTTPS обязательно
                <code>Secure</code>.</span
              >
            </div>
            <div>
              <strong>Проверка</strong
              ><span
                >Сравните <code>state</code> из URL Callback с сохранённым значением, отклоните
                отсутствующий, истёкший или несовпадающий маркер и удалите его после проверки.</span
              >
            </div>
          </div>
          <CodeBlock
            title="Go · создание state (пример)"
            :code="oauthStateGoExample"
            @copy="copyCode(oauthStateGoExample)"
          />
          <p>
            Вы можете реализовать <code>/oauth/start</code> и <code>/oauth/callback</code> на любом
            серверном языке. Форматы запросов и ответов приведены выше; доступ к исходникам EchoTalk
            не требуется. Для production храните состояние авторизации в серверной сессии или
            используйте защищённую привязку к браузеру; не используйте один статический
            <code>state</code> для всех установок.
          </p>

          <h3>Контракт обмена: что реализовывать вам, а что делает Dev Portal</h3>
          <p>
            Ваш код реализует только <code>/oauth/start</code>, <code>/oauth/callback</code> и
            серверный обмен по <code>/oauth/token</code>. Запрос
            <code>/oauth/authorize</code> выполняет сам Dev Portal после нажатия «Авторизовать»:
            отдельный пользовательский токен разработчику бота не нужен.
          </p>
          <div class="table-wrap">
            <table class="docs-table">
              <thead>
                <tr>
                  <th>Метод и адрес</th>
                  <th>Обязательные поля</th>
                  <th>Ответ</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>POST /oauth/authorize</code></td>
                  <td>
                    <code>bot_id</code>, <code>server_id</code>, <code>scopes</code>,
                    <code>state</code>; <code>redirect_uri</code> — для выбора зарегистрированного
                    callback
                  </td>
                  <td>
                    <code>200</code>: JSON с <code>code</code>, <code>state</code>,
                    <code>client_id</code>, <code>redirect_uri</code>, <code>redirect_to</code>
                  </td>
                </tr>
                <tr>
                  <td><code>POST /oauth/token</code></td>
                  <td>
                    <code>grant_type=authorization_code</code>, <code>code</code>,
                    <code>client_id</code>, <code>client_secret</code>, <code>redirect_uri</code>
                  </td>
                  <td>
                    <code>200</code>: <code>access_token</code>, <code>refresh_token</code>,
                    <code>token_type</code>, <code>expires_in</code>, <code>scope</code>
                  </td>
                </tr>
                <tr>
                  <td><code>POST /oauth/token/refresh</code></td>
                  <td>
                    <code>grant_type=refresh_token</code>, <code>refresh_token</code>,
                    <code>client_id</code>, <code>client_secret</code>
                  </td>
                  <td><code>200</code>: новая пара токенов в таком же формате</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>3. Как Dev Portal получает код авторизации</h3>
          <p>
            После перехода из <code>/oauth/start</code> на страницу
            <code>/explore/4</code> пользователь выбирает сервер и разрешения. При нажатии
            «Авторизовать» Dev Portal отправляет <strong>POST-запрос с JSON</strong> на API EchoTalk
            <code>/oauth/authorize</code> от имени вошедшего пользователя. В запросе есть ID бота и
            сервера, выбранные разрешения, а также <code>state</code> и <code>redirect_uri</code> из
            адреса страницы. Client Secret здесь <strong>не передаётся</strong>. В примере ниже
            опущены заголовки пользовательской сессии, которыми управляет сайт Dev Portal, а не
            сервер бота.
          </p>
          <CodeBlock
            title="Dev Portal → EchoTalk API · POST /oauth/authorize (JSON)"
            :code="authorizeExample"
            @copy="copyCode(authorizeExample)"
          />
          <p>
            EchoTalk проверяет права пользователя, разрешения и регистрацию Callback URL. При успехе
            API возвращает <strong>HTTP 200 с JSON</strong>, а не перенаправляет браузер. Поле
            <code>redirect_to</code> содержит готовый Callback URL с кодом и исходным
            <code>state</code>.
          </p>
          <CodeBlock
            title="EchoTalk API → Dev Portal · пример ответа"
            :code="authorizeResponseExample"
            @copy="copyCode(authorizeResponseExample)"
          />

          <h3>4. Какой запрос принимает Redirect URI (Callback)</h3>
          <p>
            Получив ответ с <code>redirect_to</code>, сайт Dev Portal открывает этот адрес в
            браузере пользователя. Браузер выполняет <strong>GET-запрос</strong> на
            <code>/oauth/callback</code> вашего сервера. В строке запроса обязательно присутствуют
            два параметра:
          </p>
          <div class="docs-oauth-contract">
            <div>
              <strong><code>code</code></strong
              ><span
                >Одноразовый код авторизации от API EchoTalk. Действителен 10 минут. Сам по себе ещё
                не является токеном бота.</span
              >
            </div>
            <div>
              <strong><code>state</code></strong
              ><span
                >Точно то же значение, которое сервер бота создал на шаге 2 и сохранил для этой
                попытки установки.</span
              >
            </div>
          </div>
          <CodeBlock
            title="Браузер → сервер бота · GET /oauth/callback"
            :code="oauthCallbackRequestExample"
            @copy="copyCode(oauthCallbackRequestExample)"
          />
          <p>
            Обработчик Callback читает <code>code</code> и <code>state</code> из параметров URL,
            сравнивает <code>state</code> с сохранённым значением и очищает его после успешной
            проверки. При ошибке проверку нужно прервать:
            <strong>не обменивайте код на токены</strong>. Для безопасности этот URL не следует
            записывать целиком в access-логи: он содержит временный код авторизации. На callback
            отдавайте <code>Cache-Control: no-store</code> и
            <code>Referrer-Policy: no-referrer</code>, не загружайте сторонние скрипты до удаления
            кода из адресной строки.
          </p>

          <h3>5. Как сервер бота получает токены</h3>
          <p>
            После успешной проверки <code>state</code> <strong>сам сервер бота</strong> отправляет
            POST-запрос с JSON на <code>https://jiechotalk.ru:8443/oauth/token</code>. Этот запрос
            не выполняется из браузера. В нём указываются <code>code</code>, Client ID, Client
            Secret и зарегистрированный Redirect URI. После успешного обмена кода EchoTalk создаёт
            или активирует установку бота.
          </p>
          <CodeBlock
            title="Сервер бота → EchoTalk API: POST /oauth/token"
            :code="tokenRequestExample"
            @copy="copyCode(tokenRequestExample)"
          />
          <p>
            API возвращает <strong>HTTP 200</strong> с новой парой <code>access_token</code> и
            <code>refresh_token</code>, типом токена, сроком действия и выданными разрешениями.
          </p>
          <CodeBlock
            title="EchoTalk API → сервер бота · пример ответа"
            :code="tokenResponseExample"
            @copy="copyCode(tokenResponseExample)"
          />
          <p>
            Сохраняйте токены только на сервере бота в защищённом хранилище. С помощью access token
            можно проверить установку запросом
            <code>GET /bot/me</code> и показать пользователю страницу успеха.
          </p>
          <div class="callout callout--warning">
            <strong>Где хранятся секреты?</strong>
            <span>
              Не передавайте Client Secret, access token и refresh token в Dev Portal, JavaScript
              браузера, URL или логи. При OAuth-установке в браузере передаются только временный
              <code>code</code> и <code>state</code>. Redirect URI при обмене кода должен точно
              совпадать с зарегистрированным адресом.
            </span>
          </div>

          <h3>Как обновлять токены</h3>
          <p>
            Access token действует 15 минут. Для продления доступа сервер бота использует refresh
            token (срок действия — 30 дней) и отправляет запрос
            <code>POST /oauth/token/refresh</code>. В ответ приходит новая пара токенов. Сохраните
            новый refresh token вместо старого: предыдущий после ротации использовать нельзя. При
            отзыве установки оба токена теряют доступ.
          </p>
          <CodeBlock
            title="Сервер бота → EchoTalk API: POST /oauth/token/refresh"
            :code="refreshTokenExample"
            @copy="copyCode(refreshTokenExample)"
          />
          <h3>Ошибки авторизации и повторная установка</h3>
          <p>
            OAuth сейчас возвращает ошибки в JSON с полем <code>error</code>, например
            <code>{"error":"redirect_uri mismatch"}</code>. Это <strong>не</strong> формат
            <code>code/message/details</code> из Voice/Media API.
          </p>
          <div class="table-wrap">
            <table class="docs-table">
              <thead>
                <tr>
                  <th>HTTP</th>
                  <th>Когда возвращается</th>
                  <th>Что сделать</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>400</code></td>
                  <td>
                    Неверные поля, <code>state</code>, несовпадение <code>redirect_uri</code>,
                    истёкший или уже использованный код
                  </td>
                  <td>Проверить параметры и при необходимости начать новую попытку авторизации</td>
                </tr>
                <tr>
                  <td><code>401</code></td>
                  <td>Неверный Client ID/Secret или недействительный Refresh Token</td>
                  <td>Проверить серверные credentials; не публиковать их для диагностики</td>
                </tr>
                <tr>
                  <td><code>403</code></td>
                  <td>
                    Приложение не активно или у пользователя недостаточно прав для выдачи разрешений
                  </td>
                  <td>Проверить статус и права без попыток обойти ограничения</td>
                </tr>
                <tr>
                  <td><code>404</code></td>
                  <td>Приложение не найдено</td>
                  <td>Проверить ID бота</td>
                </tr>
                <tr>
                  <td><code>409</code></td>
                  <td>Бот уже активно установлен на выбранном сервере</td>
                  <td>Не пытаться повторить установку поверх действующей</td>
                </tr>
                <tr>
                  <td><code>500</code></td>
                  <td>Внутренняя ошибка или недоступность зависимостей</td>
                  <td>Повторить позже; не выводить секреты в логи</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Для текущего API повторная OAuth-авторизация
            <strong>активной установки</strong> возвращает <code>409</code>, даже если refresh token
            у бота уже истёк. Если обновление токена невозможно, требуется контролируемое
            восстановление доступа через администратора сервера и повторная установка после отзыва
            прежней. Автоматический сценарий обновления разрешений/переустановки без отзыва пока не
            предусмотрен.
          </p>
        </section>

        <section id="oauth-local-test" class="doc-section">
          <h2>Проверка OAuth локально: готовый Go-пример</h2>
          <p>
            Чтобы проверить весь процесс без написания собственного OAuth-сервера с нуля, скачайте
            <strong>отдельный демонстрационный Go-файл</strong>. Он доступен всем разработчикам
            прямо на сайте Dev Portal и не требует доступа к приватным исходникам EchoTalk. Для
            запуска нужны установленный Go, PowerShell и тестовый бот со своими Client ID и Client
            Secret.
          </p>
          <p>
            <a
              class="docs-secondary-action"
              href="/example/oauth/main.go"
              download="echotalk-oauth-demo.go"
            >
              <AppIcon name="download" :size="17" /> Скачать Go-пример
            </a>
          </p>
          <ol class="docs-steps">
            <li>
              <strong>Настройте тестового бота в Dev Portal.</strong>
              Статус <code>active</code>, публичность включена. В разделе «Авторизация» задайте
              <strong>OAuth Start URL</strong> <code>http://127.0.0.1:3001/oauth/start</code>, а в
              списке <strong>Redirect URI</strong> зарегистрируйте
              <code>http://127.0.0.1:3001/oauth/callback</code>. Создайте Client ID и Client Secret.
              Устанавливайте бота только на сервер, которым управляете.
            </li>
            <li>
              <strong>Откройте PowerShell на своём компьютере.</strong>
              Скопируйте команды ниже целиком. Укажите публичный HTTPS-адрес Dev Portal из браузера
              (без пути, например <code>https://portal.example</code>), ID своего тестового бота и
              его OAuth-credentials. Команды скачивают пример с этого сайта в текущую папку и
              запускают его на <code>127.0.0.1:3001</code>.
              <strong>Перед запуском можно открыть Go-файл и проверить его код.</strong>
            </li>
          </ol>
          <CodeBlock
            title="PowerShell · скачать и запустить Go OAuth-пример"
            :code="oauthDemoPowerShellExample"
            @copy="copyCode(oauthDemoPowerShellExample)"
          />
          <ol class="docs-steps" start="3">
            <li>
              <strong>Откройте публичную карточку своего бота.</strong>
              В Dev Portal нажмите «Добавить на сервер», выберите сервер и подтвердите разрешения.
              Браузер сначала откроет локальный <code>/oauth/start</code>, затем страницу установки,
              затем вернётся на локальный <code>/oauth/callback</code>. Dev Portal работает на своём
              публичном адресе — запускать сайт EchoTalk на localhost не нужно.
            </li>
            <li>
              <strong>Проверьте результат.</strong>
              Если обмен кода и запрос <code>GET /bot/me</code> успешны, в браузере откроется
              <code>http://127.0.0.1:3001/oauth/success</code> с текстом
              <code>OAuth callback and /bot/me succeeded</code>. В Dev Portal во вкладке «Установки»
              появится активная установка. При повторном открытии старого callback обработчик должен
              отклонить запрос: <code>state</code> уже использован.
            </li>
          </ol>
          <div class="callout callout--warning">
            <strong>Только для локальной проверки.</strong>
            <span>
              Пример не сохраняет и не печатает токены, не запускает Gateway и не отправляет
              сообщения. Client Secret вводится в PowerShell через скрытый ввод и доступен только в
              переменных среды локального процесса и запущенного Go-примера, но не в браузере или
              публичном Go-файле. Программа работает только на <code>127.0.0.1:3001</code>,
              использует проверку <code>state</code> и защищённый HTTPS-запрос к EchoTalk API. Не
              используйте этот тестовый сервер как production-реализацию.
            </span>
          </div>
          <p>
            Если порт <code>3001</code> занят, остановите конфликтующий процесс либо согласованно
            измените адрес прослушивания в Go-файле, OAuth Start URL, Redirect URI и
            <code>ECHOTALK_REDIRECT_URI</code>. Для установки бота другими пользователями нужен
            <strong>публичный HTTPS</strong> на стороне бота. Для боевого бота используйте
            собственный HTTPS-сервер, безопасное хранение и обновление токенов, серверные сессии и
            отдельную обработку ошибок. Сейчас отдельного режима установки приватного бота через
            публичную карточку нет. После теста удалите локальные OAuth-адреса и отключите
            публичность QA-бота. Остановите Go-сервер через <code>Ctrl+C</code>, затем удалите
            секреты из PowerShell:
            <code>Remove-Item Env:ECHOTALK_CLIENT_SECRET -ErrorAction SilentlyContinue</code>.
          </p>
        </section>

        <section id="first-request" class="doc-section">
          <h2>Первое сообщение: от токена до комнаты</h2>
          <p>
            После <code>POST /oauth/token</code> у бота есть access token, но ещё неизвестны ID
            установки и доступных комнат. Ниже — три последовательных запроса
            <strong>от сервера бота</strong>. Примеры <code>curl</code> используют синтаксис Bash;
            для PowerShell подойдут <code>Invoke-RestMethod</code> с теми же методами, адресами и
            заголовками.
          </p>
          <p>
            В окружении серверного процесса задайте <code>ECHOTALK_API_URL</code> и
            <code>BOT_ACCESS_TOKEN</code>. Не вставляйте секреты в URL, client-side JavaScript или
            документацию. Здесь в ответах показаны условные ID.
          </p>
          <h3>1. Определите установку и сервер: GET /bot/me</h3>
          <CodeBlock title="curl · /bot/me" :code="botMeExample" @copy="copyCode(botMeExample)" />
          <CodeBlock
            title="HTTP 200 · пример JSON"
            :code="botMeResponseExample"
            @copy="copyCode(botMeResponseExample)"
          />
          <p>
            Используйте <code>server_id</code> из ответа (в примере — <code>1</code>).
            <code>installation_id</code> нужен для сопоставления токенов с установкой, а не в URL
            сообщения. Это ID только этой установки: токен не даёт доступа сразу ко всем серверам,
            где существует бот.
          </p>
          <h3>2. Получите доступные комнаты: GET /bot/servers/{serverID}/rooms</h3>
          <CodeBlock
            title="curl · список комнат сервера"
            :code="botRoomsExample"
            @copy="copyCode(botRoomsExample)"
          />
          <CodeBlock
            title="HTTP 200 · пример JSON"
            :code="botRoomsResponseExample"
            @copy="copyCode(botRoomsResponseExample)"
          />
          <p>
            Возьмите <code>id</code> нужной текстовой комнаты из массива <code>data</code> (в
            примере — <code>3</code>). Это <code>room_id</code>. Не заменяйте его
            <code>category_id</code> или ID сервера.
          </p>
          <h3>3. Отправьте сообщение: POST /bot/rooms/{roomID}/messages</h3>
          <CodeBlock
            title="curl · отправка сообщения"
            :code="firstMessageExample"
            @copy="copyCode(firstMessageExample)"
          />
          <CodeBlock
            title="Успешный ответ · пример JSON"
            :code="firstMessageResponseExample"
            @copy="copyCode(firstMessageResponseExample)"
          />
          <div class="callout callout--info">
            <strong>Разрешения и ошибки.</strong>
            <span>
              Для чтения списка комнат нужен <code>room.view</code>, для отправки —
              <code>room.sendMessage</code>. При недостаточных разрешениях или запрете на уровне
              комнаты backend отклонит запрос: менять ID комнаты в попытке обойти проверку нельзя.
              При <code>401</code> обновите access token по действующему refresh token, при
              <code>429</code> соблюдайте <code>Retry-After</code> или <code>retry_after_sec</code>,
              если они предоставлены.
            </span>
          </div>
        </section>

        <section id="delivery-setup" class="doc-section">
          <h2>Получение событий: Gateway или Webhook</h2>
          <p>
            Отправка сообщения через REST не запускает обработку событий сама по себе. В Dev Portal
            откройте бота → «Установки», выберите нужный сервер, затем во вкладках «Подключение» и
            «Подписки» настройте транспорт и события (например, <code>message.created</code>).
            Подписки и транспорт настраиваются <strong>отдельно для каждой установки</strong>.
          </p>
          <div class="table-wrap">
            <table class="docs-table">
              <thead>
                <tr>
                  <th>Транспорт</th>
                  <th>Как работает</th>
                  <th>Где настроить</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>WebSocket Gateway</td>
                  <td>
                    Ваша программа устанавливает постоянное WebSocket-соединение с EchoTalk и
                    подтверждает обработанные события через ACK
                  </td>
                  <td>Выберите Gateway в «Подключении» установки</td>
                </tr>
                <tr>
                  <td>Webhook</td>
                  <td>API EchoTalk отправляет HTTPS POST-запрос на ваш публичный обработчик</td>
                  <td>Укажите Webhook URL и секрет подписи в «Подключении» установки</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Настройки транспорта запрашивает Dev Portal под пользовательской сессией:
            <code>GET/PUT /dev/installations/{installationID}/webhook</code>. Бот не должен вызывать
            эти адреса со своим access token.
          </p>
          <h3>Минимальный цикл Gateway</h3>
          <ol class="docs-steps">
            <li>
              <strong>Получите временный токен соединения.</strong> Сервер бота отправляет
              <code>POST /bot/gateway/session</code> с
              <code>Authorization: Bearer &lt;BOT_ACCESS_TOKEN&gt;</code>. В ответ приходит
              <code>session_token</code>; не подменяйте им REST access token.
            </li>
            <li>
              <strong>Подключитесь к WebSocket.</strong> Серверный WebSocket-клиент открывает
              <code>wss://jiechotalk.ru:8443/bot/gateway/ws</code>, передавая
              <code>Authorization: Bearer &lt;GATEWAY_SESSION_TOKEN&gt;</code>
              в HTTP-заголовке соединения. Обычный браузерный WebSocket API такой заголовок вручную
              не устанавливает: используйте серверный клиент.
            </li>
            <li>
              <strong>Получите <code>hello</code>.</strong> EchoTalk сообщает интервал
              <code>heartbeat_sec</code> и состояние соединения. Отправьте <code>resume</code> с
              последним надёжно сохранённым <code>last_ack_seq</code> (для первого запуска —
              <code>0</code>).
            </li>
            <li>
              <strong>Обработайте событие и подтвердите его.</strong> Для пакета
              <code>type=event</code> возьмите <code>data.seq</code>, обработайте полезную нагрузку,
              сохраните результат и только затем отправьте <code>ack</code> с тем же
              <code>seq</code>. Используйте <code>event_id</code> для защиты от повторной обработки.
            </li>
            <li>
              <strong>Поддерживайте соединение.</strong> Отправляйте <code>heartbeat</code> с
              интервалом из <code>hello</code>. После обрыва подключайтесь заново с backoff, новым
              session token и сохранённым номером ACK.
            </li>
          </ol>
          <CodeBlock
            title="Gateway · формы служебных сообщений (пример)"
            :code="gatewayFramesExample"
            @copy="copyCode(gatewayFramesExample)"
          />
          <p>
            Это краткая схема протокола, не готовый production-клиент. Точную структуру событий и
            обработку ошибок <code>invalid_resume</code> смотрите в
            <button
              type="button"
              class="docs-text-button"
              @click="setActiveApiReference('gateway')"
            >
              AsyncAPI Gateway</button
            >. Для восстановления из журнала существует <code>GET /bot/events</code>
            с пагинацией; не рассчитывайте только на состояние в оперативной памяти.
          </p>
          <h3>Webhook: какой запрос приходит на ваш сервер</h3>
          <p>
            Когда выбран Webhook, EchoTalk отправляет JSON в теле HTTPS POST-запроса на указанный
            URL. Подлинность проверяется по заголовкам
            <code>X-EchoTalk-Timestamp</code> и <code>X-EchoTalk-Signature</code>. Подпись — это
            шестнадцатеричный HMAC-SHA256 от строки <code>timestamp + "." + raw_body</code> с
            секретом Webhook конкретной установки.
          </p>
          <CodeBlock
            title="Webhook · вычисление подписи на Node.js"
            :code="webhookSignatureExample"
            @copy="copyCode(webhookSignatureExample)"
          />
          <p>
            Сравнивайте подпись в постоянное время, проверяйте свежесть timestamp, считайте
            <code>event_id</code> идемпотентным ключом и считайте подпись
            <strong>от исходных байтов тела</strong>, до JSON-декодирования. Не публикуйте Webhook
            Secret и не записывайте тела с персональными данными в открытые логи. Историю попыток и
            ошибок смотрите в «Журнале доставки».
          </p>
          <div class="callout callout--warning">
            <strong>Разные токены и ограничения.</strong>
            <span>
              Bot Access Token служит для <code>/bot/*</code>, временный Gateway Session Token —
              только для WebSocket, Webhook Secret — только для проверки входящих POST. По каждой
              установке действуют отдельные лимиты запросов, сообщений, interactions и Gateway; при
              <code>429</code> учитывайте время до повтора.
            </span>
          </div>
        </section>

        <section id="commands-setup" class="doc-section">
          <h2>Slash-команды</h2>
          <p>
            Команды создаются во вкладке «Команды» выбранного приложения. Адрес обработчика
            <code>command_base_url</code> задаётся во вкладке «Подключение» для установки. Для
            production обработчик должен принимать HTTPS POST-запросы и обрабатывать команды на
            своём сервере.
          </p>
          <CodeBlock
            title="POST /dev/bots/{botID}/commands · JSON"
            :code="commandCreateExample"
            @copy="copyCode(commandCreateExample)"
          />
          <p>
            При создании указываются имя, описание и флаг <code>is_enabled</code>. Допустимость
            имени команды проверяет backend: при ошибке используйте полученный ответ API, не
            обходите валидацию на клиенте. Для изменения и удаления команд доступны
            <code>PUT</code> и <code>DELETE</code> на
            <code>/dev/bots/{botID}/commands/{commandID}</code>. Входящие вызовы обработчика
            проверяйте на подлинность; не доверяйте полям запроса без валидации.
          </p>
        </section>

        <section id="troubleshooting" class="doc-section">
          <h2>Если что-то не работает</h2>
          <div class="docs-troubleshooting">
            <div>
              <strong>OAuth Start URL не настроен</strong>
              <p>
                Добавьте адрес начала OAuth во вкладке «Авторизация». При установке из каталога
                сначала должен открыться backend бота, который создаёт state.
              </p>
            </div>
            <div>
              <strong>Ошибка Redirect URI</strong>
              <p>
                Убедитесь, что callback зарегистрирован и в <code>/oauth/authorize</code> и
                <code>/oauth/token</code> передаётся один и тот же точный адрес. Проверьте порт,
                путь и протокол.
              </p>
            </div>
            <div>
              <strong>Неверный или отсутствующий state</strong>
              <p>
                Начните установку с OAuth Start URL. Проверьте, что cookie с state сохранён
                браузером и доступен backend бота на callback; повтор или истечение state должны
                отклоняться.
              </p>
            </div>
            <div>
              <strong>Код истёк или уже использован</strong>
              <p>
                Повторите авторизацию: одноразовый код действует 10 минут. Не отправляйте запрос
                обмена параллельно несколько раз.
              </p>
            </div>
            <div>
              <strong>409: бот уже установлен</strong>
              <p>
                Повторное подтверждение не заменяет действующую установку. Изменения разрешений и
                восстановление доступа после истечения refresh token требуют отдельного управляемого
                процесса.
              </p>
            </div>
            <div>
              <strong>Неясно, где взять server_id / room_id</strong>
              <p>
                Вызовите <code>GET /bot/me</code>, затем
                <code>GET /bot/servers/{serverID}/rooms</code>. ID установки и сервера не
                возвращаются из <code>/oauth/token</code>.
              </p>
            </div>
            <div>
              <strong>401 при refresh</strong>
              <p>
                Старый, отозванный или истёкший refresh token использовать нельзя; не выполняйте
                бесконечные повторы и не запрашивайте Client Secret в браузере.
              </p>
            </div>
            <div>
              <strong>403 Forbidden</strong>
              <p>
                Проверьте scopes приложения, разрешения конкретной установки, доступ к серверу и
                права на комнату.
              </p>
            </div>
            <div>
              <strong>429 Too Many Requests</strong>
              <p>
                Проверьте вкладку «Диагностика» и соблюдайте <code>retry_after_sec</code> или
                заголовок <code>Retry-After</code>, если он возвращён API.
              </p>
            </div>
            <div>
              <strong>Нет событий</strong>
              <p>
                Проверьте транспорт доставки, подписки выбранной установки, права бота и состояние
                соединения Gateway или последние попытки Webhook.
              </p>
            </div>
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

          <p>
            Voice/Media Resource API использует следующий формат ошибок. Ответы OAuth и Dev Portal
            могут иметь другой формат:
          </p>

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

          <p>
            Спецификации доступны прямо в Dev Portal: откройте
            <button type="button" class="docs-text-button" @click="setActiveApiReference('rest')">
              REST API
            </button>
            или
            <button
              type="button"
              class="docs-text-button"
              @click="setActiveApiReference('gateway')"
            >
              Gateway API</button
            >. Исходный код EchoTalk для просмотра спецификаций не нужен.
          </p>
          <p>
            REST-справочник покрывает Bot Resource API, а Gateway-справочник — WebSocket-протокол.
            OAuth, настройки Dev Portal и установка ботов описаны в руководстве выше. OpenAPI
            Resource API не является спецификацией всех административных endpoints.
          </p>
        </section>
      </main>
    </div>

    <div v-else class="api-reference-shell">
      <div class="api-type-switcher" role="tablist" aria-label="API protocol">
        <button
          type="button"
          role="tab"
          class="api-type-switcher__button"
          :class="{
            'api-type-switcher__button--active': activeApiReference === 'rest',
          }"
          :aria-selected="activeApiReference === 'rest'"
          @click="setActiveApiReference('rest')"
        >
          REST API
        </button>

        <button
          type="button"
          role="tab"
          class="api-type-switcher__button"
          :class="{
            'api-type-switcher__button--active': activeApiReference === 'gateway',
          }"
          :aria-selected="activeApiReference === 'gateway'"
          @click="setActiveApiReference('gateway')"
        >
          Gateway WebSocket
        </button>
      </div>

      <header class="api-reference-hero">
        <div v-if="activeApiReference === 'rest'">
          <div class="docs-badge">Canonical OpenAPI</div>

          <h1>EchoTalk Bot REST API</h1>

          <p>
            HTTP Runtime и Resource API для EchoTalk bots. Контракт описан спецификацией OpenAPI.
          </p>
        </div>

        <div v-else>
          <div class="docs-badge">Canonical AsyncAPI</div>

          <h1>EchoTalk Bot Gateway</h1>

          <p>
            WebSocket Gateway для доставки runtime events. Контракт описывает hello, event, resume,
            ACK, heartbeat и protocol errors.
          </p>
        </div>

        <a
          class="api-reference-source"
          :href="activeApiReference === 'rest' ? openApiUrl : asyncApiUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          Открыть YAML
        </a>
      </header>

      <div class="api-reference-frame">
        <Suspense>
          <StoplightReference v-if="activeApiReference === 'rest'" :spec-url="openApiUrl" />
          <AsyncApiReference v-else :spec-url="asyncApiUrl" />
          <template #fallback>
            <div class="docs-reference-loading" role="status">Загрузка справочника API…</div>
          </template>
        </Suspense>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  defineAsyncComponent,
  defineComponent,
  h,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue'
import { useRoute, useRouter, type LocationQueryRaw } from 'vue-router'
import AppIcon from '@/components/ui/AppIcon.vue'

// Загружаем тяжёлые просмотрщики спецификаций только по запросу пользователя.
const StoplightReference = defineAsyncComponent(
  () => import('@/components/docs/StoplightReference'),
)
const AsyncApiReference = defineAsyncComponent(() => import('@/views/AsyncApiReference.vue'))

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
type ApiReferenceView = 'rest' | 'gateway'

const route = useRoute()
const router = useRouter()

const activeView = ref<DocsView>(route.query.view === 'api' ? 'api' : 'guides')

const activeApiReference = ref<ApiReferenceView>(route.query.api === 'gateway' ? 'gateway' : 'rest')

const configuredOpenApiUrl = String(import.meta.env.VITE_BOT_OPENAPI_URL ?? '').trim()

const openApiUrl = configuredOpenApiUrl || '/openapi/bot-resource-api.yaml'

const configuredAsyncApiUrl = String(import.meta.env.VITE_BOT_ASYNCAPI_URL ?? '').trim()

const asyncApiUrl = configuredAsyncApiUrl || '/asyncapi/bot-gateway-asyncapi.yaml'

// Поддерживаем браузерные Назад/Вперёд и прямые ссылки с ?view=api&api=gateway.
watch(
  () => [route.query.view, route.query.api],
  () => {
    activeView.value = route.query.view === 'api' ? 'api' : 'guides'
    activeApiReference.value = route.query.api === 'gateway' ? 'gateway' : 'rest'
  },
)

async function setActiveApiReference(view: ApiReferenceView): Promise<void> {
  activeView.value = 'api'
  activeApiReference.value = view

  const query: LocationQueryRaw = {
    ...route.query,
    view: 'api',
  }

  if (view === 'gateway') {
    query.api = 'gateway'
  } else {
    delete query.api
  }

  await router.replace({ query })
}

async function setActiveView(view: DocsView): Promise<void> {
  activeView.value = view

  const query = { ...route.query }

  if (view === 'api') {
    query.view = 'api'

    if (activeApiReference.value === 'gateway') {
      query.api = 'gateway'
    }
  } else {
    delete query.view
    delete query.api
  }

  await router.replace({ query })
}

const navigation: NavGroup[] = [
  {
    title: 'Начало работы',
    items: [
      { id: 'quickstart', label: 'Быстрый старт' },
      { id: 'overview', label: 'Обзор API' },
      { id: 'installation-model', label: 'Токены и установки' },
      { id: 'authentication', label: 'Bot access token' },
      { id: 'oauth-install', label: 'OAuth и установка' },
      { id: 'oauth-local-test', label: 'Проверка OAuth локально' },
      { id: 'first-request', label: 'Первое сообщение' },
      { id: 'delivery-setup', label: 'Webhook и Gateway' },
      { id: 'commands-setup', label: 'Slash-команды' },
      { id: 'troubleshooting', label: 'Решение проблем' },
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

// Демонстрационные значения не являются рабочими секретами.
const oauthDemoPowerShellExample = `# Откройте PowerShell в пустой папке. Нужен установленный Go.
$env:ECHOTALK_API_URL = "https://jiechotalk.ru:8443"
$env:ECHOTALK_PORTAL_URL = (Read-Host "HTTPS-адрес Dev Portal").TrimEnd('/')
$env:ECHOTALK_BOT_ID = Read-Host "ID вашего тестового бота"
$env:ECHOTALK_REDIRECT_URI = "http://127.0.0.1:3001/oauth/callback"
$env:ECHOTALK_CLIENT_ID = Read-Host "Client ID"
$clientSecret = Read-Host "Client Secret" -AsSecureString
$env:ECHOTALK_CLIENT_SECRET = [System.Net.NetworkCredential]::new("", $clientSecret).Password
Remove-Variable clientSecret

# Скачайте публичный исходный файл, затем изучите его перед запуском.
Invoke-WebRequest -Uri "$($env:ECHOTALK_PORTAL_URL)/examples/oauth-demo/main.go" -OutFile "./echotalk-oauth-demo.go"
# Запустите свой локальный HTTP-сервер (порт 3001 должен быть свободен).
go run ./echotalk-oauth-demo.go`

const oauthStartRequestExample = `GET /oauth/start HTTP/1.1
Host: mybot.ru

# Тело запроса отсутствует. Параметры URL не требуются.`

const oauthStartResponseExample = `HTTP/1.1 303 See Other
Cache-Control: no-store
Set-Cookie: et_oauth_state=<STATE>; Path=/oauth; Max-Age=600; HttpOnly; Secure; SameSite=Lax
Location: https://portal.example/explore/4?state=<STATE>&redirect_uri=https%3A%2F%2Fmybot.ru%2Foauth%2Fcallback

# Для HTTPS cookie обязательно имеет флаг Secure.`

const oauthStateGoExample = `// В обработчике GET /oauth/start. Импорты: crypto/rand, encoding/base64, net/http.
b := make([]byte, 32)
if _, err := rand.Read(b); err != nil {
    http.Error(w, "internal error", http.StatusInternalServerError)
    return
}
state := base64.RawURLEncoding.EncodeToString(b)
// Сохраните state в сессии или HttpOnly cookie для последующей проверки.`

const authorizeExample = `POST /oauth/authorize
Content-Type: application/json

{
  "bot_id": 4,
  "server_id": 1,
  "scopes": ["bot", "room.view"],
  "state": "<STATE_FROM_OAUTH_START>",
  "redirect_uri": "https://mybot.ru/oauth/callback"
}`

const authorizeResponseExample = `HTTP/1.1 200 OK
Content-Type: application/json

{
  "code": "<ONE_TIME_CODE>",
  "state": "<STATE_FROM_OAUTH_START>",
  "client_id": "<CLIENT_ID>",
  "redirect_uri": "https://mybot.ru/oauth/callback",
  "redirect_to": "https://mybot.ru/oauth/callback?code=<ONE_TIME_CODE>&state=<STATE_FROM_OAUTH_START>"
}`

const oauthCallbackRequestExample = `GET /oauth/callback?code=<ONE_TIME_CODE>&state=<STATE_FROM_OAUTH_START> HTTP/1.1
Host: mybot.ru
Cookie: et_oauth_state=<STATE_FROM_OAUTH_START>

# Обработчик должен проверить совпадение state из URL и cookie.`

const tokenRequestExample = `POST https://jiechotalk.ru:8443/oauth/token
Content-Type: application/json

{
  "grant_type": "authorization_code",
  "code": "<ONE_TIME_CODE>",
  "client_id": "<CLIENT_ID>",
  "client_secret": "<CLIENT_SECRET>",
  "redirect_uri": "https://mybot.ru/oauth/callback"
}`

const tokenResponseExample = `HTTP/1.1 200 OK
Content-Type: application/json

{
  "access_token": "<BOT_ACCESS_TOKEN>",
  "token_type": "Bearer",
  "expires_in": 900,
  "refresh_token": "<BOT_REFRESH_TOKEN>",
  "scope": "bot room.view"
}`

const refreshTokenExample = `{
  "grant_type": "refresh_token",
  "client_id": "<CLIENT_ID>",
  "client_secret": "<CLIENT_SECRET>",
  "refresh_token": "<CURRENT_REFRESH_TOKEN>"
}`

const botMeResponseExample = `{
  "bot_app_id": 4,
  "bot_user_id": 204,
  "installation_id": 5,
  "server_id": 1,
  "granted_scopes": ["bot", "room.view", "room.sendMessage"]
}`

const botRoomsResponseExample = `{
  "data": [
    { "id": 3, "server_id": 1, "name": "Тестовая комната", "type": "text", "category_id": null, "is_dialog": false, "position": 0 }
  ]
}`

const firstMessageResponseExample = `{
  "data": {
    "id": 501,
    "room_id": 3,
    "user_id": 204,
    "content": "Привет из EchoTalk Bot API!",
    "type": "text",
    "created_at": "2026-11-23T10:11:57Z"
  }
}`

const gatewayFramesExample = `// EchoTalk → ваш сервер (после подключения)
{"type":"hello","data":{"heartbeat_sec":30}}

// Ваш сервер → EchoTalk (последний сохранённый ACK; первый запуск = 0)
{"type":"resume","data":{"last_ack_seq":0}}

// EchoTalk → ваш сервер (форма события; поля payload зависят от типа)
{"type":"event","data":{"seq":1,"event_id":"<EVENT_ID>","type":"message.created","payload":{}}}

// Ваш сервер → EchoTalk (только после успешной обработки)
{"type":"ack","data":{"seq":1}}

// Ваш сервер → EchoTalk (периодически по heartbeat_sec)
{"type":"heartbeat","data":{"ts":<UNIX_TIME_MS>}}`

const webhookSignatureExample = `import { createHmac, timingSafeEqual } from 'node:crypto'

// rawBody — исходный Buffer из POST, secret — из серверного хранилища.
function verifyWebhook({ secret, rawBody, timestamp, signature }) {
  const seconds = Number(timestamp)
  if (!Number.isSafeInteger(seconds) ||
      Math.abs(Math.floor(Date.now() / 1000) - seconds) > 300) return false
  if (!/^[a-f0-9]{64}$/.test(signature ?? '')) return false

  const expected = createHmac('sha256', secret)
    .update(String(timestamp) + '.')
    .update(rawBody)
    .digest('hex')
  return timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expected, 'hex'))
}
// Применяйте до JSON-разбора. event_id проверяйте на дубликаты отдельно.`

const botMeExample = `curl --fail-with-body -sS \\
  -H "Authorization: Bearer $BOT_ACCESS_TOKEN" \\
  "$ECHOTALK_API_URL/bot/me"`

const botRoomsExample = `curl --fail-with-body -sS \\
  -H "Authorization: Bearer $BOT_ACCESS_TOKEN" \\
  "$ECHOTALK_API_URL/bot/servers/<SERVER_ID>/rooms"`

const firstMessageExample = `curl --fail-with-body -sS -X POST \\
  "$ECHOTALK_API_URL/bot/rooms/<ROOM_ID>/messages" \\
  -H "Authorization: Bearer $BOT_ACCESS_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"content":"Привет из EchoTalk Bot API!"}'`

const commandCreateExample = `{
  "name": "help",
  "description": "Список доступных команд",
  "is_enabled": true
}`

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

const activeSection = ref('quickstart')

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
  overflow: visible;

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

/* OAuth installation flow: compact timeline, not a glossary of participants. */
.docs-oauth-journey {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
  margin: 18px 0 26px;
  padding: 0;
}
.docs-oauth-journey li {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 15px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  font-size: 0.88rem;
  line-height: 1.55;
}
.docs-oauth-journey strong {
  color: var(--text-primary);
}
.docs-oauth-journey code {
  overflow-wrap: anywhere;
}
.docs-oauth-contract {
  display: grid;
  gap: 0;
  margin: 16px 0;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  overflow: hidden;
}
.docs-oauth-contract > div {
  display: grid;
  grid-template-columns: minmax(140px, 0.36fr) minmax(0, 1fr);
  gap: 16px;
  padding: 14px 16px;
  background: var(--bg-tertiary);
  line-height: 1.6;
}
.docs-oauth-contract > div + div {
  border-top: 1px solid var(--border-color);
}
.docs-oauth-contract strong {
  color: var(--text-primary);
}
.docs-oauth-contract span {
  color: var(--text-secondary);
}
@media (max-width: 1150px) {
  .docs-oauth-journey {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 640px) {
  .docs-oauth-journey {
    grid-template-columns: minmax(0, 1fr);
  }
  .docs-oauth-contract > div {
    grid-template-columns: minmax(0, 1fr);
    gap: 5px;
  }
}

.docs-oauth-addresses {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin: 20px 0;
}
.docs-oauth-addresses > div {
  min-width: 0;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background: var(--bg-tertiary);
  padding: 16px 18px;
}
.docs-oauth-addresses h3 {
  margin-top: 0;
}
.docs-oauth-addresses code {
  overflow-wrap: anywhere;
}
.docs-oauth-addresses p {
  margin: 12px 0 0;
}
@media (max-width: 760px) {
  .docs-oauth-addresses {
    grid-template-columns: minmax(0, 1fr);
  }
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

/* Onboarding: CTA, ordered steps, troubleshooting and accessible mobile navigation. */
.docs-hero-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 22px;
}

.docs-primary-action,
.docs-secondary-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 42px;
  padding: 10px 16px;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  font: inherit;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: var(--transition);
}

.docs-primary-action {
  background: var(--accent-primary);
  border-color: var(--accent-primary);
  color: var(--bg-primary);
}

.docs-primary-action:hover {
  filter: brightness(1.08);
}
.docs-secondary-action {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}
.docs-secondary-action:hover {
  background: var(--bg-elevated);
}

.docs-primary-action:focus-visible,
.docs-secondary-action:focus-visible,
.docs-text-button:focus-visible,
.docs-mobile-nav a:focus-visible {
  outline: 2px solid var(--accent-primary);
  outline-offset: 3px;
}

.docs-steps {
  display: grid;
  gap: 12px;
  padding-left: 28px;
  color: var(--text-secondary);
  line-height: 1.7;
}
.docs-steps li {
  padding: 6px 0 6px 8px;
}
.docs-steps li::marker {
  color: var(--accent-primary);
  font-weight: 700;
}
.docs-steps strong,
.docs-troubleshooting strong {
  color: var(--text-primary);
}
.docs-steps a {
  color: var(--accent-primary);
}
.docs-troubleshooting {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
.docs-troubleshooting > div {
  padding: 18px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background: var(--bg-tertiary);
}
.docs-troubleshooting p {
  margin: 8px 0 0;
}
.docs-text-button {
  padding: 0;
  border: none;
  background: none;
  color: var(--accent-primary);
  font: inherit;
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;
}
.docs-reference-loading {
  display: grid;
  place-items: center;
  min-height: 220px;
  color: var(--text-secondary);
}
.docs-mobile-nav {
  display: none;
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
  .docs-mobile-nav {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    margin-bottom: 24px;
    padding-bottom: 10px;
    scrollbar-width: thin;
  }
  .docs-mobile-nav a {
    flex: none;
    padding: 8px 11px;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    background: var(--bg-tertiary);
    color: var(--text-primary);
    font-size: 0.84rem;
    text-decoration: none;
  }
  .docs-troubleshooting {
    grid-template-columns: 1fr;
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

.api-type-switcher {
  width: fit-content;

  display: inline-flex;
  gap: 4px;

  margin-bottom: 24px;
  padding: 4px;

  border: 1px solid var(--border-color);
  border-radius: 10px;

  background: var(--bg-tertiary);
}

.api-type-switcher__button {
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

.api-type-switcher__button:hover {
  color: var(--text-primary);
}

.api-type-switcher__button--active {
  background: var(--bg-elevated);
  color: var(--text-primary);
}
</style>

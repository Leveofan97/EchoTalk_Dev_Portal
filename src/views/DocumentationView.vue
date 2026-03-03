<template>
  <div class="docs">
    <div class="container">
      <div class="docs-layout">
        <!-- Sidebar -->
        <aside class="docs-sidebar">
          <nav class="docs-nav">
            <div v-for="section in navSections" :key="section.title" class="nav-section">
              <h4 class="nav-section__title">{{ section.title }}</h4>
              <ul class="nav-section__list">
                <li v-for="item in section.items" :key="item">
                  <a href="#" class="nav-link">{{ item }}</a>
                </li>
              </ul>
            </div>
          </nav>
        </aside>

        <!-- Content -->
        <main class="docs-content">
          <h1>Документация EchoTalk Bot API</h1>

          <section class="doc-section">
            <h2>Введение</h2>
            <p>
              EchoTalk Bot API позволяет создавать мощные интеграции для серверов EchoTalk.
              API построен на REST принципах и поддерживает real-time события через WebSocket.
            </p>

            <div class="info-box">
              <strong>Базовый URL:</strong>
              <code>https://api.echotalk.ru/v1</code>
            </div>
          </section>

          <section class="doc-section">
            <h2>Аутентификация</h2>
            <p>
              Все запросы к API должны включать заголовок <code>Authorization</code> с Bearer токеном:
            </p>

            <div class="code-example">
              <div class="code-example__header">
                <span>HTTP Headers</span>
              </div>
              <pre><code>Authorization: Bearer YOUR_BOT_TOKEN</code></pre>
            </div>
          </section>

          <section class="doc-section">
            <h2>Отправка сообщений</h2>
            <p>Для отправки сообщения в текстовый канал используйте endpoint:</p>

            <div class="code-example">
              <div class="code-example__header">
                <span>POST /bot/messages</span>
              </div>
              <pre><code>{
  "room_id": "123456789",
  "content": "Привет, мир!",
  "embeds": [
    {
      "title": "Заголовок",
      "description": "Описание embed",
      "color": 0x6366f1
    }
  ]
}</code></pre>
            </div>
          </section>

          <section class="doc-section">
            <h2>WebSocket Gateway</h2>
            <p>
              Для получения real-time событий подключитесь к WebSocket Gateway:
            </p>

            <div class="code-example">
              <div class="code-example__header">
                <span>JavaScript</span>
              </div>
              <pre><code>const ws = new WebSocket('wss://gateway.echotalk.ru/v1');

ws.onopen = () => {
  // Авторизация
  ws.send(JSON.stringify({
    op: 2,
    d: {
      token: 'YOUR_BOT_TOKEN'
    }
  }));
};

ws.onmessage = (event) => {
  const payload = JSON.parse(event.data);
  console.log('Event:', payload);
};</code></pre>
            </div>
          </section>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const navSections = [
  {
    title: 'Начало работы',
    items: ['Введение', 'Аутентификация', 'Быстрый старт', 'SDK']
  },
  {
    title: 'API Reference',
    items: ['Messages', 'Rooms', 'Members', 'Servers', 'Interactions']
  },
  {
    title: 'WebSocket',
    items: ['Gateway', 'Events', 'Intents', 'Heartbeat']
  },
  {
    title: 'Ресурсы',
    items: ['Rate Limits', 'Error Codes', 'Changelog']
  }
]
</script>

<style scoped>
.docs {
  padding: 100px 0 60px;
  min-height: 100vh;
}

.docs-layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 3rem;
}

.docs-sidebar {
  position: sticky;
  top: 100px;
  height: fit-content;
}

.docs-nav {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.nav-section__title {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  margin-bottom: 0.75rem;
}

.nav-section__list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.nav-link {
  display: block;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  color: var(--text-secondary);
  font-size: 0.9375rem;
  transition: var(--transition);
}

.nav-link:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.docs-content h1 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
}

.doc-section {
  margin-bottom: 3rem;
}

.doc-section h2 {
  font-size: 1.75rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
}

.doc-section p {
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 1.5rem;
}

.info-box {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.info-box code {
  background: var(--bg-elevated);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.875rem;
}

.code-example {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  overflow: hidden;
  margin: 1rem 0;
}

.code-example__header {
  background: var(--bg-elevated);
  padding: 0.75rem 1rem;
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid var(--border-color);
}

.code-example pre {
  padding: 1.5rem;
  margin: 0;
  overflow-x: auto;
}

.code-example code {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.875rem;
  line-height: 1.7;
  color: var(--text-primary);
}

@media (max-width: 968px) {
  .docs-layout {
    grid-template-columns: 1fr;
  }

  .docs-sidebar {
    display: none;
  }
}
</style>

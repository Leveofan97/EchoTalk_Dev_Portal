import type { BotAvailableScope } from '@/api/bots'

/** Developer-facing labels. Unknown future scopes still use backend metadata. */
const russianScopeTitles: Record<string, string> = {
  bot: 'Базовый доступ бота',
  'server.view': 'Просмотр сервера',
  'server.members.view': 'Просмотр участников',
  'server.members.kick': 'Исключение участников',
  'server.members.ban': 'Блокировка участников',
  'server.members.timeout': 'Временное ограничение участников',
  'server.roles.view': 'Просмотр ролей',
  'server.roles.manage': 'Управление ролями',
  'server.manageRooms': 'Управление комнатами и категориями',
  'server.invites.view': 'Просмотр приглашений',
  'server.audit.view': 'Просмотр журнала действий',
  'room.view': 'Просмотр комнат',
  'room.sendMessage': 'Отправка сообщений',
  'message.content.view': 'Чтение содержимого сообщений',
  'voice.view': 'Просмотр голосовых комнат',
  'voice.connect': 'Подключение к голосовым комнатам',
  'voice.listen': 'Получение аудио участников',
  'voice.speak': 'Публикация аудио и видео',
}

export function scopeTitle(scope: Pick<BotAvailableScope, 'name' | 'label'>): string {
  const label = scope.label?.trim()
  return russianScopeTitles[scope.name] ?? (label || scope.name)
}

/** One tile per permission, with fail-closed metadata merging on duplicates. */
export function uniqueBotScopes(scopes: readonly BotAvailableScope[]): BotAvailableScope[] {
  const unique = new Map<string, BotAvailableScope>()
  for (const scope of scopes) {
    const name = scope.name.trim()
    if (!name) continue
    const previous = unique.get(name)
    if (!previous) {
      unique.set(name, { ...scope, name })
      continue
    }
    unique.set(name, {
      ...previous,
      required: previous.required || scope.required,
      assignable: previous.assignable && scope.assignable,
      sensitive: Boolean(previous.sensitive || scope.sensitive),
    })
  }
  return [...unique.values()]
}

/** Keep voice scopes consistent and ensure required scopes cannot be removed. */
export function updateBotScopes(
  current: readonly string[],
  name: string | null,
  checked: boolean,
  catalog: readonly BotAvailableScope[],
): string[] {
  const selected = new Set(current)
  if (name) {
    if (checked) selected.add(name)
    else selected.delete(name)
  }

  // Removing a parent must remove its children; do not silently re-enable it.
  if (!checked && name === 'voice.view') {
    selected.delete('voice.connect')
    selected.delete('voice.listen')
    selected.delete('voice.speak')
  } else if (!checked && name === 'voice.connect') {
    selected.delete('voice.listen')
    selected.delete('voice.speak')
  }

  if (selected.has('voice.listen') || selected.has('voice.speak')) {
    selected.add('voice.connect')
  }
  if (selected.has('voice.connect')) selected.add('voice.view')

  selected.add('bot')
  for (const scope of catalog) {
    if (scope.required) selected.add(scope.name)
  }
  return [...selected]
}

export function requiredBotScopes(catalog: readonly BotAvailableScope[]): string[] {
  return updateBotScopes([], null, false, catalog)
}

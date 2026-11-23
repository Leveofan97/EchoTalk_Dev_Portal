/** Набор имён SVG-иконок UI в едином 24px outline-стиле. */
export const appIconNames = [
  'arrow-left',
  'arrow-right',
  'chevron-left',
  'rocket',
  'alert-triangle',
  'key-round',
  'terminal',
  'server',
  'plug-zap',
  'list-checks',
  'scroll-text',
  'shield-check',
  'trash-2',
  'layout-dashboard',
  'link-2',
  'message-circle',
  'pin',
  'mail',
  'users',
  'door-open',
  'house',
  'folder',
  'settings',
  'radio-tower',
  'check',
  'package',
  'inbox',
  'activity',
  'menu',
  'x',
  'plus',
  'chevron-right',
  'search',
  'book-open',
  'globe',
] as const

export type AppIconName = (typeof appIconNames)[number]

/** Один тип значка для каждой группы событий, без эмодзи/непредсказуемых шрифтов. */
export function botEventIcon(type: string): AppIconName {
  if (type.startsWith('message.reaction')) return 'message-circle'
  if (type.startsWith('message.pinned') || type.startsWith('message.unpinned')) return 'pin'
  if (type.startsWith('message.')) return 'mail'
  if (type.startsWith('server.role')) return 'shield-check'
  if (type.startsWith('server.member')) return 'users'
  if (type.startsWith('room.member')) return 'door-open'
  if (type.startsWith('server.room')) return 'house'
  if (type.startsWith('server.category')) return 'folder'
  if (type.startsWith('server.invite')) return 'link-2'
  if (type.startsWith('server.updated') || type.includes('overrides')) return 'settings'
  if (type.startsWith('voice.')) return 'radio-tower'
  return 'activity'
}

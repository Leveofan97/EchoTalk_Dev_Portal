// Bot Types
export type BotStatus = 'draft' | 'active' | 'suspended' | 'inactive'

export interface BotApp {
  id: number  // Бэкенд возвращает number (uint)
  owner_id: number
  name: string
  description: string | null
  avatar_url: string | null
  is_public: boolean
  status: BotStatus
  created_at: string
  updated_at: string
  scopes?: string[]
  events?: string[]
  credentials?: BotCredential[]
}

export interface CreateBotPayload {
  name: string
  description?: string
  avatar_url?: string
  is_public?: boolean
  scopes?: string[]
}

export interface BotCredential {
  id: number
  client_id: string
  type: 'secret' | 'public_key'
  is_active: boolean
  created_at: string
  last_used_at?: string
  revoked_at?: string
  // Важно: client_secret здесь НЕТ, он выдается только при создании
}

// User Types (обновлённые под реальный ответ)
export interface User {
  id: number
  login: string
  email: string
  avatarURL: string | null
  aboutMe: string | null
  status: string
  // ... остальные поля
}

export interface Session {
  token: string
  sessionId: string
  user: User
}

export interface ServerForInstall {
  id: number
  name: string
  avatar_url: string
  has_bot: boolean
}

export type Theme = 'darkNight' | 'lightDay' | 'retroGame' | 'cosmicNeon' |
  'goldDust' | 'deepDepth' | 'purpleDragon' | 'softWarm'

export const AVAILABLE_SCOPES = [
  { value: 'bot', label: 'Базовые функции бота', description: 'Необходим для работы любого бота' },
  { value: 'messages:read', label: 'Чтение сообщений', description: 'Бот может читать сообщения в каналах' },
  { value: 'messages:write', label: 'Отправка сообщений', description: 'Бот может отправлять сообщения' },
  { value: 'members:read', label: 'Просмотр участников', description: 'Доступ к списку участников сервера' },
  { value: 'rooms:read', label: 'Просмотр комнат', description: 'Доступ к списку комнат' },
  { value: 'server:manage', label: 'Управление сервером', description: 'Изменение настроек сервера (только для админ-ботов)' },
] as const

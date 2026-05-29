// Bot Types
export type BotStatus = 'draft' | 'active' | 'suspended' | 'inactive'

export interface BotAvailableEvent {
  type: string
  label: string
  group: string
  required_scopes: string[]
}

export interface BotApp {
  id: number
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
  available_events?: BotAvailableEvent[]

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

export type Theme =
  | 'darkNight'
  | 'lightDay'
  | 'retroGame'
  | 'cosmicNeon'
  | 'goldDust'
  | 'deepDepth'
  | 'purpleDragon'
  | 'softWarm'

export interface BotCommand {
  id: number
  bot_app_id: number
  name: string
  description: string
  endpoint_path: string
  is_enabled: boolean
  created_at: string
  updated_at: string
}

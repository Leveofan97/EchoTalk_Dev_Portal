export interface UserBadge {
  key: string
  label: string
  IconURL: string
  description: string
}

export interface UserAccessControl {
  enforcement: boolean
  global: {
    privileges: string[]
  }
}

export interface UserTelegram {
  authDate: string
  firstName: string
  photoURL: string
  telegramID: number
  username: string
}

export interface User {
  id: number
  login: string
  email: string
  avatarURL: string | null
  aboutMe: string | null
  status: string
  customStatus: string | null
  locale: string
  timezone: string
  pronouns: string
  emailVerified: boolean
  isEnable2FA: boolean
  isExternal: boolean
  createdAt: string
  activity: any | null
  authProviders: string[]
  badges: UserBadge[]
  accessControl: UserAccessControl
  telegram: UserTelegram | null
  unique_code: string
}

export interface Session {
  token: string
  sessionId: string
  user: User
}

export interface LoginCredentials {
  email: string
  password: string
  twoFACode?: string
  backupCode?: string
  remember?: boolean
}

export interface LoginResponse extends User {
  token: string
  sessionId: string
}

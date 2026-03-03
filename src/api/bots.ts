// api/bots.ts
import { api } from './http'
import type {BotApp, CreateBotPayload, ServerForInstall} from '@/types'

export interface CreateCredentialsResponse {
  client_id: string
  client_secret?: string
  created_at: string
}

export interface BotInstallation {
  id: number
  server_id: number
  server_name: string
  server_avatar?: string
  status: string
  granted_scopes: string[]
  event_delivery: string
  created_at: string
  revoked_at?: string
}

// Публичные боты (без авторизации)
export interface PublicBotInfo {
  id: string
  name: string
  description: string
  avatar_url: string
  owner_id: number
  owner_name: string
  owner_avatar: string
  server_count: number
  scopes: string[]
}

export interface PublicBotDetail {
  id: string
  name: string
  description: string
  avatar_url: string
  is_public: boolean
  owner: {
    id: number
    username: string
    avatar_url: string
  }
  server_count: number
  scopes: string[]
  created_at: string
}

export const botsApi = {
  // === ПУБЛИЧНЫЕ (без авторизации) ===
  getPublicBots: () =>
    api.get<PublicBotInfo[]>('/api/public-bots'),

  getPublicBotInfo: (id: string | number) =>
    api.get<PublicBotDetail>(`/api/public-bots/${id}`),

  // === Dev Portal (требует авторизации) ===
  getMyBots: () =>
    api.get<BotApp[]>('/dev/bots'),

  createBot: (data: CreateBotPayload) =>
    api.post<BotApp>('/dev/bots', data),

  getBot: (id: string | number) =>
    api.get<BotApp>(`/dev/bots/${id}`),

  updateBot: (id: string | number, data: Partial<BotApp>) =>
    api.put<BotApp>(`/dev/bots/${id}`, data),

  deleteBot: (id: string | number) =>
    api.delete(`/dev/bots/${id}`),

  // Credentials
  getCredentials: (id: string | number) =>
    api.get(`/dev/bots/${id}/credentials`),

  createCredentials: (id: string | number, type: 'secret' | 'public_key') =>
    api.post<CreateCredentialsResponse>(`/dev/bots/${id}/credentials`, { type }),

  rotateCredentials: (id: string | number) =>
    api.post<CreateCredentialsResponse>(`/dev/bots/${id}/credentials/rotate`),

  // Installations
  getInstallations: (id: string | number) =>
    api.get<BotInstallation[]>(`/dev/bots/${id}/installations`),

  // Revoke installation (by installation ID)
  revokeInstallation: (installationId: string | number) =>
    api.delete(`/bot-installations/${installationId}`),

  publishBot: (id: string | number) =>
    api.post(`/dev/bots/${id}/publish`),

  getServersForInstall: (botId: string | number) =>
    api.get<ServerForInstall[]>(`/api/servers-for-bot-install?bot_id=${botId}`),

  authorizeBot: (data: {
    client_id: string
    server_id: number
    scopes: string[]
    redirect_uri: string
    state: string
  }) => api.post<{
    code: string
    state: string
    redirect_uri: string
  }>('/oauth/authorize', data),
}

// api/bots.ts
import { api } from './http'
import type { BotApp, CreateBotPayload, ServerForInstall } from '@/types'
import { makeApiRequest } from './http'

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

export interface BotAvailableScope {
  name: string
  label: string
  description: string
  required: boolean
  assignable: boolean
  group: string
}

export interface ExchangeTokenPayload {
  grant_type: 'authorization_code'
  code: string
  client_id: string
  client_secret: string
  redirect_uri: string
}

export interface TokenExchangeResponse {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token: string
  scope: string
}

export interface RefreshTokenPayload {
  grant_type: 'refresh_token'
  refresh_token: string
  client_id: string
  client_secret: string
}

export interface InstallationWebhookConfig {
  installation_id: number
  webhook_url: string
  command_base_url: string
  event_delivery: 'webhook' | 'websocket'
  subscribed_events: string[]
  last_delivery_at?: string | null
  last_delivery_error?: string
  enabled: boolean
}

export interface BotEventDelivery {
  id: string
  installation_id: number
  bot_app_id: number
  server_id: number
  event_id: string
  event_type: string
  event_version: number
  status: string
  attempt_count: number
  max_attempts: number
  next_attempt_at: string
  last_error?: string
  last_response_code?: number
  created_at: string
  updated_at: string
}

export interface BotEventDeliveryAttempt {
  id: string
  delivery_id: string
  attempt_no: number
  request_url: string
  response_status?: number
  duration_ms: number
  error_text?: string
  response_body_excerpt?: string
  created_at: string
}

export interface BotCommand {
  id: number
  bot_app_id: number
  name: string
  description: string
  is_enabled: boolean
  created_at: string
  updated_at: string
}

export interface CreateBotCommandPayload {
  name: string
  description: string
  is_enabled: boolean
}

export interface UpdateBotCommandPayload {
  name?: string
  description?: string
  is_enabled?: boolean
}

export interface InstallationGatewayStatus {
  installation_id: number
  status: 'connected' | 'disconnected' | 'not_connected'
  last_connection_id?: string
  last_issued_seq?: number
  last_acked_seq?: number
  backlog_count: number
  last_seen_at?: string | null
  last_acked_at?: string | null
  last_connected_at?: string | null
  last_disconnected_at?: string | null
}

export interface BotRuntimeLimits {
  id: number
  installation_id: number
  enabled: boolean

  requests_per_minute: number
  messages_per_minute: number
  interactions_per_minute: number
  gateway_sessions_per_minute: number
  gateway_connections_per_minute: number

  messages_per_day?: number
  interactions_per_day?: number
  gateway_events_per_day?: number

  burst_messages_limit: number
  burst_messages_window_sec: number
  burst_interactions_limit: number
  burst_interactions_window_sec: number

  violation_limit: number
  violation_window_sec: number
  auto_block_duration_sec: number

  blocked_until?: string | null
  block_reason?: string
  created_at?: string
  updated_at?: string
}

export interface BotRuntimeProtectionStats {
  installation_id: number
  blocked: boolean
  blocked_until?: string | null
  block_reason?: string
  retry_after_sec: number
  violation_count: number
  violation_limit: number
  violation_window_sec: number
  violation_reset_at?: string
}

export interface BotReplayEventPayloadInner {
  id: string
  type: string
  version: number
  server_id?: number
  room_id?: number
  actor_user_id?: number
  actor_type?: string
  occurred_at: string
  data?: Record<string, unknown>
}

export interface BotReplayEventPayload {
  seq: number
  type: string
  version: number
  event_id: string
  occurred_at: string
  payload: BotReplayEventPayloadInner
}

export interface BotReplayEvent {
  event_id: string
  seq: number
  type: string
  version: number
  occurred_at: string
  payload: BotReplayEventPayload
}

export const botsApi = {
  // === ПУБЛИЧНЫЕ (без авторизации) ===
  getPublicBots: () => api.get<PublicBotInfo[]>('/api/public-bots'),

  getPublicBotInfo: (id: string | number) => api.get<PublicBotDetail>(`/api/public-bots/${id}`),

  // === Dev Portal (требует авторизации) ===
  getMyBots: () => api.get<BotApp[]>('/dev/bots'),

  createBot: (data: CreateBotPayload) => api.post<BotApp>('/dev/bots', data),

  getBot: (id: string | number) => api.get<BotApp>(`/dev/bots/${id}`),

  updateBot: (id: string | number, data: Partial<BotApp>) =>
    api.put<BotApp>(`/dev/bots/${id}`, data),

  deleteBot: (id: string | number) => api.delete(`/dev/bots/${id}`),

  // Credentials
  getCredentials: (id: string | number) => api.get(`/dev/bots/${id}/credentials`),

  createCredentials: (id: string | number, type: 'secret' | 'public_key') =>
    api.post<CreateCredentialsResponse>(`/dev/bots/${id}/credentials`, { type }),

  rotateCredentials: (id: string | number) =>
    api.post<CreateCredentialsResponse>(`/dev/bots/${id}/credentials/rotate`),

  // Commands
  getCommands: (id: string | number) => api.get<BotCommand[]>(`/dev/bots/${id}/commands`),

  createCommand: (id: string | number, data: CreateBotCommandPayload) =>
    api.post<BotCommand>(`/dev/bots/${id}/commands`, data),

  updateCommand: (id: string | number, commandId: string | number, data: UpdateBotCommandPayload) =>
    api.put<BotCommand>(`/dev/bots/${id}/commands/${commandId}`, data),

  deleteCommand: (id: string | number, commandId: string | number) =>
    api.delete(`/dev/bots/${id}/commands/${commandId}`),

  // Installations
  getInstallations: (id: string | number) =>
    api.get<BotInstallation[]>(`/dev/bots/${id}/installations`),

  // Revoke installation (by installation ID)
  revokeInstallation: (installationId: string | number) =>
    api.delete(`/bot-installations/${installationId}`),

  publishBot: (id: string | number) => api.post(`/dev/bots/${id}/publish`),

  getServersForInstall: (botId: string | number) =>
    api.get<ServerForInstall[]>(`/api/servers-for-bot-install?bot_id=${botId}`),

  getAvailableScopes: () => api.get<BotAvailableScope[]>('/dev/bots/available-scopes'),

  getInstallationGatewayStatus: (installationId: string | number) =>
    api.get<InstallationGatewayStatus>(`/dev/installations/${installationId}/gateway/status`),

  getInstallationRuntimeLimits: (installationId: string | number) =>
    api.get<BotRuntimeLimits>(`/dev/installations/${installationId}/runtime-limits`),

  getInstallationRuntimeProtectionStats: (installationId: string | number) =>
    api.get<BotRuntimeProtectionStats>(
      `/dev/installations/${installationId}/runtime-protection/stats`,
    ),

  authorizeBot: (data: {
    client_id: string
    server_id: number
    scopes: string[]
    redirect_uri: string
    state: string
  }) =>
    api.post<{
      code: string
      state: string
      redirect_uri: string
    }>('/oauth/authorize', data),

  exchangeToken: (data: ExchangeTokenPayload) =>
    api.post<TokenExchangeResponse>('/oauth/token', data),

  refreshBotToken: (data: RefreshTokenPayload) =>
    api.post<TokenExchangeResponse>('/oauth/token/refresh', data),

  botMe: (token: string) => fetchBotApi('/bot/me', token),

  botServer: (token: string, serverID: string | number) =>
    fetchBotApi(`/bot/servers/${serverID}`, token),

  botRooms: (token: string, serverID: string | number) =>
    fetchBotApi(`/bot/servers/${serverID}/rooms`, token),

  botSendMessage: (token: string, roomID: string | number, content: string) =>
    fetchBotApi(`/bot/rooms/${roomID}/messages`, token, {
      method: 'POST',
      body: { content },
    }),

  getInstallationWebhook: (installationId: string | number) =>
    api.get<InstallationWebhookConfig>(`/dev/installations/${installationId}/webhook`),

  updateInstallationWebhook: (
    installationId: string | number,
    data: {
      webhook_url: string
      command_base_url: string
      event_delivery: 'webhook' | 'websocket'
      subscribed_events: string[]
      enabled: boolean
    },
  ) => api.put<InstallationWebhookConfig>(`/dev/installations/${installationId}/webhook`, data),

  rotateInstallationWebhookSecret: (installationId: string | number) =>
    api.post<{ installation_id: number; secret: string }>(
      `/dev/installations/${installationId}/webhook/rotate-secret`,
    ),

  getInstallationDeliveries: (installationId: string | number, limit = 20) =>
    api.get<BotEventDelivery[]>(`/dev/installations/${installationId}/deliveries?limit=${limit}`),

  getDeliveryAttempts: (installationId: string | number, deliveryId: string) =>
    api.get<BotEventDeliveryAttempt[]>(
      `/dev/installations/${installationId}/deliveries/${deliveryId}/attempts`,
    ),

  getInstallationEvents: (installationId: string | number, afterSeq = 0, limit = 50) =>
    api.get<BotReplayEventsResponse>(
      `/dev/installations/${installationId}/events?after_seq=${afterSeq}&limit=${limit}`,
    ),
}

const fetchBotApi = <T = any>(
  endpoint: string,
  token: string,
  options: {
    method?: 'GET' | 'POST'
    body?: any
  } = {},
) =>
  makeApiRequest<T>(endpoint, {
    method: options.method || 'GET',
    body: options.body,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

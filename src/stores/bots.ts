// stores/bots.ts
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { botsApi } from '@/api/bots'
import type { BotApp, CreateBotPayload, BotInstallation, ServerForInstall } from '@/types'
import type { CreateCredentialsResponse, BotAvailableScope } from '@/api/bots'

export const useBotsStore = defineStore('bots', () => {
  // State
  const bots = ref<BotApp[]>([])
  const currentBot = ref<BotApp | null>(null)
  const currentBotCredentials = ref<CreateCredentialsResponse[]>([])
  const currentBotInstallations = ref<BotInstallation[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const availableScopes = ref<BotAvailableScope[]>([])

  const serversForInstall = ref<ServerForInstall[]>([])
  const isInstalling = ref(false)
  const authCode = ref<string | null>(null)

  // Getters
  const activeBotsCount = computed(() => bots.value.filter((b) => b.status === 'active').length)

  // Actions
  const fetchBots = async () => {
    isLoading.value = true
    error.value = null

    try {
      const response = await botsApi.getMyBots()

      if (response.error) {
        error.value = response.error
        bots.value = []
        return
      }

      // Ответ от Go — это напрямую массив или объект с data
      const botsData = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response)
          ? response
          : []

      bots.value = botsData
    } catch (e: any) {
      console.error('Failed to fetch bots:', e)
      error.value = e.message || 'Failed to load bots'
      bots.value = []
    } finally {
      isLoading.value = false
    }
  }

  const createBot = async (payload: CreateBotPayload) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await botsApi.createBot(payload)

      if (response.error) {
        error.value = response.error
        return null
      }

      // Go возвращает объект напрямую
      const newBot = response.data || response

      if (!newBot?.id) {
        error.value = 'Invalid response from server'
        return null
      }

      bots.value.unshift(newBot as BotApp)
      return newBot as BotApp
    } catch (e: any) {
      console.error('Failed to create bot:', e)
      error.value = e.message || 'Failed to create bot'
      return null
    } finally {
      isLoading.value = false
    }
  }

  const fetchBotDetails = async (botId: string | number) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await botsApi.getBot(botId)

      if (response.error) {
        error.value = response.error
        return null
      }

      currentBot.value = response.data || response
      return currentBot.value
    } catch (err: any) {
      error.value = err.message
      return null
    } finally {
      isLoading.value = false
    }
  }

  const updateBot = async (
    botId: string | number,
    updates: Partial<BotApp> & { scopes?: string[] },
  ) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await botsApi.updateBot(botId, updates)

      if (response.error) {
        error.value = response.error
        throw new Error(response.error)
      }

      const updated = response.data || response
      currentBot.value = updated

      // Обновляем в списке
      const idx = bots.value.findIndex((b) => b.id === botId)
      if (idx !== -1) {
        bots.value[idx] = { ...bots.value[idx], ...updated }
      }

      return updated
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteBot = async (botId: string | number) => {
    error.value = null

    try {
      const response = await botsApi.deleteBot(botId)

      if (response.error) {
        error.value = response.error
        throw new Error(response.error)
      }

      bots.value = bots.value.filter((b) => b.id !== botId)
      if (currentBot.value?.id === botId) {
        currentBot.value = null
      }
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  // Credentials
  const createCredential = async (
    botId: string | number,
    type: 'secret' | 'public_key' = 'secret',
  ) => {
    try {
      const response = await botsApi.createCredentials(botId, type)

      if (response.error) {
        throw new Error(response.error)
      }

      const newCred = response.data || response

      // ⚠️ Важно: создаем объект для списка credentials (без секрета!)
      // Секрет показывается только один раз при создании
      const credentialForList = {
        id: Date.now(), // Временный ID, пока не перезагрузим список
        type,
        is_active: true,
        created_at: newCred.created_at,
        last_used_at: null,
        revoked_at: null,
      }

      // Добавляем в начало списка
      currentBotCredentials.value.unshift(credentialForList)

      // Возвращаем полный ответ (с секретом), чтобы показать пользователю
      return newCred
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  const fetchBotCredentials = async (botId: string | number) => {
    try {
      const response = await botsApi.getCredentials(botId)

      if (response.error) {
        throw new Error(response.error)
      }

      // Это массив BotCredential (без секретов!)
      currentBotCredentials.value = response.data || []
      return currentBotCredentials.value
    } catch (err: any) {
      error.value = err.message
      return []
    }
  }

  const rotateCredentials = async (botId: string | number) => {
    try {
      const response = await botsApi.rotateCredentials(botId)

      if (response.error) {
        throw new Error(response.error)
      }

      // После ротации обновляем список
      await fetchBotCredentials(botId)
      return response.data || response
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  // Installations
  const fetchBotInstallations = async (botId: string | number) => {
    try {
      const response = await botsApi.getInstallations(botId)

      if (response.error) {
        throw new Error(response.error)
      }

      currentBotInstallations.value = response.data || []
      return currentBotInstallations.value
    } catch (err: any) {
      error.value = err.message
      return []
    }
  }

  const publishBot = async (botId: string | number) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await botsApi.publishBot(botId)

      if (response.error) {
        error.value = response.error
        throw new Error(response.error)
      }

      const updated = response.data
      if (currentBot.value && currentBot.value.id === botId) {
        currentBot.value.status = updated?.status || 'active'
      }

      // Обновляем в списке тоже
      const idx = bots.value.findIndex((b) => b.id === botId)
      if (idx !== -1) {
        bots.value[idx].status = updated?.status || 'active'
      }

      return updated
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const revokeInstallation = async (installationId: string | number) => {
    try {
      const response = await botsApi.revokeInstallation(installationId)

      if (response.error) {
        throw new Error(response.error)
      }

      currentBotInstallations.value = currentBotInstallations.value.filter(
        (i) => i.id !== installationId,
      )
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  // Getters
  const availableServers = computed(() => serversForInstall.value.filter((s) => !s.has_bot))

  // Actions
  const fetchServersForInstall = async (botId: string | number) => {
    try {
      const response = await botsApi.getServersForInstall(botId)
      if (response.error) {
        error.value = response.error
        return []
      }
      serversForInstall.value = response.data || []
      return serversForInstall.value
    } catch (err: any) {
      error.value = err.message
      return []
    }
  }

  const authorizeBotInstallation = async (data: {
    client_id: string
    server_id: number
    scopes: string[]
    redirect_uri: string
    state: string
  }) => {
    isInstalling.value = true
    error.value = null

    try {
      const response = await botsApi.authorizeBot(data)
      if (response.error) {
        error.value = response.error
        return null
      }
      authCode.value = response.data?.code || null
      return response.data
    } catch (err: any) {
      error.value = err.message
      return null
    } finally {
      isInstalling.value = false
    }
  }

  const clearAuthCode = () => {
    authCode.value = null
  }

  const fetchAvailableScopes = async () => {
    const response = await botsApi.getAvailableScopes()
    if (response.error) {
      error.value = response.error
      return []
    }

    availableScopes.value = response.data || []
    return availableScopes.value
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    bots,
    currentBot,
    currentBotCredentials,
    currentBotInstallations,
    isLoading,
    error,
    availableScopes,
    // Getters
    activeBotsCount,
    // Actions
    fetchBots,
    clearError,
    createBot,
    fetchBotDetails,
    updateBot,
    publishBot,
    deleteBot,
    fetchBotCredentials,
    createCredential,
    rotateCredentials,
    fetchBotInstallations,
    revokeInstallation,
    serversForInstall,
    availableServers,
    fetchAvailableScopes,
    isInstalling,
    authCode,
    fetchServersForInstall,
    authorizeBotInstallation,
    clearAuthCode,
  }
})

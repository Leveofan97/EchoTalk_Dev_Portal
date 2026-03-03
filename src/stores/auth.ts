import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { makeApiRequest } from '@/api/http'
import type { Session, LoginCredentials, LoginResponse } from '@/types/auth'

const SESSION_KEY = 'dev-portal-session'
const SESSION_STORAGE_KEY = 'dev-portal-session-temp'
const PENDING_2FA_KEY = 'dev-portal-pending-2fa'

export const useAuthStore = defineStore('auth', () => {
  // State
  const session = ref<Session | null>(null)
  const pending2FA = ref<{ userId: string; email: string } | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!session.value?.token && !!session.value?.user)
  const user = computed(() => session.value?.user || null)
  const token = computed(() => session.value?.token || null)

  // Actions
  const initAuth = async () => {
    // Пробуем восстановить из localStorage (remember me)
    const savedSession = localStorage.getItem(SESSION_KEY)
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession)
        const refreshed = await refreshSession(parsed.token)
        if (refreshed) {
          session.value = refreshed
          // Обновляем storage с новым токеном
          localStorage.setItem(SESSION_KEY, JSON.stringify(refreshed))
          console.log('Session restored from localStorage:', refreshed.user.login)
          return
        } else {
          localStorage.removeItem(SESSION_KEY)
        }
      } catch (e) {
        localStorage.removeItem(SESSION_KEY)
      }
    }

    // Пробуем восстановить из sessionStorage (без remember me)
    const tempSession = sessionStorage.getItem(SESSION_STORAGE_KEY)
    if (tempSession) {
      try {
        const parsed = JSON.parse(tempSession)
        const refreshed = await refreshSession(parsed.token)
        if (refreshed) {
          session.value = refreshed
          // Обновляем sessionStorage с новым токеном
          sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(refreshed))
          console.log('Session restored from sessionStorage:', refreshed.user.login)
          return
        } else {
          sessionStorage.removeItem(SESSION_STORAGE_KEY)
        }
      } catch (e) {
        sessionStorage.removeItem(SESSION_STORAGE_KEY)
      }
    }

    // Проверяем pending 2FA
    const savedPending2FA = localStorage.getItem(PENDING_2FA_KEY)
    if (savedPending2FA) {
      try {
        pending2FA.value = JSON.parse(savedPending2FA)
      } catch (e) {
        localStorage.removeItem(PENDING_2FA_KEY)
      }
    }
  }

  // Refresh токена через /refresh endpoint
  const refreshSession = async (oldToken: string): Promise<Session | null> => {
    try {
      const response = await makeApiRequest<LoginResponse>('/refresh', {
        method: 'POST',
        headers: {
          Authorization: `${oldToken}`,
        },
      })

      if (response.error || !response.data) {
        console.log('Refresh failed:', response.error)
        return null
      }

      // Backend возвращает тот же формат что и при login
      const userData = response.data

      if (!userData.token || !userData.id) {
        return null
      }

      return {
        token: userData.token,
        sessionId: userData.sessionId,
        user: {
          id: userData.id,
          login: userData.login,
          email: userData.email,
          avatarURL: userData.avatarURL,
          aboutMe: userData.aboutMe,
          status: userData.status,
          customStatus: userData.customStatus,
          locale: userData.locale,
          timezone: userData.timezone,
          pronouns: userData.pronouns,
          emailVerified: userData.emailVerified,
          isEnable2FA: userData.isEnable2FA,
          isExternal: userData.isExternal,
          createdAt: userData.createdAt,
          activity: userData.activity,
          authProviders: userData.authProviders,
          badges: userData.badges,
          accessControl: userData.accessControl,
          telegram: userData.telegram,
          unique_code: userData.unique_code,
        },
      }
    } catch (e) {
      console.error('Session refresh error:', e)
      return null
    }
  }

  const login = async (credentials: LoginCredentials) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await makeApiRequest<LoginResponse>('/login', {
        method: 'POST',
        body: {
          email: credentials.email,
          password: credentials.password,
          twoFACode: credentials.twoFACode || '',
          backup_code: credentials.backupCode || '',
        },
      })

      console.log('Login response:', response)

      // Требуется 2FA
      if (response.requires2FA) {
        pending2FA.value = {
          userId: response.userId!,
          email: credentials.email,
        }
        localStorage.setItem(PENDING_2FA_KEY, JSON.stringify(pending2FA.value))
        isLoading.value = false
        return { requires2FA: true }
      }

      // Ошибка авторизации
      if (response.error) {
        error.value = response.error
        isLoading.value = false
        return { error: response.error }
      }

      const userData = response.data

      if (userData?.token && userData?.id) {
        const newSession: Session = {
          token: userData.token,
          sessionId: userData.sessionId,
          user: {
            id: userData.id,
            login: userData.login,
            email: userData.email,
            avatarURL: userData.avatarURL,
            aboutMe: userData.aboutMe,
            status: userData.status,
            customStatus: userData.customStatus,
            locale: userData.locale,
            timezone: userData.timezone,
            pronouns: userData.pronouns,
            emailVerified: userData.emailVerified,
            isEnable2FA: userData.isEnable2FA,
            isExternal: userData.isExternal,
            createdAt: userData.createdAt,
            activity: userData.activity,
            authProviders: userData.authProviders,
            badges: userData.badges,
            accessControl: userData.accessControl,
            telegram: userData.telegram,
            unique_code: userData.unique_code,
          },
        }

        session.value = newSession

        // Разделение хранилищ
        if (credentials.remember === true) {
          localStorage.setItem(SESSION_KEY, JSON.stringify(newSession))
          sessionStorage.removeItem(SESSION_STORAGE_KEY)
        } else {
          sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newSession))
          localStorage.removeItem(SESSION_KEY)
        }

        pending2FA.value = null
        localStorage.removeItem(PENDING_2FA_KEY)

        console.log('Login successful:', newSession.user.login)
        isLoading.value = false
        return { success: true }
      }

      isLoading.value = false
      return { error: 'Неизвестная ошибка: неверный формат ответа' }
    } catch (e) {
      console.error('Login error:', e)
      error.value = 'Произошла ошибка при входе'
      isLoading.value = false
      return { error: 'Произошла ошибка при входе' }
    }
  }

  const complete2FA = async (code: string, isBackupCode: boolean = false) => {
    if (!pending2FA.value) {
      return { error: 'Нет активного запроса 2FA' }
    }

    isLoading.value = true
    error.value = null

    const result = await login({
      email: pending2FA.value.email,
      password: '', // пароль уже не нужен
      twoFACode: isBackupCode ? '' : code,
      backupCode: isBackupCode ? code : '',
    })

    isLoading.value = false
    return result
  }

  const cancel2FA = () => {
    pending2FA.value = null
    localStorage.removeItem(PENDING_2FA_KEY)
  }

  const logout = async () => {
    const currentToken = session.value?.token
    const currentSessionId = session.value?.sessionId

    try {
      if (currentToken && currentSessionId) {
        await makeApiRequest('/logout', {
          method: 'POST',
          headers: {
            Authorization: `${currentToken}`,
          },
          body: {
            session_id: currentSessionId,
          },
        })
      }
    } catch (e) {
      console.error('Logout error:', e)
    }

    // Чистим всё
    session.value = null
    pending2FA.value = null
    localStorage.removeItem(SESSION_KEY)
    sessionStorage.removeItem(SESSION_STORAGE_KEY)
    localStorage.removeItem(PENDING_2FA_KEY)
  }

  const clearError = () => {
    error.value = null
  }

  return {
    session,
    pending2FA,
    isLoading,
    error,
    isAuthenticated,
    user,
    token,
    initAuth,
    login,
    complete2FA,
    cancel2FA,
    logout,
    clearError,
  }
})

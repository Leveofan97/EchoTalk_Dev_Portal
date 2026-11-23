/** Общие представления значений диагностики. Отсутствующие поля API не подменяем нулём. */
export function diagnosticNumber(value: number | null | undefined): string {
  return typeof value === 'number' && Number.isFinite(value)
    ? value.toLocaleString('ru-RU')
    : '—'
}

export function diagnosticSequence(value: number | null | undefined): string {
  return typeof value === 'number' && Number.isFinite(value) ? `#${value}` : '—'
}

export function diagnosticDate(value: string | null | undefined): string {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString('ru-RU')
}

export function diagnosticDuration(seconds: number | null | undefined): string {
  if (typeof seconds !== 'number' || !Number.isFinite(seconds) || seconds < 0) return '—'
  if (seconds < 60) return `${seconds} с`
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remaining = seconds % 60
  return [hours && `${hours} ч`, minutes && `${minutes} мин`, remaining && `${remaining} с`]
    .filter(Boolean)
    .join(' ') || '0 с'
}

export type RuntimeHealth = 'blocked' | 'disabled' | 'active' | 'unknown'

export function runtimeHealth(
  limits: { enabled: boolean } | null,
  stats: { blocked: boolean } | null,
): RuntimeHealth {
  if (stats?.blocked) return 'blocked'
  if (limits && !limits.enabled) return 'disabled'
  if (limits && stats) return 'active'
  return 'unknown'
}

export function runtimeBlockReason(reason: string | null | undefined): string {
  if (!reason) return 'Не указана'
  if (reason === 'auto_block_runtime_abuse') return 'Автоматическая блокировка за превышение лимитов'
  return 'Причина указана сервером'
}

export function gatewayConnectionLabel(status: string | null | undefined): string {
  switch (status) {
    case 'connected': return 'Подключён'
    case 'disconnected': return 'Отключён'
    case 'not_connected': return 'Подключений ещё не было'
    default: return 'Неизвестное состояние'
  }
}

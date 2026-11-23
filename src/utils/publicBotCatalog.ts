import type { PublicBotInfo } from '@/api/bots'

/** Поиск только по публичным полям, без дополнительных API-запросов. */
export function filterPublicBots(bots: readonly PublicBotInfo[], query: string): PublicBotInfo[] {
  const needle = query.trim().toLocaleLowerCase('ru')
  if (!needle) return [...bots]
  return bots.filter((bot) =>
    [bot.name, bot.description, bot.owner_name].some((value) =>
      (value || '').toLocaleLowerCase('ru').includes(needle),
    ),
  )
}

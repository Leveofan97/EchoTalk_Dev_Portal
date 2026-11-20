/** The server-scoped revoke route registered in SetupBotRoutes (Go). */
export const revokeBotInstallationPath = (installation: {
  id: number
  server_id: number
}): string => {
  const { id, server_id: serverId } = installation
  if (!Number.isSafeInteger(id) || id <= 0 || !Number.isSafeInteger(serverId) || serverId <= 0) {
    throw new TypeError('Некорректный идентификатор установки или сервера')
  }
  return `/servers/${serverId}/bots/${id}`
}

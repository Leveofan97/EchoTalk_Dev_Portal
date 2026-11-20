/** For responses without installation-specific grants, fall back to app scopes.
 * Backend remains the authority when the developer saves subscriptions. */
export interface ScopedBotEvent { type: string; required_scopes: string[] }
export const filterSelectableEvents = <T extends ScopedBotEvent>(
  events: T[], installationScopes: string[] | undefined, appScopes: string[],
): T[] => {
  const scopes = new Set(installationScopes ?? appScopes)
  return events.filter(event => event.required_scopes.every(scope => scopes.has(scope)))
}
export const showDeliveryRetryTime = (status: string): boolean =>
  status === 'pending' || status === 'retry'

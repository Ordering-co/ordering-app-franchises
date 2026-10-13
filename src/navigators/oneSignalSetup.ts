type OneSignalGate = {
  configsLoading?: boolean
  appId?: unknown
  auth?: unknown
}

export function shouldSetupOneSignal (params: OneSignalGate) {
  return !params.configsLoading && !!params.appId && !!params.auth
}

export function shouldPromptForPushNotifications (deviceState?: { hasNotificationPermission?: boolean } | null) {
  return !deviceState?.hasNotificationPermission
}

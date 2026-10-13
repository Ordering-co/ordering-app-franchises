type FirebasePushGate = {
  configsLoading?: boolean
  enabled?: unknown
  auth?: unknown
}

export function isFirebasePushEnabled (configs: any) {
  return configs?.firebase_push_enabled?.value === '1'
}

export function shouldSetupFirebasePush (params: FirebasePushGate) {
  return !params.configsLoading && !!params.enabled && !!params.auth
}

import * as Sentry from '@sentry/react-native'
import DeviceInfo from 'react-native-device-info'
import settings from '../config'
import sentrySettings from '../sentry.json'

export function initSentry () {
  try {
    const dsn = sentrySettings.dsn
    if (__DEV__ || !dsn) return
    const buildNumber = DeviceInfo.getBuildNumber()
    Sentry.init({
      dsn,
      environment: 'production',
      release: `${DeviceInfo.getBundleId()}@${DeviceInfo.getVersion()}+${buildNumber}`,
      dist: buildNumber,
      enableNativeCrashHandling: false,
      enableAppHangTracking: false,
      tracesSampleRate: 0.1
    })
    Sentry.setTag('app', 'app-franchises')
    Sentry.setTag('project', settings.project)
  } catch {}
}

import {
  shouldPromptForPushNotifications,
  shouldSetupOneSignal
} from '../oneSignalSetup'

describe('shouldSetupOneSignal', () => {
  const ready = {
    configsLoading: false,
    appId: 'onesignal-app',
    auth: true
  }

  it('is true when configs are ready, the user is authed, and an app id exists', () => {
    expect(shouldSetupOneSignal(ready)).toBe(true)
  })

  it('is false while configs are loading', () => {
    expect(shouldSetupOneSignal({ ...ready, configsLoading: true })).toBe(false)
  })

  it('is false without an app id or session', () => {
    expect(shouldSetupOneSignal({ ...ready, appId: '' })).toBe(false)
    expect(shouldSetupOneSignal({ ...ready, appId: undefined })).toBe(false)
    expect(shouldSetupOneSignal({ ...ready, auth: false })).toBe(false)
  })
})

describe('shouldPromptForPushNotifications', () => {
  it('does not re-prompt when the OS already granted permission', () => {
    expect(shouldPromptForPushNotifications({ hasNotificationPermission: true })).toBe(false)
  })

  it('prompts when permission is missing', () => {
    expect(shouldPromptForPushNotifications({ hasNotificationPermission: false })).toBe(true)
    expect(shouldPromptForPushNotifications(null)).toBe(true)
  })
})

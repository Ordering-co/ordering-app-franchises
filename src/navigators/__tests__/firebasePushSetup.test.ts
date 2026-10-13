import { isFirebasePushEnabled, shouldSetupFirebasePush } from '../firebasePushSetup'

describe('isFirebasePushEnabled', () => {
  it('is true only when the config value is the string 1', () => {
    expect(isFirebasePushEnabled({ firebase_push_enabled: { value: '1' } })).toBe(true)
  })

  it('is false for disabled, missing, or malformed configs', () => {
    expect(isFirebasePushEnabled({ firebase_push_enabled: { value: '0' } })).toBe(false)
    expect(isFirebasePushEnabled({ firebase_push_enabled: {} })).toBe(false)
    expect(isFirebasePushEnabled({})).toBe(false)
    expect(isFirebasePushEnabled(undefined)).toBe(false)
    expect(isFirebasePushEnabled(null)).toBe(false)
  })
})

describe('shouldSetupFirebasePush', () => {
  const ready = {
    configsLoading: false,
    enabled: true,
    auth: true
  }

  it('is true when configs are ready, the flag is on, and the user is authed', () => {
    expect(shouldSetupFirebasePush(ready)).toBe(true)
  })

  it('is false while configs are loading', () => {
    expect(shouldSetupFirebasePush({ ...ready, configsLoading: true })).toBe(false)
  })

  it('is false without the flag or session', () => {
    expect(shouldSetupFirebasePush({ ...ready, enabled: false })).toBe(false)
    expect(shouldSetupFirebasePush({ ...ready, auth: false })).toBe(false)
  })
})

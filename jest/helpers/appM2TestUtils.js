const baseHelpUIProps = {
  cmsState: {
    loading: false,
    items: [{ id: 1, name: 'FAQ' }],
    pages: [{ id: 1, name: 'FAQ' }],
    error: null
  },
  onRedirect: jest.fn()
}

const baseNotificationsUIProps = {
  navigation: { canGoBack: jest.fn(() => false), goBack: jest.fn() },
  singleNotifications: { result: { result: null }, changes: {} },
  handleChangePromotions: jest.fn(),
  userData: { settings: { email: { newsletter: true }, sms: { newsletter: false }, notification: { newsletter: true } } }
}

const basePageBannerUIProps = {
  pageBannerState: { loading: false, result: [] },
  navigation: { push: jest.fn() },
  isProjectChange: false
}

const baseWebsocketStatusUIProps = {
  socketStatus: 1,
  connectedDate: '2026-01-01'
}

module.exports = {
  baseHelpUIProps,
  baseNotificationsUIProps,
  basePageBannerUIProps,
  baseWebsocketStatusUIProps
}

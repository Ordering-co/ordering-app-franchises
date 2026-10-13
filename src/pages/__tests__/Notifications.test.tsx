import { fireEvent } from '@testing-library/react-native'

import NotificationsList from '../Notifications'
import { renderPage } from '../../../jest/helpers/renderPage'
import { setupPageTestEnv } from '../../../jest/helpers/pageTestSetup'

jest.mock('@ui', () => require('../../../jest/helpers/mockUi'))

describe('Notifications page', () => {
  beforeEach(() => {
    setupPageTestEnv()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders notifications list and handles navigation callbacks', () => {
    const { getByTestId, navigation } = renderPage(NotificationsList, {
      navigation: { canGoBack: jest.fn(() => false) }
    })
    expect(getByTestId('notifications-list-controller')).toBeTruthy()
    fireEvent.press(getByTestId('notifications-back'))
    expect(navigation.goBack).not.toHaveBeenCalled()
    fireEvent.press(getByTestId('notifications-nav'))
    expect(navigation.navigate).toHaveBeenCalledWith('Profile', {})
  })
})

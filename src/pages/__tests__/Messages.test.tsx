import { fireEvent } from '@testing-library/react-native'

import Messages from '../Messages'
import { renderPage } from '../../../jest/helpers/renderPage'
import { setupPageTestEnv } from '../../../jest/helpers/pageTestSetup'

jest.mock('@ui', () => require('../../../jest/helpers/mockUi'))

jest.mock('../../config.js', () => ({
  __esModule: true,
  default: { franchiseSlug: 'franchise-a' }
}))

describe('Messages page', () => {
  beforeEach(() => {
    setupPageTestEnv()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders message listing with franchise id and navigation', () => {
    const { getByTestId, navigation } = renderPage(Messages)
    expect(getByTestId('navbar-title').props.children).toBe('Messages')
    expect(getByTestId('message-listing-franchise-id').props.children).toBe('franchise-a')
    expect(getByTestId('message-listing-controller')).toBeTruthy()
    fireEvent.press(getByTestId('message-listing-nav'))
    expect(navigation.navigate).toHaveBeenCalledWith('MessageView', { orderId: 1 })
  })

  it('goes back only when navigation can go back', () => {
    const { getByTestId, navigation } = renderPage(Messages, {
      navigation: { canGoBack: jest.fn(() => false) }
    })
    fireEvent.press(getByTestId('navbar-back'))
    expect(navigation.goBack).not.toHaveBeenCalled()
  })
})

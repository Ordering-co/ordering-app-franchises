import { fireEvent } from '@testing-library/react-native'

import Sessions from '../Sessions'
import { renderPage } from '../../../jest/helpers/renderPage'
import { setupPageTestEnv } from '../../../jest/helpers/pageTestSetup'

jest.mock('@ui', () => require('../../../jest/helpers/mockUi'))

describe('Sessions page', () => {
  beforeEach(() => {
    setupPageTestEnv()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders sessions with security title and back action', () => {
    const { getByText, getByTestId, navigation } = renderPage(Sessions)
    expect(getByText('Security')).toBeTruthy()
    expect(getByTestId('sessions-controller')).toBeTruthy()
    fireEvent.press(getByTestId('navbar-back'))
    expect(navigation.goBack).toHaveBeenCalled()
  })

  it('does not go back when navigation cannot go back', () => {
    const { getByTestId, navigation } = renderPage(Sessions, {
      navigation: { canGoBack: jest.fn(() => false) }
    })
    fireEvent.press(getByTestId('navbar-back'))
    expect(navigation.goBack).not.toHaveBeenCalled()
  })
})

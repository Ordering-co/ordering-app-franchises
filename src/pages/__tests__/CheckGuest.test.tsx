import { fireEvent } from '@testing-library/react-native'
import { useOrder } from '@components'

import CheckGuest from '../CheckGuest'
import { renderPage } from '../../../jest/helpers/renderPage'
import { setupPageTestEnv } from '../../../jest/helpers/pageTestSetup'

jest.mock('@ui', () => require('../../../jest/helpers/mockUi'))

jest.mock('../Login', () => {
  const React = require('react')
  const { View, TouchableOpacity } = require('react-native')
  return {
    __esModule: true,
    default: (props) => (
      React.createElement(
        View,
        { testID: 'guest-login' },
        React.createElement(TouchableOpacity, {
          testID: 'guest-user-btn',
          onPress: props.handleGuestUser
        }),
        React.createElement(TouchableOpacity, {
          testID: 'to-signup',
          onPress: () => props.setAccountState('signup')
        }),
        React.createElement(TouchableOpacity, {
          testID: 'to-forgot',
          onPress: () => props.setAccountState('forgot')
        })
      )
    )
  }
})

jest.mock('../Signup', () => {
  const React = require('react')
  const { View } = require('react-native')
  return {
    __esModule: true,
    default: () => React.createElement(View, { testID: 'guest-signup' })
  }
})

jest.mock('../ForgotPassword', () => {
  const React = require('react')
  const { View } = require('react-native')
  return {
    __esModule: true,
    default: () => React.createElement(View, { testID: 'guest-forgot' })
  }
})

describe('CheckGuest page', () => {
  beforeEach(() => {
    setupPageTestEnv()
    useOrder.mockReturnValue([{ carts: {} }, {}])
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders login flow by default', () => {
    const { getByTestId } = renderPage(CheckGuest)
    expect(getByTestId('guest-login')).toBeTruthy()
  })

  it('navigates guest to checkout when cart exists', () => {
    useOrder.mockReturnValue([{
      carts: { 'businessId:10': { uuid: 'cart-uuid-1' } }
    }, {}])
    const { getByTestId, navigation } = renderPage(CheckGuest)
    fireEvent.press(getByTestId('guest-user-btn'))
    expect(navigation.navigate).toHaveBeenCalledWith('CheckoutPage', { cartUuid: 'cart-uuid-1' })
  })

  it('navigates guest to bottom tab when no cart', () => {
    const { getByTestId, navigation } = renderPage(CheckGuest)
    fireEvent.press(getByTestId('guest-user-btn'))
    expect(navigation.navigate).toHaveBeenCalledWith('BottomTab', { cartUuid: undefined })
  })

  it('switches between login, signup, and forgot views', () => {
    const { getByTestId, queryByTestId } = renderPage(CheckGuest)
    fireEvent.press(getByTestId('to-signup'))
    expect(getByTestId('guest-signup')).toBeTruthy()
    expect(queryByTestId('guest-login')).toBeNull()
  })
})

import { fireEvent } from '@testing-library/react-native'
import { StackActions } from '@react-navigation/native'

import PaymentOptions from '../PaymentOptions'
import { renderPage } from '../../../jest/helpers/renderPage'
import { setupPageTestEnv } from '../../../jest/helpers/pageTestSetup'

jest.mock('@ui', () => require('../../../jest/helpers/mockUi'))

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native')
  return {
    ...actual,
    StackActions: {
      replace: jest.fn((name: string, params: unknown) => ({
        type: 'REPLACE',
        payload: { name, params }
      }))
    }
  }
})

describe('PaymentOptions page', () => {
  beforeEach(() => {
    setupPageTestEnv()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders payment options with navbar title', () => {
    const { getByTestId } = renderPage(PaymentOptions, {
      route: { params: { cartUuid: 'cart-1' } }
    })
    expect(getByTestId('navbar-title').props.children).toBe('Payment method')
    expect(getByTestId('payment-options-controller')).toBeTruthy()
  })

  it('navigates or replaces on handleRedirect', () => {
    const { getByTestId, navigation } = renderPage(PaymentOptions)
    fireEvent.press(getByTestId('payment-options-redirect'))
    expect(navigation.navigate).toHaveBeenCalledWith('Checkout', { cartUuid: 'c1' })
    fireEvent.press(getByTestId('payment-options-replace'))
    expect(StackActions.replace).toHaveBeenCalledWith('Checkout', { cartUuid: 'c1' })
    expect(navigation.dispatch).toHaveBeenCalled()
  })

  it('goes back from navbar when navigation can go back', () => {
    const { getByTestId, navigation } = renderPage(PaymentOptions)
    fireEvent.press(getByTestId('navbar-back'))
    expect(navigation.goBack).toHaveBeenCalled()
  })
})

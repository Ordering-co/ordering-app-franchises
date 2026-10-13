import { fireEvent } from '@testing-library/react-native'

import PaymentDetails from '../PaymentDetails'
import { renderPage } from '../../../jest/helpers/renderPage'
import { setupPageTestEnv } from '../../../jest/helpers/pageTestSetup'

jest.mock('@ui', () => require('../../../jest/helpers/mockUi'))

jest.mock('../../config', () => ({
  __esModule: true,
  default: {
    merchantId: 'merchant-test',
    app_scheme: 'orderingapp',
    android_app_id: 'com.test.app'
  }
}))

describe('PaymentDetails page', () => {
  beforeEach(() => {
    setupPageTestEnv()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders payment details with navbar title', () => {
    const { getByTestId } = renderPage(PaymentDetails, {
      route: { params: { cartUuid: 'cart-1' } }
    })
    expect(getByTestId('navbar-title').props.children).toBe('Payment method')
    expect(getByTestId('payment-details-controller')).toBeTruthy()
  })

  it('redirects and goes back from navbar', () => {
    const { getByTestId, navigation } = renderPage(PaymentDetails)
    fireEvent.press(getByTestId('payment-details-redirect'))
    expect(navigation.navigate).toHaveBeenCalledWith('PaymentOptions', { cartUuid: 'c1' })
    fireEvent.press(getByTestId('navbar-back'))
    expect(navigation.goBack).toHaveBeenCalled()
  })
})

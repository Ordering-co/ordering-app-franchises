import { Platform } from 'react-native'
import { waitFor } from '@testing-library/react-native'
import { StripeMethodForm } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import { mockCheckoutCart } from '../../../../../../jest/helpers/appM5TestUtils'

const handleSource = jest.fn()
const onCancel = jest.fn()
const setErrors = jest.fn()
const setPlaceByMethodPay = jest.fn()

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))
jest.mock('@stripe/stripe-react-native', () => require('../../../../../../jest/helpers/appM5TestUtils').stripeNativeMock)
jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  useOrder: jest.fn(() => [{ loading: false }, {}]),
  useConfig: jest.fn(() => [{
    configs: require('../../../../../../jest/helpers/appM5TestUtils').mockWalletConfigs
  }])
}))

describe('StripeMethodForm UI', () => {
  beforeEach(() => {
    handleSource.mockClear()
    onCancel.mockClear()
    setErrors.mockClear()
    setPlaceByMethodPay.mockClear()
  })

  it('asks the customer to complete Google Pay', () => {
    const { getByText } = renderWithProviders(
      <StripeMethodForm
        cart={mockCheckoutCart}
        handleSource={handleSource}
        onCancel={onCancel}
        setErrors={setErrors}
        paymethod='google_pay'
        setPlaceByMethodPay={setPlaceByMethodPay}
      />
    )
    expect(getByText('Please complete the payment process.')).toBeTruthy()
  })

  it('cancels Apple Pay when the platform does not support it', async () => {
    renderWithProviders(
      <StripeMethodForm
        cart={mockCheckoutCart}
        handleSource={handleSource}
        onCancel={onCancel}
        setErrors={setErrors}
        paymethod='apple_pay'
        setPlaceByMethodPay={setPlaceByMethodPay}
      />
    )
    await waitFor(() => {
      expect(onCancel).toHaveBeenCalled()
      expect(setErrors).toHaveBeenCalledWith('Apple pay not supported')
    })
  })

  it('creates a Google Pay method on Android', async () => {
    const originalOs = Platform.OS
    Platform.OS = 'android'
    try {
      renderWithProviders(
        <StripeMethodForm
          cart={mockCheckoutCart}
          handleSource={handleSource}
          onCancel={onCancel}
          setErrors={setErrors}
          paymethod='google_pay'
          androidAppId='com.test.app'
          setPlaceByMethodPay={setPlaceByMethodPay}
        />
      )
      await waitFor(() => {
        expect(handleSource).toHaveBeenCalled()
        expect(onCancel).toHaveBeenCalled()
      })
    } finally {
      Platform.OS = originalOs
    }
  })
})

import { fireEvent, waitFor } from '@testing-library/react-native'
import { PaymentDetails } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import {
  mockCheckoutCart,
  mockPaymethodApplePay,
  mockPaymethodCash,
  mockPaymethodStripe
} from '../../../../../../jest/helpers/appM5TestUtils'

const mockChangePaymethod = jest.fn(async () => true)
const mockSetStateValues = jest.fn()
const onNavigationRedirect = jest.fn()
const goToBack = jest.fn()

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))
jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  useApi: jest.fn(() => [require('../../../../../../jest/helpers/appM5TestUtils').mockOrderingApi, {}]),
  useOrder: jest.fn(() => [
    {
      carts: {
        'businessId:1': require('../../../../../../jest/helpers/appM5TestUtils').mockCheckoutCart,
        'businessId:null': require('../../../../../../jest/helpers/appM5TestUtils').mockCheckoutCart
      }
    },
    { changePaymethod: mockChangePaymethod, setStateValues: mockSetStateValues }
  ])
}))

describe('PaymentDetails UI', () => {
  beforeEach(() => {
    mockChangePaymethod.mockClear()
    mockSetStateValues.mockClear()
    onNavigationRedirect.mockClear()
    goToBack.mockClear()
  })

  it('renders cash details and saves the paymethod', async () => {
    const { getByTestId, getByText } = renderWithProviders(
      <PaymentDetails
        businessId={1}
        paymethodSelected={mockPaymethodCash}
        paymethodData={{}}
        goToBack={goToBack}
        handlePaymethodClick={jest.fn()}
        onNavigationRedirect={onNavigationRedirect}
        handlePaymethodDataChange={jest.fn()}
        urlscheme='orderingapp'
      />
    )
    expect(getByTestId('payment-option-cash')).toBeTruthy()
    expect(getByText('Save')).toBeTruthy()
    fireEvent.press(getByTestId('floating-button'))
    await waitFor(() => {
      expect(mockChangePaymethod).toHaveBeenCalledWith(1, 1, JSON.stringify({ cash: null }))
    })
  })

  it('renders stripe card list', () => {
    const { getByTestId } = renderWithProviders(
      <PaymentDetails
        businessId={1}
        paymethodSelected={mockPaymethodStripe}
        paymethodData={{}}
        goToBack={goToBack}
        handlePaymethodClick={jest.fn()}
        onNavigationRedirect={onNavigationRedirect}
        handlePaymethodDataChange={jest.fn()}
      />
    )
    expect(getByTestId('stripe-cards-list')).toBeTruthy()
  })

  it('renders stripe connect card list', () => {
    const { getByTestId } = renderWithProviders(
      <PaymentDetails
        businessId={1}
        paymethodSelected={{
          ...mockPaymethodStripe,
          gateway: 'stripe_connect',
          credentials: { publishable: 'pk_test_123', stripe: { publishable: 'pk_test_123' } }
        }}
        paymethodData={{}}
        goToBack={goToBack}
        handlePaymethodClick={jest.fn()}
        onNavigationRedirect={onNavigationRedirect}
        handlePaymethodDataChange={jest.fn()}
      />
    )
    expect(getByTestId('stripe-cards-list')).toBeTruthy()
  })

  it('renders platform pay elements', () => {
    const { getByTestId } = renderWithProviders(
      <PaymentDetails
        businessId={1}
        paymethodSelected={mockPaymethodApplePay}
        paymethodData={{}}
        goToBack={goToBack}
        handlePaymethodClick={jest.fn()}
        onNavigationRedirect={onNavigationRedirect}
        handlePaymethodDataChange={jest.fn()}
      />
    )
    expect(getByTestId('stripe-elements-form')).toBeTruthy()
  })

  it('selects a gift card payment without calling changePaymethod', async () => {
    const handlePaymethodClick = jest.fn()
    const { getByTestId } = renderWithProviders(
      <PaymentDetails
        businessId={-1}
        paymethodSelected={mockPaymethodStripe}
        paymethodData={{}}
        goToBack={goToBack}
        handlePaymethodClick={handlePaymethodClick}
        onNavigationRedirect={onNavigationRedirect}
        handlePaymethodDataChange={jest.fn()}
      />
    )
    fireEvent.press(getByTestId('stripe-cards-list'))
    await waitFor(() => {
      expect(handlePaymethodClick).toHaveBeenCalled()
      expect(mockSetStateValues).toHaveBeenCalled()
      expect(onNavigationRedirect).toHaveBeenCalledWith('CheckoutPage', { cartUuid: mockCheckoutCart.uuid })
    })
  })
})

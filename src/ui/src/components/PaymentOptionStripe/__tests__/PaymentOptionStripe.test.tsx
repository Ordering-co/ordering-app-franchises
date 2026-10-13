import { fireEvent } from '@testing-library/react-native'
import { PaymentOptionStripe } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import { mockCard } from '../../../../../../jest/helpers/appM5TestUtils'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))
jest.mock('rn-placeholder', () => require('../../../../../../jest/helpers/appM5TestUtils').placeholderMock)
jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  useSession: jest.fn(() => [{ token: 'tok_test', user: { id: 1 } }, {}]),
  PaymentOptionStripe: ({ UIComponent, ...rest }) => {
    const React = require('react')
    const { paymentOptionStripeUIProps } = require('../../../../../../jest/helpers/appM5TestUtils')
    return React.createElement(UIComponent, {
      ...paymentOptionStripeUIProps,
      ...rest
    })
  }
}))

describe('PaymentOptionStripe UI', () => {
  it('renders saved cards and accepts a selection', () => {
    const onSelectCard = jest.fn()
    const { getByText } = renderWithProviders(
      <PaymentOptionStripe onSelectCard={onSelectCard} />
    )
    expect(getByText('XXXX-XXXX-XXXX-4242')).toBeTruthy()
    fireEvent.press(getByText('Accept'))
    expect(onSelectCard).toHaveBeenCalledWith(mockCard)
  })

  it('cancels card selection', () => {
    const onCancel = jest.fn()
    const { getByText } = renderWithProviders(
      <PaymentOptionStripe onCancel={onCancel} />
    )
    fireEvent.press(getByText('Cancel'))
    expect(onCancel).toHaveBeenCalled()
  })

  it('shows empty cards copy', () => {
    const { getByText } = renderWithProviders(
      <PaymentOptionStripe
        cardsList={{ loading: false, error: null, cards: [] }}
        cardSelected={null}
      />
    )
    expect(getByText("You don't have cards")).toBeTruthy()
    expect(getByText('Add New Payment Card')).toBeTruthy()
  })

  it('shows card list errors', () => {
    const { getByText } = renderWithProviders(
      <PaymentOptionStripe
        cardsList={{ loading: false, error: [{ message: 'Card vault unavailable' }], cards: [] }}
      />
    )
    expect(getByText('Card vault unavailable')).toBeTruthy()
  })
})

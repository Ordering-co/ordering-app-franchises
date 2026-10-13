import { fireEvent } from '@testing-library/react-native'
import { StripeCardsList } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import { mockCard, mockNavigation } from '../../../../../../jest/helpers/appM5TestUtils'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))
jest.mock('rn-placeholder', () => require('../../../../../../jest/helpers/appM5TestUtils').placeholderMock)
jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  useSession: jest.fn(() => [{ token: 'tok_test', user: { id: 1 } }, {}]),
  useOrder: jest.fn(() => [{
    carts: {
      'businessId:1': {
        ...require('../../../../../../jest/helpers/appM5TestUtils').mockCheckoutCart,
        paymethod_data: { id: 'card_1' }
      }
    }
  }, {}]),
  useValidationFields: jest.fn(() => [{
    fields: { card: { zipcode: { enabled: false, required: false } } }
  }]),
  PaymentOptionStripe: ({ UIComponent, ...rest }) => {
    const React = require('react')
    const { stripeCardsListUIProps } = require('../../../../../../jest/helpers/appM5TestUtils')
    return React.createElement(UIComponent, {
      ...stripeCardsListUIProps,
      ...rest
    })
  }
}))

describe('StripeCardsList UI', () => {
  it('renders saved cards and selects one', () => {
    const handleCardClick = jest.fn()
    const onSelectCard = jest.fn()
    const { getByText } = renderWithProviders(
      <StripeCardsList
        navigation={mockNavigation}
        handleCardClick={handleCardClick}
        onSelectCard={onSelectCard}
      />
    )
    expect(getByText('Select a card')).toBeTruthy()
    expect(getByText('XXXX-XXXX-XXXX-4242')).toBeTruthy()
    fireEvent.press(getByText('XXXX-XXXX-XXXX-4242'))
    expect(handleCardClick).toHaveBeenCalledWith(mockCard)
    expect(onSelectCard).toHaveBeenCalledWith(mockCard)
    expect(mockNavigation.goBack).toHaveBeenCalled()
  })

  it('does not mount the native Stripe form when saved cards exist', () => {
    const { getByText, queryByTestId } = renderWithProviders(
      <StripeCardsList navigation={mockNavigation} />
    )
    expect(queryByTestId('stripe-elements-form')).toBeNull()
    expect(getByText('Add New Payment Card')).toBeTruthy()
  })

  it('opens the Stripe form after Add New Payment Card', () => {
    const { getByText, getByTestId, queryByTestId } = renderWithProviders(
      <StripeCardsList navigation={mockNavigation} />
    )
    expect(queryByTestId('stripe-elements-form')).toBeNull()
    fireEvent.press(getByText('Add New Payment Card'))
    expect(getByTestId('stripe-elements-form')).toBeTruthy()
  })

  it('hides the add card button when the parent already provides one', () => {
    const { queryByText } = renderWithProviders(
      <StripeCardsList navigation={mockNavigation} hideAddCardButton />
    )
    expect(queryByText('Add New Payment Card')).toBeNull()
  })

  it('shows loading placeholders', () => {
    const { toJSON } = renderWithProviders(
      <StripeCardsList
        cardsList={{ loading: true, error: null, cards: [] }}
      />
    )
    expect(toJSON()).toBeTruthy()
  })

  it('shows card list errors', () => {
    const { getByText } = renderWithProviders(
      <StripeCardsList
        cardsList={{ loading: false, error: ['Unable to load cards'], cards: [] }}
      />
    )
    expect(getByText('Unable to load cards')).toBeTruthy()
  })
})

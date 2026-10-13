import { fireEvent } from '@testing-library/react-native'
import { PaymentOptionCard } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import { mockNavigation } from '../../../../../../jest/helpers/appM5TestUtils'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))
jest.mock('react-native-credit-card-input-plus', () => require('../../../../../../jest/helpers/appM5TestUtils').creditCardInputMock)
jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  useSession: jest.fn(() => [{ token: 'tok_test', user: { id: 1 } }, {}]),
  PaymentOptionStripe: ({ UIComponent, ...rest }) => {
    const React = require('react')
    const { paymentOptionCardUIProps } = require('../../../../../../jest/helpers/appM5TestUtils')
    return React.createElement(UIComponent, {
      ...paymentOptionCardUIProps,
      ...rest
    })
  }
}))

describe('PaymentOptionCard UI', () => {
  it('renders add and close card actions', () => {
    const { getByText, getAllByText } = renderWithProviders(
      <PaymentOptionCard navigation={mockNavigation} />
    )
    expect(getAllByText('Add New Payment Card')).toHaveLength(1)
    expect(getByText('Close')).toBeTruthy()
    fireEvent.press(getByText('Close'))
    expect(mockNavigation.goBack).toHaveBeenCalled()
  })

  it('opens the add card form', () => {
    const setAddCardOpen = jest.fn()
    const { getByText } = renderWithProviders(
      <PaymentOptionCard
        navigation={mockNavigation}
        setAddCardOpen={setAddCardOpen}
      />
    )
    fireEvent.press(getByText('Add New Payment Card'))
    expect(setAddCardOpen).toHaveBeenCalled()
  })
})

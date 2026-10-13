import { fireEvent, waitFor } from '@testing-library/react-native'
import { StripeElementsForm } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))
jest.mock('@stripe/stripe-react-native', () => require('../../../../../../jest/helpers/appM5TestUtils').stripeNativeMock)
jest.mock('rn-placeholder', () => require('../../../../../../jest/helpers/appM5TestUtils').placeholderMock)
jest.mock('../naked', () => ({
  StripeElementsForm: ({ UIComponent, ...rest }) => {
    const React = require('react')
    const { stripeElementsFormUIProps } = require('../../../../../../jest/helpers/appM5TestUtils')
    return React.createElement(UIComponent, {
      ...stripeElementsFormUIProps,
      ...rest
    })
  }
}))
jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  useSession: jest.fn(() => [{ user: { id: 1, name: 'Pat', email: 'pat@example.com' } }, {}]),
  useConfig: jest.fn(() => [{
    configs: require('../../../../../../jest/helpers/appM5TestUtils').mockWalletConfigs
  }]),
  useValidationFields: jest.fn(() => [{
    fields: { card: { zipcode: { enabled: true, required: true } } }
  }])
}))

describe('StripeElementsForm UI', () => {
  it('saves a completed card', async () => {
    const { getByText, getByTestId, queryByTestId } = renderWithProviders(
      <StripeElementsForm onSelectCard={jest.fn()} />
    )
    expect(getByText('Save card')).toBeTruthy()
    expect(queryByTestId('stripe-card-form')).toBeNull()
    fireEvent.press(getByTestId('stripe-card-field'))
    fireEvent.press(getByText('Save card'))
    await waitFor(() => {
      expect(require('@stripe/stripe-react-native').createPaymentMethod).toHaveBeenCalled()
    })
  })

  it('shows a missing public key state', () => {
    const { getByText } = renderWithProviders(
      <StripeElementsForm
        onSelectCard={jest.fn()}
        publicKeyState={{ key: null, loading: false }}
      />
    )
    expect(getByText('There seems to be an issue with your Stripe credentials.')).toBeTruthy()
  })

  it('renders platform pay method form', () => {
    const { getByTestId, queryByText } = renderWithProviders(
      <StripeElementsForm
        onSelectCard={jest.fn()}
        methodsPay={['apple_pay']}
        paymethod='apple_pay'
      />
    )
    expect(getByTestId('stripe-method-form')).toBeTruthy()
    expect(queryByText('Save card')).toBeNull()
  })
})

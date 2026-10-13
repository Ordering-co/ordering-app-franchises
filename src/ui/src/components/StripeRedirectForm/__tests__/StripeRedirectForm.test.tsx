import { fireEvent } from '@testing-library/react-native'
import { StripeRedirectForm } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  StripeRedirectForm: ({ UIComponent, ...rest }) => {
    const React = require('react')
    const { stripeRedirectFormUIProps } = require('../../../../../../jest/helpers/appM5TestUtils')
    return React.createElement(UIComponent, {
      ...stripeRedirectFormUIProps,
      ...rest
    })
  }
}))

describe('StripeRedirectForm UI', () => {
  it('renders payment method picker and confirms', () => {
    const { getByText } = renderWithProviders(
      <StripeRedirectForm />
    )
    expect(getByText('Select a payment method')).toBeTruthy()
    expect(getByText('OK')).toBeTruthy()
    fireEvent.press(getByText('OK'))
    expect(getByText('Select a payment method')).toBeTruthy()
  })
})

import { fireEvent } from '@testing-library/react-native'
import { StripeCardForm } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('react-native-credit-card-input', () => require('../../../../../../jest/helpers/appM5TestUtils').creditCardInputMock, { virtual: true })
jest.mock('../naked', () => ({
  StripeCardForm: ({ UIComponent, ...rest }) => {
    const React = require('react')
    const { stripeCardFormUIProps } = require('../../../../../../jest/helpers/appM5TestUtils')
    return React.createElement(UIComponent, {
      ...stripeCardFormUIProps,
      ...rest
    })
  }
}))

describe('StripeCardForm UI', () => {
  it('renders cancel and add actions', () => {
    const handleCancel = jest.fn()
    const { getByText } = renderWithProviders(
      <StripeCardForm handleCancel={handleCancel} />
    )
    expect(getByText('Cancel')).toBeTruthy()
    expect(getByText('Add')).toBeTruthy()
    fireEvent.press(getByText('Cancel'))
    expect(handleCancel).toHaveBeenCalled()
  })

  it('submits a valid card', () => {
    const handleSubmit = jest.fn()
    const { getByText, getByTestId } = renderWithProviders(
      <StripeCardForm handleSubmit={handleSubmit} />
    )
    fireEvent.press(getByTestId('credit-card-input'))
    fireEvent.press(getByText('Add'))
    expect(handleSubmit).toHaveBeenCalled()
  })
})

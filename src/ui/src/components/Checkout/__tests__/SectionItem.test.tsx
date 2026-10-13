import { fireEvent } from '@testing-library/react-native'
import { SectionItem } from '../SectionItem'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))

describe('Checkout SectionItem', () => {
  it('renders text and change action', () => {
    const onRedirect = jest.fn()
    const { getByText } = renderWithProviders(
      <SectionItem
        textToShow='123 Main St'
        secondTextToShow='Apt 4'
        btnText='Change'
        onRedirect={onRedirect}
      />
    )
    expect(getByText('123 Main St')).toBeTruthy()
    expect(getByText('Apt 4')).toBeTruthy()
    fireEvent.press(getByText('Change'))
    expect(onRedirect).toHaveBeenCalled()
  })

  it('renders selected payment last4', () => {
    const { getByText } = renderWithProviders(
      <SectionItem
        paySelected={{ gateway: 'stripe', data: { brand: 'visa', last4: '4242' } }}
      />
    )
    expect(getByText('visa')).toBeTruthy()
    expect(getByText('****4242')).toBeTruthy()
  })

  it('warns when no payment is selected', () => {
    const { getByText } = renderWithProviders(
      <SectionItem paySelected={{}} />
    )
    expect(getByText('Select a payment method')).toBeTruthy()
  })
})

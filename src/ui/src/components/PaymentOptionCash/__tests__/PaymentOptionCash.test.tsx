import { PaymentOptionCash } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import { mockUtils } from '../../../../../../jest/helpers/appM5TestUtils'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))
jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  useUtils: jest.fn(() => [require('../../../../../../jest/helpers/appM5TestUtils').mockUtils])
}))

describe('PaymentOptionCash UI', () => {
  it('renders cash amount prompt', () => {
    const { getByText, getByPlaceholderText } = renderWithProviders(
      <PaymentOptionCash
        orderTotal={12}
        defaultValue=''
        setCashState={jest.fn()}
      />
    )
    expect(getByText("Don't have exact amount? Let us know with how much will you pay")).toBeTruthy()
    expect(getByPlaceholderText('0')).toBeTruthy()
  })

  it('shows an error when cash is below the order total', () => {
    const { getByText } = renderWithProviders(
      <PaymentOptionCash
        orderTotal={12}
        defaultValue={5}
        setCashState={jest.fn()}
      />
    )
    expect(getByText(`This value must be greater than order total: ${mockUtils.parsePrice(12)}`)).toBeTruthy()
  })
})

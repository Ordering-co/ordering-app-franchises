import { HeaderTitle } from '../HeaderTitle'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))

describe('Checkout HeaderTitle', () => {
  it('renders the section title', () => {
    const { getByText } = renderWithProviders(
      <HeaderTitle text='Delivery address' />
    )
    expect(getByText('Delivery address')).toBeTruthy()
  })
})

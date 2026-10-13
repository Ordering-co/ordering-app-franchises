import { Favorite } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import { mockNavigation } from '../../../../../../jest/helpers/appM3TestUtils'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))

describe('Favorite UI', () => {
  it('renders favorite tabs', () => {
    const { getByText } = renderWithProviders(
      <Favorite navigation={mockNavigation} franchiseId={1} />
    )
    expect(getByText('Businesses')).toBeTruthy()
    expect(getByText('Products')).toBeTruthy()
    expect(getByText('My Orders')).toBeTruthy()
  })
})

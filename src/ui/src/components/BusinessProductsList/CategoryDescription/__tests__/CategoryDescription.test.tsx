import { CategoryDescriptionMemoized } from '../index'
import { renderWithProviders } from '../../../../../../../jest/helpers/renderWithProviders'

jest.mock('@ui', () => require('../../../../../../../jest/helpers/franchiseAppUiMock'))
jest.mock('@components', () => ({
  ...require('../../../../../../../jest/helpers/mockOrdering'),
  useUtils: jest.fn(() => [require('../../../../../../../jest/helpers/appM4TestUtils').mockUtils])
}))

describe('CategoryDescription UI', () => {
  it('renders category name and description', () => {
    const { getByText } = renderWithProviders(
      <CategoryDescriptionMemoized
        openDescription={{
          name: 'Mains',
          image: 'https://example.com/mains.png',
          description: 'Dinner plates'
        }}
        setOpenDescription={jest.fn()}
      />
    )
    expect(getByText('Mains')).toBeTruthy()
    expect(getByText('Dinner plates')).toBeTruthy()
  })
})

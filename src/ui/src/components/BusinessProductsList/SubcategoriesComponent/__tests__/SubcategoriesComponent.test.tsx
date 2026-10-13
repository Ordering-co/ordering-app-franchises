import { SubcategoriesComponentMemoized } from '../index'
import { renderWithProviders } from '../../../../../../../jest/helpers/renderWithProviders'
import { mockCategory } from '../../../../../../../jest/helpers/appM4TestUtils'

describe('SubcategoriesComponent UI', () => {
  it('renders all and subcategory labels', () => {
    const { getByText } = renderWithProviders(
      <SubcategoriesComponentMemoized
        category={mockCategory}
        subcategoriesSelected={[]}
        onClickSubcategory={jest.fn()}
      />
    )
    expect(getByText('All')).toBeTruthy()
    expect(getByText('Pasta')).toBeTruthy()
  })
})

import { CategoriesList } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))

describe('CategoriesList UI', () => {
  it('renders categories heading and item', () => {
    const { getByText } = renderWithProviders(
      <CategoriesList
        categories={[{ id: 1, name: 'Burgers' }]}
        onClickCategory={jest.fn()}
      />
    )
    expect(getByText('Categories')).toBeTruthy()
    expect(getByText('Burgers')).toBeTruthy()
  })
})

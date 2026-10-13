import { fireEvent } from '@testing-library/react-native'
import { SearchBar } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

describe('SearchBar UI', () => {
  it('calls onChange when typing in search input', () => {
    const onSearch = jest.fn()
    const { getByPlaceholderText } = renderWithProviders(
      <SearchBar placeholder='Search products' onSearch={onSearch} />
    )
    fireEvent.changeText(getByPlaceholderText('Search products'), 'pizza')
    expect(onSearch).toHaveBeenCalled()
  })
})

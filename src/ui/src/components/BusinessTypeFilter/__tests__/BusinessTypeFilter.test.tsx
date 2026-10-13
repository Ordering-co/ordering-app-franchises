import { BusinessTypeFilterUI } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('rn-placeholder', () => ({
  Fade: ({ children }) => children,
  Placeholder: ({ children }) => children,
  PlaceholderLine: () => null
}))

describe('BusinessTypeFilter UI', () => {
  it('renders category type and see all', () => {
    const { getByText } = renderWithProviders(
      <BusinessTypeFilterUI
        typesState={{ loading: false, types: [{ id: 1, name: 'Pizza' }] }}
        currentTypeSelected={null}
        handleChangeBusinessType={jest.fn()}
        isAppoint={false}
      />
    )
    expect(getByText('Pizza')).toBeTruthy()
    expect(getByText('See All')).toBeTruthy()
  })
})

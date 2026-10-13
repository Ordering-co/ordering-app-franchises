import { MaxSectionItem } from '../index'
import { renderWithProviders } from '../../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => ({
  ...require('../../../../../../../jest/helpers/mockOrdering'),
  useUtils: jest.fn(() => [{ parsePrice: (value) => `$${value}` }])
}))

describe('MaxSectionItem UI', () => {
  it('renders filter title', () => {
    const { getByText } = renderWithProviders(
      <MaxSectionItem
        title='Max delivery fee'
        filter='max_delivery_fee'
        filters={{ max_delivery_fee: 500 }}
        options={['default', 500, 1000, 2000]}
        handleChangeFilters={jest.fn()}
      />
    )
    expect(getByText('Max delivery fee')).toBeTruthy()
  })
})

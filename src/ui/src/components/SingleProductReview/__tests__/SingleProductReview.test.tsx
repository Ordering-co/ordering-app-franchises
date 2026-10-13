import { SingleProductReview } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import { mockProduct } from '../../../../../../jest/helpers/appM4TestUtils'

jest.mock('react-native-fast-image', () => require('../../../../../../jest/helpers/fastImageMock'))
jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  useUtils: jest.fn(() => [require('../../../../../../jest/helpers/appM4TestUtils').mockUtils])
}))

describe('SingleProductReview UI', () => {
  it('renders product name and like comments', () => {
    const { getByText } = renderWithProviders(
      <SingleProductReview
        product={mockProduct}
        formState={{ changes: [] }}
        handleChangeFormState={jest.fn()}
      />
    )
    expect(getByText('Cheese Pizza')).toBeTruthy()
    expect(getByText('Tasty')).toBeTruthy()
    expect(getByText('Additional comments')).toBeTruthy()
  })
})

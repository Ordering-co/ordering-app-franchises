import { ProductForm } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import { mockNavigation, mockProduct } from '../../../../../../jest/helpers/appM4TestUtils'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))
jest.mock('react-native-fast-image', () => require('../../../../../../jest/helpers/fastImageMock'))
jest.mock('react-native-swiper', () => 'Swiper')
jest.mock('react-native-youtube-iframe', () => 'YoutubePlayer')
jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  ProductForm: () => {
    const React = require('react')
    const { Text } = require('react-native')
    return React.createElement(Text, { testID: 'product-form-controller' }, 'ProductForm')
  }
}))

describe('ProductForm UI', () => {
  it('loads product form controller wiring', () => {
    const { getByTestId } = renderWithProviders(
      <ProductForm
        navigation={mockNavigation}
        product={mockProduct}
        productCart={{}}
      />
    )
    expect(getByTestId('product-form-controller')).toBeTruthy()
  })
})

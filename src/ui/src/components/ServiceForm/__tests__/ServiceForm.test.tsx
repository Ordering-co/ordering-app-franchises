import { ServiceForm } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import { mockProduct } from '../../../../../../jest/helpers/appM4TestUtils'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))
jest.mock('react-native-fast-image', () => require('../../../../../../jest/helpers/fastImageMock'))
jest.mock('react-native-select-dropdown', () => 'SelectDropdown')
jest.mock('react-native-calendar-picker', () => 'CalendarPicker')
jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  ProductForm: () => {
    const React = require('react')
    const { Text } = require('react-native')
    return React.createElement(Text, { testID: 'service-form-controller' }, 'ServiceForm')
  }
}))

describe('ServiceForm UI', () => {
  it('loads service form controller wiring', () => {
    const { getByTestId } = renderWithProviders(
      <ServiceForm product={mockProduct} productCart={mockProduct} />
    )
    expect(getByTestId('service-form-controller')).toBeTruthy()
  })
})

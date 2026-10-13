import { BusinessPreorder } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import { mockBusiness, mockNavigation } from '../../../../../../jest/helpers/appM4TestUtils'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))
jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  MomentOption: () => {
    const React = require('react')
    const { Text } = require('react-native')
    return React.createElement(Text, { testID: 'business-preorder-controller' }, 'BusinessPreorder')
  }
}))

describe('BusinessPreorder UI', () => {
  it('loads preorder controller wiring', () => {
    const { getByTestId } = renderWithProviders(
      <BusinessPreorder
        business={mockBusiness}
        navigation={mockNavigation}
        onNavigationRedirect={jest.fn()}
      />
    )
    expect(getByTestId('business-preorder-controller')).toBeTruthy()
  })
})

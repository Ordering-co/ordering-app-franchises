import { fireEvent } from '@testing-library/react-native'
import { PreviousBusinessOrdered } from '../index'
import { renderWithProviders } from '../../../../../../../jest/helpers/renderWithProviders'
import {
  mockBusiness,
  mockNavigation,
  mockOrderState
} from '../../../../../../../jest/helpers/appM6TestUtils'

jest.mock('@ui', () => require('../../../../../../../jest/helpers/franchiseAppUiMock'))
jest.mock('../../../BusinessController', () => ({
  BusinessController: ({ business, handleCustomClick }) => {
    const React = require('react')
    const { Text, TouchableOpacity } = require('react-native')
    return React.createElement(
      TouchableOpacity,
      { testID: `business-${business.id}`, onPress: handleCustomClick },
      React.createElement(Text, null, business?.name)
    )
  }
}))
jest.mock('@components', () => ({
  ...require('../../../../../../../jest/helpers/mockOrdering'),
  useOrder: jest.fn(() => [
    require('../../../../../../../jest/helpers/appM6TestUtils').mockOrderState,
    {}
  ])
}))

describe('PreviousBusinessOrdered UI', () => {
  it('renders businesses and redirects on click', () => {
    const onNavigationRedirect = jest.fn()
    const handleUpdateBusinesses = jest.fn()
    const { getByText, getByTestId } = renderWithProviders(
      <PreviousBusinessOrdered
        navigation={mockNavigation}
        businesses={{ loading: false, result: [mockBusiness, { ...mockBusiness, id: 2, name: 'Second Store', slug: 'second' }] }}
        onNavigationRedirect={onNavigationRedirect}
        handleUpdateBusinesses={handleUpdateBusinesses}
      />
    )
    expect(getByText('Test Store')).toBeTruthy()
    expect(getByText('Second Store')).toBeTruthy()
    fireEvent.press(getByTestId('business-1'))
    expect(onNavigationRedirect).toHaveBeenCalledWith('Business', {
      store: 'test-store',
      logo: mockBusiness.logo,
      header: mockBusiness.header
    })
  })

  it('renders the horizontal search list layout', () => {
    const { getByText } = renderWithProviders(
      <PreviousBusinessOrdered
        navigation={mockNavigation}
        businesses={{ loading: false, result: [mockBusiness] }}
        onNavigationRedirect={jest.fn()}
        isBusinessesSearchList
      />
    )
    expect(getByText('Test Store')).toBeTruthy()
  })
})

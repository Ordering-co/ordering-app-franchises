import { PlaceSpot } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import { mockCart } from '../../../../../../jest/helpers/appM4TestUtils'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))
jest.mock('rn-placeholder', () => ({
  Fade: ({ children }) => children,
  Placeholder: ({ children }) => children,
  PlaceholderLine: () => null
}))
jest.mock('react-native-select-dropdown', () => 'SelectDropdown')
jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  useOrder: jest.fn(() => [{ options: { type: 2 }, loading: false }, {}]),
  PlaceSpot: ({ UIComponent, ...rest }) => {
    const React = require('react')
    return React.createElement(UIComponent, {
      cart: require('../../../../../../jest/helpers/appM4TestUtils').mockCart,
      placesState: { loading: false, error: null, placeGroups: [], places: [] },
      handleChangePlace: jest.fn(),
      spotNumber: '3',
      spotState: {},
      isCheckout: true,
      vehicle: {},
      isInputMode: true,
      setSpotNumber: jest.fn(),
      setVehicle: jest.fn(),
      handleChangeSpot: jest.fn(),
      setPlaceSpotNumber: jest.fn(),
      ...rest
    })
  }
}))

describe('PlaceSpot UI', () => {
  it('renders spot number input', () => {
    const { getByText } = renderWithProviders(
      <PlaceSpot cart={mockCart} isCheckout isInputMode />
    )
    expect(getByText('Spot number')).toBeTruthy()
    expect(getByText('Update')).toBeTruthy()
  })
})

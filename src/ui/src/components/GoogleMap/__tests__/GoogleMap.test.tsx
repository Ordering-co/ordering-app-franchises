import { GoogleMap } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))
jest.mock('react-native-fast-image', () => require('../../../../../../jest/helpers/fastImageMock'))
jest.mock('react-native-geocoding', () => ({ init: jest.fn(), from: jest.fn() }))
jest.mock('react-native-maps', () => {
  const React = require('react')
  const { View } = require('react-native')
  const MapView = ({ children }) => React.createElement(View, { testID: 'map-view' }, children)
  MapView.Marker = ({ children }) => React.createElement(View, { testID: 'map-marker' }, children)
  MapView.Polygon = () => null
  MapView.Circle = () => null
  return {
    __esModule: true,
    default: MapView,
    Marker: MapView.Marker,
    Polygon: MapView.Polygon,
    Circle: MapView.Circle,
    PROVIDER_GOOGLE: 'google'
  }
})

describe('GoogleMap UI', () => {
  it('renders map for a valid location', () => {
    const { getByTestId } = renderWithProviders(
      <GoogleMap
        readOnly
        location={{ lat: 40.7, lng: -74 }}
        markerTitle='Test Marker'
        isIntGeoCoder
      />
    )
    expect(getByTestId('map-view')).toBeTruthy()
  })
})

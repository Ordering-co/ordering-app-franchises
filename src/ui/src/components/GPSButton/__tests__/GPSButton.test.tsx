import { GPSButton } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('react-native-geocoding', () => ({ init: jest.fn(), from: jest.fn() }))
jest.mock('@react-native-community/geolocation', () => ({
  getCurrentPosition: jest.fn()
}))
jest.mock('react-native-paper', () => ({
  ActivityIndicator: () => null
}))

describe('GPSButton UI', () => {
  it('renders GPS label', () => {
    const { getByText } = renderWithProviders(
      <GPSButton apiKey='test-key' handleGPS={jest.fn()} isIntGeoCoder />
    )
    expect(getByText('GPS')).toBeTruthy()
  })
})

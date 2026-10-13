import { AllowCurrentLocation } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))
jest.mock('react-native-geocoding', () => ({ init: jest.fn(), from: jest.fn() }))
jest.mock('@react-native-community/geolocation', () => ({
  getCurrentPosition: jest.fn()
}))
jest.mock('../functions', () => ({
  AllowCurrentLocationController: ({ UIComponent, ...rest }) => {
    const React = require('react')
    return React.createElement(UIComponent, {
      addresses: [],
      onClose: jest.fn(),
      saveAddress: jest.fn(),
      setIsCanceledGeolocation: jest.fn(),
      ...rest
    })
  }
}))

describe('AllowCurrentLocation UI', () => {
  it('renders allow action', () => {
    const { getByText } = renderWithProviders(
      <AllowCurrentLocation onClose={jest.fn()} />
    )
    expect(getByText('Allow')).toBeTruthy()
  })
})

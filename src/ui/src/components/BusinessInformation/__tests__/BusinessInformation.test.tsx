import { BusinessInformation } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import { mockBusiness } from '../../../../../../jest/helpers/appM3TestUtils'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))
jest.mock('react-native-webview', () => 'WebView')
jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  BusinessInformation: ({ UIComponent, ...rest }) => {
    const React = require('react')
    return React.createElement(UIComponent, {
      businessState: { business: require('../../../../../../jest/helpers/appM3TestUtils').mockBusiness },
      businessSchedule: [[{ day: 'Mon', lapses: [] }]],
      businessLocation: { location: { lat: 40.7, lng: -74 } },
      ...rest
    })
  }
}))

describe('BusinessInformation UI', () => {
  it('renders opening time heading', () => {
    const { getByText } = renderWithProviders(
      <BusinessInformation showBusinessName />
    )
    expect(getByText('Opening Time')).toBeTruthy()
  })
})

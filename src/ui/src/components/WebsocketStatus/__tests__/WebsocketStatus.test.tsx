import { WebsocketStatus } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import { baseWebsocketStatusUIProps } from '../../../../../../jest/helpers/appM2TestUtils'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'MaterialIcon')
jest.mock('react-native-restart', () => ({ Restart: jest.fn() }))

jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  useUtils: jest.fn(() => [{ parseDate: (value) => value }, {}]),
  WebsocketStatus: ({ UIComponent, ...rest }) => {
    const React = require('react')
    return React.createElement(UIComponent, {
      ...require('../../../../../../jest/helpers/appM2TestUtils').baseWebsocketStatusUIProps,
      ...rest
    })
  }
}))

describe('WebsocketStatus UI', () => {
  it('renders connected websocket status', () => {
    const { getByText } = renderWithProviders(<WebsocketStatus />)
    expect(getByText('Status')).toBeTruthy()
  })
})

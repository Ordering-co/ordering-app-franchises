import { NotificationsList } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import { baseNotificationsUIProps } from '../../../../../../jest/helpers/appM2TestUtils'

jest.mock('toggle-switch-react-native', () => 'ToggleSwitch')
jest.mock('react-native-loading-spinner-overlay', () => 'Spinner')

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))

jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  UserFormDetails: ({ UIComponent, ...rest }) => {
    const React = require('react')
    return React.createElement(UIComponent, {
      ...require('../../../../../../jest/helpers/appM2TestUtils').baseNotificationsUIProps,
      ...rest
    })
  }
}))

describe('Notifications UI', () => {
  it('renders notification preferences screen', () => {
    const { getByText } = renderWithProviders(<NotificationsList />)
    expect(getByText('Notifications')).toBeTruthy()
  })
})

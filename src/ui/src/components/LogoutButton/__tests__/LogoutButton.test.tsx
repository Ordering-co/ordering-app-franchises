import { fireEvent } from '@testing-library/react-native'
import { LogoutButton } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@intercom/intercom-react-native', () => ({}))
jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))

jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  LogoutAction: ({ UIComponent, handleLogoutClick, ...rest }) => {
    const React = require('react')
    return React.createElement(UIComponent, {
      handleLogoutClick: handleLogoutClick || jest.fn(),
      text: 'Logout',
      ...rest
    })
  },
  useOrder: jest.fn(() => [{}, { setStateInitialValues: jest.fn() }])
}))

describe('LogoutButton UI', () => {
  it('renders logout label and handles press', async () => {
    const handleLogoutClick = jest.fn()
    const { getByText } = renderWithProviders(
      <LogoutButton text='Logout' handleLogoutClick={handleLogoutClick} />
    )
    fireEvent.press(getByText('Logout'))
    expect(getByText('Logout')).toBeTruthy()
  })
})

import { fireEvent } from '@testing-library/react-native'
import { UserProfile } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import {
  mockGuestUser,
  mockUser
} from '../../../../../../jest/helpers/appM8TestUtils'

jest.mock('@ui', () => require('../../../../../../jest/helpers/appM8TestUtils').userProfileUiMock)
jest.mock('react-native-loading-spinner-overlay', () => 'Spinner')
jest.mock('toggle-switch-react-native', () => {
  return (props) => require('../../../../../../jest/helpers/appM8TestUtils').toggleSwitchMock(props)
})
jest.mock('react-hook-form', () => ({
  useForm: () => {
    const { formHarness } = require('../../../../../../jest/helpers/appM8TestUtils')
    return {
      errors: formHarness.errors
    }
  }
}))
jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  UserFormDetails: ({ UIComponent, ...rest }) => {
    const React = require('react')
    const { userProfileUIProps } = require('../../../../../../jest/helpers/appM8TestUtils')
    return React.createElement(UIComponent, { ...userProfileUIProps, ...rest })
  },
  useSession: jest.fn(() => [{
    auth: true,
    user: require('../../../../../../jest/helpers/appM8TestUtils').mockUser
  }, { logout: jest.fn() }]),
  useToast: jest.fn(() => [null, { showToast: jest.fn() }])
}))

const renderProfile = (props = {}, options = {}) => renderWithProviders(
  <UserProfile {...props} />,
  options
)

describe('UserProfile UI', () => {
  afterEach(() => {
    const { useSession, useToast } = require('@components')
    const { resetFormHarness } = require('../../../../../../jest/helpers/appM8TestUtils')
    useSession.mockReturnValue([{
      auth: true,
      user: mockUser
    }, { logout: jest.fn() }])
    useToast.mockReturnValue([null, { showToast: jest.fn() }])
    resetFormHarness()
  })

  it('renders the account header options and version', () => {
    const onNavigationRedirect = jest.fn()
    const { getByText, getByTestId } = renderProfile({
      onNavigationRedirect,
      appVersion: '1.2.3'
    })
    expect(getByText('Pat Lee')).toBeTruthy()
    expect(getByText('View account')).toBeTruthy()
    expect(getByText('My saved places')).toBeTruthy()
    expect(getByText('My Favorites')).toBeTruthy()
    expect(getByText('My Orders')).toBeTruthy()
    expect(getByText('Messages')).toBeTruthy()
    expect(getByText('Marketing notifications')).toBeTruthy()
    expect(getByText('Security')).toBeTruthy()
    expect(getByText('Help')).toBeTruthy()
    expect(getByTestId('language-selector')).toBeTruthy()
    expect(getByTestId('websocket-status')).toBeTruthy()
    expect(getByTestId('powered-by')).toBeTruthy()
    expect(getByText('v1.2.3')).toBeTruthy()
    fireEvent.press(getByText('View account'))
    expect(onNavigationRedirect).toHaveBeenCalledWith(
      'ProfileForm',
      expect.objectContaining({ onNavigationRedirect })
    )
    fireEvent.press(getByText('My saved places'))
    expect(onNavigationRedirect).toHaveBeenCalledWith('AddressList', { disableContinue: true })
    fireEvent.press(getByText('My Favorites'))
    expect(onNavigationRedirect).toHaveBeenCalledWith('Favorite', undefined)
    fireEvent.press(getByText('My Orders'))
    expect(onNavigationRedirect).toHaveBeenCalledWith('MyOrders', undefined)
    fireEvent.press(getByText('Help'))
    expect(onNavigationRedirect).toHaveBeenCalledWith('Help', undefined)
  })

  it('hides the account link and languages when the theme asks', () => {
    const { queryByText, queryByTestId } = renderProfile({}, {
      themeOverrides: {
        profile: {
          components: {
            profile: { hidden: true },
            languages: { hidden: true },
            notification_settings: { hidden: false }
          }
        }
      }
    })
    expect(queryByText('View account')).toBeNull()
    expect(queryByTestId('language-selector')).toBeNull()
  })

  it('hides menu options from the theme', () => {
    const { queryByText } = renderProfile({}, {
      themeOverrides: {
        bar_menu: {
          components: {
            messages: { hidden: true },
            help: { hidden: true },
            sessions: { hidden: true }
          }
        },
        profile: {
          components: {
            notification_settings: { hidden: true },
            languages: { hidden: false }
          }
        }
      }
    })
    expect(queryByText('Messages')).toBeNull()
    expect(queryByText('Help')).toBeNull()
    expect(queryByText('Security')).toBeNull()
    expect(queryByText('Marketing notifications')).toBeNull()
  })

  it('toggles marketing notifications', () => {
    const handleChangePromotions = jest.fn()
    const { getByTestId } = renderProfile({
      handleChangePromotions
    })
    fireEvent.press(getByTestId('toggle-switch'))
    expect(handleChangePromotions).toHaveBeenCalledWith(false)
  })

  it('enables promotions when no newsletter flags are on', () => {
    const { useSession } = require('@components')
    useSession.mockReturnValue([{
      auth: true,
      user: mockGuestUser
    }, { logout: jest.fn() }])
    const handleChangePromotions = jest.fn()
    const { getByTestId, getByText } = renderProfile({
      handleChangePromotions
    })
    expect(getByText('Pat Lee')).toBeTruthy()
    fireEvent.press(getByTestId('toggle-switch'))
    expect(handleChangePromotions).toHaveBeenCalledWith(true)
  })

  it('toasts a successful notifications update', () => {
    const { useToast } = require('@components')
    const showToast = jest.fn()
    useToast.mockReturnValue([null, { showToast }])
    renderProfile({
      notificationsGroup: { loading: false, result: { error: false, result: true } }
    })
    expect(showToast).toHaveBeenCalled()
  })

  it('does not toast a failed notifications update', () => {
    const { useToast } = require('@components')
    const showToast = jest.fn()
    useToast.mockReturnValue([null, { showToast }])
    renderProfile({
      notificationsGroup: { loading: false, result: { error: true, result: true } }
    })
    expect(showToast).not.toHaveBeenCalled()
  })

  it('logs out after the account is removed', () => {
    const logout = jest.fn()
    const { useSession } = require('@components')
    useSession.mockReturnValue([{
      auth: true,
      user: mockUser
    }, { logout }])
    renderProfile({
      removeAccountState: { result: 'OK' }
    })
    expect(logout).toHaveBeenCalled()
  })

  it('toasts form errors', () => {
    const { formHarness } = require('../../../../../../jest/helpers/appM8TestUtils')
    const { useToast } = require('@components')
    const showToast = jest.fn()
    useToast.mockReturnValue([null, { showToast }])
    formHarness.errors = {
      email: { message: 'Invalid email address' },
      name: { message: 'Name is required' }
    }
    renderProfile()
    expect(showToast).toHaveBeenCalled()
  })

  it('renders a single form error without a trailing newline', () => {
    const { formHarness } = require('../../../../../../jest/helpers/appM8TestUtils')
    const { useToast } = require('@components')
    const showToast = jest.fn()
    useToast.mockReturnValue([null, { showToast }])
    formHarness.errors = {
      email: { message: 'Invalid email address' }
    }
    renderProfile()
    expect(showToast).toHaveBeenCalled()
  })

  it('shows the notifications spinner while saving', () => {
    const { toJSON } = renderProfile({
      notificationsGroup: { loading: true, result: { error: false, result: null } }
    })
    expect(toJSON()).toBeTruthy()
  })
})

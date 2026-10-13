import { act, fireEvent } from '@testing-library/react-native'
import Intercom from '@intercom/intercom-react-native'
import { useApi, useSession } from '@components'
import { _setStoreData } from '@ui'

import Login from '../Login'
import { renderPage } from '../../../jest/helpers/renderPage'
import { setupPageTestEnv } from '../../../jest/helpers/pageTestSetup'

jest.mock('@ui', () => require('../../../jest/helpers/mockUi'))

describe('Login page', () => {
  beforeEach(() => {
    setupPageTestEnv()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders login form with navbar title', () => {
    const { getByTestId } = renderPage(Login, {
      pageProps: { titleNavbar: 'Log in' }
    })
    expect(getByTestId('navbar-title').props.children).toBe('Log in')
    expect(getByTestId('login-form')).toBeTruthy()
  })

  it('stores notification state on mount', () => {
    renderPage(Login, {
      route: { params: { notification_state: 'pending' } },
      pageProps: { notificationState: 'pending' }
    })
    expect(_setStoreData).toHaveBeenCalledWith('notification_state', 'pending')
  })

  it('navigates home after successful login with default address', async () => {
    const { getByTestId, navigation } = renderPage(Login)
    await act(async () => {
      fireEvent.press(getByTestId('login-success-home'))
    })
    expect(Intercom.registerIdentifiedUser).toHaveBeenCalled()
    expect(navigation.navigate).toHaveBeenCalledWith('BottomTab', { screen: 'Home' })
  })

  it('navigates to address list when user has no default address', async () => {
    const { getByTestId, navigation } = renderPage(Login)
    await act(async () => {
      fireEvent.press(getByTestId('login-success-address'))
    })
    expect(navigation.navigate).toHaveBeenCalledWith('AddressList')
  })

  it('does not force AddressList when auth payload has no addresses array', async () => {
    const { getByTestId, navigation } = renderPage(Login)
    await act(async () => {
      fireEvent.press(getByTestId('login-success-missing-addresses'))
    })
    expect(navigation.navigate).toHaveBeenCalledWith('BottomTab', { screen: 'Home' })
    expect(navigation.navigate).not.toHaveBeenCalledWith('AddressList')
  })

  it('navigates home when fetched addresses include a default', async () => {
    useApi.mockReturnValue([{
      setAccessToken: () => ({
        users: () => ({
          addresses: () => ({
            get: async () => ({ content: { error: false, result: [{ default: true }] } })
          })
        })
      })
    }, {}])
    const { getByTestId, navigation } = renderPage(Login)
    await act(async () => {
      fireEvent.press(getByTestId('login-success-missing-addresses'))
    })
    expect(navigation.navigate).toHaveBeenCalledWith('BottomTab', { screen: 'Home' })
  })

  it('opens AddressList when fetched addresses have no default', async () => {
    useApi.mockReturnValue([{
      setAccessToken: () => ({
        users: () => ({
          addresses: () => ({
            get: async () => ({ content: { error: false, result: [] } })
          })
        })
      })
    }, {}])
    const { getByTestId, navigation } = renderPage(Login)
    await act(async () => {
      fireEvent.press(getByTestId('login-success-missing-addresses'))
    })
    expect(navigation.navigate).toHaveBeenCalledWith('AddressList')
  })

  it('calls handleGuestUser instead of navigating when provided', async () => {
    const handleGuestUser = jest.fn()
    const { getByTestId, navigation } = renderPage(Login, {
      pageProps: { handleGuestUser }
    })
    await act(async () => {
      fireEvent.press(getByTestId('login-guest-handler'))
    })
    expect(handleGuestUser).toHaveBeenCalled()
    expect(navigation.navigate).not.toHaveBeenCalled()
  })

  it('redirects through onNavigationRedirect', () => {
    const { getByTestId, navigation } = renderPage(Login)
    fireEvent.press(getByTestId('login-redirect'))
    expect(navigation.navigate).toHaveBeenCalledWith('Signup', undefined)
  })
})

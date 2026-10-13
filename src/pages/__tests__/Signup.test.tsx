import { act, fireEvent } from '@testing-library/react-native'
import Intercom from '@intercom/intercom-react-native'
import { useApi, useConfig, useSession } from '@components'
import { _removeStoreData, _setStoreData } from '@ui'

import Signup from '../Signup'
import { renderPage } from '../../../jest/helpers/renderPage'
import { setupPageTestEnv } from '../../../jest/helpers/pageTestSetup'

jest.mock('@ui', () => require('../../../jest/helpers/mockUi'))

describe('Signup page', () => {
  beforeEach(() => {
    setupPageTestEnv()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders signup form and stores notification state', () => {
    const { getByTestId } = renderPage(Signup, {
      route: { params: { notification_state: 'x' } }
    })
    expect(getByTestId('signup-form')).toBeTruthy()
    expect(_setStoreData).toHaveBeenCalledWith('notification_state', 'x')
  })

  it('logs in and navigates home after signup', async () => {
    const login = jest.fn()
    useSession.mockReturnValue([{}, { login }])
    const { getByTestId, navigation } = renderPage(Signup)
    await act(async () => {
      fireEvent.press(getByTestId('signup-success-home'))
    })
    expect(_removeStoreData).toHaveBeenCalledWith('isGuestUser')
    expect(login).toHaveBeenCalled()
    expect(Intercom.registerIdentifiedUser).toHaveBeenCalled()
    expect(navigation.navigate).toHaveBeenCalledWith('BottomTab', { screen: 'Home' })
  })

  it('does not force AddressList when signup user has no addresses array', async () => {
    const { getByTestId, navigation } = renderPage(Signup)
    await act(async () => {
      fireEvent.press(getByTestId('signup-success-missing-addresses'))
    })
    expect(navigation.navigate).toHaveBeenCalledWith('BottomTab', { screen: 'Home' })
    expect(navigation.navigate).not.toHaveBeenCalledWith('AddressList')
  })

  it('opens AddressList when signup user has an empty addresses array', async () => {
    const { getByTestId, navigation } = renderPage(Signup)
    await act(async () => {
      fireEvent.press(getByTestId('signup-success-empty-addresses'))
    })
    expect(navigation.navigate).toHaveBeenCalledWith('AddressList')
  })

  it('opens AddressList when fetched signup addresses have no default', async () => {
    useApi.mockReturnValue([{
      setAccessToken: () => ({
        users: () => ({
          addresses: () => ({
            get: async () => ({ content: { error: false, result: [] } })
          })
        })
      })
    }, {}])
    const { getByTestId, navigation } = renderPage(Signup)
    await act(async () => {
      fireEvent.press(getByTestId('signup-success-missing-addresses'))
    })
    expect(navigation.navigate).toHaveBeenCalledWith('AddressList')
  })

  it('skips navigation when verification is required', async () => {
    useConfig.mockReturnValue([{
      configs: {
        verification_email_required: { value: '1' },
        verification_phone_required: { value: '0' }
      }
    }])
    const { getByTestId, navigation } = renderPage(Signup)
    await act(async () => {
      fireEvent.press(getByTestId('signup-success-verify'))
    })
    expect(navigation.navigate).not.toHaveBeenCalled()
  })

  it('calls handleGuestUser instead of navigating when provided', async () => {
    const handleGuestUser = jest.fn()
    const { getByTestId, navigation } = renderPage(Signup, {
      pageProps: { handleGuestUser }
    })
    await act(async () => {
      fireEvent.press(getByTestId('signup-guest-handler'))
    })
    expect(handleGuestUser).toHaveBeenCalled()
    expect(navigation.navigate).not.toHaveBeenCalled()
  })
})

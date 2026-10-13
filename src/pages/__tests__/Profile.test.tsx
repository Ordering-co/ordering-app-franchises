import { fireEvent } from '@testing-library/react-native'
import { Vibration } from 'react-native'
import Intercom from '@intercom/intercom-react-native'

import Profile from '../Profile'
import { renderPage } from '../../../jest/helpers/renderPage'
import { setupPageTestEnv } from '../../../jest/helpers/pageTestSetup'

jest.mock('@ui', () => require('../../../jest/helpers/mockUi'))

jest.mock('@intercom/intercom-react-native', () => ({
  displayMessenger: jest.fn(),
  hideIntercom: jest.fn()
}))

describe('Profile page', () => {
  beforeEach(() => {
    setupPageTestEnv({
      session: [{ auth: true, user: { id: 1 } }, { login: jest.fn() }],
      config: [{ configs: { intercom_enabled: { value: '1' } } }]
    })
    jest.spyOn(Vibration, 'vibrate').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders profile controller when authenticated', () => {
    const { getByTestId } = renderPage(Profile)
    expect(getByTestId('user-profile-controller')).toBeTruthy()
    expect(getByTestId('profile-app-version').props.children).toBeTruthy()
  })

  it('redirects unauthenticated users to login', () => {
    setupPageTestEnv({ session: [{ auth: false, user: null }, { login: jest.fn() }] })
    const { navigation } = renderPage(Profile, { pageProps: { notificationState: { id: 1 } } })
    expect(navigation.navigate).toHaveBeenCalledWith('Login', { notificationState: { id: 1 } })
  })

  it('opens intercom chat when enabled', () => {
    const { UNSAFE_getAllByType } = renderPage(Profile)
    const { TouchableOpacity } = require('react-native')
    const buttons = UNSAFE_getAllByType(TouchableOpacity)
    fireEvent.press(buttons[buttons.length - 1])
    expect(Vibration.vibrate).toHaveBeenCalledWith(50)
    expect(Intercom.displayMessenger).toHaveBeenCalled()
  })

  it('navigates from profile controller', () => {
    const { getByTestId, navigation } = renderPage(Profile)
    fireEvent.press(getByTestId('profile-nav'))
    expect(navigation.navigate).toHaveBeenCalledWith('ProfileForm', { field: 'name' })
  })
})

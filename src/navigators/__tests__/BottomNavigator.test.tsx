import React from 'react'
import { renderWithProviders } from '../../../jest/helpers/renderWithProviders'
import { useConfig, useSession } from '@components'

jest.mock('@react-navigation/bottom-tabs', () => {
  const ReactNative = require('react-native')
  const RN = require('react')
  return {
    createBottomTabNavigator: () => ({
      Navigator: ({ children, initialRouteName }) => (
        <ReactNative.View testID='tab-navigator' accessibilityLabel={initialRouteName}>
          {children}
        </ReactNative.View>
      ),
      Screen: ({ name, children, component: Comp, options }) => {
        const Resolved = Comp?.default || Comp
        return (
          <ReactNative.View testID={`tab-${name}`}>
            <ReactNative.Text>{options?.tabBarLabel || name}</ReactNative.Text>
            {typeof children === 'function' ? children() : Resolved ? <Resolved /> : null}
            {typeof options?.tabBarIcon === 'function' ? options.tabBarIcon({ focused: true }) : null}
          </ReactNative.View>
        )
      }
    })
  }
})

jest.mock('../../pages/Profile', () => {
  const { Text } = require('react-native')
  return () => <Text>ProfilePage</Text>
})
jest.mock('../../pages/Login', () => {
  const { Text } = require('react-native')
  return () => <Text>LoginPage</Text>
})
jest.mock('../../pages/Signup', () => {
  const { Text } = require('react-native')
  return () => <Text>SignupPage</Text>
})
jest.mock('../../pages/ForgotPassword', () => {
  const { Text } = require('react-native')
  return () => <Text>ForgotPage</Text>
})
jest.mock('../../pages/Home', () => {
  const { Text } = require('react-native')
  return () => <Text>HomePage</Text>
})
jest.mock('../../pages/Rewards', () => {
  const { Text } = require('react-native')
  return () => <Text>RewardsPage</Text>
})
jest.mock('../../pages/BusinessProductsList', () => {
  const { Text } = require('react-native')
  return () => <Text>BusinessPage</Text>
})

jest.mock('@ui', () => ({
  OIcon: () => null,
  ACCOUNT_VALUES: { ACCOUNT: 'account', LOGIN: 'login', SIGNUP: 'signup', FORGOT: 'forgot' }
}))

import BottomNavigator from '../BottomNavigator'

describe('BottomNavigator', () => {
  beforeEach(() => {
    ;(useSession as jest.Mock).mockReturnValue([{ auth: false, user: null }])
    ;(useConfig as jest.Mock).mockReturnValue([{ configs: {} }])
  })

  it('renders home, rewards, order, and account tabs for guests', () => {
    const { getByTestId, getByText, getAllByText } = renderWithProviders(
      <BottomNavigator route={{ params: {} }} />
    )
    expect(getByTestId('tab-navigator')).toBeTruthy()
    expect(getByText('Home')).toBeTruthy()
    expect(getByText('Rewards')).toBeTruthy()
    expect(getByText('Order')).toBeTruthy()
    expect(getByText('Account')).toBeTruthy()
    expect(getByText('HomePage')).toBeTruthy()
    expect(getAllByText('LoginPage').length).toBeGreaterThan(0)
  })

  it('hides rewards when the config disables them', () => {
    ;(useConfig as jest.Mock).mockReturnValue([{ configs: { disabled_rewards: { value: '1' } } }])
    const { queryByTestId, getByTestId } = renderWithProviders(
      <BottomNavigator route={{ params: {} }} />
    )
    expect(getByTestId('tab-Home')).toBeTruthy()
    expect(queryByTestId('tab-Rewards')).toBeNull()
  })

  it('shows the profile page when the user is authenticated', () => {
    ;(useSession as jest.Mock).mockReturnValue([{ auth: true, user: { id: 1 } }])
    const { getByText, queryByText } = renderWithProviders(
      <BottomNavigator route={{ params: {} }} />
    )
    expect(getByText('ProfilePage')).toBeTruthy()
    expect(queryByText('LoginPage')).toBeNull()
  })
})

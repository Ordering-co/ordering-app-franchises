import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, Vibration, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'styled-components/native';

import Profile from '../pages/Profile';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Forgot from '../pages/ForgotPassword';
import Home from '../pages/Home';
import Rewards from '../pages/Rewards';
import BusinessProductsList from '../pages/BusinessProductsList';

import { useLanguage, useSession, useConfig } from '@components';
import { OIcon, ACCOUNT_VALUES } from '@ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();

/** When WindowInsets report 0 on Android, reserve space for typical 3-button system nav (~40dp). */
const ANDROID_BOTTOM_INSET_FALLBACK = 40
const TAB_BAR_BASE_HEIGHT = 60

const BottomNavigator = (props: any) => {
  const theme = useTheme()
  const insets = useSafeAreaInsets()
  const bottomInset =
    Platform.OS === 'android' && !insets.bottom
      ? ANDROID_BOTTOM_INSET_FALLBACK
      : insets.bottom

  const [, t] = useLanguage()
  const [{ auth, user }] = useSession()
  const [{ configs }] = useConfig()


  const [accountState, setAccountState] = useState(auth ? ACCOUNT_VALUES.ACCOUNT : ACCOUNT_VALUES.LOGIN)
  const isDisabledRewards = configs?.disabled_rewards?.value === '1'

  const styles = StyleSheet.create({
    iconStyle: {
      width: 23,
      height: 23,
      justifyContent: 'flex-start',
      alignItems: 'center'
    },
    barStyle: {
      backgroundColor: theme.colors.backgroundPage,
      height: TAB_BAR_BASE_HEIGHT + bottomInset,
      paddingBottom: bottomInset,
    }
  })

  useEffect(() => {
    if (!auth) setAccountState(ACCOUNT_VALUES.LOGIN)
  }, [auth])

  const propsToPass = {
    ...props,
    setAccountState,
    notification_state: props?.route?.params?.notification_state
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.backgroundPage }}>
      <Tab.Navigator
        initialRouteName={"Home"}
        screenOptions={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarActiveTintColor: theme.colors.black,
          tabBarInactiveTintColor: theme.colors.secondaryLightGray,
          tabBarLabelStyle: { fontSize: theme.utils.tsize.s },
          tabBarStyle: styles.barStyle
        }}
      >
        <Tab.Screen
          name="Home"
          children={() => <Home {...propsToPass} />}
          listeners={{ tabPress: () => Vibration.vibrate(30) }}
          options={{
            tabBarLabel: t('HOME', 'Home'),
            tabBarIcon: ({ focused }: any) => (
              <View style={styles.iconStyle}>
                <OIcon
                  src={theme.images.general.tag_home}
                  color={focused ? theme.colors.primary : theme.colors.secondaryLightGray}
                  style={{ opacity: focused ? 1 : 0.6 }}
                />
              </View>
            )
          }}
        />
        {!isDisabledRewards && (
          <Tab.Screen
            name="Rewards"
            children={() => (
              (accountState === ACCOUNT_VALUES.ACCOUNT || auth) && !user?.guest_id
                ? <Rewards {...propsToPass} />
                : (accountState === ACCOUNT_VALUES.LOGIN) || (accountState === ACCOUNT_VALUES.ACCOUNT && user?.guest_id)
                  ? <Login {...propsToPass} />
                  : accountState === ACCOUNT_VALUES.SIGNUP
                    ? <Signup {...propsToPass} />
                    : <Forgot {...propsToPass} />
            )}
            listeners={{ tabPress: () => Vibration.vibrate(30) }}
            options={{
              tabBarLabel: t('REWARDS', 'Rewards'),
              tabBarIcon: ({ focused }: any) => (
                <View style={styles.iconStyle}>
                  <OIcon
                    src={theme.images.tabs.rewards}
                    color={focused ? theme.colors.primary : theme.colors.secondaryLightGray}
                    style={{ opacity: focused ? 1 : 0.6 }}
                  />
                </View>
              ),
            }}
          />
        )}
        <Tab.Screen
          name="Business"
          component={BusinessProductsList}
          listeners={{ tabPress: () => Vibration.vibrate(30) }}
          options={{
            tabBarLabel: t('ORDER', 'Order'),
            tabBarIcon: ({ focused }: any) => (
              <View style={styles.iconStyle}>
                <OIcon
                  src={theme.images.tabs.my_carts}
                  color={focused ? theme.colors.primary : theme.colors.secondaryLightGray}
                  style={{ opacity: focused ? 1 : 0.6 }}
                />
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          children={() => (
            (accountState === ACCOUNT_VALUES.ACCOUNT || auth) && !user?.guest_id
              ? <Profile {...propsToPass} />
              : (accountState === ACCOUNT_VALUES.LOGIN) || (accountState === ACCOUNT_VALUES.ACCOUNT && user?.guest_id)
                ? <Login {...propsToPass} />
                : accountState === ACCOUNT_VALUES.SIGNUP
                  ? <Signup {...propsToPass} />
                  : <Forgot {...propsToPass} />
          )}
          listeners={{ tabPress: () => Vibration.vibrate(30) }}
          options={{
            tabBarLabel: t('ACCOUNT', 'Account'),
            tabBarIcon: ({ focused }: any) => (
              <View style={styles.iconStyle}>
                <OIcon
                  src={theme.images.tabs.profile}
                  color={focused ? theme.colors.primary : theme.colors.secondaryLightGray}
                  style={{ opacity: focused ? 1 : 0.6 }}
                />
              </View>
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

export default BottomNavigator;

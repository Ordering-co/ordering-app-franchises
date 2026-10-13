import React, { useState, useEffect, useRef } from 'react';
import { shouldPromptForPushNotifications, shouldSetupOneSignal } from './oneSignalSetup';
import { isFirebasePushEnabled, shouldSetupFirebasePush } from './firebasePushSetup';
import { getPushOpenNotificationPlan } from './getPushOpenNotificationPlan';
import { subscribeUpdateOrderVibration } from './subscribeUpdateOrderVibration';
import { getMyAccountDeepLinkNavigateArgs } from './getHomeDeepLinkPlan';
import { AppState, Alert as NativeAlert, BackHandler, Linking, DeviceEventEmitter, Platform, Alert } from 'react-native';
import { PERMISSIONS, RESULTS, request, requestNotifications } from 'react-native-permissions';
import {
  getMessaging,
  getToken,
  getInitialNotification,
  onNotificationOpenedApp,
  onMessage,
  onTokenRefresh
} from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import VersionCheck from 'react-native-version-check'
import { createStackNavigator } from '@react-navigation/stack';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import OneSignal from 'react-native-onesignal';
import NetInfo from '@react-native-community/netinfo'

import { useOrder, useSession, useConfig, useApi, useWebsocket, useLanguage } from '@components';
import * as RootNavigation from '../navigators/NavigationRef';
import settings from '../config.js';

dayjs.extend(isSameOrAfter);
dayjs.extend(utc);

import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Forgot from '../pages/ForgotPassword';
import Home from '../pages/Home';
import IntroductoryTutorial from '../pages/IntroductoryTutorial';
import Splash from '../pages/Splash';
import NotFound from '../pages/NotFound';
import HomeNavigator from './HomeNavigator';
import NetworkError from '../pages/NetworkError';
import UserVerification from '../pages/UserVerification';
import ProjectForm from '../pages/ProjectForm'

import { _retrieveStoreData, _setStoreData, orderTypeList, useBusinessSelected } from '@ui';

const permissionIosAlertReminder = false;

const Stack = createStackNavigator();
const RootNavigator = () => {
  const [{ auth, user, loading: sessionLoading, token }] = useSession();
  const [orderStatus, { changeMoment, setStateInitialValues }] = useOrder();
  const [ordering] = useApi()
  const socket = useWebsocket()
  const [{ configs, loading: configsLoading }] = useConfig();
  const [, t] = useLanguage()
  const [businessSelected, { onChangeBusinessSelected }] = useBusinessSelected()
  const [loaded, setLoaded] = useState(false);
  const [productLogin, setProductLogin] = useState<any>({});
  const [orderIdParam, setOrderIdParam] = useState(null)
  const [cartUuidParam, setCartUuidParam] = useState(null)
  const [storeParam, setStoreParam] = useState(null)
  const [productParam, setProductParam] = useState<any>(null)
  const [generalProjectState, setGeneralProjectState] = useState<{ changed: boolean, setted: boolean }>({ changed: false, setted: false })

  const [oneSignalState, setOneSignalState] = useState<any>({
    notification_app: settings.notification_app,
  });
  const [isTutorial, setTutorial] = useState(settings.show_tutorials);
  const [isPushLoading, setIsPushLoading] = useState({ loading: true });
  const [connectionState, setConnectionState] = useState<{
    connection_status: boolean;
  } | null>(null);
  const [appState, setAppState] = useState(AppState.currentState)
  const [permissionsState, setPermissionsState] = useState({
    isGranted: false,
    isDenied: false,
    isLoading: false,
    error: null,
  });
  const subscriptionObserverAddedRef = useRef(false);
  const firebaseUnsubscribersRef = useRef<Array<() => void>>([]);
  const [pendingNotification, setPendingNotification] = useState<any>(null);

  const firebaseEnabled = isFirebasePushEnabled(configs)

  const isEmailVerifyRequired = auth && configs?.verification_email_required?.value === '1' && !user?.email_verified
  const isPhoneVerifyRequired = auth && configs?.verification_phone_required?.value === '1' && !user?.phone_verified
  const isUserVerifyRequired = isEmailVerifyRequired || isPhoneVerifyRequired
  const isEnableAppVersionCheck = configs?.app_version?.value === '1'
  const guestCheckoutEnabled =
    configs?.guest_checkout_enabled?.value === '1' &&
    (!orderTypeList[orderStatus?.options?.type - 1] || configs?.allowed_order_types_guest_checkout?.value?.includes(orderTypeList[orderStatus?.options?.type - 1])) &&
    user?.guest_id

  const validDate = (date: any) => {
    if (!date) {
      return;
    }
    const _date = dayjs(date, 'YYYY-MM-DD HH:mm').isSameOrAfter(dayjs(), 'day')
      ? dayjs(date).format('YYYY-MM-DD HH:mm')
      : dayjs().format('YYYY-MM-DD HH:mm');
    return _date;
  };

  const firebasePushSetup = async () => {
    setIsPushLoading({ loading: true });
    const messaging = getMessaging()

    requestNotifications(['alert', 'sound', 'badge']).catch((error) => {
      console.log('Firebase push permission error:', error)
    })

    let fcmToken: string | null = null
    try {
      fcmToken = await getToken(messaging)
    } catch (error) {
      console.log('Firebase push token error:', error)
    }

    const nextState = {
      ...oneSignalState,
      notification_token: fcmToken,
      notification_provider: 'fcm'
    }
    setOneSignalState(nextState);

    if (fcmToken) {
      _setStoreData('notification_state', nextState);
    }

    if (Platform.OS === 'android') {
      try {
        await notifee.createChannel({
          id: 'orders',
          name: 'Notifications',
          importance: AndroidImportance.HIGH,
          sound: 'default'
        })
      } catch (error) {
        console.log('Firebase push channel error:', error)
      }
    }

    firebaseUnsubscribersRef.current.forEach(unsubscribe => {
      try {
        unsubscribe()
      } catch (error) {
        console.log('Firebase push unsubscribe error:', error)
      }
    })
    firebaseUnsubscribersRef.current = [
      onNotificationOpenedApp(messaging, (remoteMessage: any) => {
        setPendingNotification(remoteMessage)
      }),
      onMessage(messaging, async (remoteMessage: any) => {
        if (Platform.OS !== 'android' || !remoteMessage?.notification) {
          return
        }
        try {
          await notifee.displayNotification({
            title: remoteMessage.notification.title,
            body: remoteMessage.notification.body,
            data: remoteMessage.data || {},
            android: {
              channelId: 'orders',
              smallIcon: 'ic_launcher',
              pressAction: { id: 'default' },
              sound: 'default'
            }
          })
        } catch (error) {
          console.log('Firebase foreground display error:', error)
        }
      }),
      notifee.onForegroundEvent(({ type, detail }: any) => {
        if (type === EventType.PRESS) {
          setPendingNotification({ data: detail?.notification?.data })
        }
      }),
      onTokenRefresh(messaging, (newToken: string) => {
        const refreshedState = {
          ...oneSignalState,
          notification_token: newToken,
          notification_provider: 'fcm'
        }
        setOneSignalState(refreshedState);
        _setStoreData('notification_state', refreshedState);
      })
    ]

    getInitialNotification(messaging)
      .then((remoteMessage: any) => {
        if (remoteMessage) {
          setPendingNotification(remoteMessage)
        }
      })
      .catch((error: any) => {
        console.log('Firebase initial notification error:', error)
      })

    setIsPushLoading({ loading: false });
  };

  const oneSignalSetup = async () => {
    setIsPushLoading({ loading: true });
    const data = {
      appId: configs?.onesignal_orderingapp_id?.value,
      externalId: `${ordering?.project}-${user?.id}`,
      email: user?.email,
      cellphone: user?.cellphone
        ? user?.country_phone_code
          ? `+${user?.country_phone_code} ${user?.cellphone}`
          : user?.cellphone
        : ''
    }
    OneSignal.setLogLevel(6, 0);
    OneSignal.setAppId(data.appId);

    try {
      if (data.email) {
        OneSignal.setEmail(data.email);
      }

      if (data.cellphone) {
        OneSignal.setSMSNumber(data.cellphone);
      }

      if (data.externalId) {
        OneSignal.setExternalUserId(data.externalId);
      }
    } catch (error) {
      console.log('OneSignal setup error:', error);
    }

    const deviceState: any = await OneSignal.getDeviceState();
    if (shouldPromptForPushNotifications(deviceState)) {
      OneSignal.promptForPushNotificationsWithUserResponse(response => {
        console.log('Prompt response:', response);
      });
    }

    setOneSignalState({
      ...oneSignalState,
      notification_token: deviceState?.userId,
    });

    if (deviceState?.userId) {
      _setStoreData('notification_state', {
        ...oneSignalState,
        notification_token: deviceState?.userId,
      });
    }

    OneSignal.setNotificationOpenedHandler(({ notification }: any) => {
      setPendingNotification(notification);
    });

    if (!subscriptionObserverAddedRef.current) {
      subscriptionObserverAddedRef.current = true;
      OneSignal.addSubscriptionObserver((event: any) => {
        setOneSignalState({
          ...oneSignalState,
          notification_token: event?.to?.userId,
        });
        if (!event?.to?.isSubscribed) {
          OneSignal.addTrigger('prompt_ios', 'true');
        }
      });
    }

    setIsPushLoading({ loading: false });
  };

  const permissionsSetup = async () => {
    if (Platform.OS !== 'ios' || permissionsState.isLoading) return

    try {
      setPermissionsState({ ...permissionsState, isLoading: true });
      const result = await request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);

      if (result !== RESULTS.GRANTED && permissionIosAlertReminder) {
        Alert.alert(
          t('ENABLE_TRACKING', 'Enable Tracking'),
          t('ENABLE_TRACKING_DESCRIPTION', 'To enable ad personalization, you need to allow tracking permission in your settings.'),
          [
            {
              text: t('CANCEL', 'Cancel'),
              style: 'cancel',
            },
            {
              text: t('GO_TO_SETTINGS', 'Go to Settings'),
              onPress: () => Linking.openSettings(),
            },
          ],
          { cancelable: false }
        );
      }
      setPermissionsState({
        ...permissionsState,
        isLoading: false,
        isGranted: result === RESULTS.GRANTED,
        isDenied: result !== RESULTS.GRANTED,
      })
    } catch (error: any) {
      setPermissionsState({
        ...permissionsState,
        isLoading: false,
        error,
      });
    }
  };

  useEffect(() => {
    if (!loaded && !orderStatus.loading && !isPushLoading.loading) {
      setLoaded(true);
      if (Platform.OS === 'ios') {
        permissionsSetup();
      }
    }
  }, [orderStatus, isPushLoading]);

  useEffect(() => {
    const setTutorialLocal = async () => {
      const data = await _retrieveStoreData('isTutorial');
      if (data === false) {
        setTutorial(false);
      }
    };
    setTutorialLocal();
  }, [isTutorial]);

  useEffect(() => {
    if (!sessionLoading && !isPushLoading.loading && !auth) {
      setLoaded(!auth);
    }
  }, [sessionLoading, isPushLoading]);

  useEffect(() => {
    const plan = getPushOpenNotificationPlan({
      loaded,
      auth,
      isUserVerifyRequired,
      isGuestCheckoutEnabled: guestCheckoutEnabled,
      notification: pendingNotification
    });
    if (!plan.shouldOpen || !plan.screen) {
      return;
    }
    RootNavigation.navigate(plan.screen, plan.params);
    setPendingNotification(null);
  }, [loaded, auth, pendingNotification, isUserVerifyRequired, guestCheckoutEnabled]);

  useEffect(() => {
    const _currentDate = dayjs
      .utc(validDate(orderStatus.options?.moment))
      .local();
    if (!_currentDate) {
      return;
    }
    const selected = dayjs(_currentDate, 'YYYY-MM-DD HH:mm');
    const now = dayjs();
    const secondsDiff = selected.diff(now, 'seconds');
    const checkTime = setTimeout(() => {
      changeMoment(null);
    }, secondsDiff * 1000);

    return () => {
      clearTimeout(checkTime);
    };
  }, [orderStatus.options?.moment]);

  useEffect(() => {
    const appId = firebaseEnabled ? null : configs?.onesignal_orderingapp_id?.value;
    if (shouldSetupFirebasePush({ configsLoading, enabled: firebaseEnabled, auth })) {
      firebasePushSetup();
      return;
    }
    if (shouldSetupOneSignal({ configsLoading, appId, auth })) {
      oneSignalSetup();
      return;
    }
    if (!configsLoading && (!appId || !auth)) {
      setIsPushLoading({ loading: false });
    }
  }, [configsLoading, configs?.onesignal_orderingapp_id?.value, configs?.firebase_push_enabled?.value, auth]);

  const subscribePushNotifications = async () => {
    setIsPushLoading({ loading: true });
    try {
      const url = `${ordering.root}/users/${user.id}/notification_tokens`
      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          token: oneSignalState.notification_token,
          user_id: user.id,
          app: oneSignalState.notification_app,
          ...(oneSignalState.notification_provider
            ? { provider: oneSignalState.notification_provider }
            : {})
        })
      })
      setIsPushLoading({ loading: false });
    } catch (err) {
      setIsPushLoading({ loading: false });
    }
  }

  useEffect(() => {
    if (auth && oneSignalState.notification_token) {
      subscribePushNotifications()
    }
  }, [oneSignalState.notification_token, auth]);

  let netInfoSuscription: any = null
  useEffect(() => {
    netInfoSuscription = NetInfo.addEventListener(handleConnectivityChange);

    return () => {
      netInfoSuscription && netInfoSuscription()
    }
  }, []);

  const handleConnectivityChange = (state: any) => {
    setConnectionState({ connection_status: state.isConnected });
  };

  useEffect(() => {
    if (!orderStatus.loading) {
      const getCountryCode = async () => {
        const data = await _retrieveStoreData('country-code');
        const localCountryCode = orderStatus?.options?.address?.country_code ?? data

        if (localCountryCode) {
          ordering?.setCountryCode(localCountryCode)
        }
      }

      getCountryCode()
    }
  }, [orderStatus])

  useEffect(() => {
    if (!token) return
    return subscribeUpdateOrderVibration(socket)
  }, [socket, user, token])

  useEffect(() => {
    const appStateListener: any = AppState.addEventListener(
      'change',
      nextAppState => { setAppState(nextAppState) },
    );
    return () => {
      appStateListener?.remove();
    };
  }, [])

  const checkUpdateNeeded = async () => {
    try {
      let updateNeeded = await VersionCheck.needUpdate();
      if (updateNeeded?.isNeeded) {
        NativeAlert.alert(
          t('PLEASE_UPDATE', 'Please update'),
          t('APP_UPDATE_MESSAGE', 'You will have to update your app to the latest version to continue using.'),
          [
            {
              text: t('UPDATE', 'Update'),
              onPress: () => {
                BackHandler.exitApp();
                Linking.openURL(updateNeeded.storeUrl)
              }
            }
          ],
          {
            cancelable: true
          }
        )
      }
    } catch { }
  }

  React.useEffect(() => {
    if (isEnableAppVersionCheck && appState === 'active') {
      checkUpdateNeeded();
    }
  }, [appState, isEnableAppVersionCheck])

  React.useEffect(() => {
    if (RootNavigation?.navigationRef?.current?.getState) {
      const params = RootNavigation?.navigationRef?.current?.getState()
      const myAccountRoute = params?.routes?.find((route: any) => route.name === 'MyAccount')
      if (myAccountRoute?.state?.routes?.length > 0) {
        myAccountRoute?.state?.routes?.map((route: any) => {
          if (route.params?.orderId) {
            setOrderIdParam(route.params?.orderId)
          }
          if (route.params?.cartUuid) {
            setCartUuidParam(route.params?.cartUuid)
          }
          if (route.params?.store) {
            setStoreParam(route.params?.store)
          }
          if (route.params?.productId && route.params?.categoryId) {
            setProductParam(
              {
                categoryId: route?.params?.categoryId,
                businessId: route?.params?.store,
                productId: route?.params?.productId
              }
            )
          }
        })
      }
    }
    return () => {
      setOrderIdParam(null)
      setCartUuidParam(null)
      setStoreParam(null)
      setProductParam(null)
    }
  }, [RootNavigation?.navigationRef?.current, auth, loaded])

  useEffect(() => {
    const navigateArgs = getMyAccountDeepLinkNavigateArgs({
      orderIdParam,
      cartUuidParam,
      storeParam,
      productParam
    })
    if (!loaded || !auth || !navigateArgs) return
    RootNavigation.navigationRef.current?.navigate(navigateArgs)
  }, [loaded, auth, orderIdParam, cartUuidParam, storeParam, productParam])

  useEffect(() => {
    if (!auth) {
      onChangeBusinessSelected(null)
      setStateInitialValues()
    }

  }, [auth, orderStatus?.options?.address?.location, businessSelected])

  useEffect(() => {
    const getProjectName = async () => {
      const data = await _retrieveStoreData('project_name');
      if (data) {
        setGeneralProjectState((prevState) => ({ ...prevState, setted: true }))
      }
    }
    getProjectName()
  }, [ordering.project])

  useEffect(() => {
    DeviceEventEmitter.addListener('change_project', (newState: any) => {
      setGeneralProjectState(() => newState)
    })
    return () => {
      DeviceEventEmitter.removeAllListeners('change_project')
    }
  }, [])

  const HomeScreen = { component: Home, name: 'Home' }
  const ProjectScreen = { component: ProjectForm, name: 'ProjectForm' }
  const HomeNavigatorScreen = { component: HomeNavigator, name: 'HomeNavigator' }

  const initialScreens = settings?.use_root_point
    ? generalProjectState.setted
      ? [HomeScreen, ProjectScreen]
      : [ProjectScreen, HomeScreen]
    : [HomeScreen]

  return (
    <Stack.Navigator>
      {!loaded && (
        <Stack.Screen
          name='LoadingScreen'
          component={NetworkError}
          initialParams={{ loadingData: true }}
          options={{ headerShown: false }}
        />
      )}
      {loaded && connectionState?.connection_status && (
        <>
          {!auth || generalProjectState?.changed ? (
            <>
              {isTutorial ? (
                <Stack.Screen
                  name="IntroductoryTutorial"
                  component={IntroductoryTutorial}
                  options={{ headerShown: false }}
                  initialParams={{ setTutorial }}
                />
              ) : (
                <>
                  <Stack.Screen
                    name="MyAccount"
                    component={HomeNavigator}
                    options={{ headerShown: false }}
                    initialParams={{
                      productLogin,
                      orderIdParam,
                      cartUuidParam,
                      storeParam,
                      productParam,
                      notification_state: oneSignalState
                    }}
                  />
                  {initialScreens.map(screen => (
                    <Stack.Screen
                      key={screen.name}
                      name={screen.name}
                      component={screen.component}
                      options={{ headerShown: false }}
                    />
                  ))}
                </>
              )}
              <Stack.Screen
                name="Login"
                component={Login}
                options={{ headerShown: false }}
                listeners={{
                  state: (e: any) => {
                    const store_slug = e.data?.state?.routes.find(
                      (object: any) => object?.params?.store_slug,
                    )?.params?.store_slug
                    const params = store_slug ? { store_slug } : {}
                    setProductLogin({
                      ...e.data.state.routes.find(
                        (object: any) => object?.params?.product,
                      )?.params?.product,
                      ...params
                    });
                  },
                }}
                initialParams={{ notification_state: oneSignalState }}
              />
              <Stack.Screen
                name="Signup"
                component={Signup}
                options={{ headerShown: false }}
                initialParams={{ notification_state: oneSignalState }}
              />
              <Stack.Screen
                name="Forgot"
                component={Forgot}
                options={{ headerShown: false }}
              />
            </>
          ) : (
            <>
              {isUserVerifyRequired && !guestCheckoutEnabled && auth ? (
                <Stack.Screen
                  name="UserVerification"
                  component={UserVerification}
                  options={{ headerShown: false }}
                />
              ) : (
                <Stack.Screen
                  name="MyAccount"
                  component={HomeNavigator}
                  options={{ headerShown: false }}
                  initialParams={{
                    productLogin,
                    orderIdParam,
                    cartUuidParam,
                    storeParam,
                    productParam,
                    notification_state: oneSignalState
                  }}
                />
              )}
            </>
          )}

        </>
      )}
      {connectionState?.connection_status === false ? (
        <Stack.Screen
          name='NetworkError'
          component={NetworkError}
          options={{ headerShown: false }}
        />
      ) : (
        <Stack.Screen
          name='NotFound'
          component={NotFound}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
};
export default RootNavigator;

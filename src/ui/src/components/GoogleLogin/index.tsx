import React, { useEffect, useRef } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { useTheme } from 'styled-components/native';

import { Container, GoogleButton } from './styles';
import { useLanguage, useApi, useSession } from '@components';
import { OIcon } from '../shared';

export const GoogleLogin = (props: any) => {
  const {
    webClientId,
    handleErrors,
    handleLoading,
    handleSuccessGoogleLogin,
    notificationState,
    iosClientId
  } = props

  const [, t] = useLanguage()
  const [ordering] = useApi()
  const theme = useTheme()
  const [{ user, auth }] = useSession();
  const configError = useRef<string | null>(null)
  const notConfiguredMessage = t('GOOGLE_LOGIN_NOT_CONFIGURED', 'Google login is not configured correctly, contact the administrator')

  const buttonText = auth && !user?.guest_id
    ? t('LOGOUT_WITH_GOOGLE', 'Logout with Google')
    : t('CONTINUE_WITH_GOOGLE', 'Continue with Google');

  const performGoogleLogin = async (accessToken: string, userData?: any) => {
    try {
      const body: any = {
        access_token: accessToken
      }
      if (userData) {
        body.email = userData.email
        body.name = userData.name
        body.lastname = userData.familyName || userData.givenName
        body.photo = userData.photo
        body.platform = Platform.OS
      }

      if (notificationState?.notification_token) {
        body.notification_token = notificationState.notification_token
        body.notification_app = notificationState.notification_app
      }
      const response: any = await ordering.users().authGoogle(body)
      if (!response.content.error) {
        if (handleSuccessGoogleLogin) {
          handleSuccessGoogleLogin(response.content.result)
          handleLoading && handleLoading(false)
        }
      } else {
        handleLoading && handleLoading(false)
        onSignoutFromGoogle()
        handleErrors && handleErrors(response.content.result?.[0])
      }
    } catch (err: any) {
      handleLoading && handleLoading(false)
      handleErrors && handleErrors(err.message)
    }
  }

  const onLoginWithGoogle = async () => {
    if (configError.current) {
      handleErrors && handleErrors(configError.current)
      return
    }
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const userInfo = await GoogleSignin.signIn();

      if (userInfo.idToken) {
        performGoogleLogin(userInfo.idToken, userInfo.user);
      } else {
        handleErrors && handleErrors('Google Sign-In error: No authentication token received')
      }
    } catch (error: any) {
      handleErrors && handleErrors(error.message)
    }
  };

  const onSignoutFromGoogle = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    } catch (error: any) {
      handleErrors && handleErrors(error.message)
    }
  }

  useEffect(() => {
    const hasWebClientId = typeof webClientId === 'string' && webClientId.trim() !== ''
    const hasIosClientId = typeof iosClientId === 'string' && iosClientId.trim() !== ''

    if (!hasWebClientId || (Platform.OS === 'ios' && !hasIosClientId)) {
      configError.current = notConfiguredMessage
      return
    }

    try {
      GoogleSignin.configure({
        webClientId: Platform.OS === 'ios' ? iosClientId.trim() : webClientId.trim(),
        offlineAccess: false,
        forceCodeForRefreshToken: true,
        iosClientId: Platform.OS === 'ios' ? iosClientId.trim() : undefined,
        profileImageSize: 120,
        scopes: [
          'https://www.googleapis.com/auth/userinfo.email',
          'https://www.googleapis.com/auth/userinfo.profile',
          'profile',
          'email'
        ],
      })
      configError.current = null
    } catch (err: any) {
      configError.current = `${notConfiguredMessage}: ${err.message}`
    }
  }, [webClientId, iosClientId])

  return (
    <Container>
      <GoogleButton
        onPress={onLoginWithGoogle}
      >
        <View style={style.fbBtn}>
          <OIcon
            src={theme.images.general.google}
            width={16}
          />
        </View>
        <Text style={style.textBtn}>
          {buttonText}
        </Text>
      </GoogleButton>
    </Container>

  );
}

const style = StyleSheet.create({
  fbBtn: {
    position: 'absolute',
    left: 0,
    marginHorizontal: 10
  },
  textBtn: {
    fontSize: 16,
    color: '#000000',
    marginLeft: 20
  }
})

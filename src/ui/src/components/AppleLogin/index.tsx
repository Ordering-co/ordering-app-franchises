import React from 'react';
import { Platform, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { appleAuth } from '@invertase/react-native-apple-authentication';

import { Container, AppleButton } from './styles';
import { useApi, useSession, useLanguage } from '@components';

export const AppleLogin = (props: any) => {
  const {
    handleErrors,
    handleLoading,
    handleSuccessAppleLogin
  } = props

  const [ordering] = useApi();
  const [{ auth }] = useSession();
  const [, t] = useLanguage();

  const buttonText = auth
    ? t('CONTINUE_WITH_APPLE', 'Logout with Apple')
    : t('CONTINUE_WITH_APPLE', 'Continue with Apple');

  const performAppleLogin = async (code: string) => {
    try {
      const response: any = await fetch(`${ordering.root}/auth/apple`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code,
          platform: Platform.OS === 'ios' ? 'ios' : 'other'
        })
      })
      const { result, error } = await response.json()
      if (!error) {
        if (handleSuccessAppleLogin) {
          handleSuccessAppleLogin(result)
          handleLoading && handleLoading(false)
        }
      } else {
        handleErrors && handleErrors(result)
        handleLoading && handleLoading(false)
      }
    } catch (err: any) {
      handleLoading && handleLoading(false)
      handleErrors && handleErrors(err.message)
    }
  }

  const onIOSButtonPress = async () => {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      if (!appleAuthRequestResponse.identityToken) {
        handleErrors && handleErrors('UNABLE_LOGIN_TOKEN_APPLE', 'Unable to login, no identity token found')
        return
      }

      const {
        identityToken,
        authorizationCode
      } = appleAuthRequestResponse;

      if (identityToken && authorizationCode) {
        performAppleLogin(authorizationCode)
      } else {
        handleErrors && handleErrors('UNABLE_LOGIN_TOKEN', 'Unable to login, no token found')
      }

    } catch (err: any) {
      handleLoading && handleLoading(false)
      handleErrors && handleErrors(err.message)
    }
  }

  const canShowButton = () => {
    if (Platform.OS === 'ios') return true;
    return false;
  }

  return (
    <Container>
      {canShowButton() &&
        <AppleButton
          onPress={() => onIOSButtonPress()}
        >
          <Icon
            name="apple"
            size={20}
            color={'black'}
            style={style.fbBtn}
          />
          <Text style={style.textBtn}>
            {buttonText}
          </Text>
        </AppleButton>
      }
    </Container>
  );
}

const style = StyleSheet.create({
  fbBtn: {
    position: 'absolute',
    left: 0,
    marginHorizontal: 16
  },
  textBtn: {
    fontSize: 14,
    color: '#000000'
  }
})

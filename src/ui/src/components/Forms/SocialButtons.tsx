import React from 'react'
import { Platform, Vibration } from 'react-native'
import { useTheme } from 'styled-components/native'
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder';

import { ToastType, useConfig, useToast, useSession, useLanguage } from '@components'
import {
  FacebookLogin,
  GoogleLogin,
  AppleLogin,
  OText
} from '@ui'

import { ButtonsWrapper, Line, SkeletonWrapper, SocialButtonsStyle, WrapperOrSeparator } from './styles'

const hasClientId = (value: unknown) => typeof value === 'string' && value.trim() !== ''

export const SocialButtons = (props: any) => {
  const {
    notificationState,
    setIsFBLoading,
    onHandleSuccess
  } = props

  const [{ configs }] = useConfig()
  const [, { showToast }] = useToast()
  const [, t] = useLanguage()
  const [, { login }] = useSession()
  const theme = useTheme()

  const googleLoginEnabled = configs?.google_login_enabled?.value === '1' &&
    hasClientId(configs?.google_login_client_id?.value) &&
    (Platform.OS !== 'ios' || hasClientId(configs?.google_login_ios_client_id?.value))
  const facebookLoginEnabled = configs?.facebook_login_enabled?.value === '1' &&
    hasClientId(configs?.facebook_id?.value)
  const appleLoginEnabled = Platform.OS === 'ios' && (configs?.apple_login_enabled?.value === '1' || !configs?.apple_login_enabled?.value && configs?.apple_login_enabled?.enabled)

  const handleSuccess = (user: any) => {
    login({ user, token: user.session.access_token })
    onHandleSuccess && onHandleSuccess()
  }

  return (
    <>
      {configs && Object.keys(configs).length > 0 ? (
        (facebookLoginEnabled ||
          googleLoginEnabled ||
          ((configs?.apple_login_client_id?.value !== '' && configs?.apple_login_client_id?.value !== null) && appleLoginEnabled)) &&
        (
          <>
            <WrapperOrSeparator>
              <Line />
              <OText
                size={14}
                mBottom={10}
                style={{ paddingHorizontal: 19 }}
                color={theme.colors.disabled}>
                {t('OR', 'or')}
              </OText>
              <Line />
            </WrapperOrSeparator>
            <ButtonsWrapper>
              <SocialButtonsStyle>
                {facebookLoginEnabled && (
                    <FacebookLogin
                      notificationState={notificationState}
                      handleErrors={(err: any) => { showToast(ToastType.Error, err), Vibration.vibrate() }}
                      handleLoading={(val: boolean) => setIsFBLoading(val)}
                      handleSuccessFacebookLogin={handleSuccess}
                    />
                  )}
                {googleLoginEnabled && (
                  <GoogleLogin
                    notificationState={notificationState}
                    webClientId={configs?.google_login_client_id?.value}
                    iosClientId={configs?.google_login_ios_client_id?.value}
                    handleErrors={(err: any) => { showToast(ToastType.Error, err), Vibration.vibrate() }}
                    handleLoading={(val: boolean) => setIsFBLoading(val)}
                    handleSuccessGoogleLogin={handleSuccess}
                  />
                )}
                {(configs?.apple_login_client_id?.value !== '' && configs?.apple_login_client_id?.value !== null) && appleLoginEnabled && (
                  <AppleLogin
                    notificationState={notificationState}
                    handleErrors={(err: any) => { showToast(ToastType.Error, err), Vibration.vibrate() }}
                    handleLoading={(val: boolean) => setIsFBLoading(val)}
                    handleSuccessAppleLogin={handleSuccess}
                  />
                )}
              </SocialButtonsStyle>
            </ButtonsWrapper>
          </>
        )
      ) : (
        <SkeletonWrapper>
          <Placeholder Animation={Fade}>
            <PlaceholderLine
              height={20}
              style={{ marginBottom: 15, marginTop: 10 }}
            />
            <PlaceholderLine
              height={50}
              style={{ borderRadius: 25, marginBottom: 25 }}
            />
          </Placeholder>
        </SkeletonWrapper>
      )}
    </>
  )
}

import React from 'react'
import { View, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useTheme } from 'styled-components/native'
import FastImage from 'react-native-fast-image'

import { AltContainer, AlterWrapperActions } from './styles'
import { ACCOUNT_VALUES } from '../../config/constants'
import { useLanguage, useOrder } from '@components'
import { OButton, useGuestLogin, OText } from '@ui'

export const Home = (props: any) => {
  const { onNavigationRedirect, setAccountState } = props
  const theme = useTheme()

  const HEIGHT = Dimensions.get('screen').height

  const [, t] = useLanguage()
  const [orderState] = useOrder()
  const { handleGuestUser } = useGuestLogin({
    redirectProps: { page: 'AddressList', params: { newUser: true } },
    onRedirect: (page: string, params?: any) => onNavigationRedirect(page, params)
  })

  const url = theme?.homepage_view?.components?.homepage_header?.components?.image

  return (
    <View>
      <View style={{ position: 'relative', height: HEIGHT * 0.2 }}>
        <FastImage
          style={{ width: '100%', height: '100%' }}
          source={url ? {
            uri: url,
            priority: FastImage.priority.normal
          } : theme.images.general.homeHero}
          resizeMode={FastImage.resizeMode.cover}
        />
      </View>
      <AltContainer>
        <OText
          size={theme.utils.tsize.xxxl}
          color={theme.colors.primary}
          weight={'bold'}
          style={{ textAlign: 'center', marginBottom: 20 }}
        >
          {t('HOME_TUTORIAL_TITLE', 'Time to Savor!')}
        </OText>
        <OText
          size={theme.utils.tsize.l}
          color={theme.colors.textNormal}
          style={{ textAlign: 'center', marginBottom: 20 }}
        >
          {t('HOME_TUTORIAL_SUBTITLE', 'Indulge in a variety of delicious, freshly prepared meals made with care, just for you.')}
        </OText>
        <AlterWrapperActions>
          <OButton
            text={t('SIGNUP', 'Sign up')}
            imgRightSrc={null}
            style={{ width: '100%' }}
            onClick={() => {
              setAccountState(ACCOUNT_VALUES.SIGNUP)
              onNavigationRedirect('BottomTab', { screen: 'Profile' })
            }}
          />
          <OButton
            text={t('LOGIN', 'Login')}
            imgRightSrc={null}
            bgColor={theme.colors.white}
            borderColor={theme.colors.primary}
            textStyle={{ color: theme.colors.primary }}
            style={{ width: '100%', marginTop: 25 }}
            onClick={() => {
              setAccountState(ACCOUNT_VALUES.LOGIN)
              onNavigationRedirect('BottomTab', { screen: 'Profile' })
            }}
          />
          <View style={{ paddingVertical: 30 }}>
            {orderState?.loading ? (
              <ActivityIndicator size='small' color={theme.colors.primary} />
            ) : (
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => handleGuestUser()}
              >
                <OText
                  size={theme.utils.tsize.m}
                  color={theme.colors.primary}
                  style={{ textAlign: 'center' }}
                >
                  {t('CONTINUE_AS_GUEST', 'Continue as Guest')}
                </OText>
              </TouchableOpacity>
            )}
          </View>
        </AlterWrapperActions>
      </AltContainer>
    </View>
  )
}

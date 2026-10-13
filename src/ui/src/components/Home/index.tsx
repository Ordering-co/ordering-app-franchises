import React, { useState } from 'react'
import { RefreshControl, ScrollView, View, Dimensions, StyleSheet } from 'react-native'
import { useTheme } from 'styled-components/native'
import FastImage from 'react-native-fast-image'

import { Container } from './styles'
import { ALL_ORDER_STATUS } from '../../config/constants'
import { Home as HomeAlternative } from './Alternative'
import { useLanguage, useOrder, useSession } from '@components'
import { OButton, PageBanner, LastOrders, useGuestLogin, useHomeValues } from '@ui'

export const Home = (props: any) => {
  const { onNavigationRedirect, navigation, useRootPoint } = props
  const theme = useTheme()
  const [{ alternativeHome }] = useHomeValues()

  const HEIGHT = Dimensions.get('screen').height

  const [{ auth }] = useSession()
  const [, t] = useLanguage()
  const [orderState] = useOrder()
  const { handleGuestUser } = useGuestLogin({
    redirectProps: { page: 'AddressList', params: { newUser: true } },
    onRedirect: (page: string, params?: any) => onNavigationRedirect(page, params)
  })

  const [refreshing] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const [pageBannerExists, setPageBannerExists] = useState(false)

  const url = theme?.homepage_view?.components?.homepage_header?.components?.image

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      {...(alternativeHome && !auth
        ? {
          refreshControl:
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => setRefresh(true)}
            />
        }
        : {})}
    >
      <View style={{ marginBottom: 20 }}>
        {alternativeHome && !auth ? (
          <HomeAlternative {...props} />
        ) : (
          <>
            <PageBanner
              position='app_home_page'
              navigation={props.navigation}
              setPageBannerExists={setPageBannerExists}
              isProjectChange
            />
            <View style={[{ position: 'relative' }, !pageBannerExists ? { height: HEIGHT * 0.55 } : {}]}>
              {!pageBannerExists && (
                <FastImage
                  style={{ width: '100%', height: '100%', backgroundColor: theme.colors.backgroundPage }}
                  source={url ? {
                    uri: url,
                    priority: FastImage.priority.normal
                  } : theme.images.general.homeHero}
                  resizeMode={FastImage.resizeMode.cover}
                />
              )}
              <Container>
                <OButton
                  text={t('ORDER_NOW', 'Order Now')}
                  imgRightSrc={null}
                  isLoading={orderState?.loading}
                  style={{ width: '100%' }}
                  onClick={() => handleGuestUser()}
                />
              </Container>
            </View>
            <LastOrders
              fromHome
              orderStatus={ALL_ORDER_STATUS}
              refresh={refresh}
              setRefresh={setRefresh}
              onRedirect={onNavigationRedirect}
            />
          </>
        )}
        {!auth && useRootPoint && (
          <OButton
            text={t('CHANGE_PROJECT_NAME', 'Change project name')}
            style={styles.buttons}
            bgColor={theme.colors.primary}
            borderColor={theme.colors.primary}
            isCircle={false}
            onClick={() => navigation?.canGoBack() ? navigation?.goBack() : onNavigationRedirect('ProjectForm', {})}
            imgRightSrc={null}
            isDisabled={orderState?.loading}
          />
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  buttons: {
    marginVertical: 6,
    borderRadius: 10,
    marginHorizontal: 20
  }
});

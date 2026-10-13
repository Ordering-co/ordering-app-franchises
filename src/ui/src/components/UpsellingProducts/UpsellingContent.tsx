import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, View, Vibration, Animated, RefreshControl } from 'react-native'
import { useTheme } from 'styled-components/native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UpsellingLayout } from './UpsellingLayout';

import {
  Separator,
  UpsellingContentContainer,
  WrapperButtons,
  WrapperUpsellingProducts
} from './styles'

import { useLanguage, useOrder, useSession } from '@components'
import { OText, OButton, OrderSummary, AddressComponent } from '@ui'
import { useIsFocused } from '@react-navigation/native';

const AnimatedText = ({ text, props }: any) => {
  const opacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start()
  }, [opacity])

  return (
    <Animated.View style={{ opacity }}>
      <OText {...props}>
        {text}
      </OText>
    </Animated.View>
  );
}

export const UpsellingContent = (props: any) => {
  const {
    onNavigationRedirect,
    currentCart,
    productsList
  } = props

  const theme = useTheme()
  const [{ carts }, { refreshOrderOptions }] = useOrder()
  const [{ user }] = useSession()
  const [, t] = useLanguage()
  const { bottom } = useSafeAreaInsets()

  const [refreshing] = useState(false)

  const productsLength = carts?.[`businessId:${currentCart?.business_id}`]?.products?.length
  const isFocused = useIsFocused();

  const styles = StyleSheet.create({
    closeUpsellingButton: {
      borderRadius: theme.utils.radius.l,
      alignSelf: 'center',
      height: 50,
      width: '100%'
    }
  })

  const handleClickCheckout = () => {
    Vibration.vibrate(50)
    onNavigationRedirect(user?.guest_id ? 'CheckGuest' : 'CheckoutPage', { cartUuid: currentCart?.uuid })
  }

  useEffect(() => {
    if (!productsLength && isFocused) {
      onNavigationRedirect('BottomTab', { screen: 'Business' })
    }
  }, [productsLength])

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => refreshOrderOptions()}
          />
        }
      >
        <AddressComponent onRedirect={onNavigationRedirect} />

        <UpsellingContentContainer>
          <OrderSummary
            hideDetails
            hideAddProductsButton
            cart={currentCart}
            isCartPending={currentCart?.status === 2}
            onNavigationRedirect={onNavigationRedirect}
          />
          {productsList.length > 0 &&
            <WrapperUpsellingProducts>
              <Separator />
              <AnimatedText
                text={t('RECOMMENDED_FOR_YOU', 'Recommended for you')}
                props={{
                  size: theme.utils.tsize.m,
                  weight: 700
                }}
              />
              <UpsellingLayout
                productsList={props.productsList}
                business={props.business}
                businessId={props.businessId}
                onNavigationRedirect={props.onNavigationRedirect}
              />
            </WrapperUpsellingProducts>
          }
        </UpsellingContentContainer>
      </ScrollView>

      <WrapperButtons pb={bottom || 20}>
        <View style={{ width: '45%' }}>
          <OButton
            imgRightSrc=''
            text={t('ADD_ITEMS', 'Add items')}
            style={{ ...styles.closeUpsellingButton }}
            bgColor={theme?.colors?.backgroundGray100}
            borderColor={theme?.colors?.primary}
            textStyle={{
              color: theme?.colors?.primary,
              fontWeight: 'normal'
            }}
            onClick={() => onNavigationRedirect('BottomTab', { screen: 'Business' })}
          />
        </View>
        <View style={{ width: '45%' }}>
          <OButton
            imgRightSrc=''
            isDisabled={productsLength === 0}
            text={t('CHECKOUT', 'Checkout')}
            style={{ ...styles.closeUpsellingButton }}
            onClick={() => handleClickCheckout()}
          />
        </View>
      </WrapperButtons>
    </>
  )
}

import React, { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
import { useTheme } from 'styled-components/native';
import ReactNativeHapticFeedback, { HapticFeedbackTypes } from "react-native-haptic-feedback";
import moment from 'moment';
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import isBetween from 'dayjs/plugin/isBetween'
import { createDayjsWithTimezone } from '@components'

dayjs.extend(timezone)
dayjs.extend(isBetween)

import { BusinessContainer } from './styles'

import {
  BusinessController as BusinessSingleCard,
  useUtils,
  useOrder,
  useLanguage,
  useConfig,
  useToast,
  useSession,
  ToastType
} from '@components';

import {
  LottieAnimation,
  OText,
  OButton,
} from '@ui'

import { BusinessControllerParams } from '../../types';
import { convertHoursToMinutes, vibrateApp } from '../../utils';

function BusinessControllerPropsAreEqual(prevProps: any, nextProps: any) {
  return JSON.stringify(prevProps.business) === JSON.stringify(nextProps.business) &&
    prevProps.isBusinessOpen === nextProps.isBusinessOpen
}

export const BusinessControllerUI = React.memo((props: BusinessControllerParams) => {
  const {
    business,
    handleClick,
    navigation,
    handleFavoriteBusiness,
    enableIntersection,
    containerStyle
  } = props;

  const [{ parsePrice, parseDistance }] = useUtils();
  const [, { showToast }] = useToast()
  const [orderState] = useOrder();
  const [{ auth }] = useSession()
  const [configState] = useConfig();
  const [, t] = useLanguage();

  const theme = useTheme()
  const [isIntersectionObserver, setIsIntersectionObserver] = useState(!enableIntersection)
  const formatTime = configState.configs?.general_hour_format?.value || 'HH:mm'

  const handleBusinessClick = (selectedBusiness: any) => {
    vibrateApp()
    if (business?.open) {
      handleClick && handleClick(selectedBusiness)
    } else {
      if (configState?.configs?.preorder_status_enabled?.value === '1') {
        navigation.navigate('BusinessPreorder', { business: selectedBusiness, handleBusinessClick: handleClick })
        return
      }
      showToast(ToastType.Info, t('ERROR_ADD_PRODUCT_BUSINESS_CLOSED', 'The business is closed at the moment'));
    }
  }

  const handleChangeFavorite = () => {
    if (auth) {
      handleFavoriteBusiness && handleFavoriteBusiness(!business?.favorite)
    }
  }

  const checkTime = (val: any) => val < 10 ? `0${val}` : val

  const findTodayLapse = () => {
    if (business?.today?.enabled) {
      const currentDate = createDayjsWithTimezone(business?.timezone)
      const lapse = business?.today?.lapses?.find((lapse: any) => {
        const from = currentDate.hour(lapse.open.hour).minute(lapse.open.minute)
        const to = currentDate.hour(lapse.close.hour).minute(lapse.close.minute)
        return currentDate.unix() >= from.unix() && currentDate.unix() <= to.unix()
      })
      return lapse || business?.today?.lapses?.[0]
    }
  }

  return (
    <>
      {isIntersectionObserver ? (
        <BusinessContainer
          style={{
            ...styles.shadow,
            shadowColor: theme?.colors?.black,
            ...containerStyle
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <OText
              color={theme?.colors?.primary}
              size={18}
              numberOfLines={1}
              style={{ maxWidth: 200 }}
            >
              {business?.name}
            </OText>
            <View
              style={{ flexDirection: 'row', alignItems: 'center' }}
            >
              <OText weight={600} mRight={10}>
                {parseDistance(business?.distance)}
              </OText>
              <LottieAnimation
                type='favorite'
                onClick={handleChangeFavorite}
                initialValue={business?.favorite ? 0.5 : 0}
                toValue={business?.favorite ? 0 : 0.5}
                disableAnimation={!auth}
                iconProps={{ color: theme.colors.primary, size: 18 }}
                isActive={business?.favorite}
              />
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <OText>
              {business?.address}
            </OText>
            {orderState?.options?.type === 1 && (
              <OText
                color={theme.colors.disabled}>
                {`${parsePrice(business?.delivery_price)} ${t('DELIVERY_FEE', 'Delivery fee')} \u2022 ${convertHoursToMinutes(
                  orderState?.options?.type === 1
                    ? (business?.delivery_time)
                    : (business?.pickup_time),
                )}`}
              </OText>
            )}
          </View>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end'
          }}>
            <OText size={theme.utils.tsize.xs}>
              {business?.open && business?.today?.enabled ?
                `${t('OPEN_AT', 'OPEN AT')} ${moment(`${checkTime(findTodayLapse()?.open?.hour)}:${checkTime(findTodayLapse()?.open?.minute)}`, formatTime).format(formatTime)}`
                : t('STORE_CLOSED', 'Store closed')}
            </OText>
            {(configState?.configs?.preorder_status_enabled?.value === '1' || (business?.open && business?.today?.enabled)) && (
              <OButton
                onClick={() => handleBusinessClick(business)}
                text={business?.open && business?.today?.enabled ? t('ORDER_NOW', 'Order Now') : t('VIEW_MENU', 'VIEW MENU')}
                bgColor={business?.open && business?.today?.enabled ? theme?.colors?.primary : theme?.colors?.white}
                style={{
                  height: 35,
                  width: 130,
                  paddingLeft: 5,
                  paddingRight: 5
                }}
                textStyle={{
                  fontSize: 14,
                  marginLeft: 0,
                  marginRight: 0,
                  color: business?.open && business?.today?.enabled ? theme?.colors?.white : theme?.colors?.primary
                }}
              />
            )}
          </View>
        </BusinessContainer>
      ) : (
        <Placeholder
          Animation={Fade}
          style={{
            paddingHorizontal: 20,
            marginHorizontal: 20,
            marginVertical: 15,
          }}>
          <View style={{ width: '100%' }}>
            <PlaceholderLine
              height={150}
              style={{ marginBottom: 20, borderRadius: 25 }}
            />
            <View style={{ paddingHorizontal: 10 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <PlaceholderLine
                  height={25}
                  width={40}
                  style={{ marginBottom: 10 }}
                />
                <PlaceholderLine
                  height={25}
                  width={20}
                  style={{ marginBottom: 10 }}
                />
              </View>
              <PlaceholderLine
                height={20}
                width={30}
                style={{ marginBottom: 10 }}
              />
              <PlaceholderLine
                height={20}
                width={80}
                style={{ marginBottom: 10 }}
              />
            </View>
          </View>
        </Placeholder>
      )}
    </>
  );
}, BusinessControllerPropsAreEqual);

const styles = StyleSheet.create({
  shadow: {
    shadowOpacity: 0.18,
    elevation: 3,
    shadowOffset: {
      width: 1,
      height: 4
    }
  }
})

export const BusinessController = (props: BusinessControllerParams) => {
  const BusinessControllerProps = {
    ...props,
    UIComponent: BusinessControllerUI,
  };

  return <BusinessSingleCard {...BusinessControllerProps} />;
};

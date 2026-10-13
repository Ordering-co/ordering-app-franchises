import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { useTheme } from 'styled-components/native';
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import isBetween from 'dayjs/plugin/isBetween';
import { createDayjsWithTimezone } from '@components';

dayjs.extend(timezone);
dayjs.extend(isBetween);

import { convertHoursToMinutes } from '../../utils';
import { BusinessBasicInformationParams } from '../../types';

import {
  BusinessContainer,
  BusinessInfo,
  BusinessInfoItem,
  WrapReviews,
  TitleWrapper,
  InfoButton,
  WrapperInfo,
  BusinessInfoItem2
} from './styles';

import { useUtils, useOrder, useLanguage } from '@components';
import { OText } from '@ui';

export const BusinessBasicInformation = (props: BusinessBasicInformationParams) => {
  const { navigation, businessState, isBusinessInfoShow, header, onNavigationRedirect } = props;
  const { business, loading } = businessState;

  const theme = useTheme();
  const [orderState] = useOrder();
  const [, t] = useLanguage();
  const [{ parsePrice, parseDistance }] = useUtils();
  const [imageRealSize, setImageRealSize] = useState({ width: 16, height: 9, loading: true })
  const hideDeliveryFee = theme?.business_view?.components?.header?.components?.business?.components?.fee?.hidden
  const hideTime = theme?.business_view?.components?.header?.components?.business?.components?.time?.hidden
  const hideReviewsPopup = theme?.business_view?.components?.header?.components?.reviews?.hidden
  const hideDistance = theme?.business_view?.components?.header?.components?.business?.components?.distance?.hidden
  const hideInfoIcon = theme?.business_view?.components?.header?.components?.business?.components?.business_info?.hidden

  useEffect(() => {
    if (businessState?.loading) return
    let timeout: any = null
    const currentDate = createDayjsWithTimezone(businessState?.business?.timezone)
    let lapse = null
    if (businessState?.business?.today?.enabled) {
      lapse = businessState?.business?.today?.lapses?.find((lapse: any) => {
        const from = currentDate.hour(lapse.open.hour).minute(lapse.open.minute)
        const to = currentDate.hour(lapse.close.hour).minute(lapse.close.minute)
        return currentDate.unix() >= from.unix() && currentDate.unix() <= to.unix()
      })
    }
    if (lapse) {
      const to = currentDate.hour(lapse.close.hour).minute(lapse.close.minute)
      const timeToClose = (to.unix() - currentDate.unix()) * 1000
      timeout = setTimeout(() => {
        navigation.navigate('BusinessPreorder', { business: businessState?.business, handleBusinessClick: () => navigation?.goBack() })
      }, timeToClose)
    }
    return () => {
      timeout && clearTimeout(timeout)
    }
  }, [businessState?.business])

  useEffect(() => {
    const bannerImage = header || businessState?.business?.header
    if (!bannerImage) {
      setImageRealSize({ width: 16, height: 9, loading: false })
      return
    }
    Image.getSize(bannerImage, (width: number, height: number) => {
      setImageRealSize({ width: width, height: height, loading: false });
    }, (error: any) => {
      setImageRealSize({ ...imageRealSize, loading: false });
    });
  }, [header, businessState?.business?.header])

  return (
    <>
      {!loading && (
        <BusinessContainer>
          <BusinessInfo>
            <BusinessInfoItem>
              <TitleWrapper>
                <OText size={theme.utils.tsize.m} color={theme.colors.textNormal} weight={'600'} numberOfLines={1}>
                  {business?.name}
                </OText>
              </TitleWrapper>
            </BusinessInfoItem>
            <BusinessInfoItem2>
              <WrapperInfo>
                {!hideDeliveryFee && orderState?.options?.type === 1 && (
                  <OText color={theme.colors.textSecondary} size={theme.utils.tsize.xs} style={{ marginRight: 2 }}>
                    {`${t('DELIVERY_FEE', 'Delivery fee')} ${business && parsePrice(business?.delivery_price || 0)}` + `  `}
                  </OText>
                )}
                {!hideTime && (
                  <OText
                    color={theme.colors.textSecondary}
                    size={theme.utils.tsize.xs}
                    style={{ marginRight: 2 }}
                  >
                    {convertHoursToMinutes(orderState?.options?.type === 1 ? business?.delivery_time : business?.pickup_time) + ` `}
                  </OText>
                )}
                {!hideDistance && (
                  <OText color={theme.colors.textSecondary} size={theme.utils.tsize.xs} style={{ marginRight: 2 }}>
                    {parseDistance(business?.distance || 0) + `  `}
                  </OText>
                )}
              </WrapperInfo>
            </BusinessInfoItem2>
            <WrapReviews>
              {!isBusinessInfoShow && !hideReviewsPopup && !loading && !!business.reviews?.reviews?.length && (
                <TouchableOpacity onPress={() => onNavigationRedirect?.('BusinessReviews', {
                  businessState,
                  businessId: business.id,
                  reviews: business.reviews?.reviews
                })}>
                  <OText
                    color={theme.colors.primary}
                    style={{ textDecorationColor: theme.colors.primary, textDecorationLine: 'underline' }}
                    size={theme.utils.tsize.xs}
                  >
                    {t('REVIEWS', 'Reviews')}
                  </OText>
                </TouchableOpacity>
              )}
              {!isBusinessInfoShow && !hideInfoIcon && (
                <InfoButton
                  activeOpacity={0.7}
                  onPress={() => onNavigationRedirect?.('BusinessInfo', { businessState, business })}
                >
                  <OText size={theme.utils.tsize.xs}>
                    {t('INFORMATION_SHORT_TEXT', 'Info')}
                  </OText>
                </InfoButton>
              )}
            </WrapReviews>
          </BusinessInfo>
        </BusinessContainer>
      )}

      {loading && <LoadingComponent />}
    </>
  )
}

const LoadingComponent = () => {
  return (
    <BusinessContainer>
      <BusinessInfo>
        <BusinessInfoItem>
          <Placeholder Animation={Fade}>
            <PlaceholderLine height={30} width={20} />
          </Placeholder>
        </BusinessInfoItem>
        <BusinessInfoItem>
          <Placeholder Animation={Fade}>
            <View style={{ flexDirection: 'row' }}>
              <PlaceholderLine width={13} style={{ marginRight: 10 }} />
              <PlaceholderLine width={13} style={{ marginRight: 10 }} />
              <PlaceholderLine width={13} style={{ marginRight: 10 }} />
              <PlaceholderLine width={13} />
            </View>
          </Placeholder>
        </BusinessInfoItem>
      </BusinessInfo>
    </BusinessContainer>
  )
}

import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { useTheme } from 'styled-components/native';

import { BlockInfo } from './styles';

import {
  useConfig,
  useLanguage,
  useOrder,
  useUtils,
} from '@components';

import {
  OButton,
  OIcon,
  OBottomPopup,
  OText
} from '@ui';

export const OrderConfig = (props: any) => {
  const {
    isOpenConfirmAddress,
    setIsOpenConfirmAddress,
    addressSelected,
    handleSubmit,
    onSubmit,
    businessNearestState,
    handleGoToPreorder
  } = props

  const [, t] = useLanguage()
  const [orderState] = useOrder()
  const [{ parseDate }] = useUtils()
  const [{ configs }] = useConfig()
  const isPreorderEnabled = (configs?.preorder_status_enabled?.value === '1' || configs?.preorder_status_enabled?.value === 'true')

  const theme = useTheme()

  return (
    <OBottomPopup
      open={isOpenConfirmAddress}
      title={t('CONFIGURATION_OF_DELIVERY', 'CONFIGURATION OF DELIVERY')}
      transparent={true}
      bottomContainerStyle={{ height: '60%', borderTopLeftRadius: 10, borderTopRightRadius: 10, position: 'relative' }}
      titleStyle={{ textAlign: 'left', padding: 10 }}
      subtitleStyle={{ textAlign: 'left', paddingLeft: 10 }}
      presentationStyle='overFullScreen'
      onClose={() => setIsOpenConfirmAddress(false)}
    >
      <TouchableOpacity
        onPress={() => setIsOpenConfirmAddress(false)}
        style={{
          position: 'absolute',
          right: 25,
          zIndex: 1000,
          paddingTop: 30
        }}
      >
        <OIcon
          src={theme.images.general.closeTransparent}
          width={24}
          height={24}
        />
      </TouchableOpacity>
      <View
        style={{ paddingHorizontal: 20, justifyContent: 'flex-end' }}
      >
        <OText
          size={9}
          weight={400}
          mBottom={10}
          color={theme?.colors?.secondaryLightGray}
        >
          {t('DELIVER_IN', 'DELIVER IN')}
        </OText>
        <BlockInfo>
          <OIcon
            src={theme.images.general.deliveryIcon}
            width={24}
            height={24}
            color={theme?.colors?.black}
          />
          <OText
            mLeft={10}
            size={12}
            weight={400}
            numberOfLines={2}
            style={{
              paddingRight: 20
            }}
          >
            {addressSelected}
          </OText>
        </BlockInfo>
        <OText
          size={9}
          weight={400}
          mBottom={10}
          color={theme?.colors?.secondaryLightGray}
        >
          {t('YOUR_STORE', 'YOUR STORE')}
        </OText>
        <BlockInfo>
          <OIcon
            src={theme.images.general.shop}
            width={18}
            height={18}
            color={theme?.colors?.black}
          />
          <View>
            <OText
              mLeft={10}
              size={12}
              weight={500}
              style={{
                paddingRight: 20
              }}
              numberOfLines={2}
            >
              {businessNearestState?.business?.name}
            </OText>
            {businessNearestState?.business?.cellphone && (
              <OText
                mLeft={10}
                size={12}
                weight={400}
                style={{
                  paddingRight: 20
                }}
                numberOfLines={2}
              >
                {businessNearestState?.business?.cellphone}
              </OText>
            )}
            <OText
              mLeft={10}
              size={12}
              weight={400}
              style={{
                paddingRight: 20
              }}
              numberOfLines={2}
            >
              {businessNearestState?.business?.address}
            </OText>
          </View>
        </BlockInfo>
        <OText
          size={9}
          weight={400}
          mBottom={10}
          color={theme?.colors?.secondaryLightGray}
        >
          {t('TIME_OF_DELIVERY', 'TIME OF DELIVERY')}
        </OText>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}
        >
          <BlockInfo
            style={{
              width: '50%'
            }}
          >
            <OIcon
              src={theme.images.general.alarm_clock}
              width={18}
              height={18}
              color={theme?.colors?.black}
            />
            <OText
              mLeft={10}
              size={12}
              style={{
                paddingRight: 20
              }}
              numberOfLines={1}
            >
              {orderState.options?.moment
                ? parseDate(orderState.options?.moment, { outputFormat: configs?.dates_moment_format?.value })
                : t('ASAP', 'ASAP')}
            </OText>
          </BlockInfo>
          {isPreorderEnabled && (
            <OButton
              text={t('SCHEDULE', 'SCHEDULE')}
              onClick={() => handleGoToPreorder()}
              bgColor={theme?.colors?.backgroundGray200}
              borderColor={theme?.colors?.backgroundGray200}
              style={{
                borderRadius: 30,
                height: 40
              }}
              textStyle={{
                color: theme?.colors?.black,
                fontWeight: '700'
              }}
            />
          )}
        </View>
        <OButton
          text={t('CONTINUE', 'CONTINUE')}
          imgRightSrc={null}
          style={{ marginBottom: 10 }}
          onClick={handleSubmit(onSubmit)}
        />
      </View>
    </OBottomPopup>
  )
}

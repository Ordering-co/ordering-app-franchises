import React from 'react';
import FastImage from 'react-native-fast-image'
import { StyleSheet, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { useTheme } from 'styled-components/native';
import {
  AddressDetails as AddressDetailsController,
  useOrder,
  useLanguage,
} from '@components';
import { OButton, OText } from '@ui';

import { getTypesText } from '../../utils';
import { ADContainer, ADHeader, ADAddress, ADMap } from './styles';

const AddressDetailsUI = (props: any) => {
  const {
    navigation,
    addressToShow,
    isCartPending,
    googleMapsUrl,
    apiKey,
    isShowOnlyMap,
    mapHeight,
    mapWidth,
    showModalForEditMap,
    addressToDeliver,
    callback,
    mapStyle
  } = props;

  const theme = useTheme();
  const [orderState] = useOrder();
  const [{ options }] = useOrder();
  const [, t] = useLanguage();
  const { width } = useWindowDimensions();

  const orderTypeText = {
    key: getTypesText(options?.type || 1),
    value: t(getTypesText(options?.type || 1), 'Delivery')
  }

  const styles = StyleSheet.create({
    mapStyle: {
      width: mapWidth || width,
      height: mapHeight ?? 151,
      marginVertical: 10,
      ...mapStyle
    }
  })

  return (
    <ADContainer>
      {!isShowOnlyMap && (
        <ADHeader>
          {props.HeaderTitle ?? (
            <OText
              size={16}
              lineHeight={24}
              color={theme.colors.textNormal}
            >
              {t(`${orderTypeText.key}_ADDRESS`, `${orderTypeText.value} address`)}
            </OText>
          )}
        </ADHeader>
      )}
      {showModalForEditMap && (
        <View
          style={{
            borderColor: theme?.colors?.primary,
            backgroundColor: theme?.colors?.white,
            borderWidth: 1,
            position: 'absolute',
            zIndex: 2000,
            alignItems: 'center',
            padding: 15,
            borderRadius: 10,
            top: 60
          }}
        >
          <OText
            style={{
              color: theme?.colors?.primary
            }}
            size={12}
          >
            {t('DELIVER_IN', 'DELIVER IN')}
          </OText>
          <OText
            size={12}
          >
            {addressToDeliver}
          </OText>
          <OButton
            onClick={() => callback && callback()}
            bgColor={theme?.colors?.white}
            text={t('ADJUST_THE_MARKER', 'ADJUST THE MARKER')}
            style={{
              borderRadius: 10,
              height: 26,
              marginTop: 10
            }}
            textStyle={{
              color: theme?.colors?.primary,
              fontSize: 12
            }}
          />
        </View>
      )}
      {(!!apiKey || isShowOnlyMap) && !!googleMapsUrl && (
        <ADMap
          style={{ width: mapWidth || width, flex: 1, marginStart: -20, marginEnd: -20 }}>
          <FastImage
            style={styles.mapStyle}
            source={{
              uri: googleMapsUrl,
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
        </ADMap>
      )}
      {!isShowOnlyMap && (
        <ADAddress>
          <OText
            size={12}
            color={theme.colors.textNormal}
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{ width: '85%' }}>
            {addressToShow || orderState?.options?.address?.address}
          </OText>
          <OText size={12} lineHeight={18} color={theme.colors.textNormal}>
            {orderState?.options?.address?.address_notes}
          </OText>
          {orderState?.options?.type === 1 && !isCartPending && (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('AddressList', { isFromCheckout: true })
              }>
              <OText
                size={12}
                color={theme.colors.primary}
                style={{ textDecorationLine: 'underline' }}>
                {t('CHANGE', 'Change')}
              </OText>
            </TouchableOpacity>
          )}
        </ADAddress>
      )}
    </ADContainer>
  );
};

export const AddressDetails = (props: any) => {
  const addressDetailsProps = {
    ...props,
    UIComponent: AddressDetailsUI,
  };
  return <AddressDetailsController {...addressDetailsProps} />;
};

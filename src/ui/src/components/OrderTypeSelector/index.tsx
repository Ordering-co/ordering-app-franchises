import React, { useEffect, useRef } from 'react'
import { ActivityIndicator } from 'react-native'
import { useTheme } from 'styled-components/native';

import { Container, OTButton, OTMiniButton, WrapperMainBtns, WrapperPickupBtns } from './styles'
import { OrderTypeSelectParams } from '../../types'
import { ORDER_TYPES, PICKUP_TYPES } from '../../config/constants';

import { OrderTypeControl, useLanguage, useOrder, useConfig } from '@components'
import { OText } from '@ui'
import { parseOrderTypesAllowed } from '../../utils/parseOrderTypesAllowed'

const OrderTypeSelectorUI = (props: OrderTypeSelectParams) => {
  const {
    typeSelected,
    handleChangeOrderType,
    setOrderTypeValue
  } = props

  const theme = useTheme()
  const [orderState, { changeMoment }] = useOrder()
  const [, t] = useLanguage()
  const [{ configs }] = useConfig()

  const typeLoading = useRef(false)

  const configTypes = parseOrderTypesAllowed(configs?.order_types_allowed?.value)
  const pickupTypes = PICKUP_TYPES.filter(t => configTypes.includes(t))

  const handleChangeOrderTypeCallback = async (orderType: number) => {
    if (!orderState.loading) {
      typeLoading.current = true
      setOrderTypeValue && setOrderTypeValue(orderType)
      const value = await handleChangeOrderType(orderType)
    }
  }

  useEffect(() => {
    if (!orderState.loading) {
      typeLoading.current = false
    }
  }, [orderState.loading])

  return (
    <Container>
      <WrapperMainBtns>
        <OTButton
          left
          activeOpacity={1}
          isLoading={orderState.loading && typeLoading.current}
          selected={typeSelected === ORDER_TYPES[0]?.value}
          onPress={() => handleChangeOrderTypeCallback(ORDER_TYPES[0]?.value)}
        >
          <OText
            size={theme.utils.tsize.m}
            style={{
              color: typeSelected === ORDER_TYPES[0]?.value ? theme?.colors?.white : theme?.colors?.primary,
              textAlign: 'center'
            }}
          >
            {orderState.loading && typeSelected === ORDER_TYPES[0]?.value && typeLoading.current
              ? <ActivityIndicator color={'#FFF'} size="small" />
              : t(ORDER_TYPES[0]?.content)}
          </OText>
        </OTButton>
        <OTButton
          activeOpacity={1}
          selected={pickupTypes.includes(typeSelected ?? 1)}
          isLoading={orderState.loading && typeLoading.current}
          onPress={() => handleChangeOrderTypeCallback(ORDER_TYPES[1]?.value)}
        >
          <OText
            size={theme.utils.tsize.m}
            style={{
              color: pickupTypes.includes(typeSelected ?? 1) ? theme?.colors?.white : theme?.colors?.primary,
              textAlign: 'center'
            }}
          >
            {orderState.loading && typeSelected === ORDER_TYPES[1]?.value && typeLoading.current && pickupTypes.length === 1
              ? <ActivityIndicator color={'#FFF'} size="small" />
              : t(ORDER_TYPES[1]?.content)}
          </OText>
        </OTButton>
      </WrapperMainBtns>
      {pickupTypes.includes(typeSelected ?? 1) && pickupTypes.length > 1 && (
        <WrapperPickupBtns>
          {pickupTypes.map(type => (
            <OTMiniButton
              key={type}
              activeOpacity={1}
              isLoading={orderState.loading && typeLoading.current}
              selected={typeSelected === ORDER_TYPES[type - 1]?.value}
              onPress={() => handleChangeOrderTypeCallback(ORDER_TYPES[type - 1]?.value)}
            >
              <OText
                size={theme.utils.tsize.s}
                style={{
                  color: typeSelected === ORDER_TYPES[type - 1]?.value ? theme?.colors?.white : theme?.colors?.secondaryLightGray,
                  textAlign: 'center'
                }}
              >
                {orderState.loading && typeSelected === type && typeLoading.current
                  ? <ActivityIndicator color={'#FFF'} size="small" />
                  : t(ORDER_TYPES[type - 1]?.content)}
              </OText>
            </OTMiniButton>
          ))}
        </WrapperPickupBtns>
      )}
    </Container>
  )
}

export const OrderTypeSelector = (props: any) => {
  const orderTypeProps = {
    ...props,
    UIComponent: OrderTypeSelectorUI,
    orderTypes: props.orderTypes || ORDER_TYPES,
    disabledUpdateState: true
  }

  return <OrderTypeControl {...orderTypeProps} />
}

import React from 'react'
import { TouchableOpacity } from 'react-native'
import { useTheme } from 'styled-components/native'
import { CommonActions } from '@react-navigation/native';

import { useLanguage, useOrder } from '@components'

import { NavBar, OIcon, ORDER_TYPES, OText, useBusinessSelected } from '@ui'

export const NavBarCustomized = (props: any) => {
  const { backTo, resetNavigation, showBackIcon } = props

  const theme = useTheme()
  const [orderState, { changeType }] = useOrder()
  const [businessSelected] = useBusinessSelected()
  const [, t] = useLanguage()

  const handleChangeOrderType = async (value: number) => {
    changeType(value)
  }

  const handleGoBack = () => {
    if (backTo) {
      resetNavigation ? props.navigation?.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: backTo }],
        })
      ) : props.navigation.navigate(backTo)
      return
    }
    props.navigation?.goBack()
  }

  const IconTitle = () => {
    return (
      <TouchableOpacity
        onPress={() => props.navigation.navigate('OrderTypes')}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: theme?.colors?.backgroundGray100,
          alignSelf: 'flex-start',
          borderRadius: 10,
          paddingHorizontal: 10,
        }}
      >
        <OText
          color={theme?.colors?.primary}
          size={12}
          numberOfLines={1}
        >
          {ORDER_TYPES[0]?.value === orderState?.options?.type
            ? t('DELIVER_NOW', 'DELIVER NOW')
            : t('PICKUP_NOW', 'PICKUP NOW')}
        </OText>
        <OIcon
          url={theme?.images?.general?.chevron_right}
          width={12}
          height={12}
          color={theme?.colors?.primary}
        />
      </TouchableOpacity>
    )
  }

  return (
    <NavBar
      withIcon
      hideArrowLeft={!showBackIcon}
      enableOrderTypes
      orderType={orderState?.options?.type}
      onActionLeft={handleGoBack}
      IconTitle={IconTitle}
      subTitle={businessSelected?.title || businessSelected?.name}
      subTitleStyle={{
        fontSize: 14,
        marginLeft: 10
      }}
      icon={theme?.images?.logos?.logotypeMini}
      iconWidth={34}
      iconHeight={34}
      style={{
        paddingRight: 20,
        paddingLeft: showBackIcon ? 0 : 20,
        height: 50,
        maxHeight: 50
      }}
      titleStyle={{
        color: theme?.colors?.primary,
        fontSize: 10,
        textAlign: 'left'
      }}
      btnStyle={{
        marginLeft: 0,
        paddingLeft: 20,
        height: 45
      }}
      handleChangeOrderType={handleChangeOrderType}
    />
  )
}

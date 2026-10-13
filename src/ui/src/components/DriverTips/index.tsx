import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from 'styled-components/native';

import {
  DTContainer,
  DTCard,
  DTWrapperTips,
  DTForm,
  DTLabel,
  DTWrapperInput
} from './styles'

import {
  DriverTips as DriverTipsController,
  useUtils,
  useLanguage,
  useConfig,
} from '@components';
import { OButton, OInput, OText } from '../shared';

const DriverTipsUI = (props: any) => {
  const {
    driverTip,
    driverTipsOptions,
    isMulti,
    isLoading,
    cart,
    carts,
    isDriverTipUseCustom,
    handlerChangeOption,
    isFixedPrice
  } = props;

  const [{ parsePrice }] = useUtils();
  const theme = useTheme();
  const [, t] = useLanguage();
  const [{ configs }] = useConfig();
  const [customTip, setCustomTip] = useState((!isMulti && isDriverTipUseCustom && !driverTipsOptions.includes(driverTip)) ?? false)
  const currentTip = customTip ? parseFloat(driverTip || 0) > 0 : !!(!customTip && !driverTipsOptions.includes(driverTip) && parseFloat(driverTip || 0))
  const [value, setvalue] = useState('');

  const style = StyleSheet.create({
    semicircle: {
      borderRadius: theme.utils.radius.l,
    },
    inputStyle: {
      flex: 1,
      borderRadius: theme.utils.radius.l,
      borderWidth: 1,
      borderColor: theme.colors.inputDisabled,
      marginRight: 20
    }
  })

  const placeholderCurrency = !isFixedPrice ? `0%` : (configs?.currency_position?.value || 'left') === 'left'
    ? `${configs?.format_number_currency?.value}0`
    : `0${configs?.format_number_currency?.value}`

  const handleChangeDriverTip = (val: any) => {
    const tip = Number(val)
    if ((isNaN(tip) || tip < 0)) {
      setvalue(value)
      return
    }
    setvalue(val)
  }

  const multiCartTipsAmmout = carts?.reduce((total: any, cart: any) => {
    return total + parseFloat(cart?.driver_tip || 0)
  }, 0)

  return (
    <DTContainer>
      <DTLabel>
        {t('CUSTOM_DRIVER_TIP_MESSAGE', '100% of these tips go directly to your driver')}
      </DTLabel>
      <DTWrapperTips>
        {driverTipsOptions.map((option: any, i: number) => (
          <TouchableOpacity
            key={i}
            onPress={() => {
              if (!isLoading) {
                handlerChangeOption(option)
                setCustomTip(false)
              }
            }}
          >
            <DTCard
              style={style.semicircle}
              isActive={(option === driverTip && !customTip)}
            >
              <OText
                numberOfLines={2}
                color={(option === driverTip && !customTip) ? theme?.colors?.white : theme.colors.secondaryLightGray}
              >
                {`${isFixedPrice ? parsePrice(option) : `${option}%`}`}
              </OText>
            </DTCard>
          </TouchableOpacity>
        ))}
        {isDriverTipUseCustom && (
          <TouchableOpacity
            onPress={() => { !isLoading && setCustomTip(true) }}
          >
            <DTCard
              style={style.semicircle}
              isActive={customTip}
            >
              <OText
                numberOfLines={2}
                color={customTip ? theme?.colors?.white : theme.colors.secondaryLightGray}
              >
                {t('CUSTOM_TIP', 'Custom')}
              </OText>
            </DTCard>
          </TouchableOpacity>
        )}
      </DTWrapperTips>
      {customTip && (
        <DTForm>
          <DTWrapperInput>
            <OInput
              placeholder={placeholderCurrency}
              style={style.inputStyle}
              value={value}
              type={'numeric'}
              onChange={handleChangeDriverTip}
              autoCapitalize='none'
              autoCorrect={false}
              inputStyle={{ fontSize: theme.utils.tsize.s }}
            />
            <OButton
              text={t('APPLY', 'Apply')}
              textStyle={{ fontSize: theme.utils.tsize.s }}
              imgRightSrc={null}
              style={{ borderRadius: theme.utils.radius.l, height: 44 }}
              isDisabled={parseFloat(value || '0') < 0 || parseFloat(value || '0') === driverTip || value === ''}
              onClick={() => {
                handlerChangeOption(value)
                setvalue('')
              }}
            />
          </DTWrapperInput>
        </DTForm>
      )}
      {currentTip && (
        <OText
          color={theme.colors.primary}
          size={16}
          style={{ marginTop: 10, textAlign: 'center' }}
        >
          {t('CURRENT_DRIVER_TIP_AMOUNT', 'Current driver tip amount')}{!isFixedPrice &&
            ` (${driverTip}%)`}: {isFixedPrice ? parsePrice(multiCartTipsAmmout ?? driverTip) : parsePrice(multiCartTipsAmmout ?? cart?.driver_tip)}
        </OText>
      )}
    </DTContainer>
  )
}


export const DriverTips = (props: any) => {
  const driverTipsProps = {
    ...props,
    UIComponent: DriverTipsUI
  }

  return <DriverTipsController {...driverTipsProps} />
}

import React, { useEffect, useRef, useState } from 'react';
import PhoneInput from "react-native-phone-number-input";
import { Pressable, StyleSheet, View } from 'react-native';
import { useTheme } from 'styled-components/native';

import { Wrapper } from './styles'
import { findExitingCode, transformCountryCode } from '../../utils'
import { PhoneInputParams } from '../../types';
import CountryFlag from 'react-native-country-flag';
import { useLanguage, useConfig } from '@components';
import { OIcon, OText, OModal } from '@ui';

export const PhoneInputNumber = (props: PhoneInputParams) => {
  const {
    data,
    handleData,
    defaultValue,
    defaultCode,
    forwardRef,
    textInputProps,
    boxStyle,
    inputStyle,
    textStyle,
    flagStyle,
    noDropIcon,
    isDisabled,
    isStartValidation,
    changeCountry,
    updateStateWithSubmit,
    defaultCodeFallback
  } = props

  const theme = useTheme();

  const [, t] = useLanguage()
  const [{ configs }] = useConfig()
  const phoneInput = useRef<PhoneInput>(null);
  const [userphoneNumber, setUserphoneNumber] = useState('');
  const [countryPhoneSuboptions, setCountryPhoneSuboptions] = useState({
    open: false,
    options: []
  })
  const isDisableNumberValidation = parseInt(configs?.validation_phone_number_lib?.value ?? 1, 10)
  const countriesWithSubOptions = ['PR']
  const style = StyleSheet.create({
    input: {
      backgroundColor: theme.colors.white,
      borderRadius: theme.utils.radius.l,
      borderWidth: 1,
      borderColor: (isStartValidation && userphoneNumber === '') ? theme.colors.danger5 : theme.colors.border,
      paddingBottom: 0,
      paddingTop: 0,
      flexGrow: 1,
      flex: 1,
      height: 50,
    },
    countryBtn: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.utils.radius.l,
      marginEnd: 9,
    }
  })

  const [_defaultCode, setDefaultCode] = useState<any>(() => {
    if (defaultCode) {
      return !isNaN(defaultCode)
        ? transformCountryCode(defaultCode)
        : findExitingCode(defaultCode)
    }
    return findExitingCode(configs?.default_country_code?.value?.toUpperCase())
  });

  useEffect(() => {
    let newDefaultCode;
    if (defaultCode) {
      newDefaultCode = !isNaN(defaultCode)
        ? transformCountryCode(defaultCode)
        : findExitingCode(defaultCode)
    } else {
      newDefaultCode = findExitingCode(configs?.default_country_code?.value?.toUpperCase())
    }
    setDefaultCode(newDefaultCode);
  }, [defaultCode, configs?.default_country_code?.value]);

  const handleChangeNumber = (number: any) => {
    if ((number.split('+').length - 1) > 1) {
      const secondPlusIndex = number.indexOf('+', number.indexOf('+') + 1)
      number = number.slice(secondPlusIndex)
      const currentCallingCode = number.split(' ')[0]?.replace('+', '')
      phoneInput.current?.setState({
        code: currentCallingCode,
        number: number.replace(`+${currentCallingCode}`, '').replace(/[()\-\s]/g, ''),
        countryCode: !isNaN(currentCallingCode)
          ? transformCountryCode(currentCallingCode)
          : findExitingCode(currentCallingCode)
      })
    }
    setUserphoneNumber(number.replace(/[()\-\s]/g, ''))
  }

  useEffect(() => {
    if ((defaultValue && userphoneNumber) || !defaultValue) {
      if (userphoneNumber) {
        const checkValid = phoneInput.current?.isValidNumber(userphoneNumber);
        const callingCode = phoneInput.current?.getCallingCode();
        const formattedNumber = phoneInput.current?.getNumberAfterPossiblyEliminatingZero();
        const regex = /^[0-9]*$/
        const cellphone = userphoneNumber.slice(0, 0) + userphoneNumber.slice(1, userphoneNumber.length)
        const validNumber = regex.test(cellphone)
        if (((!checkValid && formattedNumber?.number) || !validNumber) && !!isDisableNumberValidation) {
          handleData && handleData({
            ...data,
            error: t('INVALID_ERROR_PHONE_NUMBER', 'The Phone Number field is invalid')
          })
          return
        }
        handleData && handleData({
          ...data,
          error: '',
          phone: {
            country_phone_code: callingCode,
            cellphone: !isDisableNumberValidation ? cellphone.slice(callingCode?.length) : formattedNumber?.number
          }
        })
      } else {
        handleData && handleData({
          ...data,
          error: '',
          phone: {
            country_phone_code: null,
            cellphone: null
          }
        })
      }
    }
  }, [userphoneNumber])

  useEffect(() => {
    if (defaultValue && updateStateWithSubmit) {
      phoneInput.current?.setState({
        number: defaultValue,
        countryCode: _defaultCode?.countryCode
      })
    }
  }, [defaultValue])

  useEffect(() => {
    if (defaultCodeFallback && countriesWithSubOptions.includes(defaultCode) && phoneInput.current) {
      phoneInput.current?.setState({
        ...phoneInput.current.state,
        code: `${defaultCodeFallback}`
      })
    }
  }, [phoneInput.current])

  const _changeCountry = (c: any) => {
    changeCountry?.(c)
    if (c.callingCode?.length > 1) {
      setCountryPhoneSuboptions({
        open: true,
        options: c.callingCode
      })
    }
  }

  const handleSelectCallingCode = (option: any) => {
    setCountryPhoneSuboptions({ open: false, options: [] })
    handleChangeNumber(`+${option}`)
    phoneInput.current?.setState({
      ...phoneInput.current.state,
      code: `${option}`
    })
  }

  return (
    <Wrapper onPress={() => forwardRef?.current?.focus?.()}>
      {(isStartValidation && userphoneNumber === '') && (
        <OText
          size={14}
          color={theme.colors.danger5}
        >
          {t('VALIDATION_ERROR_MOBILE_PHONE_REQUIRED', 'The field Mobile phone is required').replace('_attribute_', t('CELLPHONE', 'Cellphone'))}*
        </OText>
      )}
      <PhoneInput
        ref={phoneInput}
        disabled={isDisabled}
        defaultValue={userphoneNumber || defaultValue}
        defaultCode={_defaultCode?.countryCode}
        onChangeFormattedText={(text: string) => handleChangeNumber(text)}
        withDarkTheme
        onChangeCountry={(country: any) => _changeCountry?.(country)}
        countryPickerProps={{
          withAlphaFilter: true,
          withEmoji: false,
          renderFlagButton: (p: any) => (
            <CountryFlag
              isoCode={p.countryCode || _defaultCode?.countryCode || configs?.default_country_code?.value || 'US'}
              size={17}
            />
          )
        }}
        textContainerStyle={{ ...style.input, ...(inputStyle || {}) }}
        textInputStyle={textStyle}
        codeTextStyle={textStyle}
        flagButtonStyle={flagStyle}
        countryPickerButtonStyle={{ ...style.countryBtn, ...boxStyle ? boxStyle : {} }}
        placeholder={t('PHONE_NUMBER', 'Phone Number')}
        textInputProps={{
          keyboardType: 'number-pad',
          autoComplete: 'tel',
          textContentType: 'telephoneNumber',
          dataDetectorTypes: 'phoneNumber',
          ref: forwardRef,
          ...textInputProps
        }}
        containerStyle={{ width: '100%' }}
        renderDropdownImage={noDropIcon
          ? <View />
          : <OIcon src={theme.images.general.arrow_down} width={13} color={'#B1BCCC'} style={{ marginLeft: 10 }}/>}
      />
      {!!data?.error && (
        <OText
          size={14}
          color={theme.colors.error}
          style={{ textAlign: 'center', marginTop: 5 }}
        >
          {data.error}
        </OText>
      )}
      <OModal
        open={countryPhoneSuboptions.open}
        onClose={() => setCountryPhoneSuboptions({
          open: false,
          options: []
        })}
        title={t('SELECT_THE_PHONE_CODE', 'Select the phone code')}
        entireModal
      >
        <View
          style={{
            alignItems: 'center'
          }}
        >
          {countryPhoneSuboptions.options.map((option: any) => (
            <Pressable
              style={{
                margin: 10,
                padding: 10,
                borderBottomColor: '#ccc',
                borderBottomWidth: 1,
                width: '100%'
              }}
              key={option}
              onPress={() => handleSelectCallingCode(option)}
            >
              <OText>
                {`+${option}`}
              </OText>
            </Pressable>
          ))}
        </View>
      </OModal>
    </Wrapper>
  )
}

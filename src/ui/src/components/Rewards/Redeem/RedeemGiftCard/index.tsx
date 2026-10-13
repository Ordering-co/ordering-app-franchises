import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form'
import { useTheme } from 'styled-components/native';

import { Container, FormController } from './styles'
import { useLanguage, useUtils, RedeemGiftCard as RedeemGiftCardController } from '@components'
import { OText, OInput, FloatingButton } from '@ui';

const RedeemGiftCardUI = (props: any) => {
  const {
    actionState,
    redeemedGiftCard,
    handleApply
  } = props

  const theme = useTheme()
  const [, t] = useLanguage()
  const { handleSubmit, control, errors } = useForm()
  const [{ parsePrice }] = useUtils()

  const [codeValue, setCodeValue] = useState('')

  const style = StyleSheet.create({
    btnStyle: {
      borderRadius: theme.utils.radius.l,
      height: 44,
      marginTop: 20
    },
    inputStyle: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.utils.radius.l,
    },
  })

  const onSubmit = (values: any) => {
    if (actionState.loading) return
    handleApply(values)
  }

  const handleChangeCode = (string: any) => {
    string = string.replace(/-/g, '')
    if (!string) return
    const codeSlices = string.match(/.{1,4}/g)
    string = codeSlices.join('-')
    setCodeValue(string)
  }

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const list = Object.values(errors)
      let stringError = ''
      list.map((item: any, i: number) => {
        stringError += (i + 1) === list.length ? `${item.message}` : `${item.message}\n`
      })
      Alert.alert(
        t('ERROR', 'Error'),
        stringError,
        [
          { text: t('OK', 'oK'), onPress: () => { } }
        ]
      )
    }
  }, [errors])

  useEffect(() => {
    if (!actionState.error) return
    let stringError = ''
    if (typeof actionState.error === 'string') {
      stringError = actionState.error
    } else {
      actionState.error.map((item: any) => {
        stringError += `${item}\n`
      })
    }
    Alert.alert(
      t('ERROR', 'Error'),
      stringError,
      [
        { text: t('OK', 'oK'), onPress: () => { } }
      ]
    )
  }, [actionState.error])

  return (
    <>
      <Container>
        {!redeemedGiftCard ? (
          <View>
            <FormController>
              <OText color={theme.colors.textNormal} size={14} mBottom={10}>
                {t('GIFT_CARD_CODE', 'Gift card code')}
              </OText>
              <Controller
                control={control}
                render={({ onChange }: any) => (
                  <OInput
                    placeholder='XXXX-XXXX-XXXX-XXXX'
                    value={codeValue}
                    onChange={(val: any) => {
                      onChange(val)
                      handleChangeCode(val)
                    }}
                    autoCapitalize='characters'
                    autoCorrect={false}
                    blurOnSubmit={false}
                    style={style.inputStyle}
                  />
                )}
                name='code'
                rules={{
                  required: t('VALIDATION_ERROR_CODE_REQUIRED', 'Code is required').replace('_attribute_', t('CODE', 'Code'))
                }}
                defaultValue=""
              />
            </FormController>
            <FormController>
              <OText color={theme.colors.textNormal} size={14} mBottom={10}>{t('PASSWORD', 'Password')}</OText>
              <Controller
                control={control}
                render={({ onChange, value }: any) => (
                  <OInput
                    isSecured
                    placeholder={t('PASSWORD', 'Password')}
                    value={value}
                    onChange={(val: any) => onChange(val)}
                    autoCapitalize='none'
                    autoCompleteType='password'
                    autoCorrect={false}
                    blurOnSubmit={false}
                    style={style.inputStyle}
                  />
                )}
                name='password'
                rules={{
                  required: t('VALIDATION_ERROR_PASSWORD_REQUIRED', 'Password is required').replace('_attribute_', t('PASSWORD', 'Password'))
                }}
                defaultValue=""
              />
            </FormController>
          </View>
        ) : (
          <View>
            <OText color={theme.colors.textNormal} size={14} mBottom={6}>{t('TYPE', 'Type')}: {redeemedGiftCard?.type}</OText>
            <OText color={theme.colors.textNormal} size={14} mBottom={6}>{t('AMOUNT', 'Amount')}: {parsePrice(redeemedGiftCard?.amount)}</OText>
            <OText color={theme.colors.textNormal} size={14} mBottom={6}>{t('FROM', 'From')}: {redeemedGiftCard?.receiver?.name} {redeemedGiftCard?.receiver?.lastname}</OText>
            {!!redeemedGiftCard?.title && <OText color={theme.colors.textNormal} size={14} mBottom={6}>{t('TITLE', 'Title')}: {redeemedGiftCard?.title}</OText>}
            {!!redeemedGiftCard?.message && <OText color={theme.colors.textNormal} size={14} mBottom={6}>{t('MESSAGES', 'Messages')}: {redeemedGiftCard?.message}</OText>}
          </View>
        )}
      </Container>
      {!redeemedGiftCard && (
        <FloatingButton
          disabled={actionState.loading}
          loading={actionState.loading}
          text={t('APPLY_TO_YOUR_BALANCE', 'Apply to your balance')}
          handleClick={handleSubmit(onSubmit)}
        />
      )}
    </>
  )
}

export const RedeemGiftCard = (props: any) => {
  const redeemGiftCardProps = {
    ...props,
    UIComponent: RedeemGiftCardUI
  }
  return <RedeemGiftCardController {...redeemGiftCardProps} />
}

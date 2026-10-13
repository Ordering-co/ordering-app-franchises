import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useTheme } from 'styled-components/native';

import { PCContainer, PCForm, PCWrapper } from './styles';
import { useUtils, useLanguage } from '@components';
import { OInput, OText } from '@ui';

export const PaymentOptionCash = (props: any) => {
  const {
    defaultValue,
    orderTotal,
    setCashState,
  } = props;

  const theme = useTheme();

  const styles = StyleSheet.create({
    inputsStyle: {
      borderColor: theme.colors.border,
      borderRadius: theme.utils.radius.l,
      marginTop: 10,
      width: '100%',
      height: 50,
      maxHeight: 50
    },
    errorMsg: {
      marginTop: 10,
      color: theme.colors.error,
      fontSize: theme.utils.tsize.m,
      fontWeight: '600',
      textAlign: 'center'
    }
  });

  const [, t] = useLanguage();
  const [{ parsePrice }] = useUtils();
  const { control } = useForm();

  const [value, setvalue] = useState(defaultValue?.toString() || '');
  let timeout: any = null;

  const onChangeCash = (value: any) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      let cash: any = parseFloat(value)
      cash = isNaN(cash) ? '' : cash
      setvalue(`${cash}`)
      setCashState({ value: `${cash}` })
    }, 750)
  }

  return (
    <PCContainer>
      <PCForm>
        <PCWrapper>
          <OText size={theme.utils.tsize.m} weight={'400'} color={theme.colors.textNormal} style={{ textAlign: 'center', marginBottom: 10 }}>
            {t('NOT_EXACT_CASH_AMOUNT', 'Don\'t have exact amount? Let us know with how much will you pay')}
          </OText>
          <Controller
            control={control}
            name='cash'
            defaultValue={value}
            render={() => (
              <OInput
                name='cash'
                placeholder='0'
                style={styles.inputsStyle}
                value={value}
                onChange={(val: any) => onChangeCash(val?.target.value)}
                type='numeric'
                returnKeyType='done'
              />
            )}
          />
        </PCWrapper>
        {!!value && parseFloat(value) < orderTotal && (
          <OText style={styles.errorMsg}>
            {`${t('VALUE_GREATER_THAN_TOTAL', 'This value must be greater than order total')}: ${parsePrice(orderTotal)}`}
          </OText>
        )}
      </PCForm>
    </PCContainer>
  )
}

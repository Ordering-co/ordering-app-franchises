import React from 'react'
import { View } from 'react-native'
import { useTheme } from 'styled-components/native'

import { PIBtn, PIContainer, PIContent, PIText } from './styles'

import { useLanguage } from '@components'
import { getPayIcon, OIcon, OText } from '@ui'

export const SectionItem = (props: any) => {
  const { textToShow, btnText, paySelected, isDisabled, onRedirect, secondTextToShow } = props

  const theme = useTheme()
  const [, t] = useLanguage()

  return (
    <PIContainer bt={props.bt}>
      <PIContent>
        {textToShow ? (
          <View>
            <OText color={theme.colors.textNormal} weight={600}>
              {textToShow}
            </OText>
            {!!secondTextToShow && (
              <OText color={theme.colors.textNormal} weight={600} numberOfLines={2} ellipsizeMode='tail'>
                {secondTextToShow}
              </OText>
            )}
          </View>
        ) : (
          <>
            {paySelected?.gateway ? (
              <>
                <OIcon
                  width={30}
                  height={30}
                  src={getPayIcon(paySelected.gateway, theme)}
                />
                <PIText>
                  <OText
                    size={theme.utils.tsize.m - 1}
                    color={theme.colors.textNormal}
                    weight={'700'}
                    style={{ textTransform: 'capitalize' }}
                  >
                    {t(
                      (paySelected?.data?.brand ?? paySelected?.data?.card?.brand ?? paySelected?.gateway ?? paySelected?.name).toUpperCase(),
                      paySelected?.data?.brand ?? paySelected?.data?.card?.brand ?? paySelected?.gateway ?? paySelected?.name)
                    }
                  </OText>
                  {(paySelected?.data?.last4 || paySelected?.data?.card?.last4) && (
                    <OText color={theme.colors.textNormal}>
                      ****{paySelected?.data?.last4 ?? paySelected?.data?.card?.last4}
                    </OText>
                  )}
                </PIText>
              </>
            ) : (
              <OText color={theme.colors.danger5} weight={600}>
                {t('SELECT_PAYMENT_WARNING', 'Select a payment method')}
              </OText>
            )}
          </>
        )}
      </PIContent>
      {onRedirect && !isDisabled && (
        <PIBtn
          activeOpacity={0.7}
          onPress={() => onRedirect()}
        >
          <OText
            color={theme.colors.primary}
            style={{ textDecorationLine: 'underline', textAlign: 'right' }}
          >
            {btnText ?? t('CHANGE', 'change')}
          </OText>
        </PIBtn>
      )}
    </PIContainer>
  )
}

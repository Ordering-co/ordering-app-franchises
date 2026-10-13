import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useTheme } from 'styled-components/native'
import FastImage from 'react-native-fast-image'

import {
  SingleOfferContainer,
  OfferInformation
} from './styles'

import { useUtils, useLanguage } from '@components'
import { OButton, OText } from '@ui'

export const Offer = (props: any) => {
  const { offer, handleClick } = props

  const theme = useTheme()
  const [, t] = useLanguage()
  const [{ parseDate, optimizeImage }] = useUtils()

  const styles = StyleSheet.create({
    buttonStyle: {
      height: 35,
      paddingLeft: 0,
      paddingRight: 0,
      borderWidth: 1,
      marginTop: 10
    }
  })

  return (
    <SingleOfferContainer>
      {!!offer?.image && (
        <FastImage
          style={{ height: 80, width: 80, aspectRatio: 1, borderRadius: 50 }}
          source={{
            uri: optimizeImage(offer?.image, 'h_1024,c_limit'),
            priority: FastImage.priority.normal,
          }}
        />
      )}
      <OfferInformation width={offer?.image ? '70%' : '100%'}>
        <OText
          size={theme.utils.tsize.m}
          numberOfLines={2}
          style={{ marginBottom: 5 }}
        >
          {offer?.name}
        </OText>
        {!!offer?.description && (
          <OText
            color={theme.colors.disabled}
            size={theme.utils.tsize.xs}
            numberOfLines={2}
            style={{ marginBottom: 5 }}
          >
            {offer?.description}
          </OText>
        )}
        <OText
          color={theme.colors.textNormal}
          size={theme.utils.tsize.xs}
          style={{ marginBottom: 5 }}
        >
          {t('EXPIRES', 'Expires')} {parseDate(offer?.end, { outputFormat: 'MMM DD, YYYY' })}
        </OText>
        <OButton
          onClick={() => handleClick(offer)}
          text={t('VIEW_BENEFITS', 'View Benefits')}
          bgColor={theme.colors.white}
          borderColor={theme.colors.primary}
          style={styles.buttonStyle}
          textStyle={{ fontSize: 12, color: theme.colors.primary, fontWeight: 'normal' }}
        />
      </OfferInformation>
    </SingleOfferContainer>
  )
}

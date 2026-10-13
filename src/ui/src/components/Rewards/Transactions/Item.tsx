import React from 'react'
import { StyleSheet, Dimensions } from 'react-native';
import { useTheme } from 'styled-components/native'
import FastImage from 'react-native-fast-image';

import {
  ItemContainer,
  ItemDateBlock,
  ItemDescriptionBlock,
  ItemIcon,
  ItemText,
  ItemContent,
  ItemRight
} from './styles'
import { useLanguage, useUtils } from '@components'
import { OText } from '@ui';

const WIDTH_SCREEN = Dimensions.get('screen').width
// paddingLeft + paddginRight + widthIcon + marginLeft
const widthElements = 20 + 20 + 53 + 10

export const TransactionItem = (props: any) => {
  const {
    item,
    withFormatPrice
  } = props

  const theme = useTheme()
  const [{ parsePrice, parseDate }] = useUtils()
  const [, t] = useLanguage()

  return (
    <ItemContainer>
      <ItemDateBlock>
        <ItemIcon>
          <FastImage
            source={item?.amount > 0 ? theme.images.general.arrow_up : theme.images.general.arrow_down}
            resizeMode={FastImage.resizeMode.contain}
            style={styles.icon}
          />
        </ItemIcon>
        <ItemRight style={{ width: WIDTH_SCREEN - widthElements }}>
          <ItemContent>
            <ItemText>
              <OText color={theme.colors.disabled}>{parseDate(item?.created_at)}</OText>
              <OText
                color={item?.amount > 0 ? theme.colors.success500 : theme.colors.danger5}
                weight={600}
              >
                {item?.amount > 0 && '+ '}{withFormatPrice ? parsePrice(item?.amount) : item?.amount}
              </OText>
            </ItemText>
          </ItemContent>
          {!!item?.description && (
            <ItemDescriptionBlock>
              <OText>{item?.description}</OText>
            </ItemDescriptionBlock>
          )}
        </ItemRight>
      </ItemDateBlock>
    </ItemContainer>
  )
}

const styles = StyleSheet.create({
  icon: {
    width: 25,
    height: 25
  }
})

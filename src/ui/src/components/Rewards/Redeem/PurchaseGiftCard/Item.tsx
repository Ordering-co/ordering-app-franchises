import React from 'react'
import { View } from 'react-native'
import { useTheme } from 'styled-components/native'

import { GiftCardItem } from './styles'
import { OIcon, OText } from '@ui'
import { Fade, Placeholder, PlaceholderLine, PlaceholderMedia } from 'rn-placeholder'

export const GiftCard = ({
  product,
  isSkeleton,
  selectedProduct,
  setSelectedProduct
}: any) => {
  const theme = useTheme()

  return (
    !isSkeleton ? (
      <GiftCardItem
        activeOpacity={0.7}
        onPress={() => setSelectedProduct(product)}
      >
        <View style={{ marginRight: 10 }}>
          <OIcon
            src={selectedProduct?.id === product.id ? theme.images.general.radio_act : theme.images.general.radio_nor}
            color={selectedProduct?.id === product.id ? theme.colors.primary : theme.colors.disabled}
            width={16}
          />
        </View>
        <OText>
          {product.name}
        </OText>
      </GiftCardItem>
    ) : (
      <GiftCardItem
        activeOpacity={0.7}
      >
        <Placeholder Animation={Fade}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <PlaceholderMedia size={16} isRound />
            <PlaceholderLine width={80} height={20} style={{ marginBottom: 0, marginLeft: 10 }} />
          </View>
        </Placeholder>
      </GiftCardItem>
    )
  )
}

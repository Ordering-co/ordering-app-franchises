import React from 'react'
import { View } from 'react-native'
import { useTheme } from 'styled-components/native'

import { ProfessionalBlock, ProfessionalPhoto } from './styles'
import { OIcon, OText, ProductItemAccordion } from '@ui'

export const ProductList = (props: any) => {
  const { order } = props

  const theme = useTheme()

  const professionalList = order?.products.reduce((prev: any, current: any) => {
    const found = prev.find((item: any) => item.id === current?.calendar_event?.professional?.id)
    if (found || !current?.calendar_event) {
      return prev
    }
    return [...prev, current?.calendar_event?.professional]
  }, [])

  return (
    <>
      {professionalList?.length > 0 && professionalList.map((professional: any, i: number) => (
        <ProfessionalBlock>
          <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
            {professional?.photo ? (
              <ProfessionalPhoto
                source={{ uri: professional?.photo }}
                imageStyle={{ borderRadius: 8 }}
              />
            ) : (
              <OIcon
                src={theme.images.general.user}
                cover={false}
                width={80}
                height={80}
              />
            )}
            <OText size={12} lineHeight={18} weight={'500'} numberOfLines={1}>{professional?.name} {professional?.lastname}</OText>
          </View>
          {order?.products.filter((product: any) => product?.calendar_event?.professional?.id === professional?.id).map((product: any, i: number) => (
            <ProductItemAccordion
              key={product?.id || i}
              isFromCheckout
              hideProductOptions
              hideProductImage
              product={product}
            />
          ))}
        </ProfessionalBlock>
      ))}
      {order?.products.filter((product: any) => !product?.calendar_event).map((product: any, i: number) => (
        <ProductItemAccordion
          isFromCheckout
          hideProductImage
          hideProductOptions
          key={product?.id || i}
          product={product}
        />
      ))}
    </>
  )
}

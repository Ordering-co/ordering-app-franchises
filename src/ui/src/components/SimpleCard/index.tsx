import React from 'react'
import FastImage from 'react-native-fast-image'
import { useTheme } from 'styled-components/native'

import { CategoryCardContainer, CategoryCardImg, CategoryCardTitle } from './styles'
import { DeviceOrientationMethods, OIcon, OText } from '@ui'
import { View } from 'react-native'

export const SimpleCard = (props: any) => {
  const {
    element,
    title,
    showIcon,
    isFirstChild,
    imageSource,
    onClick
  } = props

  const theme = useTheme()
  const { useDeviceOrientation } = DeviceOrientationMethods
  const [orientationState] = useDeviceOrientation()

  const WIDTH_SCREEN = orientationState?.dimensions?.width
  const HEIGHT_SCREEN = orientationState?.dimensions?.height

  const widthContainer = (WIDTH_SCREEN * (isFirstChild ? 1 : 0.43) - (isFirstChild ? theme.utils.margins.horizontal * 2 : 0))
  const heightContainer = HEIGHT_SCREEN * 0.2

  return (
    <CategoryCardContainer
      activeOpacity={1}
      style={{ width: widthContainer, height: heightContainer }}
      onPress={() => onClick(element)}
    >
      <CategoryCardImg>
        <FastImage
          style={{
            width: widthContainer,
            height: heightContainer * 0.7,
            borderTopLeftRadius: theme.utils.radius.l,
            borderTopRightRadius: theme.utils.radius.l
          }}
          source={typeof imageSource === 'string' ? {
            uri: imageSource,
            priority: FastImage.priority.normal,
          } : imageSource}
          resizeMode={FastImage.resizeMode.cover}
        />
      </CategoryCardImg>
      <CategoryCardTitle style={{ height: heightContainer * 0.3 }}>
        <View style={{ width: showIcon ? '70%' : '90%' }}>
          <OText
            size={theme.utils.tsize.s}
            weight={'bold'}
            color={theme.colors.white}
            style={{ textAlign: showIcon ? 'left' : 'center' }}
            numberOfLines={2}
          >
            {title}
          </OText>
        </View>
        {showIcon && (
          <OIcon
            src={theme.images.general.tag_plus}
            color={theme.colors.white}
            width={20}
            height={20}
          />
        )}
      </CategoryCardTitle>
    </CategoryCardContainer>
  )
}

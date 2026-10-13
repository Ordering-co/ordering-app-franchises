import React from 'react'
import FastImage from 'react-native-fast-image'
import { useTheme } from 'styled-components/native'

import { BenefitItem, BenefitsContainer, BenefitsList, BenefitsWrapper } from './styles'
import { AnimatedItem, OText } from '@ui'
import { FlatList } from 'react-native'

export const Benefits = (props: any) => {
  const { title, image, benefits } = props

  const theme = useTheme()

  return (
    <BenefitsWrapper showsVerticalScrollIndicator={false}>
      <BenefitsContainer>
        <OText
          color={theme.colors.textNormal}
          size={theme.utils.tsize.l}
          weight={600}
        >
          {title}
        </OText>
        {!!image && (
          <FastImage
            source={{
              uri: image,
              priority: FastImage.priority.normal
            }}
            style={{ width: 200, height: 200 }}
            resizeMode={FastImage.resizeMode.contain}
          />
        )}
        <BenefitsList>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={benefits}
            keyExtractor={(item: any) => item}
            renderItem={({ item, index }: any) => (
              <AnimatedItem
                index={index}
                item={<BenefitElement benefit={item} index={index + 1} />}
              />
            )}
          />
        </BenefitsList>
      </BenefitsContainer>
    </BenefitsWrapper>
  )
}

const BenefitElement = ({ index, benefit }: any) => {
  const theme = useTheme()

  return (
    <BenefitItem>
      <OText
        color={theme.colors.primary}
        size={theme.utils.tsize.l}
        weight={'bold'}
      >
        {index}{'.'}
      </OText>
      <OText
        color={theme.colors.textNormal}
        weight={400}
        style={{ marginLeft: 10 }}
      >
        {benefit}
      </OText>
    </BenefitItem>
  )
}

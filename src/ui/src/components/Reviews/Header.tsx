import React, { useEffect, useState } from 'react'
import { useTheme } from 'styled-components/native'

import { Container, BusinessLogo, WrapperMsg, StarRatingContainer } from './styles'
import { useLanguage } from '@components'
import { OIcon, OText } from '@ui'
import { TouchableOpacity, View } from 'react-native'

export const HeaderReview = (props: any) => {
  const { order, type, reviewed, handleChangeStars } = props

  const theme = useTheme()
  const [, t] = useLanguage()

  const logo = type === 'order' ? order?.business?.logo : order?.driver?.photo
  const defaultLogo = type === 'order' ? theme.images.dummies.businessLogo : theme.images.dummies.driverPhoto

  const name = type === 'order' ? order?.business?.name : order?.driver?.name

  const message = t('HOW_WAS_YOUR_ORDER', 'How was your order?')

  return (
    <Container>
      <BusinessLogo>
        <OIcon
          {...(logo ? { url: logo } : { src: defaultLogo })}
          width={100}
          height={100}
          style={{ borderRadius: 50 }}
        />
      </BusinessLogo>
      <OText
        color={theme.colors.textNormal}
        size={theme.utils.tsize.m + 2}
        weight={'700'}
      >
        {name}
      </OText>

      {!reviewed && (
        <>
          <WrapperMsg>
            <OText weight={400}>
              {message}
            </OText>
          </WrapperMsg>
          <StarRating defaultStar={props.defaultStar} onRating={(value: number) => handleChangeStars(value)} />
        </>
      )}
    </Container>
  )
}

const StarRating = ({ onRating, defaultStar }: any) => {
  const [rating, setRating] = useState((defaultStar ?? 1) - 1)

  const theme = useTheme()

  const qualificationList = [1, 2, 3, 4, 5]

  const handleRating = (rate: any) => {
    const value = rating === rate && rate === 1 ? 0 : rate
    setRating(value)
    onRating?.(value)
  }

  useEffect(() => {
    setRating(defaultStar - 1 === 0 ? 0 : qualificationList[defaultStar - 1])
  }, [defaultStar])

  return (
    <StarRatingContainer>
      {qualificationList.map((index) => (
        <TouchableOpacity key={index} onPress={() => handleRating(index)} activeOpacity={0.7}>
          <OIcon
            src={index <= rating ? theme.images.general.star_on : theme.images.general.star_off}
            width={30}
            height={30}
          />
        </TouchableOpacity>
      ))}
    </StarRatingContainer>
  );
};




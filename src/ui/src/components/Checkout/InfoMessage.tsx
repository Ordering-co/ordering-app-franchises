import React from 'react'
import { useTheme } from 'styled-components/native'

import { WrapperInfoMessage } from './styles'
import { OText } from '@ui'

export const InfoMessage = (props: any) => {
  const { text, color } = props

  const theme = useTheme()

  return (
    <WrapperInfoMessage>
      <OText size={theme.utils.tsize.s} lineHeight={18} color={color} style={{ textAlign: 'left' }}>
        {text}
      </OText>
    </WrapperInfoMessage>
  )
}

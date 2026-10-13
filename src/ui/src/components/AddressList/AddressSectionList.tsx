import React from 'react'
import { useTheme } from 'styled-components/native'
import { TouchableRipple } from 'react-native-paper'

import { AddressSectionListContainer } from './styles'
import { OIcon, OText } from '@ui'

export const AddressSectionList = (props: any) => {
  const { loading, currentAddress, onClick } = props

  const theme = useTheme()

  return (
    <AddressSectionListContainer>
      <OText
        size={theme.utils.tsize.xs}
        style={{ flex: 1, marginHorizontal: 5 }}
      >
        {currentAddress}
      </OText>
      <TouchableRipple
        onPress={() => onClick()}
      >
        <OIcon
          width={16}
          src={theme.images.general.pencil}
          style={{ marginHorizontal: 4 }}
        />
      </TouchableRipple>
    </AddressSectionListContainer>
  )
}

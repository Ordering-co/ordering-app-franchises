import React, { useState } from 'react'
import { StyleSheet, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

const CardContainerTouchable = styled.TouchableOpacity``

interface Props {
  children: React.ReactChildren | Element,
  style?: Array<ViewStyle> | any,
  onClick: any,
  disabled?: boolean
}

export const CardAnimation = (props: Props) => {
  const {
    children,
    onClick,
    style,
    disabled
  } = props
  const [isPressed, setIsPressed] = useState(false)
  const styles = StyleSheet.create({
    cardAnimation: {
      elevation: isPressed ? 2 : 0,
      shadowColor: '#888',
      shadowOffset: { width: 0, height: 0 },
      shadowRadius: 0,
      shadowOpacity: isPressed ? 0.8 : 0,
      borderRadius: 12,
    }
  })

  const styleProvided = style || []
  return (
    <CardContainerTouchable
      disabled={disabled}
      onPress={onClick}
      activeOpacity={0.8}
      delayPressIn={20}
      onPressIn={() => disabled ? null : setIsPressed(true)}
      onPressOut={() => disabled ? null : setIsPressed(false)}
      style={[
        ...styleProvided,
        styles.cardAnimation
      ]}
    >
      {children}
    </CardContainerTouchable>
  )
}

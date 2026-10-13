import React from 'react'
import styled from 'styled-components/native'
import { Dimensions } from 'react-native'
const windowWidth = Dimensions.get('window').width
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export const Container = styled.View`
  position: absolute;
  flex: 1;
  bottom: 0px;
  left: 0;
  right: 0;
  padding: 10px;
  border-top-width: 1px;
  border-color: ${(props: any) => props.theme.colors.backgroundGray200};
  z-index: 1000;
  background-color: ${(props: any) => props.bgColor ? props.bgColor : '#FFF'};
`

export const FloatingBottomContainer = (props: any) => {
  const insets = useSafeAreaInsets()
  return (
    <Container style={{
      width: windowWidth,
      borderTopWidth: props?.borderTopWidth ?? 1,
      borderRadius: props?.borderRadius ?? 0,
      paddingBottom: insets.bottom || 10,
      ...(props?.isStatic ? { position: 'relative', flexGrow: 0, flexShrink: 0, flexBasis: 'auto' } : {})
    }}>
      {props.children}
    </Container>
  )
}

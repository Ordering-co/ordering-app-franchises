
import * as React from 'react'
import { ImageStyle } from 'react-native'
import styled from 'styled-components/native'

const Wrapper = styled.View``
const SImage = styled.Image`
  tint-color: ${(props: any) => props.theme.colors.primary};
`

interface Props {
  src?: any,
  url?: string | any,
  dummy?: any,
  color?: string,
  width?: number,
  height?: number,
  style?: ImageStyle,
  isWrap?: boolean,
  cover?: boolean,
  children?: any,
  borderRadius?: number,
  containerStyle?: any,
  resizeMode?: string
}

const OImage = (props: Props): React.ReactElement => {
  return (
    <Wrapper style={{
      borderRadius: props.style?.borderRadius,
      overflow: 'hidden',
      marginHorizontal: props.style?.marginHorizontal,
      ...props?.containerStyle
    }}>
      <SImage
        source={
          props.src
            ? props.src
            : props.url
              ? typeof props.url === 'number'
                ? props.url
                : { uri: props.url }
              : props.dummy}
        style={{
          tintColor: props.color,
          flex: props.isWrap ? 1 : 0,
          width: props.width || 22,
          height: props.height || 22,
          marginHorizontal: 0,
          borderRadius: props.borderRadius,
          ...props.style,
        }}
        resizeMode={props.resizeMode || props.cover ? 'cover' : 'contain'}
      >
        {props.children}
      </SImage>
    </Wrapper>
  )
}

const areEqual = (prevProps: { src?: any; color?: string; }, nextProps: { src?: any; color?: string; }) => {
  // return false prevProps.text & nextProps.text are not equal.
  return prevProps.color === nextProps.color && prevProps.src === nextProps.src
}

OImage.defaultProps = {
  width: 26,
  height: 26
}

export default React.memo(OImage, areEqual);

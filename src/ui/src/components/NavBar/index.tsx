import * as React from 'react'
import { TextStyle, View, ViewStyle } from 'react-native'
import { useTheme } from 'styled-components/native'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import FastImage from 'react-native-fast-image'

import { OButton, OText } from '../shared'
import { TitleTopWrapper, Wrapper } from './styles'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
interface Props {
  title?: string,
  subtitle?: any,
  route?: any,
  children?: any,
  onActionLeft?: () => void,
  textStyle?: TextStyle,
  textSubTitleStyle?: ViewStyle,
  style?: ViewStyle,
}

const iconProps = {
  name: 'arrowleft',
  color: 'black',
  size: 26
}

const NavBar = (props: Props) => {
  const theme = useTheme()
  const insets = useSafeAreaInsets()

  const btnBackArrow: TextStyle = {
    borderWidth: 0,
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.white,
    shadowOpacity: 0,
    height: 48,
  }

  const textStyle: TextStyle = {
    fontWeight: 'bold',
    textAlign: props.subtitle ? 'left' : 'center',
    color: theme.colors.textNormal,
    fontSize: props.subtitle ? theme.utils.tsize.m : theme.utils.tsize.l,
    zIndex: theme.utils.zi.l,
    ...props.textStyle
  }

  const textSubTitleStyle: TextStyle = {
    textAlign: props.subtitle ? 'left' : 'center',
    color: theme.colors.disabled,
    fontSize: theme.utils.tsize.s,
    zIndex: theme.utils.zi.l,
    ...props.textSubTitleStyle
  }

  const WrapperTextStyle: TextStyle = {
    height: 55,
    justifyContent: 'flex-end',
    paddingBottom: props.subtitle ? 5 : 17
  }

  return (
    <Wrapper style={[props.style, { paddingTop: insets.top + 25, paddingBottom: 20 }]}>
      {props.onActionLeft && (
        <OButton
          useArrow
          hideBtnShadow
          iconProps={iconProps}
          icon={AntDesignIcon}
          imgRightSrc={null}
          style={btnBackArrow}
          parentStyle={{ position: 'absolute', bottom: 0, left: 0, zIndex: theme.utils.zi.l }}
          onClick={props.onActionLeft}
        />
      )}
      {!props.children && (
        <TitleTopWrapper isSubtitle={!!props.subtitle} onlyLogo={!props.title}>
          {props.title ? (
            <View style={WrapperTextStyle}>
              <OText style={textStyle} numberOfLines={1}>
                {props.title}
              </OText>
              {!!props.subtitle && (
                <OText style={textSubTitleStyle}>
                  {props.subtitle}
                </OText>
              )}
            </View>)
            : (
              <FastImage
                style={{ width: '100%', height: 25 }}
                source={theme.images.logos.logotype}
                resizeMode={FastImage.resizeMode.contain}
              />
            )}
        </TitleTopWrapper>
      )}
      {props.children}
    </Wrapper>
  )
}

const areEqual = (prevProps: Props, nextProps: Props) => {
  return prevProps.route === nextProps.route &&
    JSON.stringify(prevProps.title) === JSON.stringify(nextProps.title)
}

export default React.memo(NavBar, areEqual);

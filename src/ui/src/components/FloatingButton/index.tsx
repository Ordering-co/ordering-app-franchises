import React from 'react'
import { ActivityIndicator, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from 'styled-components/native'

import { Container } from './styles'
import { FloatingButtonParams } from '../../types'
import { OButton } from '../shared'

export const FloatingButton = (props: FloatingButtonParams) => {
  const {
    text,
    loading,
    disabled,
    handleClick,
    hideBtn,
    text2nd,
    loading2nd,
    disabled2nd,
    handle2ndClick,
    secondaryBtn,
    secondary2ndBtn
  } = props

  const { bottom } = useSafeAreaInsets()

  const theme = useTheme()

  const secondaryBtnProps = {
    textStyle: { color: theme.colors.primary, fontSize: theme.utils.tsize.m },
    borderColor: theme.colors.primary,
    bgColor: theme?.colors?.white
  }

  return (
    <Container
      style={{
        paddingBottom: bottom || 20,
        ...props.containerStyle
      }}>
      <View style={{ width: '100%' }}>
        {!hideBtn && !loading && (
          <OButton
            {...(secondaryBtn ? secondaryBtnProps : {})}
            text={text}
            imgRightSrc={null}
            isDisabled={disabled}
            onClick={handleClick}
          />
        )}
        {loading && (
          <View
            style={{
              height: 50,
              justifyContent: 'center',
              backgroundColor: theme.colors.primary,
              borderRadius: theme.utils.radius.l
            }}
          >
            <ActivityIndicator size='small' color={theme.colors.white} />
          </View>
        )}
        {text2nd && (
          <View style={{ paddingTop: 10 }}>
            {!loading2nd && (
              <OButton
                {...(secondary2ndBtn ? secondaryBtnProps : {})}
                text={text2nd}
                imgRightSrc={null}
                isDisabled={disabled2nd}
                onClick={handle2ndClick}
              />
            )}
            {loading2nd && (
              <View
                style={{
                  height: 50,
                  justifyContent: 'center',
                  backgroundColor: theme.colors.primary,
                  borderRadius: theme.utils.radius.l
                }}
              >
                <ActivityIndicator size='small' color={theme.colors.white} />
              </View>
            )}
          </View>
        )}
      </View>
    </Container>
  )
}

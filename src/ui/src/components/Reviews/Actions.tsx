import React from 'react'
import { useTheme } from 'styled-components/native'

import { ActionContainer, SkipButton } from './styles'
import { useLanguage } from '@components'
import { OButton, OText, FloatingBottomContainer } from '@ui'

export const Actions = (props: any) => {
  const {
    text,
    loading,
    disabled,
    onClick,
    onSkipClick
  } = props

  const [, t] = useLanguage()
  const theme = useTheme()

  return (
    <FloatingBottomContainer>
      <ActionContainer>
        {onSkipClick && (
          <SkipButton onPress={() => onSkipClick()}>
            <OText
              weight={600}
              size={theme.utils.tsize.m}
              color={theme.colors.textNormal}
            >
              {t('FRONT_VISUALS_SKIP', 'Skip')}
            </OText>
          </SkipButton>
        )}
        <OButton
          text={text}
          imgRightSrc={null}
          isLoading={loading}
          isDisabled={disabled}
          style={(loading || !onSkipClick) && { width: !onSkipClick ? '100%' : '45%' }}
          onClick={onClick}
        />
      </ActionContainer>
    </FloatingBottomContainer>
  )
}

import React from 'react'
import { ViewStyle } from 'react-native'

import { Container } from './styles'
import { useConfig, useLanguage } from '@components'
import { OText } from '@ui'

export const PoweredBy = ({ containerStyle }: { containerStyle?: ViewStyle }) => {
  const [{ configs }] = useConfig()
  const [, t] = useLanguage()
  const enabledPoweredByOrdering = configs?.powered_by_ordering_module?.value || (configs?.plan_enterprise && configs?.plan_enterprise?.value)

  return (
    enabledPoweredByOrdering ? (
      <Container style={containerStyle}>
        <OText>
          {t('POWERED_BY', 'Powered by')} {t('ORDERING_PLUS', 'OrderingPlus')}
        </OText>
      </Container>
    ) : null
  )
}

import { useTheme } from 'styled-components/native'
import { OText } from '@ui'

export const HeaderTitle = (props: any) => {
  const { text } = props

  const theme = useTheme()
  return (
    <OText
      lineHeight={24}
      weight={'500'}
      mBottom={props.mb ?? 10}
      color={theme.colors.textNormal}
    >
      {text}
    </OText>
  )
}

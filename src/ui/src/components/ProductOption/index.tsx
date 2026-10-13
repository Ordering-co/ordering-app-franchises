import React from 'react'
import { useTheme } from 'styled-components/native';
import { Container, WrapHeader } from './styles'
import { OText } from '../shared'
import { ProductOption as ProductOptionController, useLanguage } from '@components'

const ProductOptionUI = (props: any) => {
  const {
    children,
    option,
    error
  } = props

  const theme = useTheme();

  const [, t] = useLanguage()

  let maxMin = option.min === option.max
    ? `(${t('CHOOSE', 'Choose')}: ${option.min})`
    : `(${t('MIN', 'Min')}: ${option.min} / ${t('MAX', 'Max')}: ${option.max})`
  if (option.min === 1 && option.max === 1) {
    maxMin = t('REQUIRED', 'Required')
  } else if (option.min === 0 && option.max > 0) {
    maxMin = `(${t('MAX', 'Max')}: ${option.max})`
  } else if (option.min > 0 && option.max === 0) {
    maxMin = `(${t('MIN', 'Min')}: ${option.min})`
  }

  return (
    <Container style={{ color: error ? 'orange' : theme.colors.white }}>
      <WrapHeader>
        <OText size={theme.utils.tsize.m} weight={'600'} style={{ flex: 1 }}>{option.name}</OText>
        <OText size={theme.utils.tsize.xs} color={theme.colors.red}>{maxMin}</OText>
      </WrapHeader>
      {children}
    </Container>
  )
}

export const ProductOption = (props: any) => {
  const productOptionProps = {
    ...props,
    UIComponent: ProductOptionUI
  }

  return (
    <ProductOptionController {...productOptionProps} />
  )
}

import React from 'react';
import { useTheme } from 'styled-components/native'

import { Container, WrapperCategories } from './styles'
import { useLanguage } from '@components';
import { OText, SimpleCard as CategoryCard } from '@ui';

export const CategoriesList = (props: any) => {
  const { categories, onClickCategory } = props

  const theme = useTheme()
  const [, t] = useLanguage()

  return (
    <Container>
      <OText weight={'bold'} size={theme.utils.tsize.l}>
        {t('CATEGORIES', 'Categories')}
      </OText>
      <WrapperCategories>
        {categories.filter((c: any) => c.id).map((cat: any, idx: number) => (
          <CategoryCard
            key={cat.id}
            isFirstChild={idx === 0}
            element={cat}
            title={cat.name}
            imageSource={cat?.image ?? theme.images.dummies.category}
            onClick={onClickCategory}
          />
        ))}
      </WrapperCategories>
    </Container>
  )
}

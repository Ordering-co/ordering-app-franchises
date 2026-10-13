import React from 'react'
import FIcon from 'react-native-vector-icons/Feather'
import { useTheme } from 'styled-components/native'
import { SubCategoriesContainer, SubCategoryButton } from './styles'

import { useLanguage } from '@components'
import { OText } from '../../shared'

function SubcategoriesComponentPropsAreEqual(prev: any, next: any) {
  return prev.subcategoriesSelected === next.subcategoriesSelected &&
    prev.category === next.category
}

interface SubcategoriesComponentParams {
  subcategoriesSelected?: any,
  category?: any,
  onClickSubcategory: any
}

const SubcategoriesComponent = (props: SubcategoriesComponentParams) => {
  const {
    subcategoriesSelected,
    category,
    onClickSubcategory
  } = props

  const [, t] = useLanguage()
  const theme = useTheme()
  const allsubcategorySelected = !subcategoriesSelected?.some((subcategory: any) => category?.id === subcategory?.parent_category_id)

  return (
    <SubCategoriesContainer
      horizontal
      showsHorizontalScrollIndicator={false}
      scrollEventThrottle={16}
      contentContainerStyle={{ alignItems: 'center' }}
    >
      <SubCategoryButton
        selected={allsubcategorySelected}
        style={{ marginLeft: 50 }}
        onPress={() => onClickSubcategory(null, category)}
      >
        <OText
          color={allsubcategorySelected ? theme.colors.primary : theme.colors.textNormal}
          size={theme.utils.tsize.s}
        >
          {t('ALL', 'All')}
        </OText>
      </SubCategoryButton>

      {category?.subcategories?.map((subcategory: any) => {
        const isSubcategorySelected = subcategoriesSelected?.find((_subcategory: any) => _subcategory?.id === subcategory?.id)
        return (
          <SubCategoryButton
            key={subcategory?.id}
            selected={isSubcategorySelected}
            onPress={() => onClickSubcategory(subcategory, category)}
          >
            <OText
              color={theme.colors.textNormal}
              size={theme.utils.tsize.s}
            >
              {isSubcategorySelected
                ? <OText
                  color={theme.colors.primary}
                  size={theme.utils.tsize.s}
                >
                  {subcategory?.name}{' '}
                  <FIcon name='x-circle' size={16} color={theme?.colors?.primary} />
                </OText>
                : subcategory?.name}
            </OText>
          </SubCategoryButton>
        )
      }
      )}
    </SubCategoriesContainer>
  )
}

export const SubcategoriesComponentMemoized = React.memo(SubcategoriesComponent, SubcategoriesComponentPropsAreEqual)

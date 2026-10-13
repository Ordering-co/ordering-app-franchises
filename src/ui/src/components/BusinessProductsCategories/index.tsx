import React, { useEffect, useState, useRef } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'styled-components/native';
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';

import { CategoriesContainer, CategoryItem, CategoryItemBottom } from './styles';
import { BusinessProductsCategoriesParams } from '../../types';

import { BusinessProductsCategories as ProductsCategories, useLanguage } from '@components';
import { OBottomPopup, OIcon, OText } from '../shared';

const BusinessProductsCategoriesUI = (props: any) => {
  const {
    categories,
    loading,
    selectedCategoryId,
    handleCategoryScroll,
  } = props;

  const theme = useTheme()
  const [, t] = useLanguage()
  const tabsRef = useRef<any>(null)

  const [tabLayouts, setTabLayouts] = useState<any>({})
  const [openCategories, setOpenCategories] = useState(false)

  const dataToRender = loading ? [...Array(5)] : categories.length ? [{ id: 'menu' }, ...categories] : []

  const styles = StyleSheet.create({
    skeletonStyle: {
      height: 30,
      width: 100,
      borderRadius: theme.utils.radius.m,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 15,
    }
  })

  const handleOnLayout = (event: any, categoryId: any) => {
    const _tabLayouts = { ...tabLayouts }
    const categoryKey = 'cat_' + categoryId
    _tabLayouts[categoryKey] = event.nativeEvent.layout
    setTabLayouts(_tabLayouts)
  }

  useEffect(() => {
    if (!selectedCategoryId || Object.keys(tabLayouts).length === 0) return

    tabsRef.current.scrollTo({
      x: tabLayouts[selectedCategoryId]?.x - 40,
      animated: true
    })
  }, [selectedCategoryId, tabLayouts])

  const CategoryBottomItem = ({ item }: any) => {
    return (
      <CategoryItemBottom
        key={item.id}
        activeOpacity={1}
        selected={selectedCategoryId === `cat_${item.id ?? item?.name.toLowerCase()}`}
        onPress={() => {
          requestAnimationFrame(() => handleCategoryScroll(item))
          setOpenCategories(false)
        }}
      >
        <OText
          size={theme.utils.tsize.s}
          numberOfLines={1}
          style={{ textAlign: 'left' }}
          color={theme.colors.textNormal}
          weight={selectedCategoryId === `cat_${item.id ?? item?.name.toLowerCase()}` ? 'bold' : 'normal'}
        >
          {item.name}
        </OText>
      </CategoryItemBottom>
    )
  }

  return (
    <>
      <CategoriesContainer
        ref={tabsRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        contentContainerStyle={{ alignItems: 'center' }}
      >
        {loading && (
          <Placeholder Animation={Fade}>
            <View style={{ flexDirection: 'row' }}>
              {dataToRender.map((_, i) => (
                <PlaceholderLine key={i} style={styles.skeletonStyle} />
              ))}
            </View>
          </Placeholder>
        )}
        {!loading && categories?.length > 0 && (
          <>
            <TouchableOpacity
              activeOpacity={1}
              style={{ marginRight: 15, height: 16 }}
              onPress={() => setOpenCategories(true)}
            >
              <OIcon
                src={theme.images.general.menu}
                color={theme.colors.black}
                height={16}
                width={16}
              />
            </TouchableOpacity>
            {categories.map((category: any) => (
              <CategoryItem
                key={category.id ?? 'cat_all'}
                onPress={() => requestAnimationFrame(() => handleCategoryScroll(category))}
                selected={selectedCategoryId === `cat_${category.id ?? 'all'}`}
                onLayout={(event: any) => handleOnLayout(event, category.id ?? 'all')}
              >
                <OText
                  size={theme.utils.tsize.s}
                  color={selectedCategoryId === `cat_${category.id ?? 'all'}` ? theme.colors.white : theme.colors.secondaryLightGray}
                  weight={selectedCategoryId === `cat_${category.id ?? 'all'}` ? 'bold' : 'normal'}
                >
                  {category.name}
                </OText>
              </CategoryItem>
            ))}
          </>
        )}
      </CategoriesContainer>
      <OBottomPopup
        open={openCategories}
        title={t('CATEGORIES', 'Categories')}
        titleStyle={{ textAlign: 'center', color: 'black' }}
        presentationStyle='overFullScreen'
        transparent={true}
        containerStyle={{
          borderRadius: 10,
          borderTopRightRadius: theme.utils.radius.l,
          borderTopLeftRadius: theme.utils.radius.l
        }}
        bottomContainerStyle={{
          height: '50%',
          borderRadius: theme.utils.radius.l,
          paddingBottom: 70
        }}
        onClose={() => setOpenCategories(false)}
      >
        <FlatList
          data={categories}
          showsVerticalScrollIndicator={false}
          renderItem={CategoryBottomItem}
          keyExtractor={item => item.id}
        />
      </OBottomPopup>
    </>
  )
}

export const BusinessProductsCategories = (props: BusinessProductsCategoriesParams) => {
  const categoriesProps = {
    ...props,
    UIComponent: BusinessProductsCategoriesUI,
  }

  return <ProductsCategories {...categoriesProps} />
}


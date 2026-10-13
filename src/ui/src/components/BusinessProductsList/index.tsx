import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'styled-components/native';
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';

import { BusinessProductsListParams } from '../../types';
import { lightenDarkenColor, shape } from '../../utils'
import { CategoryDescriptionMemoized } from './CategoryDescription';
import { SubcategoriesComponentMemoized } from './SubcategoriesComponent';
import { ProductsContainer, WrapperNotFound, CatWrap, HeaderWrapper, SkeletonWrapperCard } from './styles';

import { ProductsList, useLanguage, useConfig } from '@components';
import {
  OButton, OIcon, OText,
  NotFoundSource,
  SingleProductCard,
  OrderItAgain
} from '@ui'

const BusinessProductsListUI = (props: BusinessProductsListParams) => {
  const {
    errors,
    businessId,
    category,
    categories,
    categoryState,
    onProductClick,
    featured,
    searchValue,
    isBusinessLoading,
    handleClearSearch,
    errorQuantityProducts,
    handleCancelSearch,
    categoriesLayout,
    setCategoriesLayout,
    currentCart,
    setSubcategoriesSelected,
    subcategoriesSelected,
    onClickCategory,
    lazyLoadProductsRecommended,
    handleUpdateProducts,
    previouslyProducts,
    isFiltMode,
    navigation,
    businessSingleId,
    setSelectedCategoryId
  } = props;

  const [, t] = useLanguage();
  const [{ configs }] = useConfig()
  const theme = useTheme()
  const isUseParentCategory = configs?.use_parent_category?.value === 'true' || configs?.use_parent_category?.value === '1'

  const [openDescription, setOpenDescription] = useState<any>(null)

  const handleOnLayout = (event: any, categoryId: any) => {
    const _categoriesLayout = { ...categoriesLayout }
    const categoryKey = 'cat_' + categoryId
    _categoriesLayout[categoryKey] = event.nativeEvent.layout
    setCategoriesLayout(_categoriesLayout)
  }

  const onClickSubcategory = (subCategory: any, parentCategory: any) => {
    if (parentCategory && lazyLoadProductsRecommended) {
      onClickCategory(parentCategory)
      setSelectedCategoryId(`cat_${parentCategory?.id}`)
    }
    if (!subCategory) {
      setSubcategoriesSelected?.(subcategoriesSelected.filter((_subcategory: any) => _subcategory?.parent_category_id !== parentCategory?.id))
      return
    }
    const categoryFounded = subcategoriesSelected.find((_subcategory: any) => subCategory?.id === _subcategory?.id)
    setSubcategoriesSelected?.(categoryFounded
      ? subcategoriesSelected.filter((_subcategory: any) => subCategory?.id !== _subcategory?.id)
      : [...subcategoriesSelected, subCategory]
    )
  }

  const productsCategorySelected = categoryState.products?.filter?.((product: any) =>
    !subcategoriesSelected?.find((subcategory: any) => subcategory?.parent_category_id === category?.id) ||
    subcategoriesSelected?.some((subcategory: any) => subcategory.id === product?.category_id)) ?? []

  const showCategoriesView =
    theme?.business_view?.components?.categories?.components?.show_first_categories.hidden !== undefined &&
    !theme?.business_view?.components?.categories?.components?.show_first_categories.hidden

  const styles = StyleSheet.create({
    wrapperProducts: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'stretch'
    }
  })

  return (
    <ProductsContainer
      renderToHardwareTextureAndroid={categoryState.loading || isBusinessLoading}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <HeaderWrapper>
        {category?.subcategories?.length > 0 && (
          <SubcategoriesComponentMemoized
            category={category}
            subcategoriesSelected={subcategoriesSelected}
            onClickSubcategory={onClickSubcategory}
          />
        )}
      </HeaderWrapper>
      {previouslyProducts?.length > 0 && (
        <OrderItAgain
          onProductClick={onProductClick}
          productList={previouslyProducts}
          businessId={businessId}
          categoryState={categoryState}
          navigation={navigation}
          showCategoriesView={showCategoriesView}
          handleUpdateProducts={handleUpdateProducts}
          currentCart={currentCart}
          searchValue={searchValue}
          businessSingleId={businessSingleId}
        />
      )}

      {category.id && !!productsCategorySelected.length && (
        <View style={[{ paddingHorizontal: theme.utils.margins.horizontal }, showCategoriesView ? styles.wrapperProducts : {}]}>
          {productsCategorySelected
            ?.sort((a: any, b: any) => a.rank - b.rank)
            ?.map((product: any, i: number) => (
              <SingleProductCard
                key={'prod_' + product.id + `_${i}`}
                isSoldOut={product.inventoried && !product.quantity}
                product={product}
                businessId={businessId}
                showCategoriesView={showCategoriesView}
                categoryState={categoryState}
                onProductClick={() => onProductClick(product)}
                productAddedToCartLength={currentCart?.products?.reduce((productsLength: number, Cproduct: any) => { return productsLength + (Cproduct?.id === product?.id ? Cproduct?.quantity : 0) }, 0)}
                handleUpdateProducts={handleUpdateProducts}
                navigation={navigation}
                businessSingleId={businessSingleId}
              />
            ))}
        </View>)}

      {!category?.id && categories.filter(category => category?.id !== null).map((category, i, _categories) => {
        const _products = (!isUseParentCategory || !category?.children)
          ? categoryState?.products?.filter((product: any) => product?.category_id === category?.id) ?? []
          : categoryState?.products?.filter((product: any) => category?.children?.some((cat: any) => cat.category_id === product?.category_id)) ?? []
        const products = subcategoriesSelected?.length > 0
          ? _products?.filter((product: any) =>
            !subcategoriesSelected.find((subcategory: any) => subcategory?.parent_category_id === category?.id) ||
            subcategoriesSelected?.some((subcategory: any) => subcategory.id === product?.category_id))
          : _products

        return (
          <React.Fragment key={'cat_' + category.id}>
            {products.length > 0 && (
              <>
                <CatWrap onLayout={(event: any) => handleOnLayout(event, category.id)}>
                  <OText size={theme.utils.tsize.l} weight="bold">
                    {category.name}
                  </OText>
                </CatWrap>
                {category?.subcategories?.length > 0 && !isFiltMode && (
                  <SubcategoriesComponentMemoized
                    category={category}
                    subcategoriesSelected={subcategoriesSelected}
                    onClickSubcategory={onClickSubcategory}
                  />
                )}
                <View style={[{ paddingHorizontal: theme.utils.margins.horizontal }, showCategoriesView ? styles.wrapperProducts : {}]}>
                  {products.sort((a: any, b: any) => a.rank - b.rank).map((product: any, i: any) => (
                    <SingleProductCard
                      key={`${product?.id}_${i}`}
                      isSoldOut={product.inventoried && !product.quantity}
                      businessId={businessId}
                      product={product}
                      showCategoriesView={showCategoriesView}
                      categoryState={categoryState}
                      onProductClick={onProductClick}
                      handleUpdateProducts={handleUpdateProducts}
                      navigation={navigation}
                      productAddedToCartLength={currentCart?.products?.reduce((productsLength: number, Cproduct: any) => { return productsLength + (Cproduct?.id === product?.id ? Cproduct?.quantity : 0) }, 0)}
                      businessSingleId={businessSingleId}
                    />
                  ))}
                </View>
              </>
            )}
          </React.Fragment>
        )
      })}

      <View style={{ padding: theme.utils.margins.horizontal }}>
        {(categoryState.loading || isBusinessLoading) &&
          [...Array(categoryState?.pagination?.nextPageItems).keys()].map(
            (_, i) => (
              <SkeletonWrapperCard key={i}>
                <Placeholder Animation={Fade}>
                  <View style={{ flexDirection: 'row' }}>
                    <Placeholder style={{ flex: 1 }}>
                      <PlaceholderLine width={70} style={{ marginBottom: 10 }} />
                      <PlaceholderLine width={90} height={40} style={{ marginBottom: 10, borderRadius: 5 }} />
                      <PlaceholderLine width={20} />
                    </Placeholder>
                    <PlaceholderLine width={30} height={90} style={{ marginLeft: 10, marginBottom: 0 }} />
                  </View>
                </Placeholder>
              </SkeletonWrapperCard>
            )
          )}

        {!categoryState.loading &&
          !isBusinessLoading &&
          !errors &&
          !isFiltMode &&
          (
            (
              categoryState.products.length === 0 &&
              !(
                (searchValue && errorQuantityProducts) ||
                (!searchValue && !errorQuantityProducts)
              )
            ) ||
            categoryState.products?.filter((product: any) =>
              !subcategoriesSelected.find((subcategory: any) => subcategory?.parent_category_id === category?.id) ||
              subcategoriesSelected?.some((subcategory: any) => subcategory.id === product?.category_id)).length === 0
          ) && (
            <WrapperNotFound>
              <NotFoundSource
                simple
                content={
                  !searchValue
                    ? t('ERROR_NOT_FOUND_PRODUCTS_TIME', 'No products found at this time')
                    : t('ERROR_NOT_FOUND_PRODUCTS', 'No products found, please change filters.')
                }
              />
            </WrapperNotFound>
          )}

        {errors && errors.length > 0 && (
          <WrapperNotFound>
            <NotFoundSource
              simple
              content={errors?.[0]}
            />
          </WrapperNotFound>
        )}
        {!!openDescription && (
          <CategoryDescriptionMemoized
            openDescription={openDescription}
            setOpenDescription={setOpenDescription}
          />
        )}
      </View>
    </ProductsContainer>
  )
}

export const BusinessProductsList = (props: BusinessProductsListParams) => {
  const businessProductsListProps = {
    ...props,
    UIComponent: BusinessProductsListUI,
  };

  return <ProductsList {...businessProductsListProps} />;
};

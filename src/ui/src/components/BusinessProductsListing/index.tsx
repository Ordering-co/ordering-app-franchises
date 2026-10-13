import React, { useCallback, useEffect, useRef, useState } from 'react'
import { View, Platform, ScrollView, Vibration } from 'react-native'
import { useTheme } from 'styled-components/native';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';

import { BusinessProductsListingParams } from '../../types'

import { OModal, OText } from '../shared'
import { _retrieveStoreData, _removeStoreData } from '../../providers/StoreUtil';

import {
  CartButton,
  WrapperCartButton,
  WrapperNoAuth,
  WrapperProductList
} from './styles'

import {
  BusinessAndProductList,
  useLanguage,
  useOrder,
  useSession,
  useUtils,
  ToastType,
  useToast,
  useConfig,
  useEvent,
  useFreeDeliveryProgress
} from '@components'

import {
  Alert,
  CategoriesList,
  BusinessProductsCategories,
  BusinessProductsList,
  ServiceForm,
  AddressComponent,
  vibrateApp,
  OButton,
  useGuestLogin,
  BusinessBasicInformation,
  NotFoundSource
} from '@ui'
import { FreeDeliveryProgress } from '../FreeDeliveryProgress'

const PIXELS_TO_SCROLL = 2000

export const BusinessProductsListingUI = (props: BusinessProductsListingParams) => {
  const {
    navigation,
    errors,
    businessState,
    categoryState,
    handleChangeSearch,
    categorySelected,
    searchValue,
    handleChangeCategory,
    featuredProducts,
    errorQuantityProducts,
    alertState,
    showCategoriesView,
    setAlertState,
    setCategorySelected,
    multiRemoveProducts,
    getNextProducts,
    handleUpdateProducts,
    professionalSelected,
    handleUpdateProfessionals,
    handleChangeProfessionalSelected,
    businessSingleId,
    productModal,
    onNavigationRedirect
  } = props

  const theme = useTheme();
  const [, t] = useLanguage()
  const [{ auth }] = useSession()
  const [orderState, { addProduct, updateProduct }] = useOrder()
  const [{ parsePrice }] = useUtils()
  const [, { showToast }] = useToast()
  const [{ configs }] = useConfig()
  const [events] = useEvent()
  const isFocused = useIsFocused();
  const { handleGuestUser } = useGuestLogin({
    redirectProps: { page: 'AddressList', params: { newUser: true } },
    onRedirect: (page: string, params?: any) => onNavigationRedirect(page, params)
  })

  const { business, loading, error } = businessState

  const scrollViewRef = useRef<any>(null)
  const [categoriesLayout, setCategoriesLayout] = useState<any>({})
  const [productListLayout, setProductListLayout] = useState<any>(null)
  const [isCategoryClicked, setCategoryClicked] = useState(true)
  const [subcategoriesSelected, setSubcategoriesSelected] = useState([])
  const [openService, setOpenService] = useState(false)
  const [currentProduct, setCurrentProduct] = useState(null)
  const [viewedCategory, setViewedCategory] = useState<any>(null)
  const [selectedCategoryId, setSelectedCategoryId] = useState<any>('cat_all')
  const [headerHeight, setHeaderHeight] = useState<any>(0)
  const [cartFooterHeight, setCartFooterHeight] = useState(0)
  const isQuickAddProduct = configs?.add_product_with_one_click?.value === '1'
  const currentCart: any = Object.values(orderState.carts).find((cart: any) => cart?.business?.slug === business?.slug) ?? {}
  const canShowFreeDelivery = !loading && !props.isExternalLoading && Boolean(business?.id && business?.open)
  const freeDeliveryProgress: any = (useFreeDeliveryProgress as any)({
    business,
    cart: currentCart,
    franchiseId: props.franchiseId,
    enabled: canShowFreeDelivery
  })
  const viewOrderButtonVisible = !loading && auth && currentCart?.products?.length > 0 && categoryState.products.length !== 0
  const showFreeDeliveryAwareness = canShowFreeDelivery && !currentCart?.products?.length && freeDeliveryProgress.status === 'awareness'
  const hasNoReservation = !currentCart?.reservation && orderState?.options?.type === 9
  const isPreOrder = configs?.preorder_status_enabled?.value === '1'

  const loadingPage = loading || props.isExternalLoading

  const businessCategories = (!loadingPage && business?.categories?.length)
    ? [{ id: null, name: t('ALL', 'All') },
    ...business?.categories?.sort((a: any, b: any) => a.rank - b.rank)]
    : []

  const onProductClick = async (product: any) => {
    if (product.ingredients?.length === 0 && product.extras.length === 0 && !product.inventoried && auth && isQuickAddProduct) {
      const isProductAddedToCart = currentCart?.products?.find((Cproduct: any) => Cproduct.id === product.id)
      const productQuantity = isProductAddedToCart?.quantity
      const minimumPerOrder = product?.minimum_per_order || 1
      const addCurrentProduct = {
        ...product,
        quantity: minimumPerOrder
      }
      const updateCurrentProduct = {
        name: product?.name,
        id: product.id,
        code: isProductAddedToCart?.code,
        quantity: productQuantity + 1
      }
      vibrateApp()
      const cartData = currentCart?.business_id ? currentCart : { business_id: business.id }
      if (isProductAddedToCart) {
        await updateProduct(updateCurrentProduct, cartData, isQuickAddProduct)
      } else {
        await addProduct(addCurrentProduct, cartData, isQuickAddProduct)
      }
    } else {
      const productAddedToCartLength = currentCart?.products?.reduce((productsLength: number, Cproduct: any) => { return productsLength + (Cproduct?.id === product?.id ? Cproduct?.quantity : 0) }, 0) || 0
      if (product?.type === 'service' && business?.professionals?.length > 0) {
        setCurrentProduct(product)
        setOpenService(true)
        return
      }
      if (product?.enabled) {
        onNavigationRedirect('ProductDetails', {
          product: product,
          businessSlug: business.slug,
          businessId: business.id || product?.category?.business_id,
          productAddedToCartLength,
          isRedirect: false
        })
      } else {
        showToast(ToastType.Error, t('PRODUCT_NOT_FOUND', 'Product not found'))
      }
    }
    events.emit('product_clicked', product)
  }

  const handleCancel = () => {
    handleChangeSearch('')
  }

  const handleCategoryClick = (category: any) => {
    setCategoryClicked(true)
    setSelectedCategoryId(`cat_${category?.id ?? 'all'}`)

    if (!business?.lazy_load_products_recommended) {
      if (category?.id) {
        scrollViewRef?.current?.scrollTo && scrollViewRef.current.scrollTo({
          y: categoriesLayout[`cat_${category?.id}`]?.y + productListLayout?.y - 70,
          animated: true
        })
      } else {
        scrollViewRef?.current?.scrollTo && scrollViewRef.current.scrollTo({
          y: productListLayout?.y - 70,
          animated: true
        })
      }
      showCategoriesView && handleChangeCategory(category)
    } else {
      handleChangeCategory(category)
    }
  }

  const handlePageScroll = useCallback(({ nativeEvent }: any) => {
    const scrollOffset = nativeEvent.contentOffset.y

    if (businessState?.business?.lazy_load_products_recommended) {
      const height = nativeEvent.contentSize.height
      const hasMore = !(categoryState.pagination.totalPages === categoryState.pagination.currentPage)
      if (scrollOffset + PIXELS_TO_SCROLL > height && !loading && hasMore && getNextProducts) {
        getNextProducts()
        showToast(ToastType.Info, t('LOADING_MORE_PRODUCTS', 'Loading more products'))
      }
    } else {
      if (!scrollOffset || !categoriesLayout || !productListLayout || isCategoryClicked) return

      for (const key in categoriesLayout) {
        const categoryOffset = categoriesLayout[key].y + productListLayout?.y - 70
        if (scrollOffset < headerHeight) {
          setSelectedCategoryId('cat_all');
          return;
        }
        if (categoryOffset - 50 <= scrollOffset && scrollOffset <= categoryOffset + 50) {
          if (selectedCategoryId !== key) {
            setSelectedCategoryId(key)
          }
        }
      }
    }
  }, [isCategoryClicked, selectedCategoryId, productListLayout])

  const handleTouchDrag = useCallback(() => {
    setCategoryClicked(false);
  }, []);

  const adjustBusiness = async (adjustBusinessId: number) => {
    const _carts = orderState?.carts?.[adjustBusinessId]
    const products = _carts?.products
    const unavailableProducts = products.filter((product: any) => product.valid !== true)
    const alreadyRemoved = await _retrieveStoreData('already-removed')
    _removeStoreData('already-removed')
    if (unavailableProducts.length > 0) {
      multiRemoveProducts && await multiRemoveProducts(unavailableProducts, _carts)
      return
    }

    if (alreadyRemoved === 'removed') {
      setAlertState({ open: true, content: [t('NOT_AVAILABLE_PRODUCT', 'This product is not available.')] })
    }
  }

  const removeCartByReOrder = async () => {
    const adjustBusinessId = await _retrieveStoreData('adjust-cart-products')
    if (currentCart && adjustBusinessId) {
      _removeStoreData('adjust-cart-products')
      adjustBusiness(adjustBusinessId)
    }
  }

  const handleOnLayoutHeader = (event: any) => {
    setHeaderHeight(event.nativeEvent.layout.height)
  }

  useEffect(() => {
    removeCartByReOrder()
  }, [currentCart])

  useEffect(() => {
    if (!isFocused) {
      handleChangeSearch('')
    }
  }, [isFocused])

  const subtotalWithTaxes = currentCart?.taxes?.reduce((acc: any, item: any) => {
    if (item?.type === 1)
      return acc = acc + item?.summary?.tax
    return acc = acc
  }, currentCart?.subtotal)

  useEffect(() => {
    let categoryId: any = null
    if (business?.lazy_load_products_recommended) {
      if (categorySelected?.id) {
        categoryId = categorySelected.id
      }
    } else {
      if (selectedCategoryId) {
        const originCategoryId = selectedCategoryId.replace('cat_', '')
        if (!isNaN(originCategoryId)) {
          categoryId = Number(originCategoryId)
        }
      }
    }
    if (categoryId) {
      const _viewedCategory = business.categories?.find((category: any) => category.id === categoryId)
      if (_viewedCategory?.id !== viewedCategory?.id) {
        setViewedCategory(_viewedCategory)
        events.emit('product_list_viewed', _viewedCategory)
      }
    } else {
      if (business?.categories) {
        const categoryAll: any = {}
        categoryAll.business_id = business.id
        categoryAll.id = null
        categoryAll.name = 'All'
        events.emit('product_list_viewed', categoryAll)
      }
    }
  }, [business?.lazy_load_products_recommended, selectedCategoryId, categorySelected?.id, viewedCategory])

  useEffect(() => {
    if (!business && !loading && !error && auth) {
      showToast(ToastType.Error, t('BUSINESS_NOT_FOUND', 'Business not found'))
    }
  }, [business, error, loading])

  useEffect(() => {
    if (productModal?.product && !productModal?.loading && !productModal?.error) {
      onProductClick(props?.productModal?.product)
    }
  }, [productModal])

  useFocusEffect(
    useCallback(() => {
      showCategoriesView && handleCategoryClick({ id: null, name: 'All' })
    }, [showCategoriesView])
  )

  return (
    <>
      {!loading && auth && orderState?.options?.address?.address && (
        <View onLayout={handleOnLayoutHeader}>
          <AddressComponent onRedirect={onNavigationRedirect} business={business} />
          <View style={{ backgroundColor: theme.colors.backgroundPage, height: 5 }} />
          {business && (
            <AddressComponent type='moment' onRedirect={onNavigationRedirect} business={business} />
          )}
        </View>
      )}
      {auth && orderState?.options?.address?.address ? (
        <WrapperProductList>
          <ScrollView
            style={{ flex: 1 }}
            ref={scrollViewRef}
            onScroll={handlePageScroll}
            onScrollBeginDrag={handleTouchDrag}
            scrollEventThrottle={16}
            bounces={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: viewOrderButtonVisible ? Math.max(50, cartFooterHeight) : 0 }}
            {...(loading ? {} : { stickyHeaderIndices: [showFreeDeliveryAwareness ? 2 : 1] })}
          >
            {!loading && business?.id && business?.open && showCategoriesView && !categorySelected?.id && (
              <CategoriesList
                categories={businessCategories.filter((c: any) => c.id)}
                onClickCategory={handleCategoryClick}
              />
            )}
            {!loading && business?.id && business?.open && (!showCategoriesView || (showCategoriesView && categorySelected?.id)) && (
              <BusinessBasicInformation
                navigation={navigation}
                businessState={businessState}
                isPreOrder={isPreOrder}
                onNavigationRedirect={onNavigationRedirect}
              />
            )}
            {showFreeDeliveryAwareness && (
              <FreeDeliveryProgress {...freeDeliveryProgress} variant='full' />
            )}
            {!loading && business?.id && business?.open && !(business?.categories?.length === 0) && (!showCategoriesView || (showCategoriesView && categorySelected?.id)) && (
              <BusinessProductsCategories
                categories={businessCategories}
                selectedCategoryId={selectedCategoryId}
                handleCategoryScroll={handleCategoryClick}
              />
            )}
            {!loading && business?.id && business?.open && (!showCategoriesView || (showCategoriesView && categorySelected?.id)) && (
              <View
                onLayout={(event: any) => setProductListLayout(event.nativeEvent.layout)}
              >
                <BusinessProductsList
                  categories={businessCategories}
                  category={categorySelected}
                  categoryState={categoryState}
                  businessId={business.id}
                  errors={errors}
                  onProductClick={onProductClick}
                  featured={featuredProducts}
                  searchValue={searchValue}
                  handleClearSearch={handleChangeSearch}
                  errorQuantityProducts={errorQuantityProducts}
                  handleCancelSearch={handleCancel}
                  categoriesLayout={categoriesLayout}
                  setSelectedCategoryId={setSelectedCategoryId}
                  subcategoriesSelected={subcategoriesSelected}
                  lazyLoadProductsRecommended={business?.lazy_load_products_recommended}
                  setCategoriesLayout={setCategoriesLayout}
                  currentCart={currentCart}
                  setSubcategoriesSelected={setSubcategoriesSelected}
                  onClickCategory={handleChangeCategory}
                  handleUpdateProducts={handleUpdateProducts}
                  navigation={navigation}
                  previouslyProducts={business?.previously_products}
                  businessSingleId={businessSingleId}
                />
              </View>
            )}
            {loading && !error && (
              <>
                <BusinessProductsCategories
                  categories={[]}
                  categorySelected={categorySelected}
                  handleCategoryScroll={handleCategoryClick}
                  loading={loading}
                />
                <BusinessProductsList
                  categories={[]}
                  category={categorySelected}
                  categoryState={categoryState}
                  isBusinessLoading={loading}
                  errorQuantityProducts={errorQuantityProducts}
                  handleUpdateProducts={handleUpdateProducts}
                  navigation={navigation}
                />
              </>
            )}
            {!loading && (!business?.id || !business?.open) && (
              <View style={{ padding: theme.utils.margins.horizontal }}>
                <NotFoundSource
                  simple
                  content={t('ERROR_NOT_FOUND_PRODUCTS', 'No products or stores available, please change your delivery type or address.')}
                />
              </View>
            )}
          </ScrollView>
          {viewOrderButtonVisible && (
            <WrapperCartButton
              testID='franchise-cart-footer'
              onLayout={(event: any) => setCartFooterHeight(event.nativeEvent.layout.height)}
            >
              <FreeDeliveryProgress {...freeDeliveryProgress} variant='compact' />
              <CartButton
                testID='franchise-cart-button'
                activeOpacity={0.7}
                disabled={subtotalWithTaxes < currentCart?.minimum || hasNoReservation}
                onPress={() => {
                  Vibration.vibrate(50)
                  onNavigationRedirect('UpsellingPage', {
                    business: currentCart?.business,
                    businessId: currentCart?.business_id,
                    cartProducts: currentCart?.products
                  })
                }}
              >
                {<OText size={theme.utils.tsize.s} weight={'700'} color={theme.colors.white}>
                  {hasNoReservation
                    ? t('MISSING_RESERVATION', 'Missing Reservation')
                    : subtotalWithTaxes >= currentCart?.minimum
                      ? t('YOUR_ORDER', 'Your Order')
                      : `${t('MINIMUN_ORDER_AMOUNT', 'Minimum:')} ${parsePrice(currentCart?.minimum)}`
                  }
                </OText>}
                <OText size={theme.utils.tsize.s} weight={'700'} color={theme.colors.white}>
                  {parsePrice(currentCart?.balance ?? currentCart?.total)}
                </OText>
              </CartButton>
            </WrapperCartButton>
          )}
          <Alert
            open={alertState?.open || false}
            title=''
            content={[t('NOT_AVAILABLE_PRODUCTS', 'These products are not available.')]}
            onAccept={() => setAlertState({ open: false, content: [] })}
            onClose={() => setAlertState({ open: false, content: [] })}
          />
        </WrapperProductList>
      ) : (
        <WrapperNoAuth>
          <OButton
            text={t('ORDER_NOW', 'Order Now')}
            imgRightSrc={null}
            isLoading={orderState?.loading}
            style={{ width: '100%' }}
            onClick={() => handleGuestUser()}
          />
        </WrapperNoAuth>
      )}
      <OModal
        open={openService}
        onClose={() => setOpenService(false)}
        entireModal
      >
        <ServiceForm
          navigation={navigation}
          product={currentProduct}
          businessSlug={business?.slug}
          businessId={business?.id}
          professionalList={business?.professionals}
          professionalSelected={professionalSelected}
          handleChangeProfessional={handleChangeProfessionalSelected}
          handleUpdateProfessionals={handleUpdateProfessionals}
          onSave={() => setOpenService(false)}
          onClose={() => setOpenService(false)}
        />
      </OModal>
    </>
  )
}

export const BusinessProductsListing = (props: BusinessProductsListingParams) => {
  const businessProductslistingProps = {
    ...props,
    isForceSearch: Platform.OS === 'ios',
    isApp: true,
    isFetchAllProducts: true,
    UIComponent: BusinessProductsListingUI
  }
  return (
    <BusinessAndProductList {...businessProductslistingProps} />
  )
}

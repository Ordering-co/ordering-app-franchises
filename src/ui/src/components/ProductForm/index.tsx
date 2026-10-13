import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Keyboard,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  I18nManager,
  ScrollView,
  Button
} from 'react-native';
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder';
import uuid from 'react-native-uuid';
import { useTheme } from 'styled-components/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Swiper from 'react-native-swiper'
import FastImage from 'react-native-fast-image';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import YoutubePlayer from "react-native-youtube-iframe"

import {
  WrapHeader,
  ProductTitle,
  ProductDescription,
  ProductEditions,
  SectionTitle,
  WrapperIngredients,
  WrapperSubOption,
  ProductComment,
  ProductActions,
  WeightUnitSwitch,
  WeightUnitItem,
  ProductSummary,
  ProductTitleHeader,
  OptionContainer,
  QuantityControl,
  ProductHeaderSkeleton,
  Slide1,
  SwiperButton,
  ProductTagWrapper,
  ActionContainer
} from './styles';

import {
  ProductForm as ProductOptions,
  useLanguage,
  useOrder,
  useUtils,
  ToastType,
  useToast,
  useConfig,
  useEvent,
  useSession
} from '@components';

import { orderTypeList } from '../../utils';
import { ActionButton } from './ActionButton'
import { ProductExtraOptions } from './ProductExtraOptions';
import { Utils } from './utils'
import { MAX_AUTO_SCROLL_PRODUCT_SUBOPTIONS } from '../../config/constants'

import {
  OIcon, OInput, OText,
  ProductOptionSubOption,
  NotFoundSource,
  ProductIngredient,
  ProductOption,
  vibrateApp,
  LottieAnimation
} from '@ui'

const windowWidth = Dimensions.get('window').width;

export const ProductOptionsUI = (props: any) => {
  const {
    navigation,
    editMode,
    isSoldOut,
    productCart,
    increment,
    decrement,
    handleChangeProductCartQuantity,
    showOption,
    maxProductQuantity,
    errors,
    handleSave,
    handleChangeIngredientState,
    handleChangeSuboptionState,
    handleChangeCommentState,
    productObject,
    productAddedToCartLength,
    actionStatus,
    handleCreateGuestUser,
    showCategoriesView,
    handleFavoriteProduct,
  } = props;

  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [, { showToast }] = useToast()
  const [events] = useEvent()
  const commentRef = useRef()
  const [{ auth }] = useSession()
  const [{ parsePrice, optimizeImage }] = useUtils()
  const [, t] = useLanguage()
  const [orderState] = useOrder()
  const [{ configs }] = useConfig()
  const { isError } = Utils()
  const { product, loading, error } = productObject

  const scrollViewRef = useRef<any>(null)
  const swiperRef: any = useRef(null)

  const styles = StyleSheet.create({
    comment: {
      height: 100,
      alignItems: 'flex-start',
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.utils.radius.l
    },
    productTagImageStyle: {
      width: 32,
      height: 32,
      borderRadius: theme.utils.radius.l,
      resizeMode: 'cover'
    },
    productTagNameStyle: {
      paddingHorizontal: 6,
      marginRight: 5
    }
  })

  const [gallery, setGallery] = useState([])
  const [thumbsSwiper, setThumbsSwiper] = useState(0)
  const [indexGallery, setIndexGallery] = useState(0)
  const [selOpt, setSelectedOpt] = useState(-1);
  const [isHaveWeight, setIsHaveWeight] = useState(false)
  const [playing, setPlaying] = useState(false);
  const [qtyBy, setQtyBy] = useState<any>({ weight_unit: false, pieces: true })
  const [pricePerWeightUnit, setPricePerWeightUnit] = useState<any>(null)
  const [optionLayout, setOptionLayout] = useState<any>({})
  const [headerRefHeight, setHeaderRefHeight] = useState(0)
  const [summaryRefHeight, setSummaryRefHeight] = useState(0)
  const [isScrollAvailable, setIsScrollAvailable] = useState(null)
  const [editionsLayoutY, setEditionsLayoutY] = useState(null)
  const [viewedProduct, setViewedProduct] = useState<any>(null)
  const [toggleResizeImg, setToggleResizeImg] = useState(false)

  const guestCheckoutEnabled = configs?.guest_checkout_enabled?.value === '1'
  const orderTypeEnabled = !orderTypeList[orderState?.options?.type - 1] || configs?.allowed_order_types_guest_checkout?.value?.includes(orderTypeList[orderState?.options?.type - 1])
  const optionsLength = product?.extras?.reduce((acc: number, extras: any) => acc + extras?.options?.length, 0) + (!!product?.ingredients?.length ? 1 : 0)
  const isMaxLengthPrice = (price?: number) => (price ? parsePrice(price)?.length : parsePrice(productCart?.price).length) > 9
  const hideFavoriteIcon = theme?.business_view?.components?.products?.components?.product?.components?.favorite?.hidden

  const handleSaveProduct = () => {
    vibrateApp()
    if (!productCart.quantity) {
      showToast(ToastType.Error, t('VALIDATION_ERROR_REQUIRED', 'The quantity field is required').replace('_attribute_', t('PRODUCT_POTIONS_QUANTITY', 'Quantity')))
      return
    }
    const isErrors = Object.values(errors)?.length > 0;
    if (!isErrors) {
      handleSave && handleSave();
      return;
    }
  };

  const handleChangeMainIndex = (index: number) => {
    if (index < 0 || index > gallery?.length - 1) {
      setThumbsSwiper(0)
      return
    }
    setThumbsSwiper(index)
  }

  const handleClickThumb = (index: number) => {
    if (index !== indexGallery) {
      swiperRef?.current.scrollBy(index - thumbsSwiper, true);
      setIndexGallery(index)
    }
  }

  const handleRedirectLogin = () => {
    navigation.navigate('Login', {
      store_slug: props.businessSlug
    });
  };

  const handleSwitchQtyUnit = (val: string | any) => {
    setQtyBy({
      pieces: val === 'pieces',
      weight_unit: val === 'weight_unit'
    })
  }

  const onStateChange = useCallback((state: string) => {
    if (state === "ended") {
      setPlaying(false);
    }
  }, []);

  const togglePlaying = useCallback(() => {
    setPlaying((prev: any) => !prev);
  }, []);

  const onChangeProductCartQuantity = (quantity: number) => {
    if (quantity > maxProductQuantity) {
      showToast(ToastType.Error, t('MAX_QUANTITY', 'The max quantity is _number_').replace('_number_', maxProductQuantity))
      return
    }
    handleChangeProductCartQuantity(quantity)
  }

  const handleUpdateGuest = () => {
    const guestToken = uuid.v4()
    if (guestToken) handleCreateGuestUser({ guest_token: guestToken })
  }

  const scrollDown = (id: any) => {
    const isErrors = Object.values(errors)?.length > 0
    if (!isErrors) {
      return
    }
    const targetOptionId = Object.getOwnPropertyNames(errors).filter(item => !item.includes(id))[0]
    const targetY = optionLayout[targetOptionId]?.y
    if (targetY) {
      scrollViewRef.current.scrollTo({
        y: targetY + headerRefHeight + summaryRefHeight,
        animated: true
      })
    }
  }

  const handleScroll = ({ nativeEvent: { contentOffset } }: any) => {
    props.setShowTitle(contentOffset.y > 30 ? product?.name : '')
  }

  const handleOnLayout = (event: any, optionId: any) => {
    if (optionsLength > MAX_AUTO_SCROLL_PRODUCT_SUBOPTIONS) return
    const _optionLayout = { ...optionLayout }
    const optionKey = 'cat_' + (optionId || '01')
    _optionLayout[optionKey] = event.nativeEvent.layout
    setOptionLayout(_optionLayout)
  }

  const handleChangeFavorite = () => {
    if (auth) {
      handleFavoriteProduct && handleFavoriteProduct(product, product?.favorite)
    } else {
      navigation && navigation.navigate('Login');
    }
  }

  useEffect(() => {
    if (isScrollAvailable) {
      setIsScrollAvailable(null)
      scrollDown(isScrollAvailable)
    }
  }, [errors])

  useEffect(() => {
    const imageList: any = []
    const videoList: any = []
    if (product?.images?.length > 0) {
      imageList.push(product.images)
    }

    if (product?.gallery && product?.gallery?.length > 0) {
      for (const img of product?.gallery) {
        if (img?.file) {
          imageList.push(img?.file)
        }
        if (img?.video) {
          const keys = img?.video.split('/')
          let _videoId = keys[keys?.length - 1]

          if (_videoId.includes('watch')) {
            const __url = _videoId.split('=')[1]
            _videoId = __url
          } else if (_videoId.includes('?')) {
            const __url = _videoId.split('?')[0]
            _videoId = __url
          }

          if (_videoId.search(/&/i) >= 0) {
            _videoId = _videoId.split('&')[0]
          } else if (_videoId.search(/\?/i) >= 0) {
            _videoId = _videoId.split('?')[0]
          }
          if ((_videoId?.length === 11)) {
            videoList.push(_videoId)
          }
        }
      }
    }
    const gallery = imageList.concat(videoList)
    setGallery(gallery)

    if (product?.weight && product?.weight_unit) {
      setIsHaveWeight(true)
      setPricePerWeightUnit(product?.price / product?.weight)
    }
  }, [product])

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      scrollViewRef.current.scrollToEnd({ animated: true })
    })
    return () => {
      keyboardDidShowListener.remove()
    }
  }, [])

  useEffect(() => {
    if (!product?.id || product?.id === viewedProduct?.id) return
    setViewedProduct(product)
    events.emit('product_viewed', product)
  }, [product?.id, viewedProduct])

  const actionButtonProps = {
    navigation,
    isHaveWeight: isHaveWeight || isMaxLengthPrice(productCart?.total),
    isSoldOut,
    maxProductQuantity,
    productCart,
    handleSaveProduct,
    editMode,
    product,
    errors,
    productAddedToCartLength,
    handleRedirectLogin,
    guestCheckoutEnabled,
    orderTypeEnabled,
    handleUpdateGuest,
    actionStatus
  }

  return (
    <>
      {!error && (
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{ paddingBottom: 80 + insets.bottom }}
          stickyHeaderIndices={[2]}
          scrollEventThrottle={100}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
        >
          <WrapHeader onLayout={(event: any) => setHeaderRefHeight(event.nativeEvent.layout?.height)}>
            {loading && !product ? (
              <ProductHeaderSkeleton>
                <Placeholder Animation={Fade}>
                  <PlaceholderLine
                    height={258}
                    style={{ borderRadius: 0 }}
                    width={windowWidth}
                  />
                </Placeholder>
              </ProductHeaderSkeleton>
            ) : (
              <>
                {product?.images && (
                  <>
                    <Swiper
                      loop={false}
                      ref={swiperRef}
                      showsButtons={true}
                      style={{ height: 258 }}
                      showsPagination={false}
                      onIndexChanged={(index: any) => handleChangeMainIndex(index)}
                      prevButton={
                        <SwiperButton>
                          <IconAntDesign
                            name="caretleft"
                            color={theme.colors.white}
                            size={13}
                          />
                        </SwiperButton>
                      }
                      nextButton={
                        <SwiperButton>
                          <IconAntDesign
                            name="caretright"
                            color={theme.colors.white}
                            size={13}
                          />
                        </SwiperButton>
                      }
                    >
                      {gallery && gallery?.length > 0 && gallery.map((img: any, i: number) => (
                        <Slide1 key={i}>
                          {(String(img).includes('http') || typeof img === 'number') ? (
                            <TouchableOpacity
                              activeOpacity={1}
                              style={{ width: '100%', height: '100%' }}
                              onPress={gallery?.length === 1 ? () => setToggleResizeImg(!toggleResizeImg) : () => { }}
                            >
                              <FastImage
                                style={{ height: 258, opacity: isSoldOut ? 0.5 : 1, width: '100%' }}
                                source={{
                                  uri: img,
                                  priority: FastImage.priority.normal,
                                }}
                                resizeMode={!toggleResizeImg ? FastImage.resizeMode.contain : FastImage.resizeMode.cover}
                              />
                            </TouchableOpacity>
                          ) : (
                            <>
                              <YoutubePlayer
                                height={100}
                                width={100}
                                play={playing}
                                videoId={img}
                                onChangeState={onStateChange}
                              />
                              <Button title={playing ? "pause" : "play"} onPress={togglePlaying} />
                            </>
                          )}
                        </Slide1>
                      ))}
                    </Swiper>
                    <ScrollView
                      horizontal
                      contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 10 }}
                    >
                      {gallery?.length > 1 && gallery.map((img: any, index: number) => (
                        <TouchableOpacity
                          key={index}
                          onPress={() => handleClickThumb(index)}
                        >
                          <View
                            style={{
                              height: 56,
                              borderRadius: 8,
                              margin: 8,
                              opacity: index === thumbsSwiper ? 1 : 0.8
                            }}
                          >
                            {String(img).includes('http') ? (
                              <OIcon
                                url={img}
                                style={{
                                  borderColor: theme.colors.lightGray,
                                  borderRadius: 8,
                                  minHeight: '100%',
                                  opacity: isSoldOut ? 0.5 : 1
                                }}
                                width={56}
                                height={56}
                                cover
                              />
                            ) : (
                              <OIcon
                                url={'https://img.youtube.com/vi/' + img + '/0.jpg'}
                                style={{
                                  borderColor: theme.colors.lightGray,
                                  borderRadius: 8,
                                  minHeight: '100%',
                                  opacity: isSoldOut ? 0.5 : 1
                                }}
                                width={56}
                                height={56}
                                cover
                              />
                            )}
                          </View>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </>
                )}
              </>
            )}
          </WrapHeader>
          <ProductSummary
            ph={20}
            onLayout={(event: any) => setSummaryRefHeight(event.nativeEvent.layout?.height)}
          >
            <ProductTitle>
              {loading && !product ? (
                <Placeholder Animation={Fade}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <PlaceholderLine width={40} height={20} />
                    <PlaceholderLine width={30} height={20} />
                  </View>
                </Placeholder>
              ) : (
                <>
                  <ProductTitleHeader column={isMaxLengthPrice()}>
                    <OText
                      size={20}
                      weight={'700'}
                      color={theme.colors.textNormal}
                      style={{ flex: 1 }}
                    >
                      {product?.name || productCart.name}
                    </OText>
                    {isHaveWeight ? (
                      <OText size={16} lineHeight={24} color={theme.colors.primary}>
                        {parsePrice(pricePerWeightUnit)} / {product?.weight_unit}
                      </OText>
                    ) : (
                      <View style={{ flexDirection: 'column', marginLeft: isMaxLengthPrice() ? 0 : 10 }}>
                        <OText size={16} style={{ flex: I18nManager.isRTL ? 1 : 0 }} color={theme.colors.primary}>
                          {productCart.price ? parsePrice(productCart.price) : ''}
                        </OText>
                        {product?.offer_price !== null && product?.in_offer && (
                          <OText style={{
                            color: theme.colors.textNormal,
                            textDecorationLine: 'line-through',
                            alignSelf: 'flex-end'
                          }}>
                            {product?.offer_price ? parsePrice(product?.offer_price) : parsePrice(0)}
                          </OText>
                        )}
                        {showCategoriesView && !hideFavoriteIcon && (
                          <View style={{ alignSelf: 'flex-end' }}>
                            <LottieAnimation
                              type='favorite'
                              onClick={handleChangeFavorite}
                              initialValue={product?.favorite ? 0.5 : 0}
                              toValue={product?.favorite ? 0 : 0.5}
                              disableAnimation={!auth}
                              iconProps={{ color: theme.colors.danger5, size: 18 }}
                              isActive={product?.favorite}
                            />
                          </View>
                        )}
                      </View>
                    )}
                  </ProductTitleHeader>
                  {((!!product?.sku && product?.sku !== '-1' && product?.sku !== '1') || (!!product?.estimated_person)) && (
                    <OText style={{ flex: I18nManager.isRTL ? 1 : 0 }} color={theme.colors.textNormal} mBottom={7}>
                      {
                        ((product?.sku && product?.sku !== '-1' && product?.sku !== '1') || (productCart?.sku && productCart?.sku !== '-1' && productCart?.sku !== '1'))
                        && <>{t('SKU', 'Sku')}{' '}{product?.sku || productCart?.sku}</>
                      }
                      {product?.sku && product?.sku !== '-1' && product?.sku !== '1' && product?.estimated_person && (
                        <>&nbsp;&#183;&nbsp;</>
                      )}
                      {product?.estimated_person
                        && <>{product?.estimated_person}{' '}{t('ESTIMATED_PERSONS', 'persons')}</>
                      }
                    </OText>
                  )}
                  {!!product?.calories && (
                    <OText size={16} color={theme.colors.textNormal}>
                      {product?.calories} cal
                    </OText>
                  )}
                </>
              )}
            </ProductTitle>
            <ProductDescription>
              <OText color={theme.colors.disabled} lineHeight={18}>
                {product?.description || productCart?.description}
              </OText>
            </ProductDescription>
            <ScrollView
              horizontal
              scrollEventThrottle={100}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              {product?.tags?.map((tag: any) => (
                <ProductTagWrapper key={tag.id}>
                  {!!tag?.image ? (
                    <OIcon
                      url={optimizeImage(tag?.image, 'h_40,c_limit')}
                      style={styles.productTagImageStyle}
                    />
                  ) : (
                    <OIcon
                      src={theme.images?.dummies?.product}
                      style={styles.productTagImageStyle}
                    />
                  )}
                  <OText color={theme.colors.textSecondary} size={theme.utils.tsize.xs} style={styles.productTagNameStyle}>
                    {tag.name}
                  </OText>
                </ProductTagWrapper>
              ))}
            </ScrollView>
          </ProductSummary>
          {!loading && product && !!product?.extras?.length && (
            <ProductExtraOptions
              extras={product?.extras}
              ingredients={product?.ingredients}
              selOpt={selOpt}
              optionsLength={optionsLength}
              MAX_AUTO_SCROLL_PRODUCT_SUBOPTIONS={MAX_AUTO_SCROLL_PRODUCT_SUBOPTIONS}
              scrollViewRef={scrollViewRef}
              optionLayout={optionLayout}
              editionsLayoutY={editionsLayoutY}
              setSelectedOpt={setSelectedOpt}
            />
          )}
          {!loading && product && (
            <ProductEditions
              onLayout={(event: any) => setEditionsLayoutY(event.nativeEvent?.layout?.y)}
            >
              <>
                {product?.ingredients?.length > 0 && (
                  <OptionContainer key={'cat_01'}>
                    <SectionTitle onLayout={(event: any) => handleOnLayout(event, '')}>
                      <OText size={16}>
                        {t('INGREDIENTS', 'Ingredients')}
                      </OText>
                    </SectionTitle>
                    <WrapperIngredients>
                      {product?.ingredients.map((ingredient: any, idx: number) => (
                        <ProductIngredient
                          key={idx}
                          ingredient={ingredient}
                          state={productCart.ingredients[`id:${ingredient.id}`] ?? {}}
                          onChange={handleChangeIngredientState}
                          isSoldOut={isSoldOut}
                        />
                      ))}
                    </WrapperIngredients>
                  </OptionContainer>
                )}
                {product?.extras?.sort((a: any, b: any) => a.rank - b.rank).map((extra: any) =>
                  extra.options?.sort((a: any, b: any) => a.rank - b.rank).map((option: any, i: number) => {
                    const currentState = productCart.options[`id:${option.id}`] || {};
                    return (
                      <React.Fragment key={`cat_${option.id}`}>
                        {showOption(option) && (
                          <OptionContainer onLayout={((event: any) => handleOnLayout(event, option?.id))}>
                            <ProductOption
                              option={option}
                              currentState={currentState}
                              error={errors[`id:${option.id}`]}
                            >
                              <WrapperSubOption
                                bgColor={isError({
                                  id: option.id,
                                  errors,
                                  maxProductQuantity,
                                  isSoldOut
                                })}
                              >
                                {option?.suboptions?.sort((a: any, b: any) => a.rank - b.rank).map(
                                  (suboption: any) => {
                                    const currentState = productCart.options[`id:${option.id}`]?.suboptions[`id:${suboption.id}`] || {};
                                    const balance =
                                      productCart.options[
                                        `id:${option.id}`
                                      ]?.balance || 0;
                                    return (
                                      <ProductOptionSubOption
                                        key={suboption.id}
                                        isSoldOut={isSoldOut}
                                        onChange={
                                          handleChangeSuboptionState
                                        }
                                        balance={balance}
                                        option={option}
                                        suboption={suboption}
                                        image={suboption.image}
                                        state={currentState}
                                        disabled={
                                          isSoldOut ||
                                          maxProductQuantity <= 0
                                        }
                                        setIsScrollAvailable={setIsScrollAvailable}
                                        error={errors[`id:${option.id}`]}
                                      />
                                    );
                                  },
                                )}
                              </WrapperSubOption>
                            </ProductOption>
                          </OptionContainer>
                        )}
                      </React.Fragment>
                    );
                  }),
                )}
              </>
              {!product?.hide_special_instructions && (
                <ProductComment>
                  <SectionTitle>
                    <OText size={16} weight={'600'} lineHeight={24}>
                      {t('COMMENTS', 'Special comment')}
                    </OText>
                  </SectionTitle>
                  <OInput
                    multiline
                    placeholder={t('SPECIAL_COMMENT', 'Special comment')}
                    value={productCart.comment}
                    onChange={(val: string) =>
                      handleChangeCommentState({ target: { value: val } })
                    }
                    isDisabled={
                      !(productCart && !isSoldOut && maxProductQuantity)
                    }
                    style={styles.comment}
                    ref={commentRef}
                  />
                </ProductComment>
              )}
            </ProductEditions>
          )}
          {loading && !product && (
            <>
              {[...Array(2)].map((item, i) => (
                <Placeholder
                  key={i}
                  style={{ marginBottom: 20 }}
                  Animation={Fade}>
                  <PlaceholderLine
                    height={40}
                    style={{ flex: 1, marginTop: 10 }}
                  />
                  {[...Array(3)].map((item, i) => (
                    <View
                      key={'place_key_' + i}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <PlaceholderLine
                        height={30}
                        width={10}
                        style={{ marginBottom: 20 }}
                      />
                      <PlaceholderLine
                        height={30}
                        width={50}
                        style={{ marginBottom: 20 }}
                      />
                      <PlaceholderLine
                        height={30}
                        width={30}
                        style={{ marginBottom: 20 }}
                      />
                    </View>
                  ))}
                </Placeholder>
              ))}
            </>
          )}
          {!!error && error?.length > 0 && (
            <NotFoundSource content={error[0]?.message || error[0]} />
          )}
        </ScrollView>
      )}
      {!loading && !error && product && (
        <ProductActions isColumn={isHaveWeight || isMaxLengthPrice(productCart?.total)} style={{ paddingBottom: theme.utils.margins.horizontal + insets.bottom }}>
          <ActionContainer>
            <View>
              <OText size={16} lineHeight={24} weight={'600'}>
                {productCart.total ? parsePrice(productCart?.total) : ''}
              </OText>
              {product?.minimum_per_order && (productCart?.quantity + productAddedToCartLength) <= product?.minimum_per_order && productCart?.quantity !== 1 && <OText size={12} color={theme.colors?.red}>{t('MOBILE_MINIMUM_TO_ORDER', 'Min. _number_ ').replace('_number_', product?.minimum_per_order)}</OText>}
              {product?.maximum_per_order && (productCart?.quantity + productAddedToCartLength) >= product?.maximum_per_order && <OText size={12} color={theme.colors?.red}>{t('MOBILE_MAXIMUM_TO_ORDER', 'Max. _number_'.replace('_number_', product?.maximum_per_order))}</OText>}
            </View>
            {productCart && !isSoldOut && maxProductQuantity > 0 && (
              <>
                <QuantityControl>
                  <TouchableOpacity
                    onPress={decrement}
                    disabled={productCart.quantity === 1 || !productCart.quantity || isSoldOut || ((productCart?.quantity + productAddedToCartLength) <= product?.minimum_per_order)}>
                    <OIcon
                      src={theme.images.general.minus}
                      width={20}
                      color={
                        productCart.quantity === 1 || isSoldOut
                          ? theme.colors.backgroundGray
                          : theme.colors.primary
                      }
                    />
                  </TouchableOpacity>
                  {qtyBy?.pieces && (
                    <TextInput
                      keyboardType='numeric'
                      value={`${productCart?.quantity > 0 ? productCart?.quantity : ''}`}
                      onChangeText={(val: any) => onChangeProductCartQuantity(parseInt(val))}
                      editable={!orderState.loading}
                      style={{
                        borderWidth: 1,
                        textAlign: 'center',
                        minWidth: 55,
                        borderRadius: 8,
                        borderColor: theme.colors.inputBorderColor,
                        height: 44,
                        marginHorizontal: 10,
                        fontSize: 16
                      }}
                    />
                  )}
                  {qtyBy?.weight_unit && (
                    <OText
                      size={12}
                      lineHeight={18}
                      style={{ minWidth: 40, textAlign: 'center' }}
                    >
                      {(productCart.quantity * product?.weight).toString()}
                    </OText>
                  )}
                  <TouchableOpacity
                    onPress={increment}
                    disabled={
                      maxProductQuantity <= 0 ||
                      (productCart?.quantity + productAddedToCartLength) >= maxProductQuantity ||
                      ((productCart?.quantity + productAddedToCartLength) >= product?.maximum_per_order && product?.maximum_per_order) ||
                      isSoldOut
                    }>
                    <OIcon
                      src={theme.images.general.plus}
                      width={20}
                      color={
                        maxProductQuantity <= 0 ||
                          (productCart?.quantity + productAddedToCartLength) >= maxProductQuantity ||
                          ((productCart?.quantity + productAddedToCartLength) >= product?.maximum_per_order && product?.maximum_per_order) ||
                          isSoldOut
                          ? theme.colors.backgroundGray
                          : theme.colors.primary
                      }
                    />
                  </TouchableOpacity>
                </QuantityControl>
                {isHaveWeight && (
                  <WeightUnitSwitch>
                    <TouchableOpacity
                      onPress={() => handleSwitchQtyUnit('pieces')}
                    >
                      <WeightUnitItem active={qtyBy?.pieces}>
                        <OText
                          size={12}
                          lineHeight={18}
                          color={qtyBy?.pieces ? theme.colors.primary : theme.colors.textNormal}
                        >
                          {t('PIECES', 'pcs')}
                        </OText>
                      </WeightUnitItem>
                    </TouchableOpacity>
                    <View style={{ alignItems: 'flex-start' }}>
                      <TouchableOpacity
                        onPress={() => handleSwitchQtyUnit('weight_unit')}
                      >
                        <WeightUnitItem active={qtyBy?.weight_unit}>
                          <OText
                            size={12}
                            lineHeight={18}
                            color={qtyBy?.weight_unit ? theme.colors.primary : theme.colors.textNormal}
                          >
                            {product?.weight_unit}
                          </OText>
                        </WeightUnitItem>
                      </TouchableOpacity>
                    </View>
                  </WeightUnitSwitch>
                )}
              </>
            )}
            {!isHaveWeight && !isMaxLengthPrice(productCart?.total) && <ActionButton {...actionButtonProps} />}
          </ActionContainer>
          {(isHaveWeight || isMaxLengthPrice(productCart?.total)) && <ActionButton {...actionButtonProps} />}
        </ProductActions>
      )}
      {!!error && (
        <View style={{ padding: theme.utils.margins.horizontal }}>
          <NotFoundSource
            simple
            content={typeof error === 'string' ? error : error?.[0]}
          />
        </View>
      )}
    </>
  );
};


export const ProductForm = (props: any) => {
  const productOptionsProps = {
    ...props,
    productCart: {
      ...props.productCart,
      quantity: props.productCart?.code
        ? props.productCart?.quantity
        : props?.product?.minimum_per_order || 1
    },
    UIComponent: ProductOptionsUI
  }

  return <ProductOptions {...productOptionsProps} />
};

ProductForm.defaultProps = {
  productAddedToCartLength: 0
}

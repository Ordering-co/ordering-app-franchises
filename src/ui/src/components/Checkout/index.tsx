import React, { useState, useEffect, useMemo, useRef } from 'react';
import moment from 'moment';
import { View, Platform, ScrollView, Keyboard, AppState, ActivityIndicator } from 'react-native';
import { initStripe, useConfirmPayment, dismissPlatformPay } from '@stripe/stripe-react-native';
import { useIsFocused } from '@react-navigation/native';
import { useTheme } from 'styled-components/native';

import { SectionItem } from './SectionItem'
import { HeaderTitle } from './HeaderTitle'
import { InfoMessage } from './InfoMessage'
import { parseDriverTipOptions } from './parseDriverTipOptions'
import { useGuestCheckoutPermission } from '../../hooks/useGuestCheckoutPermission'

import {
  ChContainer,
  ChSection,
  ChPaymethods,
  ChDriverTips,
  ChErrors,
  ChCart,
  WalletPaymentOptionContainer,
  LoadingOverlay
} from './styles';

import {
  Checkout as CheckoutController,
  useOrder,
  useSession,
  useApi,
  useLanguage,
  useUtils,
  useConfig,
  useToast,
  ToastType,
  useEvent
} from '@components';

import {
  OButton,
  OText,
  OModal,
  DriverTips,
  NotFoundSource,
  PaymentOptionWallet,
  PlaceSpot,
  SignupForm,
  LoginForm,
  FloatingButton,
  OrderSummary,
  AddressComponent,
  vibrateApp,
  UserDetails,
  useHomeValues,
  PaymentOptionsWebView
} from '@ui';

const manageErrorsToShow = (array = []) => {
  let stringError = ''
  const list = Array.isArray(array) ? array : Object.values(array)
  list.map((item: any, i: number) => {
    stringError += (i + 1) === array.length ? `- ${item?.message || item}` : `- ${item?.message || item}\n`
  })
  return stringError;
}

const redirectMethods = ['stripe_checkout', 'checkout_pro_mercadopago', 'epayco', 'interswitch']
const methodsWithRequiredCards = ['globalpay', 'cybersource']

const CheckoutUI = (props: any) => {
  const {
    cart,
    errors,
    placing,
    cartState,
    cartUuid,
    loyaltyPlansState,
    businessDetails,
    handlerClickPlaceOrder,
    setPlaceSpotNumber,
    maxDate,
    checkoutFieldsState,
    onNavigationRedirect,
    showGateway,
    setShowGateway,
    handlePaymethodChange,
    globalPayIFrameUrl,
    cybersourceIFrameUrl,
    createBusinessUserPaymethod,
    paymethodSelected: paymethodSelectedProps
  } = props

  const theme = useTheme();
  const isFocused = useIsFocused();
  const scrollViewRef = useRef<any>(null)

  const [, { showToast }] = useToast();
  const [, t] = useLanguage();
  const [{ user, loading: userLoading }, { login }] = useSession();
  const [{ configs }] = useConfig();
  const [{ parsePrice, parseDate, GiftCardPaymethods }] = useUtils();
  const [{ options, carts, loading }, { changePaymethod }] = useOrder();
  const { guestCheckoutAllowed, guestOrderBlocked, canPlaceOrder } = useGuestCheckoutPermission({
    configs,
    orderType: options?.type,
    user
  })
  const [ordering] = useApi()
  const [events] = useEvent()
  const [{ order: lastOrder }] = useHomeValues()

  const [userErrors, setUserErrors] = useState<any>([]);
  const [requiredFields, setRequiredFields] = useState<any>([])
  const [openModal, setOpenModal] = useState({ login: false, signup: false, isGuest: false })
  const [placeByMethodPay, setPlaceByMethodPay] = useState(false)
  const [isGiftCardCart, setIsGiftCardCart] = useState(!cart?.business_id)
  const [isOpen, setIsOpen] = useState(false)
  const [phoneUpdate, setPhoneUpdate] = useState(false);

  const commentDelayTime = 1500
  const placeSpotTypes = [3, 4, 5]
  const methodsPay = ['google_pay', 'apple_pay']
  const stripePaymethods = ['stripe', 'stripe_connect']
  const notFields = ['coupon', 'driver_tip', 'mobile_phone', 'address', 'zipcode', 'address_notes', 'comments']
  const returnUrl = `${props.urlscheme}://checkout/${cart?.uuid}`
  const isPaymentSandbox = businessDetails?.business?.paymethods?.find((paymethod: any) => paymethod?.paymethod?.gateway === paymethodSelected?.gateway)?.sandbox

  const checkoutFields = useMemo(() => checkoutFieldsState?.fields?.filter((field: any) => field.order_type_id === options?.type), [checkoutFieldsState, options])
  const guestCheckoutDriveTip = useMemo(() => checkoutFields?.find((field: any) => field.order_type_id === 1 && field?.validation_field?.code === 'driver_tip'), [JSON.stringify(checkoutFields), options])
  const guestCheckoutComment = useMemo(() => checkoutFields?.find((field: any) => field.order_type_id === options?.type && field?.validation_field?.code === 'comments'), [JSON.stringify(checkoutFields), options])
  const guestCheckoutCoupon = useMemo(() => checkoutFields?.find((field: any) => field.order_type_id === options?.type && field?.validation_field?.code === 'coupon'), [JSON.stringify(checkoutFields), options])
  const guestCheckoutZipcode = useMemo(() => checkoutFields?.find((field: any) => field.order_type_id === options?.type && field?.validation_field?.code === 'zipcode'), [JSON.stringify(checkoutFields), options])

  const placeSpotsEnabled = placeSpotTypes.includes(options?.type)
  const businessConfigs = businessDetails?.business?.configs ?? []
  const isWalletCashEnabled = businessConfigs.find((config: any) => config.key === 'wallet_cash_enabled')?.value === '1'
  const isWalletCreditPointsEnabled = businessConfigs.find((config: any) => config.key === 'wallet_credit_point_enabled')?.value === '1'
  const isWalletEnabled = configs?.cash_wallet?.value && configs?.wallet_enabled?.value === '1' && (isWalletCashEnabled || isWalletCreditPointsEnabled)
  const isDisabledRewards = configs?.disabled_rewards?.value === '1'

  const paySelectedByGiftCard = GiftCardPaymethods
    .map((p: any) => ({
      ...p,
      paymethodId: p?.id,
      data: cart?.paymethod_data,
      paymethod: {
        ...p,
        credentials: { ...cart?.paymethod_data }
      }
    }))
    .find((pay: any) => pay?.id === cart?.paymethod_id)

  const paymethodSelected = (isGiftCardCart && cart?.business_id === null)
    ? paySelectedByGiftCard
    : businessDetails?.business?.paymethods
      ?.map((p: any) => ({
        ...p?.paymethod,
        paymethodId: p?.paymethod?.id,
        data: paymethodSelectedProps?.data ?? cart?.paymethod_data,
        paymethod: {
          ...p?.paymethod,
          credentials: { ...p?.data },
          ...paymethodSelectedProps?.paymethod
        }
      }))
      // ?.find((paymethod: any) => paymethod?.id === (cart?.paymethod_id ?? lastOrder?.paymethod?.id))
      ?.find((paymethod: any) => paymethod?.id === cart?.paymethod_id)

  const creditPointPlan = loyaltyPlansState?.result?.find((loyal: any) => loyal.type === 'credit_point')
  const creditPointPlanOnBusiness = creditPointPlan?.businesses?.find((b: any) => b.business_id === cart?.business_id && b.accumulates)

  const isPreOrder = configs?.preorder_status_enabled?.value === '1'

  const validateCommentsCartField = (guestCheckoutComment?.enabled && (user?.guest_id ? guestCheckoutComment?.required_with_guest : guestCheckoutComment?.required)) && (cart?.comment === null || cart?.comment?.trim().length === 0)
  const validateDriverTipField = options.type === 1 && (guestCheckoutDriveTip?.enabled && (user?.guest_id ? guestCheckoutDriveTip?.required_with_guest : guestCheckoutDriveTip?.required)) && (Number(cart?.driver_tip) <= 0)
  const validateCouponField = (guestCheckoutCoupon?.enabled && (user?.guest_id ? guestCheckoutCoupon?.required_with_guest : guestCheckoutCoupon?.required)) && !cart?.offers?.some((offer: any) => offer?.type === 2)
  const validateZipcodeCard = (guestCheckoutZipcode?.enabled && (user?.guest_id ? guestCheckoutZipcode?.required_with_guest : guestCheckoutZipcode?.required)) && paymethodSelected?.gateway === 'stripe' && paymethodSelected?.data?.card && !paymethodSelected?.data?.card?.zipcode

  const isDisabledButtonPlace = guestOrderBlocked || loading || !cart?.valid || (!paymethodSelected && cart?.balance > 0) ||
    placing ||
    !cart?.valid_maximum ||
    (!cart?.valid_minimum && !(cart?.discount_type === 1 && cart?.discount_rate === 100)) ||
    (validateCommentsCartField) ||
    (validateDriverTipField && !isGiftCardCart) ||
    (validateZipcodeCard) ||
    (methodsPay.includes(paymethodSelected?.gateway)) ||
    validateCommentsCartField ||
    validateDriverTipField ||
    validateCouponField ||
    validateZipcodeCard ||
    (methodsWithRequiredCards.includes(paymethodSelected?.gateway) && !(paymethodSelected?.data?.card_token || paymethodSelected?.data?.transient_token || cart?.paymethod_data?.card_token || cart?.paymethod_data?.transient_token))
  const driverTipsOptions = parseDriverTipOptions(configs?.driver_tip_options?.value)
  const driverTipsField = !cartState.loading && cart && cart?.business_id && options.type === 1 && cart?.status !== 2 && (guestCheckoutDriveTip?.enabled) && driverTipsOptions.length > 0

  const cartsWithProducts = carts && Object.values(carts).filter((cart: any) => cart.products.length) || null

  const togglePhoneUpdate = (val: boolean) => {
    setPhoneUpdate(val)
  }

  const handleSuccessSignup = (user: any) => {
    login({
      user,
      token: user?.session?.access_token
    })
    if (openModal?.isGuest && requiredFields?.length === 0) {
      openModal?.isGuest && handlePlaceOrderAsGuest()
    }
    setOpenModal({ ...openModal, signup: false, isGuest: false })
  }

  const handleSuccessLogin = (user: any) => {
    if (user) setOpenModal({ ...openModal, login: false })
  }

  const handlePlaceOrder = (confirmPayment: any, forcePlace: boolean = false, paymentOptions?: any) => {
    if (!canPlaceOrder()) return
    if (stripePaymethods.includes(paymethodSelected?.gateway) && user?.guest_id) {
      setOpenModal({ ...openModal, signup: true, isGuest: true })
      return
    }

    if (!userErrors.length && (!requiredFields?.length) || forcePlace) {
      vibrateApp()
      handlerClickPlaceOrder && handlerClickPlaceOrder(
        paymentOptions,
        { isNative: true },
        confirmPayment,
        dismissPlatformPay,
        paymethodSelected,
        { scrollToTop: () => scrollViewRef?.current?.scrollTo({ y: 0, animated: true }), returnUrl }
      )
      return
    }
    if (requiredFields?.length) {
      setIsOpen(true)
      return
    }
    let stringError = ''
    Object.values(userErrors).map((item: any, i: number) => {
      stringError += (i + 1) === userErrors.length ? `- ${item?.message || item}` : `- ${item?.message || item}\n`
    })
    showToast(ToastType.Error, stringError)
  }

  const handlePlaceOrderAsGuest = () => {
    if (!canPlaceOrder(true)) return
    handlerClickPlaceOrder && handlerClickPlaceOrder()
  }

  const checkValidationFields = () => {
    setUserErrors([])
    const errors: Array<string> = []
    const userSelected = user
    const _requiredFields: Array<string> = []
    Object.values(checkoutFieldsState?.fields).map((field: any) => {
      if (options?.type === field?.order_type_id &&
        field?.enabled &&
        field?.required &&
        !notFields.includes(field?.validation_field?.code)
      ) {
        if (userSelected && !userSelected[field?.validation_field?.code]) {
          _requiredFields.push(field?.validation_field?.code)
        }
      }
    })
    const mobilePhoneField: any = Object.values(checkoutFieldsState?.fields)?.find((field: any) => field?.order_type_id === options?.type && field?.validation_field?.code === 'mobile_phone')
    if (
      userSelected &&
      !userSelected?.cellphone &&
      ((mobilePhoneField?.enabled &&
        mobilePhoneField?.required) ||
        configs?.verification_phone_required?.value === '1')
    ) {
      _requiredFields.push('cellphone')
    }

    setRequiredFields(_requiredFields)
    setUserErrors(errors)
  }

  const checkGuestValidationFields = () => {
    const userSelected = user
    const _requiredFields = checkoutFieldsState?.fields
      .filter((field: any) => (field?.order_type_id === options?.type) && field?.enabled && field?.required_with_guest &&
        !notFields.includes(field?.validation_field?.code) &&
        field?.validation_field?.code !== 'email' &&
        userSelected && !userSelected[field?.validation_field?.code])
    const requiredFieldsCode = _requiredFields.map((item: any) => item?.validation_field?.code)
    const guestCheckoutCellPhone = checkoutFieldsState?.fields?.find((field: any) => field.order_type_id === options?.type && field?.validation_field?.code === 'mobile_phone')
    const guestCheckoutEmail = checkoutFieldsState?.fields?.find((field: any) => field.order_type_id === options?.type && field?.validation_field?.code === 'email')
    if (
      userSelected &&
      !userSelected?.guest_cellphone &&
      ((guestCheckoutCellPhone?.enabled &&
        guestCheckoutCellPhone?.required_with_guest) ||
        configs?.verification_phone_required?.value === '1')
    ) {
      requiredFieldsCode.push('cellphone')
    }
    if (
      userSelected &&
      !userSelected?.guest_email &&
      guestCheckoutEmail?.enabled &&
      guestCheckoutEmail?.required_with_guest
    ) {
      requiredFieldsCode.push('email')
    }

    setRequiredFields(requiredFieldsCode)
  }

  const navigateToPaymentOptions = () => {
    onNavigationRedirect(
      'PaymentOptions',
      {
        businessId: !isGiftCardCart ? businessDetails?.business?.id : -1,
        paymethods: businessDetails?.business?.paymethods,
        paySelected: paymethodSelected,
        handlePlaceOrder,
        requiredFields,
        placeByMethodPay,
        setPlaceByMethodPay,
        onPaymentChange: handlePaymethodChange,
        urlscheme: props.urlscheme,
        returnUrl,
        globalPayIFrameUrl,
        cybersourceIFrameUrl,
        createBusinessUserPaymethod
      })
  }

  useEffect(() => {
    if (checkoutFieldsState?.loading || userLoading) return
    user?.guest_id
      ? checkGuestValidationFields()
      : checkValidationFields()
  }, [checkoutFieldsState, user, options?.type])

  useEffect(() => {
    if (errors) {
      const errorText = manageErrorsToShow(errors)
      showToast(ToastType.Error, errorText)
    }
  }, [errors])

  useEffect(() => {
    if (cart?.products?.length === 0 || !userLoading) return
    if (cart?.business_id !== null) {
      onNavigationRedirect('Business', { store: cart?.business?.slug, header: null, logo: null, fromMulti: props.fromMulti })
      return
    }
    if (isGiftCardCart) {
      onNavigationRedirect('Wallets')
      return
    }
  }, [cart?.products?.length])

  useEffect(() => {
    if (cart?.products?.length > 0) {
      setIsGiftCardCart(!!(cart?.uuid && cart?.business_id === null))
    }
  }, [cart?.uuid, cart?.products?.length])

  useEffect(() => {
    if (['computop'].includes(cart?.paymethod_data?.gateway) || cart?.paymethod_data?.result?.action?.type === 'iframe') {
      if (cart?.paymethod_data?.status === 2) {
        setShowGateway({ ...showGateway, open: true })
      } else if (cart?.paymethod_data?.status === 4) {
        setShowGateway({ ...showGateway, open: false })
      }
    }
  }, [cart?.paymethod_data])

  useEffect(() => {
    cart && events.emit('checkout_started', cart)
  }, [])

  useEffect(() => {
    if (!isFocused) return
    if (!cartState?.loading && (cartState?.error || typeof cartState?.cart === 'string')) {
      const error = cartState?.error || typeof cartState.cart === 'string' && cartState.cart
      if (error) {
        showToast(ToastType.Error, cartState?.error || cartState.cart)
        onNavigationRedirect('BottomTab', { screen: 'Business' })
      }
    }
  }, [cartState?.error, cartState?.cart, cartState?.loading, isFocused])

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      scrollViewRef.current.scrollToEnd({ animated: true })
    })
    return () => {
      keyboardDidShowListener.remove()
    }
  }, [])

  useEffect(() => {
    if (paymethodSelected && redirectMethods.includes(paymethodSelected?.gateway) && [0, 4].includes(cart?.status)) {
      const _paymethodData: any = {}
      _paymethodData.success_url = returnUrl
      _paymethodData.cancel_url = returnUrl
      changePaymethod(cart?.business_id, paymethodSelected.id, JSON.stringify(_paymethodData))
    }
  }, [paymethodSelected?.gateway, cart?.status])

  return (
    <>
      {cartState.loading && (
        <LoadingOverlay>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </LoadingOverlay>
      )}
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {!cartState.loading && (cart?.status === 2 || cart?.status === 4) && (
          <InfoMessage
            text={
              cart?.status === 4
                ? t('CART_STATUS_CANCEL_MESSAGE', 'The payment has not been successful, please try again')
                : t('CART_STATUS_PENDING_MESSAGE_APP', 'Your order is being processed, please wait a little more. if you\'ve been waiting too long, please reload the app')
            }
            color={theme.colors.error}
          />
        )}
        {!cartState.loading && (
          <AddressComponent onRedirect={onNavigationRedirect} business={businessDetails?.business} />
        )}
        <ChContainer style={{ paddingTop: 0 }}>
          {businessDetails?.business && options?.type === 2 && !cartState.loading && (
            <ChSection>
              <SectionItem
                textToShow={t('STORE_DETAILS', 'Store Details')}
                secondTextToShow={businessDetails?.business?.address}
                btnText={t('VIEW_DETAILS', 'View details')}
                onRedirect={() => onNavigationRedirect('BusinessInfo', {
                  business: businessDetails?.business,
                  businessState: businessDetails
                })}
              />
            </ChSection>
          )}
          {!cartState.loading && cart && !(cartsWithProducts?.length > 0 && cart?.products?.length === 0) && (
            <ChSection>
              <SectionItem
                textToShow={t('ORDER_SUMMARY', 'Order Summary')}
                btnText={t('VIEW_DETAILS', 'View details')}
                onRedirect={() => onNavigationRedirect('UpsellingPage', {
                  business: businessDetails?.business,
                  businessId: businessDetails?.business?.id,
                  cartProducts: props?.cartProducts
                })}
              />
            </ChSection>
          )}

          {!isGiftCardCart && !cartState.loading && (
            <ChSection style={{ paddingTop: 0 }}>
              <SectionItem
                bt
                textToShow={options?.moment
                  ? parseDate(options?.moment, { outputFormat: configs?.dates_moment_format?.value })
                  : (`${t('ASAP_ABBREVIATION', 'ASAP')} ${t('TODAY_AT', 'Today at')} (${moment(new Date()).format(configs?.general_hour_format?.value)} + ${options?.type > 1 ? t('PICKUP_TIME', 'Pickup Time') : t('DELIVERY_TIME', 'delivery time')})`)
                }
                onRedirect={isPreOrder ? () => onNavigationRedirect('MomentOption', {
                  business: businessDetails?.business
                }) : null}
              />
            </ChSection>
          )}

          {!cartState.loading && placeSpotsEnabled && !isGiftCardCart && (
            <>
              <View style={{ height: 8, backgroundColor: theme.colors.backgroundGray100, marginTop: 30, marginHorizontal: -40 }} />
              <PlaceSpot
                isCheckout
                isInputMode
                cart={cart}
                spotNumberDefault={cartState?.cart?.spot_number ?? cart?.spot_number}
                setPlaceSpotNumber={setPlaceSpotNumber}
                vehicleDefault={cart?.vehicle}
              />
              <View style={{ height: 8, backgroundColor: theme.colors.backgroundGray100, marginHorizontal: -40 }} />
            </>
          )}

          {!cartState.loading && cart && cart?.status !== 2 && cart?.valid && (
            <ChSection>
              <ChPaymethods>
                <SectionItem
                  bt
                  paySelected={paymethodSelected}
                  isDisabled={cart?.status === 2 || (!isGiftCardCart ? businessDetails.loading : false)}
                  onRedirect={() => navigateToPaymentOptions()}
                />
              </ChPaymethods>
            </ChSection>
          )}

          {!cartState.loading && cart && isWalletEnabled && businessDetails?.business?.configs && !isDisabledRewards && (
            <WalletPaymentOptionContainer>
              <PaymentOptionWallet
                cart={cart}
                loyaltyPlansState={loyaltyPlansState}
                businessId={cart?.business_id}
                businessConfigs={businessDetails?.business?.configs}
              />
            </WalletPaymentOptionContainer>
          )}

          {driverTipsField && (
            <ChSection>
              <ChDriverTips>
                <HeaderTitle text={t('DRIVER_TIPS', 'Driver Tips')} mb={0} />
                <DriverTips
                  uuid={cartUuid}
                  businessId={cart?.business_id}
                  driverTipsOptions={!driverTipsOptions.includes(0) ? [0, ...driverTipsOptions] : driverTipsOptions}
                  isFixedPrice={parseInt(configs?.driver_tip_type?.value, 10) === 1}
                  isDriverTipUseCustom={!!parseInt(configs?.driver_tip_use_custom?.value, 10)}
                  driverTip={parseInt(configs?.driver_tip_type?.value, 10) === 1
                    ? cart?.driver_tip
                    : cart?.driver_tip_rate}
                  useOrderContext
                  cart={cart}
                />
              </ChDriverTips>
            </ChSection>)}

          {!cartState.loading && cart && (
            <ChSection>
              <ChCart>
                {cartsWithProducts?.length > 0 && cart?.products?.length === 0 ? (
                  <NotFoundSource
                    content={t('NOT_FOUND_CARTS', 'Sorry, You don\'t seem to have any carts.')}
                    btnTitle={t('SEARCH_REDIRECT', 'Go to Businesses')}
                  />
                ) : (
                  <OrderSummary
                    hideProducts
                    hideAddProductsButton
                    isGiftCardCart={isGiftCardCart}
                    cart={cart}
                    isCartPending={cart?.status === 2}
                    onNavigationRedirect={onNavigationRedirect}
                    commentDelayTime={commentDelayTime}
                    placeSpotTypes={placeSpotTypes}
                    businessConfigs={businessConfigs}
                    maxDate={maxDate}
                    loyaltyRewardRate={
                      creditPointPlanOnBusiness?.accumulation_rate ??
                      (!!creditPointPlanOnBusiness && creditPointPlan?.accumulation_rate) ?? 0
                    }
                    hideCommentsByValidationCheckout={!guestCheckoutComment?.enabled}
                    hideCouponByValidationCheckout={!guestCheckoutCoupon?.enabled}
                  />
                )}
              </ChCart>
            </ChSection>
          )}
          {!cartState.loading && cart && (
            <ChErrors style={{ marginBottom: Platform.OS === 'ios' ? 70 : 10 }}>
              {!cart?.valid_address && cart?.status !== 2 && (
                <OText
                  color={theme.colors.error}
                  size={12}
                >
                  {t('INVALID_CART_ADDRESS', 'Selected address is invalid, please select a closer address.')}
                </OText>
              )}

              {!cart?.valid_products && cart?.status !== 2 && cart?.total !== 0 && (
                <>
                  <OText
                    color={theme.colors.error}
                    size={12}
                  >
                    {t('WARNING_INVALID_PRODUCTS_CHECKOUT', 'To continue with your checkout, please remove from your cart the products that are not available.')}
                  </OText>
                </>
              )}
              {cart?.valid_preorder !== undefined && !cart?.valid_preorder && (
                <OText
                  color={theme.colors.error}
                  size={12}
                >
                  {t('INVALID_CART_MOMENT', 'Selected schedule time is invalid, please select a schedule into the business schedule interval.')}
                </OText>
              )}
              {validateDriverTipField && !isGiftCardCart &&
                (
                  <OText
                    color={theme.colors.error}
                    size={12}
                  >
                    {t('WARNING_INVALID_DRIVER_TIP', 'Driver Tip is required.')}
                  </OText>
                )}
              {validateCommentsCartField && (
                <OText
                  color={theme.colors.error}
                  size={12}
                >
                  {t('WARNING_INVALID_CART_COMMENTS', 'Cart comments is required.')}
                </OText>
              )}

              {validateZipcodeCard && (
                <OText
                  color={theme.colors.error}
                  size={12}
                >
                  {t('WARNING_CARD_ZIPCODE_REQUIRED', 'Your card selected has not zipcode')}
                </OText>
              )}
              {validateCouponField &&
                (
                  <OText
                    color={theme.colors.error}
                    size={12}
                  >
                    {t('WARNING_INVALID_COUPON_FIELD', 'Coupon is required.')}
                  </OText>
                )}
              {guestOrderBlocked && (
                <View style={{ marginTop: 12 }}>
                  <OText color={theme.colors.error} size={12}>
                    {t('LOGIN_SIGN_UP_COMPLETE_ORDER', 'Login/Sign up to complete your order.')}
                  </OText>
                  <OButton
                    text={t('LOGIN', 'Login')}
                    style={{ marginTop: 8 }}
                    onClick={() => setOpenModal({ ...openModal, login: true })}
                  />
                  <OButton
                    text={t('SIGNUP', 'Signup')}
                    style={{ marginTop: 8 }}
                    onClick={() => setOpenModal({ ...openModal, signup: true })}
                  />
                </View>
              )}
            </ChErrors>
          )}
          <OModal
            open={isOpen}
            onClose={() => setIsOpen(false)}
            showToastInsideModal
          >
            <View style={{
              paddingHorizontal: 20,
              width: '100%'
            }}>
              <UserDetails
                isUserDetailsEdit
                cartStatus={cart?.status}
                businessId={cart?.business_id}
                useDefualtSessionManager
                useSessionUser
                isCheckout
                isEdit
                phoneUpdate={phoneUpdate}
                togglePhoneUpdate={togglePhoneUpdate}
                isOrderTypeValidationField
                requiredFields={requiredFields}
                checkoutFields={checkoutFields}
                isCheckoutPlace
                hideUpdateButton
                handlePlaceOrderAsGuest={handlePlaceOrderAsGuest}
                isAllowGuest={guestCheckoutAllowed}
                onClose={() => {
                  if (!canPlaceOrder()) return
                  setIsOpen(false)
                }}
                setIsOpen={setIsOpen}
              />
            </View>
          </OModal>
          <OModal
            open={openModal.signup}
            onClose={() => setOpenModal({ ...openModal, signup: false, isGuest: false })}
          >
            <ScrollView style={{ width: '100%' }}>
              <SignupForm
                handleSuccessSignup={handleSuccessSignup}
                isGuest
                signupButtonText={t('SIGNUP', 'Signup')}
                useSignupByEmail
                useChekoutFileds
              />
            </ScrollView>
          </OModal>
          <OModal
            open={openModal.login}
            onClose={() => setOpenModal({ ...openModal, login: false })}
            entireModal
            title={t('LOGIN', 'Login')}
          >
            <LoginForm
              handleSuccessLogin={handleSuccessLogin}
              isGuest
              loginButtonText={t('LOGIN', 'Login')}
              loginButtonBackground={theme.colors.primary}
            />
          </OModal>
        </ChContainer>
      </ScrollView>
      {!cartState.loading && cart && cart?.status !== 2 && (
        <FloatingButton
          loading={loading}
          text={guestOrderBlocked
            ? t('LOGIN_SIGN_UP_COMPLETE_ORDER', 'Login/Sign up to complete your order.')
            : !cart?.valid_maximum
            ? (
              `${t('MAXIMUM_SUBTOTAL_ORDER', 'Maximum subtotal order')}: ${parsePrice(cart?.maximum)}`
            )
            : (!cart?.valid_minimum && !(cart?.discount_type === 1 && cart?.discount_rate === 100))
              ? (
                `${t('MINIMUN_SUBTOTAL_ORDER', 'Minimum subtotal order:')} ${parsePrice(cart?.minimum)}`
              )
              : placing
                ? t('PLACING', 'Placing')
                :
                isDisabledButtonPlace
                  ? t('SELECT_PAYMENT_WARNING', 'Select a payment method')
                  : t('PLACE_ORDER', 'Place Order')
          }
          handleClick={
            guestOrderBlocked
              ? () => {}
              : isDisabledButtonPlace
              ? () => navigateToPaymentOptions()
              : methodsPay.includes(paymethodSelected?.gateway)
                ? () => setPlaceByMethodPay(true)
                : () => handlePlaceOrder(null)
          }
          disabled={guestOrderBlocked}
        />
      )}
      {
        cart?.paymethod_data?.gateway === 'computop' && cart?.paymethod_data?.status === 2 && showGateway.open && (
          <PaymentOptionsWebView
            isAvoidRerender
            title={t('COMPUTOP_PAYMENT', 'Computop payment')}
            onNavigationRedirect={onNavigationRedirect}
            uri={`https://integrations.ordering.co/computop_paymethod/views/payment_form.html?title=${t('COMPUTOP_PAYMENT', 'Computop payment')}&body=${t('COMPUTOP_PROCESSING', 'Processing transaction')}`}
            user={user}
            cart={cart}
            additionalParams={cart?.paymethod_data?.result}
            setShowGateway={setShowGateway}
          />
        )
      }
      {
        cart?.paymethod_data?.gateway === 'epayco' && cart?.paymethod_data?.status === 2 && showGateway.open && (
          <PaymentOptionsWebView
            title={t('EPAYCO_PAYMENT', 'Epayco payment')}
            onNavigationRedirect={onNavigationRedirect}
            uri={'https://plugins-development.ordering.co/marcos/integration-epayco/views/payment_form.html'}
            user={user}
            cart={cart}
            additionalParams={{
              paymethodData: cart?.paymethod_data,
              paymethod: {
                paymethod: {
                  credentials: {
                    api_key: cart?.paymethod_data?.result?.epayco_api_key
                  }
                }
              },
              sandbox: configs?.epayco_sandbox_mode?.value === '1'
            }}
            setShowGateway={setShowGateway}
          />
        )
      }
      {
        cart?.paymethod_data?.status === 2 && cart?.paymethod_data?.result?.action?.type === 'iframe' && showGateway.open && (
          <PaymentOptionsWebView
            isAvoidRerender
            title={cart?.paymethod_data?.gateway}
            onNavigationRedirect={onNavigationRedirect}
            uri={cart?.paymethod_data?.result?.action?.iframe_url}
            user={user}
            cart={cart}
            additionalParams={{}}
            setShowGateway={setShowGateway}
          />
        )
      }
    </>
  )
}

export const Checkout = (props: any) => {
  const {
    errors,
    clearErrors,
    cartUuid,
    stripePaymentOptions,
    onNavigationRedirect,
    showGateway
  } = props

  const [, { showToast }] = useToast();
  const [, t] = useLanguage();
  const [{ token }] = useSession();
  const [ordering] = useApi();
  const [orderState, { confirmCart }] = useOrder();
  const { confirmPayment } = useConfirmPayment();

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [cartState, setCartState] = useState<any>({ loading: true, error: null, cart: null });

  const getOrder = async (cartId: any, forceGetOrder: boolean = false) => {
    try {
      let result: any = {}
      const cartsWithProducts = orderState?.carts && (Object.values(orderState?.carts)?.filter((cart: any) => cart?.products && cart?.products?.length) || null)
      const cart = cartsWithProducts?.find((cart: any) => cart.uuid === cartId)
      if (cart && !forceGetOrder) {
        result = { ...cart }
      } else {
        setCartState({ ...cartState, loading: true })
        const url = `${ordering.root}/carts/${cartId}`
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        })
        const content = await response.json();
        result = content.result
      }

      let publicKey = null
      try {
        const { content } = await ordering.setAccessToken(token).paymentCards().getCredentials();
        if (!content.error) {
          publicKey = content.result.publishable;
        }
      } catch (error) {
        publicKey = null
      }

      if (result.status === 1 && result.order?.uuid) {
        onNavigationRedirect('OrderDetails', { orderId: result.order.uuid, isFromCheckout: true })
        setCartState({ ...cartState, loading: false })
      }

      if (result.status === 2) {
        await handleStatusTwo(result, publicKey);
        return;
      }

      setCartState({
        ...cartState,
        loading: false,
        cart: Array.isArray(result) ? null : result,
        error: result ? null : result
      });

    } catch (e: any) {
      setCartState({
        ...cartState,
        loading: false,
        error: [e.toString()]
      })
    }
  }

  const handleStatusTwo = async (result: any, publicKey: string) => {
    if (result.paymethod_data?.result?.action?.type === 'redirect') {
      setTimeout(() => {
        handleRedirectPaymethod(result);
      }, 3000)
    } else if (stripePaymentOptions.includes(result.paymethod_data?.gateway)) {
      await handleStripePayment(result, publicKey);
    }
  };

  const handleRedirectPaymethod = async (result: any) => {
    try {
      const confirmCartRes = await confirmCart(cartUuid);
      if (confirmCartRes.error) {
        const response = await fetch(`${ordering.root}/orders/${cartUuid}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        const orderResult = await response.json();
        if (orderResult.error) {
          showToast(ToastType.Error, confirmCartRes.error.message || confirmCartRes.result?.[0]);
        } else {
          onNavigationRedirect('OrderDetails', { orderId: orderResult?.result?.uuid, isFromCheckout: true });
        }
      } else if (confirmCartRes.result.order?.uuid) {
        onNavigationRedirect('OrderDetails', { orderId: confirmCartRes.result.order.uuid, isFromCheckout: true });
      }
      setCartState({
        ...cartState,
        loading: false,
        cart: confirmCartRes.result || result
      });
    } catch (err: any) {
      showToast(ToastType.Error, err?.toString() || err.message);
    }
  };

  const handleStripePayment = async (result: any, publicKey: string) => {
    const clientSecret = result.paymethod_data?.result?.client_secret
    const paymentMethodId = result.paymethod_data?.data?.source_id;

    initStripe({ publishableKey: publicKey });

    try {
      const { paymentIntent, error } = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
        paymentMethodData: {
          paymentMethodId
        }
      });

      try {
        const confirmCartRes = await confirmCart(cartUuid)
        if (confirmCartRes.error) {
          showToast(ToastType.Error, typeof confirmCartRes.result === 'string' ? confirmCartRes.result : confirmCartRes.result[0])
          setCartState({
            ...cartState,
            loading: false,
            cart: result
          })
          return
        }
        if (confirmCartRes.result.order?.uuid) {
          onNavigationRedirect('OrderDetails', { orderId: confirmCartRes.result.order.uuid, isFromCheckout: true })
          setCartState({ ...cartState, loading: false })
        } else {
          showToast(ToastType.Error, t('FAILED_PAYMENT', 'The payment has failed'));
          const cart = Array.isArray(result) ? null : result
          setCartState({
            ...cartState,
            loading: false,
            cart,
            error: cart ? null : result
          })
          return
        }
      } catch (error: any) {
        showToast(ToastType.Error, error?.toString() || error.message)
      }
    } catch (error) {
      showToast(ToastType.Error, t('FAILED_PAYMENT', 'The payment has failed'));
      const cart = Array.isArray(result) ? null : result
      setCartState({
        ...cartState,
        loading: false,
        cart,
        error: cart ? null : result
      })
    }
  }

  useEffect(() => {
    if (errors) {
      const errorText = manageErrorsToShow(errors)
      showToast(ToastType.Error, errorText)
      clearErrors && clearErrors()
    }
  }, [errors])

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (token && cartUuid && appStateVisible === 'active') {
      getOrder(cartUuid, showGateway?.forceGetOrder)
    }
  }, [token, cartUuid, appStateVisible, showGateway?.open, showGateway?.forceGetOrder])

  const checkoutProps = {
    ...props,
    UIComponent: CheckoutUI,
    cartState,
    uuid: cartUuid
  }

  return (
    <>
      <CheckoutController {...checkoutProps} />
    </>
  )
}

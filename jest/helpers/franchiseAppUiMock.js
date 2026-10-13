const React = require('react')
const { Text, View, TouchableOpacity, TextInput } = require('react-native')

const OText = ({ children, ...props }) => React.createElement(Text, props, children)
const OButton = ({ text, onClick, testID, isDisabled, isLoading }) => (
  React.createElement(
    TouchableOpacity,
    { onPress: onClick, testID, disabled: isDisabled || isLoading },
    React.createElement(Text, null, text)
  )
)
const OInput = React.forwardRef(({ placeholder, onChange, value, testID, name, ...rest }, ref) => (
  React.createElement(TextInput, {
    ref,
    placeholder,
    value,
    testID: testID || placeholder || name,
    onChangeText: (text) => onChange?.({
      nativeEvent: { text },
      target: { name, value: text }
    }),
    ...rest
  })
))
const OIcon = () => React.createElement(View, { testID: 'o-icon' })
const OIconButton = ({ onClick, disabled, title }) => (
  React.createElement(
    TouchableOpacity,
    { onPress: onClick, disabled, testID: 'o-icon-button' },
    title ? React.createElement(Text, null, title) : React.createElement(View, { testID: 'o-icon' })
  )
)
const FloatingBottomContainer = ({ children }) => (
  React.createElement(View, { testID: 'floating-bottom' }, children)
)
const ORDER_STATUS = {
  0: 'PENDING',
  1: 'COMPLETED',
  7: 'ACCEPTED_BY_BUSINESS'
}
const OModal = ({ open, children, onClose }) => (
  open ? React.createElement(View, { testID: 'modal' }, children) : null
)
const Alert = ({ open, title, content, onAccept, onClose }) => (
  open
    ? React.createElement(
      View,
      { testID: 'alert' },
      React.createElement(Text, null, title),
      React.createElement(TouchableOpacity, { testID: 'alert-accept', onPress: onAccept || onClose })
    )
    : null
)
const OAlert = ({ children, onAccept, title }) => (
  React.createElement(
    TouchableOpacity,
    { testID: 'o-alert', onPress: onAccept },
    children,
    title ? React.createElement(Text, null, title) : null
  )
)
const OAlertOriginal = Alert
const getPayIcon = jest.fn(() => 1)
const currencyWithoutDecimals = ['JPY', 'KRW', 'VND']
const FloatingButton = ({ text, handleClick, disabled, loading, text2nd, handle2ndClick }) => (
  React.createElement(
    View,
    null,
    React.createElement(
      TouchableOpacity,
      { onPress: handleClick, disabled: disabled || loading, testID: 'floating-button' },
      React.createElement(Text, null, text)
    ),
    text2nd
      ? React.createElement(
        TouchableOpacity,
        { onPress: handle2ndClick, testID: 'floating-button-secondary' },
        React.createElement(Text, null, text2nd)
      )
      : null
  )
)
const OrdersOption = (props) => {
  const testID = props.isBusiness
    ? 'orders-option-business'
    : props.isProducts
      ? 'orders-option-products'
      : props.preOrders
        ? 'orders-option-pre'
        : props.activeOrders
          ? 'orders-option-active'
          : 'orders-option-past'
  return React.createElement(View, { testID })
}
const GiftCardOrdersList = ({ onNavigationRedirect }) => (
  React.createElement(
    TouchableOpacity,
    {
      testID: 'gift-card-orders-list',
      onPress: () => onNavigationRedirect?.('GiftCard')
    },
    React.createElement(Text, null, 'Gift cards')
  )
)
const ActiveOrders = ({ orders, handleClickOrder }) => (
  React.createElement(
    View,
    { testID: 'active-orders' },
    React.createElement(Text, null, orders?.[0]?.business?.name || 'Active orders'),
    orders?.[0]
      ? React.createElement(
        TouchableOpacity,
        {
          testID: 'active-order',
          onPress: () => handleClickOrder?.(orders[0].uuid)
        },
        React.createElement(Text, null, 'Open order')
      )
      : null
  )
)
const PreviousOrders = ({ orders }) => (
  React.createElement(
    View,
    { testID: 'previous-orders' },
    React.createElement(Text, null, orders?.[0]?.business?.name || 'Previous orders')
  )
)
const SendGiftCard = () => React.createElement(View, { testID: 'send-gift-card' })
const PoweredBy = () => React.createElement(View, { testID: 'powered-by' })
const MomentOption = () => React.createElement(View, { testID: 'moment-option' })
const SingleProductCart = ({ product, onEditProduct, onDeleteProduct }) => (
  React.createElement(
    View,
    { testID: 'single-product-cart' },
    React.createElement(Text, null, product?.name),
    React.createElement(
      TouchableOpacity,
      { testID: 'edit-cart-product', onPress: () => onEditProduct?.(product) },
      React.createElement(Text, null, 'Edit')
    ),
    React.createElement(
      TouchableOpacity,
      { testID: 'delete-cart-product', onPress: () => onDeleteProduct?.(product) },
      React.createElement(Text, null, 'Delete')
    )
  )
)
const REVIEW_STATUS = [1, 2, 5, 6, 10, 11, 12, 15]
const REORDER_STATUS = [1, 2, 5, 6, 10, 11, 12, 15, 16, 17]
const PaymentOptionCard = () => React.createElement(View, { testID: 'payment-option-card' })
const PaymentOptionsWebView = ({ title }) => (
  React.createElement(
    View,
    { testID: 'payment-options-webview' },
    title ? React.createElement(Text, null, title) : null
  )
)
const StripeElementsForm = () => React.createElement(View, { testID: 'stripe-elements-form' })
const StripeCardsList = ({ onSelectCard }) => (
  React.createElement(
    TouchableOpacity,
    {
      testID: 'stripe-cards-list',
      onPress: () => onSelectCard?.({ id: 'card_1', last4: '4242' })
    },
    React.createElement(Text, null, 'Saved cards')
  )
)
const PaymentOptionCash = () => React.createElement(View, { testID: 'payment-option-cash' })
const StripeMethodForm = () => React.createElement(View, { testID: 'stripe-method-form' })
const PhoneInputNumber = () => React.createElement(View, { testID: 'phone-input' })
const VerifyPhone = () => React.createElement(View, { testID: 'verify-phone' })
const UserFormDetailsUI = () => React.createElement(View, { testID: 'user-form-details' })
const LogoutButton = () => React.createElement(View, { testID: 'logout-button-nested' })
const NavBar = ({ title, subTitle }) => (
  React.createElement(
    View,
    { testID: 'navbar' },
    title ? React.createElement(Text, null, title) : null,
    subTitle ? React.createElement(Text, null, subTitle) : null
  )
)
const Container = ({ children }) => React.createElement(View, { testID: 'container' }, children)
const NetworkError = () => React.createElement(View, { testID: 'network-error' })
const OBottomPopup = ({ open, title, children }) => (
  open
    ? React.createElement(View, { testID: 'bottom-popup' }, React.createElement(Text, null, title), children)
    : null
)
const NotFoundSource = ({ content }) => React.createElement(Text, null, content)
const AnimatedItem = ({ item }) => React.createElement(View, { testID: 'animated-item' }, item)
const LastOrders = () => React.createElement(View, { testID: 'last-orders' })
const PageBanner = () => null
const ORDER_TYPES = [{ value: 1 }, { value: 2 }]
const useBusinessSelected = jest.fn(() => [
  { title: 'Demo Store', name: 'Demo Store' },
  { onChangeBusinessSelected: jest.fn() }
])
const useGuestLogin = jest.fn(() => ({ handleGuestUser: jest.fn() }))
const DeviceOrientationMethods = {
  useDeviceOrientation: jest.fn(() => [{ dimensions: { width: 390, height: 844 } }])
}

const _retrieveStoreData = jest.fn(async () => null)
const _setStoreData = jest.fn()
const _removeStoreData = jest.fn()
const vibrateApp = jest.fn()
const useCountdownTimer = jest.fn(() => [600, jest.fn(), jest.fn()])
const sortInputFields = ({ values } = {}) => (Array.isArray(values) ? values : Object.values(values || {}))

const ACCOUNT_VALUES = {
  guest: 'guest',
  signup: 'signup',
  login: 'login'
}

const franchiseAppUiMock = {
  OText,
  OButton,
  OInput,
  OIcon,
  OIconButton,
  OModal,
  Alert,
  OAlert,
  OAlertOriginal,
  getPayIcon,
  currencyWithoutDecimals,
  FloatingButton,
  PaymentOptionCard,
  PaymentOptionsWebView,
  StripeElementsForm,
  StripeCardsList,
  PaymentOptionCash,
  StripeMethodForm,
  PhoneInputNumber,
  VerifyPhone,
  UserFormDetailsUI,
  LogoutButton,
  NavBar,
  Container,
  NetworkError,
  OBottomPopup,
  NotFoundSource,
  AnimatedItem,
  LastOrders,
  PageBanner,
  ORDER_TYPES,
  useBusinessSelected,
  useGuestLogin,
  DeviceOrientationMethods,
  _retrieveStoreData,
  _setStoreData,
  _removeStoreData,
  vibrateApp,
  useCountdownTimer,
  sortInputFields,
  ACCOUNT_VALUES,
  Toast: () => null,
  SafeAreaViewWrapper: ({ children }) => children,
  useHomeValues: jest.fn(() => [{ userAddressStoraged: null }, { onChangeUserAddressStoraged: jest.fn(), onChangeAlternativeHome: jest.fn(), onChangeOrder: jest.fn() }]),
  SimpleCard: ({ title }) => React.createElement(Text, null, title),
  FavoriteList: () => React.createElement(View, { testID: 'favorite-list' }),
  BusinessController: ({ business }) => React.createElement(Text, null, business?.name),
  SingleProductCard: ({ product, onProductClick }) => (
    React.createElement(
      TouchableOpacity,
      { testID: 'single-product-card', onPress: onProductClick },
      React.createElement(Text, null, product?.name)
    )
  ),
  SingleProductCart,
  SingleOrderCard: () => React.createElement(View, { testID: 'single-order-card' }),
  OrdersOption,
  GiftCardOrdersList,
  ActiveOrders,
  PreviousOrders,
  SendGiftCard,
  PoweredBy,
  MomentOption,
  REVIEW_STATUS,
  REORDER_STATUS,
  ORDER_STATUS,
  FloatingBottomContainer,
  Skeletons: () => ({
    BusinessSkeleton: () => null,
    ProductSkeleton: () => null,
    OrderSkeleton: () => null
  }),
  GoogleMap: () => React.createElement(View, { testID: 'google-map' }),
  ScheduleAccordion: () => React.createElement(View, { testID: 'schedule-accordion' }),
  LottieAnimation: ({ onClick, type }) => (
    React.createElement(
      TouchableOpacity,
      { testID: 'lottie-animation', onPress: onClick },
      React.createElement(Text, null, type || 'lottie')
    )
  ),
  CardAnimation: ({ children, onClick, disabled }) => (
    React.createElement(TouchableOpacity, { onPress: onClick, disabled, testID: 'card-animation' }, children)
  ),
  Cart: ({ cart }) => React.createElement(Text, { testID: 'cart' }, cart?.business?.name || 'Cart'),
  ServiceForm: () => React.createElement(View, { testID: 'service-form' }),
  OrderItAgain: () => React.createElement(View, { testID: 'order-it-again' }),
  ODropDown: ({ placeholder }) => React.createElement(Text, { testID: 'o-dropdown' }, placeholder),
  BusinessCart: ({ business }) => React.createElement(Text, { testID: 'business-cart' }, business?.name),
  ProductItemAccordion: ({ product }) => React.createElement(Text, { testID: 'product-item-accordion' }, product?.name),
  CouponControl: () => React.createElement(View, { testID: 'coupon-control' }),
  PlaceSpot: () => React.createElement(View, { testID: 'place-spot' }),
  TaxInformation: () => React.createElement(View, { testID: 'tax-information' }),
  CartStoresListing: () => React.createElement(View, { testID: 'cart-stores-listing' }),
  UpsellingProducts: () => React.createElement(View, { testID: 'upselling-products' }),
  BusinessItemAccordion: ({ cart, children }) => React.createElement(
    View,
    { testID: 'business-item-accordion' },
    React.createElement(Text, null, cart?.business?.name),
    children
  ),
  BusinessBasicInformation: () => React.createElement(View, { testID: 'business-basic-information' }),
  AddressComponent: () => React.createElement(View, { testID: 'address-component' }),
  DriverTips: () => React.createElement(View, { testID: 'driver-tips' }),
  CategoriesList: () => React.createElement(View, { testID: 'categories-list' }),
  BusinessProductsCategories: () => React.createElement(View, { testID: 'business-products-categories' }),
  BusinessProductsList: () => React.createElement(View, { testID: 'business-products-list' })
}

module.exports = Object.assign({ franchiseAppUiMock }, franchiseAppUiMock)

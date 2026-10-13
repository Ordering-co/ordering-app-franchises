/**
 * Slim @ui stubs for page tests. Expand per UI batch; do not import the real barrel.
 */
const React = require('react')
const { Text, TouchableOpacity, View } = require('react-native')

const NavBar = ({ title, subtitle, onActionLeft }) => (
  React.createElement(
    View,
    { testID: 'navbar' },
    React.createElement(Text, { testID: 'navbar-title' }, title),
    subtitle ? React.createElement(Text, { testID: 'navbar-subtitle' }, subtitle) : null,
    onActionLeft
      ? React.createElement(TouchableOpacity, { testID: 'navbar-back', onPress: onActionLeft })
      : null
  )
)

const SafeAreaViewWrapper = ({ children }) => (
  React.createElement(View, { testID: 'safe-area' }, children)
)

const _setStoreData = jest.fn()
const _removeStoreData = jest.fn()
const _retrieveStoreData = jest.fn()

const useHomeValues = jest.fn(() => [{ userAddressStoraged: null }, { onChangeAlternativeHome: jest.fn() }])

const useDeviceOrientation = jest.fn(() => [{
  dimensions: { width: 390, height: 844 }
}])

const DeviceOrientationMethods = { useDeviceOrientation }

const LoginForm = (props) => (
  React.createElement(
    View,
    { testID: 'login-form' },
    React.createElement(TouchableOpacity, {
      testID: 'login-success-home',
      onPress: () => props.handleSuccessLogin?.({
        id: 1,
        email: 'user@test.com',
        addresses: [{ default: true }]
      })
    }),
    React.createElement(TouchableOpacity, {
      testID: 'login-success-address',
      onPress: () => props.handleSuccessLogin?.({ id: 2, addresses: [] })
    }),
    React.createElement(TouchableOpacity, {
      testID: 'login-success-missing-addresses',
      onPress: () => props.handleSuccessLogin?.({
        id: 7,
        email: 'user@test.com',
        session: { access_token: 'token' }
      })
    }),
    React.createElement(TouchableOpacity, {
      testID: 'login-redirect',
      onPress: () => props.onNavigationRedirect?.('Signup')
    }),
    React.createElement(TouchableOpacity, {
      testID: 'login-guest-handler',
      onPress: () => props.handleSuccessLogin?.({ id: 8, email: 'guest@test.com' })
    })
  )
)

const SignupForm = (props) => (
  React.createElement(
    View,
    { testID: 'signup-form' },
    React.createElement(TouchableOpacity, {
      testID: 'signup-success-home',
      onPress: () => props.handleSuccessSignup?.({
        id: 3,
        email: 'new@test.com',
        phone_verified: true,
        email_verified: true,
        session: { access_token: 'token' },
        addresses: [{ default: true }]
      })
    }),
    React.createElement(TouchableOpacity, {
      testID: 'signup-success-verify',
      onPress: () => props.handleSuccessSignup?.({
        id: 4,
        email_verified: false,
        phone_verified: false,
        session: { access_token: 'token' }
      })
    }),
    React.createElement(TouchableOpacity, {
      testID: 'signup-success-missing-addresses',
      onPress: () => props.handleSuccessSignup?.({
        id: 5,
        email: 'new@test.com',
        phone_verified: true,
        email_verified: true,
        session: { access_token: 'token' }
      })
    }),
    React.createElement(TouchableOpacity, {
      testID: 'signup-success-empty-addresses',
      onPress: () => props.handleSuccessSignup?.({
        id: 6,
        email: 'new@test.com',
        phone_verified: true,
        email_verified: true,
        session: { access_token: 'token' },
        addresses: []
      })
    }),
    React.createElement(TouchableOpacity, {
      testID: 'signup-guest-handler',
      onPress: () => props.handleSuccessSignup?.({
        id: 9,
        email: 'guest@test.com',
        phone_verified: true,
        email_verified: true,
        session: { access_token: 'token' },
        addresses: [{ default: true }]
      })
    })
  )
)

const ForgotPasswordForm = () => (
  React.createElement(View, { testID: 'forgot-password-form' })
)

const UserVerification = (props) => (
  React.createElement(View, { testID: 'user-verification-controller', ...props })
)

const Sessions = (props) => (
  React.createElement(View, { testID: 'sessions-controller', ...props })
)

const OIcon = (props) => (
  React.createElement(View, { testID: 'o-icon', ...props })
)

const OText = ({ children, ...props }) => (
  React.createElement(Text, { testID: 'o-text', ...props }, children)
)

const onChangeBusinessSelected = jest.fn()
const useBusinessSelected = jest.fn(() => [
  { id: 10, slug: 'demo-store', header: 'Header', logo: 'logo.png' },
  { onChangeBusinessSelected }
])

const useNearestBusiness = jest.fn(() => ({
  getNearestBusiness: jest.fn(async () => ({
    error: false,
    business: { slug: 'nearest-store', id: 5 }
  })),
  resolveBusinessForLocation: jest.fn(async () => ({
    error: false,
    business: { slug: 'resolved-store' },
    changed: false
  })),
  confirmBusinessChange: jest.fn(async () => true)
}))

const NavBarCustomized = () => (
  React.createElement(View, { testID: 'navbar-customized' })
)

const SafeAreaContainer = ({ children }) => (
  React.createElement(View, { testID: 'safe-area-container' }, children)
)

const HomeView = (props) => (
  React.createElement(
    View,
    { testID: 'home-view' },
    React.createElement(TouchableOpacity, {
      testID: 'home-nav',
      onPress: () => props.onNavigationRedirect?.('BusinessListingSearch', { term: 'pizza' })
    }),
    React.createElement(TouchableOpacity, {
      testID: 'home-nav-empty',
      onPress: () => props.onNavigationRedirect?.('', null)
    })
  )
)

const BusinessesListing = (props) => (
  React.createElement(
    View,
    { testID: 'businesses-listing' },
    React.createElement(TouchableOpacity, {
      testID: 'businesses-listing-business',
      onPress: () => props.onBusinessClick?.({ slug: 'demo-store', header: 'Header', logo: 'logo.png' })
    })
  )
)

const BusinessInformation = (props) => (
  React.createElement(
    View,
    { testID: 'business-information' },
    React.createElement(TouchableOpacity, {
      testID: 'business-info-redirect',
      onPress: () => props.onRedirect?.('BusinessReviews', { id: 1 })
    })
  )
)

const BusinessProductsListing = (props) => (
  React.createElement(
    View,
    { testID: 'business-products-listing' },
    React.createElement(Text, { testID: 'bpl-franchise-id' }, String(props.franchiseId)),
    React.createElement(TouchableOpacity, {
      testID: 'bpl-nav-replace',
      onPress: () => props.onNavigationRedirect?.('Checkout', { cartId: 1 }, true)
    }),
    React.createElement(TouchableOpacity, {
      testID: 'bpl-nav',
      onPress: () => props.onNavigationRedirect?.('Cart', {}, false)
    }),
    React.createElement(TouchableOpacity, {
      testID: 'bpl-business',
      onPress: () => props.onBusinessClick?.()
    })
  )
)

const BusinessProductsList = (props) => (
  React.createElement(
    View,
    { testID: 'products-controller' },
    React.createElement(TouchableOpacity, {
      testID: 'products-click',
      onPress: () => props.onProductClick?.({
        category: { id: 3 },
        product: { id: 99 },
        productAddedToCartLength: 2
      })
    }),
    React.createElement(TouchableOpacity, {
      testID: 'products-nav-replace',
      onPress: () => props.onNavigationRedirect?.('Checkout', { cartId: 1 }, true)
    })
  )
)

const BusinessPreorder = (props) => (
  React.createElement(View, { testID: 'business-preorder-controller' })
)

const BusinessReviews = (props) => (
  React.createElement(
    View,
    { testID: 'business-reviews-controller' },
    React.createElement(TouchableOpacity, {
      testID: 'business-reviews-redirect',
      onPress: () => props.onRedirect?.('BusinessInfo', { id: 1 })
    })
  )
)

const Favorite = (props) => (
  React.createElement(
    View,
    { testID: 'favorite-controller' },
    React.createElement(Text, { testID: 'favorite-franchise-id' }, String(props.franchiseId))
  )
)

const ProductForm = (props) => (
  React.createElement(
    View,
    { testID: 'product-form' },
    React.createElement(TouchableOpacity, {
      testID: 'product-save',
      onPress: () => props.onSave?.()
    }),
    React.createElement(TouchableOpacity, {
      testID: 'product-go-back',
      onPress: () => props.handleGoBack?.()
    }),
    React.createElement(TouchableOpacity, {
      testID: 'product-set-title',
      onPress: () => props.setShowTitle?.('Short product name')
    })
  )
)

const MomentOption = (props) => (
  React.createElement(
    View,
    { testID: 'moment-option-controller', maxDate: props.maxDate },
    React.createElement(TouchableOpacity, {
      testID: 'moment-go-back',
      onPress: () => props.goToBack?.()
    })
  )
)

const UpsellingProducts = (props) => (
  React.createElement(
    View,
    { testID: 'upselling-products' },
    React.createElement(TouchableOpacity, {
      testID: 'upselling-go-back',
      onPress: () => props.onGoBack?.()
    }),
    React.createElement(TouchableOpacity, {
      testID: 'upselling-nav',
      onPress: () => props.onNavigationRedirect?.('ProductDetails', { productId: 9 })
    })
  )
)

const AddressForm = (props) => (
  React.createElement(
    View,
    { testID: 'address-form-controller' },
    React.createElement(Text, { testID: 'address-form-guest-store' }, String(props.isGuestFromStore)),
    React.createElement(Text, { testID: 'address-form-editing' }, String(!!props.isEditing))
  )
)

const AddressList = (props) => (
  React.createElement(
    View,
    { testID: 'address-list-controller' },
    React.createElement(TouchableOpacity, {
      testID: 'address-list-back',
      onPress: () => props.goBack?.()
    }),
    React.createElement(TouchableOpacity, {
      testID: 'address-list-nav',
      onPress: () => props.onNavigationRedirect?.('AddressForm', { isEditing: true })
    })
  )
)

const Checkout = (props) => (
  React.createElement(
    View,
    { testID: 'checkout-controller' },
    React.createElement(TouchableOpacity, {
      testID: 'checkout-place-order-existing',
      onPress: () => props.onPlaceOrderClick?.({}, {}, { order: { uuid: 'ord-1' } })
    }),
    React.createElement(TouchableOpacity, {
      testID: 'checkout-place-order-stripe',
      onPress: () => props.onPlaceOrderClick?.({}, { gateway: 'stripe' }, { status: 2, uuid: 'cart-1' }, { scrollToTop: jest.fn() })
    }),
    React.createElement(TouchableOpacity, {
      testID: 'checkout-place-order-redirect',
      onPress: () => props.onPlaceOrderClick?.({}, { gateway: 'epayco' }, { status: 2, paymethod_data: { result: { action: { type: 'redirect', redirect_url: 'https://pay.test' } } } }, { scrollToTop: jest.fn() })
    }),
    React.createElement(TouchableOpacity, {
      testID: 'checkout-nav',
      onPress: () => props.onNavigationRedirect?.('PaymentOptions', { cartUuid: 'c1' })
    }),
    React.createElement(TouchableOpacity, {
      testID: 'checkout-nav-empty',
      onPress: () => props.onNavigationRedirect?.('', null)
    }),
    React.createElement(TouchableOpacity, {
      testID: 'checkout-go-back',
      onPress: () => props.onGoBack?.()
    })
  )
)

const PaymentDetails = (props) => (
  React.createElement(
    View,
    { testID: 'payment-details-controller' },
    React.createElement(TouchableOpacity, {
      testID: 'payment-details-redirect',
      onPress: () => props.onNavigationRedirect?.('PaymentOptions', { cartUuid: 'c1' })
    }),
    React.createElement(TouchableOpacity, {
      testID: 'payment-details-back',
      onPress: () => props.goToBack?.()
    })
  )
)

const PaymentOptions = (props) => (
  React.createElement(
    View,
    { testID: 'payment-options-controller' },
    React.createElement(TouchableOpacity, {
      testID: 'payment-options-redirect',
      onPress: () => props.handleRedirect?.('Checkout', { cartUuid: 'c1' }, false)
    }),
    React.createElement(TouchableOpacity, {
      testID: 'payment-options-replace',
      onPress: () => props.handleRedirect?.('Checkout', { cartUuid: 'c1' }, true)
    }),
    React.createElement(TouchableOpacity, {
      testID: 'payment-options-back',
      onPress: () => props.goToBack?.()
    })
  )
)

const MyOrders = (props) => (
  React.createElement(
    View,
    { testID: 'my-orders-controller' },
    React.createElement(Text, { testID: 'my-orders-franchise-id' }, String(props.franchiseId)),
    React.createElement(TouchableOpacity, {
      testID: 'my-orders-back',
      onPress: () => props.goToBack?.()
    }),
    React.createElement(TouchableOpacity, {
      testID: 'my-orders-nav',
      onPress: () => props.onNavigationRedirect?.('OrderDetails', { orderId: 5 })
    }),
    React.createElement(TouchableOpacity, {
      testID: 'my-orders-nav-empty',
      onPress: () => props.onNavigationRedirect?.('', null)
    }),
    React.createElement(TouchableOpacity, {
      testID: 'my-orders-checkout',
      onPress: () => props.handleRedirectToCheckout?.('cart-uuid')
    }),
    React.createElement(TouchableOpacity, {
      testID: 'my-orders-checkout-empty',
      onPress: () => props.handleRedirectToCheckout?.(null)
    })
  )
)

const OrderDetails = (props) => (
  React.createElement(
    View,
    { testID: 'order-details-controller' },
    React.createElement(TouchableOpacity, {
      testID: 'order-details-go-back',
      onPress: () => props.onGoBack?.()
    }),
    React.createElement(TouchableOpacity, {
      testID: 'order-details-nav',
      onPress: () => props.onNavigationRedirect?.('ReviewOrder', { order: { id: 1 } })
    }),
    React.createElement(TouchableOpacity, {
      testID: 'order-details-nav-empty',
      onPress: () => props.onNavigationRedirect?.('', null)
    })
  )
)

const ReviewDriver = (props) => (
  React.createElement(
    View,
    { testID: 'review-driver-controller' },
    React.createElement(TouchableOpacity, {
      testID: 'review-driver-nav',
      onPress: () => props.onNavigationRedirect?.('OrderDetails', { orderId: 2 })
    })
  )
)

const ReviewOrder = (props) => (
  React.createElement(
    View,
    { testID: 'review-order-controller' },
    React.createElement(TouchableOpacity, {
      testID: 'review-order-nav',
      onPress: () => props.onNavigationRedirect?.('ReviewProducts', { order: { id: 3 } })
    })
  )
)

const ReviewProducts = (props) => (
  React.createElement(
    View,
    { testID: 'review-products-controller' },
    React.createElement(TouchableOpacity, {
      testID: 'review-products-nav',
      onPress: () => props.onNavigationRedirect?.('Home', {})
    })
  )
)

const NotificationsList = (props) => (
  React.createElement(
    View,
    { testID: 'notifications-list-controller' },
    React.createElement(TouchableOpacity, {
      testID: 'notifications-nav',
      onPress: () => props.onNavigationRedirect?.('Profile', {})
    }),
    React.createElement(TouchableOpacity, {
      testID: 'notifications-back',
      onPress: () => props.goToBack?.()
    })
  )
)

const USER_TYPE = {
  DRIVER: 'driver',
  BUSINESS: 'business'
}

const MessageListing = (props) => (
  React.createElement(
    View,
    { testID: 'message-listing-controller' },
    React.createElement(Text, { testID: 'message-listing-franchise-id' }, String(props.franchiseId)),
    React.createElement(TouchableOpacity, {
      testID: 'message-listing-nav',
      onPress: () => props.onNavigationRedirect?.('MessageView', { orderId: 1 })
    }),
    React.createElement(TouchableOpacity, {
      testID: 'message-listing-back',
      onPress: () => props.goToBack?.()
    }),
    React.createElement(TouchableOpacity, {
      testID: 'message-listing-refresh',
      onPress: () => props.setRefreshOrders?.(true)
    })
  )
)

const Messages = (props) => (
  React.createElement(
    View,
    { testID: 'messages-chat-controller' },
    React.createElement(TouchableOpacity, {
      testID: 'messages-close',
      onPress: () => props.onClose?.()
    })
  )
)

const UserProfile = (props) => (
  React.createElement(
    View,
    { testID: 'user-profile-controller' },
    React.createElement(Text, { testID: 'profile-app-version' }, String(props.appVersion)),
    React.createElement(TouchableOpacity, {
      testID: 'profile-nav',
      onPress: () => props.onNavigationRedirect?.('ProfileForm', { field: 'name' })
    }),
    React.createElement(TouchableOpacity, {
      testID: 'profile-back',
      onPress: () => props.goToBack?.()
    })
  )
)

const Help = (props) => (
  React.createElement(
    View,
    { testID: 'help-controller' },
    React.createElement(Text, { testID: 'help-franchise-id' }, String(props.franchiseId)),
    React.createElement(Text, { testID: 'help-business-id' }, String(props.businessId)),
    React.createElement(TouchableOpacity, {
      testID: 'help-redirect',
      onPress: () => props.onRedirect?.('HelpOptions', { type: 'faq' })
    })
  )
)

const HelpOptions = (props) => (
  React.createElement(
    View,
    { testID: 'help-options-controller' },
    React.createElement(Text, { testID: 'help-options-type' }, String(props.type))
  )
)

const CouponOffers = (props) => (
  React.createElement(
    View,
    { testID: 'coupon-offers-controller' },
    React.createElement(Text, { testID: 'coupon-business-id' }, String(props.businessId)),
    React.createElement(TouchableOpacity, {
      testID: 'coupon-go-back',
      onPress: () => props.onGoBack?.()
    })
  )
)

const NotFoundSource = ({ content, btnTitle, onClickButton }) => (
  React.createElement(
    View,
    { testID: 'not-found-source' },
    React.createElement(Text, { testID: 'not-found-content' }, content),
    React.createElement(TouchableOpacity, {
      testID: 'not-found-button',
      onPress: () => onClickButton?.()
    }, React.createElement(Text, null, btnTitle))
  )
)

const Container = ({ children }) => (
  React.createElement(View, { testID: 'container' }, children)
)

const NetworkError = ({ loadingData }) => (
  React.createElement(
    View,
    { testID: 'network-error-screen' },
    loadingData
      ? React.createElement(Text, { testID: 'network-error-loading' }, 'loading')
      : React.createElement(
        View,
        null,
        React.createElement(Text, { testID: 'network-error-title' }, 'No internet connection'),
        React.createElement(TouchableOpacity, { testID: 'network-error-refresh' })
      )
  )
)

const ACCOUNT_VALUES = {
  ACCOUNT: 'account',
  LOGIN: 'login',
  SIGNUP: 'signup',
  FORGOT: 'forgot'
}

const UserProfileForm = (props) => (
  React.createElement(
    View,
    { testID: 'user-profile-form' },
    React.createElement(TouchableOpacity, {
      testID: 'profile-form-nav',
      onPress: () => props.onNavigationRedirect?.('Profile', {})
    })
  )
)

const ProjectForm = (props) => (
  React.createElement(
    View,
    { testID: 'project-form-controller' },
    React.createElement(TouchableOpacity, {
      testID: 'project-form-nav',
      onPress: () => props.onNavigationRedirect?.('Login', {})
    }),
    React.createElement(TouchableOpacity, {
      testID: 'project-form-nav-empty',
      onPress: () => props.onNavigationRedirect?.('', null)
    })
  )
)

const Rewards = (props) => (
  React.createElement(
    View,
    { testID: 'rewards-controller' },
    React.createElement(Text, { testID: 'rewards-franchise-id' }, String(props.franchiseId)),
    React.createElement(TouchableOpacity, {
      testID: 'rewards-nav',
      onPress: () => props.onNavigationRedirect?.('RewardsTransactions', { walletId: 1 })
    }),
    React.createElement(TouchableOpacity, {
      testID: 'rewards-business',
      onPress: () => props.handleBusinessClick?.({ slug: 'demo-store', id: 1 })
    })
  )
)

const PurchaseGiftCard = (props) => (
  React.createElement(
    View,
    { testID: 'purchase-gift-card-controller' },
    React.createElement(TouchableOpacity, {
      testID: 'purchase-gift-nav',
      onPress: () => props.onNavigationRedirect?.('RedeemGiftCard', {})
    })
  )
)

const RedeemGiftCard = (props) => (
  React.createElement(
    View,
    { testID: 'redeem-gift-card-controller' },
    React.createElement(TouchableOpacity, {
      testID: 'redeem-gift-nav',
      onPress: () => props.onNavigationRedirect?.('Profile', {})
    })
  )
)

module.exports = {
  NavBar,
  SafeAreaViewWrapper,
  LoginForm,
  SignupForm,
  ForgotPasswordForm,
  UserVerification,
  Sessions,
  OIcon,
  OText,
  HomeView,
  BusinessesListing,
  NavBarCustomized,
  SafeAreaContainer,
  BusinessInformation,
  BusinessProductsListing,
  BusinessProductsList,
  BusinessPreorder,
  BusinessReviews,
  Favorite,
  ProductForm,
  MomentOption,
  UpsellingProducts,
  AddressForm,
  AddressList,
  Checkout,
  PaymentDetails,
  PaymentOptions,
  MyOrders,
  OrderDetails,
  ReviewDriver,
  ReviewOrder,
  ReviewProducts,
  NotificationsList,
  USER_TYPE,
  MessageListing,
  Messages,
  UserProfile,
  Help,
  HelpOptions,
  CouponOffers,
  NotFoundSource,
  Container,
  NetworkError,
  ACCOUNT_VALUES,
  UserProfileForm,
  ProjectForm,
  Rewards,
  PurchaseGiftCard,
  RedeemGiftCard,
  _setStoreData,
  _removeStoreData,
  _retrieveStoreData,
  useHomeValues,
  useBusinessSelected,
  useNearestBusiness,
  onChangeBusinessSelected,
  DeviceOrientationMethods
}

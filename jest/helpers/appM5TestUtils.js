const React = require('react')
const { Text, TouchableOpacity, View } = require('react-native')
const {
  mockBusiness,
  mockNavigation,
  mockUtils,
  mockProduct,
  mockCart
} = require('./appM4TestUtils')

const mockCheckoutCart = {
  ...mockCart,
  uuid: 'cart-1',
  balance: 12,
  paymethod_id: 1,
  paymethod_data: { gateway: 'cash', id: 'pm-cash' },
  payment_events: [],
  driver_tip: 0,
  valid_maximum: true,
  valid_minimum: true
}

const mockPaymethodCash = {
  id: 1,
  name: 'Cash',
  gateway: 'cash',
  credentials: {}
}

const mockPaymethodStripe = {
  id: 2,
  name: 'Stripe',
  gateway: 'stripe',
  credentials: { publishable: 'pk_test_123' }
}

const mockPaymethodApplePay = {
  id: 3,
  name: 'Apple Pay',
  gateway: 'apple_pay',
  credentials: { publishable: 'pk_test_123' }
}

const mockCard = {
  id: 'card_1',
  brand: 'visa',
  last4: '4242',
  zipcode: '10001'
}

const mockCardsList = {
  loading: false,
  error: null,
  cards: [mockCard]
}

const mockWalletsState = {
  loading: false,
  error: null,
  result: [
    { id: 2, type: 'cash', valid: true, balance: 20, redemption_rate: 1 }
  ]
}

const mockWalletBusinessConfigs = [
  { key: 'wallet_cash_enabled', value: '1' },
  { key: 'wallet_credit_point_enabled', value: '1' }
]

const mockWalletConfigs = {
  wallet_cash_enabled: { value: '1' },
  wallet_credit_point_enabled: { value: '1' },
  stripe_currency: { value: 'USD' },
  currency_position: { value: 'left' },
  format_number_currency: { value: '$' },
  default_country_code: { value: 'US' }
}

const mockTaxData = {
  id: 1,
  name: 'Sales Tax',
  description: 'Local sales tax',
  rate: 8.875,
  type: 1,
  rate_type: 1
}

const mockTaxProduct = {
  ...mockProduct,
  tax: { id: 1 },
  fee: { id: null },
  business_id: 1,
  code: 'prod-10',
  offers: []
}

const mockOrderingApi = {
  root: 'https://api.test/v400/en/test',
  appId: 'ordering-app',
  setAccessToken: () => ({
    paymentCards: () => ({
      getCredentials: async () => ({
        content: { error: false, result: { publishable: 'pk_test_123' } }
      })
    })
  })
}

const mockSocket = {
  on: jest.fn(),
  off: jest.fn()
}

const placeholderMock = {
  Fade: ({ children }) => children,
  Placeholder: ({ children }) => children,
  PlaceholderLine: () => null
}

const stripeCardDetails = {
  last4: '4242',
  expiryMonth: 12,
  expiryYear: 30,
  brand: 'visa',
  postalCode: '10001'
}

const StripeCardFormField = React.forwardRef(({ onFormComplete }, ref) => {
  React.useImperativeHandle(ref, () => ({ clear: jest.fn() }))
  return React.createElement(
    TouchableOpacity,
    {
      testID: 'stripe-card-form',
      onPress: () => onFormComplete?.(stripeCardDetails)
    },
    React.createElement(Text, null, 'Stripe card')
  )
})

const StripeCardField = ({ onCardChange }) => (
  React.createElement(
    TouchableOpacity,
    {
      testID: 'stripe-card-field',
      onPress: () => onCardChange?.(stripeCardDetails)
    },
    React.createElement(Text, null, 'Stripe card field')
  )
)

const stripeNativeMock = {
  usePlatformPay: jest.fn(() => ({
    isPlatformPaySupported: jest.fn(async () => false),
    confirmPlatformPayPayment: jest.fn(),
    createPlatformPayPaymentMethod: jest.fn(async () => ({
      error: null,
      paymentMethod: {
        id: 'pm_platform',
        paymentMethodType: 'Card',
        Card: { brand: 'visa', last4: '4242' }
      }
    }))
  })),
  useConfirmPayment: jest.fn(() => ({
    confirmPayment: jest.fn(async () => ({ paymentIntent: null, error: null }))
  })),
  useConfirmSetupIntent: jest.fn(() => ({
    confirmSetupIntent: jest.fn(async () => ({
      setupIntent: { status: 'succeeded', paymentMethod: { id: 'pm_1' } },
      error: null
    })),
    loading: false
  })),
  createPaymentMethod: jest.fn(async () => ({
    paymentMethod: { id: 'pm_1', Card: { brand: 'visa', last4: '4242' } },
    error: null
  })),
  initStripe: jest.fn(),
  dismissPlatformPay: jest.fn(),
  CardField: StripeCardField,
  CardForm: StripeCardFormField,
  StripeProvider: ({ children }) => children,
  PlatformPay: {
    BillingAddressFormat: { Full: 'Full' },
    PaymentType: { Immediate: 'Immediate' }
  }
}

const creditCardInputMock = {
  CreditCardInput: ({ onChange }) => (
    React.createElement(
      TouchableOpacity,
      {
        testID: 'credit-card-input',
        onPress: () => onChange?.({
          valid: true,
          values: {
            name: 'Test User',
            number: '4242424242424242',
            cvc: '123',
            expiry: '12/30',
            type: 'visa'
          }
        })
      },
      React.createElement(Text, null, 'Credit card')
    )
  )
}

const webViewMock = () => {
  const WebView = React.forwardRef((props, ref) => {
    React.useImperativeHandle(ref, () => ({
      postMessage: jest.fn()
    }))
    React.useEffect(() => {
      props.onLoadEnd && props.onLoadEnd({ nativeEvent: {} })
    }, [])
    return React.createElement(View, { testID: 'webview' })
  })
  WebView.displayName = 'WebView'
  return { __esModule: true, default: WebView }
}

const driverTipsUIProps = {
  driverTip: 10,
  driverTipsOptions: [10, 15, 20],
  isMulti: false,
  isLoading: false,
  cart: mockCheckoutCart,
  carts: [mockCheckoutCart],
  isDriverTipUseCustom: true,
  handlerChangeOption: jest.fn(),
  isFixedPrice: false
}

const paymentOptionWalletUIProps = {
  businessConfigs: mockWalletBusinessConfigs,
  businessId: 1,
  walletsState: mockWalletsState,
  selectWallet: jest.fn(),
  deletetWalletSelected: jest.fn()
}

const paymentOptionStripeUIProps = {
  onSelectCard: jest.fn(),
  onCancel: jest.fn(),
  deleteCard: jest.fn(),
  cardSelected: mockCard,
  cardsList: mockCardsList,
  handleCardClick: jest.fn(),
  handleNewCard: jest.fn(),
  businessId: 1,
  publicKey: 'pk_test_123',
  clientSecret: null
}

const paymentOptionCardUIProps = {
  scrollViewRef: { current: { scrollToEnd: jest.fn() } },
  cardSelected: mockCard,
  deleteCard: jest.fn(),
  onSelectCard: jest.fn(),
  handleCardClick: jest.fn(),
  cardsList: mockCardsList,
  addCardOpen: { stripe: false, stripeConnect: false, card: false },
  setAddCardOpen: jest.fn(),
  gateway: 'stripe',
  handleNewCard: jest.fn(),
  paymethodsWithoutSaveCards: [],
  paymethodV2Featured: ['get_cards', 'register_cards', 'delete_cards'],
  paymethod: mockPaymethodStripe,
  navigation: mockNavigation,
  deleteUserCard: jest.fn(),
  paySelected: { data: { id: 'card_1' } },
  loadingPayment: { loading: false, id: null },
  showGateway: { open: false, closedByUser: false },
  setShowGateway: jest.fn(),
  globalPayIFrameUrl: 'https://example.com/globalpay',
  cybersourceIFrameUrl: 'https://example.com/cybersource',
  onNavigationRedirect: jest.fn(),
  setCardList: jest.fn(),
  setCardsList: jest.fn(),
  deleteBusinessUserPaymethod: jest.fn(),
  createBusinessUserPaymethod: jest.fn(),
  paymethodSelectedInfo: mockPaymethodStripe,
  businessId: 1
}

const paymentOptionsUIProps = {
  businessId: 1,
  navigation: mockNavigation,
  isLoading: false,
  isDisabled: false,
  paymethodData: {},
  paymethodsList: {
    loading: false,
    error: null,
    paymethods: [mockPaymethodCash, mockPaymethodStripe]
  },
  setPaymethodData: jest.fn(),
  handleRedirect: jest.fn(),
  handlePaymethodClick: jest.fn(),
  handlePaymethodDataChange: jest.fn(),
  isOpenMethod: { paymethod: mockPaymethodCash },
  handlePlaceOrder: jest.fn(),
  setPlaceByMethodPay: jest.fn(),
  placeByMethodPay: false,
  paymethodV2Featured: [],
  setCardList: jest.fn(),
  onPaymentChange: jest.fn(),
  globalPayIFrameUrl: '',
  cybersourceIFrameUrl: '',
  createBusinessUserPaymethod: jest.fn(),
  paySelected: mockPaymethodCash
}

const stripeCardsListUIProps = {
  navigation: mockNavigation,
  paymethod: mockPaymethodStripe,
  cardsList: mockCardsList,
  businessId: 1,
  paySelected: { data: { id: 'card_1' } },
  deleteCard: jest.fn(),
  onSelectCard: jest.fn(),
  handleCardClick: jest.fn(),
  cardSelected: mockCard,
  paymethodV2Featured: ['delete_cards'],
  deleteUserCard: jest.fn(),
  gateway: 'stripe',
  deleteBusinessUserPaymethod: jest.fn(),
  setReadyToSave: jest.fn(),
  publicKey: 'pk_test_123',
  clientSecret: null,
  handleSource: jest.fn(),
  handleNewCard: jest.fn(),
  scrollViewRef: { current: { scrollToEnd: jest.fn() } }
}

const stripeElementsFormUIProps = {
  publicKeyState: { key: 'pk_test_123', loading: false, error: null },
  handleSource: jest.fn(),
  values: { loading: false, loadingAdd: false, error: null, requirements: null },
  businessId: 1,
  requirements: null,
  stripeTokenHandler: jest.fn(),
  methodsPay: [],
  paymethod: 'stripe',
  onCancel: jest.fn(),
  cart: mockCheckoutCart,
  placeByMethodPay: false,
  setPlaceByMethodPay: jest.fn(),
  cartTotal: 12,
  publicKeyAddCard: 'pk_test_123',
  urlscheme: 'orderingapp',
  androidAppId: 'com.test.app',
  businessNames: 'Test Store',
  getBillingDetails: () => ({ name: 'Test User', email: 'test@example.com' }),
  merchantId: 'merchant-1'
}

const stripeCardFormUIProps = {
  stateCardForm: { error: null, loading: false },
  handleCancel: jest.fn(),
  handleSubmit: jest.fn(),
  publicKey: 'pk_test_123'
}

const stripeRedirectFormUIProps = {
  paymethods: [{ value: 'ideal', name: 'iDEAL', content: 'iDEAL' }],
  publicKey: 'pk_test_123',
  handleSubmitPaymentMethod: jest.fn()
}

module.exports = {
  mockBusiness,
  mockNavigation,
  mockUtils,
  mockProduct,
  mockCart,
  mockCheckoutCart,
  mockPaymethodCash,
  mockPaymethodStripe,
  mockPaymethodApplePay,
  mockCard,
  mockCardsList,
  mockWalletsState,
  mockWalletBusinessConfigs,
  mockWalletConfigs,
  mockTaxData,
  mockTaxProduct,
  mockOrderingApi,
  mockSocket,
  placeholderMock,
  stripeNativeMock,
  creditCardInputMock,
  webViewMock,
  driverTipsUIProps,
  paymentOptionWalletUIProps,
  paymentOptionStripeUIProps,
  paymentOptionCardUIProps,
  paymentOptionsUIProps,
  stripeCardsListUIProps,
  stripeElementsFormUIProps,
  stripeCardFormUIProps,
  stripeRedirectFormUIProps
}

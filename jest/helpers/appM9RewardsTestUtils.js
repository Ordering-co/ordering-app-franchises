const React = require('react')
const { Text, TextInput, TouchableOpacity, View } = require('react-native')
const franchiseAppUiMock = require('./franchiseAppUiMock')

const mockUtils = {
  parsePrice: (value) => `$${value ?? 0}`,
  parseDate: (value) => String(value || ''),
  optimizeImage: (url) => url || ''
}

const mockAuthUser = {
  id: 7,
  name: 'Pat',
  lastname: 'Lee',
  email: 'pat@test.com'
}

const mockAuthSession = {
  auth: true,
  user: mockAuthUser,
  token: 'tok'
}

const mockRewardsConfigs = {
  wallet_cash_enabled: { value: '1' },
  wallet_credit_point_enabled: { value: '1' },
  platform_store_giftcard_enabled: { value: '1' },
  stripe_currency: { value: 'USD' },
  format_time: { value: '24' }
}

const mockTwelveHourConfigs = {
  ...mockRewardsConfigs,
  format_time: { value: '12' }
}

const mockGiftDisabledConfigs = {
  ...mockRewardsConfigs,
  platform_store_giftcard_enabled: { value: '0' }
}

const mockCashWallet = {
  id: 11,
  type: 'cash',
  balance: 12.5
}

const mockCreditWallet = {
  id: 22,
  type: 'credit_point',
  balance: 40
}

const mockWalletList = {
  loading: false,
  error: null,
  wallets: [mockCashWallet, mockCreditWallet]
}

const mockLoadingWalletList = {
  loading: true,
  error: null,
  wallets: []
}

const mockErrorWalletList = {
  loading: false,
  error: ['Wallet failed'],
  wallets: []
}

const mockWalletsIds = [
  { type: 'cash', id: 11, active: true },
  { type: 'points', id: 22, active: true }
]

const mockTransaction = {
  id: 301,
  amount: 15,
  created_at: '2026-09-07 16:00:00',
  description: 'Promo credit'
}

const mockDebitTransaction = {
  id: 302,
  amount: -8,
  created_at: '2026-09-07 17:00:00',
  description: null
}

const mockGiftCard = {
  id: 51,
  status: 'pending',
  created_at: '2026-09-07 16:00:00',
  order_product: {
    order_id: 901,
    name: 'Birthday Card',
    price: 25,
    images: 'https://example.com/card.jpg'
  }
}

const mockActivatedGiftCard = {
  ...mockGiftCard,
  id: 52,
  status: 'activated',
  order_product: {
    ...mockGiftCard.order_product,
    name: 'Redeemed Card',
    images: null
  }
}

const mockOtherStatusGiftCard = {
  ...mockGiftCard,
  id: 53,
  status: 'sent'
}

const mockGiftProduct = {
  id: 71,
  name: '$25 Gift Card'
}

const mockGiftProductAlt = {
  id: 72,
  name: '$50 Gift Card'
}

const mockRedeemedGiftCard = {
  type: 'cash',
  amount: 50,
  receiver: { name: 'Pat', lastname: 'Lee' },
  title: 'Happy birthday',
  message: 'Enjoy this card'
}

const buildWeekSchedule = (overrides = {}) => {
  const lapse = {
    open: { hour: overrides.openHour ?? 0, minute: overrides.openMinute ?? 0 },
    close: { hour: overrides.closeHour ?? 23, minute: overrides.closeMinute ?? 45 }
  }
  const day = {
    enabled: overrides.enabled !== false,
    lapses: overrides.lapses || [lapse]
  }
  return {
    0: { ...day },
    1: { ...day },
    2: { ...day },
    3: { ...day },
    4: { ...day },
    5: { ...day },
    6: { ...day }
  }
}

const mockProfessional = {
  id: 4,
  name: 'Alex',
  lastname: 'Kim',
  photo: 'https://example.com/alex.jpg',
  favorite: false,
  schedule: buildWeekSchedule(),
  busy_times: []
}

const mockFavoriteProfessional = {
  ...mockProfessional,
  id: 5,
  name: 'Sam',
  lastname: 'Ortiz',
  photo: null,
  favorite: true
}

const mockLoyaltyLevel = {
  id: 2,
  name: 'Gold',
  loyalty_level_points: 80,
  image: 'https://example.com/gold.png',
  benefits: ['Free dessert', 'Priority seat']
}

const mockLastLoyaltyLevel = {
  id: 3,
  name: 'Platinum',
  loyalty_level_points: 200,
  image: null,
  benefits: []
}

const mockHighPointsLevel = {
  ...mockLoyaltyLevel,
  loyalty_level_points: 100000
}

const mockLevelList = {
  levels: [
    { id: 1, name: 'Silver', minimum_points: 0 },
    { id: 2, name: 'Gold', minimum_points: 50 },
    { id: 3, name: 'Platinum', minimum_points: 150 }
  ]
}

const mockOffer = {
  id: 21,
  name: 'Lunch Special',
  description: 'Save on lunch',
  image: 'https://example.com/offer.jpg',
  end: '2026-12-01',
  target: 1,
  rate_type: 1,
  rate: 10,
  type: 2,
  coupon: 'LUNCH10',
  auto: true,
  minimum: 20,
  max_discount: 5,
  businesses: [
    { id: 1, name: 'Main Store', logo: 'https://example.com/logo.jpg', franchise_id: 9 },
    { id: 2, name: 'Other Store', logo: null, franchise_id: 8 }
  ]
}

const mockDeliveryOffer = {
  id: 22,
  name: 'Delivery Deal',
  description: null,
  image: null,
  end: '2026-12-15',
  target: 2,
  rate_type: 2,
  rate: 3,
  type: 1,
  coupon: null,
  auto: false,
  minimum: null,
  max_discount: null,
  businesses: []
}

const mockServiceOffer = {
  ...mockDeliveryOffer,
  id: 23,
  name: 'Service Deal',
  target: 3,
  businesses: [
    { id: 3, name: 'No Logo Store', logo: null, franchise_id: 9 }
  ]
}

const verticalGiftCardUIProps = {
  giftCards: { loading: false, list: [mockGiftCard] },
  paginationProps: { currentPage: 1, totalPages: 1 },
  loadMoreOrders: jest.fn(),
  title: 'Pending',
  setIsEmpty: jest.fn(),
  onNavigationRedirect: jest.fn(),
  allowLoading: false
}

const sendGiftCardUIProps = {
  actionState: { loading: false, error: null },
  handleSendGiftCard: jest.fn()
}

const singleProfessionalCardUIProps = {
  handleFavoriteProfessional: jest.fn(),
  professional: mockProfessional,
  active: false,
  handleProfessionalClick: jest.fn()
}

const rewardsUIProps = {
  walletList: mockWalletList,
  userLoyaltyLevel: { loyaltyLevel: mockLoyaltyLevel },
  levelList: mockLevelList,
  transactionsList: { loading: false, list: {}, error: null },
  handleBusinessClick: jest.fn(),
  onNavigationRedirect: jest.fn(),
  franchiseId: 9
}

const offersUIProps = {
  handleBusinessClick: jest.fn(),
  offersState: { loading: false, offers: [mockOffer, mockDeliveryOffer], error: null },
  searchValue: '',
  loadOffers: jest.fn(),
  franchiseId: 9
}

const purchaseGiftCardUIProps = {
  goToBack: jest.fn(),
  productsListState: { loading: false, products: [mockGiftProduct, mockGiftProductAlt] },
  selectedProduct: null,
  setSelectedProduct: jest.fn(),
  handleAccept: jest.fn()
}

const redeemGiftCardUIProps = {
  actionState: { loading: false, error: null },
  redeemedGiftCard: null,
  handleApply: jest.fn()
}

const transactionsUIProps = {
  walletsIds: mockWalletsIds,
  transactions: {
    loading: false,
    error: null,
    list: {
      'wallet:11': [mockTransaction],
      'wallet:22': [mockDebitTransaction]
    }
  },
  walletSelected: 11,
  setWalletSelected: jest.fn()
}

const StringOInput = React.forwardRef(({ placeholder, onChange, value, testID, name, ...rest }, ref) => (
  React.createElement(TextInput, {
    ref,
    placeholder,
    value,
    testID: testID || placeholder || name,
    onChangeText: (text) => onChange?.(text),
    ...rest
  })
))

const OTextClipboardMock = ({ children, text }) => (
  React.createElement(View, { testID: 'clipboard', accessibilityLabel: text }, children)
)

const ProfessionalProfileStub = ({ professional, onClose, handleChangeProfessionalSelected }) => (
  React.createElement(
    View,
    { testID: 'professional-profile' },
    React.createElement(Text, null, `${professional?.name || ''} ${professional?.lastname || ''}`.trim()),
    React.createElement(
      TouchableOpacity,
      {
        testID: 'book-professional',
        onPress: () => {
          handleChangeProfessionalSelected?.(professional)
          onClose?.()
        }
      },
      React.createElement(Text, null, 'Book')
    ),
    React.createElement(
      TouchableOpacity,
      { testID: 'close-professional-profile', onPress: onClose },
      React.createElement(Text, null, 'Close profile')
    )
  )
)

const appM9UiMock = {
  ...franchiseAppUiMock,
  OInput: StringOInput,
  OTextClipboard: OTextClipboardMock,
  ProfessionalProfile: ProfessionalProfileStub
}

const placeholderMock = {
  Fade: ({ children }) => children,
  Placeholder: ({ children }) => (
    React.createElement(View, { testID: 'placeholder' }, children)
  ),
  PlaceholderLine: () => React.createElement(View, { testID: 'placeholder-line' }),
  PlaceholderMedia: () => React.createElement(View, { testID: 'placeholder-media' })
}

const SelectDropdownMock = React.forwardRef(({ data, onSelect, renderCustomizedRowChild }, ref) => {
  React.useImperativeHandle(ref, () => ({
    reset: jest.fn()
  }))
  return React.createElement(
    View,
    { testID: 'select-dropdown' },
    (data || []).map((item, index) => (
      React.createElement(
        TouchableOpacity,
        {
          key: item.value || index,
          testID: `time-option-${item.value}`,
          onPress: () => onSelect?.(item, index)
        },
        renderCustomizedRowChild
          ? renderCustomizedRowChild(item, index)
          : React.createElement(Text, null, item.text)
      )
    ))
  )
})

const CalendarPickerMock = ({ onDateChange, previousComponent, nextComponent }) => (
  React.createElement(
    View,
    { testID: 'calendar-picker' },
    previousComponent,
    nextComponent,
    React.createElement(
      TouchableOpacity,
      {
        testID: 'calendar-tomorrow',
        onPress: () => {
          const next = new Date()
          next.setDate(next.getDate() + 1)
          onDateChange(next)
        }
      },
      React.createElement(Text, null, 'Pick tomorrow')
    )
  )
)

const linearGradientMock = ({ children }) => (
  React.createElement(View, { testID: 'linear-gradient' }, children)
)

module.exports = {
  mockUtils,
  mockAuthUser,
  mockAuthSession,
  mockRewardsConfigs,
  mockTwelveHourConfigs,
  mockGiftDisabledConfigs,
  mockCashWallet,
  mockCreditWallet,
  mockWalletList,
  mockLoadingWalletList,
  mockErrorWalletList,
  mockWalletsIds,
  mockTransaction,
  mockDebitTransaction,
  mockGiftCard,
  mockActivatedGiftCard,
  mockOtherStatusGiftCard,
  mockGiftProduct,
  mockGiftProductAlt,
  mockRedeemedGiftCard,
  buildWeekSchedule,
  mockProfessional,
  mockFavoriteProfessional,
  mockLoyaltyLevel,
  mockLastLoyaltyLevel,
  mockHighPointsLevel,
  mockLevelList,
  mockOffer,
  mockDeliveryOffer,
  mockServiceOffer,
  verticalGiftCardUIProps,
  sendGiftCardUIProps,
  singleProfessionalCardUIProps,
  rewardsUIProps,
  offersUIProps,
  purchaseGiftCardUIProps,
  redeemGiftCardUIProps,
  transactionsUIProps,
  appM9UiMock,
  placeholderMock,
  SelectDropdownMock,
  CalendarPickerMock,
  linearGradientMock
}

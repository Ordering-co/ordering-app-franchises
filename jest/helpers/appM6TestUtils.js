const React = require('react')
const { Text, TouchableOpacity, View } = require('react-native')
const {
  mockBusiness,
  mockNavigation,
  mockUtils
} = require('./appM3TestUtils')
const { mockProduct, mockCart } = require('./appM4TestUtils')

const mockUtilsM6 = {
  ...mockUtils,
  parseNumber: (value) => String(value ?? 0),
  parsePrice: (value) => `$${value ?? 0}`,
  parseDate: (value, opts) => {
    if (!value) return 'ASAP'
    if (value && typeof value.format === 'function') {
      return value.format(opts?.outputFormat || 'YYYY-MM-DD')
    }
    return String(value)
  },
  parseTime: (value, opts) => {
    if (value && typeof value.format === 'function') {
      return value.format(opts?.outputFormat || 'HH:mm')
    }
    return value ? String(value) : '12:00'
  }
}

const mockBusinessWithTz = {
  ...mockBusiness,
  timezone: 'America/New_York',
  cellphone: '555-0100'
}

const mockOrder = {
  id: 101,
  uuid: 'ord-101',
  status: 0,
  business_id: 1,
  business: { ...mockBusinessWithTz },
  customer: {
    name: 'Pat',
    lastname: 'Lee',
    address: '9 Pine St',
    location: { lat: 40.71, lng: -74.01 },
    photo: null
  },
  driver: null,
  products: [{
    id: 10,
    name: 'Cheese Pizza',
    quantity: 1,
    gift_card: null
  }],
  summary: { total: 18.5, subtotal: 16, tax: 1, discount: 0 },
  total: 18.5,
  delivery_type: 1,
  delivery_datetime: '2026-09-07 18:00:00',
  delivery_datetime_utc: '2026-09-07 22:00:00',
  created_at: '2026-09-07 16:00:00',
  favorite: false,
  review: null,
  user_review: null,
  cart: { uuid: 'cart-1' },
  cart_group_id: null,
  comment: 'Leave at door',
  delivery_option: { name: 'Leave at door' },
  spot_number: null,
  vehicle: null,
  reporting_data: { at: { 'status:0': '2026-09-07 16:10:00' } },
  eta_time: 20,
  eta_current_status_time: 5,
  eta_previous_status_times: {},
  eta_next_status_times: {},
  eta_current_status_penalty_time: 2,
  eta_drive_time: 8,
  delivered_in: 0,
  prepared_in: 10,
  external_id: null
}

const mockCompletedOrder = {
  ...mockOrder,
  id: 202,
  uuid: 'ord-202',
  status: 1,
  reporting_data: { at: { 'status:1': '2026-09-07 17:10:00' } }
}

const mockDriver = {
  name: 'Alex',
  lastname: 'Rivera',
  cellphone: '555-0199',
  photo: 'https://example.com/driver.jpg',
  location: { lat: 40.72, lng: -74.02 }
}

const mockOrderList = {
  loading: false,
  error: null,
  orders: [mockOrder]
}

const mockEmptyOrderList = {
  loading: false,
  error: null,
  orders: []
}

const mockLoadingOrderList = {
  loading: true,
  error: null,
  orders: []
}

const mockPagination = {
  currentPage: 1,
  totalPages: 2,
  pageSize: 10
}

const mockLastPage = {
  currentPage: 2,
  totalPages: 2,
  pageSize: 10
}

const mockDatesList = ['2026-09-07', '2026-09-08', '2026-09-09']

const mockHoursList = [
  { startTime: '09:00', endTime: '09:30' },
  { startTime: '12:00', endTime: '12:30' },
  { startTime: '18:00', endTime: '18:30' }
]

const mockSchedule = {
  lapses: [{ open: { hour: 8, minute: 0 }, close: { hour: 22, minute: 0 } }]
}

const mockOrdersLength = {
  activeOrdersLength: 1,
  previousOrdersLength: 1,
  preordersLength: 1
}

const mockEmptyOrdersLength = {
  activeOrdersLength: 0,
  previousOrdersLength: 0,
  preordersLength: 0
}

const mockOrderState = {
  loading: false,
  carts: { 'businessId:1': mockCart },
  options: { type: 1, moment: null }
}

const mockScheduledOrderState = {
  loading: false,
  carts: { 'businessId:1': mockCart },
  options: { type: 1, moment: '2026-09-08 09:00:00' }
}

const mockConfigs = {
  google_maps_api_key: { value: 'test-key' },
  platform_store_giftcard_enabled: { value: '1' },
  preorder_status_enabled: { value: '1' },
  general_hour_format: { value: 'hh:mm A' },
  max_days_preorder: { value: '6' },
  dates_moment_format: { value: 'YYYY-MM-DD HH:mm' },
  dates_general_format: { value: 'dddd, MMMM D YYYY' },
  order_types_allowed: { value: '1|2|4|5' },
  change_order_id: { value: '0' }
}

const mockOrderFns = {
  reorder: jest.fn(async () => ({ error: false, result: { uuid: 'cart-1' } })),
  changeMoment: jest.fn(),
  handleOrderStateLoading: jest.fn()
}

const placeholderMock = {
  Fade: ({ children }) => children,
  Placeholder: ({ children }) => children,
  PlaceholderLine: () => null
}

const linearGradientMock = ({ children }) => (
  React.createElement(View, { testID: 'linear-gradient' }, children)
)

const selectDropdownMock = (props) => {
  const label = props.defaultButtonText || props.data?.[0]?.value || 'dropdown'
  const kind = props.defaultButtonText ? 'time' : 'date'
  return React.createElement(
    View,
    { testID: `select-dropdown-${kind}` },
    React.createElement(Text, null, label),
    React.createElement(
      TouchableOpacity,
      {
        testID: `select-${kind}-option`,
        onPress: () => props.onSelect?.(props.data?.[0], 0)
      },
      React.createElement(Text, null, props.data?.[0]?.value || label)
    )
  )
}

const calendarStripMock = (props) => (
  React.createElement(
    View,
    { testID: 'calendar-strip' },
    React.createElement(Text, null, String(props.selectedDate || '')),
    React.createElement(
      TouchableOpacity,
      {
        testID: 'calendar-date',
        onPress: () => props.onDateSelected?.('2026-09-09')
      },
      React.createElement(Text, null, 'Pick date')
    )
  )
)

const orderEtaMock = () => React.createElement(Text, { testID: 'order-eta' }, 'ETA')

const orderBillMock = () => React.createElement(View, { testID: 'order-bill' })

const summaryBillMock = () => React.createElement(View, { testID: 'summary-bill' })

const momentOptionUIProps = {
  navigation: mockNavigation,
  datesList: mockDatesList,
  hoursList: mockHoursList,
  dateSelected: '2026-09-08',
  timeSelected: '18:00',
  cateringPreorder: false,
  isCart: false,
  preorderLeadTime: 0,
  preorderMaximumDays: 6,
  preorderMinimumDays: 0,
  isPage: true,
  business: mockBusinessWithTz,
  getActualSchedule: () => mockSchedule,
  handleAsap: jest.fn(),
  handleChangeDate: jest.fn(),
  handleChangeTime: jest.fn()
}

const momentSelectorUIProps = {
  datesList: mockDatesList,
  hoursList: mockHoursList,
  dateSelected: '2026-09-08',
  timeSelected: '18:00',
  handleChangeDate: jest.fn(),
  handleChangeTime: jest.fn()
}

const lastOrdersUIProps = {
  orderList: mockOrderList,
  setOrderList: jest.fn(),
  loadOrders: jest.fn(),
  refresh: false,
  setRefresh: jest.fn(),
  onRedirect: jest.fn(),
  fromHome: false
}

const lastOrderUIProps = {
  navigation: mockNavigation,
  activeOrders: false,
  preOrders: false,
  orderList: mockOrderList,
  pagination: mockPagination,
  titleContent: null,
  customArray: null,
  onNavigationRedirect: jest.fn(),
  orderStatus: [1, 2, 5, 6, 10, 11, 12, 16, 17],
  loadMoreOrders: jest.fn(),
  loadOrders: jest.fn()
}

const orderProgressUIProps = {
  orderList: mockOrderList,
  navigation: mockNavigation,
  loadOrders: jest.fn(),
  isFocused: true
}

const orderSummaryUIProps = {
  cart: mockCart,
  changeQuantity: jest.fn(),
  getProductMax: jest.fn(() => 10),
  offsetDisabled: jest.fn(),
  removeProduct: jest.fn(),
  isCartPending: false,
  isFromCheckout: false,
  commentState: { loading: false },
  handleChangeComment: jest.fn(),
  onNavigationRedirect: jest.fn(),
  handleRemoveOfferClick: jest.fn(),
  preorderSlotInterval: 15,
  preorderLeadTime: 0,
  preorderTimeRange: 30,
  preorderMaximumDays: 6,
  preorderMinimumDays: 0,
  cateringTypes: [],
  hideDeliveryFee: false,
  loyaltyRewardRate: 1,
  maxDate: null,
  hideProducts: false,
  hideCommentsByValidationCheckout: false,
  hideCouponByValidationCheckout: false,
  isGiftCardCart: false,
  hideDetails: false,
  hideAddProductsButton: false
}

const orderTypeUIProps = {
  typeSelected: 1,
  handleChangeOrderType: jest.fn(async (type) => type),
  setOrderTypeValue: jest.fn()
}

const ordersOptionUIProps = {
  navigation: mockNavigation,
  activeOrders: false,
  preOrders: false,
  orderList: mockOrderList,
  pagination: mockPagination,
  titleContent: null,
  customArray: null,
  onNavigationRedirect: jest.fn(),
  orderStatus: [0, 3, 4, 7, 8, 9, 14, 18, 19, 20, 21, 22, 23, 24, 25, 26],
  loadMoreStatus: false,
  loadMoreOrders: jest.fn(),
  loadOrders: jest.fn(),
  setOrdersLength: jest.fn(),
  ordersLength: mockOrdersLength,
  refreshOrders: false,
  setRefreshOrders: jest.fn(),
  reorderState: { loading: false, error: null, result: null },
  handleReorder: jest.fn(),
  handleUpdateOrderList: jest.fn(),
  isBusiness: false,
  isProducts: false,
  businessOrderIds: [],
  products: [],
  businessesSearchList: null,
  hideOrders: false,
  businesses: { loading: false, result: [] },
  handleUpdateProducts: jest.fn(),
  handleUpdateBusinesses: jest.fn(),
  selectedOption: 'orders'
}

const orderDetailsUIProps = {
  messages: { list: [] },
  setMessages: jest.fn(),
  readMessages: jest.fn(),
  reorderState: { loading: false, error: null, result: null },
  driverLocation: null,
  getOrder: jest.fn(),
  onGoBack: jest.fn(),
  handleReorder: jest.fn(async () => ({ uuid: 'cart-1' })),
  onNavigationRedirect: jest.fn(),
  isFromCheckout: false,
  order: { order: mockOrder, loading: false, error: null }
}

const singleOrderCardUIProps = {
  order: mockOrder,
  reorderLoading: false,
  handleReorder: jest.fn(),
  handleFavoriteOrder: jest.fn(),
  onNavigationRedirect: jest.fn(),
  pastOrders: false,
  isMessageView: false,
  handleClickOrder: jest.fn(),
  handleRemoveCart: jest.fn(),
  cartState: { loading: false },
  fromHome: false
}

module.exports = {
  mockBusiness,
  mockBusinessWithTz,
  mockNavigation,
  mockUtils: mockUtilsM6,
  mockProduct,
  mockCart,
  mockOrder,
  mockCompletedOrder,
  mockDriver,
  mockOrderList,
  mockEmptyOrderList,
  mockLoadingOrderList,
  mockPagination,
  mockLastPage,
  mockDatesList,
  mockHoursList,
  mockSchedule,
  mockOrdersLength,
  mockEmptyOrdersLength,
  mockOrderState,
  mockScheduledOrderState,
  mockConfigs,
  mockOrderFns,
  placeholderMock,
  linearGradientMock,
  selectDropdownMock,
  calendarStripMock,
  orderEtaMock,
  orderBillMock,
  summaryBillMock,
  momentOptionUIProps,
  momentSelectorUIProps,
  lastOrdersUIProps,
  lastOrderUIProps,
  orderProgressUIProps,
  orderSummaryUIProps,
  orderTypeUIProps,
  ordersOptionUIProps,
  orderDetailsUIProps,
  singleOrderCardUIProps
}

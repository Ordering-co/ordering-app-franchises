const React = require('react')
const { Text, TextInput, TouchableOpacity, View } = require('react-native')
const franchiseAppUiMock = require('./franchiseAppUiMock')

const ORDER_TYPES = [
  { value: 1, content: 'DELIVERY' },
  { value: 2, content: 'PICKUP' },
  { value: 3, content: 'EAT_IN' }
]

const mockParseDate = (value, opts) => {
  if (!value) return 'ASAP'
  return `${String(value)}:${opts?.outputFormat || 'default'}`
}

const mockAddress = {
  id: 1,
  address: '9 Pine St',
  address_notes: 'Leave at door',
  zipcode: '10001',
  internal_number: '2B',
  location: { lat: 40.71, lng: -74.01 },
  tag: 'home',
  default: true,
  route: 'Pine St',
  map_data: { library: 'google', place_id: 'place-1' }
}

const mockOfficeAddress = {
  id: 2,
  address: '1 Oak Ave',
  address_notes: '',
  zipcode: '10002',
  internal_number: '',
  location: { lat: 40.8, lng: -74.1 },
  tag: 'office',
  default: false,
  route: 'Oak Ave',
  map_data: { library: 'google', place_id: 'place-2' }
}

const mockAddressListState = {
  loading: false,
  error: null,
  addresses: [mockAddress, mockOfficeAddress]
}

const mockEmptyAddressList = {
  loading: false,
  error: null,
  addresses: []
}

const mockLoadingAddressList = {
  loading: true,
  error: null,
  addresses: []
}

const mockErrorAddressList = {
  loading: false,
  error: ['Failed to load addresses'],
  addresses: []
}

const mockIdleAddressFormState = {
  loading: false,
  changes: {},
  result: null,
  error: null
}

const mockChangedAddressFormState = {
  loading: false,
  changes: {
    address: '9 Pine St',
    location: { lat: 40.71, lng: -74.01 },
    map_data: { library: 'google', place_id: 'place-1' },
    zipcode: '10001'
  },
  result: null,
  error: null
}

const mockErrorAddressFormState = {
  loading: false,
  changes: { address: '9 Pine St' },
  result: { error: true, result: ['Address save failed'] },
  error: ['Address save failed']
}

const mockLoadingAddressFormState = {
  loading: true,
  changes: { address: '9 Pine St' },
  result: null,
  error: null
}

const mockAddressState = {
  loading: false,
  address: { ...mockAddress }
}

const mockEmptyAddressState = {
  loading: false,
  address: {
    address: '',
    address_notes: '',
    zipcode: '',
    internal_number: '',
    location: null,
    tag: null
  }
}

const mockDeliveryOptions = {
  type: 1,
  address: { ...mockAddress },
  address_id: 1,
  moment: null
}

const mockPickupOptions = {
  type: 2,
  address: { ...mockAddress },
  address_id: 1,
  moment: null
}

const mockMomentOptions = {
  type: 1,
  address: { ...mockAddress },
  address_id: 1,
  moment: '2026-09-07 18:00:00'
}

const mockEmptyOrderOptions = {
  type: 1,
  address: {},
  address_id: null,
  moment: null
}

const mockAddressConfigs = {
  preorder_status_enabled: { value: '1' },
  dates_moment_format: { value: 'MM/DD HH:mm' },
  general_hour_format: { value: 'HH:mm' },
  stripe_currency: { value: 'USD' },
  google_maps_api_key: { value: 'maps-key' },
  google_autocomplete_selection_required: { value: '0' },
  meters_to_change_address: { value: '100' },
  country_autocomplete: { value: 'US' },
  unaddressed_order_types_allowed: { value: '' },
  default_country_code: { value: 'US' },
  validation_phone_number_lib: { value: '1' },
  segment_track_id: { value: 'seg-key' }
}

const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  canGoBack: jest.fn(() => true)
}

const formHarness = {
  errors: {},
  setValue: jest.fn(),
  handleSubmit: (fn) => () => fn()
}

const resetFormHarness = () => {
  formHarness.errors = {}
  formHarness.setValue.mockClear()
}

const hookFormMock = {
  useForm: () => ({
    handleSubmit: formHarness.handleSubmit,
    control: {},
    errors: formHarness.errors,
    setValue: formHarness.setValue
  }),
  Controller: ({ render }) => render({
    onChange: jest.fn(),
    onBlur: jest.fn(),
    value: '',
    name: 'field'
  })
}

const createEventBus = () => {
  const listeners = {}
  const on = jest.fn((name, handler) => {
    listeners[name] = listeners[name] || []
    listeners[name].push(handler)
  })
  const off = jest.fn((name, handler) => {
    listeners[name] = (listeners[name] || []).filter((fn) => fn !== handler)
  })
  const emit = jest.fn((name, ...args) => {
    (listeners[name] || []).forEach((fn) => fn(...args))
  })
  const trigger = (name, ...args) => {
    (listeners[name] || []).forEach((fn) => fn(...args))
  }
  const reset = () => {
    Object.keys(listeners).forEach((key) => {
      delete listeners[key]
    })
    on.mockClear()
    off.mockClear()
    emit.mockClear()
  }
  return { listeners, on, off, emit, trigger, reset }
}

const mockEventBus = createEventBus()

const mockSegmentClient = {
  config: { writeKey: 'seg-key' },
  track: jest.fn(),
  identify: jest.fn()
}

const segmentMock = {
  createClient: jest.fn(() => mockSegmentClient),
  AnalyticsProvider: ({ children }) => children
}

const facebookSdkMock = {
  AppEventsLogger: {
    logEvent: jest.fn(),
    logPurchase: jest.fn(),
    AppEvents: {
      CompletedRegistration: 'CompletedRegistration',
      AddedToCart: 'AddedToCart',
      CustomizeProduct: 'CustomizeProduct',
      AddedPaymentInfo: 'AddedPaymentInfo'
    },
    AppEventParams: {
      RegistrationMethod: 'fb_registration_method',
      Description: 'fb_description',
      Currency: 'fb_currency',
      ContentID: 'fb_content_id',
      ContentType: 'fb_content_type'
    }
  }
}

const geocoderResult = {
  results: [{
    place_id: 'geo-1',
    geometry: { location: { lat: 40.71, lng: -74.01 } },
    address_components: [
      { types: ['postal_code'], short_name: '10001', long_name: '10001' }
    ]
  }]
}

const geocoderMock = {
  init: jest.fn(),
  from: jest.fn(() => Promise.resolve(geocoderResult))
}

const GooglePlacesTextInput = React.forwardRef((props, ref) => {
  React.useImperativeHandle(ref, () => ({
    blur: jest.fn()
  }))
  return React.createElement(
    View,
    { testID: 'google-places-input' },
    React.createElement(TextInput, {
      testID: 'places-text',
      placeholder: props.placeHolderText,
      value: props.value,
      onChangeText: props.onTextChange,
      onFocus: props.onFocus,
      onBlur: props.onBlur
    }),
    React.createElement(
      TouchableOpacity,
      {
        testID: 'select-place',
        onPress: () => props.onPlaceSelect?.({ placeId: 'place-1' })
      },
      React.createElement(Text, null, 'Select place')
    ),
    React.createElement(
      TouchableOpacity,
      {
        testID: 'places-error',
        onPress: () => props.onError?.('Places failed')
      },
      React.createElement(Text, null, 'Places error')
    )
  )
})

const googlePlacesTextInputMock = GooglePlacesTextInput

const GPSButtonMock = ({ handleGPS }) => (
  React.createElement(
    TouchableOpacity,
    {
      testID: 'gps-button',
      onPress: () => handleGPS?.(
        { address: '1 GPS St', place_id: 'gps-1' },
        { geometry: { location: { lat: 41, lng: -73 } } }
      )
    },
    React.createElement(Text, null, 'GPS')
  )
)

const OrderTypeSelectorMock = ({ setOrderTypeValue }) => (
  React.createElement(
    View,
    { testID: 'order-type-selector' },
    React.createElement(
      TouchableOpacity,
      { testID: 'select-delivery', onPress: () => setOrderTypeValue?.(1) },
      React.createElement(Text, null, 'Delivery type')
    ),
    React.createElement(
      TouchableOpacity,
      { testID: 'select-pickup', onPress: () => setOrderTypeValue?.(2) },
      React.createElement(Text, null, 'Pickup type')
    )
  )
)

const BusinessesListingMock = () => (
  React.createElement(View, { testID: 'businesses-listing' })
)

const AllowCurrentLocationMock = ({ onClose, setIsCanceledGeolocation }) => (
  React.createElement(
    View,
    { testID: 'allow-current-location' },
    React.createElement(
      TouchableOpacity,
      {
        testID: 'close-location',
        onPress: () => {
          setIsCanceledGeolocation?.(true)
          onClose?.()
        }
      },
      React.createElement(Text, null, 'Close location')
    )
  )
)

const AddressDetailsStub = ({ callback, addressToDeliver }) => (
  React.createElement(
    View,
    { testID: 'address-details-map' },
    React.createElement(Text, null, addressToDeliver || 'Map address'),
    React.createElement(
      TouchableOpacity,
      { testID: 'adjust-marker', onPress: callback },
      React.createElement(Text, null, 'Adjust marker')
    )
  )
)

const OrderConfigStub = ({
  handleSubmit,
  onSubmit,
  handleGoToPreorder,
  addressSelected,
  setIsOpenConfirmAddress
}) => (
  React.createElement(
    View,
    { testID: 'order-config' },
    React.createElement(Text, null, addressSelected || 'No selected address'),
    React.createElement(
      TouchableOpacity,
      {
        testID: 'order-config-submit',
        onPress: () => handleSubmit?.(onSubmit)?.()
      },
      React.createElement(Text, null, 'Confirm address')
    ),
    React.createElement(
      TouchableOpacity,
      { testID: 'order-config-preorder', onPress: handleGoToPreorder },
      React.createElement(Text, null, 'Go preorder')
    ),
    React.createElement(
      TouchableOpacity,
      {
        testID: 'order-config-close',
        onPress: () => setIsOpenConfirmAddress?.(false)
      },
      React.createElement(Text, null, 'Close config')
    )
  )
)

const mockHomeValuesState = {
  alternativeHome: false,
  userAddressStoraged: null
}

const mockHomeValuesFns = {
  onChangeAlternativeHome: jest.fn(),
  onChangeUserAddressStoraged: jest.fn(),
  onChangeOrder: jest.fn()
}

const mockResolveBusinessForLocation = jest.fn(async () => ({
  error: false,
  changed: false,
  business: { slug: 'demo-store', name: 'Demo Store' }
}))

const mockConfirmBusinessChange = jest.fn(async () => true)
const mockOnChangeBusinessSelected = jest.fn(async () => {})

const useHomeValues = jest.fn(() => [mockHomeValuesState, mockHomeValuesFns])
const useNearestBusiness = jest.fn(() => ({
  resolveBusinessForLocation: mockResolveBusinessForLocation,
  confirmBusinessChange: mockConfirmBusinessChange
}))
const useBusinessSelected = jest.fn(() => [
  { title: 'Demo Store', name: 'Demo Store', slug: 'demo-store' },
  { onChangeBusinessSelected: mockOnChangeBusinessSelected }
])

const AlertWithContent = ({ open, title, content, onAccept, onClose }) => (
  open
    ? React.createElement(
      View,
      { testID: 'alert' },
      React.createElement(Text, null, title),
      React.createElement(Text, null, Array.isArray(content) ? content[0] : content),
      React.createElement(TouchableOpacity, { testID: 'alert-accept', onPress: onAccept || onClose })
    )
    : null
)

const appM9UiMock = {
  ...franchiseAppUiMock,
  ORDER_TYPES,
  Alert: AlertWithContent,
  OAlertOriginal: AlertWithContent,
  GPSButton: GPSButtonMock,
  OrderTypeSelector: OrderTypeSelectorMock,
  BusinessesListing: BusinessesListingMock,
  AllowCurrentLocation: AllowCurrentLocationMock,
  AddressDetails: AddressDetailsStub,
  OrderConfig: OrderConfigStub,
  useHomeValues,
  useNearestBusiness,
  useBusinessSelected
}

const placeholderMock = {
  Fade: ({ children }) => children,
  Placeholder: ({ children }) => (
    React.createElement(View, { testID: 'placeholder' }, children)
  ),
  PlaceholderLine: () => React.createElement(View, { testID: 'placeholder-line' })
}

const paperMock = {
  TouchableRipple: ({ children, onPress }) => (
    React.createElement(
      TouchableOpacity,
      { onPress, testID: 'touchable-ripple' },
      children
    )
  ),
  ActivityIndicator: () => React.createElement(View, { testID: 'paper-spinner' })
}

const DatePickerMock = ({ open, title, confirmText, cancelText, date, onConfirm, onCancel }) => (
  React.createElement(
    View,
    { testID: 'native-date-picker' },
    React.createElement(Text, null, title),
    React.createElement(Text, { testID: 'date-value' }, date ? String(date) : 'no-date'),
    open
      ? React.createElement(
        TouchableOpacity,
        {
          testID: 'confirm-date',
          onPress: () => onConfirm?.(new Date('1992-05-20T12:00:00.000Z'))
        },
        React.createElement(Text, null, confirmText)
      )
      : null,
    React.createElement(
      TouchableOpacity,
      { testID: 'cancel-date', onPress: onCancel },
      React.createElement(Text, null, cancelText)
    )
  )
)

const phoneInputApi = {
  valid: true,
  callingCode: '1',
  number: '5550100',
  state: { code: '1', number: '', countryCode: 'US' }
}

const resetPhoneInputApi = () => {
  phoneInputApi.valid = true
  phoneInputApi.callingCode = '1'
  phoneInputApi.number = '5550100'
  phoneInputApi.state = { code: '1', number: '', countryCode: 'US' }
}

const PhoneInputMock = React.forwardRef((props, ref) => {
  React.useImperativeHandle(ref, () => ({
    isValidNumber: () => phoneInputApi.valid,
    getCallingCode: () => phoneInputApi.callingCode,
    getNumberAfterPossiblyEliminatingZero: () => ({ number: phoneInputApi.number }),
    setState: (next) => {
      phoneInputApi.state = { ...phoneInputApi.state, ...next }
    },
    get state () {
      return phoneInputApi.state
    }
  }))
  const flag = props.countryPickerProps?.renderFlagButton?.({
    countryCode: props.defaultCode || 'US'
  })
  return React.createElement(
    View,
    { testID: 'native-phone-input' },
    flag,
    React.createElement(TextInput, {
      testID: 'phone-formatted-input',
      placeholder: props.placeholder,
      value: props.defaultValue,
      editable: !props.disabled,
      onChangeText: props.onChangeFormattedText
    }),
    React.createElement(
      TouchableOpacity,
      {
        testID: 'change-phone-country',
        onPress: () => props.onChangeCountry?.({
          cca2: 'PR',
          callingCode: ['1', '1787']
        })
      },
      React.createElement(Text, null, 'Change country')
    )
  )
})

const CountryFlagMock = ({ isoCode }) => (
  React.createElement(View, { testID: `country-flag-${isoCode || 'none'}` })
)

const addressFormUIProps = {
  navigation: mockNavigation,
  updateChanges: jest.fn(),
  address: null,
  formState: mockChangedAddressFormState,
  isEditing: false,
  handleChangeInput: jest.fn(),
  addressState: mockEmptyAddressState,
  addressesList: [],
  saveAddress: jest.fn(),
  isGuestUser: false,
  isRequiredField: () => false,
  showField: () => true,
  businessSlug: 'demo-store',
  onNavigationRedirect: jest.fn()
}

const advancedAddressFormUIProps = {
  navigation: mockNavigation,
  updateChanges: jest.fn(),
  address: null,
  formState: mockChangedAddressFormState,
  isEditing: false,
  handleChangeInput: jest.fn(),
  addressState: mockEmptyAddressState,
  addressesList: [],
  saveAddress: jest.fn(async () => {}),
  isGuestUser: false,
  isRequiredField: () => false,
  showField: () => true,
  afterSignup: false,
  getNearestBusiness: jest.fn(),
  businessNearestState: { loading: false, business: { slug: 'demo-store', name: 'Demo Store' } },
  enableGoBackOnContinue: false
}

const addressDetailsUIProps = {
  navigation: mockNavigation,
  addressToShow: '9 Pine St',
  isCartPending: false,
  googleMapsUrl: 'https://maps.example/static',
  apiKey: 'maps-key',
  isShowOnlyMap: false,
  mapHeight: 151,
  mapWidth: 320,
  showModalForEditMap: false,
  addressToDeliver: '9 Pine St',
  callback: jest.fn(),
  mapStyle: {}
}

const addressListUIProps = {
  navigation: mockNavigation,
  addressList: mockAddressListState,
  isNewUser: false,
  actionStatus: { loading: false },
  handleSetDefault: jest.fn(async () => ({})),
  handleDelete: jest.fn(),
  setAddressList: jest.fn(),
  disableContinue: false,
  loadAddresses: jest.fn(),
  goBack: jest.fn(),
  onNavigationRedirect: jest.fn(),
  handleAddressRegister: jest.fn()
}

const resetAppM9Mocks = () => {
  resetFormHarness()
  resetPhoneInputApi()
  mockHomeValuesState.alternativeHome = false
  mockHomeValuesState.userAddressStoraged = null
  mockHomeValuesFns.onChangeAlternativeHome.mockClear()
  mockResolveBusinessForLocation.mockClear()
  mockResolveBusinessForLocation.mockResolvedValue({
    error: false,
    changed: false,
    business: { slug: 'demo-store', name: 'Demo Store' }
  })
  mockConfirmBusinessChange.mockClear()
  mockConfirmBusinessChange.mockResolvedValue(true)
  mockOnChangeBusinessSelected.mockClear()
  mockEventBus.reset()
  mockSegmentClient.track.mockClear()
  mockSegmentClient.identify.mockClear()
  segmentMock.createClient.mockClear()
  facebookSdkMock.AppEventsLogger.logEvent.mockClear()
  facebookSdkMock.AppEventsLogger.logPurchase.mockClear()
  geocoderMock.init.mockClear()
  geocoderMock.from.mockClear()
  geocoderMock.from.mockResolvedValue(geocoderResult)
  mockNavigation.navigate.mockClear()
  mockNavigation.goBack.mockClear()
  addressFormUIProps.updateChanges.mockClear()
  addressFormUIProps.handleChangeInput.mockClear()
  addressFormUIProps.saveAddress.mockClear()
  addressFormUIProps.onNavigationRedirect.mockClear()
  advancedAddressFormUIProps.updateChanges.mockClear()
  advancedAddressFormUIProps.handleChangeInput.mockClear()
  advancedAddressFormUIProps.saveAddress.mockClear()
  advancedAddressFormUIProps.getNearestBusiness.mockClear()
  addressDetailsUIProps.callback.mockClear()
  addressListUIProps.handleSetDefault.mockClear()
  addressListUIProps.handleDelete.mockClear()
  addressListUIProps.setAddressList.mockClear()
  addressListUIProps.loadAddresses.mockClear()
  addressListUIProps.goBack.mockClear()
  addressListUIProps.onNavigationRedirect.mockClear()
}

module.exports = {
  ORDER_TYPES,
  mockParseDate,
  mockAddress,
  mockOfficeAddress,
  mockAddressListState,
  mockEmptyAddressList,
  mockLoadingAddressList,
  mockErrorAddressList,
  mockIdleAddressFormState,
  mockChangedAddressFormState,
  mockErrorAddressFormState,
  mockLoadingAddressFormState,
  mockAddressState,
  mockEmptyAddressState,
  mockDeliveryOptions,
  mockPickupOptions,
  mockMomentOptions,
  mockEmptyOrderOptions,
  mockAddressConfigs,
  mockNavigation,
  formHarness,
  resetFormHarness,
  hookFormMock,
  createEventBus,
  mockEventBus,
  mockSegmentClient,
  segmentMock,
  facebookSdkMock,
  geocoderMock,
  geocoderResult,
  googlePlacesTextInputMock,
  googlePlacesModule: { __esModule: true, default: GooglePlacesTextInput },
  datePickerModule: { __esModule: true, default: DatePickerMock },
  phoneInputModule: { __esModule: true, default: PhoneInputMock },
  countryFlagModule: { __esModule: true, default: CountryFlagMock },
  appM9UiMock,
  placeholderMock,
  paperMock,
  DatePickerMock,
  phoneInputApi,
  resetPhoneInputApi,
  PhoneInputMock,
  CountryFlagMock,
  addressFormUIProps,
  advancedAddressFormUIProps,
  addressDetailsUIProps,
  addressListUIProps,
  mockHomeValuesState,
  mockHomeValuesFns,
  mockResolveBusinessForLocation,
  mockConfirmBusinessChange,
  mockOnChangeBusinessSelected,
  resetAppM9Mocks
}

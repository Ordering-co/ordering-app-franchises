const React = require('react')
const { Text, TouchableOpacity, View } = require('react-native')
const franchiseAppUiMock = require('./franchiseAppUiMock')

const mockUser = {
  id: 7,
  name: 'Pat',
  middle_name: 'A',
  lastname: 'Lee',
  second_lastname: 'Ng',
  email: 'pat@test.com',
  cellphone: '5550100',
  country_phone_code: '1',
  country_code: 'US',
  guest_id: null,
  guest_email: null,
  guest_cellphone: null,
  birthdate: '1990-01-15',
  photo: null,
  password: '',
  level: 2,
  settings: {
    notification: { newsletter: true },
    sms: { newsletter: false },
    email: { newsletter: false }
  }
}

const mockGuestUser = {
  ...mockUser,
  id: 8,
  guest_id: 99,
  guest_email: 'guest@test.com',
  guest_cellphone: '5550199',
  email: null,
  cellphone: null,
  country_phone_code: null,
  settings: {
    notification: { newsletter: false },
    sms: { newsletter: false },
    email: { newsletter: false }
  }
}

const mockPuertoRicoUser = {
  ...mockUser,
  country_code: 'PR',
  cellphone: '17875550100'
}

const mockAdminUser = {
  ...mockUser,
  level: 0
}

const mockUserWithPhoto = {
  ...mockUser,
  photo: 'https://example.com/pat.jpg'
}

const mockIdleFormState = {
  loading: false,
  changes: {},
  result: { error: false, result: null }
}

const mockChangedFormState = {
  loading: false,
  changes: {
    name: 'Pat',
    email: 'pat@test.com',
    cellphone: '5550101',
    country_phone_code: '1'
  },
  result: { error: false, result: null }
}

const mockErrorFormState = {
  loading: false,
  changes: {},
  result: { error: true, result: ['Update failed'] }
}

const mockLoadingFormState = {
  loading: true,
  changes: { name: 'Pat' },
  result: { error: false, result: null }
}

const mockValidationFields = {
  loading: false,
  fields: {
    checkout: {
      name: { id: 1, code: 'name', name: 'Name', enabled: true, required: true },
      lastname: { id: 2, code: 'lastname', name: 'Last name', enabled: true, required: true },
      email: { id: 3, code: 'email', name: 'Email', enabled: true, required: true },
      cellphone: { id: 4, code: 'cellphone', name: 'Mobile phone', enabled: true, required: false },
      birthdate: { id: 5, code: 'birthdate', name: 'Birthdate', enabled: true, required: false }
    }
  }
}

const mockRequiredCellphoneFields = {
  loading: false,
  fields: {
    checkout: {
      ...mockValidationFields.fields.checkout,
      cellphone: { id: 4, code: 'cellphone', name: 'Mobile phone', enabled: true, required: true }
    }
  }
}

const mockLoadingValidationFields = {
  loading: true,
  fields: { checkout: {} }
}

const mockCheckoutFields = [
  { enabled: true, validation_field: { code: 'name', name: 'Name' } },
  { enabled: true, validation_field: { code: 'email', name: 'Email' } },
  { enabled: true, validation_field: { code: 'mobile_phone', name: 'Mobile phone' } },
  { enabled: true, validation_field: { code: 'birthdate', name: 'Birthdate' } }
]

const mockUserConfigs = {
  verification_phone_required: { value: '0' }
}

const mockPhoneRequiredConfigs = {
  verification_phone_required: { value: '1' }
}

const mockWallet = {
  id: 11,
  type: 'cash'
}

const mockCreditWallet = {
  id: 22,
  type: 'credit_point'
}

const mockTransaction = {
  id: 301,
  event: 'manual',
  event_type: 'deposit',
  amount: 15,
  created_at: '2026-09-07 16:00:00',
  description: 'Promo credit'
}

const mockDebitTransaction = {
  id: 302,
  event: 'manual',
  event_type: 'withdraw',
  amount: -8,
  created_at: '2026-09-07 17:00:00',
  description: null
}

const orderWalletEvent = Object.assign(new String('manual'), {
  order_id: 101,
  author: { name: 'Pat' }
})

const mockOrderTransaction = {
  id: 303,
  event: orderWalletEvent,
  event_type: 'deposit',
  amount: 20,
  created_at: '2026-09-07 18:00:00',
  description: 'Order credit'
}

const mockWalletUtils = {
  parsePrice: (value) => `$${value ?? 0}`,
  parseDate: (value) => String(value || '')
}

const mockIdleVerifyPhoneState = {
  loading: false,
  result: { error: false, result: null }
}

const mockErrorVerifyPhoneState = {
  loading: false,
  result: { error: true, result: 'Invalid code' }
}

const mockErrorArrayVerifyPhoneState = {
  loading: false,
  result: { error: true, result: ['Code expired'] }
}

const mockOkVerifyPhoneState = {
  loading: false,
  result: { error: false, result: 'OK' }
}

const mockLoadingVerifyPhoneState = {
  loading: true,
  result: { error: false, result: null }
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

const userFormDetailsUIProps = {
  isEdit: true,
  formState: mockChangedFormState,
  showField: () => true,
  requiredFields: null,
  setIsSubmit: jest.fn(),
  cleanFormState: jest.fn(),
  onCloseProfile: jest.fn(),
  isRequiredField: () => false,
  validationFields: mockValidationFields,
  handleChangeInput: jest.fn(),
  handleButtonUpdateClick: jest.fn(),
  phoneUpdate: false,
  hideUpdateButton: false,
  setWillVerifyOtpState: jest.fn(),
  handlePlaceOrderAsGuest: jest.fn(),
  isCheckout: false,
  setIsOpen: jest.fn(),
  handleRemoveAccount: jest.fn(),
  isProfile: false,
  isGuest: false,
  isOrderTypeValidationField: false,
  checkoutFields: mockCheckoutFields,
  isCheckoutPlace: false,
  userState: { result: mockUser }
}

const userDetailsUIProps = {
  isEdit: false,
  formState: mockIdleFormState,
  cleanFormState: jest.fn(),
  requiredFields: null,
  onClose: jest.fn(),
  cartStatus: 0,
  toggleIsEdit: jest.fn(),
  validationFields: mockValidationFields,
  isUserDetailsEdit: false,
  phoneUpdate: false,
  togglePhoneUpdate: jest.fn(),
  isCheckout: false,
  handleSendVerifyCode: jest.fn(),
  verifyPhoneState: mockIdleVerifyPhoneState,
  setFormState: jest.fn(),
  setIsOpen: jest.fn(),
  isCheckoutPlace: false,
  HeaderTitle: null,
  userData: null
}

const userProfileUIProps = {
  appVersion: '1.2.3',
  notificationsGroup: { loading: false, result: { error: false, result: null } },
  handleRemoveAccount: jest.fn(),
  removeAccountState: { result: null },
  handleChangePromotions: jest.fn(),
  goToBack: jest.fn(),
  onNavigationRedirect: jest.fn()
}

const userProfileFormUIProps = {
  navigation: { goBack: jest.fn() },
  formState: mockIdleFormState,
  validationFields: mockValidationFields,
  isRequiredField: () => false,
  toggleIsEdit: jest.fn(),
  cleanFormState: jest.fn(),
  handleChangeInput: jest.fn(),
  handleButtonUpdateClick: jest.fn(),
  handleSendVerifyCode: jest.fn(),
  verifyPhoneState: mockIdleVerifyPhoneState,
  setFormState: jest.fn()
}

const DatePickerUIMock = ({ open, onConfirm, onCancel }) => (
  React.createElement(
    View,
    { testID: 'date-picker' },
    open
      ? React.createElement(
        TouchableOpacity,
        {
          testID: 'confirm-date',
          onPress: () => onConfirm(new Date(1992, 4, 20))
        },
        React.createElement(Text, null, 'Confirm date')
      )
      : null,
    React.createElement(
      TouchableOpacity,
      { testID: 'cancel-date', onPress: onCancel },
      React.createElement(Text, null, 'Cancel date')
    )
  )
)

const PhoneInputNumberMock = ({ handleData, changeCountry }) => (
  React.createElement(
    View,
    { testID: 'phone-input' },
    React.createElement(
      TouchableOpacity,
      {
        testID: 'set-phone',
        onPress: () => handleData?.({
          error: '',
          phone: { country_phone_code: '1', cellphone: '5550199' }
        })
      },
      React.createElement(Text, null, 'Set phone')
    ),
    React.createElement(
      TouchableOpacity,
      {
        testID: 'set-phone-error',
        onPress: () => handleData?.({
          error: 'Invalid phone',
          phone: { country_phone_code: null, cellphone: null }
        })
      },
      React.createElement(Text, null, 'Bad phone')
    ),
    React.createElement(
      TouchableOpacity,
      {
        testID: 'change-country',
        onPress: () => changeCountry?.({ cca2: 'US' })
      },
      React.createElement(Text, null, 'Change country')
    )
  )
)

const SignupFormMock = ({ handleSuccessSignup }) => (
  React.createElement(
    TouchableOpacity,
    {
      testID: 'signup-form',
      onPress: () => handleSuccessSignup?.({
        id: 8,
        session: { access_token: 'tok' }
      })
    },
    React.createElement(Text, null, 'Signup')
  )
)

const VerifyPhoneMock = ({ handleCheckPhoneCode, handleVerifyCodeClick, onClose }) => (
  React.createElement(
    View,
    { testID: 'verify-phone' },
    React.createElement(
      TouchableOpacity,
      {
        testID: 'send-phone-code',
        onPress: () => handleCheckPhoneCode?.({ code: '123456' })
      },
      React.createElement(Text, null, 'Send code')
    ),
    React.createElement(
      TouchableOpacity,
      { testID: 'resend-code', onPress: handleVerifyCodeClick },
      React.createElement(Text, null, 'Resend')
    ),
    React.createElement(
      TouchableOpacity,
      { testID: 'close-verify', onPress: onClose },
      React.createElement(Text, null, 'Close verify')
    )
  )
)

const UserFormDetailsTriggerMock = ({ setWillVerifyOtpState, setIsSubmit }) => (
  React.createElement(
    View,
    { testID: 'user-form-details' },
    React.createElement(
      TouchableOpacity,
      {
        testID: 'start-otp',
        onPress: () => setWillVerifyOtpState?.(true)
      },
      React.createElement(Text, null, 'Start otp')
    ),
    React.createElement(
      TouchableOpacity,
      {
        testID: 'submit-user-form',
        onPress: () => setIsSubmit?.(true)
      },
      React.createElement(Text, null, 'Submit user form')
    )
  )
)

const AlertWithActionsMock = ({ open, title, onAccept, onCancel, onClose }) => (
  open
    ? React.createElement(
      View,
      { testID: 'alert' },
      React.createElement(Text, null, title),
      React.createElement(TouchableOpacity, { testID: 'alert-accept', onPress: onAccept }),
      React.createElement(TouchableOpacity, { testID: 'alert-cancel', onPress: onCancel }),
      React.createElement(TouchableOpacity, { testID: 'alert-close', onPress: onClose })
    )
    : null
)

const userFormDetailsUiMock = {
  ...franchiseAppUiMock,
  DatePickerUI: DatePickerUIMock,
  PhoneInputNumber: PhoneInputNumberMock,
  SignupForm: SignupFormMock,
  OAlertOriginal: AlertWithActionsMock
}

const userDetailsUiMock = {
  ...franchiseAppUiMock,
  UserFormDetailsUI: UserFormDetailsTriggerMock,
  VerifyPhone: VerifyPhoneMock
}

const userProfileUiMock = {
  ...franchiseAppUiMock,
  LanguageSelector: () => React.createElement(View, { testID: 'language-selector' }),
  WebsocketStatus: () => React.createElement(View, { testID: 'websocket-status' })
}

const userProfileFormUiMock = {
  ...franchiseAppUiMock,
  UserFormDetailsUI: UserFormDetailsTriggerMock,
  VerifyPhone: VerifyPhoneMock
}

const walletTransactionsUiMock = {
  ...franchiseAppUiMock,
  WalletTransactionItem: ({ item, idx, type }) => (
    React.createElement(
      Text,
      { testID: `wallet-tx-${item.id}` },
      `${type}-${idx}-${item.description || item.id}`
    )
  )
}

const placeholderMock = {
  Fade: ({ children }) => children,
  Placeholder: ({ children }) => (
    React.createElement(View, { testID: 'placeholder' }, children)
  ),
  PlaceholderLine: () => React.createElement(View, { testID: 'placeholder-line' })
}

const toggleSwitchMock = ({ onToggle, isOn }) => (
  React.createElement(
    TouchableOpacity,
    {
      testID: 'toggle-switch',
      onPress: () => onToggle?.(!isOn)
    },
    React.createElement(Text, null, isOn ? 'On' : 'Off')
  )
)

module.exports = {
  mockUser,
  mockGuestUser,
  mockPuertoRicoUser,
  mockAdminUser,
  mockUserWithPhoto,
  mockIdleFormState,
  mockChangedFormState,
  mockErrorFormState,
  mockLoadingFormState,
  mockValidationFields,
  mockRequiredCellphoneFields,
  mockLoadingValidationFields,
  mockCheckoutFields,
  mockUserConfigs,
  mockPhoneRequiredConfigs,
  mockWallet,
  mockCreditWallet,
  mockTransaction,
  mockDebitTransaction,
  mockOrderTransaction,
  mockWalletUtils,
  mockIdleVerifyPhoneState,
  mockErrorVerifyPhoneState,
  mockErrorArrayVerifyPhoneState,
  mockOkVerifyPhoneState,
  mockLoadingVerifyPhoneState,
  formHarness,
  resetFormHarness,
  userFormDetailsUIProps,
  userDetailsUIProps,
  userProfileUIProps,
  userProfileFormUIProps,
  userFormDetailsUiMock,
  userDetailsUiMock,
  userProfileUiMock,
  userProfileFormUiMock,
  walletTransactionsUiMock,
  placeholderMock,
  toggleSwitchMock
}

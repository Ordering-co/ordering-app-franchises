const baseLoginUIProps = {
  useLoginByEmail: true,
  useLoginByCellphone: false,
  handleChangeInput: jest.fn(),
  handleReCaptcha: jest.fn(),
  handleChangeTab: jest.fn(),
  handleButtonLoginClick: jest.fn(),
  handleSendVerifyCode: jest.fn(),
  handleCheckPhoneCode: jest.fn(),
  formState: { loading: false, result: null },
  verifyPhoneState: { loading: false },
  checkPhoneCodeState: { loading: false },
  loginTab: 'email',
  credentials: {},
  enableReCaptcha: false,
  useRootPoint: false,
  isCustomerMode: false,
  otpType: 'email',
  setOtpType: jest.fn(),
  generateOtpCode: jest.fn(),
  otpState: '',
  setOtpState: jest.fn(),
  useLoginOtpEmail: false,
  useLoginOtpCellphone: false,
  handleLoginSpoonity: jest.fn(),
  useLoginSpoonity: false,
  setAccountState: jest.fn(),
  isGuest: false
}

const baseForgotPasswordUIProps = {
  hanldeChangeInput: jest.fn(),
  handleButtonForgotPasswordClick: jest.fn(),
  formState: { loading: false, result: { result: null, error: null } },
  handleReCaptcha: jest.fn(),
  enableReCaptcha: false,
  isRecaptchaEnable: false,
  setAccountState: jest.fn()
}

const baseSignupUIProps = {
  handleChangeInput: jest.fn(),
  handleButtonSignupClick: jest.fn(),
  handleReCaptcha: jest.fn(),
  handleChangePromotions: jest.fn(),
  closeModal: jest.fn(),
  useChekoutFileds: false,
  validationFields: {
    fields: {
      checkout: {
        email: { id: 1, code: 'email', enabled: true, required: true, type: 'email' },
        password: { id: 3, code: 'password', enabled: true, required: true, type: 'password' }
      }
    }
  },
  showField: () => true,
  isRequiredField: () => false,
  formState: { loading: false, result: { result: null, error: null } },
  handleSuccessSignup: jest.fn(),
  enableReCaptcha: false,
  signupData: {},
  fieldsNotValid: [],
  saveCustomerUser: false,
  signUpTab: 'default',
  setSignUpTab: jest.fn(),
  useSignUpFullDetails: true,
  setAccountState: jest.fn()
}

const baseSessionsUIProps = {
  sessionsList: { loading: false, sessions: [{ id: 1, user: { agent: 'Chrome' }, created_at: '2026-01-01' }] },
  actionState: { loading: false, error: null },
  handleDeleteSession: jest.fn(),
  handleDeleteAllSessions: jest.fn()
}

const baseUserVerificationUIProps = {
  verifyEmailState: { loading: false, loadingSendCode: false, loadingCheckCode: false },
  verifyPhoneState: { loading: false, loadingSendCode: false, loadingCheckCode: false },
  sendVerifyEmailCode: jest.fn(),
  sendVerifyPhoneCode: jest.fn(),
  checkVerifyEmailCode: jest.fn(),
  checkVerifyPhoneCode: jest.fn(),
  cleanErrorsState: jest.fn()
}

const baseLanguageSelectorUIProps = {
  languagesState: {
    languages: [
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Spanish' }
    ]
  },
  currentLanguage: 'en',
  handleChangeLanguage: jest.fn()
}

const baseProjectFormUIProps = {
  onNavigationRedirect: jest.fn(),
  onSubmit: jest.fn(),
  projectState: { data: null, loading: false },
  setProjectState: jest.fn(),
  navigation: { canGoBack: jest.fn(() => false), goBack: jest.fn() }
}

const baseVerifyPhoneProps = {
  phone: '+1234567890',
  formValues: { cellphone: '1234567890' },
  verifyPhoneState: { loading: false },
  checkPhoneCodeState: { loading: false },
  setCheckPhoneCodeState: jest.fn(),
  handleCheckPhoneCode: jest.fn(),
  handleVerifyCodeClick: jest.fn()
}

const baseOtpProps = {
  pinCount: 6,
  otpError: null,
  setOtpError: jest.fn(),
  setAlertState: jest.fn(),
  willVerifyOtpState: true,
  isCheckingCode: false,
  setCheckingCode: jest.fn(),
  setWillVerifyOtpState: jest.fn(),
  handleLoginOtp: jest.fn(),
  onSubmit: jest.fn()
}

module.exports = {
  baseLoginUIProps,
  baseForgotPasswordUIProps,
  baseSignupUIProps,
  baseSessionsUIProps,
  baseUserVerificationUIProps,
  baseLanguageSelectorUIProps,
  baseProjectFormUIProps,
  baseVerifyPhoneProps,
  baseOtpProps
}

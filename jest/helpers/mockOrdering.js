/**
 * Stable @components hook mocks for page/UI tests.
 * Registered by default in jest/setupAfterEnv.js.
 */
const t = (_key, fallback) => fallback ?? _key

const languageState = { loading: false, dictionary: {} }
const configState = { loading: false, configs: {} }
const sessionState = { auth: false, user: null, token: null }
const orderState = { loading: false, carts: [], options: {} }
const toastFns = { showToast: jest.fn(), hideToast: jest.fn() }
const eventFns = { emit: jest.fn() }
const sessionFns = { login: jest.fn() }
const orderFns = { handleOrderStateLoading: jest.fn() }

const mockOrdering = {
  ToastType: { Info: 'info', Success: 'success', Warning: 'warning', Error: 'error' },
  CODES: [{ phoneCode: '1', countryCode: 'US' }, { phoneCode: '34', countryCode: 'ES' }],
  OrderingProvider: ({ children }) => children,
  useLanguage: jest.fn(() => [languageState, t]),
  useConfig: jest.fn(() => [configState]),
  useSession: jest.fn(() => [sessionState, sessionFns]),
  useOrder: jest.fn(() => [orderState, orderFns]),
  useApi: jest.fn(() => [{}, {}]),
  useEvent: jest.fn(() => [eventFns]),
  useToast: jest.fn(() => [null, toastFns]),
  useUtils: jest.fn(() => [{}, {}]),
  useWebsocket: jest.fn(() => [{ socket: null }]),
  useBusiness: jest.fn(() => [{}, {}]),
  useCustomer: jest.fn(() => [{}, {}]),
  useValidationFields: jest.fn(() => [{}, {}]),
  useSite: jest.fn(() => [{}]),
  useFreeDeliveryProgress: jest.fn(() => ({ status: 'hidden' }))
}

module.exports = mockOrdering

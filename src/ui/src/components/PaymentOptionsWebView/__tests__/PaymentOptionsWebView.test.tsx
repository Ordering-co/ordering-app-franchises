import { fireEvent } from '@testing-library/react-native'
import { PaymentOptionsWebView } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import { mockCheckoutCart } from '../../../../../../jest/helpers/appM5TestUtils'

const setShowGateway = jest.fn()
const mockConfirmCart = jest.fn(async () => ({ result: { order: { uuid: 'order-1' } } }))
const mockRefreshOrderOptions = jest.fn()
const mockChangePaymethod = jest.fn()

jest.mock('react-native-paper', () => ({
  ActivityIndicator: () => null
}))
jest.mock('react-native-webview', () => require('../../../../../../jest/helpers/appM5TestUtils').webViewMock())
jest.mock('react-native-vector-icons/Feather', () => {
  const React = require('react')
  const { TouchableOpacity, Text } = require('react-native')
  return ({ onPress, name }) => React.createElement(
    TouchableOpacity,
    { testID: `icon-${name}`, onPress },
    React.createElement(Text, null, name)
  )
})
jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  useApi: jest.fn(() => [require('../../../../../../jest/helpers/appM5TestUtils').mockOrderingApi, {}]),
  useConfig: jest.fn(() => [{
    configs: require('../../../../../../jest/helpers/appM5TestUtils').mockWalletConfigs
  }]),
  useWebsocket: jest.fn(() => require('../../../../../../jest/helpers/appM5TestUtils').mockSocket),
  useOrder: jest.fn(() => [
    {},
    { confirmCart: mockConfirmCart, refreshOrderOptions: mockRefreshOrderOptions, changePaymethod: mockChangePaymethod }
  ])
}))

describe('PaymentOptionsWebView UI', () => {
  beforeEach(() => {
    setShowGateway.mockClear()
    mockConfirmCart.mockClear()
    mockRefreshOrderOptions.mockClear()
  })

  it('renders the paypal gateway and closes on request', () => {
    const { getByText, getByTestId } = renderWithProviders(
      <PaymentOptionsWebView
        uri='https://example.com/paypal'
        user={{ id: 1, name: 'Pat' }}
        token='tok_test'
        cart={mockCheckoutCart}
        webviewPaymethod={{ id: 9, gateway: 'paypal', credentials: { client_id: 'cid' } }}
        setShowGateway={setShowGateway}
        onNavigationRedirect={jest.fn()}
      />
    )
    expect(getByText('PayPal GateWay')).toBeTruthy()
    expect(getByTestId('webview')).toBeTruthy()
    fireEvent.press(getByTestId('icon-x'))
    expect(setShowGateway).toHaveBeenCalledWith({ open: false, closedByUser: true })
  })

  it('renders a custom title', () => {
    const { getByText } = renderWithProviders(
      <PaymentOptionsWebView
        title='Cybersource'
        uri='https://example.com/cybersource'
        cart={mockCheckoutCart}
        webviewPaymethod={{ id: 10, gateway: 'cybersource', credentials: {} }}
        setShowGateway={setShowGateway}
      />
    )
    expect(getByText('Cybersource')).toBeTruthy()
  })
})

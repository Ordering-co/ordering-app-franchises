import { Text } from 'react-native'
import { fireEvent } from '@testing-library/react-native'
import { AddressDetails } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import {
  addressDetailsUIProps,
  mockDeliveryOptions,
  resetAppM9Mocks
} from '../../../../../../jest/helpers/appM9TestUtils'

jest.mock('react-native-fast-image', () => require('../../../../../../jest/helpers/fastImageMock'))
jest.mock('@ui', () => require('../../../../../../jest/helpers/appM9TestUtils').appM9UiMock)
jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  AddressDetails: ({ UIComponent, ...rest }) => {
    const React = require('react')
    const { addressDetailsUIProps } = require('../../../../../../jest/helpers/appM9TestUtils')
    return React.createElement(UIComponent, { ...addressDetailsUIProps, ...rest })
  },
  useOrder: jest.fn(() => [{
    loading: false,
    options: require('../../../../../../jest/helpers/appM9TestUtils').mockDeliveryOptions
  }])
}))

const renderDetails = (props = {}) => renderWithProviders(
  <AddressDetails {...props} />
)

describe('AddressDetails UI', () => {
  afterEach(() => {
    resetAppM9Mocks()
    const { useOrder } = require('@components')
    useOrder.mockReturnValue([{
      loading: false,
      options: mockDeliveryOptions
    }])
  })

  it('renders the delivery address header and notes', () => {
    const { getByText } = renderDetails()
    expect(getByText('Delivery address')).toBeTruthy()
    expect(getByText('9 Pine St')).toBeTruthy()
    expect(getByText('Leave at door')).toBeTruthy()
    expect(getByText('Change')).toBeTruthy()
  })

  it('uses a custom header title when provided', () => {
    const { getByText, queryByText } = renderDetails({
      HeaderTitle: <Text>Custom header</Text>
    })
    expect(getByText('Custom header')).toBeTruthy()
    expect(queryByText('Delivery address')).toBeNull()
  })

  it('navigates to the address list from change', () => {
    const { getByText } = renderDetails()
    fireEvent.press(getByText('Change'))
    expect(addressDetailsUIProps.navigation.navigate).toHaveBeenCalledWith(
      'AddressList',
      { isFromCheckout: true }
    )
  })

  it('hides change when the cart is pending', () => {
    const { queryByText } = renderDetails({ isCartPending: true })
    expect(queryByText('Change')).toBeNull()
  })

  it('hides change for pickup orders', () => {
    const { useOrder } = require('@components')
    useOrder.mockReturnValue([{
      loading: false,
      options: {
        ...mockDeliveryOptions,
        type: 2
      }
    }])
    const { getByText, queryByText } = renderDetails()
    expect(queryByText('Change')).toBeNull()
  })

  it('falls back to the cart address when addressToShow is empty', () => {
    const { getByText } = renderDetails({ addressToShow: '' })
    expect(getByText(mockDeliveryOptions.address.address)).toBeTruthy()
  })

  it('hides header and address copy in map-only mode', () => {
    const { queryByText, toJSON } = renderDetails({
      isShowOnlyMap: true,
      googleMapsUrl: 'https://maps.example/static'
    })
    expect(queryByText('Delivery address')).toBeNull()
    expect(queryByText('Leave at door')).toBeNull()
    expect(toJSON()).toBeTruthy()
  })

  it('lets the user adjust the marker from the edit map modal', () => {
    const callback = jest.fn()
    const { getByText } = renderDetails({
      showModalForEditMap: true,
      addressToDeliver: 'Corner of Pine',
      callback
    })
    expect(getByText('DELIVER IN')).toBeTruthy()
    expect(getByText('Corner of Pine')).toBeTruthy()
    fireEvent.press(getByText('ADJUST THE MARKER'))
    expect(callback).toHaveBeenCalled()
  })
})

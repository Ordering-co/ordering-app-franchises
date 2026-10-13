import { fireEvent } from '@testing-library/react-native'
import { AddressComponent } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import {
  mockAddress,
  mockAddressConfigs,
  mockDeliveryOptions,
  mockMomentOptions,
  mockParseDate
} from '../../../../../../jest/helpers/appM9TestUtils'

jest.mock('@ui', () => require('../../../../../../jest/helpers/appM9TestUtils').appM9UiMock)
jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  useUtils: jest.fn(() => [{
    parseDate: require('../../../../../../jest/helpers/appM9TestUtils').mockParseDate
  }]),
  useConfig: jest.fn(() => [{
    loading: false,
    configs: require('../../../../../../jest/helpers/appM9TestUtils').mockAddressConfigs
  }]),
  useOrder: jest.fn(() => [{
    loading: false,
    options: require('../../../../../../jest/helpers/appM9TestUtils').mockDeliveryOptions
  }])
}))

const renderAddress = (props = {}) => renderWithProviders(
  <AddressComponent onRedirect={jest.fn()} {...props} />
)

describe('AddressComponent UI', () => {
  afterEach(() => {
    const { useOrder, useConfig } = require('@components')
    useOrder.mockReturnValue([{
      loading: false,
      options: mockDeliveryOptions
    }])
    useConfig.mockReturnValue([{
      loading: false,
      configs: mockAddressConfigs
    }])
  })

  it('renders the delivery type and address', () => {
    const { getByText } = renderAddress()
    expect(getByText('DELIVERY')).toBeTruthy()
    expect(getByText(mockAddress.address)).toBeTruthy()
  })

  it('opens the address list from the pencil action', () => {
    const onRedirect = jest.fn()
    const { getByTestId } = renderAddress({
      onRedirect,
      business: { slug: 'demo-store' }
    })
    fireEvent.press(getByTestId('o-icon').parent)
    expect(onRedirect).toHaveBeenCalledWith('AddressList', {
      business: { slug: 'demo-store' }
    })
  })

  it('renders an ASAP moment when no scheduled time exists', () => {
    const { getByText, queryByText } = renderAddress({ type: 'moment' })
    expect(getByText(/ASAP Today at/)).toBeTruthy()
    expect(queryByText(mockAddress.address)).toBeNull()
  })

  it('parses a scheduled moment and offers change when preorder is on', () => {
    const { useOrder } = require('@components')
    useOrder.mockReturnValue([{
      loading: false,
      options: mockMomentOptions
    }])
    const onRedirect = jest.fn()
    const { getByText } = renderAddress({ type: 'moment', onRedirect })
    expect(getByText(mockParseDate(mockMomentOptions.moment, {
      outputFormat: mockAddressConfigs.dates_moment_format.value
    }))).toBeTruthy()
    fireEvent.press(getByText('change'))
    expect(onRedirect).toHaveBeenCalledWith('MomentOption', { business: undefined })
  })

  it('hides the moment change action when preorder is disabled', () => {
    const { useConfig } = require('@components')
    useConfig.mockReturnValue([{
      loading: false,
      configs: {
        ...mockAddressConfigs,
        preorder_status_enabled: { value: '0' }
      }
    }])
    const { queryByText } = renderAddress({ type: 'moment' })
    expect(queryByText('change')).toBeNull()
  })

  it('renders pickup copy when the order type is pickup', () => {
    const { useOrder } = require('@components')
    useOrder.mockReturnValue([{
      loading: false,
      options: {
        ...mockDeliveryOptions,
        type: 2
      }
    }])
    const { getByText } = renderAddress()
    expect(getByText('PICKUP')).toBeTruthy()
  })
})

import { fireEvent, waitFor } from '@testing-library/react-native'
import { AddressList } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import {
  mockAddress,
  mockAddressListState,
  mockDeliveryOptions,
  mockEmptyAddressList,
  mockErrorAddressList,
  mockHomeValuesState,
  mockLoadingAddressList,
  mockOfficeAddress,
  mockOnChangeBusinessSelected,
  mockPickupOptions,
  mockResolveBusinessForLocation,
  mockConfirmBusinessChange,
  resetAppM9Mocks
} from '../../../../../../jest/helpers/appM9TestUtils'

jest.mock('@ui', () => require('../../../../../../jest/helpers/appM9TestUtils').appM9UiMock)
jest.mock('rn-placeholder', () => require('../../../../../../jest/helpers/appM9TestUtils').placeholderMock)
jest.mock('react-native-paper', () => require('../../../../../../jest/helpers/appM9TestUtils').paperMock)
jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  AddressList: ({ UIComponent, ...rest }) => {
    const React = require('react')
    const { addressListUIProps } = require('../../../../../../jest/helpers/appM9TestUtils')
    return React.createElement(UIComponent, { ...addressListUIProps, ...rest })
  },
  useOrder: jest.fn(() => [{
    loading: false,
    options: require('../../../../../../jest/helpers/appM9TestUtils').mockDeliveryOptions
  }])
}))

const renderList = (props = {}) => renderWithProviders(
  <AddressList {...props} />
)

describe('AddressList UI', () => {
  afterEach(() => {
    resetAppM9Mocks()
    const { useOrder } = require('@components')
    useOrder.mockReturnValue([{
      loading: false,
      options: mockDeliveryOptions
    }])
  })

  it('renders saved addresses and continues to the business tab', async () => {
    const onNavigationRedirect = jest.fn()
    const { getByText } = renderList({ onNavigationRedirect })
    expect(getByText('My saved address')).toBeTruthy()
    expect(getByText(mockAddress.address)).toBeTruthy()
    expect(getByText(mockOfficeAddress.address)).toBeTruthy()
    fireEvent.press(getByText('Continue'))
    await waitFor(() => {
      expect(mockResolveBusinessForLocation).toHaveBeenCalled()
      expect(onNavigationRedirect).toHaveBeenCalledWith('BottomTab', {
        screen: 'Business',
        store: 'demo-store'
      })
    })
  })

  it('sets a different address as default', async () => {
    const handleSetDefault = jest.fn(async () => ({}))
    const { getByText } = renderList({ handleSetDefault })
    fireEvent.press(getByText(mockOfficeAddress.address))
    await waitFor(() => {
      expect(handleSetDefault).toHaveBeenCalledWith(expect.objectContaining({
        id: mockOfficeAddress.id
      }))
    })
  })

  it('does not set default again for the current cart address', () => {
    const handleSetDefault = jest.fn(async () => ({}))
    const { getByText } = renderList({ handleSetDefault })
    fireEvent.press(getByText(mockAddress.address))
    expect(handleSetDefault).not.toHaveBeenCalled()
  })

  it('opens the address form to add and edit', () => {
    const onNavigationRedirect = jest.fn()
    const { getByText, getAllByTestId } = renderList({ onNavigationRedirect })
    fireEvent.press(getByText('Add new Address'))
    expect(onNavigationRedirect).toHaveBeenCalledWith(
      'AddressForm',
      expect.objectContaining({ isSelectedAfterAdd: true })
    )
    fireEvent.press(getAllByTestId('touchable-ripple')[0])
    expect(onNavigationRedirect).toHaveBeenCalledWith(
      'AddressForm',
      expect.objectContaining({
        isEditing: true,
        address: expect.objectContaining({ id: mockAddress.id })
      })
    )
  })

  it('deletes an address that is not selected', () => {
    const handleDelete = jest.fn()
    const { getAllByTestId } = renderList({ handleDelete })
    fireEvent.press(getAllByTestId('o-alert')[0])
    expect(handleDelete).toHaveBeenCalledWith(expect.objectContaining({
      id: mockOfficeAddress.id
    }))
  })

  it('shows placeholders while the empty list loads', () => {
    const { getAllByTestId, queryByText } = renderList({
      addressList: mockLoadingAddressList
    })
    expect(getAllByTestId('placeholder').length).toBeGreaterThan(0)
    expect(queryByText('Add new Address')).toBeNull()
  })

  it('hides add new when the list request failed', () => {
    const { queryByText } = renderList({
      addressList: mockErrorAddressList
    })
    expect(queryByText('Add new Address')).toBeNull()
    expect(queryByText('My saved address')).toBeNull()
  })

  it('shows nearby businesses for pickup when an address exists', () => {
    const { useOrder } = require('@components')
    mockHomeValuesState.userAddressStoraged = { address: '9 Pine St' }
    useOrder.mockReturnValue([{
      loading: false,
      options: mockPickupOptions
    }])
    const { getByTestId, getByText } = renderList()
    expect(getByText(mockAddress.address)).toBeTruthy()
    expect(getByTestId('businesses-listing')).toBeTruthy()
  })

  it('asks for an address on pickup when none is set', () => {
    const { useOrder } = require('@components')
    mockHomeValuesState.userAddressStoraged = { address: '9 Pine St' }
    useOrder.mockReturnValue([{
      loading: false,
      options: {
        ...mockPickupOptions,
        address: {},
        address_id: null
      }
    }])
    const { getByText, queryByText } = renderList({
      addressList: mockEmptyAddressList
    })
    expect(getByText('Please add an address for show businesses near your location')).toBeTruthy()
    expect(queryByText('Continue')).toBeNull()
  })

  it('opens the location prompt for pickup without a stored address', () => {
    const { useOrder } = require('@components')
    mockHomeValuesState.userAddressStoraged = null
    useOrder.mockReturnValue([{
      loading: false,
      options: mockPickupOptions
    }])
    const { getByTestId, queryByText } = renderList()
    expect(getByTestId('bottom-popup')).toBeTruthy()
    expect(getByTestId('allow-current-location')).toBeTruthy()
    expect(queryByText('Continue')).toBeNull()
  })

  it('stops continue when the nearest business change is rejected', async () => {
    mockResolveBusinessForLocation.mockResolvedValueOnce({
      error: false,
      changed: true,
      business: { slug: 'other-store', name: 'Other Store' }
    })
    mockConfirmBusinessChange.mockResolvedValueOnce(false)
    const onNavigationRedirect = jest.fn()
    const { getByText } = renderList({ onNavigationRedirect })
    fireEvent.press(getByText('Continue'))
    await waitFor(() => {
      expect(mockConfirmBusinessChange).toHaveBeenCalled()
    })
    expect(mockOnChangeBusinessSelected).not.toHaveBeenCalled()
    expect(onNavigationRedirect).not.toHaveBeenCalled()
  })

  it('refreshes when a saved address is missing a route', () => {
    const loadAddresses = jest.fn()
    renderList({
      loadAddresses,
      addressList: {
        ...mockAddressListState,
        addresses: [{ ...mockAddress, route: null }]
      }
    })
    expect(loadAddresses).toHaveBeenCalled()
  })
})

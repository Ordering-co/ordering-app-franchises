import { fireEvent } from '@testing-library/react-native'
import { MyOrders } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import { mockNavigation } from '../../../../../../jest/helpers/appM6TestUtils'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))
jest.mock('../../GiftCard/GiftCardOrdersList', () => ({
  GiftCardOrdersList: ({ onNavigationRedirect }) => {
    const React = require('react')
    const { Text, TouchableOpacity } = require('react-native')
    return React.createElement(
      TouchableOpacity,
      { testID: 'gift-card-orders-list', onPress: () => onNavigationRedirect?.('GiftCard') },
      React.createElement(Text, null, 'Gift cards')
    )
  }
}))
jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  useConfig: jest.fn(() => [{
    loading: false,
    configs: { platform_store_giftcard_enabled: { value: '1' } }
  }])
}))

describe('MyOrders UI', () => {
  it('renders order sections by default', () => {
    const { getByText, getByTestId, queryByTestId } = renderWithProviders(
      <MyOrders navigation={mockNavigation} onNavigationRedirect={jest.fn()} />
    )
    expect(getByText('Orders')).toBeTruthy()
    expect(getByText('Businesses')).toBeTruthy()
    expect(getByText('Products')).toBeTruthy()
    expect(getByText('Gift card')).toBeTruthy()
    expect(getByTestId('orders-option-pre')).toBeTruthy()
    expect(getByTestId('orders-option-active')).toBeTruthy()
    expect(getByTestId('orders-option-past')).toBeTruthy()
    expect(queryByTestId('gift-card-orders-list')).toBeNull()
  })

  it('switches to businesses, products, and gift cards', () => {
    const onNavigationRedirect = jest.fn()
    const { getByText, getByTestId } = renderWithProviders(
      <MyOrders
        navigation={mockNavigation}
        onNavigationRedirect={onNavigationRedirect}
        businessesSearchList={{ businesses: [] }}
      />
    )

    fireEvent.press(getByText('Businesses'))
    expect(getByTestId('orders-option-business')).toBeTruthy()

    fireEvent.press(getByText('Products'))
    expect(getByTestId('orders-option-products')).toBeTruthy()

    fireEvent.press(getByText('Gift card'))
    expect(getByTestId('gift-card-orders-list')).toBeTruthy()
    fireEvent.press(getByTestId('gift-card-orders-list'))
    expect(onNavigationRedirect).toHaveBeenCalledWith('GiftCard')
  })

  it('hides the gift card tab when the config disables it', () => {
    const { useConfig } = require('@components')
    useConfig.mockReturnValueOnce([{
      loading: false,
      configs: { platform_store_giftcard_enabled: { value: '0' } }
    }])
    const { queryByText, getByText } = renderWithProviders(
      <MyOrders navigation={mockNavigation} />
    )
    expect(getByText('Orders')).toBeTruthy()
    expect(queryByText('Gift card')).toBeNull()
  })

  it('starts on the businesses tab when orders are hidden', () => {
    const { getByTestId, queryByText } = renderWithProviders(
      <MyOrders hideOrders navigation={mockNavigation} />
    )
    expect(queryByText('Orders')).toBeNull()
    expect(getByTestId('orders-option-business')).toBeTruthy()
  })
})

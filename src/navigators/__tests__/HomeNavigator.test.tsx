import React from 'react'
import { renderWithProviders } from '../../../jest/helpers/renderWithProviders'

const navigate = jest.fn()

jest.mock('@react-navigation/stack', () => {
  const ReactNative = require('react-native')
  return {
    createStackNavigator: () => ({
      Navigator: ({ children }) => (
        <ReactNative.View testID='stack-navigator'>{children}</ReactNative.View>
      ),
      Screen: ({ name }) => (
        <ReactNative.View testID={`stack-${name}`}>
          <ReactNative.Text>{name}</ReactNative.Text>
        </ReactNative.View>
      )
    })
  }
})

const stubPage = (label) => {
  const { Text } = require('react-native')
  return { default: () => <Text>{label}</Text> }
}

jest.mock('../BottomNavigator', () => stubPage('BottomTabPage'))
jest.mock('../../pages/AddressList', () => stubPage('AddressListPage'))
jest.mock('../../pages/AddressForm', () => stubPage('AddressFormPage'))
jest.mock('../../pages/OrderDetails', () => stubPage('OrderDetailsPage'))
jest.mock('../../pages/ProductDetails', () => stubPage('ProductDetailsPage'))
jest.mock('../../pages/UpsellingPage', () => stubPage('UpsellingPage'))
jest.mock('../../pages/ReviewOrder', () => stubPage('ReviewOrderPage'))
jest.mock('../../pages/ReviewProducts', () => stubPage('ReviewProductsPage'))
jest.mock('../../pages/ReviewDriver', () => stubPage('ReviewDriverPage'))
jest.mock('../../pages/MomentOption', () => stubPage('MomentOptionPage'))
jest.mock('../../pages/PaymentDetails', () => stubPage('PaymentDetailsPage'))
jest.mock('../../pages/Help', () => stubPage('HelpPage'))
jest.mock('../../pages/HelpOptions', () => stubPage('HelpOptionsPage'))
jest.mock('../../pages/BusinessPreorder', () => stubPage('BusinessPreorderPage'))
jest.mock('../../pages/RewardsTransactions', () => stubPage('RewardsTransactionsPage'))
jest.mock('../../pages/RedeemGiftCard', () => stubPage('RedeemGiftCardPage'))
jest.mock('../../pages/PurchaseGiftCard', () => stubPage('PurchaseGiftCardPage'))
jest.mock('../../pages/BusinessInfo', () => stubPage('BusinessInfoPage'))
jest.mock('../../pages/BusinessReviews', () => stubPage('BusinessReviewsPage'))
jest.mock('../../pages/CheckGuest', () => stubPage('CheckGuestPage'))
jest.mock('../../pages/Messages', () => stubPage('MessagesPage'))
jest.mock('../../pages/MessageView', () => stubPage('MessageViewPage'))
jest.mock('../../pages/Favorite', () => stubPage('FavoritePage'))
jest.mock('../../pages/Sessions', () => stubPage('SessionsPage'))
jest.mock('../../pages/MyOrders', () => stubPage('MyOrdersPage'))
jest.mock('../../pages/Checkout', () => stubPage('CheckoutPage'))
jest.mock('../../pages/PaymentOptions', () => stubPage('PaymentOptionsPage'))
jest.mock('../../pages/ProfileForm', () => stubPage('ProfileFormPage'))
jest.mock('../../pages/CouponOffers', () => stubPage('CouponOffersPage'))

import HomeNavigator from '../HomeNavigator'

describe('HomeNavigator', () => {
  beforeEach(() => {
    navigate.mockClear()
  })

  it('registers the home stack screens', () => {
    const { getByTestId, getByText } = renderWithProviders(
      <HomeNavigator navigation={{ navigate }} route={{ params: {} }} />
    )
    expect(getByTestId('stack-navigator')).toBeTruthy()
    expect(getByText('BottomTab')).toBeTruthy()
    expect(getByText('OrderDetails')).toBeTruthy()
    expect(getByText('CheckoutPage')).toBeTruthy()
    expect(navigate).not.toHaveBeenCalled()
  })

  it('navigates to order details from a deep link param', () => {
    renderWithProviders(
      <HomeNavigator
        navigation={{ navigate }}
        route={{ params: { orderIdParam: '88' } }}
      />
    )
    expect(navigate).toHaveBeenCalledWith('OrderDetails', { orderId: '88' })
  })
})

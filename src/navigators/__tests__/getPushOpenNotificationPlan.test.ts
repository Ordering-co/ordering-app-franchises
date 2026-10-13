import { getPushOpenNotificationPlan } from '../getPushOpenNotificationPlan'

const orderNotification = {
  additionalData: { order_uuid: 'ord-42' }
}

const cartNotification = {
  additionalData: { cart_uuid: 'cart-9' }
}

describe('getPushOpenNotificationPlan', () => {
  it('keeps a pending order while logged out', () => {
    expect(getPushOpenNotificationPlan({
      loaded: true,
      auth: false,
      notification: orderNotification
    })).toEqual({
      shouldOpen: false,
      screen: null,
      params: null
    })
  })

  it('opens Order Details after login when a push order is pending', () => {
    expect(getPushOpenNotificationPlan({
      loaded: true,
      auth: true,
      notification: orderNotification
    })).toEqual({
      shouldOpen: true,
      screen: 'OrderDetails',
      params: { orderId: 'ord-42', isFromRoot: true }
    })
  })

  it('opens Checkout after login when a cart uuid is pending', () => {
    expect(getPushOpenNotificationPlan({
      loaded: true,
      auth: true,
      notification: cartNotification
    })).toEqual({
      shouldOpen: true,
      screen: 'CheckoutPage',
      params: { cartUuid: 'cart-9' }
    })
  })

  it('does not open while UserVerification is the only mounted stack', () => {
    expect(getPushOpenNotificationPlan({
      loaded: true,
      auth: true,
      isUserVerifyRequired: true,
      isGuestCheckoutEnabled: false,
      notification: orderNotification
    }).shouldOpen).toBe(false)
  })

  it('opens for guest checkout even when phone/email verification would otherwise gate', () => {
    expect(getPushOpenNotificationPlan({
      loaded: true,
      auth: true,
      isUserVerifyRequired: true,
      isGuestCheckoutEnabled: true,
      notification: orderNotification
    }).shouldOpen).toBe(true)
  })

  it('does not open when boot is not loaded yet', () => {
    expect(getPushOpenNotificationPlan({
      loaded: false,
      auth: true,
      notification: orderNotification
    }).shouldOpen).toBe(false)
  })

  it('does not open when there is no order or cart target', () => {
    expect(getPushOpenNotificationPlan({
      loaded: true,
      auth: true,
      notification: { additionalData: {} }
    })).toEqual({
      shouldOpen: false,
      screen: null,
      params: null
    })
  })
})

function hasValue (value: unknown) {
  return value != null && value !== '' && value !== 'null'
}

function isPushOrderStackGated ({
  isUserVerifyRequired,
  isGuestCheckoutEnabled
}: {
  isUserVerifyRequired?: unknown
  isGuestCheckoutEnabled?: unknown
}) {
  return !!isUserVerifyRequired && !isGuestCheckoutEnabled
}

export function getPushNotificationTarget (notification: unknown) {
  const additionalData = notification && typeof notification === 'object'
    ? (notification as { additionalData?: any, data?: any }).additionalData ??
      (notification as { additionalData?: any, data?: any }).data
    : undefined

  if (hasValue(additionalData?.order_uuid)) {
    return {
      screen: 'OrderDetails' as const,
      params: {
        orderId: additionalData.order_uuid,
        isFromRoot: true
      }
    }
  }

  if (hasValue(additionalData?.cart_uuid)) {
    return {
      screen: 'CheckoutPage' as const,
      params: {
        cartUuid: additionalData.cart_uuid
      }
    }
  }

  return null
}

export function getPushOpenNotificationPlan ({
  loaded,
  auth,
  isUserVerifyRequired,
  isGuestCheckoutEnabled,
  notification
}: {
  loaded?: unknown
  auth?: unknown
  isUserVerifyRequired?: unknown
  isGuestCheckoutEnabled?: unknown
  notification?: unknown
}) {
  const target = getPushNotificationTarget(notification)
  const shouldOpen = !!loaded &&
    !!auth &&
    !isPushOrderStackGated({ isUserVerifyRequired, isGuestCheckoutEnabled }) &&
    target != null

  return {
    shouldOpen,
    screen: shouldOpen ? target.screen : null,
    params: shouldOpen ? target.params : null
  }
}

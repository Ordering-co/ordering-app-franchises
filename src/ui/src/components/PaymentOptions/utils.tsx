import { Platform } from 'react-native'

export const PayUtilities = () => {

  const excludeGateways = ['stripe_redirect', 'stripe_direct', 'credomatic', 'stripe_checkout', 'global_google_pay', 'global_apple_pay', 'square']
  const webViewPaymentGateway = ['paypal', 'computop']
  const methodsWithoutRequirements = ['card_delivery', 'stripe_checkout', 'checkout_pro_mercadopago', 'epayco', 'interswitch', 'izipay', 'liqpay', 'globalpay', 'hitpay', 'cybersource']
  const methodsWithoutOnBack = ['izipay', 'globalpay', 'hitpay', 'cybersource']
  const methodsPay = ['google_pay', 'apple_pay']
  const filterMethodsPay = (gateway: string) => Platform.OS === 'ios' ? gateway !== 'google_pay' : gateway !== 'apple_pay'

  return {
    excludeGateways,
    webViewPaymentGateway,
    methodsWithoutRequirements,
    methodsPay,
    filterMethodsPay,
    methodsWithoutOnBack
  }
}

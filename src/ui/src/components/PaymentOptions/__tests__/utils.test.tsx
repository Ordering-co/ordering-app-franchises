import { Platform } from 'react-native'
import { PayUtilities } from '../utils'

describe('PayUtilities', () => {
  it('exposes gateway groups used by checkout', () => {
    const utils = PayUtilities()
    expect(utils.excludeGateways).toContain('stripe_redirect')
    expect(utils.webViewPaymentGateway).toContain('paypal')
    expect(utils.methodsWithoutRequirements).toContain('card_delivery')
    expect(utils.methodsWithoutOnBack).toContain('globalpay')
    expect(utils.methodsPay).toEqual(['google_pay', 'apple_pay'])
  })

  it('filters Google Pay on iOS and Apple Pay on Android', () => {
    const iosUtils = PayUtilities()
    expect(iosUtils.filterMethodsPay('google_pay')).toBe(false)
    expect(iosUtils.filterMethodsPay('apple_pay')).toBe(true)
    expect(iosUtils.filterMethodsPay('cash')).toBe(true)

    const originalOs = Platform.OS
    Platform.OS = 'android'
    const androidUtils = PayUtilities()
    expect(androidUtils.filterMethodsPay('apple_pay')).toBe(false)
    expect(androidUtils.filterMethodsPay('google_pay')).toBe(true)
    Platform.OS = originalOs
  })
})

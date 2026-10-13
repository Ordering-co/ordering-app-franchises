import {
  getCouponLabel,
  getCurrentOffers,
  getOfferApplyLabel
} from '../utils'

const t = (_key: string, fallback: string) => fallback

describe('coupon offers utilities', () => {
  it('normalizes coupon objects and keeps a manual coupon in current offers', () => {
    expect(getCouponLabel({ code: 'SAVE10' })).toBe('SAVE10')
    expect(getCurrentOffers([], { code: 'SAVE10' }, 'Applied coupon')).toEqual([
      {
        id: 'coupon:SAVE10',
        coupon: 'SAVE10',
        name: 'Applied coupon',
        isCoupon: true
      }
    ])
  })

  it('does not duplicate a coupon already represented by an applied offer', () => {
    const offer = { id: 7, coupon: 'SAVE10', name: 'Lunch reward' }

    expect(getCurrentOffers([offer], ' save10 ', 'Applied coupon')).toEqual([offer])
  })

  it('selects applying, replacement, and default action labels', () => {
    expect(getOfferApplyLabel({ applying: true, t })).toBe('Applying...')
    expect(getOfferApplyLabel({ applying: false, cartHasOffers: true, stackable: false, t })).toBe('Replace')
    expect(getOfferApplyLabel({ applying: false, cartHasOffers: false, stackable: false, t })).toBe('Apply')
  })
})

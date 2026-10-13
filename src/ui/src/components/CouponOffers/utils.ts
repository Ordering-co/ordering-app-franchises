export const getCouponLabel = (couponDefault: any) => (
  typeof couponDefault === 'object'
    ? couponDefault?.coupon || couponDefault?.code || ''
    : couponDefault
)

export const getCurrentOffers = (
  offers: any,
  couponDefault: any,
  appliedCouponName: string
) => {
  const appliedOffers = Array.isArray(offers) ? offers : []
  const couponLabel = getCouponLabel(couponDefault)
  const normalizedCouponLabel = String(couponLabel || '').trim().toLowerCase()
  const couponIsListedAsOffer = appliedOffers.some((offer: any) => (
    normalizedCouponLabel &&
    String(offer?.coupon || offer?.code || '').trim().toLowerCase() === normalizedCouponLabel
  ))

  return [
    ...appliedOffers,
    ...(couponDefault && !couponIsListedAsOffer
      ? [{
          id: `coupon:${couponLabel}`,
          coupon: couponLabel,
          name: appliedCouponName,
          isCoupon: true
        }]
      : [])
  ]
}

export const getOfferApplyLabel = ({
  applying,
  cartHasOffers,
  stackable,
  t
}: {
  applying: boolean
  cartHasOffers?: boolean
  stackable?: boolean
  t: (key: string, fallback: string) => string
}) => applying
  ? t('APPLYING', 'Applying...')
  : !stackable && cartHasOffers
    ? t('REPLACE', 'Replace')
    : t('APPLY', 'Apply')

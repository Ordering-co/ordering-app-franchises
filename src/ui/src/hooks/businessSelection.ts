export interface NearestBusinessResponse {
  business?: any
  error?: any
}

export interface BusinessResolution {
  business: any
  changed: boolean
  error: any
}

interface DecideParams {
  selectedBusiness: any
  coveringBusiness: any
  nearest: NearestBusinessResponse | null | undefined
}

export const decideBusinessForLocation = ({ selectedBusiness, coveringBusiness, nearest }: DecideParams): BusinessResolution => {
  if (selectedBusiness && coveringBusiness) {
    return { business: { ...selectedBusiness, ...coveringBusiness }, changed: false, error: null }
  }

  if (!nearest || nearest.error || !nearest.business?.slug) {
    return { business: selectedBusiness ?? null, changed: false, error: nearest?.error ?? null }
  }

  const changed = !!selectedBusiness && nearest.business.id !== selectedBusiness.id
  return { business: nearest.business, changed, error: null }
}

export const hasCartForBusiness = (carts: any, businessId: any): boolean => {
  if (!carts || businessId === undefined || businessId === null) return false
  return Object.values(carts).some((cart: any) =>
    cart?.business_id === businessId && (cart?.products?.length ?? 0) > 0
  )
}

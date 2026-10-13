import { decideBusinessForLocation, hasCartForBusiness } from '../businessSelection'

const storeA = { id: 1, slug: 'llu-campus', name: 'LLU Campus' }
const storeB = { id: 2, slug: 'vegan-bakery', name: 'Vegan Bakery' }

describe('decideBusinessForLocation', () => {
  it('keeps the selected business when it covers the location', () => {
    const result = decideBusinessForLocation({
      selectedBusiness: storeA,
      coveringBusiness: { ...storeA, distance: 3.2, open: true },
      nearest: null
    })
    expect(result.changed).toBe(false)
    expect(result.error).toBeNull()
    expect(result.business).toMatchObject({ id: 1, slug: 'llu-campus', distance: 3.2 })
  })

  it('proposes the nearest business when the selected one does not cover the location', () => {
    const result = decideBusinessForLocation({
      selectedBusiness: storeA,
      coveringBusiness: null,
      nearest: { business: storeB, error: null }
    })
    expect(result).toEqual({ business: storeB, changed: true, error: null })
  })

  it('uses the nearest business without flagging a change when nothing was selected', () => {
    const result = decideBusinessForLocation({
      selectedBusiness: null,
      coveringBusiness: null,
      nearest: { business: storeB, error: null }
    })
    expect(result).toEqual({ business: storeB, changed: false, error: null })
  })

  it('does not flag a change when the nearest business is the selected one', () => {
    const result = decideBusinessForLocation({
      selectedBusiness: storeA,
      coveringBusiness: null,
      nearest: { business: { ...storeA }, error: null }
    })
    expect(result.changed).toBe(false)
    expect(result.business).toMatchObject({ id: 1 })
  })

  it('keeps the selected business and surfaces the error when nearest lookup fails', () => {
    const result = decideBusinessForLocation({
      selectedBusiness: storeA,
      coveringBusiness: null,
      nearest: { business: null, error: 'No business near of you location' }
    })
    expect(result).toEqual({ business: storeA, changed: false, error: 'No business near of you location' })
  })

  it('keeps the selected business when nearest lookup returned nothing', () => {
    const result = decideBusinessForLocation({
      selectedBusiness: storeA,
      coveringBusiness: null,
      nearest: undefined
    })
    expect(result).toEqual({ business: storeA, changed: false, error: null })
  })
})

describe('hasCartForBusiness', () => {
  it('detects a non-empty cart for the business', () => {
    const carts = { 'uuid-1': { business_id: 1, products: [{ id: 10 }] } }
    expect(hasCartForBusiness(carts, 1)).toBe(true)
  })

  it('ignores empty carts, other businesses and missing carts', () => {
    expect(hasCartForBusiness({ a: { business_id: 1, products: [] } }, 1)).toBe(false)
    expect(hasCartForBusiness({ a: { business_id: 2, products: [{ id: 1 }] } }, 1)).toBe(false)
    expect(hasCartForBusiness(null, 1)).toBe(false)
    expect(hasCartForBusiness({}, undefined)).toBe(false)
  })
})

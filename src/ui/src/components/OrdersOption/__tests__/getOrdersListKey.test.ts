import { getOrdersListKey } from '../getOrdersListKey'

const orders = [
  { id: 10, cart_group_id: 'g1', status: 1, products: [{ id: 1, name: 'Pizza'.repeat(80) }] },
  { id: 11, cart_group_id: null, status: 2, products: [{ id: 2 }] }
]

describe('getOrdersListKey', () => {
  it('does not JSON.stringify order objects', () => {
    const spy = jest.spyOn(JSON, 'stringify')
    getOrdersListKey(orders)
    expect(spy).not.toHaveBeenCalled()
    spy.mockRestore()
  })

  it('returns a stable key for missing or empty lists', () => {
    expect(getOrdersListKey(undefined)).toBe('0')
    expect(getOrdersListKey(null)).toBe('0')
    expect(getOrdersListKey([])).toBe('0')
  })

  it('is the same when nested product payloads differ', () => {
    expect(getOrdersListKey(orders)).toBe(getOrdersListKey([
      { ...orders[0], products: [{ id: 99 }] },
      orders[1]
    ]))
  })

  it('changes when length, id, group, or status changes', () => {
    const base = getOrdersListKey(orders)
    expect(getOrdersListKey([orders[0]])).not.toBe(base)
    expect(getOrdersListKey([{ ...orders[0], id: 99 }, orders[1]])).not.toBe(base)
    expect(getOrdersListKey([{ ...orders[0], cart_group_id: 'g2' }, orders[1]])).not.toBe(base)
    expect(getOrdersListKey([{ ...orders[0], status: 7 }, orders[1]])).not.toBe(base)
  })
})

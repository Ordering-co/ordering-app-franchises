import { navigationRef, navigate } from '../NavigationRef'

describe('NavigationRef', () => {
  it('forwards navigate to the current ref', () => {
    const current = { navigate: jest.fn() }
    navigationRef.current = current
    navigate('OrderDetails', { orderId: 9 })
    expect(current.navigate).toHaveBeenCalledWith('OrderDetails', { orderId: 9 })
  })

  it('is a no-op when the ref is empty', () => {
    navigationRef.current = null
    expect(() => navigate('Home', {})).not.toThrow()
  })
})

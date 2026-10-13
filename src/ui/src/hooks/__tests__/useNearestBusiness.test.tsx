import { act, renderHook } from '@testing-library/react-native'
import { Alert } from 'react-native'
import { useApi, useConfig, useOrder } from '@components'
import { useNearestBusiness } from '../useNearestBusiness'

describe('useNearestBusiness', () => {
  const get = jest.fn()
  const where = jest.fn(() => ({ get }))
  const parameters = jest.fn(() => ({ get, where }))
  const select = jest.fn(() => ({ parameters }))

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useConfig as jest.Mock).mockReturnValue([{ configs: {} }])
    ;(useOrder as jest.Mock).mockReturnValue([{
      options: { type: 1, address: { location: { lat: 1, lng: 2 } } },
      carts: {}
    }, {}])
    ;(useApi as jest.Mock).mockReturnValue([{ businesses: () => ({ select }) }])
    jest.spyOn(Alert, 'alert').mockImplementation((_title, _msg, buttons) => {
      buttons?.[1]?.onPress?.()
    })
  })

  it('returns the nearest open business', async () => {
    get.mockResolvedValue({
      content: { error: false, result: [{ id: 1, slug: 'open-store', open: true, name: 'Open' }] }
    })
    const { result } = renderHook(() => useNearestBusiness())
    let values
    await act(async () => {
      values = await result.current.getNearestBusiness()
    })
    expect(values.business).toMatchObject({ slug: 'open-store' })
    expect(values.error).toBeNull()
  })

  it('confirms a store change through Alert', async () => {
    const { result } = renderHook(() => useNearestBusiness())
    let accepted
    await act(async () => {
      accepted = await result.current.confirmBusinessChange({
        from: { id: 1, name: 'A' },
        to: { id: 2, name: 'B' }
      })
    })
    expect(Alert.alert).toHaveBeenCalled()
    expect(accepted).toBe(true)
  })

  it('checks coverage and resolves a store for the location', async () => {
    get.mockResolvedValue({
      content: { error: false, result: [{ id: 2, slug: 'near', open: true, name: 'Near' }] }
    })
    const { result } = renderHook(() => useNearestBusiness())
    let covering
    let resolution
    await act(async () => {
      covering = await result.current.checkBusinessCoverage({ id: 2 })
      resolution = await result.current.resolveBusinessForLocation({ id: 1, name: 'Selected' })
    })
    expect(covering).toMatchObject({ id: 2 })
    expect(resolution.changed).toBe(true)
    expect(resolution.business).toMatchObject({ slug: 'near' })
  })
})

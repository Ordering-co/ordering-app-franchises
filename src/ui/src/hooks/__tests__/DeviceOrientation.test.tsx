import { act, renderHook } from '@testing-library/react-native'
import { Dimensions } from 'react-native'
import { LANDSCAPE, PORTRAIT, useDeviceOrientation } from '../DeviceOrientation'

describe('useDeviceOrientation', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('reports portrait when height is greater than width', () => {
    jest.spyOn(Dimensions, 'get').mockReturnValue({ width: 390, height: 844, scale: 1, fontScale: 1 })
    const { result } = renderHook(() => useDeviceOrientation())
    expect(result.current[0].orientation).toBe(PORTRAIT)
    expect(result.current[0].dimensions).toEqual({ width: 390, height: 844 })
  })

  it('updates to landscape on dimension change', () => {
    jest.spyOn(Dimensions, 'get').mockReturnValue({ width: 390, height: 844, scale: 1, fontScale: 1 })
    let listener
    jest.spyOn(Dimensions, 'addEventListener').mockImplementation((_event, cb) => {
      listener = cb
      return { remove: jest.fn() }
    })
    const { result } = renderHook(() => useDeviceOrientation())
    act(() => {
      listener({ window: { width: 844, height: 390 } })
    })
    expect(result.current[0].orientation).toBe(LANDSCAPE)
    expect(result.current[0].dimensions).toEqual({ width: 844, height: 390 })
  })
})

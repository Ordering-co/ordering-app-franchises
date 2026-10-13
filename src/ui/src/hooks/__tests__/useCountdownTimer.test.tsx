import { act, renderHook } from '@testing-library/react-native'
import { useCountdownTimer } from '../useCountdownTimer'

describe('useCountdownTimer', () => {
  afterEach(() => {
    jest.useRealTimers()
  })

  it('stays at the initial count when not started', () => {
    const { result } = renderHook(() => useCountdownTimer(5, false))
    expect(result.current[0]).toBe(5)
  })

  it('counts down and can reset', () => {
    jest.useFakeTimers()
    const { result } = renderHook(() => useCountdownTimer(3, true))
    act(() => {
      jest.advanceTimersByTime(1000)
    })
    expect(result.current[0]).toBe(2)
    act(() => {
      result.current[2]()
    })
    expect(result.current[0]).toBe(3)
  })
})

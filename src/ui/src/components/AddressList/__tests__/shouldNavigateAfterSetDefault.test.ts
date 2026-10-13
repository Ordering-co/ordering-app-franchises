import {
  getAddressListContinueState,
  runSetDefaultThenNavigate,
  shouldNavigateAfterSetDefault
} from '../shouldNavigateAfterSetDefault'

describe('shouldNavigateAfterSetDefault', () => {
  it('continues when set-default returns nothing', () => {
    expect(shouldNavigateAfterSetDefault(undefined)).toBe(true)
    expect(shouldNavigateAfterSetDefault(null)).toBe(true)
  })

  it('does not continue when set-default reports an error', () => {
    expect(shouldNavigateAfterSetDefault({ error: true })).toBe(false)
    expect(shouldNavigateAfterSetDefault({ error: ['failed'] })).toBe(false)
    expect(shouldNavigateAfterSetDefault(false)).toBe(false)
  })
})

describe('runSetDefaultThenNavigate', () => {
  it('waits for set-default before Continue navigates', async () => {
    let resolveDefault: ((value?: unknown) => void) | undefined
    const setDefault = jest.fn(() => new Promise((resolve) => {
      resolveDefault = resolve
    }))
    const navigate = jest.fn()

    const pending = runSetDefaultThenNavigate({ setDefault, navigate })
    expect(navigate).not.toHaveBeenCalled()

    resolveDefault?.()
    await expect(pending).resolves.toBe(true)
    expect(navigate).toHaveBeenCalledTimes(1)
  })

  it('does not continue when set-default throws', async () => {
    const navigate = jest.fn()

    await expect(runSetDefaultThenNavigate({
      setDefault: async () => {
        throw new Error('network')
      },
      navigate
    })).resolves.toBe(false)

    expect(navigate).not.toHaveBeenCalled()
  })

  it('does not continue when set-default returns an error', async () => {
    const navigate = jest.fn()

    await expect(runSetDefaultThenNavigate({
      setDefault: async () => ({ error: true }),
      navigate
    })).resolves.toBe(false)

    expect(navigate).not.toHaveBeenCalled()
  })
})

describe('getAddressListContinueState', () => {
  const ready = {
    hasAddress: true,
    disableContinue: false,
    locationPromptOpen: false,
    orderLoading: false,
    actionLoading: false,
    nearestLoading: false,
    isSettingAddress: false
  }

  it('keeps Continue visible while the cart address is updating', () => {
    expect(getAddressListContinueState({
      ...ready,
      actionLoading: true
    })).toEqual({ visible: true, loading: true })

    expect(getAddressListContinueState({
      ...ready,
      orderLoading: true
    })).toEqual({ visible: true, loading: true })
  })

  it('forces Continue visible and loading while setting an address even if hasAddress drops', () => {
    expect(getAddressListContinueState({
      ...ready,
      hasAddress: false,
      isSettingAddress: true
    })).toEqual({ visible: true, loading: true })
  })

  it('keeps Continue visible during cart network transition even if hasAddress drops', () => {
    expect(getAddressListContinueState({
      ...ready,
      hasAddress: false,
      orderLoading: true
    })).toEqual({ visible: true, loading: true })
  })

  it('keeps Continue loading while the tapped address is not applied to the cart yet', () => {
    expect(getAddressListContinueState({
      ...ready,
      isSettingAddress: false,
      orderLoading: false,
      actionLoading: false,
      selectedAddressId: 2,
      cartAddressId: 1
    })).toEqual({ visible: true, loading: true })
  })

  it('stops Continue loading when the tapped address matches the cart', () => {
    expect(getAddressListContinueState({
      ...ready,
      selectedAddressId: 1,
      cartAddressId: 1
    })).toEqual({ visible: true, loading: false })
  })

  it('hides Continue when there is no address or the location prompt is open', () => {
    expect(getAddressListContinueState({
      ...ready,
      hasAddress: false
    })).toEqual({ visible: false, loading: false })

    expect(getAddressListContinueState({
      ...ready,
      locationPromptOpen: true,
      orderLoading: true
    })).toEqual({ visible: false, loading: true })
  })
})

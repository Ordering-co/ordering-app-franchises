import { act, renderHook } from '@testing-library/react-native'
import { useApi, useOrder, useSession } from '@components'
import { useGuestLogin } from '../useGuestLogin'

describe('useGuestLogin', () => {
  const login = jest.fn()
  const handleOrderStateLoading = jest.fn()
  const save = jest.fn()
  const onRedirect = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useSession as jest.Mock).mockReturnValue([{ auth: false, user: { id: 9 } }, { login }])
    ;(useOrder as jest.Mock).mockReturnValue([{}, { handleOrderStateLoading }])
    ;(useApi as jest.Mock).mockReturnValue([{ users: () => ({ save }) }])
  })

  it('redirects immediately when the user is already authenticated', async () => {
    ;(useSession as jest.Mock).mockReturnValue([{ auth: true, user: { id: 9 } }, { login }])
    const { result } = renderHook(() =>
      useGuestLogin({ redirectProps: { page: 'Checkout' }, onRedirect })
    )
    await act(async () => {
      await result.current.handleGuestUser()
    })
    expect(onRedirect).toHaveBeenCalledWith('Checkout', { userId: 9 })
    expect(save).not.toHaveBeenCalled()
  })

  it('creates a guest user and logs in', async () => {
    save.mockResolvedValue({
      content: { error: false, result: { id: 11, session: { access_token: 'tok' } } }
    })
    const { result } = renderHook(() =>
      useGuestLogin({ redirectProps: { page: 'Checkout', params: { cart: 1 } }, onRedirect })
    )
    await act(async () => {
      await result.current.handleGuestUser()
    })
    expect(save).toHaveBeenCalledWith({ guest_token: 'guest-token-1' })
    expect(login).toHaveBeenCalled()
    expect(handleOrderStateLoading).toHaveBeenCalledWith(true)
    expect(handleOrderStateLoading).toHaveBeenCalledWith(false)
  })
})

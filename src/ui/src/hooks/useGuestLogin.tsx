import uuid from 'react-native-uuid';

import { useSession, useApi, useOrder } from '@components';

export const useGuestLogin = (props: any) => {
  const { redirectProps, onRedirect } = props;

  const [{ auth, user }, { login }] = useSession();
  const [ordering] = useApi();
  const [, { handleOrderStateLoading }] = useOrder()

  const createGuestUser = async (values: any) => {
    try {
      await handleOrderStateLoading(true)
      const { content: { error, result } } = await ordering.users().save(values)
      if (!error) {
        await login({
          user: result,
          token: result.session?.access_token
        })
        onRedirect?.(redirectProps?.page, { ...redirectProps?.params, userId: user?.id })
      }
      await handleOrderStateLoading(false)
    } catch {
      await handleOrderStateLoading(false)
    }
  }

  const handleGuestUser = async () => {
    if (auth) {
      onRedirect?.(redirectProps?.page, { ...redirectProps?.params, userId: user?.id })
      return
    }
    const guestToken = uuid.v4()
    await createGuestUser({ guest_token: guestToken })
  }

  return {
    handleGuestUser
  }
}

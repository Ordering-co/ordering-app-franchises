import React, { useState } from 'react'

import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Forgot from '../pages/ForgotPassword';
import { useLanguage, useOrder } from '@components'
import { ACCOUNT_VALUES, useBusinessSelected } from '@ui'

interface Props {
  navigation: any;
  route: any;
}

const CheckGuest = (props: Props) => {
  const [, t] = useLanguage()
  const [{ carts }] = useOrder()
  const [businessSelected] = useBusinessSelected()
  const currentCart = carts?.[`businessId:${businessSelected?.id}`] ?? null

  const [accountState, setAccountState] = useState(ACCOUNT_VALUES.LOGIN)

  const guestProps = {
    ...props,
    setAccountState,
    isGuest: true,
    onActionLeftNavbar: () => guestProps.goToBack(),
    handleGuestUser: () => props.navigation.navigate(currentCart?.uuid ? 'CheckoutPage' : 'BottomTab', { cartUuid: currentCart?.uuid }),
    goToBack: () => props.navigation.canGoBack() && props.navigation.goBack(),
    notification_state: props?.route?.params?.notification_state
  }

  return (
    <>
      {accountState === ACCOUNT_VALUES.LOGIN
        ? <Login {...guestProps} />
        : accountState === ACCOUNT_VALUES.SIGNUP
          ? <Signup {...guestProps} />
          : <Forgot {...guestProps} />}
    </>
  )
}

export default CheckGuest;

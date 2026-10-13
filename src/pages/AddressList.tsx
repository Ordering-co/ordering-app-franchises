import React from 'react';
import { SafeAreaViewWrapper } from '../layouts/SafeAreaViewWrapper';

import { useLanguage, useOrder } from '@components';
import { AddressList as AddressListController, NavBar } from '@ui';

const AddressList = (props: any) => {
  const [{ options }] = useOrder()
  const [, t] = useLanguage()

  const addressListProps = {
    ...props,
    userId: props.route?.params?.userId,
    isNewUser: props.route?.params?.newUser,
    disableContinue: props.route?.params?.disableContinue,
    onNavigationRedirect: (route: string, params?: any) => props.navigation.navigate(route, params),
    goBack: () => props.navigation?.canGoBack() && props.navigation.goBack()
  };

  return (
    <>
      <NavBar
        title={options?.type === 1 ? t('DELIVERING_TO', 'Delivering to') : t('PICKING_UP_FROM', 'Picking up from')}
        onActionLeft={() => addressListProps.goBack()}
      />
      <SafeAreaViewWrapper disableScrollView disableKeyboardAvoiding>
        <AddressListController {...addressListProps} />
      </SafeAreaViewWrapper>
    </>
  )
};

export default AddressList;

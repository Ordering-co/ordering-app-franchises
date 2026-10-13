import React, { useEffect, useState } from 'react';
import { AddressForm as AddressFormController, NavBar, _retrieveStoreData } from '@ui';
import { useLanguage } from '@components'

import { SafeAreaViewWrapper } from '../layouts/SafeAreaViewWrapper';

const AddressForm = ({ navigation, route }: any) => {
  const [, t] = useLanguage()

  const AddressFormProps = {
    navigation,
    route,
    address: route?.params?.address,
    addressId: route?.params?.address?.id,
    isEditing: route?.params?.isEditing,
    addressesList: route?.params?.addressList,
    onSaveAddress: route?.params?.onSaveAddress,
    isSelectedAfterAdd: true,
    isGuestUser: route?.params?.isGuestUser,
    hasAddressDefault: route?.params?.hasAddressDefault,
    businessSlug: route?.params?.businessSlug
  };

  const [isGuestFromStore, setIsGuestFromStore] = useState(false);

  const getDataFromStorage = async () => {
    const value = await _retrieveStoreData('isGuestUser');
    setIsGuestFromStore(value);
  };

  useEffect(() => {
    getDataFromStorage();
  }, []);

  return (
    <>
      <NavBar
        title={t('ADD_NEW_ADDRESS', 'Add new address')}
        onActionLeft={() => navigation?.canGoBack() && navigation.goBack()}
      />
      <SafeAreaViewWrapper disableScrollView>
        <AddressFormController
          {...AddressFormProps}
          isGuestFromStore={isGuestFromStore}
          useValidationFileds
        />
      </SafeAreaViewWrapper>
    </>
  );
};

export default AddressForm;

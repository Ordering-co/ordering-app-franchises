import React, { useEffect, useState } from 'react';
import { useTheme } from 'styled-components/native';
import Spinner from 'react-native-loading-spinner-overlay';
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
import FeatherIcon from 'react-native-vector-icons/Feather';

import { UDContainer, UDHeader, UDInfo, EditBtn } from './styles';
import {
  UserFormDetails as UserFormController,
  useLanguage,
  useSession,
  ToastType,
  useToast
} from '@components';

import {
  OIcon,
  OText,
  OModal,
  VerifyPhone,
  UserFormDetailsUI
} from '@ui';
import { ActivityIndicator, Pressable, View } from 'react-native';

const UserDetailsUI = (props: any) => {
  const {
    isEdit,
    formState,
    cleanFormState,
    requiredFields,
    onClose,
    cartStatus,
    toggleIsEdit,
    validationFields,
    isUserDetailsEdit,
    phoneUpdate,
    togglePhoneUpdate,
    isCheckout,
    handleSendVerifyCode,
    verifyPhoneState,
    setFormState,
    setIsOpen,
    isCheckoutPlace
  } = props

  const theme = useTheme();

  const [, t] = useLanguage()
  const [{ user }] = useSession()
  const [, { showToast }] = useToast();

  const userData = props.userData || (!formState.result.error && formState.result?.result) || user
  const hasAnyGuestData = userData?.name ||
    userData?.middle_name ||
    userData?.lastname ||
    userData?.second_lastname ||
    userData?.guest_email ||
    userData?.guest_cellphone
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false)
  const [willVerifyOtpState, setWillVerifyOtpState] = useState(false);
  const [checkPhoneCodeState, setCheckPhoneCodeState] = useState({ loading: false, result: { error: false } })
  const [phoneInputData, setPhoneInputData] = useState({
    error: '',
    phone: {
      country_phone_code: null,
      cellphone: null,
    },
  });

  useEffect(() => {
    if (isUserDetailsEdit) {
      !isEdit && toggleIsEdit()
    }
  }, [isUserDetailsEdit])

  const toggleEditState = () => {
    toggleIsEdit()
    cleanFormState({ changes: {} })
  }

  useEffect(() => {
    if (isSubmit && !isEdit && requiredFields) {
      onClose && onClose()
    }
  }, [isSubmit, requiredFields, isEdit])

  useEffect(() => {
    if (user?.cellphone && !user?.country_phone_code) {
      togglePhoneUpdate(true)
    } else {
      togglePhoneUpdate(false)
    }
  }, [user?.country_phone_code])

  const handleVerifyCodeClick = () => {
    if (formState?.changes?.cellphone && formState?.changes?.country_phone_code) {
      const { cellphone, country_phone_code: countryPhoneCode } = formState?.changes

      setPhoneInputData({
        error: '',
        phone: {
          country_phone_code: countryPhoneCode,
          cellphone: cellphone,
        },
      });
      handleSendVerifyCode({
        cellphone: cellphone,
        country_phone_code: countryPhoneCode
      })
    }
  }

  const handleSendPhoneCode = (values: any) => {
    setWillVerifyOtpState(false)
    setIsModalVisible(false)
    setFormState({
      ...formState,
      changes: {
        ...formState?.changes,
        verification_code: values?.code
      }
    })
  }

  useEffect(() => {
    if (willVerifyOtpState) handleVerifyCodeClick()
  }, [willVerifyOtpState])

  useEffect(() => {
    if (verifyPhoneState && !verifyPhoneState?.loading) {
      if (verifyPhoneState.result?.error) {
        const message = typeof verifyPhoneState?.result?.result === 'string'
          ? verifyPhoneState?.result?.result
          : verifyPhoneState?.result?.result[0]
        verifyPhoneState.result?.result && showToast(
          ToastType.Error,
          message
        )
        setWillVerifyOtpState(false)
        return
      }

      const okResult = verifyPhoneState.result?.result === 'OK'
      if (okResult) {
        !isModalVisible && setIsModalVisible(true)
        setWillVerifyOtpState(false)
      }
    }
  }, [verifyPhoneState])

  return (
    <>
      {(validationFields.loading || formState.loading) && !isCheckout && (
        <ActivityIndicator size="small" color={theme.colors.border} />
      )}

      <UDContainer isCheckout={isCheckout} isEdit={isEdit}>
        {!isEdit && (
          <FeatherIcon
            name={'user'}
            color={theme?.colors?.black}
            size={18}
          />
        )}
        <UDHeader>
          {props.HeaderTitle}
          {!isEdit ? (
            <UDInfo>
              <OText size={12} lineHeight={18} weight={'500'} numberOfLines={2} >
                {userData?.name} {userData?.middle_name} {userData?.lastname} {userData?.second_lastname}
              </OText>
              {!!((userData?.cellphone ?? userData?.guest_cellphone) || (user?.cellphone ?? user?.guest_cellphone)) && (
                <>
                  <OText size={12} lineHeight={18} weight={'400'}>
                    {(userData?.country_phone_code) && `+${(userData?.country_phone_code)} `}{(userData?.guest_id ? user?.guest_cellphone : userData?.cellphone)}
                  </OText>
                  {!!phoneUpdate && (
                    <OText color={theme.colors.error} style={{ textAlign: 'center' }}>{t('NECESSARY_UPDATE_COUNTRY_PHONE_CODE', 'It is necessary to update your phone number')}</OText>
                  )}
                </>
              )}
              <OText size={12} lineHeight={18} weight={'400'}>
                {userData?.guest_id ? userData?.guest_email : userData?.email}
              </OText>
            </UDInfo>
          ) : (
            <UserFormDetailsUI
              {...props}
              phoneUpdate={phoneUpdate}
              togglePhoneUpdate={togglePhoneUpdate}
              isCheckout={isCheckout}
              setWillVerifyOtpState={setWillVerifyOtpState}
              setIsSubmit={setIsSubmit}
              setIsOpen={setIsOpen}
            />
          )}
        </UDHeader>
        {cartStatus !== 2 && !isCheckoutPlace && (
          <View
            style={{ position: 'absolute', right: 10, top: 10 }}
          >
            {!isEdit ? (
              <Pressable
                onPress={() => toggleIsEdit()}
              >
                <OText
                  style={{
                    color: theme?.colors?.primary,
                    textDecorationLine: 'underline',
                  }}
                  size={10}
                >
                  {t('CHANGE', 'Change')}
                </OText>
              </Pressable>
            ) : (
              <>
                {!!hasAnyGuestData && (
                  <EditBtn onPress={() => toggleEditState()}>
                    <OIcon
                      src={theme.images.general.close}
                      color={theme.colors.cancelColor}
                      width={16}
                      height={16}
                      style={{ marginBottom: 5, marginLeft: 5 }}
                    />
                  </EditBtn>
                )}
              </>
            )}
          </View>
        )}
      </UDContainer>
      <OModal
        open={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        entireModal
      >
        <VerifyPhone
          phone={phoneInputData.phone}
          verifyPhoneState={verifyPhoneState}
          checkPhoneCodeState={checkPhoneCodeState}
          handleCheckPhoneCode={handleSendPhoneCode}
          handleVerifyCodeClick={handleVerifyCodeClick}
          onClose={() => setIsModalVisible(false)}
        />
      </OModal>
      <Spinner visible={verifyPhoneState?.loading} />
    </>
  )
}

export const UserDetails = (props: any) => {
  const userDetailsProps = {
    ...props,
    UIComponent: UserDetailsUI
  }

  return <UserFormController {...userDetailsProps} />
}

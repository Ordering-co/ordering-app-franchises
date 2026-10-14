import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Keyboard, Modal, TouchableOpacity } from 'react-native';
import { useTheme } from 'styled-components/native';
import Spinner from 'react-native-loading-spinner-overlay';
import { useForm, Controller } from 'react-hook-form';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Recaptcha from 'react-native-recaptcha-that-works'
import ReCaptcha from '@fatnlazycat/react-native-recaptcha-v3'

import { PhoneInputNumber } from '../PhoneInputNumber';

import {
  ButtonsWrapper,
  FormSide,
  FormInput,
  OrSeparator,
  LineSeparator,
  RecaptchaButton,
  SignupLink
} from './styles';

import {
  LoginForm as LoginFormController,
  useLanguage,
  useConfig,
  useSession,
  useOrder,
  ToastType,
  useToast
} from '@components';

import {
  VerifyPhone,
  OModal,
  OText,
  OButton,
  OInput,
  Alert,
  ACCOUNT_VALUES,
  vibrateApp
} from '@ui'

import { LoginParams } from '../../types';
import { Otp } from './Otp'
import { Tabs } from '../Forms/Tabs'
import { SocialButtons } from '../Forms/SocialButtons'
import { useGuestCheckoutPermission } from '../../hooks/useGuestCheckoutPermission'

const LoginFormUI = (props: LoginParams) => {
  const {
    loginTab,
    formState,
    useLoginByEmail,
    useLoginByCellphone,
    useLoginOtp,
    verifyPhoneState,
    checkPhoneCodeState,
    setCheckPhoneCodeState,
    handleButtonLoginClick,
    handleSendVerifyCode,
    handleCheckPhoneCode,
    onNavigationRedirect,
    notificationState,
    handleReCaptcha,
    enableReCaptcha,
    otpType,
    setOtpType,
    generateOtpCode,
    useLoginOtpEmail,
    useLoginOtpCellphone,
    isGuest
  } = props

  const [, { showToast }] = useToast()
  const [, t] = useLanguage()
  const [{ configs }] = useConfig()
  const [{ auth, user }] = useSession()
  const [orderState] = useOrder()
  const { guestCheckoutAllowed, canUseGuestCheckout } = useGuestCheckoutPermission({
    configs,
    orderType: orderState?.options?.type,
    user
  })
  const { control, handleSubmit, errors, reset, register, setValue } = useForm()
  const [passwordSee, setPasswordSee] = useState(false)
  const [isLoadingVerifyModal, setIsLoadingVerifyModal] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isFBLoading, setIsFBLoading] = useState(false)
  const [willVerifyOtpState, setWillVerifyOtpState] = useState(false)
  const [phoneInputData, setPhoneInputData] = useState({
    error: '',
    phone: {
      country_phone_code: null,
      cellphone: null,
    },
  })
  const [recaptchaConfig, setRecaptchaConfig] = useState<any>({})
  const [recaptchaVerified, setRecaptchaVerified] = useState(false)
  const [alertState, setAlertState] = useState({ open: false, title: '', content: [] })
  const [tabLayouts, setTabLayouts] = useState<any>({})
  const [otpError, setOtpError] = useState(null)

  const tabsRef = useRef<any>(null)
  const enabledPoweredByOrdering = configs?.powered_by_ordering_module?.value || (configs?.plan_enterprise && configs?.plan_enterprise?.value)
  const theme = useTheme();
  const isOtpEmail = loginTab === 'otp' && otpType === 'email'
  const isOtpCellphone = loginTab === 'otp' && otpType === 'cellphone'

  const [isCheckingCode, setCheckingCode] = useState(false)

  const loginStyle = StyleSheet.create({
    btnOutline: {
      backgroundColor: '#FFF',
      color: theme.colors.primary,
      borderRadius: 7.6,
    },
    inputStyle: {
      marginBottom: 28,
      borderWidth: 1,
      borderRadius: 7.6,
    }
  });

  const emailRef = useRef<any>({});
  const passwordRef = useRef<any>({});
  const recaptchaRef = useRef<any>({});

  const handleChangeTab = (val: string, otpType?: string) => {
    props.handleChangeTab(val);
    setPasswordSee(false);
    handleCategoryScroll(otpType ? `${val}_${otpType}` : val)
  };

  const handleGuestUser = () => {
    if (!canUseGuestCheckout()) return
    if (props.handleGuestUser) {
      props.handleGuestUser?.()
      return
    }
    const route = auth ? 'AddressList' : 'BottomTab'
    const params = auth ? {} : { screen: 'Home' }
    onNavigationRedirect(route, params)
  }

  const onSubmit = (values?: any) => {
    Keyboard.dismiss();
    if (loginTab === 'otp') {
      if (phoneInputData.error && (loginTab !== 'otp' || (otpType === 'cellphone' && loginTab === 'otp'))) {
        showToast(ToastType.Error, t('INVALID_PHONE_NUMBER', 'Invalid phone number'));
        vibrateApp()
        return
      }
      if (otpType === 'cellphone' && (!phoneInputData?.phone?.cellphone || phoneInputData?.error)) {
        showToast(ToastType.Error, t('PHONE_NUMBER_REQUIRED', 'Phone number is required'));
        vibrateApp()
        return
      }
      if (loginTab === 'otp') {
        generateOtpCode({
          ...values,
          ...phoneInputData.phone
        })
      }
      setWillVerifyOtpState(true)
    } else {
      if (phoneInputData.error) {
        showToast(ToastType.Error, phoneInputData.error);
        vibrateApp()
        return;
      }
      handleButtonLoginClick({
        ...values,
        ...phoneInputData.phone,
      })
    }
  }

  const handleVerifyCodeClick = () => {
    if (phoneInputData.error) {
      showToast(ToastType.Error, phoneInputData.error);
      vibrateApp()
      return;
    }
    if (
      !phoneInputData.error &&
      !phoneInputData.phone.country_phone_code &&
      !phoneInputData.phone.cellphone
    ) {
      showToast(
        ToastType.Error,
        t(
          'VALIDATION_ERROR_MOBILE_PHONE_REQUIRED',
          'The field Mobile phone is required.',
        ),
      );
      vibrateApp()
      return;
    }
    handleSendVerifyCode && handleSendVerifyCode(phoneInputData.phone);
    setIsLoadingVerifyModal(true);
  };

  const handleChangeInputEmail = (value: string, onChange: any) => {
    onChange(value.toLowerCase().trim().replace(/[&,()%";:ç?<>{}\\[\]\s]/g, ''));
  };

  const handleOpenRecaptcha = () => {
    setRecaptchaVerified(false)
    if (!recaptchaConfig?.siteKey) {
      showToast(ToastType.Error, t('NO_RECAPTCHA_SITE_KEY', 'The config doesn\'t have recaptcha site key'));
      vibrateApp()
      return
    }
    if (!recaptchaConfig?.baseUrl) {
      showToast(ToastType.Error, t('NO_RECAPTCHA_BASE_URL', 'The config doesn\'t have recaptcha base url'));
      vibrateApp()
      return
    }

    recaptchaRef.current.open()
  }

  const onRecaptchaVerify = (token: any) => {
    setRecaptchaVerified(true)
    handleReCaptcha({ code: token, version: recaptchaConfig?.version })
  }

  const handleChangeOtpType = (type: string) => {
    handleChangeTab('otp', type)
    setOtpType(type)
  }

  const handleLoginOtp = async (code: string) => {
    if (!code) return
    const logged = await handleButtonLoginClick({ code })
    setCheckingCode(false)
    if (logged) {
      setWillVerifyOtpState(false)
    } else {
      setOtpError(t('OTP_CODE_INCORRECT', 'Otp code incorrect'))
    }
  }

  const closeAlert = () => {
    setAlertState({
      open: false,
      title: '',
      content: []
    })
  }

  const handleCategoryScroll = (opc: string) => {
    tabsRef.current.scrollTo({
      x: tabLayouts?.[opc]?.x - 40,
      animated: true
    })
  }

  const handleOnLayout = (event: any, opc: string) => {
    const _tabLayouts = { ...tabLayouts }
    const categoryKey = opc
    _tabLayouts[categoryKey] = event.nativeEvent.layout
    setTabLayouts(_tabLayouts)
  }

  useEffect(() => {
    if (configs && Object.keys(configs).length > 0 && enableReCaptcha) {
      if (configs?.security_recaptcha_type?.value === 'v3' &&
        configs?.security_recaptcha_score_v3?.value > 0 &&
        configs?.security_recaptcha_site_key_v3?.value
      ) {
        setRecaptchaConfig({
          version: 'v3',
          siteKey: configs?.security_recaptcha_site_key_v3?.value || null,
          baseUrl: configs?.security_recaptcha_base_url?.value || null
        })
        return
      }
      if (configs?.security_recaptcha_site_key?.value) {
        setRecaptchaConfig({
          version: 'v2',
          siteKey: configs?.security_recaptcha_site_key?.value || null,
          baseUrl: configs?.security_recaptcha_base_url?.value || null
        })
      }
    }
  }, [configs, enableReCaptcha])

  useEffect(() => {
    if (!formState.loading && formState.result?.error) {
      if (formState.result?.result?.[0] === 'ERROR_AUTH_VERIFICATION_CODE') {
        setRecaptchaVerified(false)
        setRecaptchaConfig({
          version: 'v2',
          siteKey: configs?.security_recaptcha_site_key?.value || null,
          baseUrl: configs?.security_recaptcha_base_url?.value || null
        })
        showToast(ToastType.Info, t('TRY_AGAIN', 'Please try again'))
        vibrateApp()
        return
      }
      formState.result?.result &&
        showToast(
          ToastType.Error,
          typeof formState.result?.result === 'string'
            ? formState.result?.result
            : formState.result?.result[0],
        );
      formState.result?.result && vibrateApp()
    }
  }, [formState]);

  useEffect(() => {
    if (verifyPhoneState && !verifyPhoneState?.loading) {
      if (verifyPhoneState.result?.error) {
        const message =
          typeof verifyPhoneState?.result?.result === 'string'
            ? verifyPhoneState?.result?.result
            : verifyPhoneState?.result?.result[0];
        verifyPhoneState.result?.result && showToast(ToastType.Error, message);
        verifyPhoneState.result?.result && vibrateApp();
        setIsLoadingVerifyModal(false);
        return;
      }

      const okResult = verifyPhoneState.result?.result === 'OK';
      if (okResult) {
        !isModalVisible && setIsModalVisible(true);
        setIsLoadingVerifyModal(false);
      }
    }
  }, [verifyPhoneState]);

  useEffect(() => {
    if (phoneInputData?.phone?.cellphone) setValue('cellphone', phoneInputData?.phone?.cellphone)
    else setValue('cellphone', '')
  }, [phoneInputData?.phone?.cellphone])

  useEffect(() => {
    register('cellphone', {
      required: loginTab === 'cellphone'
        ? t('VALIDATION_ERROR_MOBILE_PHONE_REQUIRED', 'The field Mobile phone is required').replace('_attribute_', t('CELLPHONE', 'Cellphone'))
        : null
    })
  }, [register])

  useEffect(() => {
    reset()
  }, [loginTab])

  useEffect(() => {
    if (checkPhoneCodeState?.result?.error) {
      setAlertState({
        open: true,
        content: t(checkPhoneCodeState?.result?.error, checkPhoneCodeState?.result?.error),
        title: ''
      })
    }
  }, [checkPhoneCodeState])

  useEffect(() => {
    if (vibrateApp && !!Object?.values(errors)?.length) vibrateApp()
  }, [errors, vibrateApp])

  return (
    <>
      <FormSide
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: 'center',
          paddingTop: theme.utils.margins.horizontal,
          paddingHorizontal: theme.utils.margins.horizontal
        }}
      >
        <OText size={theme.utils.tsize.l} weight={'800'} style={{ marginBottom: 20 }}>
          {t('WELCOME_ORDERING_PLUS', 'Welcome to OrderingPlus!')}
        </OText>
        {(useLoginByEmail ||
          useLoginByCellphone ||
          useLoginOtpEmail ||
          useLoginOtpCellphone) &&
          (
            <Tabs
              tabsRef={tabsRef}
              defaultTab={loginTab}
              isOtpEmail={isOtpEmail}
              isOtpCellphone={isOtpCellphone}
              useLoginByEmail={useLoginByEmail}
              useLoginByCellphone={useLoginByCellphone}
              useOtpEmail={useLoginOtpEmail}
              useOtpCellphone={useLoginOtpCellphone}
              handleChangeTab={handleChangeTab}
              handleChangeOtpType={handleChangeOtpType}
              handleOnLayout={handleOnLayout}
            />
          )}

        {(useLoginByCellphone || useLoginByEmail || useLoginOtp) && (
          <FormInput>
            {((useLoginByEmail && loginTab === 'email') || (loginTab === 'otp' && otpType === 'email')) && (
              <>
                {errors?.email && (
                  <OText
                    size={14}
                    color={theme.colors.danger5}
                    weight={'normal'}>
                    {errors?.email?.message}{errors?.email?.type === 'required' && '*'}
                  </OText>
                )}
                <Controller
                  control={control}
                  render={({ onChange, value }: any) => (
                    <OInput
                      placeholder={t('EMAIL', 'Email')}
                      style={loginStyle.inputStyle}
                      icon={theme.images.general.email}
                      onChange={(e: any) => {
                        handleChangeInputEmail(e, onChange);
                      }}
                      value={value}
                      autoCapitalize="none"
                      autoCorrect={false}
                      type="email-address"
                      autoCompleteType="email"
                      returnKeyType="next"
                      onSubmitEditing={() => passwordRef.current?.focus()}
                      blurOnSubmit={false}
                      ref={emailRef}
                      borderColor={errors?.email ? theme.colors.danger5 : theme.colors.border}
                    />
                  )}
                  name="email"
                  rules={{
                    required: {
                      value: true,
                      message: t(
                        'VALIDATION_ERROR_EMAIL_REQUIRED',
                        'The field Email is required',
                      ).replace('_attribute_', t('EMAIL', 'Email'))
                    },
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: t(
                        'INVALID_ERROR_EMAIL',
                        'Invalid email address',
                      ).replace('_attribute_', t('EMAIL', 'Email')),
                    }
                  }}
                  defaultValue=""
                />
              </>
            )}
            {((useLoginByCellphone && loginTab === 'cellphone') || (loginTab === 'otp' && otpType === 'cellphone')) && (
              <View style={{ marginBottom: 28 }}>
                <PhoneInputNumber
                  data={phoneInputData}
                  handleData={(val: any) => setPhoneInputData(val)}
                  defaultCode={configs?.default_country_code?.value}
                  defaultCodeFallback={configs?.default_country_code?.value}
                  textInputProps={{
                    returnKeyType: 'next',
                    onSubmitEditing: () => passwordRef?.current?.focus?.(),
                  }}
                  isStartValidation={errors?.cellphone}
                />
              </View>
            )}
            {errors?.password && (
              <OText
                size={14}
                color={theme.colors.danger5}
                weight={'normal'}>
                {errors?.password?.message}{errors?.password?.type === 'required' && '*'}
              </OText>
            )}
            {loginTab !== 'otp' && (
              <Controller
                control={control}
                render={({ onChange, value }: any) => (
                  <OInput
                    isSecured={!passwordSee ? true : false}
                    placeholder={t('PASSWORD', 'Password')}
                    style={{ ...loginStyle.inputStyle, marginBottom: 14 }}
                    icon={theme.images.general.lock}
                    iconCustomRight={
                      !passwordSee ? (
                        <MaterialCommunityIcons
                          name="eye-outline"
                          size={24}
                          onPress={() => setPasswordSee(!passwordSee)}
                          color={theme.colors.disabled}
                        />
                      ) : (
                        <MaterialCommunityIcons
                          name="eye-off-outline"
                          size={24}
                          onPress={() => setPasswordSee(!passwordSee)}
                          color={theme.colors.disabled}
                        />
                      )
                    }
                    autoCapitalize='none'
                    value={value}
                    ref={passwordRef}
                    onChange={(val: any) => onChange(val)}
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit(onSubmit)}
                    blurOnSubmit
                    borderColor={errors?.password ? theme.colors.danger5 : theme.colors.border}
                  />
                )}
                name="password"
                rules={{
                  required: {
                    value: true,
                    message: t(
                      'VALIDATION_ERROR_PASSWORD_REQUIRED',
                      'The field Password is required',
                    ).replace('_attribute_', t('PASSWORD', 'Password'))
                  }
                }}
                defaultValue=""
              />
            )}
            {loginTab !== 'otp' && (
              <TouchableOpacity onPress={() => { props.setAccountState(ACCOUNT_VALUES.FORGOT) }}>
                <OText mBottom={18}>
                  {t('FORGOT_YOUR_PASSWORD', 'Forgot your password?')}
                </OText>
              </TouchableOpacity>
            )}

            <OButton
              text={loginTab !== 'otp' ? t('LOGIN', 'Login') : t('GET_VERIFY_CODE', 'Get verify code')}
              style={{ width: '100%' }}
              imgRightSrc={null}
              isLoading={formState.loading}
              onClick={handleSubmit(onSubmit)}
            />
            {guestCheckoutAllowed && (
              <OButton
                text={t('CONTINUE_AS_GUEST', 'Continue as Guest')}
                style={{ width: '100%', marginTop: 20 }}
                imgRightSrc={null}
                bgColor={theme.colors.white}
                borderColor={theme.colors.primary}
                textStyle={{ color: theme.colors.primary }}
                onClick={() => handleGuestUser()}
              />
            )}

            {(enableReCaptcha && recaptchaConfig?.version) && (
              <>
                {recaptchaConfig?.version === 'v3' ? (
                  <ReCaptcha
                    url={recaptchaConfig?.baseUrl}
                    siteKey={recaptchaConfig?.siteKey}
                    containerStyle={{ height: 40 }}
                    onExecute={onRecaptchaVerify}
                    reCaptchaType={1}
                  />
                ) : (
                  <>
                    <TouchableOpacity
                      onPress={handleOpenRecaptcha}
                    >
                      <RecaptchaButton>
                        {recaptchaVerified ? (
                          <MaterialCommunityIcons
                            name="checkbox-marked"
                            size={26}
                            color={theme.colors.primary}
                          />
                        ) : (
                          <MaterialCommunityIcons
                            name="checkbox-blank-outline"
                            size={26}
                            color={theme.colors.mediumGray}
                          />
                        )}
                        <OText size={14} mLeft={8}>{t('VERIFY_ReCAPTCHA', 'Verify reCAPTCHA')}</OText>
                      </RecaptchaButton>
                    </TouchableOpacity>
                    <Recaptcha
                      ref={recaptchaRef}
                      siteKey={recaptchaConfig?.siteKey}
                      baseUrl={recaptchaConfig?.baseUrl}
                      onVerify={onRecaptchaVerify}
                      onExpire={() => setRecaptchaVerified(false)}
                    />
                  </>)
                }
              </>
            )}

            <SignupLink>
              <OText size={14}>{t('NEW', 'New?')}</OText>
              <TouchableOpacity onPress={() => props.setAccountState(ACCOUNT_VALUES.SIGNUP)}>
                <OText size={14} mLeft={5} color={theme.colors.primary}>
                  {t('CREATE_ACCOUNT', 'Create account')}
                </OText>
              </TouchableOpacity>
            </SignupLink>
          </FormInput>
        )}

        {useLoginByCellphone &&
          loginTab === 'cellphone' &&
          configs && Object.keys(configs).length > 0 &&
          (configs?.twilio_service_enabled?.value === 'true' ||
            configs?.twilio_service_enabled?.value === '1') &&
          configs?.twilio_module?.value && (
            <>
              <OrSeparator>
                <LineSeparator />
                <OText size={18} mRight={20} mLeft={20}>
                  {t('OR', 'Or')}
                </OText>
                <LineSeparator />
              </OrSeparator>

              <ButtonsWrapper mBottom={20}>
                <OButton
                  onClick={handleVerifyCodeClick}
                  text={t('GET_VERIFY_CODE', 'Get Verify Code')}
                  style={loginStyle.btnOutline}
                  imgRightSrc={null}
                  isLoading={isLoadingVerifyModal}
                  indicatorColor={theme.colors.primary}
                />
              </ButtonsWrapper>
            </>
          )}

        <SocialButtons
          isGuest={isGuest}
          notificationState={notificationState}
          setIsFBLoading={setIsFBLoading}
          onHandleSuccess={props.handleGuestUser}
        />

        {enabledPoweredByOrdering && (
          <OText>
            {t('POWERED_BY', 'Powered by')} {t('ORDERING_PLUS', 'OrderingPlus')}
          </OText>
        )}
      </FormSide>

      <OModal
        open={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        entireModal
        title={t('VERIFY_PHONE', 'Verify Phone')}
      >
        <VerifyPhone
          phone={phoneInputData.phone}
          verifyPhoneState={verifyPhoneState}
          checkPhoneCodeState={checkPhoneCodeState}
          handleCheckPhoneCode={handleCheckPhoneCode}
          setCheckPhoneCodeState={setCheckPhoneCodeState}
          handleVerifyCodeClick={handleVerifyCodeClick}
          onClose={() => setIsModalVisible(false)}
        />
      </OModal>
      <Modal
        visible={willVerifyOtpState}
        onDismiss={() => setWillVerifyOtpState(false)}
        animationType='slide'
      >
        <Otp
          isCheckingCode={isCheckingCode}
          setCheckingCode={setCheckingCode}
          willVerifyOtpState={willVerifyOtpState}
          otpError={otpError}
          setOtpError={setOtpError}
          setWillVerifyOtpState={setWillVerifyOtpState}
          handleLoginOtp={handleLoginOtp}
          onSubmit={onSubmit}
          setAlertState={setAlertState}
        />
      </Modal>
      <Alert
        open={alertState.open}
        content={alertState.content}
        title={alertState.title || ''}
        onAccept={closeAlert}
        onClose={closeAlert}
      />
      <Spinner visible={isFBLoading} />
    </>
  )
}

export const LoginForm = (props: any) => {
  const loginProps = {
    ...props,
    isRecaptchaEnable: true,
    UIComponent: LoginFormUI,
  };
  return <LoginFormController {...loginProps} />;
};

import React, { useState, useEffect, useRef } from 'react';
import { View } from 'react-native';
import { PlaceholderLine } from 'rn-placeholder';
import {
  StripeProvider,
  CardField,
  useConfirmSetupIntent,
  createPaymentMethod
} from '@stripe/stripe-react-native';
import { useTheme } from 'styled-components/native';
import { Container, ErrorMessage } from './styles';
import { StripeElementsForm as StripeFormController } from './naked';

import { useLanguage, useSession, useValidationFields } from '@components';
import {
  NotFoundSource,
  OButton,
  OText,
  StripeMethodForm
} from '@ui'

const StripeElementsFormUI = (props: any) => {
  const {
    publicKeyState,
    handleSource,
    values,
    businessId,
    requirements,
    stripeTokenHandler,
    methodsPay,
    paymethod,
    onCancel,
    cart,
    placeByMethodPay,
    setPlaceByMethodPay,
    cartTotal,
    publicKeyAddCard,
    urlscheme,
    androidAppId,
    businessNames,
    getBillingDetails
  } = props;

  const theme = useTheme()
  const [, t] = useLanguage()
  const [{ user }] = useSession()
  const [validationFields] = useValidationFields()
  const { confirmSetupIntent, loading: confirmSetupLoading } = useConfirmSetupIntent()
  const [card, setCard] = useState<any>(null)
  const [errors, setErrors] = useState('')
  const [isCompleted, setIsCompleted] = useState(false)

  const createPmLoading = useRef(false)

  const zipCodeEnabled = validationFields?.fields?.card?.zipcode?.enabled
  const zipCodeRequired = validationFields?.fields?.card?.zipcode?.required
  const isToSave = methodsPay?.includes(paymethod) ? publicKeyState?.key : (publicKeyAddCard || publicKeyState?.key)

  const createPayMethod = async (billingDetails: any) => {
    const params: any = { paymentMethodType: 'Card', paymentMethodData: {} }
    if (Object.keys(billingDetails).length > 0) {
      params.paymentMethodData.billingDetails = { ...billingDetails, token: card?.last4 }
    }
    try {
      createPmLoading.current = true
      const { paymentMethod, error } = await createPaymentMethod(params);

      if (error) {
        setErrors(`${error.message} ${error.stripeErrorCode && error.declineCode ? `(${error.stripeErrorCode}.${error.declineCode})` : ''}`);
        createPmLoading.current = false
        return
      }

      createPmLoading.current = false
      handleSource && handleSource({
        id: paymentMethod.id,
        type: 'card',
        card: {
          brand: paymentMethod.Card.brand,
          last4: paymentMethod.Card.last4
        }
      })
    } catch (error: any) {
      setErrors(error?.message || error?.toString());
    }
  }

  const handleSaveCard = async () => {
    setErrors('')
    const billingDetails = getBillingDetails(user)


    if (!requirements) {
      createPayMethod(billingDetails)
      return
    }

    const params: any = { paymentMethodType: 'Card', paymentMethodData: {} }
    if (Object.keys(billingDetails).length > 0) {
      params.paymentMethodData.billingDetails = { ...billingDetails, token: card?.last4 }
    }
    try {
      const { setupIntent, error } = await confirmSetupIntent(requirements, params);

      if (setupIntent?.status?.toLowerCase?.() === 'succeeded') {
        stripeTokenHandler(setupIntent?.paymentMethod?.id, user, businessId)
      }

      if (error) {
        setErrors(
          error?.code === 'Unknown'
            ? t('ERROR_ADD_CARD', 'An error occurred while trying to add a card')
            : `${error.message} ${error.stripeErrorCode && error.declineCode ? `(${error.stripeErrorCode}.${error.declineCode})` : ''}`
        );
      }
    } catch (error: any) {
      setErrors(error?.message || error?.toString())
    }
  };

  useEffect(() => {
    if (card) {
      setIsCompleted(
        !!card?.last4 &&
        !!card?.expiryMonth &&
        !!card?.expiryYear &&
        !!card?.brand &&
        ((!zipCodeEnabled || !zipCodeRequired || !!card?.postalCode))
      )
    }
  }, [card])

  return (
    <>
      {/* <Container style={{ height: disableModalHeight ? 'auto' : methodsPay?.includes(paymethod) ? 'auto' : height - top - bottom - 60 - (isKeyboardShow ? 250 : 0) }}> */}
      <Container>
        {!publicKeyState.loading && (
          <>
            {publicKeyState?.key && (
              <View style={{ flex: 1 }}>
                <StripeProvider
                  publishableKey={isToSave}
                  merchantIdentifier={props.merchantId}
                  urlScheme={`${urlscheme}://checkout/${cart?.uuid}`}
                >
                  {methodsPay?.includes(paymethod) ? (
                    <StripeMethodForm
                      handleSource={handleSource}
                      onCancel={onCancel}
                      cart={cart}
                      cartTotal={cartTotal}
                      setErrors={setErrors}
                      paymethod={paymethod}
                      devMode={publicKeyState?.key?.includes('test')}
                      placeByMethodPay={placeByMethodPay}
                      setPlaceByMethodPay={setPlaceByMethodPay}
                      androidAppId={androidAppId}
                      businessNames={businessNames}
                    />
                  ) : (
                    <CardField
                      postalCodeEnabled={zipCodeEnabled}
                      cardStyle={{
                        backgroundColor: '#e5e6e8',
                        textColor: 'gray',
                        borderWidth: 1,
                        borderRadius: theme.utils.radius.l,
                        borderColor: theme.colors.border
                      }}
                      style={{
                        height: 50,
                        marginBottom: 20
                      }}
                      onCardChange={(cardDetails: any) => {
                        setCard(cardDetails)
                        setErrors('')
                      }}
                    />
                  )}
                </StripeProvider>
              </View>
            )}
            {!publicKeyState?.key && (
              <NotFoundSource
                simple
                content={t('SOMETHING_WRONG_PUBLIC_KEY', 'There seems to be an issue with your Stripe credentials.')}
              />
            )}
          </>
        )}
        {!methodsPay?.includes(paymethod) && !publicKeyState.loading && publicKeyState?.key && (
          <OButton
            text={t('SAVE_CARD', 'Save card')}
            imgRightSrc={null}
            onClick={() => handleSaveCard()}
            isDisabled={!isCompleted || !!errors}
            isLoading={confirmSetupLoading || values.loadingAdd || createPmLoading.current}
          />
        )}
        {!!errors && (
          <ErrorMessage>
            <OText
              size={theme.utils.tsize.s}
              weight={'bold'}
              color={theme.colors.error}
              style={{ textAlign: 'center', marginTop: 10 }}
            >
              {errors}
            </OText>
          </ErrorMessage>
        )}
        {publicKeyState.loading && (
          <>
            {[...Array(2)].map((_, i) => (
              <PlaceholderLine
                key={i}
                height={45}
                noMargin
                style={{ marginBottom: 20, borderRadius: theme.utils.radius.l }}
              />
            ))}
          </>
        )}
      </Container>
    </>
  )
}

export const StripeElementsForm = (props: any) => {
  const stripeProps = {
    ...props,
    UIComponent: StripeElementsFormUI,
    onSelectCard: (card: any) => {
      props.onSelectCard(card)
      if (card) {
        props.onCancel && props.onCancel()
      }
    }
  }
  return <StripeFormController {...stripeProps} />
}

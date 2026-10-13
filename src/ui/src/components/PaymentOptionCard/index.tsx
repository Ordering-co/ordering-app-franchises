import React, { useEffect, useRef, useState } from 'react'
import { View, Modal, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { useTheme } from 'styled-components/native';
import { PaymentOptionStripe, useLanguage, useSession } from '@components'
import { StripeCardsListUI } from '../StripeCardsList'
import { CreditCardInput } from "react-native-credit-card-input-plus";

import { OButton, OIcon, OText, Alert, PaymentOptionsWebView, OModal } from '@ui'

const iframeCardForm = ['globalpay', 'cybersource']

const PaymentOptionCardUI = (props: any) => {
  const {
    scrollViewRef,
    cardSelected,
    deleteCard,
    onSelectCard,
    handleCardClick,
    cardsList,
    addCardOpen,
    setAddCardOpen,
    gateway,
    handleNewCard,
    paymethodsWithoutSaveCards,
    paymethodV2Featured,
    paymethod,
    navigation,
    deleteUserCard,
    paySelected,
    loadingPayment,
    showGateway,
    setShowGateway,
    globalPayIFrameUrl,
    cybersourceIFrameUrl,
    onNavigationRedirect,
    setCardList,
    setCardsList,
    deleteBusinessUserPaymethod,
    createBusinessUserPaymethod,
    paymethodSelectedInfo,
    businessId
  } = props
  const [, t] = useLanguage()
  const theme = useTheme()
  const [{ token }] = useSession()
  const [alertState, setAlertState] = useState<{ open: boolean, content: Array<string> }>({ open: false, content: [] })
  const [newCard, setNewCard] = useState<any>(null)
  const [isChangedPayment, setIsChangedPayment] = useState(false)

  const onChangeCardForm = (values: any) => {
    if (values?.valid) {
      const expiry = values?.values?.expiry?.split('/')
      const expiryMonth = expiry[0]
      const expiryYear = expiry[1]
      const expiryString = expiryMonth + expiryYear
      let lastFourDigits = values?.values?.number?.substr(-4);
      setNewCard({
        name: values?.values.name,
        number: values?.values.number.replace(/\s/g, ''),
        cvc: values?.values.cvc,
        expiryMonth: expiryMonth,
        expiryYear: expiryYear,
        expiry: expiry,
        brand: values?.values?.type,
        last4: lastFourDigits,
        expiryString: expiryString
      })
    }
  }

  const handleAddNewCard = () => {
    handleNewCard(newCard)
    setAddCardOpen({ ...addCardOpen, card: false })
    setNewCard(null)
  }

  const callbackAfterCardAction = (result: any) => {
    setCardsList((prev: any) => ({
      ...prev,
      cards: [...prev.cards, result]
    }))
    setCardList && setCardList((prev: any) => ({
      ...prev,
      cards: [...prev.cards, {
        ...result,
        ...result.type_data,
        id: result.id,
        card_token: result.external_id
      }]
    }))
    onSelectCard?.({
      ...result.type_data,
      id: result.id,
      card_token: result.external_id
    })
    handleCardClick({
      ...result.type_data,
      id: result.id,
      card_token: result.external_id
    })
    setShowGateway({ closedByUser: false, open: false })
    navigation.goBack()
  }

  useEffect(() => {
    if (cardsList.error && !cardsList.loading) {
      setAlertState({
        open: true,
        content: cardsList.error
      })
    }
  }, [JSON.stringify(cardsList)])

  useEffect(() => {
    if (loadingPayment?.loading || cardsList?.loading || cardsList?.cards?.length > 0 || paymethodV2Featured.includes('register_cards') || isChangedPayment) return
    navigation.goBack()
  }, [loadingPayment, cardsList])

  useEffect(() => {
    if (paymethodSelectedInfo?.id !== paymethod?.id) {
      setIsChangedPayment(true)
    }
  }, [paySelected, paymethod])

  const style = StyleSheet.create({
    wrapperIcon: {
      marginLeft: 25,
      marginTop: Platform.OS === 'ios' ? 40 : 12,
      marginBottom: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonStyle: {
      marginVertical: 20,
      borderRadius: 7.6,
      shadowOpacity: 0,
      height: 44,
      borderWidth: 1
    }
  })

  return (
    <View>
      <>
        {token &&
          (!cardSelected || !paymethodsWithoutSaveCards.includes(gateway)) &&
          ((!paymethodV2Featured || (paymethodV2Featured.includes('get_cards') &&
            paymethodV2Featured.includes('register_cards')))) &&
          (
            <OButton
              text={t('ADD_PAYMENT_CARD', 'Add New Payment Card')}
              bgColor={theme.colors.white}
              borderColor={theme.colors.primary}
              style={{
                marginVertical: 20,
                borderRadius: 7.6,
                shadowOpacity: 0,
                height: 44,
                borderWidth: 1
              }}
              textStyle={{ color: theme.colors.primary, fontSize: 12 }}
              imgRightSrc={null}
              onClick={() => iframeCardForm.includes(gateway) ? setShowGateway((prev: any) => ({ ...prev, open: true })) : setAddCardOpen({ ...addCardOpen, card: true })}
            />
          )}
        <StripeCardsListUI
          navigation={navigation}
          scrollViewRef={scrollViewRef}
          paymethod={paymethod}
          cardSelected={cardSelected}
          deleteCard={deleteCard}
          deleteUserCard={deleteUserCard}
          deleteBusinessUserPaymethod={deleteBusinessUserPaymethod}
          onSelectCard={onSelectCard}
          handleCardClick={handleCardClick}
          cardsList={cardsList}
          noShowErrors
          gateway={gateway}
          paySelected={paySelected}
          paymethodV2Featured={paymethodV2Featured}
          hideAddCardButton
          onOpen={() => setAddCardOpen({ ...addCardOpen, stripe: true })}
          onCancel={() => setAddCardOpen({ ...addCardOpen, stripe: false })}
        />
        <OButton
          text={t('CLOSE', 'Close')}
          bgColor={theme.colors.white}
          borderColor={theme.colors.primary}
          style={{
            marginVertical: 20,
            borderRadius: 7.6,
            shadowOpacity: 0,
            height: 44,
            borderWidth: 1
          }}
          textStyle={{ color: theme.colors.primary, fontSize: 12 }}
          imgRightSrc={null}
          onClick={() => navigation.goBack()}
        />
      </>
      <Modal
        animationType="slide"
        visible={addCardOpen?.card}
        onDismiss={() => setAddCardOpen({ ...addCardOpen, card: false })}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{
            flex: 1,
          }}
        >
          <ScrollView>
            <TouchableOpacity onPress={() => setAddCardOpen({ ...addCardOpen, card: false })}>
              <OIcon
                src={theme.images.general.close}
                width={16}
                style={style.wrapperIcon}
              />
            </TouchableOpacity>
            <>
              <CreditCardInput
                onChange={onChangeCardForm}
                requiresName
              />
              {alertState?.content?.[0] && !cardsList?.loading && (
                <OText
                  color={theme?.colors?.error}
                  style={{
                    alignSelf: 'center'
                  }}
                  size={20}
                >
                  {alertState.content[0]}
                </OText>
              )}
              <OButton
                text={t('ADD_CARD', 'Add card')}
                isDisabled={!newCard || cardsList?.loading}
                isLoading={cardsList?.loading}
                onClick={() => handleAddNewCard()}
                style={{
                  margin: 20,
                  ...style.buttonStyle
                }}
              />
            </>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
      <OModal
        open={showGateway.open && iframeCardForm.includes(gateway)}
        onClose={() => setShowGateway({ closedByUser: false, open: false })}
        entireModal
        customClose
      >
        <View style={{ height: '100%', width: '100%' }}>
          <PaymentOptionsWebView
            navigation={navigation}
            isAvoidRerender
            title={gateway}
            onNavigationRedirect={onNavigationRedirect}
            uri={iframeCardForm.includes(gateway) ? (gateway === 'globalpay' ? globalPayIFrameUrl : cybersourceIFrameUrl) : globalPayIFrameUrl}
            additionalParams={{}}
            setShowGateway={setShowGateway}
            webviewPaymethod={paymethodSelectedInfo}
            createBusinessUserPaymethod={createBusinessUserPaymethod}
            callbackAfterCardAction={callbackAfterCardAction}
            businessId={businessId}
          />
        </View>
      </OModal>
      <Alert
        open={alertState?.open || false}
        title=''
        content={alertState.content}
        onClose={() => setAlertState({ open: false, content: [] })}
        onAccept={() => setAlertState({ open: false, content: [] })}
      />
    </View>
  )
}

export const PaymentOptionCard = (props: any) => {
  const paymentOptions = {
    ...props,
    UIComponent: PaymentOptionCardUI
  }
  return (
    <PaymentOptionStripe {...paymentOptions} />
  )
}

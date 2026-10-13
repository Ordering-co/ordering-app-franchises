import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useTheme } from 'styled-components/native';
import MIcon from 'react-native-vector-icons/MaterialIcons'

import { getIconCard } from '../../utils';
import { OSItem, OSItemContent, OSItemActions } from '../PaymentOptionStripe/styles';
import { CardListContainer, WrapperContent, ViewStyle } from './styles'

import {
  PaymentOptionStripe,
  useSession,
  useLanguage,
  useValidationFields,
  useOrder
} from '@components';
import {
  OAlert,
  OText,
  NotFoundSource,
  AnimatedItem,
  StripeElementsForm,
  OIcon,
  OButton
} from '@ui';
import { PlaceholderLine } from 'rn-placeholder';
import { Placeholder } from 'rn-placeholder';
import { Fade } from 'rn-placeholder';

const paymethodsWithoutStripeForm = ['credomatic', 'izipay', 'globalpay', 'hitpay', 'cybersource']

export const StripeCardsListUI = (props: any) => {
  const {
    navigation,
    paymethod,
    cardsList,
    businessId,
    paySelected,
    deleteCard,
    onSelectCard,
    handleCardClick,
    cardSelected,
    paymethodV2Featured,
    deleteUserCard,
    gateway,
    deleteBusinessUserPaymethod,
    hideAddCardButton
  } = props;

  const theme = useTheme()

  const [{ token }] = useSession();
  const [, t] = useLanguage();
  const [{ carts }] = useOrder()
  const [validationFields] = useValidationFields()
  const [openStripeForm, setOpenStripeForm] = useState(false)

  const cart = (businessId >= 0 && typeof businessId === 'number') ? carts?.[`businessId:${businessId}`] : carts?.['businessId:null']
  const validateZipcodeCard = validationFields?.fields?.card?.zipcode?.enabled && validationFields?.fields?.card?.zipcode?.required

  const handleCardSelected = (card: any) => {
    if (!card?.zipcode && validateZipcodeCard) return
    handleCardClick(card)
    onSelectCard(card)
    navigation && navigation.goBack()
  }

  const handleDeleteCard = (card: any) => {
    paymethodV2Featured
      ? ['izipay'].includes(gateway)
        ? deleteUserCard(card)
        : deleteBusinessUserPaymethod(card)
      : deleteCard(card)
  }

  useEffect(() => {
    if (cardSelected?.id && (cardSelected?.id === cart?.paymethod_data?.id)) {
      props.setReadyToSave && props.setReadyToSave(true)
    }
  }, [cardSelected?.id, cart?.paymethod_data?.id])

  useEffect(() => {
    if (props.scrollViewRef && !cardsList.loading) {
      props.scrollViewRef.current?.scrollToEnd?.({ animated: true })
    }
  }, [cardsList.loading])

  useEffect(() => {
    if (
      !cardsList?.loading &&
      cardsList?.cards?.length === 0 &&
      !paymethodsWithoutStripeForm.includes(gateway)
    ) {
      setOpenStripeForm(true)
    }
  }, [cardsList?.loading, cardsList?.cards?.length, gateway])

  const CardItem = ({ card }: any) => {
    return (
      <OSItem
        key={card.id}
        isUnique={cardsList.cards.length}
        isInvalid={!card?.zipcode && validateZipcodeCard}
      >
        <OSItemContent activeOpacity={1} onPress={() => handleCardSelected(card)}>
          <ViewStyle>
            <MIcon
              size={22}
              name={card.id === (cardSelected?.id ?? paySelected?.data?.id) ? 'radio-button-checked' : 'radio-button-off'}
              color={card.id === (cardSelected?.id ?? paySelected?.data?.id) ? theme.colors.primary : theme.colors.disabled}
            />
          </ViewStyle>
          <ViewStyle>
            {getIconCard(card.brand, 20)}
          </ViewStyle>
          <ViewStyle>
            <OText color={theme.colors.textNormal}>
              XXXX-XXXX-XXXX-{card.last4}
            </OText>
          </ViewStyle>
          {!card?.zipcode && validateZipcodeCard && (
            <ViewStyle>
              <OText size={10} color={theme?.colors?.danger5}>
                ({t('MISSING_ZIPCODE', 'Missing zipcode')})
              </OText>
            </ViewStyle>
          )}
        </OSItemContent>
        {(paymethodV2Featured?.includes('delete_cards') || !paymethodV2Featured) && (
          <OSItemActions>
            <OAlert
              title={t('CARD', 'Card')}
              message={t('QUESTION_DELETE_CARD', 'Are you sure that you want to delete the card?')}
              onAccept={() => handleDeleteCard(card)}
            >
              <OIcon
                src={theme.images.general.trash}
                width={16}
                color={theme.colors.disabled}
              />
            </OAlert>
          </OSItemActions>
        )}
      </OSItem>
    )
  }

  return (
    <>
      {openStripeForm && !paymethodsWithoutStripeForm.includes(gateway) && (
        <StripeElementsForm
          toSave
          businessId={businessId}
          merchantId={props.merchantId}
          urlscheme={props.urlscheme}
          publicKey={props.publicKey || paymethod?.credentials?.publishable}
          requirements={props.clientSecret}
          handleSource={props.handleSource}
          onSelectCard={(card: any) => {
            props.onSelectCard?.(card)
            props.handleNewCard?.(card)
          }}
          setMethodPaySupported={props.setMethodPaySupported}
          publicKeyAddCard={paymethod?.credentials?.stripe?.publishable || paymethod?.credentials?.publishable}
          onCancel={() => setOpenStripeForm(false)}
        />
      )}

      {token && !cardsList.loading && !openStripeForm && !hideAddCardButton && !paymethodsWithoutStripeForm.includes(gateway) && (
        <OButton
          text={t('ADD_PAYMENT_CARD', 'Add New Payment Card')}
          imgRightSrc={null}
          onClick={() => setOpenStripeForm(true)}
        />
      )}

      {token && cardsList.cards && cardsList.cards.length > 0 && !cardsList.loading && (
        <CardListContainer
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 60 }}
        >
          <OText
            color={theme.colors.textNormal}
            style={{ marginTop: 30 }}
          >
            {t('SELECT_A_CARD', 'Select a card')}
          </OText>
          {cardsList.cards.map((card: any, index: number) => (
            <View style={{ marginTop: 20 }} key={'prod_' + card.id + `_${index}`}>
              <AnimatedItem
                index={index}
                item={<CardItem card={card} />}
              />
            </View>
          ))}
        </CardListContainer>
      )}
      {cardsList.cards.length === 0 && cardsList.loading && (
        <View style={{ marginTop: 10 }}>
          {[...Array(2).keys()].map(i => (
            <View style={{ marginBottom: 10 }} key={i}>
              <Placeholder Animation={Fade}>
                <PlaceholderLine width={100} height={40} style={{ marginBottom: 0, borderRadius: 8 }} />
              </Placeholder>
            </View>
          ))}
        </View>
      )}
      {token && cardsList.error && cardsList.error.length > 0 && (
        <WrapperContent>
          <NotFoundSource
            simple
            content={cardsList?.error[0]?.message || cardsList?.error[0]}
          />
        </WrapperContent>
      )}
    </>
  )
}

export const StripeCardsList = (props: any) => {
  const stripeCardsListProps = {
    ...props,
    UIComponent: StripeCardsListUI
  }
  return (
    <PaymentOptionStripe {...stripeCardsListProps} />
  )
}

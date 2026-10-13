import React, { useState } from 'react';
import { View } from 'react-native';
import { useTheme } from 'styled-components/native';

import { VerticalGiftCardOrdersLayout } from '../VerticalGiftCardOrdersLayout'
import { Container } from './styles'

import { useLanguage } from '@components';
import { NotFoundSource } from '@ui'

export const GiftCardOrdersList = (props: any) => {
  const { onNavigationRedirect } = props

  const theme = useTheme();
  const [, t] = useLanguage();
  const [isEmptyPending, setIsEmptyPending] = useState(false);
  const [isEmptySent, setIsEmptySent] = useState(false);
  const [isEmptyRedeemed, setIsEmptyRedeemed] = useState(false);

  return (
    <Container>
      {isEmptyPending && isEmptySent && isEmptyRedeemed && (
        <NotFoundSource
          simple
          content={t('YOU_DONT_HAVE_CARDS', 'You don\'t have cards')}
        />
      )}
      <VerticalGiftCardOrdersLayout
        allowLoading
        title={t('PENDING', 'Pending')}
        defaultStatus='pending'
        setIsEmpty={setIsEmptyPending}
        onNavigationRedirect={onNavigationRedirect}
      />

      <VerticalGiftCardOrdersLayout
        title={t('SENT', 'Sent')}
        defaultStatus='sent'
        setIsEmpty={setIsEmptySent}
        onNavigationRedirect={onNavigationRedirect}
      />

      <VerticalGiftCardOrdersLayout
        title={t('REDEEMED', 'Redeemed')}
        defaultStatus='activated'
        setIsEmpty={setIsEmptyRedeemed}
        onNavigationRedirect={onNavigationRedirect}
      />
    </Container>
  )
}

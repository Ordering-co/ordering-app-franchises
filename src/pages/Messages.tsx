import React, { useState } from 'react'

import settings from '../config.js'
import { SafeAreaViewWrapper } from '../layouts/SafeAreaViewWrapper'
interface Props {
  navigation: any;
  route: any;
}
import { MessageListing, NavBar } from '@ui';
import { useLanguage } from '@components';

const Messages = (props: Props) => {
  const [, t] = useLanguage()
  const [refreshOrders, setRefreshOrders] = useState(false)

  const messagesProps = {
    ...props,
    franchiseId: settings?.franchiseSlug,
    goToBack: () => props.navigation?.canGoBack() && props.navigation.goBack(),
    onNavigationRedirect: (route: string, params: any) => props.navigation.navigate(route, params)
  }

  return (
    <>
      <NavBar
        title={t('MESSAGES', 'Messages')}
        onActionLeft={() => messagesProps.goToBack()}
      />
      <SafeAreaViewWrapper disableScrollView>
        <MessageListing
          {...messagesProps}
          refreshOrders={refreshOrders}
          setRefreshOrders={setRefreshOrders}
        />
      </SafeAreaViewWrapper>
    </>
  )
}

export default Messages

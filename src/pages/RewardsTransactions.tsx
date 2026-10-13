import React from 'react'

import { SafeAreaViewWrapper } from '../layouts/SafeAreaViewWrapper';
import { Transactions } from '../ui/src/components/Rewards/Transactions';
import { useLanguage } from '@components';
import { NavBar } from '@ui';

const RewardsTransactions = (props: any) => {
  const [, t] = useLanguage()

  const transactionsProps = {
    ...props,
    ...props.route.params,
    onBack: () => props.navigation?.canGoBack() && props.navigation.goBack(),
    onNavigationRedirect: (page: string, params: any) => {
      if (!page) return
      props.navigation.navigate(page, params)
    }
  }

  return (
    <>
      <NavBar
        title={t('TRANSACTION_LIST', 'Transaction List')}
        onActionLeft={() => transactionsProps.onBack()}
      />
      <SafeAreaViewWrapper>
        <Transactions {...transactionsProps} />
      </SafeAreaViewWrapper>
    </>
  );
}

export default RewardsTransactions;


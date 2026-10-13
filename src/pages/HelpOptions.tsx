import React from 'react';
import { SafeAreaViewWrapper } from '../layouts/SafeAreaViewWrapper'
import { HelpOptions as HelpOptionsPage, NavBar } from '@ui';
import { useLanguage } from '@components';

const HelpOptions = (props: any) => {
  const [, t] = useLanguage()
  const helpProps = {
    ...props,
    ...props.route?.params,
    goToBack: () => props.navigation?.canGoBack() && props.navigation.goBack()
  }
  return (
    <>
      <NavBar
        title={t('HELP', 'Help')}
        onActionLeft={() => helpProps.goToBack()}
      />
      <SafeAreaViewWrapper>
        <HelpOptionsPage {...helpProps} />
      </SafeAreaViewWrapper>
    </>
  );
};

export default HelpOptions;

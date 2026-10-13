import * as React from 'react';

import { SafeAreaViewWrapper } from '../layouts/SafeAreaViewWrapper'

import { useLanguage } from '@components';
import { NavBar, UpsellingProducts as Upselling } from '@ui';

interface Props {
  navigation: any;
  route: any;
}

const UpsellingPage = (props: Props) => {
  const [, t] = useLanguage()
  const upsellingProps = {
    ...props,
    ...props.route.params,
    onGoBack: props?.navigation?.canGoBack()
      ? () => props?.navigation?.goBack()
      : () => props?.navigation?.navigate('BottomTab'),
    onNavigationRedirect: (route: string, params: any) =>
      props.navigation.navigate(route, params),
  }

  return (
    <>
      <NavBar
        title={t('YOUR_ORDER', 'Your order')}
        onActionLeft={() => props?.navigation?.navigate('BottomTab', { screen: 'Business' })}
      />
      <SafeAreaViewWrapper disableScrollView>
        <Upselling {...upsellingProps} />
      </SafeAreaViewWrapper>
    </>
  );
};

export default UpsellingPage;

import React from 'react';

import { SafeAreaViewWrapper } from '../layouts/SafeAreaViewWrapper';
import { HomeView, NavBar } from '@ui';

import settings from '../config';

export const Home = (props: any) => {
  const homeProps = {
    ...props,
    onNavigationRedirect: (page: string, params: any) => {
      if (!page) return
      props.navigation.navigate(page, params)
    },
    useRootPoint: settings.use_root_point
  }

  return (
    <>
      <NavBar />
      <SafeAreaViewWrapper disableScrollView>
        <HomeView {...homeProps} />
      </SafeAreaViewWrapper>
    </>
  );
};

export default Home;

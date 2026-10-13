import React from 'react';

import { ForgotPasswordForm, NavBar } from '@ui';
import { SafeAreaViewWrapper } from '../layouts/SafeAreaViewWrapper'

export const ForgotPassword = (props: any) => {
  return (
    <>
      <NavBar
        title={props.titleNavbar}
        onActionLeft={props.onActionLeftNavbar}
      />
      <SafeAreaViewWrapper>
        <ForgotPasswordForm {...props} />
      </SafeAreaViewWrapper>
    </>
  );
};

export default ForgotPassword;

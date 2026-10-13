import React from 'react';
import { Platform } from 'react-native'
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NotificationsList as NotificationsController } from '@ui';

const SafeAreaContainer = styled(SafeAreaView)`
  flex: 1;
  background-color: ${(props: any) => props.theme.colors.backgroundPage};
`;

interface Props {
  navigation: any;
  route: any;
}

const NotificationsList = (props: Props) => {

  const notificationsProps = {
    ...props,
    useSessionUser: true,
    useValidationFields: true,
    refreshSessionUser: true,
    goToBack: () => props.navigation?.canGoBack() && props.navigation.goBack(),
    onNavigationRedirect: (route: string, params: any) =>
      props.navigation.navigate(route, params),
  };

  return (
    <SafeAreaContainer>
      <NotificationsController {...notificationsProps} />
    </SafeAreaContainer>
  )
};

export default NotificationsList;

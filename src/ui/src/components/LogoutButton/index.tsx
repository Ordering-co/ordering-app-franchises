import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useTheme } from 'styled-components/native';

import Intercom from '@intercom/intercom-react-native';
import { LogoutAction, useOrder } from '@components';
import { _retrieveStoreData, OIcon, OText } from '@ui';
import { logoutIntercom } from './logoutIntercom';

const LogoutButtonUI = (props: any) => {
  const { handleLogoutClick, text, color, iconSize } = props
  const theme = useTheme();

  const handleClick = async () => {
    const data = await _retrieveStoreData('notification_state');
    handleLogoutClick(data)
  };

  return (
    <TouchableOpacity
      onPress={() => handleClick()}
      style={{ flexDirection: 'row', alignItems: 'center' }}
    >
      <OIcon
        src={theme.images.general.logout}
        width={iconSize ?? 17}
        color={color ? color : theme.colors.textNormal}
        style={{ marginEnd: 14 }}
      />
      {text ? <OText weight={'500'} color={color ? color : theme.colors.textNormal}>{text}</OText> : null}
    </TouchableOpacity>
  )
}

export const LogoutButton = (props: any) => {
  const [, { setStateInitialValues }] = useOrder()
  const handleSuccessLogout = async () => {
    setStateInitialValues()
    await logoutIntercom(Intercom)
  }
  const logoutProps = {
    ...props,
    isNative: true,
    handleSuccessLogout,
    UIComponent: LogoutButtonUI
  }
  return (
    <LogoutAction {...logoutProps} />
  )
}

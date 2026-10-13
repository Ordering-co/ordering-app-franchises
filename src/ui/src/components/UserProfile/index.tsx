import React, { useEffect, useState } from 'react';
import { useWindowDimensions, StyleSheet, TouchableOpacity, View, ScrollView } from 'react-native';
import ToggleSwitch from 'toggle-switch-react-native';
import { useTheme } from 'styled-components/native';
import { useForm } from 'react-hook-form';
import Spinner from 'react-native-loading-spinner-overlay';
import AntDesingIcon from 'react-native-vector-icons/AntDesign'

import { ProfileParams } from '../../types';
import { Utils } from './utils'

import {
  CenterView,
  Actions,
  ListWrap,
  ListItem,
  NotificationsWrapper,
  NotificationBadge,
  HeaderWrapper,
  ListItemLeft
} from './styles'

import {
  UserFormDetails as UserProfileController,
  useSession,
  useLanguage,
  ToastType,
  useToast
} from '@components'

import {
  OAlertOriginal as OAlert,
  OText,
  LogoutButton,
  LanguageSelector,
  WebsocketStatus,
  PoweredBy
} from '@ui'

const ProfileListUI = (props: ProfileParams) => {
  const {
    appVersion,
    notificationsGroup,
    handleRemoveAccount,
    removeAccountState,
    handleChangePromotions,
    goToBack,
    onNavigationRedirect,
  } = props

  const theme = useTheme()
  const { ProfileOptions } = Utils()

  const hideProfile = theme?.profile?.components?.profile?.hidden
  const showLanguages = theme?.profile?.components?.languages?.hidden

  const langPickerStyle = StyleSheet.create({
    inputAndroid: {
      color: theme.colors.textNormal,
      fontSize: theme.utils.tsize.s,
      fontWeight: '500',
      paddingEnd: 24,
      paddingStart: 0,
      height: 40,
      borderWidth: 1,
      borderColor: theme.colors.clear,
      backgroundColor: theme.colors.clear
    },
    inputIOS: {
      color: theme.colors.textNormal,
      fontSize: theme.utils.tsize.s,
      fontWeight: '500',
      paddingEnd: 24,
      height: 40,
      borderWidth: 1,
      borderColor: theme.colors.clear,
      backgroundColor: theme.colors.clear
    },
    icon: {
      width: 12,
      marginTop: 7,
      marginEnd: 7
    }
  })

  const [{ user }, { logout }] = useSession();
  const [, t] = useLanguage();
  const [, { showToast }] = useToast();
  const { errors } = useForm();
  const { height } = useWindowDimensions();

  const [confirm, setConfirm] = useState<any>({ open: false, content: null, handleOnAccept: null, id: null, title: null })

  useEffect(() => {
    if (notificationsGroup.result.result && !notificationsGroup.loading) {
      if (!notificationsGroup.result?.error) {
        showToast(ToastType.Success, t('UPDATE_SUCCESSFULLY', 'Update successfully'));
      }
    }
  }, [notificationsGroup.result])

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const list = Object.values(errors);
      let stringError = '';
      list.map((item: any, i: number) => {
        stringError +=
          i + 1 === list.length ? `- ${item.message}` : `- ${item.message}\n`;
      });
      showToast(ToastType.Error, stringError);
    }
  }, [errors]);

  const detailProps = {
    goToBack,
    onNavigationRedirect,
    handleRemoveAccount,
  }

  useEffect(() => {
    if (removeAccountState?.result === 'OK') {
      logout()
    }
  }, [removeAccountState])

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <CenterView>
        <HeaderWrapper>
          <OText
            size={theme.utils.tsize.xxl}
            weight={'bold'}
            color={theme.colors.textNormal}
          >
            {user?.name} {user?.lastname}
          </OText>
          {!hideProfile && (
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => onNavigationRedirect('ProfileForm', { ...detailProps })}
            >
              <OText
                size={theme.utils.tsize.m}
                color={theme.colors.primary}
              >
                {t('VIEW_ACCOUNT', 'View account')}
              </OText>
            </TouchableOpacity>
          )}
        </HeaderWrapper>
      </CenterView>

      <Spinner visible={notificationsGroup?.loading} />

      <ListWrap>
        <Actions>
          {ProfileOptions.filter((o: any) => o.active).map((option: any, i: number) => (
            <ListItem
              key={i}
              activeOpacity={0.7}
              onPress={() => onNavigationRedirect(option.action.page, option.action?.params)}
            >
              {option?.special && <NotificationBadge style={{ borderRadius: 100 / 2 }} />}
              <ListItemLeft>
                {option.icon}
                <OText lineHeight={24} weight={'400'} color={theme.colors.textNormal}>
                  {option.text}
                </OText>
              </ListItemLeft>
              {option?.special ? (
                <NotificationsWrapper>
                  <ToggleSwitch
                    isOn={!!user && (!!user?.settings?.notification?.newsletter ||
                      !!user?.settings?.sms?.newsletter ||
                      !!user?.settings?.email?.newsletter)}
                    onColor={theme.colors.primary}
                    size="small"
                    disabled={notificationsGroup?.loading}
                    offColor={theme.colors.disabled}
                    animationSpeed={400}
                    onToggle={() => handleChangePromotions(!(user && (!!user?.settings?.notification?.newsletter ||
                      !!user?.settings?.sms?.newsletter ||
                      !!user?.settings?.email?.newsletter)))}
                  />
                </NotificationsWrapper>
              ) : (
                <AntDesingIcon name='right' style={{ fontSize: 16 }} color={theme?.colors?.textNormal} />
              )}
            </ListItem>
          ))}
          {!showLanguages && (
            <LanguageSelector iconColor={theme.colors.textNormal} pickerStyle={langPickerStyle} />
          )}
        </Actions>
        <Actions style={{ paddingTop: height * .02 }}>
          <View style={{ height: 20 }} />
          <LogoutButton color={theme.colors.primary} text={t('LOGOUT', 'Logout')} />
          <View style={{ height: 20 }} />
        </Actions>
      </ListWrap>
      <WebsocketStatus />
      <PoweredBy />
      {appVersion && (
        <View style={{ alignItems: 'center' }}>
          <OText>{`v${appVersion}`}</OText>
        </View>
      )}
      <OAlert
        open={confirm.open}
        title={confirm.title}
        content={confirm.content}
        onAccept={confirm.handleOnAccept}
        onCancel={() => setConfirm({ ...confirm, open: false, title: null })}
        onClose={() => setConfirm({ ...confirm, open: false, title: null })}
      />
    </ScrollView>
  );
};

export const UserProfile = (props: any) => {
  const profileProps = {
    ...props,
    UIComponent: ProfileListUI,
  };
  return <UserProfileController {...profileProps} />;
};

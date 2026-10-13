import React, { useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from 'styled-components/native'
import RNRestart from 'react-native-restart'

import {
  Container,
  ModalContainer,
  ModalTitle,
  StatusItemWrapper,
  StatusText
} from './styles'

import { OModal, OButton, OText } from '../shared'
import { useLanguage, useUtils, WebsocketStatus as WebsocketStatusController } from '@components'

const SocketStatusUI = (props: any) => {
  const {
    socketStatus,
    connectedDate
  } = props

  const theme = useTheme()
  const [, t] = useLanguage()
  const [{ parseDate }] = useUtils()
  const [openModal, setOpenModal] = useState(false)

  const getStatusColor = (status: number) => {
    switch (status) {
      case 0:
        return '#FF9922';
      case 1:
        return '#00D27A';
      case 2:
        return '#E63757';
      default:
        return '#FF9922';
    }
  }

  return (
    <Container>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.colors.inputChat,
          borderRadius: 7.6,
          marginVertical: 10,
          paddingVertical: 10,
          paddingHorizontal: 15,
          marginHorizontal: 15
        }}
        activeOpacity={0.6}
        onPress={() => setOpenModal(true)}
      >
        <OText
          style={{ color: theme.colors.backArrow, fontSize: 16, marginBottom: 0, lineHeight: 16 }}
        >
          {t('CONNECTION_STATUS', 'Status')}
        </OText>
        <MaterialIcon
          name='circle'
          size={12}
          color={getStatusColor(socketStatus)}
          style={{ marginLeft: 8 }}
        />
      </TouchableOpacity>

      <OModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        entireModal
      >
        <ModalContainer
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ alignItems: 'center' }}
        >
          <View>
            <ModalTitle>{t('CONNECTION_STATUS', 'Connection status')}</ModalTitle>
            <OText style={{ marginBottom: 20 }}>
              {t('LAST_UPDATE', 'Last update')}: {parseDate(connectedDate)}
            </OText>
            <StatusItemWrapper>
              <MaterialIcon
                name='circle'
                size={12}
                color={getStatusColor(1)}
                style={{ marginTop: 10, marginHorizontal: 8 }}
              />
              <View style={{ marginLeft: 16 }}>
                <StatusText>{t('OK', 'Ok')}</StatusText>
                <OText style={{ color: theme.colors.backArrow, fontSize: 14 }}>{t('WEBSOCKET_OK', 'The websocket works normally.')}</OText>
              </View>
            </StatusItemWrapper>
            <StatusItemWrapper>
              <MaterialIcon
                name='circle'
                size={12}
                color={getStatusColor(0)}
                style={{ marginTop: 10, marginHorizontal: 8 }}
              />
              <View style={{ marginLeft: 16 }}>
                <StatusText>{t('CONNECTING', 'Connecting')}</StatusText>
                <OText style={{ color: theme.colors.backArrow, fontSize: 14 }}>{t('WEBSOCKET_CONNECTING', 'The websocket is connecting.')}</OText>
              </View>
            </StatusItemWrapper>
            <StatusItemWrapper>
              <MaterialIcon
                name='circle'
                size={12}
                color={getStatusColor(2)}
                style={{ marginTop: 10, marginHorizontal: 8 }}
              />
              <View style={{ marginLeft: 16 }}>
                <StatusText>{t('DISCONNECTED', 'Disconnected')}</StatusText>
                <OText style={{ color: theme.colors.backArrow, fontSize: 14 }}>{t('WEBSOCKET_DISCONNECTED', 'The server is slow, please reload.')}</OText>
              </View>
            </StatusItemWrapper>

            <View style={{ flexDirection: 'row', marginTop: 50 }}>
              <OButton
                onClick={() => setOpenModal(false)}
                bgColor={theme.colors.white}
                textStyle={{ color: theme.colors.primary }}
                style={{ borderRadius: 8, height: 48 }}
                text={t('CLOSE', 'Close')}
              />
              <OButton
                onClick={() => RNRestart.Restart()}
                style={{ borderRadius: 8, marginLeft: 16, height: 48 }}
                text={t('UPDATE', 'Update')}
              />
            </View>
          </View>
        </ModalContainer>
      </OModal>
    </Container>
  )
}

export const WebsocketStatus = (props: any) => {
  const socketProps = {
    ...props,
    UIComponent: SocketStatusUI
  }
  return <WebsocketStatusController {...socketProps} />
}

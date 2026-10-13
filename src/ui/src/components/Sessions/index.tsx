import React, { useState } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { SessionsParams } from '../../types'
import { useTheme } from 'styled-components/native'
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder'
import AntIcon from 'react-native-vector-icons/AntDesign'

import {
  SessionsWrapper,
  SessionItem,
  Container,
  NoElementContainer
} from './styles'

import { useLanguage, useSession, useUtils, Sessions as SessionsController } from '@components'
import { OAlertOriginal as OAlert, OButton, OText } from '@ui'

export const SessionsUI = (props: SessionsParams) => {
  const {
    sessionsList,
    actionState,
    handleDeleteSession,
    handleDeleteAllSessions
  } = props

  const [, t] = useLanguage()
  const [{ user }] = useSession()
  const [{ parseDate }] = useUtils()
  const theme = useTheme()
  const [confirm, setConfirm] = useState<any>({ open: false, content: null, handleOnAccept: null, id: null, title: null })

  const onDeleteSession = (session: any) => {
    setConfirm({
      open: true,
      title: t('WEB_APPNAME', 'Ordering'),
      content: [t('QUESTION_DELETE_SESSION', 'Are you sure to delete this session?')],
      handleOnAccept: () => {
        handleDeleteSession(session)
        setConfirm({ ...confirm, open: false })
      }
    })
  }

  const onDeleteAllSessions = (isOldUser: any, deleteCurrent: any) => {
    setConfirm({
      open: true,
      title: t('WEB_APPNAME', 'Ordering'),
      content:
        isOldUser
          ? [t('QUESTION_ENABLE_ALL_SESSIONS', 'Are you sure to enable all sessions?')]
          : deleteCurrent
            ? [t('QUESTION_DELETE_ALL_SESSIONS', 'Are you sure that you want to delete all sessions?')]
            : [t('QUESTION_DELETE_ALL_SESSIONS_EXCEPT_CURRENT', 'Are you sure that you want to delete all sessions except current?')],
      handleOnAccept: () => {
        handleDeleteAllSessions(deleteCurrent)
        setConfirm({ ...confirm, open: false })
      }
    })
  }

  return (
    <Container showsVerticalScrollIndicator={false}>
      {user?.session_strategy === 'jwt_session' ? (
        <>
          {sessionsList.loading && (
            [...Array(7).keys()].map(i => (
              <SessionItem key={i}>
                <Placeholder Animation={Fade}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                      <PlaceholderLine width={40} />
                      <PlaceholderLine width={40} />
                    </View>
                    <PlaceholderLine width={10} />
                  </View>
                </Placeholder>
              </SessionItem>
            ))
          )}

          {!sessionsList.loading && sessionsList.sessions.length > 0 && (
            <SessionsWrapper>
              {sessionsList.sessions.map((session: any) => (
                <SessionItem key={session.id}>
                  <View>
                    <OText>{parseDate(session.created_at)}</OText>
                    <OText>{parseDate(session.valid_thru)}</OText>
                  </View>
                  {session.current && (
                    <OText mLeft={15} style={{ flex: 1 }}>({t('CURRENT', 'Current')})</OText>
                  )}
                  <TouchableOpacity
                    onPress={() => onDeleteSession(session)}
                  >
                    <AntIcon name='close' size={16} color={theme.colors.red} />
                  </TouchableOpacity>
                </SessionItem>
              ))}
              <OButton
                text={t('DELETE_ALL_SESSIONS', 'Delete all sessions')}
                isDisabled={actionState.loading}
                textStyle={{ fontSize: 14 }}
                style={{ marginTop: 20 }}
                onClick={() => onDeleteAllSessions(false, true)}
              />
              <TouchableOpacity
                activeOpacity={1}
                disabled={actionState.loading}
                style={{ marginTop: 20 }}
                onPress={() => onDeleteAllSessions(false, false)}
              >
                <OText
                  color={theme.colors.primary}
                  style={{ textAlign: 'center' }}
                >
                  {t('DELETE_ALL_SESSIONS_EXCEPT_CURRENT', 'Delete all sessions except current')}
                </OText>
              </TouchableOpacity>
            </SessionsWrapper>
          )}

          {!sessionsList.loading && sessionsList.sessions.length === 0 && (
            <NoElementContainer>
              <OText color={theme.colors.disabled} style={{ textAlign: 'center', padding: 20 }}>
                {t('YOU_DONT_HAVE_ANY_SESSIONS', 'You don\'t have any sessions')}
              </OText>
            </NoElementContainer>
          )}
        </>
      ) : (
        <SessionsWrapper>
          <OText>
            {t('YOU_DONT_HAVE_ENABLED_THE_SESSIONS', 'You don\'t have enabled the sessions, please active them to have a better control of your sessions.')}
          </OText>
          <OButton
            text={t('ACTIVE_SESSIONS', 'Active sessions')}
            isDisabled={actionState.loading}
            textStyle={{ fontSize: 14 }}
            onClick={() => onDeleteAllSessions(true, false)}
            style={{ marginTop: 20 }}
          />
        </SessionsWrapper>
      )}
      <OAlert
        open={confirm.open}
        title={confirm.title}
        content={confirm.content}
        onAccept={confirm.handleOnAccept}
        onCancel={() => setConfirm({ ...confirm, open: false, title: null })}
        onClose={() => setConfirm({ ...confirm, open: false, title: null })}
      />
    </Container>
  )
}

export const Sessions = (props: SessionsParams) => {
  const sessionsProps = {
    ...props,
    UIComponent: SessionsUI
  }
  return <SessionsController {...sessionsProps} />
}

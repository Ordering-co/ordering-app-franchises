import React, { useEffect, useState } from 'react'
import { BackHandler, Platform } from 'react-native'

import { OrderDetails as MessageViewController, useLanguage } from '@components'
import { Messages, NavBar, USER_TYPE } from '@ui'
import { SafeAreaViewWrapper } from '../layouts/SafeAreaViewWrapper'

const OrderMessageUI = (props: any) => {
  const {
    navigation,
    messages,
    setMessages,
    readMessages,
    messagesReadList
  } = props

  const [, t] = useLanguage()

  const [openModalForBusiness, setOpenModalForBusiness] = useState(false)
  const [openModalForDriver, setOpenModalForDriver] = useState(false)
  const [openMessages, setOpenMessages] = useState({ business: false, driver: false })
  const [unreadAlert, setUnreadAlert] = useState({
    business: false,
    driver: false,
  })
  const { order } = props.order;
  const handleArrowBack: any = () => navigation.navigate('BottomTab')

  const handleClose = () => {
    props.goToBack && props.goToBack()
  }

  const handleOpenMessages = (data: any) => {
    setOpenMessages(data)
    readMessages && readMessages();
  }

  useEffect(() => {
    if (messagesReadList?.length) {
      openModalForBusiness
        ? setUnreadAlert({ ...unreadAlert, business: false })
        : setUnreadAlert({ ...unreadAlert, driver: false });
    }
  }, [messagesReadList]);

  useEffect(() => {
    setOpenModalForBusiness(true);
    setOpenModalForDriver(true);
    readMessages && readMessages();
  }, [order])

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleArrowBack)
    return () => {
      backHandler.remove()
    }
  }, []);

  useEffect(() => {
    handleOpenMessages({ driver: false, business: true })
  }, [])

  return (
    <>
      <NavBar
        title={props.type === USER_TYPE.DRIVER ? order?.driver?.name : order?.business?.name}
        subtitle={props.type === USER_TYPE.DRIVER ? t('DRIVER', 'Driver') : t('BUSINESS', 'Business')}
        onActionLeft={() => handleClose()}
      />
      <SafeAreaViewWrapper disableScrollView behavior={Platform.OS === 'ios' ? 'padding' : null}>
        <Messages
          orderId={order?.id}
          messages={messages}
          order={order}
          setMessages={setMessages}
          readMessages={readMessages}
          business={openMessages.business}
          driver={openMessages.driver}
          onMessages={setOpenMessages}
          isMeesageListing
          onClose={() => handleClose()}
        />
      </SafeAreaViewWrapper>
    </>
  )
}

const MessageView = (props: any) => {
  const orderDetailsProps = {
    ...props,
    UIComponent: OrderMessageUI,
    disabledLeaveOrderSocket: true,
    goToBack: () => props.navigation?.canGoBack() && props.navigation.goBack(),
    order: props.route?.params?.order,
    orderId: props.route?.params?.orderId,
    type: props.route?.params?.type,
    messages: props.route?.params?.messages,
    business: props.route?.params?.business,
    driver: props.route?.params?.driver,
    setMessages: props.route?.params?.setMessages,
    onClose: props.route?.params?.onClose
  }

  return <MessageViewController {...orderDetailsProps} />
}

export default MessageView

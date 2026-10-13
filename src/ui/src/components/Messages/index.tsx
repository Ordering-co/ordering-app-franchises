import React, { useEffect, useState } from 'react'
import { TouchableOpacity, ActivityIndicator, StyleSheet, View, Platform, Keyboard } from 'react-native'
import Clipboard from '@react-native-clipboard/clipboard';
import { useTheme } from 'styled-components/native';
import { launchImageLibrary } from 'react-native-image-picker'
import { GiftedChat, Actions, InputToolbar, Composer, Send, Bubble, MessageImage, ComposerProps } from 'react-native-gifted-chat'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'

import 'dayjs/locale/es';

import { USER_TYPE } from '../../config/constants'
import { MessagesParams } from '../../types'
import { getLogisticTag, chatLanguagesAvailable } from '../../utils'

import { Container, QuickMessageContainer } from './styles'

import {
  Messages as MessagesController,
  useSession,
  useUtils,
  useLanguage,
  ToastType,
  useToast
} from '@components'

import { OIconButton, OText, OButton, ORDER_STATUS } from '@ui'

const filterSpecialStatus = ['prepared_in', 'delivered_in', 'delivery_datetime']

const MessagesUI = (props: MessagesParams) => {
  const {
    type,
    order,
    messages,
    image,
    message,
    sendMessage,
    setCanRead,
    setMessage,
    handleSend,
    setImage,
    readMessages,
    business,
    driver
  } = props

  const theme = useTheme()
  const [{ user }] = useSession()
  const [{ parseDate }] = useUtils()
  const [languageState, t] = useLanguage()
  const [, { showToast }] = useToast()

  const [formattedMessages, setFormattedMessages] = useState<Array<any>>([])
  const [isKeyboardShow, setIsKeyboardShow] = useState(false)
  const previousStatus = [1, 2, 5, 6, 10, 11, 12, 15, 16, 17]
  const chatDisabled = previousStatus.includes(order?.status)

  const quickMessageList = [
    { key: 'customer_message_1', text: t('CUSTOMER_MESSAGE_1', 'Lorem ipsum 1') },
    { key: 'customer_message_2', text: t('CUSTOMER_MESSAGE_2', 'Lorem ipsum 2') },
    { key: 'customer_message_3', text: t('CUSTOMER_MESSAGE_3', 'Lorem ipsum 3') },
    { key: 'customer_message_4', text: t('CUSTOMER_MESSAGE_4', 'Lorem ipsum 4') }
  ]

  const handleClickQuickMessage = (text: string) => {
    setMessage && setMessage(`${message}${text}`)
  }

  const onChangeMessage = (val: string) => {
    setMessage && setMessage(val)
  }

  const removeImage = () => {
    setImage && setImage(null)
  }

  const handleImagePicker = () => {
    launchImageLibrary({ mediaType: 'photo', maxHeight: 2048, maxWidth: 2048, includeBase64: true }, (response: any) => {
      if (response?.didCancel) {
        return
      } else if (response?.errorMessage) {
        showToast(ToastType.Error, response.errorMessage);
      } else {
        if (response?.assets?.length > 0) {
          const image = response?.assets[0]
          const url = `data:${image.type};base64,${image.base64}`
          setImage && setImage(url);
        } else {
          showToast(ToastType.Error, t('IMAGE_NOT_FOUND', 'Image not found'));
        }
      }
    });
  };

  const onSubmit = (values: any) => {
    handleSend && handleSend()
    setImage && setImage(null)
    setMessage && setMessage('')
  }

  const messageConsole = (message: any) => {
    return message.change?.attribute !== 'driver_id'
      ?
      `${t('ORDER', 'Order')} ${t(message.change.attribute.toUpperCase(), message.change.attribute.replace(/_/g, ' '))} ${t('CHANGED_FROM', 'Changed from')} ${filterSpecialStatus.includes(message.change.attribute)
        ? `${message.change.old === null ? '0' : message.change.old} ${t('TO', 'to')} ${message.change.new} ${t('MINUTES', 'Minutes')}`
        : `${message.change?.attribute !== 'logistic_status'
          ? (ORDER_STATUS[parseInt(message.change.old, 10)] ? t(ORDER_STATUS[parseInt(message.change.old, 10)]) : message.change.old)
          : getLogisticTag(message.change.old, t)} ${t('TO', 'to')} ${message.change?.attribute !== 'logistic_status'
            ? ORDER_STATUS[parseInt(message.change.new, 10)] ? t(ORDER_STATUS[parseInt(message.change.new, 10)]) : message.change.new
            : getLogisticTag(message.change.new, t)}`
      }`
      : message.change.new
        ?
        `${message.driver?.name} ${message.driver?.lastname !== null ? message.driver.lastname : ''} ${t('WAS_ASSIGNED_AS_DRIVER', 'Was assigned as driver')} ${message.comment ? message.comment.length : ''}`
        :
        `${t('DRIVER_UNASSIGNED', 'Driver unassigned')}`
  }

  const RenderActions = (props: any) => {
    return (
      <Actions
        {...props}
        options={{ 'Send Image': () => handleImagePicker() }}
        containerStyle={styles.containerActions}
        icon={() => (
          <>
            <OIconButton
              borderColor={theme.colors.white}
              style={{ width: 32, height: 44, borderRadius: 10, backgroundColor: theme.colors.clear, borderColor: theme.colors.clear }}
              icon={image ? { uri: image } : theme.images.general.image}
              iconStyle={{ borderRadius: image ? 10 : 0, width: image ? 32 : 16, height: image ? 32 : 16 }}
              onClick={handleImagePicker}
              iconCover
            />
            {image && (
              <TouchableOpacity
                style={{ position: 'absolute', top: -5, right: -5, borderColor: theme.colors.backgroundDark, backgroundColor: theme.colors.white, borderRadius: 25 }}
                onPress={removeImage}
              >
                <MaterialCommunityIcon name='close-circle-outline' color={theme.colors.backgroundDark} size={24} />
              </TouchableOpacity>
            )}
          </>
        )}
      />
    )
  }

  const renderAccessory = () => {
    return (
      !chatDisabled &&
      <QuickMessageContainer
        horizontal
        scrollEventThrottle={16}
        contentContainerStyle={{ alignItems: 'center' }}
        showsHorizontalScrollIndicator={false}
      >
        {quickMessageList.map((quickMessage, i) => (
          <OButton
            key={i}
            text={quickMessage.text}
            bgColor={theme.colors.backgroundGray100}
            borderColor={theme.colors.backgroundGray100}
            imgRightSrc={null}
            textStyle={{
              fontSize: theme.utils.tsize.s,
              color: theme.colors.textNormal,
              fontWeight: '400'
            }}
            style={styles.editButton}
            onClick={() => handleClickQuickMessage(quickMessage.text)}
          />
        ))}
      </QuickMessageContainer>
    )
  }

  const renderInputToolbar = (props: any) => (
    <InputToolbar
      {...props}
      containerStyle={{
        padding: Platform.OS === 'ios' && isKeyboardShow ? 0 : 10,
        flexDirection: 'column-reverse'
      }}
      primaryStyle={{ alignItems: 'center', justifyContent: 'flex-start' }}
      {...(!chatDisabled ? { renderAccessory: () => renderAccessory() } : {})}
    />
  )

  const renderComposer = (props: ComposerProps) => (
    chatDisabled ? (
      <View
        style={{
          width: '100%',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <MaterialCommunityIcon
          name='close-octagon-outline'
          size={24}
          color={theme?.colors?.textNormal}
        />
        <OText
          size={14}
          style={{ textAlign: 'center' }}
        >
          {t('NOT_SEND_MESSAGES', 'You can\'t send messages because the order has ended')}
        </OText>
      </View>
    ) : (
      <View
        style={{
          width: '80%',
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: theme.colors.backgroundGray100,
          borderRadius: theme.utils.radius.l,
        }}
      >
        <Composer
          {...props}
          textInputStyle={{
            height: 32,
            minHeight: 32,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 10,
            color: theme.colors.textNormal,
          }}
          textInputProps={{
            value: message,
            onSubmitEditing: onSubmit,
            returnKeyType: message ? 'send' : 'done',
            blurOnSubmit: true,
            multiline: false,
            numberOfLines: 1,
            autoCorrect: false,
            enablesReturnKeyAutomatically: false
          }}
          placeholder={t('WRITE_MESSAGE', 'Write message...')}
        />
        <RenderActions {...props} />
      </View>
    )
  )

  const renderSend = (props: any) => {
    const isDisabled = (sendMessage?.loading || (message === '' && !image) || messages?.loading)
    return (
      <Send
        {...props}
        alwaysShowSend
        disabled={isDisabled}
        containerStyle={styles.containerSend}
      >
        <OIconButton
          onClick={onSubmit}
          style={{
            height: 44,
            width: 44,
            borderRadius: 50,
            opacity: isDisabled ? 0.2 : 1,
            borderColor: isDisabled ? theme.colors.secondary : theme.colors.primary,
            backgroundColor: isDisabled ? theme.colors.secondary : theme.colors.primary,
          }}
          icon={theme.images.general.send}
          iconColor={isDisabled ? '#000' : '#fff'}
          disabled={isDisabled}
          disabledColor={theme.colors.secondary}
        />
      </Send>
    )
  }

  const renderBubble = (props: any) => (
    <Bubble
      {...props}
      textStyle={{
        left: {},
        right: { color: theme.colors.white }
      }}
      containerStyle={{
        left: { marginVertical: 5, borderBottomRightRadius: theme.utils.radius.l },
        right: { marginVertical: 5, borderBottomRightRadius: theme.utils.radius.l }
      }}
      wrapperStyle={{
        left: { backgroundColor: theme.colors.inputDisabled, padding: 5, borderBottomLeftRadius: 0 },
        right: { backgroundColor: theme.colors.primary, padding: 5, borderBottomRightRadius: 0 }
      }}
    />
  )

  const renderMessageImage = (props: any) => <MessageImage {...props} />

  const renderScrollToBottomComponent = () => <MaterialCommunityIcon name='chevron-double-down' size={32} color={theme?.colors?.textNormal} />

  const onLongPress = (context: any, message: any) => {
    const options = [
      t('COPY_TEXT', 'Copy text'),
      t('CANCEL', 'Cancel'),
    ];
    const cancelButtonIndex = options.length - 1;
    context.actionSheet().showActionSheetWithOptions({
      options,
      cancelButtonIndex
    }, (buttonIndex: any) => buttonIndex === 0 && Clipboard.setString(message.text)
    )
  }

  useEffect(() => {
    const allowedAttributes = ['logistic_status', 'driver_id', 'status']
    const newMessages: Array<any> = []
    const _console = `${t('ORDER_PLACED_FOR', 'Order placed for')} ${parseDate(order?.created_at)} ${t('VIA', 'Via')} ${order?.app_id ? t(order?.app_id.toUpperCase(), order?.app_id) : t('OTHER', 'Other')}`
    const firstMessage = {
      _id: 0,
      type: 0,
      text: _console,
      createdAt: parseDate(order?.created_at, { outputFormat: 'YYYY-MM-DD HH:mm:ss' }),
      system: true
    }
    messages.messages.map((message: any) => {
      if (!(allowedAttributes.includes(message.change?.attribute) || message.type === 0)) return
      if (business && message.type !== 0 && (props?.messagesToShow?.messages?.length || message?.can_see?.includes('2'))) {
        newMessages.push({
          _id: message?.id,
          text: message.type === 1 ? messageConsole(message) : message.comment,
          createdAt: message.type !== 0 && parseDate(message?.created_at, { outputFormat: 'YYYY-MM-DD HH:mm:ss' }),
          image: message.source,
          type: message.type,
          system: message.type === 1,
          user: {
            _id: message.author && message.author.id,
            name: message.author && message.author.name,
            avatar: message.author && (message.author.id !== user.id && type === USER_TYPE.DRIVER ? order?.driver?.photo : order?.business?.logo)
          }
        });
      }

      if (driver && message.type !== 0 && (props?.messagesToShow?.messages?.length || message?.can_see?.includes('4'))) {
        newMessages.push({
          _id: message?.id,
          text: message.type === 1 ? messageConsole(message) : message.comment,
          createdAt: message.type !== 0 && parseDate(message?.created_at, { outputFormat: 'YYYY-MM-DD HH:mm:ss' }),
          image: message.source,
          type: message.type,
          system: message.type === 1,
          user: {
            _id: message.author && message.author.id,
            name: message.author && message.author.name,
            avatar: message.author && (message.author.id !== user.id && type === USER_TYPE.DRIVER ? order?.driver?.photo : order?.business?.logo)
          }
        });
      }

      if (message.type === 0) {
        newMessages.push(firstMessage);
      }
    })
    let _arrayMessages = [...newMessages.reverse()]

    setFormattedMessages(_arrayMessages);
  }, [messages.messages.length, business, driver])

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardShow(true)
    })
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardShow(false)
    })
    const keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', () => {
      setIsKeyboardShow(false)
    })
    return () => {
      keyboardDidShowListener.remove()
      keyboardDidHideListener.remove()
      keyboardWillHideListener.remove()
    }
  }, [])

  useEffect(() => {
    if (business) setCanRead({ business: true, administrator: true, customer: true, driver: false })
    else if (driver) setCanRead({ business: false, administrator: true, customer: true, driver: true })
  }, [business, driver])

  useEffect(() => {
    if (!order?.id || messages?.loading) return
    readMessages && readMessages()
  }, [order?.id, messages?.loading])

  return (
    <Container>
      <GiftedChat
        alignTop
        scrollToBottom
        locale={chatLanguagesAvailable(languageState?.language?.code)}
        renderAvatarOnTop
        renderUsernameOnMessage
        messages={formattedMessages}
        keyboardShouldPersistTaps='handled'
        user={{ _id: user.id, name: user.name, avatar: user.photo }}
        onLongPress={(context: any, message: any) => onLongPress(context, message)}
        isLoadingEarlier={messages.loading}
        renderInputToolbar={renderInputToolbar}
        renderComposer={renderComposer}
        renderSend={renderSend}
        renderBubble={renderBubble}
        renderMessageImage={renderMessageImage}
        scrollToBottomStyle={{ right: 20, bottom: 50, borderWidth: 1, borderColor: theme.colors.border }}
        listViewProps={{
          showsVerticalScrollIndicator: false,
          contentContainerStyle: {
            paddingTop: 60,
            paddingBottom: 0,
            paddingHorizontal: theme.utils.margins.horizontal
          }
        }}
        renderAvatar={() => null}
        scrollToBottomComponent={() => renderScrollToBottomComponent()}
        onInputTextChanged={onChangeMessage}
        onSend={onSubmit}
        renderLoading={() => <ActivityIndicator size="small" color="#000" />}
      />
    </Container>
  )
}

const styles = StyleSheet.create({
  containerActions: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
  },
  containerSend: {
    width: 64,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4
  },
  editButton: {
    borderRadius: 10,
    marginRight: 10,
    height: 30,
    paddingLeft: 0,
    paddingRight: 0
  },
  typeWraper: {
    flexDirection: 'row',
    height: 45,
    alignItems: 'center'
  },
  btnBackArrow: {
    borderWidth: 0,
    backgroundColor: '#FFF',
    borderColor: '#FFF',
    shadowOpacity: 0,
    height: 48
  }
})

export const Messages = (props: MessagesParams) => {
  const [allMessages, setAllMessages] = useState(props.messages)

  useEffect(() => {
    setAllMessages(props.messages)
  }, [props.messages])

  const MessagesProps = {
    ...props,
    UIComponent: MessagesUI,
    messages: allMessages,
    setMessages: (values: any) => {
      props.setMessages && props.setMessages(values)
      setAllMessages(values)
    }
  }
  return <MessagesController {...MessagesProps} />
}

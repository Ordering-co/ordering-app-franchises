import { StyleSheet } from 'react-native'
import { useTheme } from 'styled-components/native'
import MessageCircle from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'

import { useLanguage } from '@components'
import { OIcon } from '@ui'

export const Utils = () => {
  const theme = useTheme()
  const [, t] = useLanguage()

  const hideMessages = theme?.bar_menu?.components?.messages?.hidden
  const hideHelp = theme?.bar_menu?.components?.help?.hidden
  const hideSession = theme?.bar_menu?.components?.sessions?.hidden
  const showNotifications = !theme?.profile?.components?.notification_settings?.hidden

  const styles = StyleSheet.create({
    messageIconStyle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginEnd: 14
    }
  })

  const ProfileOptions = [
    {
      active: true,
      icon: <OIcon src={theme.images.general.pin} width={16} color={theme.colors.textNormal} style={{ marginEnd: 14 }} />,
      text: t('MY_SAVED_PLACES', 'My saved places'),
      action: { page: 'AddressList', params: { disableContinue: true } }
    },
    {
      active: true,
      icon: <OIcon src={theme.images.general.tag_heart} width={16} color={theme.colors.textNormal} style={{ marginEnd: 14 }} />,
      text: t('MY_FAVORITES', 'My Favorites'),
      action: { page: 'Favorite' }
    },
    {
      active: true,
      icon: <OIcon src={theme.images.general.tag_orders} width={16} color={theme.colors.textNormal} style={{ marginEnd: 14 }} />,
      text: t('MY_ORDERS', 'My Orders'),
      action: { page: 'MyOrders' }
    },
    {
      active: !hideMessages,
      text: t('MESSAGES', 'Messages'),
      icon: <MessageCircle name='message1' style={styles.messageIconStyle} color={theme.colors.textNormal} />,
      action: { page: 'Messages', params: { isFromProfile: true, isGoBack: true } }
    },
    {
      active: showNotifications,
      special: true,
      text: t('MARKETING_NOTIFICATIONS', 'Marketing notifications'),
      icon: <Ionicons name='notifications-outline' style={styles.messageIconStyle} color={theme.colors.textNormal} />,
      action: { page: 'Notifications', params: { isFromProfile: true, isGoBack: true } }
    },
    {
      active: !hideSession,
      text: t('SECURITY', 'Security'),
      icon: <Ionicons name='list-outline' style={styles.messageIconStyle} color={theme.colors.textNormal} />,
      action: { page: 'Sessions' }
    },
    {
      active: !hideHelp,
      text: t('HELP', 'Help'),
      icon: <OIcon src={theme.images.general.ic_help} width={16} color={theme.colors.textNormal} style={{ marginEnd: 14 }} />,
      action: { page: 'Help' }
    },
  ]

  return {
    ProfileOptions
  }
}

import React from 'react'
import { Modal, TouchableWithoutFeedback, TouchableOpacity, Dimensions, StyleSheet, View, Text } from 'react-native'
import OIcon from './OIcon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  open: boolean;
  transparent?: boolean;
  title?: string;
  subtitle?: string;
  children?: any;
  onClose?: any;
  isStatusBar?: boolean;
  bottomContainerStyle?: any;
  containerStyle?: any;
  titleStyle?: any;
  subtitleStyle?: any;
  closeIcon?: any;
  titleComponent?: any;
  presentationStyle?: "fullScreen" | "pageSheet" | "formSheet" | "overFullScreen" | undefined
}
const OBottomPopup = (props: Props) => {
  const {
    open,
    transparent,
    title,
    onClose,
    children,
    titleStyle,
    titleComponent,
    bottomContainerStyle,
    closeIcon,
    presentationStyle,
    subtitle,
    subtitleStyle
  } = props

  const insets = useSafeAreaInsets()

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000000AA',
      justifyContent: 'flex-end'
    },
    touchableOutsideStyle: {
      flex: 1,
      width: '100%'
    },
    bottomContainer: {
      backgroundColor: '#ffffff',
      width: '100%',
      paddingHorizontal: 0,
      paddingBottom: insets.bottom
    },
    titleStyle: {
      fontSize: 20,
      fontWeight: 'bold'
    },
    closeIconStyle: {
      position: 'absolute',
      left: 25,
      top: 25,
      zIndex: 100
    },
    modalTitleStyle: {
      position: 'relative',
      paddingHorizontal: 10,
      paddingVertical: 20
    },
    subtitleStyle: {
      color: '#909BA9',
      fontSize: 14,
      fontWeight: '400'
    }
  })

  return (
    <Modal
      animationType='fade'
      transparent={transparent}
      visible={open}
      onRequestClose={() => onClose()}
      presentationStyle={presentationStyle || 'fullScreen'}
    >
      <View style={styles.container}>
        <TouchableWithoutFeedback
          style={styles.touchableOutsideStyle}
          onPress={() => onClose()}
        >
          <View style={styles.touchableOutsideStyle} />
        </TouchableWithoutFeedback>
        <View style={{ ...styles.bottomContainer, ...bottomContainerStyle }}>
          <View style={{ paddingTop: 20, paddingBottom: 20 }}>
            <View style={styles.modalTitleStyle}>
              {!!closeIcon && (
                <TouchableOpacity onPress={() => onClose()} style={styles.closeIconStyle}>
                  <OIcon
                    src={closeIcon}
                    width={20}
                    height={20}
                  />
                </TouchableOpacity>
              )}
              {titleComponent}
              {!!title && (
                <Text style={{ ...styles.titleStyle, ...titleStyle }}>
                  {title}
                </Text>
              )}
              {!!subtitle && (
                <Text style={{ ...styles.subtitleStyle, ...subtitleStyle }}>
                  {subtitle}
                </Text>
              )}
            </View>
            {children}
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default OBottomPopup

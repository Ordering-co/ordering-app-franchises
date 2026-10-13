import React from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native'
import { useTheme } from 'styled-components/native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

export const SafeAreaViewWrapper = (props: any) => {
  const theme = useTheme()
  const insets = useSafeAreaInsets()

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.backgroundPage,
      paddingTop: props.pt ? insets.top : 0,
      paddingBottom: props.pb ? insets.bottom : 0
    }
  })

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.backgroundPage }} edges={['left', 'right']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        enabled={!props.disableKeyboardAvoiding}
        behavior={props.behavior !== null ? Platform.OS === 'ios' ? 'padding' : 'height' : undefined}
        keyboardVerticalOffset={70}
      >
        {props.disableScrollView ? (
          <View style={[styles.container, { flex: 1 }]}>
            {props.children}
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              backgroundColor: theme.colors.backgroundPage,
              paddingTop: props.pt ? insets.top : 0,
              paddingBottom: props.pb ? insets.bottom : 0
            }}
          >
            {props.children}
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

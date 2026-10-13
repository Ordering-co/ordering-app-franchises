import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder'
import { useTheme } from 'styled-components/native';

const styles = StyleSheet.create({
  skeleton: {
    marginBottom: 10,
    borderRadius: 5
  }
})

export const Skeletons = () => {
  const theme = useTheme()

  const Header = ({ children }: any) => {
    return (
      <Placeholder
        Animation={Fade}
        style={{
          marginBottom: 20,
          borderWidth: .5,
          borderRadius: 10,
          padding: 10,
          borderColor: theme.colors.border
        }}
      >
        <View style={{ width: '100%' }}>
          {children}
        </View>
      </Placeholder>
    )
  }

  const BusinessSkeleton = () => {
    return (
      <Header>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <PlaceholderLine height={20} width={45} style={styles.skeleton} />
          <PlaceholderLine height={20} width={10} style={styles.skeleton} />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <PlaceholderLine height={40} width={60} style={styles.skeleton} />
          <PlaceholderLine height={25} width={30} style={styles.skeleton} />
        </View>
        <PlaceholderLine height={20} width={40} style={{ ...styles.skeleton, marginBottom: 0 }} />
      </Header>
    )
  }

  const ProductSkeleton = () => {
    return (
      <Header>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1 }}>
            <PlaceholderLine height={20} width={45} style={styles.skeleton} />
            <PlaceholderLine height={40} width={80} style={styles.skeleton} />
            <PlaceholderLine height={20} width={20} style={{ ...styles.skeleton, marginBottom: 0 }} />
          </View>
          <PlaceholderLine height={90} width={30} style={styles.skeleton} />
        </View>
      </Header>
    )
  }

  const OrderSkeleton = () => {
    return (
      <Header>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1 }}>
            <PlaceholderLine height={20} width={45} style={styles.skeleton} />
            <PlaceholderLine height={40} width={80} style={styles.skeleton} />
          </View>
          <PlaceholderLine height={20} width={15} style={[styles.skeleton, { marginRight: 10 }]} />
          <PlaceholderLine height={20} width={15} style={styles.skeleton} />
        </View>
      </Header>
    )
  }

  return {
    BusinessSkeleton,
    ProductSkeleton,
    OrderSkeleton
  }
}

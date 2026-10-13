import React from 'react'
import { render, RenderOptions } from '@testing-library/react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ThemeProvider } from 'styled-components/native'
import theme from '../../src/theme.json'

const defaultThemeUtils = {
  tsize: { xxxl: 36, xxl: 30, xl: 25, l: 20, m: 16, s: 14, xs: 12 },
  radius: { l: 10, m: 5 },
  margins: { horizontal: 20 },
  zi: { xxl: 30000, xl: 10000, l: 9999 }
}

type RenderWithProvidersOptions = Omit<RenderOptions, 'wrapper'> & {
  themeOverrides?: Record<string, unknown>
}

export const renderWithProviders = (
  ui: React.ReactElement,
  { themeOverrides, ...options }: RenderWithProvidersOptions = {}
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <SafeAreaProvider>
      <ThemeProvider
        theme={{
          ...theme,
          utils: defaultThemeUtils,
          images: {
            ...theme.images,
            drop_down: 1,
            general: {
              ...(theme.images as { general?: Record<string, unknown> })?.general,
              arrow_left: 1
            }
          },
          ...themeOverrides
        }}
      >
        {children}
      </ThemeProvider>
    </SafeAreaProvider>
  )

  return render(ui, { wrapper: Wrapper, ...options })
}

import * as React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import TemplateApp from './src/TemplateApp'
import { StatusBar } from 'react-native';
const App = () => {
  return (
    <SafeAreaProvider>
      <StatusBar translucent backgroundColor="transparent" />
      <TemplateApp />
    </SafeAreaProvider>
  )
}

export default App

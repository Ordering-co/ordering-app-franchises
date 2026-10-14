import * as React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import TemplateApp from './src/TemplateApp'
import { ProjectSetupGate } from './src/project-setup-gate'
import { StatusBar } from 'react-native';
const App = () => {
  return (
    <SafeAreaProvider>
      <StatusBar translucent backgroundColor="transparent" />
      <ProjectSetupGate><TemplateApp /></ProjectSetupGate>
    </SafeAreaProvider>
  )
}

export default App

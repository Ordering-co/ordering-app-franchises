/**
 * @format
 */
import 'react-native-get-random-values'
import { AppRegistry } from 'react-native'
import { getMessaging, setBackgroundMessageHandler } from '@react-native-firebase/messaging'
import App from './App'
import { name as appName } from './app.json'
import { isLocalSimulatorMode } from './src/onboarding/ios-local-mode'

if (!isLocalSimulatorMode()) {
  setBackgroundMessageHandler(getMessaging(), async () => {})
}

AppRegistry.registerComponent(appName, () => App)

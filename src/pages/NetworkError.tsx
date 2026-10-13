import React from 'react';
import { Platform } from 'react-native'
import { SafeAreaContainer, NetworkError as NetworkErrorScreen } from '@ui'

const NetworkError = ({ route }: any) => {
  return (
    <SafeAreaContainer
      style={{ paddingTop: Platform.OS === 'ios' ? 0 : 20 }}
    >
      <NetworkErrorScreen loadingData={route?.params?.loadingData} />
    </SafeAreaContainer>
  );
};

export default NetworkError;

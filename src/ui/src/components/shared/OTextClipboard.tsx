import React from 'react';
import { TouchableOpacity } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { useToast, useLanguage, ToastType } from '@components'

const ClipboardButton = ({ text, children }: { text: string, children: React.ReactNode }) => {
  const [, { showToast }] = useToast()
  const [, t] = useLanguage()

  const handleCopy = () => {
    Clipboard.setString(text);
    showToast(ToastType.Success, t('COPIED_TO_CLIPBOARD', 'Copied to clipboard'), 2000)
  };

  return (
    <TouchableOpacity
      onPress={handleCopy}
    >
      {children}
    </TouchableOpacity>
  );
};

export default ClipboardButton;

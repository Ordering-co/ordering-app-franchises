import React from 'react'
import { Text } from 'react-native'
import { fireEvent } from '@testing-library/react-native'
import Clipboard from '@react-native-clipboard/clipboard'
import { useToast } from '@components'
import OTextClipboard from '../OTextClipboard'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

describe('OTextClipboard', () => {
  it('copies text and shows a toast', () => {
    const { getByText } = renderWithProviders(
      <OTextClipboard text='ABC-123'>
        <Text>Copy</Text>
      </OTextClipboard>
    )
    fireEvent.press(getByText('Copy'))
    expect(Clipboard.setString).toHaveBeenCalledWith('ABC-123')
    const [, toastFns] = (useToast as jest.Mock).mock.results.at(-1)?.value || useToast()
    expect(toastFns.showToast).toHaveBeenCalled()
  })
})

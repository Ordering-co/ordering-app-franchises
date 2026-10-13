import React from 'react'
import { Alert, Text, Vibration } from 'react-native'
import { fireEvent } from '@testing-library/react-native'
import OAlert from '../OAlert'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

describe('OAlert', () => {
  beforeEach(() => {
    jest.spyOn(Alert, 'alert').mockImplementation(jest.fn())
    jest.spyOn(Vibration, 'vibrate').mockImplementation(jest.fn())
  })

  it('shows native alert on press', () => {
    const onAccept = jest.fn()
    const onCancel = jest.fn()
    const { getByText } = renderWithProviders(
      <OAlert title='Delete?' message='Sure?' onAccept={onAccept} onCancel={onCancel}>
        <Text>Delete</Text>
      </OAlert>
    )
    fireEvent.press(getByText('Delete'))
    expect(Vibration.vibrate).toHaveBeenCalledWith(50)
    expect(Alert.alert).toHaveBeenCalled()
  })
})

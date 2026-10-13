import React from 'react'
import { Text } from 'react-native'
import { fireEvent } from '@testing-library/react-native'
import OBottomPopup from '../OBottomPopup'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

describe('OBottomPopup', () => {
  it('renders title and children when open', () => {
    const onClose = jest.fn()
    const { getByText } = renderWithProviders(
      <OBottomPopup open title='Filters' onClose={onClose}>
        <Text>Popup body</Text>
      </OBottomPopup>
    )
    expect(getByText('Filters')).toBeTruthy()
    expect(getByText('Popup body')).toBeTruthy()
    fireEvent.press(getByText('Filters'))
  })
})

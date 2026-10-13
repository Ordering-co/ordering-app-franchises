import React from 'react'
import { fireEvent } from '@testing-library/react-native'
import OToggle from '../OToggle'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

describe('OToggle', () => {
  it('renders label and toggles', () => {
    const onToggle = jest.fn()
    const { getByText } = renderWithProviders(
      <OToggle isOn={false} label='Notify' onToggle={onToggle} />
    )
    expect(getByText('Notify')).toBeTruthy()
    fireEvent.press(getByText('Notify'))
  })

  it('calls onToggle from the switch', () => {
    const onToggle = jest.fn()
    const { UNSAFE_getByType } = renderWithProviders(
      <OToggle isOn={false} onToggle={onToggle} />
    )
    const { TouchableOpacity } = require('react-native')
    fireEvent.press(UNSAFE_getByType(TouchableOpacity))
    expect(onToggle).toHaveBeenCalledWith(true)
  })
})

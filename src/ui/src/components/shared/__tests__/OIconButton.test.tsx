import React from 'react'
import { fireEvent } from '@testing-library/react-native'
import OIconButton from '../OIconButton'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

describe('OIconButton', () => {
  it('presses when enabled and renders disabled title', () => {
    const onClick = jest.fn()
    const { getByText, rerender } = renderWithProviders(
      <OIconButton title='Save' icon={1} onClick={onClick} />
    )
    fireEvent.press(getByText('Save'))
    expect(onClick).toHaveBeenCalled()
    rerender(<OIconButton title='Off' icon={1} disabled />)
    expect(getByText('Off')).toBeTruthy()
  })
})

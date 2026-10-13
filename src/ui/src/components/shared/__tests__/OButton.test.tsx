import React from 'react'
import { fireEvent } from '@testing-library/react-native'
import OButton from '../OButton'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

describe('OButton', () => {
  it('renders and handles press', () => {
    const onClick = jest.fn()
    const { getByText } = renderWithProviders(
      <OButton text='Continue' testID='continue-btn' onClick={onClick} />
    )
    fireEvent.press(getByText('Continue'))
    expect(onClick).toHaveBeenCalled()
  })

  it('renders disabled and loading states', () => {
    const { getByText, rerender } = renderWithProviders(
      <OButton text='Disabled' isDisabled />
    )
    expect(getByText('Disabled')).toBeTruthy()
    rerender(<OButton text='Loading' isLoading />)
  })
})

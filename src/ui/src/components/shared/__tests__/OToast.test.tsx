import React from 'react'
import { act } from '@testing-library/react-native'
import { ToastType, useToast } from '@components'
import { Toast } from '../OToast'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

describe('Toast (OToast)', () => {
  it('returns null without toast config', () => {
    ;(useToast as jest.Mock).mockReturnValue([null, { hideToast: jest.fn() }])
    const { toJSON } = renderWithProviders(<Toast />)
    expect(toJSON()).toBeNull()
  })

  it('renders success toast and hides after duration', () => {
    jest.useFakeTimers()
    const hideToast = jest.fn()
    ;(useToast as jest.Mock).mockReturnValue([
      { type: ToastType.Success, message: 'Saved', duration: 300 },
      { hideToast }
    ])
    const { getByText } = renderWithProviders(<Toast />)
    expect(getByText('Saved')).toBeTruthy()
    act(() => {
      jest.advanceTimersByTime(700)
    })
    expect(hideToast).toHaveBeenCalled()
    jest.useRealTimers()
  })

  it('renders info and error toast types', () => {
    ;(useToast as jest.Mock).mockReturnValue([
      { type: ToastType.Info, message: 'Info msg', duration: 1000 },
      { hideToast: jest.fn() }
    ])
    const { getByText, rerender } = renderWithProviders(<Toast />)
    expect(getByText('Info msg')).toBeTruthy()
    ;(useToast as jest.Mock).mockReturnValue([
      { type: ToastType.Error, message: 'Error msg', duration: 1000 },
      { hideToast: jest.fn() }
    ])
    rerender(<Toast />)
    expect(getByText('Error msg')).toBeTruthy()
  })
})

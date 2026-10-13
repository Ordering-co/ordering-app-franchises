import React from 'react'
import { fireEvent } from '@testing-library/react-native'
import OInput from '../OInput'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

describe('OInput', () => {
  it('handles change, focus, and blur', () => {
    const onChange = jest.fn()
    const { getByPlaceholderText } = renderWithProviders(
      <OInput
        placeholder='Email'
        name='email'
        icon={1}
        onChange={onChange}
      />
    )
    const input = getByPlaceholderText('Email')
    fireEvent.changeText(input, 'test@example.com')
    expect(onChange).toHaveBeenCalled()
    fireEvent(input, 'blur')
    expect(getByPlaceholderText('Email')).toBeTruthy()
  })
})

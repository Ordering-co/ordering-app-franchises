import React from 'react'
import { fireEvent } from '@testing-library/react-native'
import ODropDown from '../ODropDown'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

const options = [
  { value: 'a', name: 'Alpha' },
  { value: 'b', name: 'Beta' }
]

describe('ODropDown', () => {
  it('opens and selects an option', () => {
    const onSelect = jest.fn()
    const { getByText } = renderWithProviders(
      <ODropDown
        options={options}
        defaultValue='a'
        placeholder='Pick'
        onSelect={onSelect}
      />
    )
    expect(getByText('Alpha')).toBeTruthy()
    fireEvent.press(getByText('Alpha'))
    fireEvent.press(getByText('Beta'))
    expect(onSelect).toHaveBeenCalledWith('b')
  })
})

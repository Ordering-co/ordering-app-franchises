import React from 'react'
import { fireEvent } from '@testing-library/react-native'
import OKeyButton from '../OKeyButton'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

describe('OKeyButton', () => {
  it('renders title and subtitle and handles press', () => {
    const onClick = jest.fn()
    const { getByText } = renderWithProviders(
      <OKeyButton title='1' subTitle='ABC' onClick={onClick} />
    )
    expect(getByText('ABC')).toBeTruthy()
    fireEvent.press(getByText('1'))
    expect(onClick).toHaveBeenCalled()
  })
})

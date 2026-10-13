import React from 'react'
import { Text } from 'react-native'
import { fireEvent } from '@testing-library/react-native'
import { CardAnimation } from '../CardAnimation'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

describe('CardAnimation', () => {
  it('renders children and handles press', () => {
    const onClick = jest.fn()
    const { getByText } = renderWithProviders(
      <CardAnimation onClick={onClick}>
        <Text>Card</Text>
      </CardAnimation>
    )
    fireEvent.press(getByText('Card'))
    expect(onClick).toHaveBeenCalled()
  })
})

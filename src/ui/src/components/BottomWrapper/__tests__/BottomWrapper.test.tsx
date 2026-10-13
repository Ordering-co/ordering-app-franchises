import React from 'react'
import { Text } from 'react-native'
import BottomWrapper from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

describe('BottomWrapper UI', () => {
  it('renders children inside bottom wrapper', () => {
    const { getByText } = renderWithProviders(
      <BottomWrapper>
        <Text>Bottom action</Text>
      </BottomWrapper>
    )
    expect(getByText('Bottom action')).toBeTruthy()
  })
})

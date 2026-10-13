import React from 'react'
import { Text } from 'react-native'
import { AnimatedItem } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

describe('AnimatedItem UI', () => {
  it('renders wrapped child content', () => {
    const { getByText } = renderWithProviders(
      <AnimatedItem index={0} item={<Text>Animated content</Text>} />
    )
    expect(getByText('Animated content')).toBeTruthy()
  })
})

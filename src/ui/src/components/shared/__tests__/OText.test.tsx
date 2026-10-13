import React from 'react'
import OText from '../OText'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

describe('OText', () => {
  it('renders children', () => {
    const { getByText } = renderWithProviders(<OText size={18} weight='700'>Hello</OText>)
    expect(getByText('Hello')).toBeTruthy()
  })
})

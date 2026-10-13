import React from 'react'
import OTextarea from '../OTextarea'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

describe('OTextarea', () => {
  it('renders with placeholder and value', () => {
    const { getByPlaceholderText } = renderWithProviders(
      <OTextarea placeholder='Notes' value='hello' lines={3} />
    )
    expect(getByPlaceholderText('Notes')).toBeTruthy()
  })
})

import React from 'react'
import OIconText from '../OIconText'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

describe('OIconText', () => {
  it('renders icon and label', () => {
    const { getByText } = renderWithProviders(
      <OIconText icon={1} text='Label' size={16} color='#111' />
    )
    expect(getByText('Label')).toBeTruthy()
  })
})

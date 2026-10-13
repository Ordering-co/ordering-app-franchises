import React from 'react'
import OIcon from '../OIcon'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

describe('OIcon', () => {
  it('renders with src and url sources', () => {
    const { rerender } = renderWithProviders(<OIcon src={1} width={20} height={20} />)
    rerender(<OIcon url='https://example.com/icon.png' color='#000' cover />)
    rerender(<OIcon dummy={1} isWrap />)
  })
})

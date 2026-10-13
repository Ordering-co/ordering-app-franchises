import React from 'react'
import HeaderTitle from '../HeaderTitle'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

describe('HeaderTitle', () => {
  it('renders title text', () => {
    const { getByText } = renderWithProviders(<HeaderTitle text='orders' titleColor='#222' ph={10} />)
    expect(getByText('orders')).toBeTruthy()
  })
})

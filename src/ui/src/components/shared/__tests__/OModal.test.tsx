import React from 'react'
import { Text } from 'react-native'

jest.mock('@ui', () => ({
  Toast: () => null
}))

import OModal from '../OModal'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

describe('OModal', () => {
  it('renders title and children when open', () => {
    const onClose = jest.fn()
    const { getByText } = renderWithProviders(
      <OModal open title='Modal title' onClose={onClose}>
        <Text>Modal body</Text>
      </OModal>
    )
    expect(getByText('Modal title')).toBeTruthy()
    expect(getByText('Modal body')).toBeTruthy()
  })
})

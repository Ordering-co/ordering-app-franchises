import React from 'react'
import { Alert } from 'react-native'
import OAlertOriginal from '../OAlertOriginal'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

describe('OAlertOriginal', () => {
  beforeEach(() => {
    jest.spyOn(Alert, 'alert').mockImplementation(jest.fn())
  })

  it('opens a native alert when open is true', () => {
    const onAccept = jest.fn()
    const onClose = jest.fn()
    renderWithProviders(
      <OAlertOriginal
        open
        title='Notice'
        content={['BODY']}
        onAccept={onAccept}
        onClose={onClose}
      />
    )
    expect(Alert.alert).toHaveBeenCalled()
  })

  it('does not alert when closed', () => {
    renderWithProviders(
      <OAlertOriginal
        open={false}
        title='Notice'
        content={['BODY']}
        onAccept={jest.fn()}
        onClose={jest.fn()}
      />
    )
    expect(Alert.alert).not.toHaveBeenCalled()
  })
})

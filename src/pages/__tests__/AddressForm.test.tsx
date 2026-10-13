import { fireEvent, waitFor } from '@testing-library/react-native'
import { _retrieveStoreData } from '@ui'

import AddressForm from '../AddressForm'
import { renderPage } from '../../../jest/helpers/renderPage'
import { setupPageTestEnv } from '../../../jest/helpers/pageTestSetup'

jest.mock('@ui', () => require('../../../jest/helpers/mockUi'))

describe('AddressForm page', () => {
  beforeEach(() => {
    setupPageTestEnv()
    _retrieveStoreData.mockResolvedValue(false)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders address form with route params and guest storage', async () => {
    _retrieveStoreData.mockResolvedValue(true)
    const onSaveAddress = jest.fn()
    const { getByTestId } = renderPage(AddressForm, {
      route: {
        params: {
          address: { id: 3 },
          isEditing: true,
          isGuestUser: false,
          onSaveAddress
        }
      }
    })
    expect(getByTestId('navbar-title').props.children).toBe('Add new address')
    await waitFor(() => {
      expect(getByTestId('address-form-guest-store').props.children).toBe('true')
    })
    expect(getByTestId('address-form-editing').props.children).toBe('true')
  })

  it('navbar back only when can go back', () => {
    const { getByTestId, navigation } = renderPage(AddressForm)
    fireEvent.press(getByTestId('navbar-back'))
    expect(navigation.goBack).toHaveBeenCalled()
  })
})

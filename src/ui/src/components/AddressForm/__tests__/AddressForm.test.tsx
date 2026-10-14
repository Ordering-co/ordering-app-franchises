import { fireEvent, waitFor } from '@testing-library/react-native'
import { AddressForm } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import {
  addressFormUIProps,
  mockAddress,
  mockAddressConfigs,
  mockChangedAddressFormState,
  mockErrorAddressFormState,
  mockIdleAddressFormState,
  resetAppM9Mocks
} from '../../../../../../jest/helpers/appM9TestUtils'

jest.mock('@ui', () => require('../../../../../../jest/helpers/appM9TestUtils').appM9UiMock)
jest.mock('react-hook-form', () => require('../../../../../../jest/helpers/appM9TestUtils').hookFormMock)
jest.mock('react-native-geocoding', () => require('../../../../../../jest/helpers/appM9TestUtils').geocoderMock)
jest.mock('react-native-google-places-textinput', () => require('../../../../../../jest/helpers/appM9TestUtils').googlePlacesModule)
jest.mock('react-native-loading-spinner-overlay', () => 'Spinner')
jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  AddressForm: ({ UIComponent, ...rest }) => {
    const React = require('react')
    const { addressFormUIProps } = require('../../../../../../jest/helpers/appM9TestUtils')
    return React.createElement(UIComponent, { ...addressFormUIProps, ...rest })
  },
  useSession: jest.fn(() => [{ auth: true }, {}]),
  useToast: jest.fn(() => [null, { showToast: jest.fn() }]),
  useConfig: jest.fn(() => [{
    loading: false,
    configs: require('../../../../../../jest/helpers/appM9TestUtils').mockAddressConfigs
  }]),
  useOrder: jest.fn(() => [{
    loading: false,
    options: require('../../../../../../jest/helpers/appM9TestUtils').mockDeliveryOptions
  }])
}))

const renderForm = (props = {}) => renderWithProviders(
  <AddressForm {...props} />
)

describe('AddressForm UI', () => {
  beforeEach(() => {
    global.fetch = jest.fn(async () => ({
      json: async () => ({
        status: 'OK',
        result: {
          formatted_address: '9 Pine St',
          place_id: 'place-1',
          geometry: { location: { lat: 40.71, lng: -74.01 } },
          address_components: [
            { types: ['postal_code'], short_name: '10001' },
            { types: ['country'], long_name: 'United States', short_name: 'US' }
          ]
        }
      })
    }))
  })

  afterEach(() => {
    resetAppM9Mocks()
    const { useSession, useConfig, useToast } = require('@components')
    useSession.mockReturnValue([{ auth: true }, {}])
    useConfig.mockReturnValue([{
      loading: false,
      configs: mockAddressConfigs
    }])
    useToast.mockReturnValue([null, { showToast: jest.fn() }])
  })

  it('renders address fields and continues with a selected location', () => {
    const saveAddress = jest.fn()
    const { getByPlaceholderText, getByText } = renderForm({ saveAddress })
    expect(getByPlaceholderText('Add a address')).toBeTruthy()
    expect(getByPlaceholderText('Internal number')).toBeTruthy()
    expect(getByPlaceholderText('Zip code')).toBeTruthy()
    expect(getByPlaceholderText('Address notes')).toBeTruthy()
    fireEvent.press(getByText('Continue'))
    expect(saveAddress).toHaveBeenCalled()
  })

  it('updates copy when editing an existing address', () => {
    const { getByText } = renderForm({
      isEditing: true,
      addressState: { address: { ...mockAddress } }
    })
    expect(getByText('Update')).toBeTruthy()
  })

  it('applies a GPS result and a selected place', async () => {
    const updateChanges = jest.fn()
    const { getByTestId } = renderForm({ updateChanges })
    fireEvent.press(getByTestId('gps-button'))
    expect(updateChanges).toHaveBeenCalledWith(expect.objectContaining({
      address: '1 GPS St',
      map_data: { library: 'google', place_id: 'gps-1' }
    }))
    fireEvent.press(getByTestId('select-place'))
    await waitFor(() => {
      expect(updateChanges).toHaveBeenCalledWith(expect.objectContaining({
        address: '9 Pine St',
        zipcode: '10001'
      }))
    })
  })

  it('types an address after the first change and tags it', () => {
    const handleChangeInput = jest.fn()
    const { getByTestId, getAllByTestId } = renderForm({ handleChangeInput })
    fireEvent.changeText(getByTestId('places-text'), 'first')
    fireEvent.changeText(getByTestId('places-text'), '9 Pine St')
    expect(handleChangeInput).toHaveBeenCalledWith({
      target: { name: 'address', value: '9 Pine St' }
    })
    fireEvent.press(getAllByTestId('o-icon')[0].parent.parent)
    expect(handleChangeInput).toHaveBeenCalledWith({
      target: { name: 'tag', value: 'home' }
    })
  })

  it('toasts a places error and a form result error', async () => {
    const { useToast } = require('@components')
    const showToast = jest.fn()
    useToast.mockReturnValue([null, { showToast }])
    const { getByTestId } = renderForm({
      formState: mockErrorAddressFormState
    })
    fireEvent.press(getByTestId('places-error'))
    await waitFor(() => {
      expect(showToast).toHaveBeenCalled()
    })
  })

  it('requires a suggested location when autocomplete selection is required', () => {
    const { useConfig, useToast } = require('@components')
    const showToast = jest.fn()
    useToast.mockReturnValue([null, { showToast }])
    useConfig.mockReturnValue([{
      loading: false,
      configs: {
        ...mockAddressConfigs,
        google_autocomplete_selection_required: { value: '1' }
      }
    }])
    const saveAddress = jest.fn()
    const { getByText } = renderForm({
      saveAddress,
      formState: {
        ...mockChangedAddressFormState,
        changes: { address: '9 Pine St' }
      }
    })
    fireEvent.press(getByText('Continue'))
    expect(saveAddress).not.toHaveBeenCalled()
    expect(showToast).toHaveBeenCalled()
  })

  it('geocodes a typed address when location is not required', async () => {
    const saveAddress = jest.fn()
    const { getByText } = renderForm({
      saveAddress,
      formState: {
        ...mockChangedAddressFormState,
        changes: { address: '9 Pine St' }
      }
    })
    fireEvent.press(getByText('Continue'))
    await waitFor(() => {
      expect(saveAddress).toHaveBeenCalledWith(expect.objectContaining({
        address: '9 Pine St',
        zipcode: '10001'
      }))
    })
  })

  it('blocks a guest continue when the address change is empty', () => {
    const { useSession, useToast } = require('@components')
    const showToast = jest.fn()
    useSession.mockReturnValue([{ auth: false }, {}])
    useToast.mockReturnValue([null, { showToast }])
    const saveAddress = jest.fn()
    const { getByText } = renderForm({
      saveAddress,
      formState: {
        ...mockIdleAddressFormState,
        changes: { address: '' }
      },
      addressState: { address: { ...mockAddress } }
    })
    fireEvent.press(getByText('Update'))
    expect(saveAddress).not.toHaveBeenCalled()
    expect(showToast).toHaveBeenCalled()
  })

  it('redirects unaddressed order types to the business tab', () => {
    const { useConfig } = require('@components')
    useConfig.mockReturnValue([{
      loading: false,
      configs: {
        ...mockAddressConfigs,
        unaddressed_order_types_allowed: { value: '1' }
      }
    }])
    const onNavigationRedirect = jest.fn()
    renderForm({
      onNavigationRedirect,
      formState: mockIdleAddressFormState
    })
    expect(onNavigationRedirect).toHaveBeenCalledWith('BottomTab', { screen: 'Business' })
  })

  it('hides extra fields when the theme hides them', () => {
    const { queryByPlaceholderText, queryByText } = renderWithProviders(
      <AddressForm formState={mockIdleAddressFormState} />,
      {
        themeOverrides: {
          address: {
            components: {
              map: { hidden: true },
              icons: { hidden: true },
              internal_number: { hidden: true },
              zipcode: { hidden: true },
              address_notes: { hidden: true }
            }
          }
        }
      }
    )
    expect(queryByPlaceholderText('Internal number')).toBeNull()
    expect(queryByPlaceholderText('Zip code')).toBeNull()
    expect(queryByPlaceholderText('Address notes')).toBeNull()
    expect(queryByText('Continue')).toBeNull()
  })
})

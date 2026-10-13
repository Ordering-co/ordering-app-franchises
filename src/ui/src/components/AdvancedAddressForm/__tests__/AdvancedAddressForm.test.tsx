import { fireEvent, waitFor } from '@testing-library/react-native'
import { AdvancedAddressForm } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import {
  advancedAddressFormUIProps,
  mockAddressConfigs,
  mockChangedAddressFormState,
  mockDeliveryOptions,
  mockMomentOptions,
  mockNavigation,
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
    const { advancedAddressFormUIProps } = require('../../../../../../jest/helpers/appM9TestUtils')
    return React.createElement(UIComponent, { ...advancedAddressFormUIProps, ...rest })
  },
  useSession: jest.fn(() => [{ auth: true }, {}]),
  useToast: jest.fn(() => [null, { showToast: jest.fn() }]),
  useConfig: jest.fn(() => [{
    loading: false,
    configs: require('../../../../../../jest/helpers/appM9TestUtils').mockAddressConfigs
  }]),
  useOrder: jest.fn(() => [
    {
      loading: false,
      options: require('../../../../../../jest/helpers/appM9TestUtils').mockDeliveryOptions
    },
    { changeMoment: jest.fn() }
  ])
}))

const renderForm = (props = {}) => renderWithProviders(
  <AdvancedAddressForm {...props} />
)

describe('AdvancedAddressForm UI', () => {
  beforeEach(() => {
    global.fetch = jest.fn(async () => ({
      json: async () => ({
        result: {
          formatted_address: '9 Pine St',
          place_id: 'place-1',
          geometry: { location: { lat: 40.71, lng: -74.01 } },
          address_components: []
        }
      })
    }))
  })

  afterEach(() => {
    resetAppM9Mocks()
    const { useSession, useConfig, useOrder, useToast } = require('@components')
    useSession.mockReturnValue([{ auth: true }, {}])
    useConfig.mockReturnValue([{
      loading: false,
      configs: mockAddressConfigs
    }])
    useOrder.mockReturnValue([{
      loading: false,
      options: mockDeliveryOptions
    }, { changeMoment: jest.fn() }])
    useToast.mockReturnValue([null, { showToast: jest.fn() }])
  })

  it('renders the selected address and looks up the nearest business', () => {
    const getNearestBusiness = jest.fn()
    const { getByPlaceholderText, getByText, getByTestId } = renderForm({
      getNearestBusiness
    })
    expect(getByPlaceholderText('Add a address')).toBeTruthy()
    expect(getByText('Continue')).toBeTruthy()
    expect(getByTestId('address-details-map')).toBeTruthy()
    fireEvent.press(getByText('Continue'))
    expect(getByTestId('order-config')).toBeTruthy()
    expect(getNearestBusiness).toHaveBeenCalledWith({
      lat: mockChangedAddressFormState.changes.location.lat,
      lng: mockChangedAddressFormState.changes.location.lng
    })
  })

  it('opens the complete address modal and saves from continue', async () => {
    const saveAddress = jest.fn(async () => {})
    const { getByText, getByPlaceholderText } = renderForm({ saveAddress })
    fireEvent.press(getByText('Continue'))
    expect(getByText('COMPLETE ADDRESS')).toBeTruthy()
    expect(getByPlaceholderText('Internal number')).toBeTruthy()
    expect(getByPlaceholderText('Zip code')).toBeTruthy()
    fireEvent.press(getByText('CONTINUE'))
    await waitFor(() => {
      expect(saveAddress).toHaveBeenCalled()
      expect(mockNavigation.navigate).toHaveBeenCalledWith('BottomTab', {
        screen: 'Business'
      })
    })
  })

  it('alerts when delivery has no nearby business', () => {
    const { getByText } = renderForm({
      businessNearestState: { loading: false, business: null }
    })
    fireEvent.press(getByText('Continue'))
    fireEvent.press(getByText('CONTINUE'))
    expect(getByText('Business alert')).toBeTruthy()
    expect(getByText('Error, business not found near your location')).toBeTruthy()
  })

  it('applies GPS and selected places and clears a scheduled moment', async () => {
    const changeMoment = jest.fn()
    const { useOrder } = require('@components')
    useOrder.mockReturnValue([{
      loading: false,
      options: mockMomentOptions
    }, { changeMoment }])
    const updateChanges = jest.fn()
    const { getByTestId } = renderForm({ updateChanges })
    fireEvent.press(getByTestId('gps-button'))
    expect(updateChanges).toHaveBeenCalledWith(expect.objectContaining({
      address: '1 GPS St'
    }))
    expect(changeMoment).toHaveBeenCalledWith(null)
    fireEvent.press(getByTestId('select-place'))
    await waitFor(() => {
      expect(updateChanges).toHaveBeenCalledWith(expect.objectContaining({
        address: '9 Pine St'
      }))
    })
  })

  it('tags the address and goes to preorder from order config', () => {
    const handleChangeInput = jest.fn()
    const { getByText, getAllByTestId, getByTestId } = renderForm({
      handleChangeInput,
      businessNearestState: {
        loading: false,
        business: { slug: 'demo-store', name: 'Demo Store' }
      }
    })
    fireEvent.press(getByText('Continue'))
    fireEvent.press(getAllByTestId('o-icon')[0].parent.parent)
    expect(handleChangeInput).toHaveBeenCalledWith({
      target: { name: 'tag', value: 'home' }
    })
    fireEvent.press(getByTestId('order-config-preorder'))
    expect(mockNavigation.navigate).toHaveBeenCalledWith('MomentOption', {
      business: { slug: 'demo-store', name: 'Demo Store' }
    })
  })

  it('goes back after save when enableGoBackOnContinue is set', async () => {
    const saveAddress = jest.fn(async () => {})
    const { getByText } = renderForm({
      saveAddress,
      enableGoBackOnContinue: true
    })
    fireEvent.press(getByText('Continue'))
    fireEvent.press(getByText('CONTINUE'))
    await waitFor(() => {
      expect(saveAddress).toHaveBeenCalled()
      expect(mockNavigation.goBack).toHaveBeenCalled()
    })
  })

  it('skips navigation after signup', async () => {
    const saveAddress = jest.fn(async () => {})
    const { getByText } = renderForm({
      saveAddress,
      afterSignup: true
    })
    fireEvent.press(getByText('Continue'))
    fireEvent.press(getByText('CONTINUE'))
    await waitFor(() => {
      expect(saveAddress).toHaveBeenCalled()
    })
    expect(mockNavigation.navigate).not.toHaveBeenCalled()
    expect(mockNavigation.goBack).not.toHaveBeenCalled()
  })

  it('toasts a required location error', () => {
    const { useConfig, useToast } = require('@components')
    const showToast = jest.fn()
    useToast.mockReturnValue([null, { showToast }])
    useConfig.mockReturnValue([{
      loading: false,
      configs: {
        ...mockAddressConfigs,
        google_autocomplete_selection_required: { value: 'true' }
      }
    }])
    const saveAddress = jest.fn(async () => {})
    const { getByText } = renderForm({
      saveAddress,
      formState: {
        ...mockChangedAddressFormState,
        changes: { address: '9 Pine St' }
      }
    })
    fireEvent.press(getByText('Continue'))
    fireEvent.press(getByText('CONTINUE'))
    expect(saveAddress).not.toHaveBeenCalled()
    expect(showToast).toHaveBeenCalled()
  })

  it('geocodes when location is missing and not required', async () => {
    const saveAddress = jest.fn(async () => {})
    const { getByText } = renderForm({
      saveAddress,
      formState: {
        ...mockChangedAddressFormState,
        changes: { address: '9 Pine St' }
      }
    })
    fireEvent.press(getByText('Continue'))
    fireEvent.press(getByText('CONTINUE'))
    await waitFor(() => {
      expect(saveAddress).toHaveBeenCalledWith(expect.objectContaining({
        address: '9 Pine St'
      }))
    })
  })

  it('clears the selected address when the cart address is removed', () => {
    const { useOrder } = require('@components')
    useOrder.mockReturnValue([{
      loading: false,
      options: { type: 1, address: null, moment: null }
    }, { changeMoment: jest.fn() }])
    const { queryByText, getByTestId } = renderForm({
      formState: {
        loading: false,
        changes: {},
        result: null
      },
      addressState: { address: { address: '' } }
    })
    expect(queryByText('Continue')).toBeNull()
    expect(getByTestId('google-places-input')).toBeTruthy()
  })
})

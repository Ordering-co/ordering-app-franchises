import { fireEvent, waitFor } from '@testing-library/react-native'
import { PhoneInputNumber } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import {
  mockAddressConfigs,
  phoneInputApi,
  resetAppM9Mocks
} from '../../../../../../jest/helpers/appM9TestUtils'

jest.mock('@ui', () => require('../../../../../../jest/helpers/appM9TestUtils').appM9UiMock)
jest.mock('react-native-phone-number-input', () => require('../../../../../../jest/helpers/appM9TestUtils').phoneInputModule)
jest.mock('react-native-country-flag', () => require('../../../../../../jest/helpers/appM9TestUtils').countryFlagModule)
jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  useConfig: jest.fn(() => [{
    loading: false,
    configs: require('../../../../../../jest/helpers/appM9TestUtils').mockAddressConfigs
  }])
}))

const renderPhone = (props = {}) => renderWithProviders(
  <PhoneInputNumber handleData={jest.fn()} {...props} />
)

describe('PhoneInputNumber UI', () => {
  afterEach(() => {
    resetAppM9Mocks()
    const { useConfig } = require('@components')
    useConfig.mockReturnValue([{
      loading: false,
      configs: mockAddressConfigs
    }])
  })

  it('renders the phone field and country flag', () => {
    const { getByPlaceholderText, getByTestId } = renderPhone({ defaultCode: 'US' })
    expect(getByPlaceholderText('Phone Number')).toBeTruthy()
    expect(getByTestId('native-phone-input')).toBeTruthy()
    expect(getByTestId('country-flag-US')).toBeTruthy()
  })

  it('emits a valid phone payload while typing', async () => {
    const handleData = jest.fn()
    const { getByTestId } = renderPhone({ handleData })
    fireEvent.changeText(getByTestId('phone-formatted-input'), '5550100')
    await waitFor(() => {
      expect(handleData).toHaveBeenCalledWith(expect.objectContaining({
        error: '',
        phone: {
          country_phone_code: '1',
          cellphone: '5550100'
        }
      }))
    })
  })

  it('emits an invalid phone error when the library rejects the number', async () => {
    phoneInputApi.valid = false
    phoneInputApi.number = '12'
    const handleData = jest.fn()
    const { getByTestId } = renderPhone({ handleData })
    fireEvent.changeText(getByTestId('phone-formatted-input'), '12')
    await waitFor(() => {
      expect(handleData).toHaveBeenCalledWith(expect.objectContaining({
        error: 'The Phone Number field is invalid'
      }))
    })
  })

  it('skips library validation when the config is off', async () => {
    const { useConfig } = require('@components')
    useConfig.mockReturnValue([{
      loading: false,
      configs: {
        ...mockAddressConfigs,
        validation_phone_number_lib: { value: '0' }
      }
    }])
    phoneInputApi.valid = false
    const handleData = jest.fn()
    const { getByTestId } = renderPhone({ handleData })
    fireEvent.changeText(getByTestId('phone-formatted-input'), '5550100')
    await waitFor(() => {
      expect(handleData).toHaveBeenCalledWith(expect.objectContaining({
        error: ''
      }))
    })
  })

  it('shows a required error and an incoming data error', () => {
    const { getByText } = renderPhone({
      isStartValidation: true,
      data: { error: 'Bad number' }
    })
    expect(getByText(/The field Mobile phone is required/)).toBeTruthy()
    expect(getByText('Bad number')).toBeTruthy()
  })

  it('clears the phone payload when the input is emptied', async () => {
    const handleData = jest.fn()
    const { getByTestId } = renderPhone({ handleData })
    fireEvent.changeText(getByTestId('phone-formatted-input'), '5550100')
    fireEvent.changeText(getByTestId('phone-formatted-input'), '')
    await waitFor(() => {
      expect(handleData).toHaveBeenCalledWith(expect.objectContaining({
        error: '',
        phone: {
          country_phone_code: null,
          cellphone: null
        }
      }))
    })
  })

  it('opens calling-code options and selects one', () => {
    const changeCountry = jest.fn()
    const { getByTestId, getByText } = renderPhone({ changeCountry })
    fireEvent.press(getByTestId('change-phone-country'))
    expect(changeCountry).toHaveBeenCalledWith({
      cca2: 'PR',
      callingCode: ['1', '1787']
    })
    expect(getByText('+1')).toBeTruthy()
    expect(getByText('+1787')).toBeTruthy()
    fireEvent.press(getByText('+1787'))
    expect(phoneInputApi.state.code).toBe('1787')
  })

  it('normalizes a second plus in the formatted number', async () => {
    const handleData = jest.fn()
    const { getByTestId } = renderPhone({ handleData })
    fireEvent.changeText(getByTestId('phone-formatted-input'), '+1+1787 5550100')
    await waitFor(() => {
      expect(handleData).toHaveBeenCalled()
    })
    expect(phoneInputApi.state.code).toBe('1787')
  })

  it('disables the input and can hide the dropdown icon', () => {
    const { getByTestId } = renderPhone({
      isDisabled: true,
      noDropIcon: true
    })
    expect(getByTestId('phone-formatted-input').props.editable).toBe(false)
    expect(getByTestId('native-phone-input')).toBeTruthy()
  })

  it('applies a default value when updateStateWithSubmit is set', () => {
    const { getByTestId } = renderPhone({
      defaultValue: '5550199',
      updateStateWithSubmit: true,
      defaultCode: 'US'
    })
    expect(getByTestId('phone-formatted-input')).toBeTruthy()
    expect(phoneInputApi.state.number).toBe('5550199')
  })
})

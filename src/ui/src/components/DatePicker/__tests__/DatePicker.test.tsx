import { fireEvent } from '@testing-library/react-native'
import { DatePickerUI } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('react-native-date-picker', () => require('../../../../../../jest/helpers/appM9TestUtils').datePickerModule)
jest.mock('@components', () => require('../../../../../../jest/helpers/mockOrdering'))

const renderPicker = (props = {}) => renderWithProviders(
  <DatePickerUI
    birthdate="1990-01-15"
    open
    onConfirm={jest.fn()}
    onCancel={jest.fn()}
    {...props}
  />
)

describe('DatePickerUI', () => {
  it('renders the native picker title and current date', () => {
    const { getByText, getByTestId } = renderPicker()
    expect(getByText('Select a date')).toBeTruthy()
    expect(getByTestId('date-value')).toBeTruthy()
    expect(getByText('Confirm')).toBeTruthy()
    expect(getByText('Cancel')).toBeTruthy()
  })

  it('confirms a selected date', () => {
    const onConfirm = jest.fn()
    const { getByTestId } = renderPicker({ onConfirm })
    fireEvent.press(getByTestId('confirm-date'))
    expect(onConfirm).toHaveBeenCalledWith(expect.any(Date))
  })

  it('cancels without confirming', () => {
    const onCancel = jest.fn()
    const { getByTestId } = renderPicker({ onCancel, open: false })
    fireEvent.press(getByTestId('cancel-date'))
    expect(onCancel).toHaveBeenCalled()
  })

  it('falls back to today when birthdate is missing', () => {
    const { getByTestId } = renderPicker({ birthdate: null })
    expect(getByTestId('native-date-picker')).toBeTruthy()
    expect(getByTestId('date-value')).toBeTruthy()
  })
})

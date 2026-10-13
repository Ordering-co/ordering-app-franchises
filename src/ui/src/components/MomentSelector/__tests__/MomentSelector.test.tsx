import { fireEvent, waitFor } from '@testing-library/react-native'
import { MomentSelector } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import { momentSelectorUIProps } from '../../../../../../jest/helpers/appM6TestUtils'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))
jest.mock('react-native-select-dropdown', () => (
  require('../../../../../../jest/helpers/appM6TestUtils').selectDropdownMock
))
jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  useConfig: jest.fn(() => [{
    loading: false,
    configs: require('../../../../../../jest/helpers/appM6TestUtils').mockConfigs
  }]),
  useUtils: jest.fn(() => [require('../../../../../../jest/helpers/appM6TestUtils').mockUtils]),
  MomentOption: ({ UIComponent, ...rest }) => {
    const React = require('react')
    const { momentSelectorUIProps } = require('../../../../../../jest/helpers/appM6TestUtils')
    return React.createElement(UIComponent, { ...momentSelectorUIProps, ...rest })
  }
}))

describe('MomentSelector UI', () => {
  it('renders date and time dropdowns and selects values', async () => {
    const handleChangeDate = jest.fn()
    const handleChangeTime = jest.fn()
    const { getByTestId } = renderWithProviders(
      <MomentSelector
        handleChangeDate={handleChangeDate}
        handleChangeTime={handleChangeTime}
      />
    )

    await waitFor(() => {
      expect(getByTestId('select-dropdown-date')).toBeTruthy()
      expect(getByTestId('select-dropdown-time')).toBeTruthy()
    })

    fireEvent.press(getByTestId('select-date-option'))
    expect(handleChangeDate).toHaveBeenCalled()
    fireEvent.press(getByTestId('select-time-option'))
    expect(handleChangeTime).toHaveBeenCalled()
  })

  it('uses a 24 hour time format when configured', async () => {
    const { useConfig } = require('@components')
    useConfig.mockReturnValue([{
      loading: false,
      configs: {
        ...require('../../../../../../jest/helpers/appM6TestUtils').mockConfigs,
        general_hour_format: { value: 'HH:mm' },
        max_days_preorder: { value: '1' }
      }
    }])
    const { getByTestId } = renderWithProviders(
      <MomentSelector {...momentSelectorUIProps} />
    )
    await waitFor(() => {
      expect(getByTestId('select-dropdown-time')).toBeTruthy()
    })
  })
})

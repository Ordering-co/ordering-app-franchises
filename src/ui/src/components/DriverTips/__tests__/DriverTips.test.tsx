import { fireEvent } from '@testing-library/react-native'
import { DriverTips } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  useUtils: jest.fn(() => [require('../../../../../../jest/helpers/appM5TestUtils').mockUtils]),
  useConfig: jest.fn(() => [{
    configs: require('../../../../../../jest/helpers/appM5TestUtils').mockWalletConfigs
  }]),
  DriverTips: ({ UIComponent, ...rest }) => {
    const React = require('react')
    const { driverTipsUIProps } = require('../../../../../../jest/helpers/appM5TestUtils')
    return React.createElement(UIComponent, {
      ...driverTipsUIProps,
      ...rest
    })
  }
}))

describe('DriverTips UI', () => {
  it('renders tip options and applies a preset', () => {
    const handlerChangeOption = jest.fn()
    const { getByText } = renderWithProviders(
      <DriverTips handlerChangeOption={handlerChangeOption} />
    )
    expect(getByText('100% of these tips go directly to your driver')).toBeTruthy()
    expect(getByText('10%')).toBeTruthy()
    fireEvent.press(getByText('15%'))
    expect(handlerChangeOption).toHaveBeenCalledWith(15)
  })

  it('opens custom tip input', () => {
    const { getByText, getByPlaceholderText } = renderWithProviders(
      <DriverTips />
    )
    fireEvent.press(getByText('Custom'))
    expect(getByPlaceholderText('0%')).toBeTruthy()
    expect(getByText('Apply')).toBeTruthy()
  })

  it('shows current tip amount for a custom value', () => {
    const { getByText } = renderWithProviders(
      <DriverTips driverTip={7} driverTipsOptions={[10, 15, 20]} />
    )
    expect(getByText(/Current driver tip amount/)).toBeTruthy()
  })
})

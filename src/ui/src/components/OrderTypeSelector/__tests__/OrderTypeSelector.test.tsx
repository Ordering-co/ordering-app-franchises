import { fireEvent } from '@testing-library/react-native'
import { OrderTypeSelector } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import { mockConfigs, mockOrderState } from '../../../../../../jest/helpers/appM6TestUtils'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))
jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  useConfig: jest.fn(() => [{
    loading: false,
    configs: require('../../../../../../jest/helpers/appM6TestUtils').mockConfigs
  }]),
  useOrder: jest.fn(() => [
    require('../../../../../../jest/helpers/appM6TestUtils').mockOrderState,
    require('../../../../../../jest/helpers/appM6TestUtils').mockOrderFns
  ]),
  OrderTypeControl: ({ UIComponent, ...rest }) => {
    const React = require('react')
    const { orderTypeUIProps } = require('../../../../../../jest/helpers/appM6TestUtils')
    return React.createElement(UIComponent, { ...orderTypeUIProps, ...rest })
  }
}))

describe('OrderTypeSelector UI', () => {
  it('renders delivery and pickup and changes type', () => {
    const handleChangeOrderType = jest.fn(async (type) => type)
    const setOrderTypeValue = jest.fn()
    const { getByText } = renderWithProviders(
      <OrderTypeSelector
        typeSelected={1}
        handleChangeOrderType={handleChangeOrderType}
        setOrderTypeValue={setOrderTypeValue}
      />
    )
    expect(getByText('DELIVERY')).toBeTruthy()
    expect(getByText('PICKUP')).toBeTruthy()
    fireEvent.press(getByText('PICKUP'))
    expect(setOrderTypeValue).toHaveBeenCalledWith(2)
    expect(handleChangeOrderType).toHaveBeenCalledWith(2)
  })

  it('shows pickup subtype buttons when pickup is selected', () => {
    const handleChangeOrderType = jest.fn(async (type) => type)
    const { getByText } = renderWithProviders(
      <OrderTypeSelector
        typeSelected={2}
        handleChangeOrderType={handleChangeOrderType}
      />
    )
    expect(getByText('CURBSIDE')).toBeTruthy()
    expect(getByText('DRIVE_THRU')).toBeTruthy()
    fireEvent.press(getByText('CURBSIDE'))
    expect(handleChangeOrderType).toHaveBeenCalledWith(4)
  })

  it('skips the change when the order state is loading', () => {
    const { useOrder } = require('@components')
    useOrder.mockReturnValueOnce([
      { ...mockOrderState, loading: true },
      {}
    ])
    const handleChangeOrderType = jest.fn()
    const { getByText } = renderWithProviders(
      <OrderTypeSelector
        typeSelected={1}
        handleChangeOrderType={handleChangeOrderType}
      />
    )
    fireEvent.press(getByText('DELIVERY'))
    expect(handleChangeOrderType).not.toHaveBeenCalled()
  })
})

import { fireEvent } from '@testing-library/react-native'
import { OrderConfig } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import {
  mockBusinessWithTz,
  mockConfigs,
  mockOrderState,
  mockScheduledOrderState,
  mockUtils
} from '../../../../../../jest/helpers/appM6TestUtils'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))
jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  useConfig: jest.fn(() => [{
    loading: false,
    configs: require('../../../../../../jest/helpers/appM6TestUtils').mockConfigs
  }]),
  useUtils: jest.fn(() => [require('../../../../../../jest/helpers/appM6TestUtils').mockUtils]),
  useOrder: jest.fn(() => [
    require('../../../../../../jest/helpers/appM6TestUtils').mockOrderState,
    require('../../../../../../jest/helpers/appM6TestUtils').mockOrderFns
  ])
}))

describe('OrderConfig UI', () => {
  const setIsOpenConfirmAddress = jest.fn()
  const handleGoToPreorder = jest.fn()
  const onSubmit = jest.fn()
  const handleSubmit = jest.fn((fn) => fn)

  beforeEach(() => {
    setIsOpenConfirmAddress.mockClear()
    handleGoToPreorder.mockClear()
    onSubmit.mockClear()
    handleSubmit.mockClear()
    handleSubmit.mockImplementation((fn) => fn)
  })

  it('renders delivery details and continues', () => {
    const { getByText, getByTestId } = renderWithProviders(
      <OrderConfig
        isOpenConfirmAddress
        setIsOpenConfirmAddress={setIsOpenConfirmAddress}
        addressSelected='9 Pine St'
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        businessNearestState={{ business: mockBusinessWithTz }}
        handleGoToPreorder={handleGoToPreorder}
      />
    )
    expect(getByTestId('bottom-popup')).toBeTruthy()
    expect(getByText('CONFIGURATION OF DELIVERY')).toBeTruthy()
    expect(getByText('9 Pine St')).toBeTruthy()
    expect(getByText('Test Store')).toBeTruthy()
    expect(getByText('555-0100')).toBeTruthy()
    expect(getByText('ASAP')).toBeTruthy()
    fireEvent.press(getByText('SCHEDULE'))
    expect(handleGoToPreorder).toHaveBeenCalled()
    fireEvent.press(getByText('CONTINUE'))
    expect(handleSubmit).toHaveBeenCalledWith(onSubmit)
  })

  it('shows the scheduled moment and closes the popup', () => {
    const { useOrder } = require('@components')
    useOrder.mockReturnValueOnce([mockScheduledOrderState, {}])
    const { getByText, getAllByTestId } = renderWithProviders(
      <OrderConfig
        isOpenConfirmAddress
        setIsOpenConfirmAddress={setIsOpenConfirmAddress}
        addressSelected='123 Main St'
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        businessNearestState={{ business: mockBusinessWithTz }}
        handleGoToPreorder={handleGoToPreorder}
      />
    )
    expect(getByText(String(mockScheduledOrderState.options.moment))).toBeTruthy()
    fireEvent.press(getAllByTestId('o-icon')[0])
    expect(setIsOpenConfirmAddress).toHaveBeenCalledWith(false)
  })

  it('hides schedule when preorder is disabled', () => {
    const { useConfig } = require('@components')
    useConfig.mockReturnValueOnce([{
      loading: false,
      configs: { ...mockConfigs, preorder_status_enabled: { value: '0' } }
    }])
    const { queryByText, getByText } = renderWithProviders(
      <OrderConfig
        isOpenConfirmAddress
        setIsOpenConfirmAddress={setIsOpenConfirmAddress}
        addressSelected='123 Main St'
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        businessNearestState={{ business: { name: 'Solo Store', address: '1 Oak' } }}
        handleGoToPreorder={handleGoToPreorder}
      />
    )
    expect(getByText('Solo Store')).toBeTruthy()
    expect(queryByText('SCHEDULE')).toBeNull()
  })

  it('does not render when the popup is closed', () => {
    const { queryByText } = renderWithProviders(
      <OrderConfig
        isOpenConfirmAddress={false}
        setIsOpenConfirmAddress={setIsOpenConfirmAddress}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
      />
    )
    expect(queryByText('CONTINUE')).toBeNull()
  })
})

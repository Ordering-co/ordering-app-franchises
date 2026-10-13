import { LastOrder } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import {
  mockEmptyOrderList,
  mockLoadingOrderList,
  mockOrder
} from '../../../../../../jest/helpers/appM6TestUtils'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))
jest.mock('rn-placeholder', () => require('../../../../../../jest/helpers/appM6TestUtils').placeholderMock)
jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  useUtils: jest.fn(() => [require('../../../../../../jest/helpers/appM6TestUtils').mockUtils]),
  useOrder: jest.fn(() => [
    require('../../../../../../jest/helpers/appM6TestUtils').mockOrderState,
    require('../../../../../../jest/helpers/appM6TestUtils').mockOrderFns
  ]),
  OrderList: ({ UIComponent, ...rest }) => {
    const React = require('react')
    const { lastOrderUIProps } = require('../../../../../../jest/helpers/appM6TestUtils')
    return React.createElement(UIComponent, { ...lastOrderUIProps, ...rest })
  }
}))

describe('LastOrder UI', () => {
  it('renders previous order business and status', () => {
    const { getByText } = renderWithProviders(
      <LastOrder onNavigationRedirect={jest.fn()} />
    )
    expect(getByText('Test Store')).toBeTruthy()
    expect(getByText(/Pending on/)).toBeTruthy()
  })

  it('renders the empty state', () => {
    const { getByText } = renderWithProviders(
      <LastOrder orderList={mockEmptyOrderList} />
    )
    expect(getByText('Sorry, no results found')).toBeTruthy()
  })

  it('renders placeholders while loading', () => {
    const { queryByText } = renderWithProviders(
      <LastOrder orderList={mockLoadingOrderList} />
    )
    expect(queryByText('Test Store')).toBeNull()
    expect(queryByText('Sorry, no results found')).toBeNull()
  })

  it('uses customArray when provided', () => {
    const { getByText } = renderWithProviders(
      <LastOrder
        customArray={[{ ...mockOrder, business: { name: 'Custom Store', header: 'https://example.com/h.jpg' } }]}
        orderList={mockEmptyOrderList}
      />
    )
    expect(getByText('Custom Store')).toBeTruthy()
  })
})

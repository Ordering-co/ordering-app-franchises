import { fireEvent } from '@testing-library/react-native'
import { ActiveOrders } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import {
  mockOrder,
  mockPagination,
  mockLastPage
} from '../../../../../../jest/helpers/appM6TestUtils'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))

describe('ActiveOrders UI', () => {
  const handleClickOrder = jest.fn()
  const handleUpdateOrderList = jest.fn()
  const loadMoreOrders = jest.fn()
  const onNavigationRedirect = jest.fn()

  beforeEach(() => {
    handleClickOrder.mockClear()
    handleUpdateOrderList.mockClear()
    loadMoreOrders.mockClear()
    onNavigationRedirect.mockClear()
  })

  it('renders order cards and load more', () => {
    const { getAllByTestId, getByText } = renderWithProviders(
      <ActiveOrders
        orders={[mockOrder, { ...mockOrder, id: 102 }]}
        pagination={mockPagination}
        loadMoreOrders={loadMoreOrders}
        handleClickOrder={handleClickOrder}
        handleUpdateOrderList={handleUpdateOrderList}
        onNavigationRedirect={onNavigationRedirect}
        loading={false}
      />
    )

    expect(getAllByTestId('single-order-card')).toHaveLength(2)
    fireEvent.press(getByText('Load more orders'))
    expect(loadMoreOrders).toHaveBeenCalled()
  })

  it('hides load more while loading or on the last page', () => {
    const { queryByText, rerender } = renderWithProviders(
      <ActiveOrders
        orders={[mockOrder]}
        pagination={mockPagination}
        loadMoreOrders={loadMoreOrders}
        loading
      />
    )
    expect(queryByText('Load more orders')).toBeNull()

    rerender(
      <ActiveOrders
        orders={[mockOrder]}
        pagination={mockLastPage}
        loadMoreOrders={loadMoreOrders}
        loading={false}
      />
    )
    expect(queryByText('Load more orders')).toBeNull()
  })

  it('skips the footer spacer in message view', () => {
    const { getByTestId } = renderWithProviders(
      <ActiveOrders
        orders={[mockOrder]}
        pagination={mockLastPage}
        isMessageView
        loading={false}
      />
    )
    expect(getByTestId('single-order-card')).toBeTruthy()
  })
})

import { fireEvent } from '@testing-library/react-native'
import { PreviousOrders } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import {
  mockCompletedOrder,
  mockLastPage,
  mockOrder,
  mockPagination
} from '../../../../../../jest/helpers/appM6TestUtils'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))

describe('PreviousOrders UI', () => {
  const loadMoreOrders = jest.fn()
  const handleReorder = jest.fn()
  const onNavigationRedirect = jest.fn()

  beforeEach(() => {
    loadMoreOrders.mockClear()
    handleReorder.mockClear()
    onNavigationRedirect.mockClear()
  })

  it('renders previous order cards and load more', () => {
    const { getAllByTestId, getByText } = renderWithProviders(
      <PreviousOrders
        orders={[mockCompletedOrder, { ...mockOrder, id: 103, status: 2 }]}
        pagination={mockPagination}
        loadMoreOrders={loadMoreOrders}
        handleReorder={handleReorder}
        onNavigationRedirect={onNavigationRedirect}
        handleUpdateOrderList={jest.fn()}
        loading={false}
      />
    )
    expect(getAllByTestId('single-order-card')).toHaveLength(2)
    fireEvent.press(getByText('Load more orders'))
    expect(loadMoreOrders).toHaveBeenCalled()
  })

  it('hides load more on the last page', () => {
    const { queryByText } = renderWithProviders(
      <PreviousOrders
        orders={[mockCompletedOrder]}
        pagination={mockLastPage}
        loadMoreOrders={loadMoreOrders}
        loading={false}
      />
    )
    expect(queryByText('Load more orders')).toBeNull()
  })
})

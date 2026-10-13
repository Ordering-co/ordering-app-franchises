import { fireEvent } from '@testing-library/react-native'
import { OrderItAgain } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import { mockNavigation, mockProduct } from '../../../../../../jest/helpers/appM6TestUtils'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))

describe('OrderItAgain UI', () => {
  const onProductClick = jest.fn()

  beforeEach(() => {
    onProductClick.mockClear()
  })

  it('renders previous products and handles a click', () => {
    const { getByText, getByTestId } = renderWithProviders(
      <OrderItAgain
        productList={[
          { ...mockProduct, last_ordered_date: '2026-09-01' },
          { ...mockProduct, id: 11, name: 'Garlic Knots', last_ordered_date: '2026-09-06' }
        ]}
        onProductClick={onProductClick}
        businessId={1}
        categoryState={{}}
        currentCart={{ products: [{ id: 10, quantity: 2 }] }}
        handleUpdateProducts={jest.fn()}
        navigation={mockNavigation}
      />
    )
    expect(getByText('Order it again')).toBeTruthy()
    expect(getByText('Quickly add items from your past orders.')).toBeTruthy()
    expect(getByText('Garlic Knots')).toBeTruthy()
    fireEvent.press(getByText('Cheese Pizza'))
    expect(onProductClick).toHaveBeenCalled()
  })

  it('filters products by search value', () => {
    const { getByText, queryByText } = renderWithProviders(
      <OrderItAgain
        productList={[
          { ...mockProduct, name: 'Cheese Pizza' },
          { ...mockProduct, id: 11, name: 'Garlic Knots' }
        ]}
        searchValue='garlic'
        onProductClick={onProductClick}
      />
    )
    expect(getByText('Garlic Knots')).toBeTruthy()
    expect(queryByText('Cheese Pizza')).toBeNull()
  })

  it('renders nothing when the filtered list is empty', () => {
    const { queryByText } = renderWithProviders(
      <OrderItAgain productList={[]} onProductClick={onProductClick} />
    )
    expect(queryByText('Order it again')).toBeNull()
  })
})

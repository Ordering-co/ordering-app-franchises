import { fireEvent } from '@testing-library/react-native'
import { VerticalGiftCardOrdersLayout } from '../index'
import { renderWithProviders } from '../../../../../../../jest/helpers/renderWithProviders'
import {
  mockGiftCard,
  verticalGiftCardUIProps
} from '../../../../../../../jest/helpers/appM9RewardsTestUtils'

jest.mock('@ui', () => require('../../../../../../../jest/helpers/appM9RewardsTestUtils').appM9UiMock)
jest.mock('react-native-fast-image', () => require('../../../../../../../jest/helpers/fastImageMock'))
jest.mock('rn-placeholder', () => require('../../../../../../../jest/helpers/appM9RewardsTestUtils').placeholderMock)
jest.mock('@components', () => ({
  ...require('../../../../../../../jest/helpers/mockOrdering'),
  useUtils: jest.fn(() => [require('../../../../../../../jest/helpers/appM9RewardsTestUtils').mockUtils]),
  GiftCardOrdersList: ({ UIComponent, ...rest }) => {
    const React = require('react')
    const { verticalGiftCardUIProps } = require('../../../../../../../jest/helpers/appM9RewardsTestUtils')
    return React.createElement(UIComponent, { ...verticalGiftCardUIProps, ...rest })
  }
}))

const renderLayout = (props = {}) => renderWithProviders(
  <VerticalGiftCardOrdersLayout {...verticalGiftCardUIProps} {...props} />
)

describe('VerticalGiftCardOrdersLayout UI', () => {
  it('renders the section title and gift cards', () => {
    const { getByText, getAllByText } = renderLayout({ title: 'Pending' })
    expect(getAllByText('Pending').length).toBeGreaterThan(0)
    expect(getByText('Birthday Card')).toBeTruthy()
  })

  it('marks the section empty when the list has no cards', () => {
    const setIsEmpty = jest.fn()
    const { queryByText } = renderLayout({
      title: 'Pending',
      setIsEmpty,
      giftCards: { loading: false, list: [] }
    })
    expect(setIsEmpty).toHaveBeenCalledWith(true)
    expect(queryByText('Pending')).toBeNull()
  })

  it('skips the empty flag while cards are loading', () => {
    const setIsEmpty = jest.fn()
    renderLayout({
      setIsEmpty,
      giftCards: { loading: true, list: [] }
    })
    expect(setIsEmpty).not.toHaveBeenCalled()
  })

  it('shows skeletons when loading is allowed', () => {
    const { getAllByTestId } = renderLayout({
      allowLoading: true,
      giftCards: { loading: true, list: [] }
    })
    expect(getAllByTestId('placeholder').length).toBeGreaterThan(0)
  })

  it('loads more pages from the pagination control', () => {
    const loadMoreOrders = jest.fn()
    const { getByText } = renderLayout({
      loadMoreOrders,
      paginationProps: { currentPage: 1, totalPages: 3 }
    })
    fireEvent.press(getByText('Load more orders'))
    expect(loadMoreOrders).toHaveBeenCalled()
  })

  it('opens a card order from the list', () => {
    const onNavigationRedirect = jest.fn()
    const { getByText } = renderLayout({
      onNavigationRedirect,
      giftCards: { loading: false, list: [mockGiftCard] }
    })
    fireEvent.press(getByText('Birthday Card'))
    expect(onNavigationRedirect).toHaveBeenCalledWith('OrderDetails', { orderId: 901 })
  })
})

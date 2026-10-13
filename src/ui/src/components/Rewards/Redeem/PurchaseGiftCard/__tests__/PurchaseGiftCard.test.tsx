import { fireEvent } from '@testing-library/react-native'
import { PurchaseGiftCard } from '../index'
import { renderWithProviders } from '../../../../../../../../jest/helpers/renderWithProviders'
import {
  mockGiftProduct,
  purchaseGiftCardUIProps
} from '../../../../../../../../jest/helpers/appM9RewardsTestUtils'

jest.mock('@ui', () => require('../../../../../../../../jest/helpers/appM9RewardsTestUtils').appM9UiMock)
jest.mock('rn-placeholder', () => require('../../../../../../../../jest/helpers/appM9RewardsTestUtils').placeholderMock)
jest.mock('@components', () => ({
  ...require('../../../../../../../../jest/helpers/mockOrdering'),
  PurchaseGiftCard: ({ UIComponent, ...rest }) => {
    const React = require('react')
    const { purchaseGiftCardUIProps } = require('../../../../../../../../jest/helpers/appM9RewardsTestUtils')
    return React.createElement(UIComponent, { ...purchaseGiftCardUIProps, ...rest })
  }
}))

const renderPurchase = (props = {}) => renderWithProviders(
  <PurchaseGiftCard {...purchaseGiftCardUIProps} {...props} />
)

describe('PurchaseGiftCard UI', () => {
  it('renders gift card options', () => {
    const { getByText } = renderPurchase()
    expect(getByText('Select one option')).toBeTruthy()
    expect(getByText('$25 Gift Card')).toBeTruthy()
    expect(getByText('$50 Gift Card')).toBeTruthy()
    expect(getByText('Accept')).toBeTruthy()
  })

  it('shows skeletons while products load', () => {
    const { getAllByTestId, queryByText } = renderPurchase({
      productsListState: { loading: true, products: [] }
    })
    expect(getAllByTestId('placeholder').length).toBe(4)
    expect(queryByText('Select one option')).toBeNull()
  })

  it('shows an empty gift cards message', () => {
    const { getByText } = renderPurchase({
      productsListState: { loading: false, products: [] }
    })
    expect(getByText('No Gift Cards to show')).toBeTruthy()
  })

  it('selects a gift card option', () => {
    const setSelectedProduct = jest.fn()
    const { getByText } = renderPurchase({ setSelectedProduct })
    fireEvent.press(getByText('$25 Gift Card'))
    expect(setSelectedProduct).toHaveBeenCalledWith(mockGiftProduct)
  })

  it('accepts the selected gift card', () => {
    const handleAccept = jest.fn()
    const { getByText } = renderPurchase({
      selectedProduct: mockGiftProduct,
      handleAccept
    })
    fireEvent.press(getByText('Accept'))
    expect(handleAccept).toHaveBeenCalled()
  })

  it('renders accept without a selected gift card', () => {
    const { getByText, queryByText } = renderPurchase({ selectedProduct: null })
    expect(getByText('Accept')).toBeTruthy()
    expect(queryByText('Select one option')).toBeTruthy()
  })
})

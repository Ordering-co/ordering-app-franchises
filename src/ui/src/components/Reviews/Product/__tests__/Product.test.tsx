import { Keyboard } from 'react-native'
import { fireEvent, waitFor } from '@testing-library/react-native'
import { ReviewProducts } from '../index'
import { renderWithProviders } from '../../../../../../../jest/helpers/renderWithProviders'
import {
  mockIdleFormState,
  mockErrorFormState,
  mockReviewOrder
} from '../../../../../../../jest/helpers/appM7TestUtils'

jest.mock('@ui', () => ({
  ...require('../../../../../../../jest/helpers/franchiseAppUiMock'),
  SingleProductReview: ({ product }) => {
    const React = require('react')
    const { Text } = require('react-native')
    return React.createElement(Text, { testID: `product-review-${product.id}` }, product.name)
  }
}))
jest.mock('@components', () => ({
  ...require('../../../../../../../jest/helpers/mockOrdering'),
  ReviewProduct: ({ UIComponent, ...rest }) => {
    const React = require('react')
    const { reviewProductUIProps } = require('../../../../../../../jest/helpers/appM7TestUtils')
    return React.createElement(UIComponent, { ...reviewProductUIProps, ...rest })
  }
}))

describe('Reviews Product UI', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders products and continues to the driver review', async () => {
    const onNavigationRedirect = jest.fn()
    const handleSendProductReview = jest.fn()
    const { getByText, getByTestId, rerender } = renderWithProviders(
      <ReviewProducts
        order={mockReviewOrder}
        onNavigationRedirect={onNavigationRedirect}
        handleSendProductReview={handleSendProductReview}
        formState={mockIdleFormState}
      />
    )
    expect(getByTestId('product-review-10')).toBeTruthy()
    expect(getByText('Continue')).toBeTruthy()
    fireEvent.press(getByText('Continue'))
    expect(handleSendProductReview).toHaveBeenCalled()
    rerender(
      <ReviewProducts
        order={mockReviewOrder}
        onNavigationRedirect={onNavigationRedirect}
        handleSendProductReview={handleSendProductReview}
        formState={{ ...mockIdleFormState, result: { error: false } }}
      />
    )
    await waitFor(() => {
      expect(onNavigationRedirect).toHaveBeenCalledWith('ReviewDriver', { order: mockReviewOrder })
    })
  })

  it('sends a review and goes home when there is no driver to review', async () => {
    const onNavigationRedirect = jest.fn()
    const order = { ...mockReviewOrder, driver: null }
    const { getByText, rerender } = renderWithProviders(
      <ReviewProducts
        order={order}
        onNavigationRedirect={onNavigationRedirect}
        handleSendProductReview={jest.fn()}
        formState={mockIdleFormState}
      />
    )
    expect(getByText('Send Review')).toBeTruthy()
    fireEvent.press(getByText('Send Review'))
    rerender(
      <ReviewProducts
        order={order}
        onNavigationRedirect={onNavigationRedirect}
        formState={{ ...mockIdleFormState, result: { error: false } }}
      />
    )
    await waitFor(() => {
      expect(onNavigationRedirect).toHaveBeenCalledWith('BottomTab', { screen: 'Business' })
    })
  })

  it('skips to the driver review or home', () => {
    const onNavigationRedirect = jest.fn()
    const { getByText, rerender } = renderWithProviders(
      <ReviewProducts
        order={mockReviewOrder}
        onNavigationRedirect={onNavigationRedirect}
        formState={mockIdleFormState}
      />
    )
    fireEvent.press(getByText('Skip'))
    expect(onNavigationRedirect).toHaveBeenCalledWith('ReviewDriver', { order: mockReviewOrder })

    const noDriver = { ...mockReviewOrder, driver: null }
    rerender(
      <ReviewProducts
        order={noDriver}
        onNavigationRedirect={onNavigationRedirect}
        formState={mockIdleFormState}
      />
    )
    fireEvent.press(getByText('Skip'))
    expect(onNavigationRedirect).toHaveBeenCalledWith('BottomTab', { screen: 'Business' })
  })

  it('renders nested products and hides deleted items', () => {
    const { getByTestId, queryByTestId } = renderWithProviders(
      <ReviewProducts
        order={{
          ...mockReviewOrder,
          products: [
            [{ id: 21, name: 'Nested Pizza', deleted: false }],
            { id: 22, name: 'Salad', deleted: false },
            { id: 23, name: 'Coke', deleted: true },
            [{ id: 24, name: 'Gone', deleted: true }]
          ]
        }}
        formState={mockIdleFormState}
      />
    )
    expect(getByTestId('product-review-21')).toBeTruthy()
    expect(getByTestId('product-review-22')).toBeTruthy()
    expect(queryByTestId('product-review-23')).toBeNull()
    expect(queryByTestId('product-review-24')).toBeNull()
  })

  it('toasts product review errors', () => {
    const { useToast } = require('@components')
    const showToast = jest.fn()
    useToast.mockReturnValue([null, { showToast }])
    renderWithProviders(
      <ReviewProducts
        order={mockReviewOrder}
        formState={mockErrorFormState}
      />
    )
    expect(showToast).toHaveBeenCalled()
  })

  it('registers a keyboard listener for the comment list', () => {
    const remove = jest.fn()
    jest.spyOn(Keyboard, 'addListener').mockImplementation(() => ({ remove }))
    const { unmount } = renderWithProviders(
      <ReviewProducts
        order={mockReviewOrder}
        formState={mockIdleFormState}
      />
    )
    expect(Keyboard.addListener).toHaveBeenCalledWith('keyboardDidShow', expect.any(Function))
    unmount()
    expect(remove).toHaveBeenCalled()
  })
})

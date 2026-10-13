import { Keyboard } from 'react-native'
import { fireEvent, waitFor } from '@testing-library/react-native'
import { ReviewOrder } from '../index'
import { renderWithProviders } from '../../../../../../../jest/helpers/renderWithProviders'
import {
  mockErrorFormState,
  mockIdleFormState,
  mockReviewOrder,
  mockStars
} from '../../../../../../../jest/helpers/appM7TestUtils'

jest.mock('@ui', () => require('../../../../../../../jest/helpers/franchiseAppUiMock'))
jest.mock('../../Header', () => ({
  HeaderReview: (props) => require('../../../../../../../jest/helpers/appM7TestUtils').headerReviewMock(props)
}))
jest.mock('@components', () => ({
  ...require('../../../../../../../jest/helpers/mockOrdering'),
  OrderReview: ({ UIComponent, ...rest }) => {
    const React = require('react')
    const { reviewOrderUIProps } = require('../../../../../../../jest/helpers/appM7TestUtils')
    return React.createElement(UIComponent, { ...reviewOrderUIProps, ...rest })
  }
}))

describe('Reviews Order UI', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders comments and continues to product reviews', async () => {
    const handleSendReview = jest.fn()
    const handleReviewState = jest.fn()
    const setIsReviewed = jest.fn()
    const onNavigationRedirect = jest.fn()
    const { getByText, getByTestId, rerender } = renderWithProviders(
      <ReviewOrder
        order={mockReviewOrder}
        stars={mockStars}
        handleSendReview={handleSendReview}
        handleReviewState={handleReviewState}
        setIsReviewed={setIsReviewed}
        onNavigationRedirect={onNavigationRedirect}
        formState={mockIdleFormState}
      />
    )
    expect(getByText('Test Store')).toBeTruthy()
    expect(getByText('Comments')).toBeTruthy()
    fireEvent.press(getByText('Good communication'))
    fireEvent.press(getByTestId('change-stars'))
    fireEvent.changeText(getByTestId('comments'), 'Tasty meal')
    fireEvent.press(getByText('Continue'))
    await waitFor(() => {
      expect(handleSendReview).toHaveBeenCalled()
    })
    expect(handleReviewState).toHaveBeenCalledWith(202)
    expect(setIsReviewed).toHaveBeenCalledWith(true)
    rerender(
      <ReviewOrder
        order={mockReviewOrder}
        stars={mockStars}
        handleSendReview={handleSendReview}
        onNavigationRedirect={onNavigationRedirect}
        formState={{ ...mockIdleFormState, result: { id: 1 } }}
      />
    )
    await waitFor(() => {
      expect(onNavigationRedirect).toHaveBeenCalledWith('ReviewProducts', { order: mockReviewOrder })
    })
  })

  it('requires a qualification before sending', async () => {
    const { useToast } = require('@components')
    const showToast = jest.fn()
    useToast.mockReturnValue([null, { showToast }])
    const handleSendReview = jest.fn()
    const { getByText } = renderWithProviders(
      <ReviewOrder
        order={mockReviewOrder}
        stars={{ ...mockStars, quality: 0, punctuality: 0, service: 0, packaging: 0 }}
        handleSendReview={handleSendReview}
        formState={mockIdleFormState}
      />
    )
    fireEvent.press(getByText('Continue'))
    await waitFor(() => {
      expect(showToast).toHaveBeenCalled()
    })
    expect(handleSendReview).not.toHaveBeenCalled()
  })

  it('skips to product reviews when products remain', () => {
    const onNavigationRedirect = jest.fn()
    const { getByText } = renderWithProviders(
      <ReviewOrder
        order={mockReviewOrder}
        stars={mockStars}
        onNavigationRedirect={onNavigationRedirect}
        formState={mockIdleFormState}
      />
    )
    fireEvent.press(getByText('Skip'))
    expect(onNavigationRedirect).toHaveBeenCalledWith('ReviewProducts', { order: mockReviewOrder })
  })

  it('skips to the driver review when all products are deleted', () => {
    const onNavigationRedirect = jest.fn()
    const order = {
      ...mockReviewOrder,
      products: [{ id: 10, name: 'Cheese Pizza', deleted: true }]
    }
    const { getByText } = renderWithProviders(
      <ReviewOrder
        order={order}
        stars={mockStars}
        onNavigationRedirect={onNavigationRedirect}
        formState={mockIdleFormState}
      />
    )
    fireEvent.press(getByText('Skip'))
    expect(onNavigationRedirect).toHaveBeenCalledWith('ReviewDriver', { order })
  })

  it('goes back when there is nothing left to review', () => {
    const onGoBack = jest.fn()
    const order = {
      ...mockReviewOrder,
      driver: null,
      products: [{ id: 10, deleted: true }]
    }
    const { getByText } = renderWithProviders(
      <ReviewOrder
        order={order}
        stars={mockStars}
        onGoBack={onGoBack}
        formState={mockIdleFormState}
      />
    )
    fireEvent.press(getByText('Skip'))
    expect(onGoBack).toHaveBeenCalled()
  })

  it('shows an already reviewed state without the comment form', () => {
    const { getByText, queryByText } = renderWithProviders(
      <ReviewOrder
        order={{ ...mockReviewOrder, review: { id: 9 } }}
        stars={mockStars}
        formState={mockIdleFormState}
      />
    )
    expect(getByText('This order has been already reviewed')).toBeTruthy()
    expect(queryByText('Comments')).toBeNull()
  })

  it('toasts order review errors', () => {
    const { useToast } = require('@components')
    const showToast = jest.fn()
    useToast.mockReturnValue([null, { showToast }])
    renderWithProviders(
      <ReviewOrder
        order={mockReviewOrder}
        stars={mockStars}
        formState={mockErrorFormState}
      />
    )
    expect(showToast).toHaveBeenCalled()
  })

  it('goes back after submit when no products remain', async () => {
    const navigation = { canGoBack: jest.fn(() => true), goBack: jest.fn() }
    const order = {
      ...mockReviewOrder,
      products: [{ id: 10, deleted: true }]
    }
    const { getByText } = renderWithProviders(
      <ReviewOrder
        order={order}
        stars={mockStars}
        navigation={navigation}
        handleSendReview={jest.fn()}
        formState={mockIdleFormState}
      />
    )
    fireEvent.press(getByText('Continue'))
    await waitFor(() => {
      expect(navigation.goBack).toHaveBeenCalled()
    })
  })

  it('registers a keyboard listener for the comment field', () => {
    const remove = jest.fn()
    jest.spyOn(Keyboard, 'addListener').mockImplementation(() => ({ remove }))
    const { unmount } = renderWithProviders(
      <ReviewOrder
        order={mockReviewOrder}
        stars={mockStars}
        formState={mockIdleFormState}
      />
    )
    expect(Keyboard.addListener).toHaveBeenCalledWith('keyboardDidShow', expect.any(Function))
    unmount()
    expect(remove).toHaveBeenCalled()
  })
})

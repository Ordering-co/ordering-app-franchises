import { Keyboard } from 'react-native'
import { fireEvent, waitFor } from '@testing-library/react-native'
import { ReviewDriver } from '../index'
import { renderWithProviders } from '../../../../../../../jest/helpers/renderWithProviders'
import {
  mockDriverReviews,
  mockErrorFormState,
  mockIdleFormState,
  mockReviewOrder
} from '../../../../../../../jest/helpers/appM7TestUtils'

jest.mock('@ui', () => require('../../../../../../../jest/helpers/franchiseAppUiMock'))
jest.mock('../../Header', () => ({
  HeaderReview: (props) => require('../../../../../../../jest/helpers/appM7TestUtils').headerReviewMock(props)
}))
jest.mock('@components', () => ({
  ...require('../../../../../../../jest/helpers/mockOrdering'),
  ReviewDriver: ({ UIComponent, ...rest }) => {
    const React = require('react')
    const { reviewDriverUIProps } = require('../../../../../../../jest/helpers/appM7TestUtils')
    return React.createElement(UIComponent, { ...reviewDriverUIProps, ...rest })
  }
}))

describe('Reviews Driver UI', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders comments and sends a driver review', async () => {
    const handleSendDriverReview = jest.fn()
    const setDriverReviews = jest.fn()
    const onNavigationRedirect = jest.fn()
    const { getByText, getByTestId, rerender } = renderWithProviders(
      <ReviewDriver
        order={mockReviewOrder}
        dirverReviews={mockDriverReviews}
        setDriverReviews={setDriverReviews}
        handleSendDriverReview={handleSendDriverReview}
        onNavigationRedirect={onNavigationRedirect}
        formState={mockIdleFormState}
      />
    )
    expect(getByText('Alex')).toBeTruthy()
    expect(getByText('Comments')).toBeTruthy()
    expect(getByText('Good communication')).toBeTruthy()
    fireEvent.press(getByText('Good communication'))
    fireEvent.press(getByTestId('change-stars'))
    expect(setDriverReviews).toHaveBeenCalled()
    fireEvent.press(getByText('Send Review'))
    await waitFor(() => {
      expect(handleSendDriverReview).toHaveBeenCalled()
    })
    rerender(
      <ReviewDriver
        order={mockReviewOrder}
        dirverReviews={mockDriverReviews}
        setDriverReviews={setDriverReviews}
        handleSendDriverReview={handleSendDriverReview}
        onNavigationRedirect={onNavigationRedirect}
        formState={{ ...mockIdleFormState, result: { error: false } }}
      />
    )
    await waitFor(() => {
      expect(onNavigationRedirect).toHaveBeenCalledWith('BottomTab', { screen: 'Business' })
    })
  })

  it('requires a qualification before sending', async () => {
    const { useToast } = require('@components')
    const showToast = jest.fn()
    useToast.mockReturnValue([null, { showToast }])
    const handleSendDriverReview = jest.fn()
    const { getByText } = renderWithProviders(
      <ReviewDriver
        order={mockReviewOrder}
        dirverReviews={{ qualification: 0, comment: '' }}
        handleSendDriverReview={handleSendDriverReview}
        formState={mockIdleFormState}
      />
    )
    fireEvent.press(getByText('Send Review'))
    await waitFor(() => {
      expect(showToast).toHaveBeenCalled()
    })
    expect(handleSendDriverReview).not.toHaveBeenCalled()
  })

  it('goes to orders when the driver was already reviewed', async () => {
    const onNavigationRedirect = jest.fn()
    const { getByText } = renderWithProviders(
      <ReviewDriver
        order={{ ...mockReviewOrder, user_review: { id: 1 } }}
        onNavigationRedirect={onNavigationRedirect}
        formState={mockIdleFormState}
      />
    )
    fireEvent.press(getByText('Send Review'))
    await waitFor(() => {
      expect(onNavigationRedirect).toHaveBeenCalledWith('Profile', { screen: 'MyOrders' })
    })
  })

  it('adds extra comments and toggles a quick comment off', () => {
    const setDriverReviews = jest.fn()
    const { getByText, getByTestId } = renderWithProviders(
      <ReviewDriver
        order={mockReviewOrder}
        dirverReviews={mockDriverReviews}
        setDriverReviews={setDriverReviews}
        formState={mockIdleFormState}
      />
    )
    fireEvent.press(getByText('Friendly'))
    fireEvent.press(getByText('Friendly'))
    fireEvent.changeText(getByTestId('comments'), 'Great dropoff')
    expect(setDriverReviews).toHaveBeenCalled()
  })

  it('toasts driver review errors', () => {
    const { useToast } = require('@components')
    const showToast = jest.fn()
    useToast.mockReturnValue([null, { showToast }])
    renderWithProviders(
      <ReviewDriver
        order={mockReviewOrder}
        dirverReviews={mockDriverReviews}
        formState={mockErrorFormState}
      />
    )
    expect(showToast).toHaveBeenCalled()
  })

  it('registers a keyboard listener for the comment field', () => {
    const remove = jest.fn()
    jest.spyOn(Keyboard, 'addListener').mockImplementation(() => ({ remove }))
    const { unmount } = renderWithProviders(
      <ReviewDriver
        order={mockReviewOrder}
        dirverReviews={mockDriverReviews}
        formState={mockIdleFormState}
      />
    )
    expect(Keyboard.addListener).toHaveBeenCalledWith('keyboardDidShow', expect.any(Function))
    unmount()
    expect(remove).toHaveBeenCalled()
  })
})

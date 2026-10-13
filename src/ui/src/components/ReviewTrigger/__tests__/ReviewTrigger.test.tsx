import { fireEvent } from '@testing-library/react-native'
import { ReviewTrigger } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import { mockReviewOrder } from '../../../../../../jest/helpers/appM7TestUtils'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))
jest.mock('react-native-vector-icons/FontAwesome', () => {
  const React = require('react')
  const { Text, TouchableOpacity } = require('react-native')
  return ({ name, onPress }) => React.createElement(
    TouchableOpacity,
    { testID: `fa-${name}`, onPress },
    React.createElement(Text, null, name)
  )
})
jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  useUtils: jest.fn(() => [require('../../../../../../jest/helpers/appM7TestUtils').mockUtils])
}))

describe('ReviewTrigger UI', () => {
  it('renders a single store logo and submits the default rating', () => {
    const handleOpenOrderReview = jest.fn()
    const { getByText } = renderWithProviders(
      <ReviewTrigger
        order={mockReviewOrder}
        handleOpenOrderReview={handleOpenOrderReview}
      />
    )
    expect(getByText('Test Store')).toBeTruthy()
    expect(getByText('Do not forget to rate your order placed on ')).toBeTruthy()
    expect(getByText('2026-09-07 18:00:00')).toBeTruthy()
    fireEvent.press(getByText('Go to review'))
    expect(handleOpenOrderReview).toHaveBeenCalledWith(5)
  })

  it('updates the star rating before opening the review', () => {
    const handleOpenOrderReview = jest.fn()
    const { getAllByTestId, getByText } = renderWithProviders(
      <ReviewTrigger
        order={{ ...mockReviewOrder, logo: null }}
        handleOpenOrderReview={handleOpenOrderReview}
      />
    )
    fireEvent.press(getAllByTestId('fa-star')[2])
    fireEvent.press(getByText('Go to review'))
    expect(handleOpenOrderReview).toHaveBeenCalledWith(3)
  })

  it('renders multiple logos when the order has a logo list', () => {
    const { getAllByTestId, queryByText } = renderWithProviders(
      <ReviewTrigger
        order={{
          ...mockReviewOrder,
          business_name: null,
          logo: ['https://example.com/a.jpg', 'https://example.com/b.jpg']
        }}
        handleOpenOrderReview={jest.fn()}
      />
    )
    expect(getAllByTestId('o-icon')).toHaveLength(2)
    expect(queryByText('Test Store')).toBeNull()
  })
})

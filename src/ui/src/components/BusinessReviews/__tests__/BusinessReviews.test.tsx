import { BusinessReviews } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))
jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  useUtils: jest.fn(() => [require('../../../../../../jest/helpers/appM4TestUtils').mockUtils]),
  BusinessReviews: ({ UIComponent, ...rest }) => {
    const React = require('react')
    return React.createElement(UIComponent, {
      businessState: { business: { reviews: { total: 5 } } },
      reviewsList: {
        error: false,
        reviews: [{ id: 1, comment: 'Great food', created_at: '2026-01-01', total: 5 }]
      },
      goToBack: jest.fn(),
      ...rest
    })
  }
}))

describe('BusinessReviews UI', () => {
  it('renders review comment and heading', () => {
    const { getByText } = renderWithProviders(
      <BusinessReviews />
    )
    expect(getByText('Review order')).toBeTruthy()
    expect(getByText('Great food')).toBeTruthy()
  })
})

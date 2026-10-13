import { fireEvent } from '@testing-library/react-native'
import { Offers } from '../index'
import { renderWithProviders } from '../../../../../../../jest/helpers/renderWithProviders'
import {
  mockOffer,
  mockServiceOffer,
  offersUIProps
} from '../../../../../../../jest/helpers/appM9RewardsTestUtils'

jest.mock('@ui', () => require('../../../../../../../jest/helpers/appM9RewardsTestUtils').appM9UiMock)
jest.mock('react-native-fast-image', () => require('../../../../../../../jest/helpers/fastImageMock'))
jest.mock('rn-placeholder', () => require('../../../../../../../jest/helpers/appM9RewardsTestUtils').placeholderMock)
jest.mock('@components', () => ({
  ...require('../../../../../../../jest/helpers/mockOrdering'),
  useUtils: jest.fn(() => [require('../../../../../../../jest/helpers/appM9RewardsTestUtils').mockUtils]),
  PromotionsController: ({ UIComponent, ...rest }) => {
    const React = require('react')
    const [offerSelected, setOfferSelected] = React.useState(rest.offerSelected || null)
    const { offersUIProps } = require('../../../../../../../jest/helpers/appM9RewardsTestUtils')
    return React.createElement(UIComponent, {
      ...offersUIProps,
      ...rest,
      offerSelected: rest.offerSelected || offerSelected,
      setOfferSelected
    })
  }
}))

const renderOffers = (props = {}) => renderWithProviders(
  <Offers
    handleBusinessClick={jest.fn()}
    {...offersUIProps}
    {...props}
  />
)

describe('Offers UI', () => {
  it('renders offer cards', () => {
    const { getByText, getAllByText } = renderOffers()
    expect(getByText('Lunch Special')).toBeTruthy()
    expect(getByText('Save on lunch')).toBeTruthy()
    expect(getByText('Delivery Deal')).toBeTruthy()
    expect(getAllByText(/Expires/).length).toBeGreaterThan(0)
  })

  it('shows skeletons while offers load', () => {
    const { getAllByTestId, queryByText } = renderOffers({
      offersState: { loading: true, offers: [], error: null }
    })
    expect(getAllByTestId('placeholder').length).toBe(5)
    expect(queryByText('Lunch Special')).toBeNull()
  })

  it('shows an empty offers message', () => {
    const { getByText } = renderOffers({
      offersState: { loading: false, offers: [], error: null }
    })
    expect(getByText('Not found offers')).toBeTruthy()
  })

  it('shows an offers error', () => {
    const { getByText } = renderOffers({
      offersState: { loading: false, offers: [], error: 'Offer service down' }
    })
    expect(getByText('Offer service down')).toBeTruthy()
  })

  it('filters offers by search value', () => {
    const { getByText, queryByText } = renderOffers({ searchValue: 'delivery' })
    expect(getByText('Delivery Deal')).toBeTruthy()
    expect(queryByText('Lunch Special')).toBeNull()
  })

  it('opens a percent offer with a coupon and automatic rules', () => {
    const { getAllByText, getByText, getByTestId, queryByText } = renderOffers()
    fireEvent.press(getAllByText('View Benefits')[0])
    expect(getByText('Lunch Special / Value of offer: 10%')).toBeTruthy()
    expect(getByText('Your code:')).toBeTruthy()
    expect(getByText('LUNCH10')).toBeTruthy()
    expect(getByTestId('clipboard')).toBeTruthy()
    expect(getByText('Applies to: Subtotal')).toBeTruthy()
    expect(getByText('This offer applies automatic')).toBeTruthy()
    expect(getByText('Minimum purchase for use this offer: $20')).toBeTruthy()
    expect(getByText('Max discount allowed: $5')).toBeTruthy()
    expect(getByText('Available businesses for this offer:')).toBeTruthy()
    expect(getByText('Main Store')).toBeTruthy()
    expect(queryByText('Other Store')).toBeNull()
  })

  it('opens a delivery fee offer with a priced rate', () => {
    const { getAllByText, getByText } = renderOffers()
    fireEvent.press(getAllByText('View Benefits')[1])
    expect(getByText('Delivery Deal / Value of offer: $3')).toBeTruthy()
    expect(getByText('Applies to: Delivery fee')).toBeTruthy()
  })

  it('goes to a franchise business from the offer modal', () => {
    const handleBusinessClick = jest.fn()
    const { getAllByText, getByText, queryByTestId } = renderOffers({
      handleBusinessClick,
      franchiseId: 9
    })
    fireEvent.press(getAllByText('View Benefits')[0])
    fireEvent.press(getByText('Go to business'))
    expect(handleBusinessClick).toHaveBeenCalledWith(mockOffer.businesses[0])
    expect(queryByTestId('modal')).toBeNull()
  })

  it('shows a service-fee offer and a business without a logo', () => {
    const { getByText } = renderOffers({
      offersState: { loading: false, offers: [mockServiceOffer], error: null }
    })
    fireEvent.press(getByText('View Benefits'))
    expect(getByText('Service Deal / Value of offer: $3')).toBeTruthy()
    expect(getByText('Applies to: Service fee')).toBeTruthy()
    expect(getByText('No Logo Store')).toBeTruthy()
  })
})

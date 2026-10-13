import { fireEvent } from '@testing-library/react-native'
import { SingleGiftCard } from '../index'
import { renderWithProviders } from '../../../../../../../jest/helpers/renderWithProviders'
import {
  mockActivatedGiftCard,
  mockGiftCard,
  mockOtherStatusGiftCard
} from '../../../../../../../jest/helpers/appM9RewardsTestUtils'

jest.mock('@ui', () => require('../../../../../../../jest/helpers/appM9RewardsTestUtils').appM9UiMock)
jest.mock('react-native-fast-image', () => require('../../../../../../../jest/helpers/fastImageMock'))
jest.mock('rn-placeholder', () => require('../../../../../../../jest/helpers/appM9RewardsTestUtils').placeholderMock)
jest.mock('@components', () => ({
  ...require('../../../../../../../jest/helpers/mockOrdering'),
  useUtils: jest.fn(() => [require('../../../../../../../jest/helpers/appM9RewardsTestUtils').mockUtils])
}))

const renderCard = (props = {}) => renderWithProviders(
  <SingleGiftCard card={mockGiftCard} {...props} />
)

describe('SingleGiftCard UI', () => {
  it('renders product name price date and pending status', () => {
    const { getByText } = renderCard()
    expect(getByText('Birthday Card')).toBeTruthy()
    expect(getByText('$25')).toBeTruthy()
    expect(getByText('2026-09-07 16:00:00')).toBeTruthy()
    expect(getByText('Pending')).toBeTruthy()
  })

  it('maps activated cards to redeemed', () => {
    const { getByText } = renderCard({ card: mockActivatedGiftCard })
    expect(getByText('Redeemed Card')).toBeTruthy()
    expect(getByText('Redeemed')).toBeTruthy()
  })

  it('keeps an unknown status label', () => {
    const { getByText } = renderCard({ card: mockOtherStatusGiftCard })
    expect(getByText('sent')).toBeTruthy()
  })

  it('opens the related order from a press', () => {
    const onNavigationRedirect = jest.fn()
    const { getByText } = renderCard({ onNavigationRedirect })
    fireEvent.press(getByText('Birthday Card'))
    expect(onNavigationRedirect).toHaveBeenCalledWith('OrderDetails', { orderId: 901 })
  })

  it('renders a skeleton while the card is loading', () => {
    const { getAllByTestId, queryByText } = renderCard({ isSkeleton: true })
    expect(getAllByTestId('placeholder').length).toBeGreaterThan(0)
    expect(queryByText('Birthday Card')).toBeNull()
  })
})

import { fireEvent } from '@testing-library/react-native'
import { Status } from '../index'
import { renderWithProviders } from '../../../../../../../jest/helpers/renderWithProviders'
import {
  mockHighPointsLevel,
  mockLastLoyaltyLevel,
  mockLevelList,
  mockLoyaltyLevel
} from '../../../../../../../jest/helpers/appM9RewardsTestUtils'

jest.mock('@ui', () => require('../../../../../../../jest/helpers/appM9RewardsTestUtils').appM9UiMock)
jest.mock('react-native-fast-image', () => require('../../../../../../../jest/helpers/fastImageMock'))
jest.mock('react-native-linear-gradient', () => require('../../../../../../../jest/helpers/appM9RewardsTestUtils').linearGradientMock)

const renderStatus = (props = {}) => renderWithProviders(
  <Status
    userLoyaltyLevel={{ loyaltyLevel: mockLoyaltyLevel }}
    levelList={{ levels: [...mockLevelList.levels] }}
    {...props}
  />
)

describe('Status UI', () => {
  it('renders the current level and remaining points', () => {
    const { getByText, getByTestId } = renderStatus()
    expect(getByText('Gold')).toBeTruthy()
    expect(getByText(/80/)).toBeTruthy()
    expect(getByText('Points')).toBeTruthy()
    expect(getByText('You need 70 to reach Platinum')).toBeTruthy()
    expect(getByTestId('linear-gradient')).toBeTruthy()
    expect(getByText('View Benefits')).toBeTruthy()
  })

  it('opens loyalty benefits', () => {
    const { getByText, getByTestId } = renderStatus()
    fireEvent.press(getByText('View Benefits'))
    expect(getByTestId('modal')).toBeTruthy()
    expect(getByText('Free dessert')).toBeTruthy()
    expect(getByText('Priority seat')).toBeTruthy()
  })

  it('closes the benefits modal', () => {
    const { getByText, getByTestId, queryByTestId, queryByText } = renderStatus()
    fireEvent.press(getByText('View Benefits'))
    expect(getByTestId('modal')).toBeTruthy()
    fireEvent.press(getByText('View Benefits'))
    expect(queryByTestId('modal')).toBeNull()
    expect(queryByText('Free dessert')).toBeNull()
  })

  it('shows last-level copy without a benefits action', () => {
    const { getByText, queryByText } = renderStatus({
      userLoyaltyLevel: { loyaltyLevel: mockLastLoyaltyLevel }
    })
    expect(getByText('Platinum')).toBeTruthy()
    expect(getByText('You already reach the last level')).toBeTruthy()
    expect(queryByText('View Benefits')).toBeNull()
  })

  it('renders a compact points size for large balances', () => {
    const { getByText } = renderStatus({
      userLoyaltyLevel: { loyaltyLevel: mockHighPointsLevel }
    })
    expect(getByText(/100000/)).toBeTruthy()
    expect(getByText('You already reach the last level')).toBeTruthy()
  })
})

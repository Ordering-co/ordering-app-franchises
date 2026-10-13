import { fireEvent } from '@testing-library/react-native'
import { Rewards } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import {
  mockAuthSession,
  mockRewardsConfigs,
  rewardsUIProps
} from '../../../../../../jest/helpers/appM9RewardsTestUtils'

jest.mock('@ui', () => require('../../../../../../jest/helpers/appM9RewardsTestUtils').appM9UiMock)
jest.mock('react-native-fast-image', () => require('../../../../../../jest/helpers/fastImageMock'))
jest.mock('react-native-linear-gradient', () => require('../../../../../../jest/helpers/appM9RewardsTestUtils').linearGradientMock)
jest.mock('rn-placeholder', () => require('../../../../../../jest/helpers/appM9RewardsTestUtils').placeholderMock)
jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  useUtils: jest.fn(() => [require('../../../../../../jest/helpers/appM9RewardsTestUtils').mockUtils]),
  useSession: jest.fn(() => [{ auth: false, user: null, token: null }, {}]),
  useConfig: jest.fn(() => [{
    loading: false,
    configs: require('../../../../../../jest/helpers/appM9RewardsTestUtils').mockRewardsConfigs
  }]),
  WalletList: ({ UIComponent, ...rest }) => {
    const React = require('react')
    const { rewardsUIProps } = require('../../../../../../jest/helpers/appM9RewardsTestUtils')
    return React.createElement(UIComponent, { ...rewardsUIProps, ...rest })
  },
  PromotionsController: ({ UIComponent, ...rest }) => {
    const React = require('react')
    const { offersUIProps } = require('../../../../../../jest/helpers/appM9RewardsTestUtils')
    return React.createElement(UIComponent, { ...offersUIProps, ...rest })
  }
}))

const renderRewards = (props = {}) => renderWithProviders(
  <Rewards {...rewardsUIProps} {...props} />
)

describe('Rewards UI', () => {
  afterEach(() => {
    const { useSession, useConfig } = require('@components')
    useSession.mockReturnValue([{ auth: false, user: null, token: null }, {}])
    useConfig.mockReturnValue([{
      loading: false,
      configs: mockRewardsConfigs
    }])
  })

  it('asks guests to log in before showing rewards', () => {
    const { getByText, queryByText } = renderRewards()
    expect(getByText('You must be logged in to see the Rewards')).toBeTruthy()
    expect(queryByText('Redeem')).toBeNull()
  })

  it('renders the redeem tab for an authenticated user', () => {
    const { useSession } = require('@components')
    useSession.mockReturnValue([mockAuthSession, {}])
    const { getByText, getAllByText } = renderRewards()
    expect(getAllByText('Redeem').length).toBeGreaterThan(0)
    expect(getByText('My Status')).toBeTruthy()
    expect(getByText('Offers')).toBeTruthy()
    expect(getByText('Special member')).toBeTruthy()
    expect(getByText('Available Points')).toBeTruthy()
    expect(getByText('Cash Wallet')).toBeTruthy()
  })

  it('switches to the status tab', () => {
    const { useSession } = require('@components')
    useSession.mockReturnValue([mockAuthSession, {}])
    const { getByText, queryByText } = renderRewards()
    fireEvent.press(getByText('My Status'))
    expect(getByText('Gold')).toBeTruthy()
    expect(getByText('Points')).toBeTruthy()
    expect(queryByText('Special member')).toBeNull()
  })

  it('switches to the offers tab', () => {
    const { useSession } = require('@components')
    useSession.mockReturnValue([mockAuthSession, {}])
    const { getByText } = renderRewards({ franchiseId: 9 })
    fireEvent.press(getByText('Offers'))
    expect(getByText('Lunch Special')).toBeTruthy()
    expect(getByText('Delivery Deal')).toBeTruthy()
  })

  it('keeps gift card actions on the redeem tab', () => {
    const { useSession } = require('@components')
    useSession.mockReturnValue([mockAuthSession, {}])
    const onNavigationRedirect = jest.fn()
    const { getByText, getAllByText } = renderRewards({ onNavigationRedirect })
    fireEvent.press(getByText('Purchase'))
    expect(onNavigationRedirect).toHaveBeenCalledWith(
      'RewardsPurchaseGiftCard',
      expect.objectContaining({ handleCustomGoToCheckout: expect.any(Function) })
    )
    const redeemLabels = getAllByText('Redeem')
    fireEvent.press(redeemLabels[redeemLabels.length - 1])
    expect(onNavigationRedirect).toHaveBeenCalledWith('RewardsRedeemGiftCard')
  })
})

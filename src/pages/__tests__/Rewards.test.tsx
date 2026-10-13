import { fireEvent } from '@testing-library/react-native'
import { useBusinessSelected } from '@ui'

import Rewards from '../Rewards'
import { renderPage } from '../../../jest/helpers/renderPage'
import { setupPageTestEnv } from '../../../jest/helpers/pageTestSetup'

jest.mock('@ui', () => require('../../../jest/helpers/mockUi'))

jest.mock('../../config.js', () => ({
  __esModule: true,
  default: { franchiseSlug: 'franchise-a' }
}))

describe('Rewards page', () => {
  const mockOnChangeBusinessSelected = jest.fn()

  beforeEach(() => {
    setupPageTestEnv()
    useBusinessSelected.mockReturnValue([
      { id: 10, slug: 'demo-store' },
      { onChangeBusinessSelected: mockOnChangeBusinessSelected }
    ])
    mockOnChangeBusinessSelected.mockResolvedValue(undefined)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders rewards with franchise id', () => {
    const { getByTestId } = renderPage(Rewards)
    expect(getByTestId('rewards-controller')).toBeTruthy()
    expect(getByTestId('rewards-franchise-id').props.children).toBe('franchise-a')
  })

  it('navigates to rewards transactions', () => {
    const { getByTestId, navigation } = renderPage(Rewards)
    fireEvent.press(getByTestId('rewards-nav'))
    expect(navigation.navigate).toHaveBeenCalledWith('RewardsTransactions', { walletId: 1 })
  })

  it('selects business and navigates to business tab', async () => {
    const { getByTestId, navigation } = renderPage(Rewards)
    fireEvent.press(getByTestId('rewards-business'))
    await Promise.resolve()
    expect(mockOnChangeBusinessSelected).toHaveBeenCalledWith({ slug: 'demo-store', id: 1 })
    expect(navigation.navigate).toHaveBeenCalledWith('BottomTab', {
      screen: 'Business',
      store: 'demo-store'
    })
  })
})

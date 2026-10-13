import { fireEvent } from '@testing-library/react-native'

import RedeemGiftCard from '../RedeemGiftCard'
import { renderPage } from '../../../jest/helpers/renderPage'
import { setupPageTestEnv } from '../../../jest/helpers/pageTestSetup'

jest.mock('@ui', () => require('../../../jest/helpers/mockUi'))

describe('RedeemGiftCard page', () => {
  beforeEach(() => {
    setupPageTestEnv()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders redeem gift card controller', () => {
    const { getByTestId } = renderPage(RedeemGiftCard, {
      route: { params: { code: 'GIFT123' } }
    })
    expect(getByTestId('navbar-title').props.children).toBe('Redeem a gift card')
    expect(getByTestId('redeem-gift-card-controller')).toBeTruthy()
  })

  it('goes back from navbar when navigation can go back', () => {
    const { getByTestId, navigation } = renderPage(RedeemGiftCard, {
      route: { params: {} }
    })
    fireEvent.press(getByTestId('navbar-back'))
    expect(navigation.goBack).toHaveBeenCalled()
  })

  it('navigates from redeem gift card controller', () => {
    const { getByTestId, navigation } = renderPage(RedeemGiftCard, {
      route: { params: {} }
    })
    fireEvent.press(getByTestId('redeem-gift-nav'))
    expect(navigation.navigate).toHaveBeenCalledWith('Profile', {})
  })
})

import { fireEvent } from '@testing-library/react-native'

import PurchaseGiftCard from '../PurchaseGiftCard'
import { renderPage } from '../../../jest/helpers/renderPage'
import { setupPageTestEnv } from '../../../jest/helpers/pageTestSetup'

jest.mock('@ui', () => require('../../../jest/helpers/mockUi'))

describe('PurchaseGiftCard page', () => {
  beforeEach(() => {
    setupPageTestEnv()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders purchase gift card controller', () => {
    const { getByTestId } = renderPage(PurchaseGiftCard, {
      route: { params: { amount: 50 } }
    })
    expect(getByTestId('navbar-title').props.children).toBe('Purchase gift card')
    expect(getByTestId('purchase-gift-card-controller')).toBeTruthy()
  })

  it('goes back from navbar when navigation can go back', () => {
    const { getByTestId, navigation } = renderPage(PurchaseGiftCard, {
      route: { params: {} }
    })
    fireEvent.press(getByTestId('navbar-back'))
    expect(navigation.goBack).toHaveBeenCalled()
  })

  it('navigates from purchase gift card controller', () => {
    const { getByTestId, navigation } = renderPage(PurchaseGiftCard, {
      route: { params: {} }
    })
    fireEvent.press(getByTestId('purchase-gift-nav'))
    expect(navigation.navigate).toHaveBeenCalledWith('RedeemGiftCard', {})
  })
})

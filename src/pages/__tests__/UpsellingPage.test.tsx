import { fireEvent } from '@testing-library/react-native'

import UpsellingPage from '../UpsellingPage'
import { renderPage } from '../../../jest/helpers/renderPage'
import { setupPageTestEnv } from '../../../jest/helpers/pageTestSetup'

jest.mock('@ui', () => require('../../../jest/helpers/mockUi'))

describe('UpsellingPage page', () => {
  beforeEach(() => {
    setupPageTestEnv()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders upselling with route params and navigates on redirect', () => {
    const { getByTestId, navigation } = renderPage(UpsellingPage, {
      route: { params: { cartUuid: 'abc', businessId: 3 } }
    })
    expect(getByTestId('navbar-title').props.children).toBe('Your order')
    expect(getByTestId('upselling-products')).toBeTruthy()
    fireEvent.press(getByTestId('upselling-nav'))
    expect(navigation.navigate).toHaveBeenCalledWith('ProductDetails', { productId: 9 })
  })

  it('navbar back opens business tab', () => {
    const { getByTestId, navigation } = renderPage(UpsellingPage)
    fireEvent.press(getByTestId('navbar-back'))
    expect(navigation.navigate).toHaveBeenCalledWith('BottomTab', { screen: 'Business' })
  })

  it('falls back to bottom tab from onGoBack when cannot go back', () => {
    const { getByTestId, navigation } = renderPage(UpsellingPage, {
      navigation: { canGoBack: jest.fn(() => false) }
    })
    fireEvent.press(getByTestId('upselling-go-back'))
    expect(navigation.navigate).toHaveBeenCalledWith('BottomTab')
  })
})

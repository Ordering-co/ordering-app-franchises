import { fireEvent } from '@testing-library/react-native'
import { useConfig, useOrder } from '@components'

import ProductDetails from '../ProductDetails'
import { renderPage } from '../../../jest/helpers/renderPage'
import { setupPageTestEnv } from '../../../jest/helpers/pageTestSetup'

jest.mock('@ui', () => require('../../../jest/helpers/mockUi'))

describe('ProductDetails page', () => {
  beforeEach(() => {
    setupPageTestEnv()
    useOrder.mockReturnValue([{ options: { type: 1 } }, {}])
    useConfig.mockReturnValue([{ configs: {} }])
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders product form with route params', () => {
    const { getByTestId } = renderPage(ProductDetails, {
      route: {
        params: {
          productId: 10,
          businessId: 2,
          productAddedToCartLength: 2
        }
      }
    })
    expect(getByTestId('product-form')).toBeTruthy()
  })

  it('goes back on save when navigation can go back', () => {
    const { getByTestId, navigation } = renderPage(ProductDetails)
    fireEvent.press(getByTestId('product-save'))
    expect(navigation.goBack).toHaveBeenCalled()
  })

  it('replaces to business tab on save when redirect flag is set', () => {
    const { getByTestId, navigation } = renderPage(ProductDetails, {
      route: {
        params: {
          isRedirect: 'business',
          alreadyInBusinessListing: false,
          business: { store: 'biz-1', header: 'H', logo: 'L' }
        }
      }
    })
    fireEvent.press(getByTestId('product-save'))
    expect(navigation.replace).toHaveBeenCalledWith('BottomTab', {
      screen: 'Business',
      store: 'biz-1',
      header: 'H',
      logo: 'L'
    })
  })

  it('navigates to business tab when handleGoBack cannot go back', () => {
    const { getByTestId, navigation } = renderPage(ProductDetails, {
      navigation: { canGoBack: jest.fn(() => false) },
      pageProps: { businessSlug: 'demo-store' }
    })
    fireEvent.press(getByTestId('product-go-back'))
    expect(navigation.navigate).toHaveBeenCalledWith('BottomTab', {
      screen: 'Business',
      store: 'demo-store'
    })
  })
})

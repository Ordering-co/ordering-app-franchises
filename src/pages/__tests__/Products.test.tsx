import { fireEvent } from '@testing-library/react-native'
import { StackActions } from '@react-navigation/native'
import { useBusinessSelected } from '@ui'

import Products from '../Products'
import { renderPage } from '../../../jest/helpers/renderPage'
import { setupPageTestEnv } from '../../../jest/helpers/pageTestSetup'

jest.mock('@ui', () => require('../../../jest/helpers/mockUi'))

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native')
  return {
    ...actual,
    StackActions: {
      replace: jest.fn((name: string, params: unknown) => ({
        type: 'REPLACE',
        payload: { name, params }
      }))
    }
  }
})

describe('Products page', () => {
  beforeEach(() => {
    setupPageTestEnv()
    useBusinessSelected.mockReturnValue([
      { id: 10, slug: 'demo-store', header: 'Header', logo: 'logo.png' },
      {}
    ])
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders with category name as navbar title', () => {
    const { getByTestId } = renderPage(Products, {
      route: { params: { categorySelected: { name: 'Burgers' } } }
    })
    expect(getByTestId('navbar-title').props.children).toBe('Burgers')
    expect(getByTestId('products-controller')).toBeTruthy()
  })

  it('navigates to product details on product click', () => {
    const { getByTestId, navigation } = renderPage(Products, {
      route: { params: { categorySelected: { name: 'Burgers', id: 3 } } }
    })
    fireEvent.press(getByTestId('products-click'))
    expect(navigation.navigate).toHaveBeenCalledWith('ProductDetails', {
      businessId: 10,
      categoryId: 3,
      productId: 99,
      product: { id: 99 },
      business: {
        store: 'demo-store',
        header: 'Header',
        logo: 'logo.png'
      },
      productAddedToCartLength: 2
    })
  })

  it('uses StackActions.replace when navigation redirect requests replace', () => {
    const { getByTestId, navigation } = renderPage(Products, {
      route: { params: { categorySelected: { name: 'Burgers' } } }
    })
    fireEvent.press(getByTestId('products-nav-replace'))
    expect(StackActions.replace).toHaveBeenCalledWith('Checkout', { cartId: 1 })
    expect(navigation.dispatch).toHaveBeenCalled()
  })
})

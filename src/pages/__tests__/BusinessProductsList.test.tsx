import { fireEvent } from '@testing-library/react-native'
import { StackActions } from '@react-navigation/native'
import { useApi, useOrder } from '@components'
import { useBusinessSelected } from '@ui'

import BusinessProductsList from '../BusinessProductsList'
import { renderPage } from '../../../jest/helpers/renderPage'
import { setupPageTestEnv } from '../../../jest/helpers/pageTestSetup'

jest.mock('@ui', () => require('../../../jest/helpers/mockUi'))
jest.mock('../../config', () => ({ __esModule: true, default: { businessSlug: null, franchiseSlug: 'demo-franchise' } }))

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native')
  return {
    ...actual,
    useIsFocused: () => true,
    StackActions: {
      replace: jest.fn((name: string, params: unknown) => ({
        type: 'REPLACE',
        payload: { name, params }
      }))
    }
  }
})

describe('BusinessProductsList page', () => {
  beforeEach(() => {
    setupPageTestEnv()
    useBusinessSelected.mockReturnValue([
      { slug: 'selected-store', id: 15 },
      { onChangeBusinessSelected: jest.fn() }
    ])
    useOrder.mockReturnValue([{ options: { address: { location: { lat: 1, lng: 2 } } } }, {}])
    useApi.mockReturnValue([{ ordering: 'mock-ordering' }, {}])
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders listing with product route params', () => {
    const { getByTestId, getByText } = renderPage(BusinessProductsList, {
      route: {
        params: {
          store: '15',
          productId: 99,
          categoryId: 3,
          header: 'Store Header',
          logo: 'store-logo',
          fromMulti: true
        }
      }
    })
    expect(getByTestId('business-products-listing')).toBeTruthy()
    expect(getByText('demo-franchise')).toBeTruthy()
  })

  it('uses StackActions.replace when navigation redirect requests replace', () => {
    const { getByTestId, navigation } = renderPage(BusinessProductsList, {
      route: { params: { store: '15' } }
    })
    fireEvent.press(getByTestId('bpl-nav-replace'))
    expect(StackActions.replace).toHaveBeenCalledWith('Checkout', { cartId: 1 })
    expect(navigation.dispatch).toHaveBeenCalled()
  })

  it('navigates normally and opens business tab on business click', () => {
    const { getByTestId, navigation } = renderPage(BusinessProductsList, {
      route: { params: { store: '15' } }
    })
    fireEvent.press(getByTestId('bpl-nav'))
    expect(navigation.navigate).toHaveBeenCalledWith('Cart', {})
    fireEvent.press(getByTestId('bpl-business'))
    expect(navigation.navigate).toHaveBeenCalledWith('BottomTab', { screen: 'Business' })
  })
})

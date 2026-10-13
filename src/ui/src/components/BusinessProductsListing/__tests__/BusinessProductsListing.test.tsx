import { useFreeDeliveryProgress, useOrder, useSession, useUtils } from '@components'
import { BusinessProductsListing, BusinessProductsListingUI } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import { mockBusiness, mockCart, mockNavigation, mockProduct } from '../../../../../../jest/helpers/appM4TestUtils'
import { ScrollView } from 'react-native'
import { fireEvent } from '@testing-library/react-native'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))
jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn(),
  useIsFocused: jest.fn(() => true)
}))
jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  BusinessAndProductList: () => {
    const React = require('react')
    const { Text } = require('react-native')
    return React.createElement(Text, { testID: 'business-products-listing-controller' }, 'BusinessProductsListing')
  }
}))

describe('BusinessProductsListing UI', () => {
  const uiProps = {
    navigation: mockNavigation,
    errors: null,
    businessState: {
      business: { ...mockBusiness, categories: [{ id: 1, name: 'Mains', rank: 1 }] },
      loading: false,
      error: null
    },
    categoryState: { products: [mockProduct], pagination: { currentPage: 1, totalPages: 1 } },
    featuredProducts: false,
    categorySelected: {},
    handleChangeSearch: jest.fn(),
    handleChangeCategory: jest.fn(),
    setAlertState: jest.fn(),
    setCategorySelected: jest.fn(),
    alertState: { open: false, content: [] },
    onNavigationRedirect: jest.fn(),
    franchiseId: 'demo-franchise'
  }

  beforeEach(() => {
    ;(useSession as jest.Mock).mockReturnValue([{ auth: true }])
    ;(useUtils as jest.Mock).mockReturnValue([{ parsePrice: (value: number) => `$${value}` }])
    ;(useFreeDeliveryProgress as jest.Mock).mockReturnValue({ status: 'hidden' })
  })

  it('shows franchise awareness immediately after business information', () => {
    ;(useOrder as jest.Mock).mockReturnValue([{
      loading: false,
      options: { type: 1, address: { address: 'Main', location: { lat: 1, lng: 2 } } },
      carts: {}
    }, { addProduct: jest.fn(), updateProduct: jest.fn() }])
    ;(useFreeDeliveryProgress as jest.Mock).mockReturnValue({ status: 'awareness', minimum: 30 })

    const { getByText, toJSON, UNSAFE_getAllByType } = renderWithProviders(<BusinessProductsListingUI {...uiProps} />)
    const serialized = JSON.stringify(toJSON())

    expect(getByText('Free delivery on orders $30+')).toBeTruthy()
    expect(serialized.indexOf('business-basic-information')).toBeLessThan(serialized.indexOf('free-delivery-progress'))
    expect(UNSAFE_getAllByType(ScrollView).find((view) => view.props.stickyHeaderIndices)?.props.stickyHeaderIndices).toEqual([2])
    expect(useFreeDeliveryProgress).toHaveBeenCalledWith({
      business: uiProps.businessState.business,
      cart: {},
      franchiseId: 'demo-franchise',
      enabled: true
    })
  })

  it('does not advertise free delivery when the business is closed', () => {
    ;(useOrder as jest.Mock).mockReturnValue([{
      loading: false,
      options: { type: 1, address: { address: 'Main', location: { lat: 1, lng: 2 } } },
      carts: {}
    }, { addProduct: jest.fn(), updateProduct: jest.fn() }])
    ;(useFreeDeliveryProgress as jest.Mock).mockReturnValue({ status: 'awareness', minimum: 30 })

    const business = { ...uiProps.businessState.business, open: false }
    const { queryByTestId } = renderWithProviders(
      <BusinessProductsListingUI {...uiProps} businessState={{ ...uiProps.businessState, business }} />
    )

    expect(useFreeDeliveryProgress).toHaveBeenCalledWith(
      expect.objectContaining({ enabled: false })
    )
    expect(queryByTestId('free-delivery-progress')).toBeNull()
  })

  it('places compact progress above the operable franchise cart CTA', () => {
    ;(useOrder as jest.Mock).mockReturnValue([{
      loading: false,
      options: { type: 1, address: { address: 'Main', location: { lat: 1, lng: 2 } } },
      carts: { 'businessId:1': { ...mockCart, business: mockBusiness } }
    }, { addProduct: jest.fn(), updateProduct: jest.fn() }])
    ;(useFreeDeliveryProgress as jest.Mock).mockReturnValue({
      status: 'progress', remainingAmount: 5, progressPercent: 75
    })

    const { getByTestId, toJSON } = renderWithProviders(<BusinessProductsListingUI {...uiProps} />)
    const serialized = JSON.stringify(toJSON())

    expect(getByTestId('free-delivery-progress')).toHaveProp('variant', 'compact')
    expect(serialized.indexOf('free-delivery-progress')).toBeLessThan(serialized.indexOf('franchise-cart-button'))
    expect(getByTestId('franchise-cart-button')).not.toBeDisabled()
  })

  it('reserves the measured floating footer height below the last product', () => {
    ;(useOrder as jest.Mock).mockReturnValue([{
      loading: false,
      options: { type: 1, address: { address: 'Main', location: { lat: 1, lng: 2 } } },
      carts: { 'businessId:1': { ...mockCart, business: mockBusiness } }
    }, { addProduct: jest.fn(), updateProduct: jest.fn() }])
    ;(useFreeDeliveryProgress as jest.Mock).mockReturnValue({
      status: 'progress', remainingAmount: 5, progressPercent: 75
    })

    const { getByTestId, UNSAFE_getAllByType } = renderWithProviders(<BusinessProductsListingUI {...uiProps} />)
    fireEvent(getByTestId('franchise-cart-footer'), 'layout', { nativeEvent: { layout: { height: 116 } } })
    expect(UNSAFE_getAllByType(ScrollView).find((view) => view.props.stickyHeaderIndices)?.props.contentContainerStyle.paddingBottom).toBeGreaterThanOrEqual(116)
  })
  it('loads products listing controller wiring', () => {
    const { getByTestId } = renderWithProviders(
      <BusinessProductsListing
        navigation={mockNavigation}
        onNavigationRedirect={jest.fn()}
      />
    )
    expect(getByTestId('business-products-listing-controller')).toBeTruthy()
  })
})

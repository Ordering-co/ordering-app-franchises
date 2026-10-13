import { CouponOffers } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import { mockCart } from '../../../../../../jest/helpers/appM4TestUtils'

jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  CouponControl: ({ UIComponent, ...rest }) => {
    const React = require('react')
    return React.createElement(UIComponent, {
      applyingOfferId: null,
      canLoadOffers: false,
      cart: require('../../../../../../jest/helpers/appM4TestUtils').mockCart,
      confirm: {},
      couponDefault: null,
      couponInput: '',
      handleButtonApplyClick: jest.fn(),
      handleLoadOffers: jest.fn(),
      handleOfferApplyClick: jest.fn(),
      handleOfferRemoveClick: jest.fn(),
      handleRemoveCouponClick: jest.fn(),
      offersState: { loading: false, error: null, offers: [] },
      onChangeInputCoupon: jest.fn(),
      onGoBack: jest.fn(),
      removingOfferId: null,
      setConfirm: jest.fn(),
      ...rest
    })
  }
}))

describe('CouponOffers UI', () => {
  it('renders coupon code entry', () => {
    const { getByText, getByPlaceholderText } = renderWithProviders(
      <CouponOffers cart={mockCart} />
    )
    expect(getByText('Enter a coupon code')).toBeTruthy()
    expect(getByPlaceholderText('Discount coupon')).toBeTruthy()
    expect(getByText('Apply')).toBeTruthy()
  })
})

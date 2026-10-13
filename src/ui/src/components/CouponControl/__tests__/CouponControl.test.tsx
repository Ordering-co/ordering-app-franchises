import { CouponControl } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import { mockCart } from '../../../../../../jest/helpers/appM4TestUtils'

jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  CouponControl: ({ UIComponent, ...rest }) => {
    const React = require('react')
    return React.createElement(UIComponent, {
      couponDefault: null,
      couponInput: '',
      handleButtonApplyClick: jest.fn(),
      handleRemoveCouponClick: jest.fn(),
      onChangeInputCoupon: jest.fn(),
      confirm: {},
      setConfirm: jest.fn(),
      cart: require('../../../../../../jest/helpers/appM4TestUtils').mockCart,
      ...rest
    })
  }
}))

describe('CouponControl UI', () => {
  it('renders coupon apply form', () => {
    const { getByText, getByPlaceholderText } = renderWithProviders(
      <CouponControl cart={mockCart} />
    )
    expect(getByPlaceholderText('Discount coupon')).toBeTruthy()
    expect(getByText('Apply')).toBeTruthy()
  })

  it('renders offers entry when offers can load', () => {
    const { getByText } = renderWithProviders(
      <CouponControl
        cart={mockCart}
        canLoadOffers
        onOpenOffers={jest.fn()}
      />
    )
    expect(getByText('Offers and coupons')).toBeTruthy()
    expect(getByText('Add a coupon or offer')).toBeTruthy()
  })
})

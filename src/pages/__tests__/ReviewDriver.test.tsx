import { fireEvent } from '@testing-library/react-native'

import ReviewDriver from '../ReviewDriver'
import { renderPage } from '../../../jest/helpers/renderPage'
import { setupPageTestEnv } from '../../../jest/helpers/pageTestSetup'

jest.mock('@ui', () => require('../../../jest/helpers/mockUi'))

describe('ReviewDriver page', () => {
  beforeEach(() => {
    setupPageTestEnv()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders review driver with route params and navigates', () => {
    const order = { id: 10, driver: { name: 'Driver' } }
    const { getByTestId, navigation } = renderPage(ReviewDriver, {
      route: { params: { order } }
    })
    expect(getByTestId('navbar-title').props.children).toBe('Reviews')
    expect(getByTestId('review-driver-controller')).toBeTruthy()
    fireEvent.press(getByTestId('review-driver-nav'))
    expect(navigation.navigate).toHaveBeenCalledWith('OrderDetails', { orderId: 2 })
  })

  it('navbar back only when can go back', () => {
    const { getByTestId, navigation } = renderPage(ReviewDriver, {
      navigation: { canGoBack: jest.fn(() => false) }
    })
    fireEvent.press(getByTestId('navbar-back'))
    expect(navigation.goBack).not.toHaveBeenCalled()
  })
})

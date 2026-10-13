import { fireEvent } from '@testing-library/react-native'

import BusinessReviews from '../BusinessReviews'
import { renderPage } from '../../../jest/helpers/renderPage'
import { setupPageTestEnv } from '../../../jest/helpers/pageTestSetup'

jest.mock('@ui', () => require('../../../jest/helpers/mockUi'))

describe('BusinessReviews page', () => {
  beforeEach(() => {
    setupPageTestEnv()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders reviews with navbar title', () => {
    const { getByTestId } = renderPage(BusinessReviews, {
      route: { params: { businessId: 1 } }
    })
    expect(getByTestId('navbar-title').props.children).toBe('Reviews')
    expect(getByTestId('business-reviews-controller')).toBeTruthy()
  })

  it('redirects and goes back from navbar', () => {
    const { getByTestId, navigation } = renderPage(BusinessReviews)
    fireEvent.press(getByTestId('business-reviews-redirect'))
    expect(navigation.navigate).toHaveBeenCalledWith('BusinessInfo', { id: 1 })
    fireEvent.press(getByTestId('navbar-back'))
    expect(navigation.goBack).toHaveBeenCalled()
  })

  it('does not go back when navigation cannot go back', () => {
    const { getByTestId, navigation } = renderPage(BusinessReviews, {
      navigation: { canGoBack: jest.fn(() => false) }
    })
    fireEvent.press(getByTestId('navbar-back'))
    expect(navigation.goBack).not.toHaveBeenCalled()
  })
})

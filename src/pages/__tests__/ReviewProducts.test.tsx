import { fireEvent } from '@testing-library/react-native'

import ReviewProducts from '../ReviewProducts'
import { renderPage } from '../../../jest/helpers/renderPage'
import { setupPageTestEnv } from '../../../jest/helpers/pageTestSetup'

jest.mock('@ui', () => require('../../../jest/helpers/mockUi'))

describe('ReviewProducts page', () => {
  beforeEach(() => {
    setupPageTestEnv()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders review products and navigates', () => {
    const { getByTestId, navigation } = renderPage(ReviewProducts, {
      route: { params: { order: { id: 30 } } }
    })
    expect(getByTestId('navbar-title').props.children).toBe('Reviews')
    fireEvent.press(getByTestId('review-products-nav'))
    expect(navigation.navigate).toHaveBeenCalledWith('Home', {})
  })

  it('navbar back when can go back', () => {
    const { getByTestId, navigation } = renderPage(ReviewProducts)
    fireEvent.press(getByTestId('navbar-back'))
    expect(navigation.goBack).toHaveBeenCalled()
  })
})

import { fireEvent } from '@testing-library/react-native'

import ReviewOrder from '../ReviewOrder'
import { renderPage } from '../../../jest/helpers/renderPage'
import { setupPageTestEnv } from '../../../jest/helpers/pageTestSetup'

jest.mock('@ui', () => require('../../../jest/helpers/mockUi'))

describe('ReviewOrder page', () => {
  beforeEach(() => {
    setupPageTestEnv()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders review order with route callbacks', () => {
    const { getByTestId, navigation } = renderPage(ReviewOrder, {
      route: { params: { order: { id: 20 } } }
    })
    expect(getByTestId('navbar-title').props.children).toBe('Reviews')
    fireEvent.press(getByTestId('review-order-nav'))
    expect(navigation.navigate).toHaveBeenCalledWith('ReviewProducts', { order: { id: 3 } })
  })
})

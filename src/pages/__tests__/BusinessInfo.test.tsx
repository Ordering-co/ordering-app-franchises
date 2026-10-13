import { fireEvent } from '@testing-library/react-native'

import BusinessInfo from '../BusinessInfo'
import { renderPage } from '../../../jest/helpers/renderPage'
import { setupPageTestEnv } from '../../../jest/helpers/pageTestSetup'

jest.mock('@ui', () => require('../../../jest/helpers/mockUi'))

describe('BusinessInfo page', () => {
  beforeEach(() => {
    setupPageTestEnv()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders short business name in navbar title', () => {
    const { getByTestId } = renderPage(BusinessInfo, {
      route: { params: { businessState: { business: { name: 'Short Name' } } } }
    })
    expect(getByTestId('navbar-title').props.children).toBe('Short Name')
    expect(getByTestId('business-information')).toBeTruthy()
  })

  it('hides navbar title for long business names', () => {
    const longName = 'A Very Long Business Name That Exceeds Thirty Characters'
    const { getByTestId } = renderPage(BusinessInfo, {
      route: { params: { businessState: { business: { name: longName } } } }
    })
    expect(getByTestId('navbar-title').props.children).toBeNull()
  })

  it('navigates on redirect and goes back from navbar', () => {
    const { getByTestId, navigation } = renderPage(BusinessInfo, {
      route: { params: { businessState: { business: { name: 'Store' } } } }
    })
    fireEvent.press(getByTestId('business-info-redirect'))
    expect(navigation.navigate).toHaveBeenCalledWith('BusinessReviews', { id: 1 })
    fireEvent.press(getByTestId('navbar-back'))
    expect(navigation.goBack).toHaveBeenCalled()
  })
})

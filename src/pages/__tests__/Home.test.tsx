import { fireEvent } from '@testing-library/react-native'

import Home from '../Home'
import { renderPage } from '../../../jest/helpers/renderPage'
import { setupPageTestEnv } from '../../../jest/helpers/pageTestSetup'

jest.mock('@ui', () => require('../../../jest/helpers/mockUi'))

describe('Home page', () => {
  beforeEach(() => {
    setupPageTestEnv()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders home view and navigates on redirect', () => {
    const { getByTestId, navigation } = renderPage(Home)
    expect(getByTestId('home-view')).toBeTruthy()
    fireEvent.press(getByTestId('home-nav'))
    expect(navigation.navigate).toHaveBeenCalledWith('BusinessListingSearch', { term: 'pizza' })
  })

  it('ignores empty navigation redirect', () => {
    const { getByTestId, navigation } = renderPage(Home)
    fireEvent.press(getByTestId('home-nav-empty'))
    expect(navigation.navigate).not.toHaveBeenCalled()
  })
})

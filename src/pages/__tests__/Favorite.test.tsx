import { fireEvent } from '@testing-library/react-native'

import Favorite from '../Favorite'
import { renderPage } from '../../../jest/helpers/renderPage'
import { setupPageTestEnv } from '../../../jest/helpers/pageTestSetup'

jest.mock('@ui', () => require('../../../jest/helpers/mockUi'))

describe('Favorite page', () => {
  beforeEach(() => {
    setupPageTestEnv()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders favorites with franchise id and navbar title', () => {
    const { getByTestId } = renderPage(Favorite)
    expect(getByTestId('navbar-title').props.children).toBe('My Favorites')
    expect(getByTestId('favorite-controller')).toBeTruthy()
    expect(getByTestId('favorite-franchise-id').props.children).toBe('null')
  })

  it('goes back from navbar when navigation can go back', () => {
    const { getByTestId, navigation } = renderPage(Favorite)
    fireEvent.press(getByTestId('navbar-back'))
    expect(navigation.goBack).toHaveBeenCalled()
  })

  it('does not go back when navigation cannot go back', () => {
    const { getByTestId, navigation } = renderPage(Favorite, {
      navigation: { canGoBack: jest.fn(() => false) }
    })
    fireEvent.press(getByTestId('navbar-back'))
    expect(navigation.goBack).not.toHaveBeenCalled()
  })
})

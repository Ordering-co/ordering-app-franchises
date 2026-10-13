import { FavoriteList } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import { mockNavigation } from '../../../../../../jest/helpers/appM3TestUtils'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))
jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  FavoriteList: ({ UIComponent, ...rest }) => {
    const React = require('react')
    return React.createElement(UIComponent, {
      isBusiness: true,
      favoriteList: { loading: false, favorites: [] },
      pagination: {},
      navigation: require('../../../../../../jest/helpers/appM3TestUtils').mockNavigation,
      onNavigationRedirect: jest.fn(),
      handleUpdateFavoriteList: jest.fn(),
      getFavoriteList: jest.fn(),
      reorderState: {},
      ...rest
    })
  }
}))

describe('FavoriteList UI', () => {
  it('renders empty favorites state', () => {
    const { getByText } = renderWithProviders(
      <FavoriteList
        isBusiness
        navigation={mockNavigation}
        onNavigationRedirect={jest.fn()}
      />
    )
    expect(getByText('No favorites to show at this time.')).toBeTruthy()
  })
})

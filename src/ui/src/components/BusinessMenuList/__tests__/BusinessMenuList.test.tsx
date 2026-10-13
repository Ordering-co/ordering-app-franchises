import { BusinessMenuList } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('rn-placeholder', () => ({
  Fade: ({ children }) => children,
  Placeholder: ({ children }) => children,
  PlaceholderLine: () => null
}))
jest.mock('react-native-select-dropdown', () => {
  const React = require('react')
  const { Text } = require('react-native')
  return ({ data, defaultButtonText }) => (
    React.createElement(Text, { testID: 'select-dropdown' }, data?.[0]?.name || defaultButtonText)
  )
})
jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  BusinessMenuListing: ({ UIComponent, ...rest }) => {
    const React = require('react')
    return React.createElement(UIComponent, {
      businessMenuList: { loading: false, menus: [] },
      setMenu: jest.fn(),
      ...rest
    })
  }
}))

describe('BusinessMenuList UI', () => {
  it('renders empty menu state', () => {
    const { getByText } = renderWithProviders(
      <BusinessMenuList />
    )
    expect(getByText('Sorry, no results found')).toBeTruthy()
  })
})

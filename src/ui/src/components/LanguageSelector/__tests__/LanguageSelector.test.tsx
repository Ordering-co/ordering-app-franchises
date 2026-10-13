import { LanguageSelector } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))
jest.mock('react-native-picker-select', () => {
  const React = require('react')
  const { View } = require('react-native')
  return ({ testID = 'language-picker' }) => React.createElement(View, { testID })
})

jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  LanguageSelector: ({ UIComponent, ...rest }) => {
    const React = require('react')
    return React.createElement(UIComponent, {
      ...require('../../../../../../jest/helpers/appUiTestUtils').baseLanguageSelectorUIProps,
      ...rest
    })
  },
  useOrder: jest.fn(() => [{ loading: false }, {}])
}))

describe('LanguageSelector UI', () => {
  it('renders language picker when multiple locales exist', () => {
    const { getByTestId } = renderWithProviders(<LanguageSelector />)
    expect(getByTestId('language-picker')).toBeTruthy()
  })
})

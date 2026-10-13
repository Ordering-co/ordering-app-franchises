import { Help } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import { baseHelpUIProps } from '../../../../../../jest/helpers/appM2TestUtils'

jest.mock('../functions', () => ({
  CmsContent: ({ UIComponent, ...rest }) => {
    const React = require('react')
    return React.createElement(UIComponent, {
      ...require('../../../../../../jest/helpers/appM2TestUtils').baseHelpUIProps,
      ...rest
    })
  }
}))
jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))
jest.mock('rn-placeholder', () => ({
  Fade: ({ children }) => children,
  Placeholder: ({ children }) => children,
  PlaceholderLine: () => null
}))

describe('Help UI', () => {
  it('renders help item list', () => {
    const { getByText } = renderWithProviders(<Help onRedirect={jest.fn()} />)
    expect(getByText('FAQ')).toBeTruthy()
  })
})

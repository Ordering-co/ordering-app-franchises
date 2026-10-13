import { Sessions } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import { baseSessionsUIProps } from '../../../../../../jest/helpers/appUiTestUtils'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))
jest.mock('rn-placeholder', () => ({
  Fade: ({ children }) => children,
  Placeholder: ({ children }) => children,
  PlaceholderLine: () => null
}))

jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  Sessions: ({ UIComponent, ...rest }) => {
    const React = require('react')
    return React.createElement(UIComponent, {
      ...require('../../../../../../jest/helpers/appUiTestUtils').baseSessionsUIProps,
      ...rest
    })
  },
  useSession: jest.fn(() => [{
    user: { session_strategy: 'jwt_session' }
  }, {}]),
  useUtils: jest.fn(() => [{ parseDate: (value) => value || '2026-01-01' }])
}))

describe('Sessions UI', () => {
  it('renders sessions list actions', () => {
    const { getByText } = renderWithProviders(<Sessions />)
    expect(getByText('Delete all sessions')).toBeTruthy()
    expect(getByText('Delete all sessions except current')).toBeTruthy()
  })
})

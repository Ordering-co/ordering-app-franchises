/**
 * Runs after the test framework is installed (setupFilesAfterEnv).
 */
/* eslint-env jest */

jest.mock('@components', () => require('./helpers/mockOrdering'))

jest.mock('@ui', () => ({
  Toast: () => null,
  SafeAreaViewWrapper: ({ children }) => children,
  NavBar: ({ children }) => children,
  useHomeValues: jest.fn(() => [{ userAddressStoraged: null }])
}))

const { cleanup } = require('@testing-library/react-native')

afterEach(() => {
  cleanup()
  jest.clearAllMocks()
})

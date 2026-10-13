import { PoweredBy } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  useConfig: jest.fn(() => [{
    configs: { powered_by_ordering_module: { value: true } }
  }])
}))
jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))

describe('PoweredBy UI', () => {
  it('renders powered by label', () => {
    const { getByText } = renderWithProviders(<PoweredBy />)
    expect(getByText(/Powered by/)).toBeTruthy()
  })
})

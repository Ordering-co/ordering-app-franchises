import { HelpOptions } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))
jest.mock('react-native-webview', () => 'WebView')

describe('HelpOptions UI', () => {
  it('renders empty state when item body is missing', () => {
    const { getByText } = renderWithProviders(<HelpOptions item={{}} />)
    expect(getByText('Nothing to show')).toBeTruthy()
  })
})

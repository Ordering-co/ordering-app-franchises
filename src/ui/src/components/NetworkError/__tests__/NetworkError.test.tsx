import { NetworkError } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('react-native-restart', () => ({ Restart: jest.fn() }))

describe('NetworkError UI', () => {
  it('renders network error message', () => {
    const { getByText } = renderWithProviders(<NetworkError />)
    expect(getByText('No internet connection')).toBeTruthy()
  })
})

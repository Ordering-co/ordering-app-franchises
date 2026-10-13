import { CitiesControl } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

describe('CitiesControl UI', () => {
  it('renders city name and continue action', () => {
    const { getByText } = renderWithProviders(
      <CitiesControl
        cities={[{ id: 1, name: 'New York', enabled: true }]}
        onClose={jest.fn()}
        handleChangeCity={jest.fn()}
      />
    )
    expect(getByText('New York')).toBeTruthy()
    expect(getByText('Continue')).toBeTruthy()
  })
})

import { NotFoundSource } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

describe('NotFoundSource UI', () => {
  it('renders not found content text', () => {
    const { getByText } = renderWithProviders(
      <NotFoundSource content='No results found' />
    )
    expect(getByText('No results found')).toBeTruthy()
  })
})

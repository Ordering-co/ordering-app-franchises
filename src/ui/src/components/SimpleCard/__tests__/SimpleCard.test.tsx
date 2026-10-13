import { SimpleCard } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))
jest.mock('react-native-fast-image', () => require('../../../../../../jest/helpers/fastImageMock'))

describe('SimpleCard UI', () => {
  it('renders card title', () => {
    const { getByText } = renderWithProviders(
      <SimpleCard title='Promotions' />
    )
    expect(getByText('Promotions')).toBeTruthy()
  })
})

import { InfoMessage } from '../InfoMessage'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))

describe('Checkout InfoMessage', () => {
  it('renders the info text', () => {
    const { getByText } = renderWithProviders(
      <InfoMessage text='Please confirm your details' color='#344050' />
    )
    expect(getByText('Please confirm your details')).toBeTruthy()
  })
})

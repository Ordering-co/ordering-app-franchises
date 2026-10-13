import { NavBarCustomized } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))

describe('NavBarCustomized UI', () => {
  it('renders customized title from business selection', () => {
    const { getByText } = renderWithProviders(
      <NavBarCustomized onActionLeft={jest.fn()} />
    )
    expect(getByText('Demo Store')).toBeTruthy()
  })
})

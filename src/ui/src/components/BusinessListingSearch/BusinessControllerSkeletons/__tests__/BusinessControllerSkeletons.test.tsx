import { BusinessControllerSkeletons } from '../index'
import { renderWithProviders } from '../../../../../../../jest/helpers/renderWithProviders'

jest.mock('rn-placeholder', () => ({
  Fade: ({ children }) => children,
  Placeholder: ({ children }) => children,
  PlaceholderLine: () => null
}))

describe('BusinessControllerSkeletons UI', () => {
  it('renders placeholder skeletons', () => {
    const { toJSON } = renderWithProviders(
      <BusinessControllerSkeletons paginationProps={{ nextPageItems: 2 }} />
    )
    expect(toJSON()).toBeTruthy()
  })
})

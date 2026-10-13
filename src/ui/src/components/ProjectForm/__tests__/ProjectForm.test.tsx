import { ProjectForm } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import { baseProjectFormUIProps } from '../../../../../../jest/helpers/appUiTestUtils'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))

jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  ProjectForm: ({ UIComponent, ...rest }) => {
    const React = require('react')
    return React.createElement(UIComponent, {
      ...require('../../../../../../jest/helpers/appUiTestUtils').baseProjectFormUIProps,
      ...rest
    })
  },
  useApi: jest.fn(() => [{ project: 'demo' }, {}])
}))

describe('ProjectForm UI', () => {
  it('renders project input form', () => {
    const { getByText, getByPlaceholderText } = renderWithProviders(
      <ProjectForm onNavigationRedirect={jest.fn()} onSubmit={jest.fn()} />
    )
    expect(getByText('Project')).toBeTruthy()
    expect(getByPlaceholderText('Project Name')).toBeTruthy()
  })
})

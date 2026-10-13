import { fireEvent } from '@testing-library/react-native'

import ProjectForm from '../ProjectForm'
import { renderPage } from '../../../jest/helpers/renderPage'
import { setupPageTestEnv } from '../../../jest/helpers/pageTestSetup'

jest.mock('@ui', () => require('../../../jest/helpers/mockUi'))

describe('ProjectForm page', () => {
  beforeEach(() => {
    setupPageTestEnv()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders project form controller', () => {
    const { getByTestId } = renderPage(ProjectForm)
    expect(getByTestId('project-form-controller')).toBeTruthy()
  })

  it('navigates from project form controller', () => {
    const { getByTestId, navigation } = renderPage(ProjectForm)
    fireEvent.press(getByTestId('project-form-nav'))
    expect(navigation.navigate).toHaveBeenCalledWith('Login', {})
  })

  it('ignores empty navigation page', () => {
    const { getByTestId, navigation } = renderPage(ProjectForm)
    fireEvent.press(getByTestId('project-form-nav-empty'))
    expect(navigation.navigate).not.toHaveBeenCalled()
  })
})

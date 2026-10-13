import { fireEvent } from '@testing-library/react-native'

import HelpOptions from '../HelpOptions'
import { renderPage } from '../../../jest/helpers/renderPage'
import { setupPageTestEnv } from '../../../jest/helpers/pageTestSetup'

jest.mock('@ui', () => require('../../../jest/helpers/mockUi'))

describe('HelpOptions page', () => {
  beforeEach(() => {
    setupPageTestEnv()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders help options with route params', () => {
    const { getByTestId } = renderPage(HelpOptions, {
      route: { params: { type: 'faq' } }
    })
    expect(getByTestId('navbar-title').props.children).toBe('Help')
    expect(getByTestId('help-options-type').props.children).toBe('faq')
  })

  it('goes back from navbar when navigation can go back', () => {
    const { getByTestId, navigation } = renderPage(HelpOptions)
    fireEvent.press(getByTestId('navbar-back'))
    expect(navigation.goBack).toHaveBeenCalled()
  })
})

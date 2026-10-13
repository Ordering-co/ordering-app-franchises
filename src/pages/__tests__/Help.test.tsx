import { fireEvent } from '@testing-library/react-native'
import { useBusiness } from '@components'

import Help from '../Help'
import { renderPage } from '../../../jest/helpers/renderPage'
import { setupPageTestEnv } from '../../../jest/helpers/pageTestSetup'

jest.mock('@ui', () => require('../../../jest/helpers/mockUi'))

jest.mock('../../config.js', () => ({
  __esModule: true,
  default: { franchiseSlug: 'franchise-a' }
}))

describe('Help page', () => {
  beforeEach(() => {
    setupPageTestEnv()
    useBusiness.mockReturnValue([{ business: { id: 42 } }])
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders help with franchise and business context', () => {
    const { getByTestId } = renderPage(Help)
    expect(getByTestId('navbar-title').props.children).toBe('Help')
    expect(getByTestId('help-franchise-id').props.children).toBe('franchise-a')
    expect(getByTestId('help-business-id').props.children).toBe('42')
  })

  it('goes back from navbar when navigation can go back', () => {
    const { getByTestId, navigation } = renderPage(Help)
    fireEvent.press(getByTestId('navbar-back'))
    expect(navigation.goBack).toHaveBeenCalled()
  })

  it('redirects to help options', () => {
    const { getByTestId, navigation } = renderPage(Help)
    fireEvent.press(getByTestId('help-redirect'))
    expect(navigation.navigate).toHaveBeenCalledWith('HelpOptions', { type: 'faq' })
  })
})

import { fireEvent } from '@testing-library/react-native'
import { useSession } from '@components'

import NotFound from '../NotFound'
import { renderPage } from '../../../jest/helpers/renderPage'
import { setupPageTestEnv } from '../../../jest/helpers/pageTestSetup'

jest.mock('@ui', () => require('../../../jest/helpers/mockUi'))

describe('NotFound page', () => {
  beforeEach(() => {
    setupPageTestEnv()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders page not found copy for guests', () => {
    const { getByTestId } = renderPage(NotFound)
    expect(getByTestId('not-found-content').props.children).toBe('Page not found')
    expect(getByTestId('not-found-button')).toBeTruthy()
  })

  it('navigates home when guest taps the action button', () => {
    const { getByTestId, navigation } = renderPage(NotFound)
    fireEvent.press(getByTestId('not-found-button'))
    expect(navigation.navigate).toHaveBeenCalledWith('Home')
  })

  it('navigates to business list when authed user taps the action button', () => {
    useSession.mockReturnValue([{ auth: true, user: { id: 1 } }, { login: jest.fn() }])
    const { getByTestId, navigation } = renderPage(NotFound)
    fireEvent.press(getByTestId('not-found-button'))
    expect(navigation.navigate).toHaveBeenCalledWith('Business')
  })
})

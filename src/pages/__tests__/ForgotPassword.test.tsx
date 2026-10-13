import ForgotPassword from '../ForgotPassword'
import { renderPage } from '../../../jest/helpers/renderPage'
import { setupPageTestEnv } from '../../../jest/helpers/pageTestSetup'

jest.mock('@ui', () => require('../../../jest/helpers/mockUi'))

describe('ForgotPassword page', () => {
  beforeEach(() => {
    setupPageTestEnv()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders forgot password form inside safe area', () => {
    const { getByTestId } = renderPage(ForgotPassword, {
      pageProps: { titleNavbar: 'Forgot password' }
    })
    expect(getByTestId('navbar-title').props.children).toBe('Forgot password')
    expect(getByTestId('forgot-password-form')).toBeTruthy()
  })
})

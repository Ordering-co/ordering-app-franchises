import UserVerification from '../UserVerification'
import { renderPage } from '../../../jest/helpers/renderPage'
import { setupPageTestEnv } from '../../../jest/helpers/pageTestSetup'

jest.mock('@ui', () => require('../../../jest/helpers/mockUi'))

describe('UserVerification page', () => {
  beforeEach(() => {
    setupPageTestEnv()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders verification controller', () => {
    const { getByTestId } = renderPage(UserVerification)
    expect(getByTestId('user-verification-controller')).toBeTruthy()
  })
})

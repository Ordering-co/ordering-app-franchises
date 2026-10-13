import NetworkError from '../NetworkError'
import { renderPage } from '../../../jest/helpers/renderPage'
import { setupPageTestEnv } from '../../../jest/helpers/pageTestSetup'

jest.mock('@ui', () => require('../../../jest/helpers/mockUi'))

describe('NetworkError page', () => {
  beforeEach(() => {
    setupPageTestEnv()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders offline state when not loading data', () => {
    const { getByTestId } = renderPage(NetworkError, {
      route: { params: { loadingData: false } }
    })
    expect(getByTestId('network-error-screen')).toBeTruthy()
    expect(getByTestId('network-error-title')).toBeTruthy()
  })

  it('renders loading state when loadingData is true', () => {
    const { getByTestId, queryByTestId } = renderPage(NetworkError, {
      route: { params: { loadingData: true } }
    })
    expect(getByTestId('network-error-loading')).toBeTruthy()
    expect(queryByTestId('network-error-title')).toBeNull()
  })
})

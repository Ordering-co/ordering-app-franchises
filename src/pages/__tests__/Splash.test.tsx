import { fireEvent } from '@testing-library/react-native'
import { Dimensions, Platform } from 'react-native'
import { useConfig } from '@components'

import Splash from '../Splash'
import { renderWithProviders } from '../../../jest/helpers/renderWithProviders'
import { setupPageTestEnv } from '../../../jest/helpers/pageTestSetup'

jest.mock('@ui', () => require('../../../jest/helpers/mockUi'))

describe('Splash page', () => {
  beforeEach(() => {
    setupPageTestEnv()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders logo and powered-by text when enabled', () => {
    const { getByTestId, getByText } = renderWithProviders(<Splash />)
    expect(getByTestId('o-icon')).toBeTruthy()
    expect(getByText('Powered by OrderingPlus')).toBeTruthy()
  })

  it('hides powered-by when config is off', () => {
    useConfig.mockReturnValue([{
      configs: { powered_by_ordering_module: { value: false } }
    }])
    const { queryByText } = renderWithProviders(<Splash />)
    expect(queryByText('Powered by OrderingPlus')).toBeNull()
  })

  it('selects android splash assets', () => {
    Platform.OS = 'android'
    jest.spyOn(Dimensions, 'get').mockImplementation((dim) => {
      const size = dim === 'window' ? { width: 720, height: 1280 } : { width: 720, height: 1280 }
      return { ...size, scale: 2, fontScale: 2 }
    })
    const { getByTestId } = renderWithProviders(<Splash />)
    expect(getByTestId('o-icon')).toBeTruthy()
  })
})

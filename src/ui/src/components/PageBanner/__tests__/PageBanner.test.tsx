import { PageBanner } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import { basePageBannerUIProps } from '../../../../../../jest/helpers/appM2TestUtils'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))
jest.mock('react-native-fast-image', () => require('../../../../../../jest/helpers/fastImageMock'))
jest.mock('react-native-swiper-flatlist', () => ({
  SwiperFlatList: ({ children }) => children
}))

jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  PageBanner: ({ UIComponent, ...rest }) => {
    const React = require('react')
    return React.createElement(UIComponent, {
      ...require('../../../../../../jest/helpers/appM2TestUtils').basePageBannerUIProps,
      ...rest
    })
  }
}))

describe('PageBanner UI', () => {
  it('renders nothing when banner items are empty', () => {
    const { toJSON } = renderWithProviders(<PageBanner />)
    expect(toJSON()).toBeNull()
  })
})

import { fireEvent } from '@testing-library/react-native'
import { useBusiness } from '@components'
import { onChangeBusinessSelected } from '@ui'

import BusinessesListing from '../BusinessesListing'
import { renderPage } from '../../../jest/helpers/renderPage'
import { setupPageTestEnv } from '../../../jest/helpers/pageTestSetup'

jest.mock('@ui', () => require('../../../jest/helpers/mockUi'))

describe('BusinessesListing page', () => {
  beforeEach(() => {
    setupPageTestEnv()
    useBusiness.mockReturnValue([{ business: { id: 42 } }, {}])
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders listing and navigates to bottom tab on business click', () => {
    const { getByTestId, navigation } = renderPage(BusinessesListing, {
      route: { params: { isGuestUser: true } }
    })
    expect(getByTestId('businesses-listing')).toBeTruthy()
    expect(getByTestId('navbar-customized')).toBeTruthy()
    fireEvent.press(getByTestId('businesses-listing-business'))
    expect(onChangeBusinessSelected).toHaveBeenCalledWith({
      slug: 'demo-store',
      header: 'Header',
      logo: 'logo.png'
    })
    expect(navigation.navigate).toHaveBeenCalledWith('BottomTab')
  })
})

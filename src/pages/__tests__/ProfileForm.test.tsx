import { fireEvent } from '@testing-library/react-native'

import ProfileForm from '../ProfileForm'
import { renderPage } from '../../../jest/helpers/renderPage'
import { setupPageTestEnv } from '../../../jest/helpers/pageTestSetup'

jest.mock('@ui', () => require('../../../jest/helpers/mockUi'))

describe('ProfileForm page', () => {
  beforeEach(() => {
    setupPageTestEnv()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders account form with navbar title', () => {
    const { getByTestId } = renderPage(ProfileForm, {
      route: { params: { field: 'name' } }
    })
    expect(getByTestId('navbar-title').props.children).toBe('Account')
    expect(getByTestId('user-profile-form')).toBeTruthy()
  })

  it('goes back from navbar when navigation can go back', () => {
    const { getByTestId, navigation } = renderPage(ProfileForm, {
      route: { params: {} }
    })
    fireEvent.press(getByTestId('navbar-back'))
    expect(navigation.goBack).toHaveBeenCalled()
  })

  it('navigates from profile form controller', () => {
    const { getByTestId, navigation } = renderPage(ProfileForm, {
      route: { params: {} }
    })
    fireEvent.press(getByTestId('profile-form-nav'))
    expect(navigation.navigate).toHaveBeenCalledWith('Profile', {})
  })
})

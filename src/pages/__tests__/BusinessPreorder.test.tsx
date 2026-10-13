import { fireEvent } from '@testing-library/react-native'

import BusinessPreorder from '../BusinessPreorder'
import { renderPage } from '../../../jest/helpers/renderPage'
import { setupPageTestEnv } from '../../../jest/helpers/pageTestSetup'

jest.mock('@ui', () => require('../../../jest/helpers/mockUi'))

describe('BusinessPreorder page', () => {
  beforeEach(() => {
    setupPageTestEnv()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders preorder with navbar title and goes back', () => {
    const { getByTestId, navigation } = renderPage(BusinessPreorder, {
      route: { params: { business: { id: 1 } } }
    })
    expect(getByTestId('navbar-title').props.children).toBe('Preorder')
    expect(getByTestId('business-preorder-controller')).toBeTruthy()
    fireEvent.press(getByTestId('navbar-back'))
    expect(navigation.goBack).toHaveBeenCalled()
  })
})

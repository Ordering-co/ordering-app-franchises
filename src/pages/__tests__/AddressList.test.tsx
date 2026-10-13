import { fireEvent } from '@testing-library/react-native'
import { useOrder } from '@components'

import AddressList from '../AddressList'
import { renderPage } from '../../../jest/helpers/renderPage'
import { setupPageTestEnv } from '../../../jest/helpers/pageTestSetup'

jest.mock('@ui', () => require('../../../jest/helpers/mockUi'))

describe('AddressList page', () => {
  beforeEach(() => {
    setupPageTestEnv()
    useOrder.mockReturnValue([{ options: { type: 1 } }, {}])
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders delivery title for delivery order type', () => {
    const { getByTestId } = renderPage(AddressList, {
      route: { params: { userId: 7, newUser: true } }
    })
    expect(getByTestId('navbar-title').props.children).toBe('Delivering to')
    expect(getByTestId('address-list-controller')).toBeTruthy()
  })

  it('renders pickup title for non-delivery order type', () => {
    useOrder.mockReturnValue([{ options: { type: 2 } }, {}])
    const { getByTestId } = renderPage(AddressList)
    expect(getByTestId('navbar-title').props.children).toBe('Picking up from')
  })

  it('navigates to address form and goes back', () => {
    const { getByTestId, navigation } = renderPage(AddressList)
    fireEvent.press(getByTestId('address-list-nav'))
    expect(navigation.navigate).toHaveBeenCalledWith('AddressForm', { isEditing: true })
    fireEvent.press(getByTestId('address-list-back'))
    expect(navigation.goBack).toHaveBeenCalled()
  })

  it('does not go back when navigation cannot go back', () => {
    const { getByTestId, navigation } = renderPage(AddressList, {
      navigation: { canGoBack: jest.fn(() => false) }
    })
    fireEvent.press(getByTestId('address-list-back'))
    expect(navigation.goBack).not.toHaveBeenCalled()
  })
})

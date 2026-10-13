import { Text } from 'react-native'
import { fireEvent } from '@testing-library/react-native'
import { UserDetails } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import {
  mockChangedFormState,
  mockErrorArrayVerifyPhoneState,
  mockErrorFormState,
  mockErrorVerifyPhoneState,
  mockGuestUser,
  mockIdleFormState,
  mockLoadingFormState,
  mockLoadingValidationFields,
  mockLoadingVerifyPhoneState,
  mockOkVerifyPhoneState,
  mockUser
} from '../../../../../../jest/helpers/appM8TestUtils'

jest.mock('@ui', () => require('../../../../../../jest/helpers/appM8TestUtils').userDetailsUiMock)
jest.mock('react-native-loading-spinner-overlay', () => 'Spinner')
jest.mock('rn-placeholder', () => require('../../../../../../jest/helpers/appM8TestUtils').placeholderMock)
jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  UserFormDetails: ({ UIComponent, ...rest }) => {
    const React = require('react')
    const { userDetailsUIProps } = require('../../../../../../jest/helpers/appM8TestUtils')
    return React.createElement(UIComponent, { ...userDetailsUIProps, ...rest })
  },
  useSession: jest.fn(() => [{
    auth: true,
    user: require('../../../../../../jest/helpers/appM8TestUtils').mockUser
  }, {}]),
  useToast: jest.fn(() => [null, { showToast: jest.fn() }])
}))

const renderDetails = (props = {}) => renderWithProviders(
  <UserDetails {...props} />
)

describe('UserDetails UI', () => {
  afterEach(() => {
    const { useSession, useToast } = require('@components')
    useSession.mockReturnValue([{
      auth: true,
      user: mockUser
    }, {}])
    useToast.mockReturnValue([null, { showToast: jest.fn() }])
  })

  it('renders customer name phone and email in view mode', () => {
    const { getByText } = renderDetails({
      userData: mockUser,
      HeaderTitle: <Text>Customer details</Text>
    })
    expect(getByText('Customer details')).toBeTruthy()
    expect(getByText('Pat A Lee Ng')).toBeTruthy()
    expect(getByText('+1 5550100')).toBeTruthy()
    expect(getByText('pat@test.com')).toBeTruthy()
    expect(getByText('Change')).toBeTruthy()
  })

  it('shows a loading indicator while fields load outside checkout', () => {
    const { toJSON } = renderDetails({
      validationFields: mockLoadingValidationFields
    })
    expect(toJSON()).toBeTruthy()
  })

  it('hides the loader in checkout and skips change when placing an order', () => {
    const { queryByText } = renderDetails({
      isCheckout: true,
      isCheckoutPlace: true,
      formState: mockLoadingFormState,
      userData: mockUser
    })
    expect(queryByText('Change')).toBeNull()
  })

  it('hides change when the cart is completed', () => {
    const { queryByText } = renderDetails({
      cartStatus: 2,
      userData: mockUser
    })
    expect(queryByText('Change')).toBeNull()
  })

  it('toggles edit from the change action', () => {
    const toggleIsEdit = jest.fn()
    const { getByText } = renderDetails({
      toggleIsEdit,
      userData: mockUser
    })
    fireEvent.press(getByText('Change'))
    expect(toggleIsEdit).toHaveBeenCalled()
  })

  it('renders the form in edit mode and closes it when guest data exists', () => {
    const toggleIsEdit = jest.fn()
    const cleanFormState = jest.fn()
    const { getByTestId } = renderDetails({
      isEdit: true,
      toggleIsEdit,
      cleanFormState,
      userData: mockUser
    })
    expect(getByTestId('user-form-details')).toBeTruthy()
    fireEvent.press(getByTestId('o-icon').parent)
    expect(toggleIsEdit).toHaveBeenCalled()
    expect(cleanFormState).toHaveBeenCalledWith({ changes: {} })
  })

  it('uses form result data when no userData is passed', () => {
    const { getByText } = renderDetails({
      formState: {
        ...mockIdleFormState,
        result: {
          error: false,
          result: { ...mockUser, name: 'Result', lastname: 'User' }
        }
      }
    })
    expect(getByText('Result A User Ng')).toBeTruthy()
  })

  it('shows guest contact fields and the phone update warning', () => {
    const { useSession } = require('@components')
    useSession.mockReturnValue([{
      auth: true,
      user: mockGuestUser
    }, {}])
    const { getByText } = renderDetails({
      userData: mockGuestUser,
      phoneUpdate: true
    })
    expect(getByText('guest@test.com')).toBeTruthy()
    expect(getByText('It is necessary to update your phone number')).toBeTruthy()
  })

  it('asks to edit when isUserDetailsEdit is set', () => {
    const toggleIsEdit = jest.fn()
    renderDetails({
      isUserDetailsEdit: true,
      isEdit: false,
      toggleIsEdit
    })
    expect(toggleIsEdit).toHaveBeenCalled()
  })

  it('closes after a required-field submit leaves edit mode', () => {
    const onClose = jest.fn()
    const { getByTestId, rerender } = renderDetails({
      isEdit: true,
      requiredFields: ['name'],
      onClose
    })
    fireEvent.press(getByTestId('submit-user-form'))
    rerender(
      <UserDetails
        isEdit={false}
        requiredFields={['name']}
        onClose={onClose}
      />
    )
    expect(onClose).toHaveBeenCalled()
  })

  it('requests a phone code update when the country code is missing', () => {
    const togglePhoneUpdate = jest.fn()
    const { useSession } = require('@components')
    useSession.mockReturnValue([{
      auth: true,
      user: { ...mockUser, country_phone_code: null }
    }, {}])
    renderDetails({ togglePhoneUpdate })
    expect(togglePhoneUpdate).toHaveBeenCalledWith(true)
  })

  it('clears the phone update flag when a country code exists', () => {
    const togglePhoneUpdate = jest.fn()
    renderDetails({ togglePhoneUpdate })
    expect(togglePhoneUpdate).toHaveBeenCalledWith(false)
  })

  it('starts otp verification from the form and sends the code', () => {
    const handleSendVerifyCode = jest.fn()
    const { getByTestId } = renderDetails({
      isEdit: true,
      formState: mockChangedFormState,
      handleSendVerifyCode
    })
    fireEvent.press(getByTestId('start-otp'))
    expect(handleSendVerifyCode).toHaveBeenCalledWith({
      cellphone: '5550101',
      country_phone_code: '1'
    })
  })

  it('toasts a string verify-phone error', () => {
    const { useToast } = require('@components')
    const showToast = jest.fn()
    useToast.mockReturnValue([null, { showToast }])
    renderDetails({
      verifyPhoneState: mockErrorVerifyPhoneState
    })
    expect(showToast).toHaveBeenCalled()
  })

  it('toasts an array verify-phone error', () => {
    const { useToast } = require('@components')
    const showToast = jest.fn()
    useToast.mockReturnValue([null, { showToast }])
    renderDetails({
      verifyPhoneState: mockErrorArrayVerifyPhoneState
    })
    expect(showToast).toHaveBeenCalled()
  })

  it('opens the verify modal on an OK code send and saves the code', () => {
    const setFormState = jest.fn()
    const { getByTestId } = renderDetails({
      verifyPhoneState: mockOkVerifyPhoneState,
      formState: mockChangedFormState,
      setFormState
    })
    expect(getByTestId('verify-phone')).toBeTruthy()
    fireEvent.press(getByTestId('send-phone-code'))
    expect(setFormState).toHaveBeenCalledWith({
      ...mockChangedFormState,
      changes: {
        ...mockChangedFormState.changes,
        verification_code: '123456'
      }
    })
  })

  it('renders the spinner while a verify request is loading', () => {
    const { toJSON } = renderDetails({
      verifyPhoneState: mockLoadingVerifyPhoneState
    })
    expect(toJSON()).toBeTruthy()
  })

  it('falls back to the session user when form result is an error', () => {
    const { getByText } = renderDetails({
      formState: mockErrorFormState
    })
    expect(getByText('Pat A Lee Ng')).toBeTruthy()
  })
})

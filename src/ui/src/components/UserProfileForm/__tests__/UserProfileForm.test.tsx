import { fireEvent } from '@testing-library/react-native'
import { UserProfileForm } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import {
  mockChangedFormState,
  mockErrorArrayVerifyPhoneState,
  mockErrorFormState,
  mockErrorVerifyPhoneState,
  mockIdleFormState,
  mockLoadingFormState,
  mockLoadingVerifyPhoneState,
  mockOkVerifyPhoneState,
  mockUser,
  mockUserWithPhoto
} from '../../../../../../jest/helpers/appM8TestUtils'

jest.mock('@ui', () => require('../../../../../../jest/helpers/appM8TestUtils').userProfileFormUiMock)
jest.mock('react-native-loading-spinner-overlay', () => 'Spinner')
jest.mock('react-native-fast-image', () => require('../../../../../../jest/helpers/fastImageMock'))
jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn()
}))
jest.mock('react-hook-form', () => ({
  useForm: () => {
    const { formHarness } = require('../../../../../../jest/helpers/appM8TestUtils')
    return {
      handleSubmit: formHarness.handleSubmit,
      errors: formHarness.errors,
      setValue: formHarness.setValue,
      control: {}
    }
  }
}))
jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  UserFormDetails: ({ UIComponent, ...rest }) => {
    const React = require('react')
    const { userProfileFormUIProps } = require('../../../../../../jest/helpers/appM8TestUtils')
    return React.createElement(UIComponent, { ...userProfileFormUIProps, ...rest })
  },
  useSession: jest.fn(() => [{
    auth: true,
    user: require('../../../../../../jest/helpers/appM8TestUtils').mockUser
  }, {}]),
  useConfig: jest.fn(() => [{
    loading: false,
    configs: require('../../../../../../jest/helpers/appM8TestUtils').mockUserConfigs
  }]),
  useToast: jest.fn(() => [null, { showToast: jest.fn() }])
}))

const renderForm = (props = {}) => renderWithProviders(
  <UserProfileForm {...props} />
)

describe('UserProfileForm UI', () => {
  afterEach(() => {
    const { useSession, useToast } = require('@components')
    const { resetFormHarness } = require('../../../../../../jest/helpers/appM8TestUtils')
    useSession.mockReturnValue([{
      auth: true,
      user: mockUser
    }, {}])
    useToast.mockReturnValue([null, { showToast: jest.fn() }])
    resetFormHarness()
  })

  it('renders the camera control and the profile form', () => {
    const { getByTestId } = renderForm()
    expect(getByTestId('o-icon-button')).toBeTruthy()
    expect(getByTestId('user-form-details')).toBeTruthy()
  })

  it('renders a photo when the user has one', () => {
    const { useSession } = require('@components')
    useSession.mockReturnValue([{
      auth: true,
      user: mockUserWithPhoto
    }, {}])
    const { getByTestId } = renderForm()
    expect(getByTestId('user-form-details')).toBeTruthy()
  })

  it('updates the photo from the image library', () => {
    const { launchImageLibrary } = require('react-native-image-picker')
    launchImageLibrary.mockImplementation((_opts, cb) => cb({
      assets: [{ type: 'image/jpeg', base64: 'abc' }]
    }))
    const handleButtonUpdateClick = jest.fn()
    const { getByTestId } = renderForm({
      handleButtonUpdateClick
    })
    fireEvent.press(getByTestId('o-icon-button'))
    expect(handleButtonUpdateClick).toHaveBeenCalledWith(
      null,
      true,
      'data:image/jpeg;base64,abc'
    )
  })

  it('ignores a cancelled image picker', () => {
    const { launchImageLibrary } = require('react-native-image-picker')
    const log = jest.spyOn(console, 'log').mockImplementation(() => {})
    launchImageLibrary.mockImplementation((_opts, cb) => cb({ didCancel: true }))
    const handleButtonUpdateClick = jest.fn()
    const { getByTestId } = renderForm({
      handleButtonUpdateClick
    })
    fireEvent.press(getByTestId('o-icon-button'))
    expect(handleButtonUpdateClick).not.toHaveBeenCalled()
    log.mockRestore()
  })

  it('toasts an image picker error', () => {
    const { launchImageLibrary } = require('react-native-image-picker')
    const { useToast } = require('@components')
    const showToast = jest.fn()
    useToast.mockReturnValue([null, { showToast }])
    const log = jest.spyOn(console, 'log').mockImplementation(() => {})
    launchImageLibrary.mockImplementation((_opts, cb) => cb({ errorMessage: 'Picker failed' }))
    const { getByTestId } = renderForm()
    fireEvent.press(getByTestId('o-icon-button'))
    expect(showToast).toHaveBeenCalled()
    log.mockRestore()
  })

  it('toasts when the picker returns no image', () => {
    const { launchImageLibrary } = require('react-native-image-picker')
    const { useToast } = require('@components')
    const showToast = jest.fn()
    useToast.mockReturnValue([null, { showToast }])
    launchImageLibrary.mockImplementation((_opts, cb) => cb({ assets: [] }))
    const { getByTestId } = renderForm()
    fireEvent.press(getByTestId('o-icon-button'))
    expect(showToast).toHaveBeenCalled()
  })

  it('toasts a successful profile update', () => {
    const { useToast } = require('@components')
    const showToast = jest.fn()
    useToast.mockReturnValue([null, { showToast }])
    renderForm({
      formState: {
        ...mockIdleFormState,
        result: { error: false, result: { id: 7 } }
      }
    })
    expect(showToast).toHaveBeenCalled()
  })

  it('toasts a failed profile update', () => {
    const { useToast } = require('@components')
    const showToast = jest.fn()
    useToast.mockReturnValue([null, { showToast }])
    renderForm({
      formState: mockErrorFormState
    })
    expect(showToast).toHaveBeenCalled()
  })

  it('toasts form errors', () => {
    const { formHarness } = require('../../../../../../jest/helpers/appM8TestUtils')
    const { useToast } = require('@components')
    const showToast = jest.fn()
    useToast.mockReturnValue([null, { showToast }])
    formHarness.errors = {
      email: { message: 'Invalid email address' },
      name: { message: 'Name is required' }
    }
    renderForm()
    expect(showToast).toHaveBeenCalled()
  })

  it('marks the phone for update when the country code is missing', () => {
    const { useSession } = require('@components')
    useSession.mockReturnValue([{
      auth: true,
      user: { ...mockUser, cellphone: '5550100', country_phone_code: null }
    }, {}])
    const { getByTestId } = renderForm()
    expect(getByTestId('user-form-details')).toBeTruthy()
  })

  it('starts otp verification and sends the code', () => {
    const handleSendVerifyCode = jest.fn()
    const { getByTestId } = renderForm({
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
    renderForm({
      verifyPhoneState: mockErrorVerifyPhoneState
    })
    expect(showToast).toHaveBeenCalled()
  })

  it('toasts an array verify-phone error', () => {
    const { useToast } = require('@components')
    const showToast = jest.fn()
    useToast.mockReturnValue([null, { showToast }])
    renderForm({
      verifyPhoneState: mockErrorArrayVerifyPhoneState
    })
    expect(showToast).toHaveBeenCalled()
  })

  it('opens the verify modal and stores the code', () => {
    const setFormState = jest.fn()
    const { getByTestId } = renderForm({
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

  it('shows the spinner while the form or verify request is loading', () => {
    const { toJSON } = renderForm({
      formState: mockLoadingFormState,
      verifyPhoneState: mockLoadingVerifyPhoneState
    })
    expect(toJSON()).toBeTruthy()
  })
})

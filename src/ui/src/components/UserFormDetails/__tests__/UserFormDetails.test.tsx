import { fireEvent } from '@testing-library/react-native'
import { UserFormDetailsUI } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import {
  mockAdminUser,
  mockChangedFormState,
  mockCheckoutFields,
  mockErrorFormState,
  mockGuestUser,
  mockIdleFormState,
  mockLoadingFormState,
  mockLoadingValidationFields,
  mockPhoneRequiredConfigs,
  mockPuertoRicoUser,
  mockRequiredCellphoneFields,
  mockUser,
  mockUserConfigs,
  mockValidationFields,
  resetFormHarness
} from '../../../../../../jest/helpers/appM8TestUtils'

jest.mock('@ui', () => require('../../../../../../jest/helpers/appM8TestUtils').userFormDetailsUiMock)
jest.mock('react-hook-form', () => ({
  useForm: () => {
    const { formHarness } = require('../../../../../../jest/helpers/appM8TestUtils')
    return {
      handleSubmit: formHarness.handleSubmit,
      control: {},
      errors: formHarness.errors,
      setValue: formHarness.setValue
    }
  },
  Controller: ({ render }) => render({
    onChange: jest.fn(),
    onBlur: jest.fn(),
    value: '',
    name: 'field'
  })
}))
jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  useSession: jest.fn(() => [{
    auth: true,
    user: require('../../../../../../jest/helpers/appM8TestUtils').mockUser
  }, { login: jest.fn() }]),
  useConfig: jest.fn(() => [{
    loading: false,
    configs: require('../../../../../../jest/helpers/appM8TestUtils').mockUserConfigs
  }]),
  useToast: jest.fn(() => [null, { showToast: jest.fn() }])
}))

const defaultProps = {
  isEdit: true,
  formState: mockChangedFormState,
  showField: () => true,
  requiredFields: null,
  setIsSubmit: jest.fn(),
  cleanFormState: jest.fn(),
  onCloseProfile: jest.fn(),
  isRequiredField: () => false,
  validationFields: mockValidationFields,
  handleChangeInput: jest.fn(),
  handleButtonUpdateClick: jest.fn(),
  phoneUpdate: false,
  hideUpdateButton: false,
  setWillVerifyOtpState: jest.fn(),
  handlePlaceOrderAsGuest: jest.fn(),
  isCheckout: false,
  setIsOpen: jest.fn(),
  handleRemoveAccount: jest.fn(),
  isProfile: false,
  isGuest: false,
  isOrderTypeValidationField: false,
  checkoutFields: mockCheckoutFields,
  isCheckoutPlace: false
}

const renderForm = (props = {}) => renderWithProviders(
  <UserFormDetailsUI {...defaultProps} {...props} />
)

describe('UserFormDetails UI', () => {
  afterEach(() => {
    const { useSession, useConfig, useToast } = require('@components')
    useSession.mockReturnValue([{
      auth: true,
      user: mockUser
    }, { login: jest.fn() }])
    useConfig.mockReturnValue([{
      loading: false,
      configs: mockUserConfigs
    }])
    useToast.mockReturnValue([null, { showToast: jest.fn() }])
    resetFormHarness()
  })

  it('renders profile fields and updates the user', () => {
    const handleButtonUpdateClick = jest.fn()
    const setIsSubmit = jest.fn()
    const handleChangeInput = jest.fn()
    const { getByPlaceholderText, getByText } = renderForm({
      handleButtonUpdateClick,
      setIsSubmit,
      handleChangeInput,
      isRequiredField: (code) => code === 'name'
    })
    expect(getByPlaceholderText('Name')).toBeTruthy()
    expect(getByPlaceholderText('Last name')).toBeTruthy()
    expect(getByPlaceholderText('Email')).toBeTruthy()
    expect(getByPlaceholderText('Password')).toBeTruthy()
    fireEvent.changeText(getByPlaceholderText('Name'), 'Pat')
    fireEvent.changeText(getByPlaceholderText('Email'), 'Pat Lee@test.com')
    expect(handleChangeInput).toHaveBeenCalled()
    fireEvent.press(getByText('Update'))
    expect(setIsSubmit).toHaveBeenCalledWith(true)
    expect(handleButtonUpdateClick).toHaveBeenCalled()
  })

  it('shows a loading label while validation fields load', () => {
    const { getByText } = renderForm({
      validationFields: mockLoadingValidationFields,
      formState: mockIdleFormState
    })
    expect(getByText('Loading')).toBeTruthy()
  })

  it('shows field errors and toasts them', () => {
    const { formHarness } = require('../../../../../../jest/helpers/appM8TestUtils')
    const { useToast } = require('@components')
    const showToast = jest.fn()
    useToast.mockReturnValue([null, { showToast }])
    formHarness.errors = {
      email: { message: 'Invalid email address', type: 'pattern' },
      name: { message: 'Name is required', type: 'required' }
    }
    const { getByText } = renderForm()
    expect(getByText('Invalid email address')).toBeTruthy()
    expect(getByText('Name is required*')).toBeTruthy()
    expect(showToast).toHaveBeenCalled()
  })

  it('includes a phone error in the form error toast', () => {
    const { formHarness } = require('../../../../../../jest/helpers/appM8TestUtils')
    const { useToast } = require('@components')
    const showToast = jest.fn()
    useToast.mockReturnValue([null, { showToast }])
    formHarness.errors = { email: { message: 'Invalid email address' } }
    const { getByTestId } = renderForm()
    fireEvent.press(getByTestId('set-phone-error'))
    expect(showToast).toHaveBeenCalled()
  })

  it('toasts a form state error and closes checkout', () => {
    const { useToast } = require('@components')
    const showToast = jest.fn()
    useToast.mockReturnValue([null, { showToast }])
    const setIsOpen = jest.fn()
    const cleanFormState = jest.fn()
    renderForm({
      formState: mockErrorFormState,
      isCheckout: true,
      setIsOpen,
      cleanFormState
    })
    expect(showToast).toHaveBeenCalled()
    expect(setIsOpen).toHaveBeenCalledWith(false)
    expect(cleanFormState).toHaveBeenCalledWith({ changes: {} })
  })

  it('closes the profile and cleans changes when not editing', () => {
    const onCloseProfile = jest.fn()
    const cleanFormState = jest.fn()
    renderForm({
      isEdit: false,
      onCloseProfile,
      cleanFormState,
      formState: mockIdleFormState
    })
    expect(onCloseProfile).toHaveBeenCalled()
    expect(cleanFormState).toHaveBeenCalledWith({ changes: {} })
  })

  it('updates the birthdate from the picker', () => {
    const handleChangeInput = jest.fn()
    const { getByText, getByTestId } = renderForm({
      handleChangeInput
    })
    expect(getByText('1990-01-15')).toBeTruthy()
    fireEvent.press(getByText('1990-01-15'))
    fireEvent.press(getByTestId('confirm-date'))
    expect(handleChangeInput).toHaveBeenCalledWith({
      target: { name: 'birthdate', value: '1992-05-20' }
    })
    fireEvent.press(getByText('1992-05-20'))
    fireEvent.press(getByTestId('cancel-date'))
  })

  it('updates the phone number and country', () => {
    const handleChangeInput = jest.fn()
    const { getByTestId } = renderForm({
      handleChangeInput
    })
    fireEvent.press(getByTestId('set-phone'))
    expect(handleChangeInput).toHaveBeenCalledWith({
      country_phone_code: { name: 'country_phone_code', value: '1' },
      cellphone: { name: 'cellphone', value: '5550199' }
    }, true)
    fireEvent.press(getByTestId('change-country'))
    expect(handleChangeInput).toHaveBeenCalledWith({
      country_code: { name: 'country_code', value: 'US' }
    }, true)
  })

  it('shows the previous cellphone when a phone update is required', () => {
    const { getByText } = renderForm({
      phoneUpdate: true
    })
    expect(getByText(/Your previous cellphone/)).toBeTruthy()
    expect(getByText(/5550100/)).toBeTruthy()
  })

  it('slices a Puerto Rico cellphone for the previous number', () => {
    const { useSession } = require('@components')
    useSession.mockReturnValue([{
      auth: true,
      user: mockPuertoRicoUser
    }, { login: jest.fn() }])
    const { getByText } = renderForm({
      phoneUpdate: true
    })
    expect(getByText(/5550100/)).toBeTruthy()
  })

  it('requests otp when phone verification is required', () => {
    const { useConfig } = require('@components')
    useConfig.mockReturnValue([{
      loading: false,
      configs: mockPhoneRequiredConfigs
    }])
    const setWillVerifyOtpState = jest.fn()
    const { getByTestId } = renderForm({
      setWillVerifyOtpState,
      formState: mockChangedFormState
    })
    fireEvent.press(getByTestId('set-phone'))
    expect(setWillVerifyOtpState).toHaveBeenCalledWith(true)
  })

  it('toasts a phone error on submit', () => {
    const { useToast } = require('@components')
    const showToast = jest.fn()
    useToast.mockReturnValue([null, { showToast }])
    const handleButtonUpdateClick = jest.fn()
    const { getByTestId, getByText } = renderForm({
      handleButtonUpdateClick
    })
    fireEvent.press(getByTestId('set-phone-error'))
    fireEvent.press(getByText('Update'))
    expect(showToast).toHaveBeenCalled()
    expect(handleButtonUpdateClick).not.toHaveBeenCalled()
  })

  it('toasts when a required birthdate is missing', () => {
    const { useToast } = require('@components')
    const { useSession } = require('@components')
    const showToast = jest.fn()
    useToast.mockReturnValue([null, { showToast }])
    useSession.mockReturnValue([{
      auth: true,
      user: { ...mockUser, birthdate: null }
    }, { login: jest.fn() }])
    const handleButtonUpdateClick = jest.fn()
    const { getByText } = renderForm({
      requiredFields: ['birthdate'],
      handleButtonUpdateClick
    })
    fireEvent.press(getByText('Update'))
    expect(showToast).toHaveBeenCalled()
    expect(handleButtonUpdateClick).not.toHaveBeenCalled()
  })

  it('toasts when a required cellphone change is null', () => {
    const { useToast } = require('@components')
    const showToast = jest.fn()
    useToast.mockReturnValue([null, { showToast }])
    const handleButtonUpdateClick = jest.fn()
    const { getByText } = renderForm({
      validationFields: mockRequiredCellphoneFields,
      formState: {
        ...mockChangedFormState,
        changes: { name: 'Pat', cellphone: null }
      },
      handleButtonUpdateClick
    })
    fireEvent.press(getByText('Update'))
    expect(showToast).toHaveBeenCalled()
    expect(handleButtonUpdateClick).not.toHaveBeenCalled()
  })

  it('requires cellphone when phone verification is on and the user is not a guest', () => {
    const { useToast, useConfig } = require('@components')
    const showToast = jest.fn()
    useToast.mockReturnValue([null, { showToast }])
    useConfig.mockReturnValue([{
      loading: false,
      configs: mockPhoneRequiredConfigs
    }])
    const handleButtonUpdateClick = jest.fn()
    const { getByText } = renderForm({
      formState: {
        ...mockChangedFormState,
        changes: { name: 'Pat', cellphone: null }
      },
      handleButtonUpdateClick
    })
    fireEvent.press(getByText('Update'))
    expect(showToast).toHaveBeenCalled()
    expect(handleButtonUpdateClick).not.toHaveBeenCalled()
  })

  it('does not submit while the form is loading', () => {
    const handleButtonUpdateClick = jest.fn()
    const { getByText } = renderForm({
      formState: mockLoadingFormState,
      handleButtonUpdateClick
    })
    expect(getByText('Updating...')).toBeTruthy()
  })

  it('hides the update button when asked', () => {
    const { queryByText } = renderForm({
      hideUpdateButton: true
    })
    expect(queryByText('Update')).toBeNull()
  })

  it('shows a continue action on checkout place and enables it when required fields are set', () => {
    const handleButtonUpdateClick = jest.fn()
    const { getByText } = renderForm({
      isCheckoutPlace: true,
      requiredFields: ['name'],
      formState: { ...mockChangedFormState, changes: { name: 'Pat' } },
      handleButtonUpdateClick
    })
    fireEvent.press(getByText('Continue'))
    expect(handleButtonUpdateClick).toHaveBeenCalled()
  })

  it('keeps continue disabled when required checkout fields are missing', () => {
    const { getByText } = renderForm({
      isCheckoutPlace: true,
      requiredFields: ['name'],
      formState: mockIdleFormState
    })
    expect(getByText('Continue')).toBeTruthy()
  })

  it('places an order as a guest from checkout', () => {
    const { useSession } = require('@components')
    useSession.mockReturnValue([{
      auth: true,
      user: mockGuestUser
    }, { login: jest.fn() }])
    const handlePlaceOrderAsGuest = jest.fn()
    const { getByText } = renderForm({
      isCheckout: true,
      isGuest: true,
      handlePlaceOrderAsGuest
    })
    fireEvent.press(getByText('Place order as guest'))
    expect(handlePlaceOrderAsGuest).toHaveBeenCalled()
  })

  it('renders order-type checkout fields', () => {
    const { getByPlaceholderText } = renderForm({
      isOrderTypeValidationField: true,
      checkoutFields: mockCheckoutFields
    })
    expect(getByPlaceholderText('Name')).toBeTruthy()
    expect(getByPlaceholderText('Email')).toBeTruthy()
  })

  it('removes an account from the profile and can cancel the alert', () => {
    const handleRemoveAccount = jest.fn()
    const { getByText, getByTestId } = renderForm({
      isProfile: true,
      handleRemoveAccount
    })
    fireEvent.press(getByText('Remove account'))
    expect(getByText('Account alert')).toBeTruthy()
    fireEvent.press(getByTestId('alert-cancel'))
    fireEvent.press(getByText('Remove account'))
    fireEvent.press(getByTestId('alert-close'))
    fireEvent.press(getByText('Remove account'))
    fireEvent.press(getByTestId('alert-accept'))
    expect(handleRemoveAccount).toHaveBeenCalledWith(mockUser.id)
  })

  it('does not remove an admin account', () => {
    const { useSession } = require('@components')
    useSession.mockReturnValue([{
      auth: true,
      user: mockAdminUser
    }, { login: jest.fn() }])
    const handleRemoveAccount = jest.fn()
    const { getByText } = renderForm({
      isProfile: true,
      handleRemoveAccount
    })
    fireEvent.press(getByText('Remove account'))
    expect(handleRemoveAccount).not.toHaveBeenCalled()
  })

  it('shows guest email and cellphone values', () => {
    const { useSession } = require('@components')
    useSession.mockReturnValue([{
      auth: true,
      user: mockGuestUser
    }, { login: jest.fn() }])
    const { getByPlaceholderText, getByText } = renderForm({
      phoneUpdate: true,
      formState: mockIdleFormState
    })
    expect(getByPlaceholderText('Email').props.value).toBe('guest@test.com')
    expect(getByText(/5550199/)).toBeTruthy()
  })

  it('shows the update action for a guest checkout without local changes', () => {
    const { getByText } = renderForm({
      isCheckout: true,
      isGuest: true,
      isEdit: true,
      formState: mockIdleFormState
    })
    expect(getByText('Update')).toBeTruthy()
  })
})

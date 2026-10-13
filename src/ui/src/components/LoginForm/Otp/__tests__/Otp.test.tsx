import { Otp } from '../index'
import { renderWithProviders } from '../../../../../../../jest/helpers/renderWithProviders'
import { baseOtpProps } from '../../../../../../../jest/helpers/appUiTestUtils'

jest.mock('@ui', () => require('../../../../../../../jest/helpers/franchiseAppUiMock'))
jest.mock('react-native-otp-inputs', () => {
  const React = require('react')
  const { View, Text } = require('react-native')
  const MockOtpInputs = React.forwardRef((props, ref) => (
    React.createElement(View, { testID: 'otp-inputs' }, React.createElement(Text, null, 'OTP'))
  ))
  return { __esModule: true, default: MockOtpInputs }
})

describe('LoginForm Otp UI', () => {
  it('renders otp verification content', () => {
    const { getByText } = renderWithProviders(<Otp {...baseOtpProps} />)
    expect(getByText('Cancel')).toBeTruthy()
  })
})

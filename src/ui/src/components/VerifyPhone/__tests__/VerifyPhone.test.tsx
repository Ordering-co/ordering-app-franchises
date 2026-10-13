import { VerifyPhone } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import { baseVerifyPhoneProps } from '../../../../../../jest/helpers/appUiTestUtils'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))

describe('VerifyPhone UI', () => {
  it('renders phone verification code form', () => {
    const { getByText } = renderWithProviders(
      <VerifyPhone
        {...baseVerifyPhoneProps}
        phone={{ cellphone: '5551234567', country_phone_code: '1' }}
      />
    )
    expect(getByText('Enter verification code')).toBeTruthy()
  })
})

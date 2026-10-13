import { Alert } from 'react-native'
import { fireEvent, waitFor } from '@testing-library/react-native'
import { SendGiftCard } from '../index'
import { renderWithProviders } from '../../../../../../../jest/helpers/renderWithProviders'
import { sendGiftCardUIProps } from '../../../../../../../jest/helpers/appM9RewardsTestUtils'

jest.mock('@ui', () => require('../../../../../../../jest/helpers/appM9RewardsTestUtils').appM9UiMock)
jest.mock('@components', () => ({
  ...require('../../../../../../../jest/helpers/mockOrdering'),
  SendGiftCard: ({ UIComponent, ...rest }) => {
    const React = require('react')
    const { sendGiftCardUIProps } = require('../../../../../../../jest/helpers/appM9RewardsTestUtils')
    return React.createElement(UIComponent, { ...sendGiftCardUIProps, ...rest })
  }
}))

const renderForm = (props = {}) => renderWithProviders(
  <SendGiftCard {...sendGiftCardUIProps} {...props} />
)

describe('SendGiftCard UI', () => {
  beforeEach(() => {
    jest.spyOn(Alert, 'alert').mockImplementation(() => {})
  })

  afterEach(() => {
    Alert.alert.mockRestore()
  })

  it('renders gift card detail fields', () => {
    const { getByText, getByPlaceholderText } = renderForm()
    expect(getByText('Gift Card details')).toBeTruthy()
    expect(getByText('To')).toBeTruthy()
    expect(getByText('Name')).toBeTruthy()
    expect(getByText('Title')).toBeTruthy()
    expect(getByText('Messages')).toBeTruthy()
    expect(getByPlaceholderText('Enter an email')).toBeTruthy()
    expect(getByPlaceholderText('Write a name')).toBeTruthy()
    expect(getByText('Send gift card')).toBeTruthy()
  })

  it('alerts when the required email is missing', async () => {
    const { getByText } = renderForm()
    fireEvent.press(getByText('Send gift card'))
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Error',
        expect.stringContaining('To email is required'),
        expect.any(Array)
      )
    })
  })

  it('sends the form values', async () => {
    const handleSendGiftCard = jest.fn()
    const { getByText, getByPlaceholderText } = renderForm({ handleSendGiftCard })
    fireEvent.changeText(getByPlaceholderText('Enter an email'), 'pat@test.com')
    fireEvent.changeText(getByPlaceholderText('Write a name'), 'Pat')
    fireEvent.changeText(getByPlaceholderText('Title'), 'Congrats')
    fireEvent.changeText(getByPlaceholderText('Type your message here'), 'Enjoy')
    fireEvent.press(getByText('Send gift card'))
    await waitFor(() => {
      expect(handleSendGiftCard).toHaveBeenCalledWith({
        email: 'pat@test.com',
        user_name: 'Pat',
        title: 'Congrats',
        message: 'Enjoy'
      })
    })
  })

  it('shows a loading action while the card is sending', () => {
    const { getByText, queryByText } = renderForm({
      actionState: { loading: true, error: null }
    })
    expect(getByText('Loading')).toBeTruthy()
    expect(queryByText('Send gift card')).toBeNull()
  })
})

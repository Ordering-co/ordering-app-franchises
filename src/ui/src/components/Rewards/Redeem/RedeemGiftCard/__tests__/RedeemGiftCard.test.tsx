import { Alert } from 'react-native'
import { fireEvent, waitFor } from '@testing-library/react-native'
import { RedeemGiftCard } from '../index'
import { renderWithProviders } from '../../../../../../../../jest/helpers/renderWithProviders'
import {
  mockRedeemedGiftCard,
  redeemGiftCardUIProps
} from '../../../../../../../../jest/helpers/appM9RewardsTestUtils'

jest.mock('@ui', () => require('../../../../../../../../jest/helpers/appM9RewardsTestUtils').appM9UiMock)
jest.mock('@components', () => ({
  ...require('../../../../../../../../jest/helpers/mockOrdering'),
  useUtils: jest.fn(() => [require('../../../../../../../../jest/helpers/appM9RewardsTestUtils').mockUtils]),
  RedeemGiftCard: ({ UIComponent, ...rest }) => {
    const React = require('react')
    const { redeemGiftCardUIProps } = require('../../../../../../../../jest/helpers/appM9RewardsTestUtils')
    return React.createElement(UIComponent, { ...redeemGiftCardUIProps, ...rest })
  }
}))

const renderRedeemCard = (props = {}) => renderWithProviders(
  <RedeemGiftCard {...redeemGiftCardUIProps} {...props} />
)

describe('RedeemGiftCard UI', () => {
  beforeEach(() => {
    jest.spyOn(Alert, 'alert').mockImplementation(() => {})
  })

  afterEach(() => {
    Alert.alert.mockRestore()
  })

  it('renders code and password fields', () => {
    const { getByText, getByPlaceholderText } = renderRedeemCard()
    expect(getByText('Gift card code')).toBeTruthy()
    expect(getByPlaceholderText('XXXX-XXXX-XXXX-XXXX')).toBeTruthy()
    expect(getByText('Password')).toBeTruthy()
    expect(getByText('Apply to your balance')).toBeTruthy()
  })

  it('formats the gift card code in groups of four', () => {
    const { getByPlaceholderText } = renderRedeemCard()
    const input = getByPlaceholderText('XXXX-XXXX-XXXX-XXXX')
    fireEvent.changeText(input, 'ABCD1234EFGH5678')
    expect(input.props.value).toBe('ABCD-1234-EFGH-5678')
  })

  it('alerts when required fields are missing', async () => {
    const { getByText } = renderRedeemCard()
    fireEvent.press(getByText('Apply to your balance'))
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Error',
        expect.stringMatching(/Code is required|Password is required/),
        expect.any(Array)
      )
    })
  })

  it('applies a gift card code and password', async () => {
    const handleApply = jest.fn()
    const { getByText, getByPlaceholderText } = renderRedeemCard({ handleApply })
    fireEvent.changeText(getByPlaceholderText('XXXX-XXXX-XXXX-XXXX'), 'ABCD1234')
    fireEvent.changeText(getByPlaceholderText('Password'), 'secret')
    fireEvent.press(getByText('Apply to your balance'))
    await waitFor(() => {
      expect(handleApply).toHaveBeenCalledWith({
        code: 'ABCD1234',
        password: 'secret'
      })
    })
  })

  it('does not apply while a request is loading', () => {
    const handleApply = jest.fn()
    const { getByText, getByPlaceholderText } = renderRedeemCard({
      handleApply,
      actionState: { loading: true, error: null }
    })
    fireEvent.changeText(getByPlaceholderText('XXXX-XXXX-XXXX-XXXX'), 'ABCD1234')
    fireEvent.changeText(getByPlaceholderText('Password'), 'secret')
    fireEvent.press(getByText('Apply to your balance'))
    expect(handleApply).not.toHaveBeenCalled()
  })

  it('alerts a string apply error', () => {
    renderRedeemCard({
      actionState: { loading: false, error: 'Invalid code' }
    })
    expect(Alert.alert).toHaveBeenCalledWith(
      'Error',
      'Invalid code',
      expect.any(Array)
    )
  })

  it('alerts an array apply error', () => {
    renderRedeemCard({
      actionState: { loading: false, error: ['Expired', 'Try again'] }
    })
    expect(Alert.alert).toHaveBeenCalledWith(
      'Error',
      'Expired\nTry again\n',
      expect.any(Array)
    )
  })

  it('shows redeemed card details and hides the apply action', () => {
    const { getByText, queryByText } = renderRedeemCard({
      redeemedGiftCard: mockRedeemedGiftCard
    })
    expect(getByText('Type: cash')).toBeTruthy()
    expect(getByText('Amount: $50')).toBeTruthy()
    expect(getByText('From: Pat Lee')).toBeTruthy()
    expect(getByText('Title: Happy birthday')).toBeTruthy()
    expect(getByText('Messages: Enjoy this card')).toBeTruthy()
    expect(queryByText('Apply to your balance')).toBeNull()
  })

  it('omits optional redeemed title and message', () => {
    const { queryByText, getByText } = renderRedeemCard({
      redeemedGiftCard: {
        ...mockRedeemedGiftCard,
        title: '',
        message: ''
      }
    })
    expect(getByText('Type: cash')).toBeTruthy()
    expect(queryByText(/Title:/)).toBeNull()
    expect(queryByText(/Messages:/)).toBeNull()
  })
})

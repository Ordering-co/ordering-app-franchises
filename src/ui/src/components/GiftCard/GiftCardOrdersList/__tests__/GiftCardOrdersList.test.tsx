import { fireEvent } from '@testing-library/react-native'
import { GiftCardOrdersList } from '../index'
import { renderWithProviders } from '../../../../../../../jest/helpers/renderWithProviders'

jest.mock('@ui', () => require('../../../../../../../jest/helpers/appM9RewardsTestUtils').appM9UiMock)
jest.mock('../../VerticalGiftCardOrdersLayout', () => {
  const React = require('react')
  const { Text, TouchableOpacity } = require('react-native')
  return {
    VerticalGiftCardOrdersLayout: ({ title, defaultStatus, setIsEmpty, onNavigationRedirect }) => {
      React.useEffect(() => {
        setIsEmpty?.(true)
      }, [setIsEmpty])
      return React.createElement(
        TouchableOpacity,
        {
          testID: `gift-layout-${defaultStatus}`,
          onPress: () => onNavigationRedirect?.('GiftCards')
        },
        React.createElement(Text, null, title)
      )
    }
  }
})

const renderList = (props = {}) => renderWithProviders(
  <GiftCardOrdersList {...props} />
)

describe('GiftCardOrdersList UI', () => {
  it('renders pending sent and redeemed sections', () => {
    const { getByText, getByTestId } = renderList()
    expect(getByText('Pending')).toBeTruthy()
    expect(getByText('Sent')).toBeTruthy()
    expect(getByText('Redeemed')).toBeTruthy()
    expect(getByTestId('gift-layout-pending')).toBeTruthy()
    expect(getByTestId('gift-layout-sent')).toBeTruthy()
    expect(getByTestId('gift-layout-activated')).toBeTruthy()
  })

  it('shows the empty cards message when every section is empty', () => {
    const { getByText } = renderList()
    expect(getByText('You don\'t have cards')).toBeTruthy()
  })

  it('forwards navigation from a section layout', () => {
    const onNavigationRedirect = jest.fn()
    const { getByTestId } = renderList({ onNavigationRedirect })
    fireEvent.press(getByTestId('gift-layout-pending'))
    expect(onNavigationRedirect).toHaveBeenCalledWith('GiftCards')
  })
})

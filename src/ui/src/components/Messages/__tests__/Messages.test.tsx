import { Keyboard } from 'react-native'
import Clipboard from '@react-native-clipboard/clipboard'
import { act, fireEvent } from '@testing-library/react-native'
import { Messages } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import {
  mockChatOrder,
  mockCompletedOrder,
  mockEmptyMessagesState,
  mockMessagesState,
  mockSessionUser
} from '../../../../../../jest/helpers/appM7TestUtils'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))
jest.mock('react-native-gifted-chat', () => require('../../../../../../jest/helpers/appM7TestUtils').giftedChatMock)
jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn()
}))
jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  useSession: jest.fn(() => [{
    auth: true,
    user: require('../../../../../../jest/helpers/appM7TestUtils').mockSessionUser
  }, {}]),
  useUtils: jest.fn(() => [require('../../../../../../jest/helpers/appM7TestUtils').mockUtils]),
  Messages: ({ UIComponent, ...rest }) => {
    const React = require('react')
    const { messagesUIProps } = require('../../../../../../jest/helpers/appM7TestUtils')
    return React.createElement(UIComponent, {
      ...messagesUIProps,
      ...rest,
      messages: rest.messages?.messages ? rest.messages : messagesUIProps.messages,
      setCanRead: rest.setCanRead || messagesUIProps.setCanRead
    })
  }
}))

describe('Messages UI', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders business chat messages and sets can read', () => {
    const setCanRead = jest.fn()
    const readMessages = jest.fn()
    const { getByTestId, getByText, getAllByText } = renderWithProviders(
      <Messages
        business
        messages={mockMessagesState}
        setCanRead={setCanRead}
        readMessages={readMessages}
        order={mockChatOrder}
      />
    )
    expect(getByTestId('gifted-chat')).toBeTruthy()
    expect(getByText(/Order placed for/)).toBeTruthy()
    expect(getAllByText(/Changed from/).length).toBeGreaterThan(0)
    expect(getByText('Hello store')).toBeTruthy()
    expect(getByText('Driver unassigned')).toBeTruthy()
    expect(getByText(/Was assigned as driver/)).toBeTruthy()
    expect(setCanRead).toHaveBeenCalledWith({
      business: true,
      administrator: true,
      customer: true,
      driver: false
    })
    expect(readMessages).toHaveBeenCalled()
    expect(getByText('Lorem ipsum 1')).toBeTruthy()
  })

  it('formats driver chat and sets driver can read', () => {
    const setCanRead = jest.fn()
    const { getByText } = renderWithProviders(
      <Messages
        business={false}
        driver
        type='driver'
        messages={mockMessagesState}
        setCanRead={setCanRead}
        order={mockChatOrder}
      />
    )
    expect(getByText(/Order placed for/)).toBeTruthy()
    expect(setCanRead).toHaveBeenCalledWith({
      business: false,
      administrator: true,
      customer: true,
      driver: true
    })
  })

  it('sends typed text and quick messages', () => {
    const setMessage = jest.fn()
    const handleSend = jest.fn()
    const setImage = jest.fn()
    const { getByText, getByTestId } = renderWithProviders(
      <Messages
        business
        messages={mockMessagesState}
        message='Hello'
        setMessage={setMessage}
        handleSend={handleSend}
        setImage={setImage}
        setCanRead={jest.fn()}
        order={mockChatOrder}
      />
    )
    fireEvent.changeText(getByTestId('gifted-input'), 'New note')
    expect(setMessage).toHaveBeenCalledWith('New note')
    fireEvent.press(getByText('Lorem ipsum 1'))
    expect(setMessage).toHaveBeenCalledWith('HelloLorem ipsum 1')
    fireEvent.press(getByTestId('gifted-send'))
    expect(handleSend).toHaveBeenCalled()
    expect(setImage).toHaveBeenCalledWith(null)
    expect(setMessage).toHaveBeenCalledWith('')
  })

  it('picks, rejects, and removes images', () => {
    const { launchImageLibrary } = require('react-native-image-picker')
    const { useToast } = require('@components')
    const showToast = jest.fn()
    useToast.mockReturnValue([null, { showToast }])
    const setImage = jest.fn()
    const { getAllByTestId } = renderWithProviders(
      <Messages
        business
        messages={mockMessagesState}
        setImage={setImage}
        setCanRead={jest.fn()}
        order={mockChatOrder}
      />
    )

    launchImageLibrary.mockImplementation((_opts, cb) => cb({ didCancel: true }))
    fireEvent.press(getAllByTestId('send-image')[0])
    expect(setImage).not.toHaveBeenCalled()

    launchImageLibrary.mockImplementation((_opts, cb) => cb({ errorMessage: 'Denied' }))
    fireEvent.press(getAllByTestId('send-image')[0])
    expect(showToast).toHaveBeenCalled()

    launchImageLibrary.mockImplementation((_opts, cb) => cb({ assets: [] }))
    fireEvent.press(getAllByTestId('send-image')[0])
    expect(showToast).toHaveBeenCalledTimes(2)

    launchImageLibrary.mockImplementation((_opts, cb) => cb({
      assets: [{ type: 'image/jpeg', base64: 'abc123' }]
    }))
    fireEvent.press(getAllByTestId('send-image')[0])
    expect(setImage).toHaveBeenCalledWith('data:image/jpeg;base64,abc123')

    const { TouchableOpacity } = require('react-native')
    const { UNSAFE_getAllByType } = renderWithProviders(
      <Messages
        business
        messages={mockMessagesState}
        image='data:image/jpeg;base64,abc123'
        setImage={setImage}
        setCanRead={jest.fn()}
        order={mockChatOrder}
      />
    )
    UNSAFE_getAllByType(TouchableOpacity).forEach((node) => {
      fireEvent.press(node)
    })
    expect(setImage).toHaveBeenCalledWith(null)
  })

  it('disables chat for a completed order', () => {
    const { getByText, queryByText } = renderWithProviders(
      <Messages
        business
        messages={mockEmptyMessagesState}
        setCanRead={jest.fn()}
        order={{ ...mockCompletedOrder, status: 1, created_at: '2026-09-07 16:00:00' }}
      />
    )
    expect(getByText('You can\'t send messages because the order has ended')).toBeTruthy()
    expect(queryByText('Lorem ipsum 1')).toBeNull()
  })

  it('copies a message from the action sheet', () => {
    const { getByTestId } = renderWithProviders(
      <Messages
        business
        messages={mockMessagesState}
        setCanRead={jest.fn()}
        order={mockChatOrder}
      />
    )
    fireEvent.press(getByTestId('gifted-long-press'))
    expect(Clipboard.setString).toHaveBeenCalledWith('Copy me')
  })

  it('shows messages when messagesToShow is provided', () => {
    const { getByText } = renderWithProviders(
      <Messages
        business
        messages={{
          loading: false,
          messages: [
            {
              id: 79,
              type: 0,
              created_at: '2026-09-07 16:00:00',
              author: { id: mockSessionUser.id, name: 'Pat' }
            },
            {
              id: 80,
              type: 2,
              comment: 'Shown by filter',
              change: { attribute: 'status', old: '0', new: '0' },
              created_at: '2026-09-07 16:20:00',
              author: { id: mockSessionUser.id, name: 'Pat' }
            }
          ]
        }}
        messagesToShow={{ messages: [{ id: 80 }] }}
        setCanRead={jest.fn()}
        order={{ ...mockChatOrder, app_id: null }}
      />
    )
    expect(getByText('Shown by filter')).toBeTruthy()
    expect(getByText(/Via/)).toBeTruthy()
    expect(getByText(/Other/)).toBeTruthy()
  })

  it('does not read messages while they are loading', () => {
    const readMessages = jest.fn()
    renderWithProviders(
      <Messages
        business
        messages={{ loading: true, messages: [] }}
        readMessages={readMessages}
        setCanRead={jest.fn()}
        order={mockChatOrder}
      />
    )
    expect(readMessages).not.toHaveBeenCalled()
  })

  it('tracks keyboard visibility', () => {
    const listeners = {}
    jest.spyOn(Keyboard, 'addListener').mockImplementation((event, cb) => {
      listeners[event] = cb
      return { remove: jest.fn() }
    })
    renderWithProviders(
      <Messages
        business
        messages={mockEmptyMessagesState}
        setCanRead={jest.fn()}
        order={mockChatOrder}
      />
    )
    act(() => {
      listeners.keyboardDidShow()
      listeners.keyboardDidHide()
      listeners.keyboardWillHide()
    })
    expect(Keyboard.addListener).toHaveBeenCalledWith('keyboardDidShow', expect.any(Function))
  })

  it('submits from the composer return key', () => {
    const handleSend = jest.fn()
    const { getByTestId } = renderWithProviders(
      <Messages
        business
        messages={mockMessagesState}
        message='Hello'
        handleSend={handleSend}
        setMessage={jest.fn()}
        setImage={jest.fn()}
        setCanRead={jest.fn()}
        order={mockChatOrder}
      />
    )
    fireEvent(getByTestId('composer'), 'submitEditing')
    expect(handleSend).toHaveBeenCalled()
  })
})

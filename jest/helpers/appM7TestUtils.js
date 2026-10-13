const React = require('react')
const { Text, TextInput, TouchableOpacity, View } = require('react-native')
const {
  mockBusiness,
  mockDriver,
  mockNavigation,
  mockOrder,
  mockCompletedOrder,
  mockOrderList,
  mockEmptyOrderList,
  mockLoadingOrderList,
  mockPagination,
  mockUtils
} = require('./appM6TestUtils')

const mockSessionUser = {
  id: 1,
  name: 'Pat',
  photo: null
}

const mockChatOrder = {
  ...mockOrder,
  app_id: 'ordering',
  created_at: '2026-09-07 16:00:00',
  driver: { ...mockDriver },
  business: { ...mockBusiness }
}

const mockChatMessages = [
  {
    id: 1,
    type: 0,
    created_at: '2026-09-07 16:00:00',
    author: { id: 1, name: 'Pat' }
  },
  {
    id: 2,
    type: 1,
    change: { attribute: 'status', old: '0', new: '7' },
    can_see: ['2', '4'],
    created_at: '2026-09-07 16:05:00',
    author: { id: 99, name: 'System' }
  },
  {
    id: 3,
    type: 1,
    change: { attribute: 'logistic_status', old: 0, new: 1 },
    can_see: ['2', '4'],
    created_at: '2026-09-07 16:06:00',
    author: { id: 99, name: 'System' }
  },
  {
    id: 4,
    type: 1,
    change: { attribute: 'driver_id', old: null, new: 5 },
    driver: { name: 'Alex', lastname: 'Rivera' },
    comment: 'hi',
    can_see: ['2', '4'],
    created_at: '2026-09-07 16:07:00',
    author: { id: 99, name: 'System' }
  },
  {
    id: 5,
    type: 1,
    change: { attribute: 'driver_id', old: 5, new: null },
    can_see: ['2', '4'],
    created_at: '2026-09-07 16:08:00',
    author: { id: 99, name: 'System' }
  },
  {
    id: 6,
    type: 2,
    comment: 'Hello store',
    change: { attribute: 'status', old: '0', new: '0' },
    can_see: ['2'],
    created_at: '2026-09-07 16:09:00',
    author: { id: 1, name: 'Pat' },
    source: 'https://example.com/chat.jpg'
  },
  {
    id: 7,
    type: 2,
    comment: 'Hidden comment',
    created_at: '2026-09-07 16:10:00',
    author: { id: 2, name: 'Other' }
  }
]

const mockMessagesState = {
  loading: false,
  messages: mockChatMessages
}

const mockEmptyMessagesState = {
  loading: false,
  messages: []
}

const mockReviewOrder = {
  ...mockCompletedOrder,
  business_name: 'Test Store',
  logo: 'https://example.com/logo.jpg',
  delivery_datetime: '2026-09-07 18:00:00',
  review: null,
  user_review: null,
  driver: { ...mockDriver },
  products: [{
    id: 10,
    name: 'Cheese Pizza',
    quantity: 1,
    deleted: false
  }]
}

const mockIdleFormState = {
  loading: false,
  error: false,
  result: { error: false, result: null },
  changes: [{ product_id: 10, qualification: 5 }]
}

const mockErrorFormState = {
  loading: false,
  error: true,
  result: {
    error: true,
    result: ['Review failed']
  },
  changes: []
}

const mockStars = {
  quality: 5,
  punctuality: 5,
  service: 5,
  packaging: 5,
  comments: ''
}

const mockDriverReviews = {
  qualification: 5,
  comment: ''
}

const messagesUIProps = {
  type: 'business',
  order: mockChatOrder,
  messages: mockMessagesState,
  image: null,
  message: '',
  sendMessage: { loading: false, error: null },
  setCanRead: jest.fn(),
  setMessage: jest.fn(),
  handleSend: jest.fn(),
  setImage: jest.fn(),
  readMessages: jest.fn(),
  business: true,
  driver: false,
  messagesToShow: { messages: [] }
}

const messageListingUIProps = {
  navigation: mockNavigation,
  orderList: mockOrderList,
  pagination: mockPagination,
  customArray: null,
  onNavigationRedirect: jest.fn(),
  orderStatus: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26],
  loadMoreOrders: jest.fn(),
  loadOrders: jest.fn(),
  setOrderList: jest.fn(),
  setRefreshOrders: jest.fn(),
  refreshOrders: false,
  onClickOrder: jest.fn()
}

const reviewDriverUIProps = {
  order: mockReviewOrder,
  formState: mockIdleFormState,
  dirverReviews: mockDriverReviews,
  setDriverReviews: jest.fn(),
  handleSendDriverReview: jest.fn(),
  onNavigationRedirect: jest.fn(),
  type: 'driver'
}

const reviewOrderUIProps = {
  order: mockReviewOrder,
  stars: mockStars,
  handleSendReview: jest.fn(),
  formState: mockIdleFormState,
  navigation: { ...mockNavigation, canGoBack: jest.fn(() => true), goBack: jest.fn() },
  setStars: jest.fn(),
  onGoBack: jest.fn(),
  onNavigationRedirect: jest.fn(),
  handleReviewState: jest.fn(),
  setIsReviewed: jest.fn(),
  type: 'order',
  defaultStar: 5
}

const reviewProductUIProps = {
  order: mockReviewOrder,
  onNavigationRedirect: jest.fn(),
  formState: mockIdleFormState,
  handleChangeFormState: jest.fn(),
  handleSendProductReview: jest.fn()
}

const headerReviewMock = ({ order, handleChangeStars, reviewed, type }) => (
  React.createElement(
    View,
    { testID: 'header-review' },
    React.createElement(Text, null, type === 'order' ? order?.business?.name : order?.driver?.name),
    reviewed
      ? React.createElement(Text, null, 'Already reviewed header')
      : React.createElement(
        TouchableOpacity,
        { testID: 'change-stars', onPress: () => handleChangeStars(5) },
        React.createElement(Text, null, 'Rate 5')
      )
  )
)

const giftedChatMock = {
  GiftedChat: (props) => (
    React.createElement(
      View,
      { testID: 'gifted-chat' },
      (props.messages || []).map((msg) => (
        React.createElement(Text, { key: String(msg._id), testID: `chat-msg-${msg._id}` }, msg.text)
      )),
      props.renderInputToolbar ? props.renderInputToolbar({}) : null,
      props.renderComposer ? props.renderComposer({}) : null,
      props.renderSend ? props.renderSend({}) : null,
      props.renderBubble ? props.renderBubble({}) : null,
      props.renderMessageImage ? props.renderMessageImage({}) : null,
      props.scrollToBottomComponent ? props.scrollToBottomComponent() : null,
      props.renderLoading ? props.renderLoading() : null,
      React.createElement(TextInput, {
        testID: 'gifted-input',
        onChangeText: props.onInputTextChanged
      }),
      React.createElement(
        TouchableOpacity,
        { testID: 'gifted-send', onPress: () => props.onSend && props.onSend() },
        React.createElement(Text, null, 'OnSend')
      ),
      React.createElement(
        TouchableOpacity,
        {
          testID: 'gifted-long-press',
          onPress: () => props.onLongPress && props.onLongPress(
            {
              actionSheet: () => ({
                showActionSheetWithOptions: (_opts, cb) => cb(0)
              })
            },
            { text: 'Copy me' }
          )
        },
        React.createElement(Text, null, 'Long press')
      )
    )
  ),
  Actions: (props) => (
    React.createElement(
      View,
      { testID: 'gifted-actions' },
      props.icon ? props.icon() : null,
      React.createElement(
        TouchableOpacity,
        {
          testID: 'send-image',
          onPress: () => props.options && props.options['Send Image'] && props.options['Send Image']()
        },
        React.createElement(Text, null, 'Send Image')
      )
    )
  ),
  InputToolbar: (props) => (
    React.createElement(
      View,
      { testID: 'input-toolbar' },
      props.renderAccessory ? props.renderAccessory() : null,
      props.children
    )
  ),
  Composer: (props) => (
    React.createElement(TextInput, {
      testID: 'composer',
      placeholder: props.placeholder,
      value: props.textInputProps && props.textInputProps.value,
      onSubmitEditing: props.textInputProps && props.textInputProps.onSubmitEditing
    })
  ),
  Send: (props) => (
    React.createElement(View, { testID: 'gifted-send-wrap' }, props.children)
  ),
  Bubble: () => React.createElement(View, { testID: 'gifted-bubble' }),
  MessageImage: () => React.createElement(View, { testID: 'gifted-message-image' })
}

module.exports = {
  mockBusiness,
  mockDriver,
  mockNavigation,
  mockOrder,
  mockCompletedOrder,
  mockOrderList,
  mockEmptyOrderList,
  mockLoadingOrderList,
  mockPagination,
  mockUtils,
  mockSessionUser,
  mockChatOrder,
  mockChatMessages,
  mockMessagesState,
  mockEmptyMessagesState,
  mockReviewOrder,
  mockIdleFormState,
  mockErrorFormState,
  mockStars,
  mockDriverReviews,
  messagesUIProps,
  messageListingUIProps,
  reviewDriverUIProps,
  reviewOrderUIProps,
  reviewProductUIProps,
  headerReviewMock,
  giftedChatMock
}

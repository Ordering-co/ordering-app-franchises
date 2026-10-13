import { fireEvent } from '@testing-library/react-native'
import { BackHandler } from 'react-native'

import MessageView from '../MessageView'
import { renderPage } from '../../../jest/helpers/renderPage'
import { setupPageTestEnv } from '../../../jest/helpers/pageTestSetup'

jest.mock('@ui', () => require('../../../jest/helpers/mockUi'))

const mockReadMessages = jest.fn()

jest.mock('@components', () => {
  const mockOrdering = require('../../../jest/helpers/mockOrdering')
  const React = require('react')
  const { View } = require('react-native')
  return {
    ...mockOrdering,
    OrderDetails: (props: any) => {
      const UI = props.UIComponent
      const order = props.order ?? {
        id: 5,
        business: { name: 'Test Business' },
        driver: { name: 'Test Driver' }
      }
      return React.createElement(
        View,
        { testID: 'message-view-order-details' },
        React.createElement(UI, {
          navigation: props.navigation,
          order: { order },
          messages: props.messages ?? [],
          setMessages: jest.fn(),
          readMessages: mockReadMessages,
          messagesReadList: props.messagesReadList ?? [],
          business: props.business,
          driver: props.driver,
          goToBack: props.goToBack,
          type: props.type
        })
      )
    }
  }
})

describe('MessageView page', () => {
  let backHandlerCallback: (() => boolean) | null = null
  const removeBackHandler = jest.fn()

  beforeEach(() => {
    setupPageTestEnv()
    backHandlerCallback = null
    jest.spyOn(BackHandler, 'addEventListener').mockImplementation((event, handler) => {
      if (event === 'hardwareBackPress') {
        backHandlerCallback = handler as () => boolean
      }
      return { remove: removeBackHandler }
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders business chat with navbar and close handler', () => {
    const { getByTestId, navigation } = renderPage(MessageView, {
      route: {
        params: {
          order: { id: 8, business: { name: 'Pizza Place' }, driver: { name: 'Sam' } },
          business: true,
          driver: false
        }
      }
    })
    expect(getByTestId('message-view-order-details')).toBeTruthy()
    expect(getByTestId('navbar-title').props.children).toBe('Pizza Place')
    fireEvent.press(getByTestId('navbar-back'))
    expect(navigation.goBack).toHaveBeenCalled()
    fireEvent.press(getByTestId('messages-close'))
    expect(navigation.goBack).toHaveBeenCalledTimes(2)
  })

  it('renders driver chat when driver type is active', () => {
    const { getByTestId } = renderPage(MessageView, {
      route: {
        params: {
          type: 'driver',
          order: { id: 9, business: { name: 'Burger Co' }, driver: { name: 'Alex' } },
          business: false,
          driver: true
        }
      }
    })
    expect(getByTestId('navbar-title').props.children).toBe('Alex')
    expect(getByTestId('navbar-subtitle').props.children).toBe('Driver')
  })

  it('reads messages when order changes and handles hardware back', () => {
    const { unmount, navigation } = renderPage(MessageView, {
      route: {
        params: {
          orderId: 10,
          order: { id: 10, business: { name: 'Cafe' }, driver: { name: 'Lee' } }
        }
      }
    })
    expect(mockReadMessages).toHaveBeenCalled()
    expect(backHandlerCallback).toBeTruthy()
    backHandlerCallback?.()
    expect(navigation.navigate).toHaveBeenCalledWith('BottomTab')
    unmount()
    expect(removeBackHandler).toHaveBeenCalled()
  })
})

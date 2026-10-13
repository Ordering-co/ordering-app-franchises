import { fireEvent } from '@testing-library/react-native'
import { useConfig, useOrder } from '@components'

import MomentOption from '../MomentOption'
import { renderPage } from '../../../jest/helpers/renderPage'
import { setupPageTestEnv } from '../../../jest/helpers/pageTestSetup'

jest.mock('@ui', () => require('../../../jest/helpers/mockUi'))

describe('MomentOption page', () => {
  beforeEach(() => {
    setupPageTestEnv({
      config: [{
        configs: {
          max_days_preorder: { key: 'max_days_preorder', value: '3' },
          preorder_slot_interval: { key: 'preorder_slot_interval', value: 'catering_delivery,30|catering_pickup,45' },
          preorder_lead_time: { key: 'preorder_lead_time', value: 'catering_delivery,60|catering_pickup,90' },
          preorder_time_range: { key: 'preorder_time_range', value: 'catering_delivery,120|catering_pickup,180' },
          preorder_maximum_days: { key: 'preorder_maximum_days', value: 'catering_delivery,5|catering_pickup,7' },
          preorder_minimum_days: { key: 'preorder_minimum_days', value: 'catering_delivery,1|catering_pickup,2' }
        }
      }]
    })
    useOrder.mockReturnValue([{ options: { type: 1 } }, {}])
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders schedule order with moment controller', () => {
    const { getByTestId } = renderPage(MomentOption, {
      route: { params: { business: { id: 5 } } }
    })
    expect(getByTestId('navbar-title').props.children).toBe('Schedule Order')
    expect(getByTestId('moment-option-controller')).toBeTruthy()
  })

  it('goes back from navbar when navigation can go back', () => {
    const { getByTestId, navigation } = renderPage(MomentOption)
    fireEvent.press(getByTestId('navbar-back'))
    expect(navigation.goBack).toHaveBeenCalled()
  })

  it('caps maxDate at end of day', () => {
    const { getByTestId } = renderPage(MomentOption, {
      route: { params: { business: { id: 5 } } }
    })
    const { maxDate } = getByTestId('moment-option-controller').props
    expect(maxDate.getHours()).toBe(23)
    expect(maxDate.getMinutes()).toBe(59)
  })

  it('computes catering preorder props for catering delivery type', () => {
    useOrder.mockReturnValue([{ options: { type: 7 } }, {}])
    const { getByTestId } = renderPage(MomentOption)
    expect(getByTestId('moment-option-controller')).toBeTruthy()
  })
})

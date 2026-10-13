import { fireEvent, waitFor } from '@testing-library/react-native'
import { MomentOption } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import {
  mockBusinessWithTz,
  mockDatesList,
  mockHoursList,
  mockNavigation,
  mockSchedule,
  mockScheduledOrderState
} from '../../../../../../jest/helpers/appM6TestUtils'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))
jest.mock('react-native-loading-spinner-overlay', () => 'Spinner')
jest.mock('react-native-calendar-strip', () => (
  require('../../../../../../jest/helpers/appM6TestUtils').calendarStripMock
))
jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  useConfig: jest.fn(() => [{
    loading: false,
    configs: require('../../../../../../jest/helpers/appM6TestUtils').mockConfigs
  }]),
  useUtils: jest.fn(() => [require('../../../../../../jest/helpers/appM6TestUtils').mockUtils]),
  useOrder: jest.fn(() => [
    require('../../../../../../jest/helpers/appM6TestUtils').mockScheduledOrderState,
    require('../../../../../../jest/helpers/appM6TestUtils').mockOrderFns
  ]),
  MomentOption: ({ UIComponent, ...rest }) => {
    const React = require('react')
    const { momentOptionUIProps } = require('../../../../../../jest/helpers/appM6TestUtils')
    return React.createElement(UIComponent, { ...momentOptionUIProps, ...rest })
  }
}))

describe('MomentOption UI', () => {
  // The component drops catering slots earlier than moment(), and the fixtures
  // are keyed to 2026-09-07..09-09. Freeze the clock so the suite does not go
  // red once the real date passes the fixture dates. moment() reads Date.now().
  let dateNowSpy: jest.SpyInstance<number, []>

  beforeAll(() => {
    dateNowSpy = jest
      .spyOn(Date, 'now')
      .mockReturnValue(new Date(2026, 8, 7, 12, 0, 0).getTime())
  })

  afterAll(() => {
    dateNowSpy.mockRestore()
  })

  it('renders schedule slots and continues with a selected time', async () => {
    const handleChangeTime = jest.fn()
    const handleAsap = jest.fn()
    const handleChangeDate = jest.fn()
    const navigation = { ...mockNavigation, canGoBack: jest.fn(() => true), goBack: jest.fn() }
    const { getByText, getByTestId } = renderWithProviders(
      <MomentOption
        navigation={navigation}
        datesList={mockDatesList}
        hoursList={mockHoursList}
        dateSelected='2026-09-08'
        timeSelected='18:00'
        getActualSchedule={() => mockSchedule}
        handleChangeTime={handleChangeTime}
        handleAsap={handleAsap}
        handleChangeDate={handleChangeDate}
      />
    )

    await waitFor(() => {
      expect(getByText('Schedule for later')).toBeTruthy()
      expect(getByTestId('calendar-strip')).toBeTruthy()
    })
    expect(getByText(/The selected time is only to prepare the order/)).toBeTruthy()
    expect(getByText('09:00AM')).toBeTruthy()

    fireEvent.press(getByTestId('calendar-date'))
    expect(handleChangeDate).toHaveBeenCalled()

    fireEvent.press(getByText('Continue'))
    expect(handleChangeTime).toHaveBeenCalledWith('18:00')
  })

  it('selects ASAP and can switch back to schedule', () => {
    const { useOrder } = require('@components')
    useOrder.mockReturnValueOnce([
      {
        loading: false,
        carts: {},
        options: { type: 1, moment: null }
      },
      {}
    ])
    const handleAsap = jest.fn()
    const { getByText } = renderWithProviders(
      <MomentOption
        navigation={mockNavigation}
        datesList={mockDatesList}
        hoursList={mockHoursList}
        dateSelected='2026-09-08'
        timeSelected={null}
        preorderLeadTime={15}
        preorderMinimumDays={1}
        getActualSchedule={() => mockSchedule}
        handleAsap={handleAsap}
        handleChangeTime={jest.fn()}
        handleChangeDate={jest.fn()}
      />
    )
    fireEvent.press(getByText(/ASAP/))
    expect(handleAsap).toHaveBeenCalled()
    fireEvent.press(getByText('Schedule for later'))
    expect(getByText(/The selected time is only to prepare the order/)).toBeTruthy()
  })

  it('keeps schedule selected when a moment is already set', async () => {
    const { getByTestId, getByText } = renderWithProviders(
      <MomentOption
        navigation={mockNavigation}
        datesList={mockDatesList}
        hoursList={mockHoursList}
        dateSelected='2026-09-08'
        timeSelected='18:00'
        getActualSchedule={() => mockSchedule}
        handleAsap={jest.fn()}
        handleChangeTime={jest.fn()}
        handleChangeDate={jest.fn()}
      />
    )
    await waitFor(() => {
      expect(getByTestId('calendar-strip')).toBeTruthy()
    })
    expect(getByText('06:00PM')).toBeTruthy()
  })

  it('shows a closed message when there is no schedule', async () => {
    const { getByText } = renderWithProviders(
      <MomentOption
        navigation={mockNavigation}
        datesList={mockDatesList}
        hoursList={mockHoursList}
        dateSelected='2026-09-08'
        timeSelected='18:00'
        business={mockBusinessWithTz}
        getActualSchedule={() => null}
        handleAsap={jest.fn()}
        handleChangeTime={jest.fn()}
        handleChangeDate={jest.fn()}
      />
    )
    await waitFor(() => {
      expect(getByText('The business is closed at the moment')).toBeTruthy()
    })
  })

  it('selects a catering slot immediately', async () => {
    const handleChangeTime = jest.fn()
    const { getByText } = renderWithProviders(
      <MomentOption
        navigation={mockNavigation}
        datesList={mockDatesList}
        hoursList={mockHoursList}
        dateSelected='2026-09-08'
        timeSelected='09:00'
        cateringPreorder
        isCart
        preorderLeadTime={30}
        preorderMinimumDays={1}
        preorderMaximumDays={6}
        business={mockBusinessWithTz}
        getActualSchedule={() => mockSchedule}
        handleAsap={jest.fn()}
        handleChangeTime={handleChangeTime}
        handleChangeDate={jest.fn()}
      />
    )
    await waitFor(() => {
      expect(getByText(/09:00/)).toBeTruthy()
    })
    fireEvent.press(getByText(/09:00/))
    expect(handleChangeTime).toHaveBeenCalled()
  })

  it('still lists times when only one date is available', async () => {
    const { getByText } = renderWithProviders(
      <MomentOption
        navigation={mockNavigation}
        datesList={['2026-09-08']}
        hoursList={mockHoursList}
        dateSelected='2026-09-08'
        timeSelected='18:00'
        getActualSchedule={() => mockSchedule}
        handleAsap={jest.fn()}
        handleChangeTime={jest.fn()}
        handleChangeDate={jest.fn()}
      />
    )
    await waitFor(() => {
      expect(getByText('06:00PM')).toBeTruthy()
    })
  })
})

import { fireEvent } from '@testing-library/react-native'
import { ProfessionalProfile } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import {
  buildWeekSchedule,
  mockProfessional
} from '../../../../../../jest/helpers/appM9RewardsTestUtils'

jest.mock('@ui', () => require('../../../../../../jest/helpers/appM9RewardsTestUtils').appM9UiMock)
jest.mock('react-native-fast-image', () => require('../../../../../../jest/helpers/fastImageMock'))
jest.mock('react-native-select-dropdown', () => require('../../../../../../jest/helpers/appM9RewardsTestUtils').SelectDropdownMock)
jest.mock('react-native-calendar-picker', () => require('../../../../../../jest/helpers/appM9RewardsTestUtils').CalendarPickerMock)
jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  useUtils: jest.fn(() => [require('../../../../../../jest/helpers/appM9RewardsTestUtils').mockUtils]),
  useConfig: jest.fn(() => [{
    loading: false,
    configs: require('../../../../../../jest/helpers/appM9RewardsTestUtils').mockRewardsConfigs
  }])
}))

const renderProfile = (props = {}) => renderWithProviders(
  <ProfessionalProfile
    professional={mockProfessional}
    handleChangeProfessionalSelected={jest.fn()}
    onClose={jest.fn()}
    {...props}
  />
)

describe('ProfessionalProfile UI', () => {
  afterEach(() => {
    const { useConfig } = require('@components')
    useConfig.mockReturnValue([{
      loading: false,
      configs: require('../../../../../../jest/helpers/appM9RewardsTestUtils').mockRewardsConfigs
    }])
  })

  it('renders the professional name and schedule', () => {
    const { getByText, getByTestId } = renderProfile()
    expect(getByText('Alex Kim')).toBeTruthy()
    expect(getByText('Schedule')).toBeTruthy()
    expect(getByText('Required')).toBeTruthy()
    expect(getByTestId('calendar-picker')).toBeTruthy()
    expect(getByText('Book')).toBeTruthy()
  })

  it('shows a fallback photo and no-schedule copy', () => {
    const { getByText } = renderProfile({
      professional: {
        ...mockProfessional,
        photo: null,
        schedule: null
      }
    })
    expect(getByText('No schedule')).toBeTruthy()
  })

  it('shows an unavailable message when the day is closed', () => {
    const { getByText, queryByTestId } = renderProfile({
      professional: {
        ...mockProfessional,
        schedule: buildWeekSchedule({ enabled: false, lapses: [] })
      }
    })
    expect(getByText('Professional is not available at the moment')).toBeTruthy()
    expect(queryByTestId('select-dropdown')).toBeNull()
  })

  it('books the professional and closes the profile', () => {
    const handleChangeProfessionalSelected = jest.fn()
    const onClose = jest.fn()
    const { getByText } = renderProfile({ handleChangeProfessionalSelected, onClose })
    fireEvent.press(getByText('Book'))
    expect(handleChangeProfessionalSelected).toHaveBeenCalledWith(mockProfessional)
    expect(onClose).toHaveBeenCalled()
  })

  it('builds 12-hour times after a date change', () => {
    const { useConfig } = require('@components')
    useConfig.mockReturnValue([{
      loading: false,
      configs: require('../../../../../../jest/helpers/appM9RewardsTestUtils').mockTwelveHourConfigs
    }])
    const { getByTestId, getByText } = renderProfile({
      professional: {
        ...mockProfessional,
        schedule: buildWeekSchedule({ openHour: 0, closeHour: 13 })
      }
    })
    fireEvent.press(getByTestId('calendar-tomorrow'))
    expect(getByTestId('select-dropdown')).toBeTruthy()
    expect(getByText('12:00 AM')).toBeTruthy()
    expect(getByText('12:00 PM')).toBeTruthy()
    expect(getByText('01:00 PM')).toBeTruthy()
  })

  it('selects a time slot from the dropdown', () => {
    const { getByTestId } = renderProfile({
      professional: {
        ...mockProfessional,
        schedule: buildWeekSchedule({ openHour: 9, closeHour: 10 })
      }
    })
    fireEvent.press(getByTestId('calendar-tomorrow'))
    fireEvent.press(getByTestId('time-option-09:00'))
    expect(getByTestId('select-dropdown')).toBeTruthy()
  })

  it('marks busy times in the dropdown', () => {
    const start = new Date()
    start.setDate(start.getDate() + 1)
    start.setHours(0, 0, 0, 0)
    const end = new Date(start)
    end.setHours(23, 59, 0, 0)
    const { getByText, getByTestId } = renderProfile({
      professional: {
        ...mockProfessional,
        schedule: buildWeekSchedule({ openHour: 9, closeHour: 9, closeMinute: 15 }),
        busy_times: [
          { start: start.toISOString(), end: end.toISOString() }
        ]
      }
    })
    fireEvent.press(getByTestId('calendar-tomorrow'))
    expect(getByText('09:00')).toBeTruthy()
  })
})

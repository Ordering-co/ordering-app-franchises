import { ScheduleAccordion } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

describe('ScheduleAccordion UI', () => {
  it('renders weekday and open hours', () => {
    const { getByText } = renderWithProviders(
      <ScheduleAccordion
        weekIndex={1}
        timeFormated={(value) => `${value.hour}:00`}
        schedule={{
          enabled: true,
          lapses: [{ open: { hour: 9 }, close: { hour: 22 } }]
        }}
      />
    )
    expect(getByText('Monday')).toBeTruthy()
    expect(getByText('9:00')).toBeTruthy()
    expect(getByText('22:00')).toBeTruthy()
  })

  it('renders closed day', () => {
    const { getByText } = renderWithProviders(
      <ScheduleAccordion
        weekIndex={0}
        timeFormated={() => ''}
        schedule={{
          enabled: false,
          lapses: [{ open: { hour: 0 }, close: { hour: 0 } }]
        }}
      />
    )
    expect(getByText('Sunday')).toBeTruthy()
    expect(getByText('Closed')).toBeTruthy()
  })
})

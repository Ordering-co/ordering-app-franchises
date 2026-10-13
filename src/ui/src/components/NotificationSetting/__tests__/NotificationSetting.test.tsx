import { NotificationSetting } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))
jest.mock('react-native-permissions', () => ({
  openSettings: jest.fn(),
  checkNotifications: jest.fn(() => Promise.resolve({ status: 'granted' }))
}))

describe('NotificationSetting UI', () => {
  it('renders notification prompt when popup is open', () => {
    const { getByText } = renderWithProviders(
      <NotificationSetting
        checkNotificationStatus={{ open: true, checked: false }}
        setCheckNotificationStatus={jest.fn()}
      />
    )
    expect(getByText('Activate notifications to receive information about your orders')).toBeTruthy()
  })
})

import { TouchableOpacity } from 'react-native'
import { fireEvent } from '@testing-library/react-native'
import { SingleProfessionalCard } from '../index'
import { renderWithProviders } from '../../../../../../../jest/helpers/renderWithProviders'
import {
  mockFavoriteProfessional,
  mockProfessional,
  singleProfessionalCardUIProps
} from '../../../../../../../jest/helpers/appM9RewardsTestUtils'

jest.mock('@ui', () => require('../../../../../../../jest/helpers/appM9RewardsTestUtils').appM9UiMock)
jest.mock('react-native-fast-image', () => require('../../../../../../../jest/helpers/fastImageMock'))
jest.mock('@components', () => ({
  ...require('../../../../../../../jest/helpers/mockOrdering'),
  useUtils: jest.fn(() => [require('../../../../../../../jest/helpers/appM9RewardsTestUtils').mockUtils]),
  useSession: jest.fn(() => [require('../../../../../../../jest/helpers/appM9RewardsTestUtils').mockAuthSession, {}]),
  SingleProfessionalCard: ({ UIComponent, ...rest }) => {
    const React = require('react')
    const { singleProfessionalCardUIProps } = require('../../../../../../../jest/helpers/appM9RewardsTestUtils')
    return React.createElement(UIComponent, { ...singleProfessionalCardUIProps, ...rest })
  }
}))

const renderCard = (props = {}) => renderWithProviders(
  <SingleProfessionalCard {...singleProfessionalCardUIProps} {...props} />
)

describe('SingleProfessionalCard UI', () => {
  afterEach(() => {
    const { useSession } = require('@components')
    useSession.mockReturnValue([
      require('../../../../../../../jest/helpers/appM9RewardsTestUtils').mockAuthSession,
      {}
    ])
  })

  it('renders the professional name', () => {
    const { getByText } = renderCard()
    expect(getByText('Alex Kim')).toBeTruthy()
  })

  it('opens the professional from a card press', () => {
    const handleProfessionalClick = jest.fn()
    const { getByText } = renderCard({ handleProfessionalClick })
    fireEvent.press(getByText('Alex Kim'))
    expect(handleProfessionalClick).toHaveBeenCalledWith(mockProfessional)
  })

  it('toggles a favorite when the user is logged in', () => {
    const handleFavoriteProfessional = jest.fn()
    const { UNSAFE_getAllByType } = renderCard({ handleFavoriteProfessional })
    const touchables = UNSAFE_getAllByType(TouchableOpacity)
    fireEvent.press(touchables[1])
    expect(handleFavoriteProfessional).toHaveBeenCalledWith(true)
  })

  it('skips favorite changes when the user is logged out', () => {
    const { useSession } = require('@components')
    useSession.mockReturnValue([{ auth: false, user: null }, {}])
    const handleFavoriteProfessional = jest.fn()
    const { UNSAFE_getAllByType } = renderCard({ handleFavoriteProfessional })
    fireEvent.press(UNSAFE_getAllByType(TouchableOpacity)[1])
    expect(handleFavoriteProfessional).not.toHaveBeenCalled()
  })

  it('renders a favorite professional without a photo', () => {
    const handleFavoriteProfessional = jest.fn()
    const { getByText, UNSAFE_getAllByType } = renderCard({
      professional: mockFavoriteProfessional,
      handleFavoriteProfessional
    })
    expect(getByText('Sam Ortiz')).toBeTruthy()
    fireEvent.press(UNSAFE_getAllByType(TouchableOpacity)[1])
    expect(handleFavoriteProfessional).toHaveBeenCalledWith(false)
  })
})

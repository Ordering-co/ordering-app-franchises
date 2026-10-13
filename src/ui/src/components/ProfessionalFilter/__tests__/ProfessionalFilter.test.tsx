import { fireEvent } from '@testing-library/react-native'
import { ProfessionalFilter } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import {
  mockFavoriteProfessional,
  mockProfessional
} from '../../../../../../jest/helpers/appM9RewardsTestUtils'

jest.mock('@ui', () => require('../../../../../../jest/helpers/appM9RewardsTestUtils').appM9UiMock)
jest.mock('react-native-fast-image', () => require('../../../../../../jest/helpers/fastImageMock'))
jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  useUtils: jest.fn(() => [require('../../../../../../jest/helpers/appM9RewardsTestUtils').mockUtils]),
  useSession: jest.fn(() => [require('../../../../../../jest/helpers/appM9RewardsTestUtils').mockAuthSession, {}]),
  SingleProfessionalCard: ({ UIComponent, handleUpdateProfessionals, ...rest }) => {
    const React = require('react')
    const { Text, TouchableOpacity, View } = require('react-native')
    return React.createElement(
      View,
      null,
      React.createElement(UIComponent, {
        handleFavoriteProfessional: jest.fn(),
        ...rest
      }),
      React.createElement(
        TouchableOpacity,
        {
          testID: `update-professional-${rest.professional?.id}`,
          onPress: () => handleUpdateProfessionals?.(rest.professional?.id, { favorite: true })
        },
        React.createElement(Text, null, 'Update professional')
      )
    )
  }
}))

const renderFilter = (props = {}) => renderWithProviders(
  <ProfessionalFilter
    professionals={[mockProfessional, mockFavoriteProfessional]}
    professionalSelected={null}
    handleChangeProfessionalSelected={jest.fn()}
    handleUpdateProfessionals={jest.fn()}
    {...props}
  />
)

describe('ProfessionalFilter UI', () => {
  it('renders the any-member option and professional names', () => {
    const { getByText } = renderFilter()
    expect(getByText('Any professional member')).toBeTruthy()
    expect(getByText('Alex Kim')).toBeTruthy()
    expect(getByText('Sam Ortiz')).toBeTruthy()
  })

  it('clears the selected professional from the any-member control', () => {
    const handleChangeProfessionalSelected = jest.fn()
    const { getByText } = renderFilter({
      professionalSelected: mockProfessional,
      handleChangeProfessionalSelected
    })
    fireEvent.press(getByText('Any professional member'))
    expect(handleChangeProfessionalSelected).toHaveBeenCalledWith(null)
  })

  it('opens a professional profile and books that person', () => {
    const handleChangeProfessionalSelected = jest.fn()
    const { getByText, getByTestId, queryByTestId } = renderFilter({
      handleChangeProfessionalSelected
    })
    fireEvent.press(getByText('Alex Kim'))
    expect(getByTestId('professional-profile')).toBeTruthy()
    fireEvent.press(getByTestId('book-professional'))
    expect(handleChangeProfessionalSelected).toHaveBeenCalledWith(mockProfessional)
    expect(queryByTestId('professional-profile')).toBeNull()
  })

  it('closes the professional profile without selecting', () => {
    const { getByText, getByTestId, queryByTestId } = renderFilter()
    fireEvent.press(getByText('Sam Ortiz'))
    fireEvent.press(getByTestId('close-professional-profile'))
    expect(queryByTestId('professional-profile')).toBeNull()
  })

  it('forwards professional updates from a card', () => {
    const handleUpdateProfessionals = jest.fn()
    const { getByTestId } = renderFilter({ handleUpdateProfessionals })
    fireEvent.press(getByTestId('update-professional-4'))
    expect(handleUpdateProfessionals).toHaveBeenCalledWith({
      ...mockProfessional,
      favorite: true
    })
  })
})

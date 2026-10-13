import NavBar from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('react-native-fast-image', () => require('../../../../../../jest/helpers/fastImageMock'))
jest.mock('react-native-vector-icons/AntDesign', () => {
  const React = require('react')
  const { View } = require('react-native')
  return () => React.createElement(View, { testID: 'ant-design-icon' })
})

describe('NavBar UI', () => {
  it('renders title text', () => {
    const { getByText } = renderWithProviders(
      <NavBar title='Settings' />
    )
    expect(getByText('Settings')).toBeTruthy()
  })
})

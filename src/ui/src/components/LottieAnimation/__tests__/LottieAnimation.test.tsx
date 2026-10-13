import { fireEvent } from '@testing-library/react-native'
import { LottieAnimation } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('lottie-react-native', () => 'Lottie')

describe('LottieAnimation UI', () => {
  it('renders favorite icon fallback when animation is hidden', () => {
    const onClick = jest.fn()
    const { UNSAFE_getAllByType } = renderWithProviders(
      <LottieAnimation
        initialValue={0}
        toValue={1}
        type='favorite'
        isActive={false}
        onClick={onClick}
      />
    )
    const { TouchableOpacity } = require('react-native')
    const buttons = UNSAFE_getAllByType(TouchableOpacity)
    fireEvent.press(buttons[0])
    expect(onClick).toHaveBeenCalled()
  })
})

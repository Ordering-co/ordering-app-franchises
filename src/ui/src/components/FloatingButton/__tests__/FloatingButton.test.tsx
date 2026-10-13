import { fireEvent } from '@testing-library/react-native'
import { FloatingButton } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

describe('FloatingButton UI', () => {
  it('renders primary action and handles click', () => {
    const handleClick = jest.fn()
    const { getByText } = renderWithProviders(
      <FloatingButton text='Continue' handleClick={handleClick} />
    )
    fireEvent.press(getByText('Continue'))
    expect(handleClick).toHaveBeenCalled()
  })
})

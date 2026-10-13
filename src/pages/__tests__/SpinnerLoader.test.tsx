import SpinnerLoader from '../SpinnerLoader'
import { renderWithProviders } from '../../../jest/helpers/renderWithProviders'

jest.mock('react-native-loading-spinner-overlay', () => {
  const { View } = require('react-native')
  return (props: any) => <View testID='spinner-overlay' {...props} />
})

describe('SpinnerLoader page', () => {
  it('renders visible spinner overlay', () => {
    const { getByTestId } = renderWithProviders(<SpinnerLoader />)
    expect(getByTestId('spinner-overlay').props.visible).toBe(true)
  })
})

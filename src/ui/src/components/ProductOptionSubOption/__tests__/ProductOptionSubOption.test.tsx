import { ProductOptionSubOption } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('react-native-fast-image', () => require('../../../../../../jest/helpers/fastImageMock'))
jest.mock('rn-placeholder', () => ({
  Fade: ({ children }) => children,
  Placeholder: ({ children }) => children,
  PlaceholderLine: () => null
}))
jest.mock('react-native-intersection-observer', () => {
  const React = require('react')
  const { View } = require('react-native')
  return {
    InView: ({ children }) => React.createElement(View, { testID: 'in-view' }, children)
  }
})
jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  useUtils: jest.fn(() => [require('../../../../../../jest/helpers/appM4TestUtils').mockUtils]),
  ProductOptionSuboption: ({ UIComponent, ...rest }) => {
    const React = require('react')
    return React.createElement(UIComponent, {
      state: { selected: false, quantity: 0, position: 'whole' },
      increment: jest.fn(),
      decrement: jest.fn(),
      balance: 0,
      option: { id: 1, name: 'Size', min: 1, max: 1, suboptions: [{ id: 2 }] },
      suboption: { id: 2, name: 'Large', price: 2, max: 1 },
      toggleSelect: jest.fn(),
      changePosition: jest.fn(),
      disabled: false,
      setIsScrollAvailable: jest.fn(),
      enableIntersection: false,
      ...rest
    })
  }
}))

describe('ProductOptionSubOption UI', () => {
  it('renders suboption name', () => {
    const { getByText } = renderWithProviders(
      <ProductOptionSubOption />
    )
    expect(getByText('Large')).toBeTruthy()
  })
})

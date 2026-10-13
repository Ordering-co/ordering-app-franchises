import React from 'react'
import { Text } from 'react-native'
import { renderWithProviders } from '../renderWithProviders'
import { createNavigationStub, renderPage } from '../renderPage'

const Probe = () => <Text>harness-ok</Text>
const PageProbe = () => <Text>page-ok</Text>

describe("harness", () => {
  it('renders with theme and safe-area providers', () => {
    const { getByText } = renderWithProviders(<Probe />)
    expect(getByText('harness-ok')).toBeTruthy()
  })

  it('renders a page with navigation stubs', () => {
    const { getByText, navigation } = renderPage(PageProbe)
    expect(getByText('page-ok')).toBeTruthy()
    expect(typeof navigation.navigate).toBe('function')
  })

  it('creates a navigation stub with overrides', () => {
    const navigate = jest.fn()
    const navigation = createNavigationStub({ navigate })
    expect(navigation.navigate).toBe(navigate)
    expect(navigation.canGoBack()).toBe(true)
  })
})

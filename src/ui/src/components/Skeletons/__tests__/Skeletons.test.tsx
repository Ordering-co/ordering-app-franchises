import React from 'react'
import { Skeletons } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('rn-placeholder', () => ({
  Fade: ({ children }) => children,
  Placeholder: ({ children }) => children,
  PlaceholderLine: () => null
}))

const SkeletonHarness = ({ variant = 'business' }) => {
  const skeletons = Skeletons()
  const Component = variant === 'business'
    ? skeletons.BusinessSkeleton
    : variant === 'product'
      ? skeletons.ProductSkeleton
      : skeletons.OrderSkeleton
  return <Component />
}

describe('Skeletons UI', () => {
  it('exports skeleton placeholders', () => {
    let exports
    const Probe = () => {
      exports = Skeletons()
      return null
    }
    renderWithProviders(<Probe />)
    expect(exports.BusinessSkeleton).toBeTruthy()
    expect(exports.ProductSkeleton).toBeTruthy()
    expect(exports.OrderSkeleton).toBeTruthy()
  })

  it('renders business skeleton', () => {
    const { toJSON } = renderWithProviders(<SkeletonHarness variant='business' />)
    expect(toJSON()).toBeTruthy()
  })
})

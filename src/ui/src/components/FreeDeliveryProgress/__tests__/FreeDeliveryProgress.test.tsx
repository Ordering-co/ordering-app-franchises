import React from 'react'
import { useUtils } from '@components'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import { FreeDeliveryProgress } from '..'

describe('FreeDeliveryProgress', () => {
  it.each(['awareness', 'progress', 'unconfirmed', 'unlocked'] as const)('shows %s without an icon', (status) => {
    const { UNSAFE_queryAllByType } = renderWithProviders(
      <FreeDeliveryProgress status={status} minimum={30} remainingAmount={18} progressPercent={40} />
    )

    expect(UNSAFE_queryAllByType('Icon')).toHaveLength(0)
  })

  beforeEach(() => {
    ;(useUtils as jest.Mock).mockReturnValue([{ parsePrice: (value: number) => `$${value.toFixed(2)}` }])
  })

  it('renders nothing when hidden', () => {
    const { queryByTestId } = renderWithProviders(<FreeDeliveryProgress status='hidden' />)
    expect(queryByTestId('free-delivery-progress')).toBeNull()
  })

  it('formats decimal-safe awareness amounts', () => {
    const { getByText } = renderWithProviders(
      <FreeDeliveryProgress status='awareness' minimum={20.1} />
    )
    expect(getByText('Free delivery on orders $20.10+')).toBeTruthy()
  })

  it.each(['compact', 'full'] as const)('renders accessible progress in the %s variant', (variant) => {
    const { getByText, getByTestId } = renderWithProviders(
      <FreeDeliveryProgress
        status='progress'
        remainingAmount={4.2}
        progressPercent={79}
        variant={variant}
      />
    )

    expect(getByText('Add $4.20 for free delivery')).toBeTruthy()
    expect(getByTestId('free-delivery-progress')).toHaveProp('variant', variant)
    expect(getByTestId('free-delivery-progress-bar')).toHaveProp('accessibilityValue', {
      min: 0,
      max: 100,
      now: 79
    })
  })

  it('communicates unlocked with text and an accessibility label', () => {
    const { getByText, getByTestId } = renderWithProviders(
      <FreeDeliveryProgress status='unlocked' />
    )
    expect(getByText('Free delivery unlocked')).toBeTruthy()
    expect(getByTestId('free-delivery-progress')).toHaveProp('accessibilityLabel', 'Free delivery unlocked')
  })

  it('does not promise free delivery until the cart confirms the offer', () => {
    const { getByText, getByTestId, queryByText, queryByTestId } = renderWithProviders(
      <FreeDeliveryProgress status='unconfirmed' variant='compact' />
    )

    expect(getByText('Free delivery has not been applied to this cart yet')).toBeTruthy()
    expect(getByTestId('free-delivery-progress')).toHaveProp('accessibilityLabel', 'Free delivery has not been applied to this cart yet')
    expect(queryByText('Free delivery unlocked')).toBeNull()
    expect(queryByTestId('free-delivery-progress-bar')).toBeNull()
  })
})

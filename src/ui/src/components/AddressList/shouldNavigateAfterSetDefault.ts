function asRecord (value: unknown) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null
}

export function shouldNavigateAfterSetDefault (result: unknown) {
  if (result === false) return false
  const record = asRecord(result)
  if (record?.error) return false
  return true
}

export function getAddressListContinueState ({
  hasAddress,
  disableContinue,
  locationPromptOpen,
  orderLoading,
  actionLoading,
  nearestLoading,
  isSettingAddress,
  selectedAddressId,
  cartAddressId
}: {
  hasAddress?: unknown
  disableContinue?: unknown
  locationPromptOpen?: unknown
  orderLoading?: unknown
  actionLoading?: unknown
  nearestLoading?: unknown
  isSettingAddress?: unknown
  selectedAddressId?: unknown
  cartAddressId?: unknown
}) {
  const addressPending = selectedAddressId != null &&
    cartAddressId != null &&
    String(selectedAddressId) !== String(cartAddressId)

  if (isSettingAddress || addressPending) {
    return { visible: true, loading: true }
  }
  return {
    visible: (!!hasAddress || !!orderLoading) && !disableContinue && !locationPromptOpen,
    loading: !!(actionLoading || orderLoading || nearestLoading)
  }
}

export async function runSetDefaultThenNavigate ({
  setDefault,
  navigate
}: {
  setDefault: () => Promise<unknown>
  navigate: () => void | Promise<void>
}) {
  try {
    const result = await setDefault()
    if (!shouldNavigateAfterSetDefault(result)) return false
    await navigate()
    return true
  } catch {
    return false
  }
}

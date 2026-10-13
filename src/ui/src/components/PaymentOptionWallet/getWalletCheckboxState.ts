export function isVisibleWallet (wallet: any, walletName: any) {
  return !!(wallet?.valid && wallet.balance >= 0 && walletName?.[wallet.type]?.isActive)
}

export function getWalletCheckedMap (wallets: unknown, paymentEvents: unknown) {
  const map: Record<string, boolean> = {}
  const events = Array.isArray(paymentEvents) ? paymentEvents : []
  if (!Array.isArray(wallets)) return map

  wallets.forEach((wallet: any) => {
    if (wallet?.id == null) return
    map[wallet.id] = events.some((event: any) => event?.wallet_id === wallet.id)
  })

  return map
}

export function getWalletTogglePlan (checkedMap: Record<string, boolean> | null | undefined, wallet: any) {
  const walletId = wallet?.id ?? null
  const checked = !!(walletId != null && checkedMap?.[walletId])
  return {
    walletId,
    nextChecked: !checked,
    action: checked ? 'deselect' : 'select'
  }
}

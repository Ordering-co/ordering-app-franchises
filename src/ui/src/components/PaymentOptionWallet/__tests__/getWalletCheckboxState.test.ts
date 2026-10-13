import {
  getWalletCheckedMap,
  getWalletTogglePlan,
  isVisibleWallet
} from '../getWalletCheckboxState'

const walletName = {
  cash: { isActive: true },
  credit_point: { isActive: true }
}

const hiddenCredit = { id: 1, type: 'credit_point', valid: false, balance: 10 }
const visibleCash = { id: 2, type: 'cash', valid: true, balance: 20 }

describe('isVisibleWallet', () => {
  it('hides invalid, negative, or inactive types', () => {
    expect(isVisibleWallet(hiddenCredit, walletName)).toBe(false)
    expect(isVisibleWallet({ ...visibleCash, balance: -1 }, walletName)).toBe(false)
    expect(isVisibleWallet(visibleCash, { cash: { isActive: false } })).toBe(false)
  })

  it('keeps a valid funded wallet whose type is active', () => {
    expect(isVisibleWallet(visibleCash, walletName)).toBe(true)
  })
})

describe('getWalletCheckedMap', () => {
  it('keys by wallet id, not list position', () => {
    expect(getWalletCheckedMap(
      [hiddenCredit, visibleCash],
      [{ wallet_id: 2 }]
    )).toEqual({
      1: false,
      2: true
    })
  })

  it('returns an empty map for missing wallets', () => {
    expect(getWalletCheckedMap(undefined, [{ wallet_id: 2 }])).toEqual({})
    expect(getWalletCheckedMap(null, [{ wallet_id: 2 }])).toEqual({})
  })
})

describe('getWalletTogglePlan', () => {
  it('toggles the visible wallet id when a hidden wallet sits at index 0', () => {
    const checkedMap = getWalletCheckedMap([hiddenCredit, visibleCash], [])
    expect(getWalletTogglePlan(checkedMap, visibleCash)).toEqual({
      walletId: 2,
      nextChecked: true,
      action: 'select'
    })
  })

  it('deselects a wallet that is already checked', () => {
    expect(getWalletTogglePlan({ 2: true }, visibleCash)).toEqual({
      walletId: 2,
      nextChecked: false,
      action: 'deselect'
    })
  })
})

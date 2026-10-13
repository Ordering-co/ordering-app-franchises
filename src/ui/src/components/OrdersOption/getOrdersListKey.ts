export function getOrdersListKey (orders: unknown) {
  if (!Array.isArray(orders) || orders.length === 0) return '0'

  let key = `${orders.length}`
  for (const order of orders) {
    const record = order && typeof order === 'object'
      ? order as Record<string, unknown>
      : null
    key += `|${record?.id ?? ''}:${record?.cart_group_id ?? ''}:${record?.status ?? ''}`
  }
  return key
}

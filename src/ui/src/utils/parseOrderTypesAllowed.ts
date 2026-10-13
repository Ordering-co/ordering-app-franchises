export function parseOrderTypesAllowed (value: unknown) {
  if (typeof value !== 'string' || value === '') return []
  return value.split('|').map((item) => Number(item))
}

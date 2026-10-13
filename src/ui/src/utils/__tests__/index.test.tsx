import {
  chatLanguagesAvailable,
  convertHoursToMinutes,
  convertToRadian,
  currencyWithoutDecimals,
  findExitingCode,
  flatArray,
  formatSeconds,
  formatUrlVideo,
  getDistance,
  getGoogleMapImage,
  getIconCard,
  getLogisticTag,
  getOrderStatuPickUp,
  getOrderStatus,
  getPayIcon,
  getTraduction,
  getTypesText,
  lightenDarkenColor,
  localeValues,
  monthsEnum,
  orderTypeList,
  reviewCommentList,
  shape,
  sortInputFields,
  transformCountryCode,
  verifyDecimals,
  vibrateApp
} from '../index'

const t = (key, fallback) => fallback ?? key

describe('ui utils', () => {
  it('flattens nested arrays and lists order types', () => {
    expect(flatArray([[1], [2, 3]])).toEqual([1, 2, 3])
    expect(orderTypeList).toContain('delivery')
  })

  it('translates known and unknown keys', () => {
    expect(getTraduction('INVALID_CODE', t)).toBe('Invalid verify code')
    expect(getTraduction('UNKNOWN_KEY', t, true)).toBe('UNKNOWN_KEY')
  })

  it('converts hours, seconds, and distances', () => {
    expect(convertHoursToMinutes('01:30')).toBe('90min')
    expect(convertHoursToMinutes(null)).toBe('0min')
    expect(formatSeconds(3661)).toBe('1:01:01')
    expect(formatSeconds(61)).toBe('1:01')
    expect(getDistance(0, 0, 0, 0)).toBe(0)
    expect(convertToRadian(180)).toBeCloseTo(Math.PI)
  })

  it('sorts input fields and verifies decimals', () => {
    const values = [
      { code: 'email' },
      { code: 'name' }
    ]
    expect(sortInputFields({ values }).map((field) => field.code)).toEqual(['name', 'email'])
    expect(verifyDecimals(2, Math.round)).toBe(2)
    expect(verifyDecimals(2.4, (n) => n.toFixed(1))).toBe('2.4')
  })

  it('maps country codes and logistic/order status', () => {
    const theme = { images: { order: { status1: 'img', status0: 'img0' } } }
    expect(transformCountryCode('+1')).toBe('US')
    expect(findExitingCode('es')).toBe('ES')
    expect(getLogisticTag(1, t)).toBe('In progress')
    expect(getLogisticTag(99, t)).toBe('Unknown')
    expect(getOrderStatus('1', t, theme).slug).toBe('COMPLETED')
    expect(getOrderStatuPickUp('1', t, theme).slug).toBe('COMPLETED')
    expect(getTypesText(1)).toBe('DELIVERY')
  })

  it('builds map and video urls and classifies colors', () => {
    expect(getGoogleMapImage({ lat: 1, lng: 2 }, 'key')).toContain('center=1,2')
    expect(formatUrlVideo('https://www.youtube.com/watch?v=abcdefghijk')).toContain('abcdefghijk')
    expect(lightenDarkenColor('#ffffff')).toBe(true)
    expect(lightenDarkenColor('#000000')).toBe(false)
    expect(lightenDarkenColor('rgb(255, 255, 255)')).toBe(true)
    expect(chatLanguagesAvailable('es')).toBe('es')
    expect(chatLanguagesAvailable('de')).toBe('en')
  })

  it('exposes card, pay, review, and locale helpers', () => {
    const theme = { images: { general: { cash: 'cash', creditCard: 'cc' } } }
    expect(getIconCard('visa', 16)).toBeTruthy()
    expect(getPayIcon('cash', theme)).toBe('cash')
    expect(getPayIcon('unknown', theme)).toBe('cc')
    expect(reviewCommentList('order', t)[5].title).toBe('What went well?')
    expect(localeValues(t).months[0]).toBe('January')
    expect(monthsEnum.Jan).toBe('MONTHSHORT1')
    expect(shape.rectangle).toBe('rectangle')
    expect(currencyWithoutDecimals).toContain('JPY')
    expect(() => vibrateApp()).not.toThrow()
  })
})

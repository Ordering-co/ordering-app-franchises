import { getMapCoordinate, getMapRegionFromLocation, isValidMapLocation } from '../getMapRegion'

const delta = { latitudeDelta: 0.001, longitudeDelta: 0.002 }

describe('isValidMapLocation', () => {
  it('rejects missing or incomplete coordinates', () => {
    expect(isValidMapLocation(undefined)).toBe(false)
    expect(isValidMapLocation(null)).toBe(false)
    expect(isValidMapLocation({})).toBe(false)
    expect(isValidMapLocation({ lat: 40.7 })).toBe(false)
    expect(isValidMapLocation({ lat: '40.7', lng: '-74' })).toBe(false)
    expect(isValidMapLocation({ lat: NaN, lng: -74 })).toBe(false)
  })

  it('accepts numeric lat and lng', () => {
    expect(isValidMapLocation({ lat: 40.7, lng: -74 })).toBe(true)
  })
})

describe('getMapRegionFromLocation', () => {
  it('returns null when location is missing so AddressList can skip the map', () => {
    expect(getMapRegionFromLocation(undefined, delta)).toBeNull()
  })

  it('builds a region when lat and lng are numbers', () => {
    expect(getMapRegionFromLocation({ lat: 40.7, lng: -74 }, delta)).toEqual({
      latitude: 40.7,
      longitude: -74,
      latitudeDelta: 0.001,
      longitudeDelta: 0.002
    })
  })
})

describe('getMapCoordinate', () => {
  it('returns a marker coordinate only for valid locations', () => {
    expect(getMapCoordinate(undefined)).toBeNull()
    expect(getMapCoordinate({ lat: 40.7, lng: -74 })).toEqual({
      latitude: 40.7,
      longitude: -74
    })
  })
})

export function isValidMapLocation (location: unknown): location is { lat: number, lng: number } {
  if (!location || typeof location !== 'object') return false
  const lat = (location as { lat?: unknown }).lat
  const lng = (location as { lng?: unknown }).lng
  return typeof lat === 'number' && Number.isFinite(lat) && typeof lng === 'number' && Number.isFinite(lng)
}

export function getMapCoordinate (location: unknown) {
  if (!isValidMapLocation(location)) return null
  return {
    latitude: location.lat,
    longitude: location.lng
  }
}

export function getMapRegionFromLocation (
  location: unknown,
  delta: { latitudeDelta: number, longitudeDelta: number }
) {
  const coordinate = getMapCoordinate(location)
  if (!coordinate) return null
  return {
    ...coordinate,
    latitudeDelta: delta.latitudeDelta,
    longitudeDelta: delta.longitudeDelta
  }
}

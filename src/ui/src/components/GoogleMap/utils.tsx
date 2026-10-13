export const GoogleMapUtils = () => {
  const aproxEqual = (n1: number, n2: number, epsilon = 0.000001) => Math.abs(n1 - n2) < epsilon

  const calculateDistance = (pointA: { lat: number, lng: number }, pointB: { latitude: number, longitude: number }) => {
    const lat1 = pointA.lat;
    const lon1 = pointA.lng;

    const lat2 = pointB.latitude;
    const lon2 = pointB.longitude;

    const R = 6371e3;
    const φ1 = lat1 * (Math.PI / 180);
    const φ2 = lat2 * (Math.PI / 180);
    const Δφ = (lat2 - lat1) * (Math.PI / 180);
    const Δλ = (lon2 - lon1) * (Math.PI / 180);

    const a = (Math.sin(Δφ / 2) * Math.sin(Δφ / 2)) +
      ((Math.cos(φ1) * Math.cos(φ2)) * (Math.sin(Δλ / 2) * Math.sin(Δλ / 2)));

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;
    return distance;
  }

  const units: any = { mi: 1609, km: 1000 }
  const types: any = [1, 2, 5]
  const fillStyles = {
    fillColor: 'rgba(44, 123, 229, 0.3)',
    strokeColor: 'rgba(44, 123, 229, 1)',
    strokeWidth: 2
  }

  return {
    aproxEqual,
    calculateDistance,
    units,
    types,
    fillStyles
  }
}

const mockBusiness = {
  id: 1,
  name: 'Test Store',
  slug: 'test-store',
  address: '123 Main St',
  open: true,
  today: {
    enabled: true,
    lapses: [{ open: { hour: 9, minute: 0 }, close: { hour: 22, minute: 0 } }]
  },
  delivery_price: 2.5,
  delivery_time: '00:30',
  pickup_time: '00:15',
  distance: 1.2,
  favorite: false,
  location: { lat: 40.7, lng: -74 },
  header: 'https://example.com/header.jpg',
  logo: 'https://example.com/logo.jpg'
}

const mockUtils = {
  parsePrice: (value) => `$${value}`,
  parseDistance: (value) => `${value} mi`,
  optimizeImage: (url) => url,
  parseDate: (value) => value,
  parseTime: (value) => value
}

const createDayjsMock = () => {
  const chain = {
    hour: () => chain,
    minute: () => chain,
    unix: () => 0,
    isAfter: () => false,
    isBefore: () => true,
    format: () => '09:00'
  }
  return chain
}

const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  canGoBack: jest.fn(() => false)
}

module.exports = {
  mockBusiness,
  mockNavigation,
  mockUtils,
  createDayjsMock
}

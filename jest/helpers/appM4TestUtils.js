const {
  mockBusiness,
  mockNavigation,
  mockUtils,
  createDayjsMock
} = require('./appM3TestUtils')

const mockUtilsM4 = {
  ...mockUtils,
  parseNumber: (value) => String(value ?? 0)
}

const mockProduct = {
  id: 10,
  name: 'Cheese Pizza',
  price: 12,
  offer_price: null,
  in_offer: false,
  total: 12,
  quantity: 1,
  description: 'Melted cheddar',
  images: 'https://example.com/pizza.png',
  favorite: false,
  inventoried: false,
  valid: true,
  valid_menu: true,
  valid_quantity: true,
  comment: '',
  rank: 1,
  category_id: 1,
  product_id: 10
}

const mockCart = {
  uuid: 'cart-1',
  status: 0,
  valid: true,
  valid_schedule: true,
  valid_products: true,
  valid_address: true,
  minimum: 0,
  total: 12,
  subtotal: 12,
  business_id: 1,
  business: mockBusiness,
  products: [mockProduct],
  delivery_type: 2,
  offers: []
}

const mockCategory = {
  id: 1,
  name: 'Mains',
  subcategories: [
    { id: 11, name: 'Pasta', parent_category_id: 1 }
  ]
}

const mockNavigationM4 = {
  ...mockNavigation,
  addListener: jest.fn(() => jest.fn())
}

const m4ThemeOverrides = {
  business_view: {
    components: {
      categories: {
        components: {
          show_first_categories: { hidden: true }
        }
      },
      products: {
        components: {
          add_to_cart_button: { hidden: true },
          product: {
            components: {
              description: { hidden: false },
              dummy: { hidden: false },
              favorite: { hidden: false },
              image: { hidden: false, position: 'right' }
            }
          }
        }
      }
    }
  }
}

const placeholderMock = {
  Fade: ({ children }) => children,
  Placeholder: ({ children }) => children,
  PlaceholderLine: () => null
}

module.exports = {
  mockBusiness,
  mockNavigation: mockNavigationM4,
  mockUtils: mockUtilsM4,
  createDayjsMock,
  mockProduct,
  mockCart,
  mockCategory,
  m4ThemeOverrides,
  placeholderMock
}

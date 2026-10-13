const { Dimensions, Platform } = require('react-native')
const { useApi, useConfig, useSession } = require('@components')

const setupPageTestEnv = ({
  session = [{ auth: false, user: null }, { login: jest.fn() }],
  config = [{
    loading: false,
    configs: {
      powered_by_ordering_module: { value: true },
      verification_email_required: { value: '0' },
      verification_phone_required: { value: '0' }
    }
  }],
  api = [{}, {}]
} = {}) => {
  jest.clearAllMocks()
  useConfig.mockReturnValue(config)
  useSession.mockReturnValue(session)
  useApi.mockReturnValue(api)
  jest.spyOn(Dimensions, 'get').mockImplementation((dim) => {
    if (dim === 'window') return { width: 390, height: 844, scale: 2, fontScale: 2 }
    if (dim === 'screen') return { width: 390, height: 844, scale: 2, fontScale: 2 }
    return { width: 0, height: 0, scale: 1, fontScale: 1 }
  })
  Platform.OS = 'ios'
}

module.exports = { setupPageTestEnv }

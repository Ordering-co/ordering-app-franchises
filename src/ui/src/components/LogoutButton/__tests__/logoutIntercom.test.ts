import { logoutIntercom } from '../logoutIntercom'

describe('logoutIntercom', () => {
  it('clears the identified user then starts an unidentified session', async () => {
    const calls: string[] = []
    const intercom = {
      logout: jest.fn(async () => { calls.push('logout') }),
      registerUnidentifiedUser: jest.fn(async () => { calls.push('unidentified') })
    }

    await logoutIntercom(intercom)

    expect(intercom.logout).toHaveBeenCalledTimes(1)
    expect(intercom.registerUnidentifiedUser).toHaveBeenCalledTimes(1)
    expect(calls).toEqual(['logout', 'unidentified'])
  })

  it('is a no-op when Intercom is missing', async () => {
    await expect(logoutIntercom(null)).resolves.toBeUndefined()
    await expect(logoutIntercom(undefined)).resolves.toBeUndefined()
    await expect(logoutIntercom({})).resolves.toBeUndefined()
  })

  it('still registers unidentified when logout throws', async () => {
    const intercom = {
      logout: jest.fn(async () => { throw new Error('not initialized') }),
      registerUnidentifiedUser: jest.fn(async () => undefined)
    }

    await expect(logoutIntercom(intercom)).resolves.toBeUndefined()
    expect(intercom.registerUnidentifiedUser).toHaveBeenCalledTimes(1)
  })
})

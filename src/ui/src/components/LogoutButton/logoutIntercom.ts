type IntercomClient = {
  logout?: () => unknown
  registerUnidentifiedUser?: () => unknown
}

export async function logoutIntercom (intercom?: IntercomClient | null) {
  if (!intercom) return

  try {
    if (typeof intercom.logout === 'function') {
      await intercom.logout()
    }
  } catch {}

  try {
    if (typeof intercom.registerUnidentifiedUser === 'function') {
      await intercom.registerUnidentifiedUser()
    }
  } catch {}
}

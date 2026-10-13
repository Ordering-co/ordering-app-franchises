import * as React from 'react'
import { useSession } from '@components'
import { _retrieveStoreData, _setStoreData } from '@ui'

export const HomeValuesContext = React.createContext<any>(null)

export const HomeValuesProvider = ({ children }: any) => {
  const [order, setOrder] = React.useState(null)
  const [alternativeHome, setAlternativeHome] = React.useState(false)
  const [userAddressStoraged, setUserAddressStoraged] = React.useState<any>(null)

  const [session] = useSession()

  const onChangeOrder = (order: any) => setOrder(order)
  const onChangeAlternativeHome = (value: boolean) => setAlternativeHome(value)
  const onChangeUserAddressStoraged = (value: any) => {
    setUserAddressStoraged(value)
    _setStoreData('address_user', JSON.stringify(value))
  }

  const manageUserAddress = async () => {
    const address = await _retrieveStoreData('address_user')
    address && setUserAddressStoraged(address)
  }

  React.useEffect(() => {
    manageUserAddress()
  }, [])

  React.useEffect(() => {
    if (!session?.auth) {
      setOrder(null)
    }
  }, [session?.auth])

  return (
    <HomeValuesContext.Provider
      value={[
        { order, alternativeHome, userAddressStoraged },
        { onChangeOrder, onChangeAlternativeHome, onChangeUserAddressStoraged }
      ]}
    >
      {children}
    </HomeValuesContext.Provider>
  )
}

export function useHomeValues() {
  const OrderManager = React.useContext(HomeValuesContext)
  return OrderManager || [{}, () => { }]
}

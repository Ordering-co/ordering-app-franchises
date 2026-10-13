import * as React from 'react'
import { useSession } from '@components'

export const BusinessSelectedContext = React.createContext<any>(null)

export const BusinessSelectedProvider = ({ children } : any) => {
  const [
    businessSelected,
    setBusinessSelected
  ] = React.useState(null)
  const [session] = useSession()

  const onChangeBusinessSelected = (business : any) => {
    setBusinessSelected(business)
  }

  React.useEffect(() => {
    if (!session?.auth){
      setBusinessSelected(null)
    }
  }, [session?.auth])

  return (
    <BusinessSelectedContext.Provider value={[businessSelected, { onChangeBusinessSelected }]}>
      {children}
    </BusinessSelectedContext.Provider>
  )
}

// hook context

export function useBusinessSelected () {
  const BusinessSelectedManager = React.useContext(BusinessSelectedContext)
  return BusinessSelectedManager || [{}, () => {}]
}

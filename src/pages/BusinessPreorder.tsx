import React from 'react'

import { SafeAreaViewWrapper } from '../layouts/SafeAreaViewWrapper'
import { BusinessPreorder as BusinessPreorderController, NavBar } from '@ui'
import { useLanguage } from '@components'

const BusinessPreorder = (props: any) => {
  const [, t] = useLanguage()
  const businessPreorderProps = {
    ...props,
    ...props.route.params,
    goToBack: () => props.navigation?.canGoBack() && props.navigation.goBack(),
    onNavigationRedirect: (route: string, params: any) => props.navigation.navigate(route, params)
  }

  return (
    <>
      <NavBar
        title={t('PREORDER', 'Preorder')}
        onActionLeft={() => businessPreorderProps.goToBack()}
      />
      <SafeAreaViewWrapper disableScrollView>
        <BusinessPreorderController {...businessPreorderProps} />
      </SafeAreaViewWrapper>
    </>
  )
}

export default BusinessPreorder

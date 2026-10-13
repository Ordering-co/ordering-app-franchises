import React from 'react'
import { useTheme } from 'styled-components/native'

import { SafeAreaViewWrapper } from '../layouts/SafeAreaViewWrapper'
import { BusinessInformation, NavBar } from '@ui'

const BusinessInfo = (props: any) => {
  const theme = useTheme()
  const infoProps = {
    ...props,
    ...props.route.params,
    onRedirect: (route: string, params?: any) => props.navigation.navigate(route, params),
    goToBack: () => props.navigation?.canGoBack() && props.navigation.goBack()
  }

  const title = infoProps.businessState?.business?.name

  return (
    <>
      <NavBar
        title={title?.length < 30 ? title : null}
        textStyle={{
          fontSize: title?.length > 16
            ? theme.utils.tsize.m
            : theme.utils.tsize.l
        }}
        onActionLeft={() => infoProps.goToBack()}
      />
      <SafeAreaViewWrapper>
        <BusinessInformation {...infoProps} showBusinessName={title?.length >= 30} />
      </SafeAreaViewWrapper>
    </>
  )
}

export default BusinessInfo

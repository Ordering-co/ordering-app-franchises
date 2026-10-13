import React from 'react'
import { NavBar, Sessions as SessionsController } from '@ui'
import { SafeAreaViewWrapper } from '../layouts/SafeAreaViewWrapper'
import { useLanguage } from '@components'

interface Props {
  navigation: any;
  route: any;
}

const Sessions = (props: Props) => {
  const [, t] = useLanguage()
  const sessionProps = {
    ...props,
    goToBack: () => props.navigation?.canGoBack() && props.navigation.goBack()
  }

  return (
    <>
      <NavBar
        title={t('SECURITY', 'Security')}
        onActionLeft={() => sessionProps.goToBack()}
      />
      <SafeAreaViewWrapper>
        <SessionsController {...sessionProps} />
      </SafeAreaViewWrapper>
    </>
  )
}

export default Sessions

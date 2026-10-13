import React from 'react'
import settings from '../config'
import { SafeAreaViewWrapper } from '../layouts/SafeAreaViewWrapper'

import { Favorite as FavoriteController, NavBar } from '@ui'
import { useLanguage } from '@components'

interface Props {
  navigation: any;
  route: any;
}

const Favorite = (props: Props) => {
  const [, t] = useLanguage()

  const favoriteProps = {
    ...props,
    franchiseId: settings.franchiseSlug,
    goToBack: () => props.navigation?.canGoBack() && props.navigation.goBack()
  }

  return (
    <>
      <NavBar
        title={t('MY_FAVORITES', 'My Favorites')}
        onActionLeft={() => favoriteProps.goToBack()}
      />
      <SafeAreaViewWrapper>
        <FavoriteController {...favoriteProps} />
      </SafeAreaViewWrapper>
    </>
  )
}

export default Favorite;

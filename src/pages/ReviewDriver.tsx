import { SafeAreaViewWrapper } from '../layouts/SafeAreaViewWrapper'

import { useLanguage } from '@components'
import { NavBar, ReviewDriver as ReviewDriverComponent } from '@ui'

const ReviewDriver = (props: any) => {
  const [, t] = useLanguage()

  const reviewDriverProps = {
    ...props,
    ...props?.route?.params,
    type: 'driver',
    onGoBack: () => props.navigation?.canGoBack() && props.navigation.goBack(),
    onNavigationRedirect: (route: string, params: any) => props.navigation.navigate(route, params)
  }

  return (
    <>
      <NavBar
        title={t('REVIEWS', 'Reviews')}
        onActionLeft={() => reviewDriverProps.onGoBack()}
      />
      <SafeAreaViewWrapper disableScrollView>
        <ReviewDriverComponent {...reviewDriverProps} />
      </SafeAreaViewWrapper>
    </>
  )
}

export default ReviewDriver

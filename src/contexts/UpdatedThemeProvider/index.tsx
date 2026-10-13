import React from 'react'
import { ThemeProvider } from 'styled-components/native'
import { useOrderingTheme } from '@components'

const UpdatedThemeProvider = ({ children, theme }: any) => {
  const [orderingTheme] = useOrderingTheme()
  const updatedTheme = {
    ...theme,
    ...orderingTheme?.theme,
    images: {
      ...theme.images,
      general: {
        ...theme.images.general,
        businessHero: orderingTheme?.theme?.business_listing_view?.components?.business_hero?.components?.image || theme.images.general.businessHero,
        notFound: orderingTheme?.theme?.business_listing_view?.components?.not_found_source?.components?.image || theme.images.general.notFound,
        emptyActiveOrders: orderingTheme?.theme?.orders?.components?.active_orders?.components?.not_found_source?.components?.image || theme.images?.general?.emptyActiveOrders,
        emptyPastOrders: orderingTheme?.theme?.orders?.components?.past_orders?.components?.not_found_source?.components?.image || theme.images?.general?.emptyPastOrders,
      },
      categories: {
        ...theme.images.categories,
        allfood: orderingTheme?.theme?.business_listing_view?.components?.categories?.components?.food?.image || theme.images.categories.categoryFood,
        groceries: orderingTheme?.theme?.business_listing_view?.components?.categories?.components?.groceries?.image || theme.images.categories.categoryGroceries,
        alcohol: orderingTheme?.theme?.business_listing_view?.components?.categories?.components?.alcohol?.image || theme.images.categories.categoryAlcohol,
        laundry: orderingTheme?.theme?.business_listing_view?.components?.categories?.components?.laundry?.image || theme.images.categories.categoryLaundry,
        all: orderingTheme?.theme?.business_listing_view?.components?.categories?.components?.all?.image || theme.images.categories.all
      },
      dummies: {
        ...theme.images.dummies,
        businessHeader: orderingTheme?.theme?.business_view?.components?.header?.components?.dummy_image || theme.images.dummies.businessHeader,
        businessLogo: orderingTheme?.theme?.business_view?.components?.header?.components?.logo?.dummy_image || theme.images.dummies.businessLogo,
        product: orderingTheme?.theme?.business_view?.components?.products?.components?.photo?.components?.dummy_image || theme.images.dummies.product
      },
      logos: {
        ...theme.images.logos,
        logotype: orderingTheme?.theme?.header?.components?.logo?.components?.image || theme.images.logos.logotype
      }
    },
    utils: {
      tsize: {
        xxxl: 36,
        xxl: 30,
        xl: 25,
        l: 20,
        m: 16,
        s: 14,
        xs: 12
      },
      radius: {
        l: 10,
        m: 5
      },
      margins: {
        horizontal: 20
      },
      zi: {
        xxl: 30000,
        xl: 10000,
        l: 9999
      }
    }
  }

  return (
    <ThemeProvider theme={updatedTheme}>
      {children}
    </ThemeProvider>

  )
}



export default UpdatedThemeProvider

import React, { useEffect, useState } from 'react'
import { Dimensions, TouchableOpacity } from 'react-native'
import { SwiperFlatList } from 'react-native-swiper-flatlist'
import FastImage from 'react-native-fast-image';

import { PageBannerWrapper, SliderWrapper } from './styles'
import { useUtils, useEvent, PageBanner as PageBannerController } from '@components'

const PageBannerUI = (props: any) => {
  const {
    pageBannerState,
    navigation,
    isProjectChange
  } = props

  const [{ optimizeImage }] = useUtils();
  const [events] = useEvent()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [viewedBanner, setViewedBanner] = useState<any>(null)

  const HEIGHT = Dimensions.get('screen').height
  const WIDTH = Dimensions.get('window').width

  const onRedirect = (route: string, params?: any) => {
    navigation.push(route, params)
  }

  const handleGoToPage = (item: any) => {
    if (!item?.action?.url) return
    const action = item.action
    let slug
    if (action.type === 'business') {
      return
    }
    if (action.type === 'product') {
      slug = action.url.split('store/')[1]?.split('?')[0]
      onRedirect('ProductDetails', {
        businessSlug: slug,
        businessId: action.business_id,
        categoryId: action.category_id,
        productId: action.product_id,
        isRedirect: 'business',
        business: { store: slug }
      })
    }
    const clickedBanner = pageBannerState.result.find((banner: any) => banner.id === item?.banner_id)
    events.emit('promotion_clicked', clickedBanner)
  }

  useEffect(() => {
    if (pageBannerState.loading && isProjectChange) {
      props?.setPageBannerExists(false)
    }
  }, [pageBannerState.loading])

  useEffect(() => {
    if (pageBannerState.loading) return
    if (pageBannerState.banner?.items && pageBannerState.banner?.items.length > 0) {
      props?.setPageBannerExists(true)
      const bannerId = pageBannerState.banner.items[currentIndex]?.banner_id
      if (pageBannerState.result && bannerId) {
        const _viewedBanner = pageBannerState.result.find((banner: any) => banner.id === bannerId)
        if (_viewedBanner?.id !== viewedBanner?.id) {
          setViewedBanner(_viewedBanner)
          events.emit('promotion_viewed', _viewedBanner)
        }
      }
    }
  }, [pageBannerState.loading, currentIndex, viewedBanner])
  console.log('pageBannerState.banner?.items', pageBannerState.banner?.items)
  return (
    !pageBannerState.loading && pageBannerState.banner?.items && pageBannerState.banner?.items.length > 0 && (
      <PageBannerWrapper style={{ height: HEIGHT * 0.55 }}>
        <SwiperFlatList
          pagingEnabled
          index={currentIndex}
          onChangeIndex={({ index }) => setCurrentIndex(index)}
          autoplay={pageBannerState.banner?.items.length > 1}
          autoplayLoop
          autoplayDelay={6}
          showPagination
          autoplayLoopKeepAnimation
        >
          {pageBannerState.banner?.items.map((item: any, index: number) => (
            <TouchableOpacity
              activeOpacity={1}
              key={index}
              onPress={() => handleGoToPage(item)}
              style={{ width: WIDTH, height: HEIGHT * 0.55 }}
            >
              <SliderWrapper style={{ width: '100%', height: '100%' }}>
                <FastImage
                  style={{ height: '100%', width: '100%' }}
                  resizeMode='cover'
                  source={{ uri: optimizeImage(item.url, 'h_300,c_limit') }}
                />
              </SliderWrapper>
            </TouchableOpacity>
          ))}
        </SwiperFlatList>
      </PageBannerWrapper>
    )
  )
}

export const PageBanner = (props: any) => {
  const pageBannerProps = {
    ...props,
    UIComponent: PageBannerUI
  }
  return <PageBannerController {...pageBannerProps} />
}

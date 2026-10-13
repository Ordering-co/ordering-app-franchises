import React, { useState, useEffect, useRef } from 'react'
import { Keyboard } from 'react-native'

import { ReviewProductsContainer, WrapperComments } from './styles'
import { ReviewProductParams } from '../../../types'
import { Actions } from '../Actions'

import { useLanguage, useToast, ToastType, ReviewProduct as ReviewProductController } from '@components'
import { SingleProductReview } from '@ui'

const ReviewProductsUI = (props: ReviewProductParams) => {
  const {
    order,
    onNavigationRedirect,
    formState,
    handleChangeFormState,
    handleSendProductReview
  } = props

  const [, t] = useLanguage()
  const [, { showToast }] = useToast()
  const scrollViewRef = useRef<any>(null)

  const [isProductReviewed, setIsProductReviewed] = useState(false)
  const [alertState, setAlertState] = useState<{ open: boolean, content: Array<any>, success?: boolean }>({ open: false, content: [], success: false })

  const handleContinueClick = () => {
    setAlertState({ ...alertState, success: true })
    handleSendProductReview()
  }

  useEffect(() => {
    if (alertState.open && alertState.content) {
      showToast(ToastType.Error, alertState.content)
    }
  }, [alertState.content])

  useEffect(() => {
    if (!formState.loading && formState.result?.error) {
      setAlertState({
        open: true,
        success: false,
        content: formState.result?.result || [t('ERROR', 'Error')]
      })
    }
    if (!formState.loading && !formState.result?.error && alertState.success) {
      setIsProductReviewed && setIsProductReviewed(true)
      if (order?.driver && !order?.user_review) {
        onNavigationRedirect('ReviewDriver', { order: order })
      } else {
        onNavigationRedirect('BottomTab', { screen: 'Business' })
      }
    }
  }, [formState])

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      scrollViewRef.current.scrollToEnd({ animated: true })
    })
    return () => {
      keyboardDidShowListener.remove()
    }
  }, [])

  return (
    <>
      <ReviewProductsContainer
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <WrapperComments>
          {order?.products && order.products.length > 0 && order?.products.map((productsOrder, idx) => (
            productsOrder?.length ? productsOrder?.map((product: any, i: any) => !product?.deleted ?
              <SingleProductReview
                key={i}
                product={product}
                formState={formState}
                handleChangeFormState={handleChangeFormState}
              /> : null
            ) : (!productsOrder?.deleted ? (
              <SingleProductReview
                key={idx}
                product={productsOrder}
                formState={formState}
                handleChangeFormState={handleChangeFormState}
              />
            ) : null)
          ))}
        </WrapperComments>
      </ReviewProductsContainer>

      <Actions
        text={order?.driver && !order?.user_review ? t('CONTINUE', 'Continue') : t('SEND_REVIEW', 'Send Review')}
        loading={formState.loading}
        disabled={formState.loading || formState?.changes?.length === 0}
        onSkipClick={() => (order?.driver && !order?.user_review) ?
          onNavigationRedirect('ReviewDriver', { order: order }) :
          onNavigationRedirect('BottomTab', { screen: 'Business' })
        }
        onClick={() => handleContinueClick()}
      />
    </>
  )
}

export const ReviewProducts = (props: any) => {
  const reviewProductProps = {
    ...props,
    UIComponent: ReviewProductsUI,
    isToast: true
  }
  return <ReviewProductController {...reviewProductProps} />
}

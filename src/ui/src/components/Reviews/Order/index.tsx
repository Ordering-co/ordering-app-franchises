import React, { useState, useEffect, useRef } from 'react'
import { Keyboard, StyleSheet, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form'
import { useTheme } from 'styled-components/native'

import {
  ReviewOrderContainer,
  FormReviews,
  CommentsButtonGroup,
  WrapperComments
} from './styles'

import { reviewCommentList } from '../../../utils'
import { ReviewOrderParams } from '../../../types'
import { HeaderReview } from '../Header'
import { Actions } from '../Actions'

import { OrderReview as ReviewOrderController, useLanguage, useToast, ToastType } from '@components'
import { OButton, OInput, OText } from '@ui'

const ReviewOrderUI = (props: ReviewOrderParams) => {
  const {
    order,
    stars,
    handleSendReview,
    formState,
    navigation,
    setStars,
    onGoBack,
    onNavigationRedirect,
    handleReviewState,
    setIsReviewed
  } = props

  const theme = useTheme()
  const scrollViewRef = useRef<any>(null)
  const commentRef = useRef<any>('')

  const styles = StyleSheet.create({
    inputTextArea: {
      borderColor: theme.colors.lightGray,
      borderRadius: theme.utils.radius.l,
      marginTop: 10,
      marginBottom: 40,
      height: 100,
      alignItems: 'flex-start'
    },
    reviewedStyle: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginVertical: 20
    },
  })

  const [, t] = useLanguage()
  const [, { showToast }] = useToast()
  const { handleSubmit, errors } = useForm()

  const [alertState, setAlertState] = useState<{ open: boolean, content: Array<any>, success?: boolean }>({ open: false, content: [], success: false })
  const [comments, setComments] = useState<Array<any>>([])
  const [extraComment, setExtraComment] = useState('')
  const [enableProduct, setEnableProduct] = useState(true)

  const commentsList = reviewCommentList('order', t)

  const resetValues = () => {
    setExtraComment('')
    commentRef.current?.clear()
    handleChangeStars(props.defaultStar ?? 1)
  }

  const onSubmit = async () => {
    if (Object.values(stars).some((value: any) => value === 0)) {
      setAlertState({
        open: true,
        content: stars.quality === 0 ? [`${t('REVIEW_QUALIFICATION_REQUIRED', 'Review qualification is required')}`] : []
      })
      return
    }
    handleSendReview(resetValues)
    handleReviewState && handleReviewState(order?.id)
    setIsReviewed && setIsReviewed(true)
    setAlertState({ ...alertState, success: true })
    !enableProduct && navigation?.canGoBack() && navigation.goBack()
  }

  const handleChangeStars = (index: number) => {
    if (index) {
      setStars({
        ...stars,
        quality: index,
        punctuality: index,
        service: index,
        packaging: index,
        comments: ''
      })
    }
    setComments([])
  }

  const handleChangeComment = (commentItem: any) => {
    setComments(comments.find((comment: any) => comment?.key === commentItem.key)
      ? comments.filter((comment: any) => comment?.key !== commentItem.key)
      : [...comments, commentItem])
  }

  const isSelectedComment = (commentKey: number) => comments.find((comment: any) => comment?.key === commentKey)

  const handleContinueClick = () => {
    if (!order?.review) {
      onSubmit()
    } else {
      skipOrderReview()
    }
  }

  const skipOrderReview = () => {
    resetValues()
    if (enableProduct) {
      onNavigationRedirect('ReviewProducts', { order: order })
    } else if (order?.driver && !order?.user_review) {
      onNavigationRedirect('ReviewDriver', { order: order })
    } else {
      onGoBack?.()
    }
  }

  useEffect(() => {
    if (formState.error && !formState?.loading) {
      showToast(ToastType.Error, formState.result)
    }
    if (!formState.loading && !formState.error && alertState.success) {
      showToast(ToastType.Success, t('ORDER_REVIEW_SUCCESS_CONTENT', 'Thank you, Order review successfully submitted!'))
      onNavigationRedirect && onNavigationRedirect('ReviewProducts', { order: order })
    }
  }, [formState.result])

  useEffect(() => {
    const errorMessages = Object.values(errors).reduce((acc, error) => `${acc}- ${error.message}\n`, '');
    if (errorMessages) {
      showToast(ToastType.Error, errorMessages.trim());
    }
  }, [errors])

  useEffect(() => {
    if (alertState.open && alertState.content) {
      showToast(ToastType.Error, alertState.content)
    }
  }, [alertState.content])

  useEffect(() => {
    const combinedComments = comments.reduce((acc, comment) => acc + comment?.content + '. ', '') + extraComment
    setStars((prevStars: any) => ({ ...prevStars, comments: combinedComments }))
  }, [comments, extraComment])

  useEffect(() => {
    setEnableProduct(!order?.products.every(product => product?.deleted))
  }, [order])

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
      <ReviewOrderContainer
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
      >
        <HeaderReview
          order={order}
          type={props.type}
          defaultStar={stars?.quality}
          reviewed={!!order?.review}
          handleChangeStars={handleChangeStars}
        />
        {!order?.review && (
          <WrapperComments>
            <FormReviews>
              <OText size={theme.utils.tsize.m} weight={700}>{t('COMMENTS', 'Comments')}</OText>
              <CommentsButtonGroup>
                {commentsList[stars?.quality || 1]?.list?.map((commentItem: any) => (
                  <OButton
                    key={commentItem.key}
                    text={commentItem.content}
                    imgRightSrc={null}
                    bgColor={isSelectedComment(commentItem.key) ? theme.colors.primary : theme.colors.backgroundGray100}
                    borderColor={isSelectedComment(commentItem.key) ? theme.colors.primary : theme.colors.backgroundGray100}
                    textStyle={{
                      color: isSelectedComment(commentItem.key) ? theme.colors.white : theme.colors.secondaryLightGray,
                      fontWeight: 'normal'
                    }}
                    style={{ height: 35, paddingLeft: 0, paddingRight: 0 }}
                    onClick={() => handleChangeComment(commentItem)}
                  />
                ))}
              </CommentsButtonGroup>

              <OText color={theme.colors.textNormal}>
                {t('REVIEW_COMMENT_QUESTION', 'Do you want to add something?')}
              </OText>
              <OInput
                ref={commentRef}
                name='comments'
                multiline
                value={extraComment}
                style={styles.inputTextArea}
                onChange={(val: any) => {
                  setExtraComment(val.target.value)
                }}
              />
            </FormReviews>
          </WrapperComments>
        )}
        {order?.review && (
          <View style={styles.reviewedStyle}>
            <OText color={theme.colors.primary}>
              {t('ORDER_REVIEWED', 'This order has been already reviewed')}
            </OText>
          </View>
        )}
      </ReviewOrderContainer>
      <Actions
        text={t('CONTINUE', 'Continue')}
        loading={formState.loading}
        onSkipClick={() => skipOrderReview()}
        onClick={handleSubmit(handleContinueClick)}
      />
    </>
  )
}

export const ReviewOrder = (props: ReviewOrderParams) => {
  const reviewOrderProps = {
    ...props,
    UIComponent: ReviewOrderUI,
    defaultStar: props?.defaultStar ?? 1
  }
  return <ReviewOrderController {...reviewOrderProps} />
}

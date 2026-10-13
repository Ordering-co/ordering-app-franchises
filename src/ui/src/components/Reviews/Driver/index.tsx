import React, { useState, useEffect, useRef } from 'react'
import { Keyboard, StyleSheet } from 'react-native'
import { useTheme } from 'styled-components/native'
import { useForm, Controller } from 'react-hook-form'

import { ReviewDriverParams } from '../../../types'
import { reviewCommentList } from '../../../utils'
import { HeaderReview } from '../Header'
import { Actions } from '../Actions'

import {
  ReviewDriverContainer,
  FormReviews,
  CommentsButtonGroup,
  WrapperComments,
} from './styles'

import { useLanguage, useToast, ToastType, ReviewDriver as ReviewDriverController } from '@components'
import { OText, OButton, OInput } from '@ui'

const ReviewDriverUI = (props: ReviewDriverParams) => {
  const {
    order,
    formState,
    dirverReviews,
    setDriverReviews,
    handleSendDriverReview,
    onNavigationRedirect
  } = props

  const [, t] = useLanguage()
  const theme = useTheme()
  const { handleSubmit, control, errors } = useForm()
  const [, { showToast }] = useToast()
  const scrollViewRef = useRef<any>(null)

  const [isDriverReviewed, setIsDriverReviewed] = useState(false)

  const styles = StyleSheet.create({
    inputTextArea: {
      borderColor: theme.colors.lightGray,
      borderRadius: theme.utils.radius.l,
      marginTop: 10,
      marginBottom: 40,
      height: 100,
      alignItems: 'flex-start'
    }
  })

  const [comments, setComments] = useState<Array<any>>([])
  const [extraComment, setExtraComment] = useState('')
  const [alertState, setAlertState] = useState<{ open: boolean, content: Array<any>, success?: boolean }>({ open: false, content: [], success: false })

  const commentsList = reviewCommentList('driver', t)

  const onSubmit = () => {
    if (dirverReviews?.qualification === 0) {
      setAlertState({
        open: true,
        content: dirverReviews?.qualification === 0 ? [`${t('REVIEW_QUALIFICATION_REQUIRED', 'Review qualification is required')}`] : []
      })
      return
    }
    handleSendDriverReview()
    setAlertState({ ...alertState, success: true })
  }

  const isSelectedComment = (commentKey: number) => comments.find((comment: any) => comment?.key === commentKey)

  const handleChangeComment = (commentItem: any) => {
    setComments(comments.find((comment: any) => comment?.key === commentItem.key)
      ? comments.filter((comment: any) => comment?.key !== commentItem.key)
      : [...comments, commentItem])
  }

  const handleChangeQualification = (qualification: number) => {
    if (qualification) setDriverReviews({ ...dirverReviews, qualification: qualification, comment: '' })
    setComments([])
  }

  const handleSendReviewClick = () => {
    if (!order?.user_review && !isDriverReviewed) {
      onSubmit()
    } else {
      onNavigationRedirect('Profile', { screen: 'MyOrders' })
    }
  }

  useEffect(() => {
    if (!formState.loading && formState.result?.error) {
      setAlertState({
        open: true,
        success: false,
        content: formState.result?.result || [t('ERROR', 'Error')]
      })
    }
    if (!formState.loading && !formState.result?.error && alertState.success) {
      setIsDriverReviewed && setIsDriverReviewed(true)
      onNavigationRedirect('BottomTab', { screen: 'Business' })
    }
  }, [formState])

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
    setDriverReviews((prevStars: any) => ({ ...prevStars, comment: combinedComments }))
  }, [comments, extraComment])

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
      <ReviewDriverContainer
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <HeaderReview
          order={order}
          type={props.type}
          reviewed={!!order?.review}
          handleChangeStars={handleChangeQualification}
        />

        <WrapperComments>
          <FormReviews>
            <OText size={theme.utils.tsize.m} weight={700}>{t('COMMENTS', 'Comments')}</OText>
            <CommentsButtonGroup>
              {commentsList[dirverReviews?.qualification || 1]?.list?.map((commentItem: any) => (
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
            <Controller
              control={control}
              defaultValue=''
              name='comments'
              render={({ onChange }: any) => (
                <OInput
                  name='comments'
                  onChange={(val: any) => {
                    onChange(val)
                    setExtraComment(val.target.value)
                  }}
                  style={styles.inputTextArea}
                  multiline
                />
              )}
            />
          </FormReviews>
        </WrapperComments>
      </ReviewDriverContainer>
      <Actions
        text={t('SEND_REVIEW', 'Send Review')}
        loading={formState.loading}
        onClick={handleSubmit(handleSendReviewClick)}
      />
    </>
  )
}

export const ReviewDriver = (props: any) => {
  const reviewDriverProps = {
    ...props,
    UIComponent: ReviewDriverUI,
    isToast: true
  }
  return <ReviewDriverController {...reviewDriverProps} />
}

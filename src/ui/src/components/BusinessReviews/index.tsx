import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import moment from 'moment';
import { useTheme } from 'styled-components/native';

import { BusinessReviewsParams } from '../../types';
import { setLocalMoment } from '../../utils';

import {
  BusinessReviewContent,
  StarPointsView,
  ReviewSearchView,
  ReviewProgressView,
  StarPointsViewLeft,
  WrapperContent,
  DivideView,
  ReviewItemContainer,
  StarRatingContainer,
} from './styles';

import { BusinessReviews as BusinessReviewController, useLanguage, useUtils } from '@components';
import { OIcon, OInput, OText, NavBar, NotFoundSource } from '@ui';

const BusinessReviewsUI = (props: BusinessReviewsParams) => {
  const { businessState, reviewsList, goToBack } = props;
  const [, t] = useLanguage();
  const theme = useTheme();
  const [searchReview, setSearchReview] = useState('')
  const [{ parseDate }] = useUtils()

  const ReviewItem = ({ comment, created_at, total }: any) => (
    <ReviewItemContainer>
      <StarRating rating={total} iconSize={15} style={{ marginTop: 0, gap: 5, justifyContent: 'flex-end', marginBottom: 10 }} />
      <OText size={12} color={theme.colors.textNormal}>{comment}</OText>
      <OText size={12} color={theme.colors.disabled}>
        {parseDate(created_at, { outputFormat: 'MMMM D, YYYY • hh:mm A' })}
      </OText>
    </ReviewItemContainer>
  )

  useEffect(() => {
    setLocalMoment(moment, t)
  }, [])

  return (
    <>
      <BusinessReviewContent
        showsVerticalScrollIndicator={false}
      >
        {!reviewsList?.error && (
          <>
            <StarPointsView>
              <StarPointsViewLeft>
                <OIcon
                  src={theme.images.general.star}
                  width={32}
                  style={{ marginEnd: 10, marginBottom: 2, marginStart: -2 }}
                  color={
                    reviewsList?.reviews?.length > 0
                      ? theme.colors.warning5
                      : theme.colors.disabled
                  }
                />
                <OText size={theme.utils.tsize.l} weight={'500'} color={theme.colors.textNormal}>
                  {businessState?.business?.reviews?.total || 0}
                </OText>
              </StarPointsViewLeft>
              <OText size={theme.utils.tsize.m} color={theme.colors.textNormal}>
                {`${reviewsList?.reviews?.length || 0} ${t('REVIEWS', 'reviews')}`}
              </OText>
            </StarPointsView>

            <WrapperContent>
              <ReviewSearchView>
                <OInput
                  icon={theme.images.general.search}
                  inputStyle={{ fontSize: theme.utils.tsize.s }}
                  placeholder={t('SEARCH_REVIEWS', 'Search reviews')}
                  style={{ paddingStart: 0 }}
                  onChange={(txt: string) => setSearchReview(txt)}
                />
              </ReviewSearchView>
              <DivideView />
              <ReviewProgressView>
                <OText
                  size={theme.utils.tsize.m}
                  color={theme.colors.textNormal}
                  weight={600}
                  mBottom={20}
                >
                  {t('REVIEW_ORDER', 'Review order')}
                </OText>
                <StarRating rating={(businessState?.business?.reviews?.total || 0)} />
              </ReviewProgressView>
              {!!reviewsList?.reviews?.filter((review: any) => searchReview !== ''
                ? review.comment?.toLowerCase()?.includes(searchReview?.toLowerCase())
                : true)?.length &&
                (
                  <>
                    <View style={{ height: 1, backgroundColor: theme.colors.backgroundGray200, marginVertical: 20 }} />
                    <OText
                      size={theme.utils.tsize.m}
                      color={theme.colors.textNormal}
                      weight={600}
                      mBottom={20}
                    >
                      {t('REVIEWS', 'Reviews')}
                    </OText>
                    {reviewsList?.reviews
                      .filter((review: any) => searchReview !== '' ? review.comment?.toLowerCase()?.includes(searchReview?.toLowerCase()) : true)
                      .map((review: any) => (
                        <ReviewItem
                          key={`review_key_${review.id}`}
                          {...review}
                        />
                      ))}
                  </>
                )}
            </WrapperContent>
          </>
        )}

        {reviewsList?.error && (
          <WrapperContent>
            <NotFoundSource
              simple
              content={t('ERROR_UNKNOWN', 'An error has ocurred')}
            />
          </WrapperContent>
        )}
      </BusinessReviewContent>
    </>
  )
}

const StarRating = ({ rating, iconSize, style }: any) => {
  const theme = useTheme()

  const qualificationList = [1, 2, 3, 4, 5]

  return (
    <StarRatingContainer style={style}>
      {qualificationList.map((index) => (
        <OIcon
          key={index}
          src={index <= rating ? theme.images.general.star_on : theme.images.general.star_off}
          width={iconSize ?? 30}
          height={iconSize ?? 30}
        />
      ))}
    </StarRatingContainer>
  );
};


export const BusinessReviews = (props: any) => {
  const BusinessReviewProps = {
    ...props,
    UIComponent: BusinessReviewsUI
  }
  return <BusinessReviewController {...BusinessReviewProps} />
}

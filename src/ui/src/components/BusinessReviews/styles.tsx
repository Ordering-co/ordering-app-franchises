import styled from 'styled-components/native';

export const BusinessReviewContent = styled.ScrollView`
  display: flex;
  flex-direction: column;
`;

export const StarPointsView = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 20px 30px;
  background-color: ${({ theme }: any) => theme.colors.backgroundGray100};
`;

export const StarPointsViewLeft = styled.View`
  flex-direction: row;
  align-items: center;
`

export const WrapperContent = styled.View`
  padding: ${({ theme }: any) => theme.utils.margins.horizontal}px;
`

export const ReviewSearchView = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 0 10px;
  border-width: 1px;
  border-color: ${(props: any) => props.theme.colors.border};
  border-radius: ${({ theme }: any) => theme.utils.radius.l}px;
  margin: 20px 0;
`

export const ReviewProgressView = styled.View`
  padding-top: 10px;
  margin: 20px 0;
`;

export const ScoreView = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-width: 1px;
  border-color: ${(props: any) => props.theme.colors.lightGray};
  border-radius: 10px;
  padding: 10px;
  width: 170px;
  margin-right: 15px;
`;

export const WrapCustomerReview = styled.View`
  padding: 20px 0;
  border-bottom-width: 1px;
  border-color: ${(props: any) => props.theme.colors.lightGray};
`;
export const WrapCustomerReviewTotal = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;

export const ProgressLabel = styled.View`
  flex-direction: row;
  justify-content: space-between;
`

export const DivideView = styled.View`
  height: 6px;
  background-color: ${(props: any) => props.theme.colors.backgroundGray100};
`;

export const ReviewItemContainer = styled.View`
  border-width: 1px;
  border-color: ${({ theme }: any) => theme.colors.border};
  margin-bottom: 10px;
  padding: 10px;
  border-radius: ${({ theme }: any) => theme.utils.radius.l}px;
`

export const StarRatingContainer = styled.View`
  margin-top: 20px;
  flex-direction: row;
  justify-content: center;
  gap: 20px;
`
